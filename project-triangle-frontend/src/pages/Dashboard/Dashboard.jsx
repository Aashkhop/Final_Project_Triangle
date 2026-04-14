import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Briefcase, ShoppingCart, Edit, DollarSign, PackageCheck, FileSignature } from "lucide-react";

const Dashboard = () => {
    const [content, setContent] = useState({ 
        marketplaceListings: [], 
        postedJobs: [],
        myPurchases: [],
        mySales: [],
        myProposals: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/dashboard/my-content');
                setContent(res.data);
            } catch (err) {
                console.error("Failed to fetch dashboard content", err);
                setError('Failed to load your content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending Delivery': return 'text-yellow-400 bg-yellow-900/50';
            case 'Delivered': return 'text-blue-400 bg-blue-900/50';
            case 'Completed': return 'text-green-400 bg-green-900/50';
            // Proposal statuses
            case 'pending': return 'text-yellow-400 bg-yellow-900/50';
            case 'accepted': return 'text-green-400 bg-green-900/50';
            case 'rejected': return 'text-red-400 bg-red-900/50';
            default: return 'text-gray-400 bg-gray-700';
        }
    };

    if (loading) {
        return <div className="text-center text-white py-20">Loading Dashboard...</div>;
    }

    if (error) {
        return <div className="text-center text-red-400 py-20">{error}</div>;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-emerald-400">My Dashboard</h1>
                </header>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <DollarSign className="h-6 w-6 text-emerald-400" />
                        My Sales
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.mySales?.length > 0 ? (
                            content.mySales.map(sale => (
                                <div key={`sale-${sale.id}`} className="bg-gray-800/70 border border-emerald-500/20 rounded-xl p-5 shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-100 truncate pr-4">{sale.project_title}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.order_status)}`}>
                                            {sale.order_status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Sold to: {sale.buyer_name}</p>
                                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-emerald-500 text-xl font-semibold">₹{sale.amount}</p>
                                        <Link to={`/orders/${sale.id}`} className="text-sm text-teal-400 hover:underline">
                                            Manage Delivery
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full bg-gray-800/70 p-6 rounded-lg border border-dashed border-gray-700">You have no sales yet.</p>
                        )}
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <PackageCheck className="h-6 w-6 text-emerald-400" />
                        My Purchases
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.myPurchases?.length > 0 ? (
                            content.myPurchases.map(purchase => (
                                 <div key={`purchase-${purchase.id}`} className="bg-gray-800/70 border border-emerald-500/20 rounded-xl p-5 shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-100 truncate pr-4">{purchase.project_title}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(purchase.order_status)}`}>
                                            {purchase.order_status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Purchased from: {purchase.seller_name}</p>
                                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-emerald-500 text-xl font-semibold">₹{purchase.amount}</p>
                                        <Link to={`/orders/${purchase.id}`} className="text-sm text-teal-400 hover:underline">
                                            View Delivery
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full bg-gray-800/70 p-6 rounded-lg border border-dashed border-gray-700">You have not purchased any projects.</p>
                        )}
                    </div>
                </section>
                
                <section>
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <ShoppingCart className="h-6 w-6 text-emerald-400" />
                        My Marketplace Listings
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.marketplaceListings?.length > 0 ? (
                            content.marketplaceListings.map(item => (
                                <div key={`listing-${item.id}`} className="bg-gray-800/70 border border-emerald-500/20 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-100 truncate">{item.title}</h3>
                                        <p className="text-emerald-500 text-xl font-semibold mt-1">₹{item.price}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                                         <p className="text-xs text-gray-400">
                                            Created: {new Date(item.created_at).toLocaleDateString()}
                                        </p>
                                        <Link to={`/listings/edit/${item.id}`} className="flex items-center gap-2 text-sm text-teal-400 hover:underline">
                                            <Edit className="h-4 w-4" /> Edit
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full bg-gray-800/70 p-6 rounded-lg border border-dashed border-gray-700">You have not listed any projects for sale.</p>
                        )}
                    </div>
                </section>

                <section className="mt-12">
                     <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-emerald-400" />
                        My Posted Jobs (for Freelancers)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.postedJobs?.length > 0 ? (
                            content.postedJobs.map(job => (
                                <div key={`job-${job.id}`} className="bg-gray-800/70 border border-emerald-500/20 rounded-xl p-5 shadow-lg flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-100 truncate">{job.title}</h3>
                                        <p className="text-gray-300">Budget: {job.budget}</p>
                                        <p className="text-sm font-semibold text-emerald-400 mt-2">{job.proposal_count} Proposal(s) Received</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                                        <p className="text-xs text-gray-400">
                                            Deadline: {new Date(job.deadline).toLocaleDateString()}
                                        </p>
                                        <Link to={`/jobs/${job.id}/proposals`} className="text-sm text-teal-400 hover:underline">
                                            View Proposals
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full bg-gray-800/70 p-6 rounded-lg border border-dashed border-gray-700">You have not posted any jobs for freelancers.</p>
                        )}
                    </div>
                </section>
                
                <section className="mt-12">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
                        <FileSignature className="h-6 w-6 text-emerald-400" />
                        My Sent Proposals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.myProposals?.length > 0 ? (
                            content.myProposals.map(proposal => (
                                <div key={`proposal-${proposal.id}`} className="bg-gray-800/70 border border-emerald-500/20 rounded-xl p-5 shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-100 truncate pr-4">{proposal.project_title}</h3>
                                        <div className="flex flex-col items-end gap-y-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(proposal.status)}`}>
                                                {proposal.status}
                                            </span>
                                            {proposal.unread_messages > 0 && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white animate-pulse">
                                                    New Message
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">Your proposed budget: ₹{proposal.proposed_budget}</p>
                                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-700">
                                         <p className="text-xs text-gray-400">
                                            Sent: {new Date(proposal.submitted_at).toLocaleDateString()}
                                        </p>
                                        <Link to={`/jobs/${proposal.project_id}/proposals`} className="text-sm text-teal-400 hover:underline">
                                            View & Reply
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 col-span-full bg-gray-800/70 p-6 rounded-lg border border-dashed border-gray-700">You have not submitted any proposals.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
