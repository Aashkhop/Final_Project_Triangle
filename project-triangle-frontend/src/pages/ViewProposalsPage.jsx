import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Send, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';

const ViewProposalsPage = () => {
    const { projectId } = useParams();
    const { user } = useUser();
    const [proposals, setProposals] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedProposal, setSelectedProposal] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageLoading, setMessageLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchProposals = async () => {
        try {
            // Do not set loading to true here to avoid entire page flashing on refetch
            const res = await axios.get(`/api/proposals/${projectId}`);
            setProposals(res.data.proposals);
            setProject(res.data.project);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load proposals.');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        setLoading(true); // Set initial loading state
        fetchProposals();

        const socketURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        socketRef.current = io(socketURL);

        socketRef.current.on('receive_message', (incomingMessage) => {
            setConversationId(currentId => {
                if (currentId && currentId === incomingMessage.conversation_id) {
                    setMessages(prevMessages => [...prevMessages, incomingMessage]);
                }
                return currentId;
            });
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [projectId]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const openChat = async (proposal) => {
        if (selectedProposal?.id === proposal.id) {
            setSelectedProposal(null);
            setConversationId(null);
            return;
        }

        setSelectedProposal(proposal);
        setMessageLoading(true);
        setMessages([]);

        try {
            const convRes = await axios.get(`/api/conversations/by-proposal/${proposal.id}`);
            const currentConversationId = convRes.data.conversationId;
            setConversationId(currentConversationId);
            socketRef.current.emit('join_room', `conversation-${currentConversationId}`);
            const messagesRes = await axios.get(`/api/messages/${currentConversationId}`);
            setMessages(messagesRes.data);
        } catch (err) {
            console.error("Failed to open chat", err);
            setError("Could not load this conversation.");
        } finally {
            setMessageLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;
        setNewMessage('');
        try {
            await axios.post(`/api/messages/${conversationId}`, { message_text: newMessage });
        } catch (err) {
            console.error("Could not send message:", err);
            alert(err.response?.data?.error || 'Could not send message.');
            setNewMessage(newMessage);
        }
    };

    // --- ✨ RESTORED: Proposal Action Functions ---
    const handleAccept = async (proposal) => {
        if (!window.confirm("You are about to accept this proposal and proceed to payment. Continue?")) return;

        try {
            const orderResponse = await axios.post('/api/payment/order', {
                amount: proposal.proposed_budget,
            });
            const { id: order_id, amount, currency } = orderResponse.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "ProjectTriangle",
                description: `Payment for proposal on "${project?.title}"`,
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await axios.put(`/api/proposals/${proposal.id}/accept`, {
                            razorpay_payment_id: response.razorpay_payment_id
                        });
                        alert('Payment successful and proposal accepted!');
                        fetchProposals();
                    } catch (verifyError) {
                        console.error("Post-Payment Error:", verifyError);
                        alert("Payment was successful, but failed to update proposal status.");
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: '#2dd4bf' }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Accept Error:", err);
            alert(err.response?.data?.error || 'Failed to initiate payment.');
        }
    };

    const handleReject = async (proposalId) => {
        if (!window.confirm("Are you sure you want to reject this proposal?")) return;
        try {
            await axios.put(`/api/proposals/${proposalId}/reject`);
            alert('Proposal rejected.');
            fetchProposals();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to reject proposal.');
        }
    };

    if (loading) return <div className="text-center text-white py-20">Loading...</div>;
    if (error && !selectedProposal) return <div className="text-center text-red-400 py-20">{error}</div>;

    const isClient = user?.id === project?.user_id;
    const displayedProposals = isClient ? proposals : proposals.filter(p => p.freelancer_id === user.id);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-emerald-400 mb-6">
                    {isClient ? `Proposals for ${project?.title}` : `My Proposal for ${project?.title}`}
                </h1>
                {displayedProposals.length > 0 ? (
                    <div className="space-y-6">
                        {displayedProposals.map(p => (
                            <div key={p.id} className={`bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all ${p.status !== 'pending' && selectedProposal?.id !== p.id ? 'opacity-60' : ''}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-100">{p.freelancer_name}</h3>
                                        <p className="text-sm text-gray-400">Submitted: {new Date(p.submitted_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-emerald-400">₹{p.proposed_budget}</p>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full mt-1 inline-block capitalize
                                            ${p.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                                                p.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                                    'bg-yellow-500/20 text-yellow-300'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-300 whitespace-pre-wrap">{p.cover_letter}</p>
                                {p.attachment_path && (
                                    <a href={p.attachment_path} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-400 hover:underline mt-4 inline-block">
                                        View Attachment
                                    </a>
                                )}
                                <div className="mt-4 pt-4 border-t border-gray-600 flex gap-4">
                                    {isClient && p.status === 'pending' && (
                                        <>
                                            <button onClick={() => handleAccept(p)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                                Accept & Pay
                                            </button>
                                            <button onClick={() => handleReject(p.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {/* --- ✨ THIS IS THE CORRECTED LOGIC --- */}
                                    {/* Only show the chat button if the proposal has been accepted */}
                                    {p.status === 'accepted' && (
                                        <button
                                            onClick={() => openChat(p)}
                                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                                        >
                                            <MessageSquare size={16} />
                                            {selectedProposal?.id === p.id ? "Close Chat" : "Chat"}
                                        </button>
                                    )}
                                </div>
                                {selectedProposal?.id === p.id && (
                                    <div className="mt-6 border-t border-gray-600 pt-4">
                                        <h4 className="text-lg font-semibold text-emerald-400 mb-4">Conversation with {isClient ? selectedProposal.freelancer_name : "the Client"}</h4>
                                        <div className="bg-gray-900/50 rounded-lg p-4 h-64 overflow-y-auto mb-4 flex flex-col space-y-4">
                                            {messageLoading ? <p className="text-center m-auto">Loading messages...</p> : messages.length > 0 ? (
                                                messages.map(msg => (
                                                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                                        <p className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user.id ? 'bg-emerald-800' : 'bg-gray-700'}`}>
                                                            {msg.message_text}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : <p className="text-gray-500 text-center m-auto">{error ? error : "No messages yet."}</p>}
                                            <div ref={messagesEndRef} />
                                        </div>
                                        <form onSubmit={handleSendMessage} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg p-2 focus:ring-1 focus:ring-emerald-500 outline-none"
                                            />
                                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-lg"><Send size={18} /></button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center bg-gray-800 p-8 rounded-lg">
                        {isClient ? "No proposals have been submitted for this project yet." : "You have not submitted a proposal for this project."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ViewProposalsPage;