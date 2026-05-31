'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalBookings: 0,
        pendingInquiries: 0,
        newRequests: 0,
        verifiedVendors: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [
                { count: bookings },
                { count: inquiries },
                { count: requests },
                { count: vendors }
            ] = await Promise.all([
                supabase.from('bookings').select('*', { count: 'exact', head: true }),
                supabase.from('vendor_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('inspiration_requests').select('*', { count: 'exact', head: true }).eq('status', 'new'),
                supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('is_verified', true)
            ]);

            setStats({
                totalBookings: bookings || 0,
                pendingInquiries: inquiries || 0,
                newRequests: requests || 0,
                verifiedVendors: vendors || 0
            });
            setLoading(false);
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: 'event', color: 'bg-primary/10 text-primary' },
        { label: 'Pending Inquiries', value: stats.pendingInquiries, icon: 'mail', color: 'bg-secondary/10 text-secondary' },
        { label: 'New Requests', value: stats.newRequests, icon: 'auto_fix_high', color: 'bg-amber-100 text-amber-700' },
        { label: 'Verified Vendors', value: stats.verifiedVendors, icon: 'verified', color: 'bg-emerald-100 text-emerald-700' },
    ];

    return (
        <div className="space-y-12">
            <header>
                <h1 className="font-headline text-4xl font-bold italic text-on-surface">Overview</h1>
                <p className="text-on-surface-variant max-w-lg mt-2">Welcome back to the Wedding Addis Command Center. Here is your current operational status.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm flex flex-col justify-between"
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${card.color}`}>
                            <span className="material-symbols-outlined">{card.icon}</span>
                        </div>
                        <div>
                            <p className="text-4xl font-bold font-headline italic mb-1">{loading ? '...' : card.value}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{card.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm space-y-6">
                    <h3 className="font-headline text-2xl font-bold italic">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-stone-50 rounded-2xl transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-stone-100/50 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-stone-400 text-sm">history</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold">New Booking Request</p>
                                    <p className="text-xs text-stone-400">Abebe & Helina · 2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-stone-100 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-primary">analytics</span>
                    </div>
                    <h3 className="font-headline text-2xl font-bold italic">Deep Insights</h3>
                    <p className="text-sm text-stone-400 max-w-xs">Detailed analytics on seasonal trends and vendor performance are coming soon to your console.</p>
                </div>
            </div>
        </div>
    );
}
