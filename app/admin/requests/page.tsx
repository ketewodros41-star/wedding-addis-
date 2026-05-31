'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);

    const fetchRequests = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('inspiration_requests')
            .select('*, profiles(full_name, email)')
            .order('created_at', { ascending: false });
        setRequests(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('inspiration_requests').update({ status }).eq('id', id);
        if (!error) {
            fetchRequests();
            setSelectedRequest(null);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="font-headline text-4xl font-bold italic text-on-surface">Inspiration Requests</h1>
                    <p className="text-on-surface-variant mt-2 text-sm">Review wedding visions shared by couples for planning consultation.</p>
                </div>
                <button onClick={fetchRequests} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    Refresh
                </button>
            </header>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50/50 border-b border-stone-100">
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Couple</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Wedding Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Items</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold">{req.profiles?.full_name || req.profiles?.email}</p>
                                        <p className="text-xs text-stone-400">{req.profiles?.email}</p>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        {req.wedding_date ? new Date(req.wedding_date).toLocaleDateString() : 'TBD'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-full">
                                            {req.board_items?.length || 0} Selections
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${req.status === 'new' ? 'bg-amber-100 text-amber-700' :
                                                req.status === 'reviewed' ? 'bg-secondary/10 text-secondary' :
                                                    'bg-stone-100 text-stone-400'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => setSelectedRequest(req)}
                                            className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Review Vision
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-on-surface-variant italic">No new requests to show.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Request Detail Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border border-stone-100 shadow-2xl z-10 relative flex flex-col"
                        >
                            <header className="px-10 py-8 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Request Review</p>
                                    <h3 className="font-headline text-2xl font-bold italic">{selectedRequest.profiles?.full_name || selectedRequest.profiles?.email}'s Vision</h3>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="w-10 h-10 rounded-full hover:bg-white text-stone-400 border border-transparent hover:border-stone-100 transition-all">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </header>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                {/* Couple Details */}
                                <div className="grid grid-cols-3 gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Budget Range</p>
                                        <p className="font-bold text-lg capitalize">{selectedRequest.budget_range || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Wedding Date</p>
                                        <p className="font-bold text-lg">{selectedRequest.wedding_date || 'TBD'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Submitted On</p>
                                        <p className="font-bold text-lg">{new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedRequest.notes && (
                                    <div className="space-y-4">
                                        <h4 className="font-headline text-2xl italic font-bold">Couple's Notes</h4>
                                        <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 italic text-lg leading-relaxed text-stone-700">
                                            "{selectedRequest.notes}"
                                        </div>
                                    </div>
                                )}

                                {/* Vision Board Items */}
                                <div className="space-y-6">
                                    <h4 className="font-headline text-2xl italic font-bold">Selected Curation ({selectedRequest.board_items?.length})</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {selectedRequest.board_items?.map((item: any, i: number) => (
                                            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</p>
                                                    <p className="text-white font-bold text-xs truncate">{item.title}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <footer className="px-10 py-8 border-t border-stone-100 bg-stone-50/50 flex justify-between items-center gap-4">
                                <div className="flex gap-2">
                                    {selectedRequest.status === 'new' && (
                                        <button
                                            onClick={() => updateStatus(selectedRequest.id, 'reviewed')}
                                            className="px-6 py-3 bg-secondary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-secondary/20"
                                        >
                                            Mark as Reviewed
                                        </button>
                                    )}
                                    <button
                                        onClick={() => updateStatus(selectedRequest.id, 'archived')}
                                        className="px-6 py-3 bg-stone-200 text-stone-500 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-300 transition-all"
                                    >
                                        Archive
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => window.location.href = `mailto:${selectedRequest.profiles?.email}`} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                        Email Couple
                                    </button>
                                </div>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
