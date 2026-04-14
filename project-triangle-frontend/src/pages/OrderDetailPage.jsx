import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { Send, MessageSquare } from 'lucide-react';
import { io } from 'socket.io-client';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { user } = useUser();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState('');

    const [showChat, setShowChat] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [messageLoading, setMessageLoading] = useState(false);
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/orders/${orderId}`);
            setOrder(res.data);
            if (res.data.delivery_details) {
                setDeliveryInfo(res.data.delivery_details);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to load order.');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        fetchOrder();

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
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [orderId]);

    const openChat = async () => {
        setShowChat(prev => !prev);
        if (showChat || conversationId) return;

        setMessageLoading(true);
        try {
            const convRes = await axios.get(`/api/conversations/by-order/${orderId}`);
            const currentConversationId = convRes.data.conversationId;
            setConversationId(currentConversationId);
            
            if (socketRef.current) {
                socketRef.current.emit('join_room', `conversation-${currentConversationId}`);
            }

            const messagesRes = await axios.get(`/api/messages/${currentConversationId}`);
            setMessages(messagesRes.data);
        } catch (err) {
            console.error("Failed to open chat", err);
            setError("Could not load this conversation. The chat may have expired.");
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

    const handleDeliverProject = async () => {
        if (!deliveryInfo.trim()) {
            alert('Please provide delivery details for the buyer.');
            return;
        }
        setActionLoading(true);
        try {
            await axios.put(`/api/orders/${orderId}/deliver`, {
                delivery_details: deliveryInfo,
            });
            alert('Project marked as delivered!');
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to mark as delivered.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirmDelivery = async () => {
        if (!window.confirm("Are you sure you have received all project files and want to complete this order? This action cannot be undone.")) {
            return;
        }
        setActionLoading(true);
        try {
            await axios.put(`/api/orders/${orderId}/complete`);
            alert('Delivery confirmed! Thank you.');
            fetchOrder();
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to confirm delivery.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <div className="text-center text-white py-20">Loading Order Details...</div>;
    if (error && !showChat) return <div className="text-center text-red-400 py-20">{error}</div>;
    if (!order) return null;

    const isSeller = user?.id === order.seller_id;
    const isBuyer = user?.id === order.buyer_id;

    const getStatusColor = (status) => {
         switch (status) {
            case 'Pending Delivery': return 'text-yellow-400';
            case 'Delivered': return 'text-blue-400';
            case 'Completed': return 'text-green-400';
            default: return 'text-gray-400';
        }
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="text-sm text-emerald-400 hover:underline mb-4">← Back to Dashboard</button>
                <h1 className="text-3xl font-bold text-emerald-400 mb-2">Order Details</h1>
                <p className="text-gray-400 mb-6">Order ID: {order.id}</p>

                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                    <h2 className="text-2xl font-semibold">{order.project_title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                        <p><strong>Buyer:</strong> {order.buyer_name}</p>
                        <p><strong>Seller:</strong> {order.seller_name}</p>
                        <p><strong>Amount:</strong> ₹{order.amount}</p>
                        <p><strong>Status:</strong> <span className={`font-semibold ${getStatusColor(order.order_status)}`}>{order.order_status}</span></p>
                    </div>
                </div>

                <div className="mt-8">
                     <button 
                        onClick={openChat}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                        <MessageSquare size={18} /> 
                        {showChat ? "Close Chat" : `Chat with ${isBuyer ? order.seller_name : order.buyer_name}`}
                    </button>
                </div>
                
                {showChat && (
                    <div className="mt-6 border-t border-gray-600 pt-6">
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4 text-emerald-400">Conversation</h3>
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
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-lg"><Send size={18}/></button>
                            </form>
                        </div>
                    </div>
                )}

                {isSeller && (
                    <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4">Deliver Project Files</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Provide the delivery information for the buyer (e.g., a private GitHub repository link, a Google Drive link, etc.). The buyer will be notified once you submit.
                        </p>
                        <textarea
                            value={deliveryInfo}
                            onChange={(e) => setDeliveryInfo(e.target.value)}
                            placeholder="e.g., Please find the project files at: https://github.com/your-repo/private-project-invite"
                            className="w-full h-32 p-3 bg-gray-900 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            disabled={actionLoading || order.order_status !== 'Pending Delivery'}
                        />
                        <button
                            onClick={handleDeliverProject}
                            disabled={actionLoading || order.order_status !== 'Pending Delivery'}
                            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {actionLoading ? 'Submitting...' : 'Mark as Delivered'}
                        </button>
                    </div>
                )}

                {isBuyer && (
                       <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl font-semibold mb-4">Project Delivery</h3>
                            {order.order_status === 'Pending Delivery' && <p className="text-gray-400">The seller has been notified and will deliver your project files here soon.</p>}

                            {(order.order_status === 'Delivered' || order.order_status === 'Completed') && (
                                <div>
                                    <p className="text-gray-400 mb-2">The seller has provided the following delivery information:</p>
                                    <div className="bg-gray-900 p-4 rounded-md">
                                        <p className="text-gray-200 whitespace-pre-wrap">{order.delivery_details}</p>
                                    </div>
                                    {order.order_status === 'Delivered' && (
                                        <button
                                            onClick={handleConfirmDelivery}
                                            disabled={actionLoading}
                                            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:bg-gray-600 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? 'Confirming...' : 'I have received the files & Confirm Delivery'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {order.order_status === 'Completed' && <p className="text-green-400 mt-4 font-semibold">This order was completed on {new Date(order.completed_at).toLocaleDateString()}.</p>}
                           </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetailPage;