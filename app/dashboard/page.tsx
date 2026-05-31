'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import WeddingStories from '@/components/home/WeddingStories';
import { motion } from 'framer-motion';

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [booking, setBooking] = useState<any>(null);
    const [stats, setStats] = useState({
        taskProgress: 0,
        completedTasks: 0,
        totalTasks: 0,
        attendingCount: 0,
        guestCount: 0,
        daysToWedding: 0
    });
    const [inspirationItems, setInspirationItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);

                // 1. Profile
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profileData) setProfile(profileData);

                // 2. Booking (latest)
                const { data: bookingData } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (bookingData) {
                    setBooking(bookingData);

                    // Calculate Countdown
                    const target = new Date(bookingData.event_date);
                    const diff = target.getTime() - new Date().getTime();
                    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

                    // 3. Planner Stats
                    const { data: tasks } = await supabase.from('planner_tasks').select('status').eq('booking_id', bookingData.id);
                    const total = tasks?.length || 0;
                    const completed = tasks?.filter(t => t.status === 'completed').length || 0;

                    // 4. Guest & RSVP Stats
                    const { data: guests } = await supabase.from('guests').select('id').eq('booking_id', bookingData.id);
                    const { data: invites } = await supabase.from('invitations').select('id').eq('user_id', user.id);
                    let attending = 0;
                    if (invites && invites.length > 0) {
                        const { data: rsvps } = await supabase.from('rsvps').select('guest_count').in('invitation_id', invites.map(i => i.id)).eq('attending', true);
                        attending = rsvps?.reduce((acc, curr) => acc + (curr.guest_count || 1), 0) || 0;
                    }

                    setStats({
                        taskProgress: total > 0 ? Math.round((completed / total) * 100) : 0,
                        completedTasks: completed,
                        totalTasks: total,
                        attendingCount: attending,
                        guestCount: guests?.length || 0,
                        daysToWedding: days > 0 ? days : 0
                    });

                    // 5. Inspiration
                    const { data: boardData } = await supabase.from('inspiration_boards').select('*').eq('user_id', user.id).single();
                    if (boardData && boardData.items) {
                        setInspirationItems(boardData.items);
                    }
                }
            } else {
                window.location.href = '/login';
            }
        };
        fetchDashboardData();
    }, []);

    if (!user) return <div className="min-h-screen flex items-center justify-center p-8 bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    const userName = profile?.full_name?.split(' ')[0] || user.email.split('@')[0];

    return (
        <div className="flex flex-col min-h-screen bg-background text-on-surface font-body">
            <Header />

            <main className="flex-1 px-6 md:px-12 py-10 max-w-screen-2xl mx-auto w-full">
                <WeddingStories />

                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <h1 className="font-headline font-bold text-5xl tracking-tight text-on-surface italic">
                            Peace be with you, {userName}
                        </h1>
                        <p className="text-on-surface-variant max-w-xl text-lg">Your legacy is unfolding beautifully. Here is the pulse of your wedding preparations.</p>
                    </div>
                    {booking ? (
                        <div className="flex items-center gap-6 bg-surface-container-low px-8 py-4 rounded-3xl border border-outline-variant/10 shadow-sm">
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Countdown</p>
                                <p className="text-3xl font-bold font-headline italic text-primary">{stats.daysToWedding} <span className="text-xs not-italic font-bold">Days</span></p>
                            </div>
                            <div className="w-px h-10 bg-outline-variant/20"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">RSVPs</p>
                                <p className="text-3xl font-bold font-headline italic text-secondary">{stats.attendingCount} <span className="text-xs not-italic font-bold">Guests</span></p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => window.location.href = '/booking'}
                            className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all">
                            Begin Planning Journey
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Planner Snapshot */}
                    <section className="lg:col-span-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Progress Ring Card */}
                            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-premium flex flex-col items-center text-center">
                                <h3 className="font-headline text-xl font-bold mb-6">Planning Progress</h3>
                                <div className="relative w-40 h-40 mb-6">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-outline-variant/20" />
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * stats.taskProgress) / 100}
                                            className="text-primary transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-4xl font-bold font-headline italic">{stats.taskProgress}%</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Complete</span>
                                    </div>
                                </div>
                                <p className="text-sm text-on-surface-variant mb-6">{stats.completedTasks} of {stats.totalTasks} milestones achieved</p>
                                <button onClick={() => window.location.href = '/planner'} className="w-full py-3 bg-surface-container-high rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">View Planner</button>
                            </div>

                            {/* Guest List Card */}
                            <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-premium">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="font-headline text-xl font-bold">Guest Concierge</h3>
                                    <span className="material-symbols-outlined text-outline">groups</span>
                                </div>
                                <div className="space-y-6 mb-8">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Added Guests</p>
                                            <p className="text-2xl font-bold">{stats.guestCount}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Confirmed</p>
                                            <p className="text-2xl font-bold text-secondary">{stats.attendingCount}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                        <div className="h-full bg-secondary rounded-full" style={{ width: stats.guestCount > 0 ? `${(stats.attendingCount / stats.guestCount) * 100}%` : '0%' }}></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <button onClick={() => window.location.href = '/guests'} className="w-full py-3 bg-primary/5 text-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/10 transition-all">Manage Guest List</button>
                                    <button onClick={() => window.location.href = '/invitations'} className="w-full py-3 bg-surface-container-high rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary/5 hover:text-primary transition-all">Digital Invitations</button>
                                </div>
                            </div>
                        </div>

                        {/* Inspiration Board Snapshot */}
                        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-premium">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-headline text-xl font-bold italic">Heritage Vision Board</h3>
                                <button onClick={() => window.location.href = '/inspiration'} className="text-[10px] font-bold uppercase tracking-widest text-primary">Explorer All</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {inspirationItems.slice(0, 4).map((item: any, i) => (
                                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="absolute bottom-2 left-2 text-[8px] text-white font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100">{item.category}</span>
                                    </div>
                                ))}
                                {inspirationItems.length === 0 && (
                                    <div className="col-span-full py-12 text-center bg-surface-container-low rounded-2xl border-2 border-dashed border-outline-variant/20 cursor-pointer" onClick={() => window.location.href = '/inspiration'}>
                                        <span className="material-symbols-outlined text-4xl text-outline mb-2">auto_fix_high</span>
                                        <p className="font-bold text-on-surface-variant italic">Paint your wedding vision</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Sidebar: Profile & Venue Summary */}
                    <aside className="lg:col-span-4 space-y-8">
                        {/* Profile Hero */}
                        <div className="bg-surface-container-high rounded-3xl p-8 relative overflow-hidden text-center flex flex-col items-center">
                            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none rotate-12">
                                <span className="material-symbols-outlined text-[100px]">verified</span>
                            </div>
                            <div className="w-24 h-24 rounded-full border-4 border-white p-1 shadow-xl mb-6 relative z-10">
                                <img src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + userName + "&background=735c00&color=fff"} className="w-full h-full object-cover rounded-full" />
                            </div>
                            <h4 className="font-headline font-bold text-2xl mb-1 italic">{userName}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-8 underline decoration-primary/20 underline-offset-4">Verified Member</p>

                            <div className="w-full space-y-4 text-left bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-white/40">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Partner</p>
                                    <p className="font-bold">{booking?.groom_name || "Assign Partner"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Celebration Venue</p>
                                    <p className="font-bold truncate">{booking?.location || "Not selected"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-premium">
                            <h3 className="font-headline text-lg font-bold mb-6 italic">Heritage Services</h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Vendor Marketplace', icon: 'storefront', color: 'text-primary' },
                                    { label: 'Cultural Concierge', icon: 'self_improvement', color: 'text-secondary' },
                                    { label: 'Budget Tracker', icon: 'payments', color: 'text-outline' },
                                    { label: 'Timeline History', icon: 'history', color: 'text-outline' }
                                ].map((link, i) => (
                                    <button key={i} className="w-full flex items-center justify-between p-4 bg-surface-container-low rounded-2xl hover:bg-primary/5 group transition-all">
                                        <div className="flex items-center gap-3">
                                            <span className={`material-symbols-outlined ${link.color}`}>{link.icon}</span>
                                            <span className="font-bold text-sm">{link.label}</span>
                                        </div>
                                        <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">chevron_right</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />

            <style jsx global>{`
                .shadow-premium {
                    box-shadow: 0 32px 80px -16px rgba(115, 92, 0, 0.1);
                }
            `}</style>
        </div>
    );
}
