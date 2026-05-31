'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function GuestManagementPage() {
    const [user, setUser] = useState<any>(null);
    const [booking, setBooking] = useState<any>(null);
    const [guests, setGuests] = useState<any[]>([]);
    const [rsvps, setRsvps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'rsvps'>('list');

    // Guest Form State
    const [isAdding, setIsAdding] = useState(false);
    const [newGuest, setNewGuest] = useState({
        full_name: '',
        phone: '',
        email: '',
        plus_one: false,
        table_assignment: '',
        dietary_notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setUser(user);

        // Get booking
        const { data: bookingData } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (bookingData) {
            setBooking(bookingData);

            // Get guests
            const { data: guestList } = await supabase
                .from('guests')
                .select('*')
                .eq('booking_id', bookingData.id)
                .order('created_at', { ascending: false });
            setGuests(guestList || []);

            // Get RSVPs
            const { data: invitations } = await supabase
                .from('invitations')
                .select('id')
                .eq('user_id', user.id);

            if (invitations && invitations.length > 0) {
                const invIds = invitations.map(i => i.id);
                const { data: rsvpList } = await supabase
                    .from('rsvps')
                    .select('*')
                    .in('invitation_id', invIds)
                    .order('created_at', { ascending: false });
                setRsvps(rsvpList || []);
            }
        }
        setLoading(false);
    };

    const handleAddGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking) return;

        const { data, error } = await supabase.from('guests').insert([
            {
                booking_id: booking.id,
                ...newGuest
            }
        ]).select();

        if (!error && data) {
            setGuests([data[0], ...guests]);
            setIsAdding(false);
            setNewGuest({ full_name: '', phone: '', email: '', plus_one: false, table_assignment: '', dietary_notes: '' });
        } else {
            alert("Error adding guest: " + error?.message);
        }
    };

    const handleDeleteGuest = async (id: string) => {
        const { error } = await supabase.from('guests').delete().eq('id', id);
        if (!error) {
            setGuests(guests.filter(g => g.id !== id));
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    const totalAttending = rsvps.reduce((acc, r) => r.attending ? acc + (r.guest_count || 1) : acc, 0);
    const totalDeclined = rsvps.filter(r => !r.attending).length;

    return (
        <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-on-primary-container">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline italic">Guest Concierge</h1>
                        <p className="text-on-surface-variant font-body mt-2">Manage your wedding guest list and track RSVPs in real-time.</p>
                    </div>

                    <div className="flex gap-4 bg-surface-container-low p-1 rounded-2xl border border-outline-variant/20 shadow-sm">
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            Guest List
                        </button>
                        <button
                            onClick={() => setActiveTab('rsvps')}
                            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'rsvps' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
                        >
                            RSVP Tracker
                        </button>
                    </div>
                </header>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Guests', value: guests.length, icon: 'group', color: 'bg-primary/10 text-primary' },
                        { label: 'Attending (RSVP)', value: totalAttending, icon: 'how_to_reg', color: 'bg-secondary/10 text-secondary' },
                        { label: 'Declined', value: totalDeclined, icon: 'person_remove', color: 'bg-outline/10 text-outline' },
                        { label: 'Pending', value: Math.max(0, guests.length - (rsvps.length)), icon: 'hourglass_empty', color: 'bg-primary-container/20 text-on-primary-container' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-sm flex items-center gap-5">
                            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'list' ? (
                        <motion.section
                            key="list"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold font-headline">Wedding Guest List</h2>
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:-translate-y-1 transition-all shadow-md"
                                >
                                    <span className="material-symbols-outlined text-sm">person_add</span>
                                    Add Guest
                                </button>
                            </div>

                            {/* Guest Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {guests.map((guest) => (
                                    <div key={guest.id} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center text-primary font-bold overflow-hidden">
                                                    {guest.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg">{guest.full_name}</h3>
                                                    <p className="text-xs text-on-surface-variant">{guest.phone || guest.email || "No contact info"}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteGuest(guest.id)}
                                                className="text-outline/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-symbols-outlined text-xl">delete</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/5">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Table</p>
                                                <p className="font-medium text-sm">{guest.table_assignment || "TBD"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Status</p>
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${guest.attending ? 'bg-secondary/10 text-secondary' : 'bg-primary-container/20 text-on-primary-container'}`}>
                                                    {guest.attending ? 'Attending' : 'Invited'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {guests.length === 0 && (
                                    <div className="col-span-full py-24 text-center bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant/20">
                                        <span className="material-symbols-outlined text-6xl text-outline/20 mb-4">person_search</span>
                                        <h3 className="text-xl font-bold text-on-surface-variant italic">No guests added yet</h3>
                                        <p className="text-sm text-outline">Start building your guest list to track attendance and table settings.</p>
                                    </div>
                                )}
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="rsvps"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-2xl font-bold font-headline mb-6">Digital RSVP Responses</h2>
                            <div className="bg-surface-container-low rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-surface-container-high">
                                        <tr className="text-[10px] font-bold uppercase tracking-widest text-outline">
                                            <th className="px-8 py-5">Guest Name</th>
                                            <th className="px-8 py-5">Attendance</th>
                                            <th className="px-8 py-5">Count</th>
                                            <th className="px-8 py-5">Notes</th>
                                            <th className="px-8 py-5">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-outline-variant/5">
                                        {rsvps.map((rsvp) => (
                                            <tr key={rsvp.id} className="hover:bg-surface-container transition-colors">
                                                <td className="px-8 py-5 font-bold">{rsvp.guest_name}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] ${rsvp.attending ? 'bg-secondary/10 text-secondary' : 'bg-outline/10 text-outline'}`}>
                                                        {rsvp.attending ? 'Accept' : 'Decline'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 font-medium">{rsvp.guest_count}</td>
                                                <td className="px-8 py-5 text-sm text-on-surface-variant max-w-xs truncate">{rsvp.dietary_notes || "—"}</td>
                                                <td className="px-8 py-5 italic text-sm text-primary">"{rsvp.message || "Best wishes!"}"</td>
                                            </tr>
                                        ))}
                                        {rsvps.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-24 text-center">
                                                    <p className="text-on-surface-variant font-bold italic">Waiting for your first response...</p>
                                                    <p className="text-xs text-outline mt-1">Make sure you share your invitation link!</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            {/* Add Guest Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                            onClick={() => setIsAdding(false)}
                        ></motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-surface-container-lowest w-full max-w-lg rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden relative z-10"
                        >
                            <header className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold font-headline">New Guest Entry</h3>
                                <button onClick={() => setIsAdding(false)} className="text-outline hover:text-on-surface transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </header>
                            <form onSubmit={handleAddGuest} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={newGuest.full_name}
                                            onChange={e => setNewGuest({ ...newGuest, full_name: e.target.value })}
                                            className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Phone</label>
                                            <input
                                                type="text"
                                                value={newGuest.phone}
                                                onChange={e => setNewGuest({ ...newGuest, phone: e.target.value })}
                                                className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Email</label>
                                            <input
                                                type="email"
                                                value={newGuest.email}
                                                onChange={e => setNewGuest({ ...newGuest, email: e.target.value })}
                                                className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-outline ml-1">Table Assignment</label>
                                        <input
                                            type="text"
                                            value={newGuest.table_assignment}
                                            onChange={e => setNewGuest({ ...newGuest, table_assignment: e.target.value })}
                                            placeholder="e.g. Table 12, Gold Room"
                                            className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold tracking-widest uppercase text-xs shadow-lg hover:-translate-y-1 transition-all">
                                    Add to Guest List
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .shadow-premium {
                    box-shadow: 0 32px 80px -16px rgba(115, 92, 0, 0.12);
                }
            `}</style>
        </div>
    );
}
