'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('bookings')
            .select('*, profiles(full_name, email)')
            .order('event_date', { ascending: true });
        setBookings(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="font-headline text-4xl font-bold italic text-on-surface">Bookings</h1>
                    <p className="text-on-surface-variant mt-2 text-sm">Monitor and manage all upcoming wedding events on the platform.</p>
                </div>
                <button onClick={fetchBookings} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all">
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
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Location</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Guests</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="font-bold">{booking.profiles?.full_name || booking.profiles?.email}</p>
                                        <p className="text-xs text-stone-400">{booking.profiles?.email}</p>
                                    </td>
                                    <td className="px-8 py-6 text-sm">
                                        {booking.event_date ? new Date(booking.event_date).toLocaleDateString() : 'TBD'}
                                    </td>
                                    <td className="px-8 py-6 text-sm text-stone-500">
                                        {booking.location || 'Addis Ababa'}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1 rounded-full">
                                            {booking.guest_count || 0} Guests
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-bold font-headline italic text-primary">
                                            {booking.budget ? `$${booking.budget.toLocaleString()}` : '$ TBD'}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-on-surface-variant italic">No bookings found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
