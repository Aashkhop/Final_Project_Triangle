import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- Helper Icons (No change) ---
const LockIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg> );
const CheckIcon = () => ( <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> );

const useAuth = () => ({
    user: {
        name: 'Nikhil Shinde',
        email: 'nikhil.shinde@example.com',
    }
});

// --- Main BuyNowPage Component ---
export default function BuyNowPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { project } = location.state || {};

    const paymentDetails = useMemo(() => {
        if (!project) return null;
        const subtotal = parseFloat(project.price);
        const platformFee = 50.00;
        const tax = subtotal * 0.18;
        const totalAmount = subtotal + platformFee + tax;
        return { subtotal, platformFee, tax, totalAmount };
    }, [project]);

    useEffect(() => {
        if (!project) {
            console.error("No project data found on mount. Redirecting...");
            navigate('/explore');
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [project, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const orderResponse = await axios.post('http://localhost:5000/api/payment/order', 
                {
                    amount: paymentDetails.totalAmount,
                    receipt: `receipt_project_${project.id}`, // ✅ Corrected: Added backticks
                },
                { withCredentials: true }
            );

            const { id: order_id, amount, currency } = orderResponse.data;

            const options = {
                key: 'rzp_test_ROZYfR70Jp9wZk', 
                amount: amount,
                currency: currency,
                name: 'ProjectTriangle',
                description: `Payment for ${project.title}`, // ✅ Corrected: Added backticks
                order_id: order_id,
                handler: async function (response) {
                    const verificationData = {
                        ...response,
                        project: project,
                    };
                    
                    try {
                        await axios.post('http://localhost:5000/api/payment/verify', verificationData, { withCredentials: true });
                        setIsModalOpen(true);
                    } catch (verifyError) {
                        console.error('Payment verification failed:', verifyError);
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: { color: '#2dd4bf' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Error creating order:', err);
            const errorMessage = err.response?.data?.error || 'Could not initiate payment. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    if (!project || !paymentDetails) {
        return <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-900 text-white font-sans antialiased">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl bg-[#0d1117] rounded-2xl shadow-lg flex flex-col lg:flex-row overflow-hidden">
                    {/* Left Side: Order Summary */}
                    <div className="w-full lg:w-1/2 p-8 bg-[#161b22]">
                        <h2 className="text-2xl font-bold text-teal-400 mb-6">Order Summary</h2>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
                            <img 
                                src={project.cover_image ? `http://localhost:5000/${project.cover_image}` : "https://placehold.co/80x80/0d1117/2dd4bf?text=Project"}  // ✅ Corrected: Added backticks
                                alt={project.title} 
                                className="w-20 h-20 rounded-md object-cover flex-shrink-0" 
                            />
                            <div>
                                <h3 className="font-semibold text-lg">{project.title}</h3>
                                <p className="text-gray-400 text-sm">Project Source Code & Documentation</p>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between text-gray-300"><span>Subtotal</span><span className="font-medium">₹{paymentDetails.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-300"><span>Platform Fee</span><span className="font-medium">₹{paymentDetails.platformFee.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-300"><span>Taxes (18% GST)</span><span className="font-medium">₹{paymentDetails.tax.toFixed(2)}</span></div>
                            <div className="border-t border-gray-700 my-4"></div>
                            <div className="flex justify-between text-white text-xl font-bold"><span>Total Amount</span><span>₹{paymentDetails.totalAmount.toFixed(2)}</span></div>
                        </div>
                        <div className="mt-8 text-center text-gray-400 text-sm flex items-center justify-center space-x-2"><LockIcon /><span>Secure SSL Encrypted Transaction</span></div>
                    </div>
                    {/* Right Side: Payment Trigger */}
                    <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
                        <p className="text-gray-400 text-center mb-8">Click the button below to proceed to our secure payment gateway powered by Razorpay.</p>
                        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
                        <button 
                            onClick={handlePayment} 
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg shadow-teal-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-teal-500 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {loading ? 'Processing...' : `Pay ₹${paymentDetails.totalAmount.toFixed(2)}`} {/* ✅ Corrected: Added backticks */}
                        </button>
                        <img src="https://razorpay.com/assets/razorpay-logo-white.svg" alt="Razorpay" className="h-8 mt-6 opacity-60"/>
                    </div>
                </div>
            </div>
            {/* Success Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#161b22] rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500 mb-4"><CheckIcon /></div>
                        <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                        <p className="text-gray-400 mt-2">Thank you for your purchase. Your project files are now available for download.</p>
                        <button onClick={() => navigate('/dashboard')} className="mt-6 w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">Go to Dashboard</button>
                    </div>
                </div>
            )}
        </div>
    );
}