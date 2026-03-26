'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import WeddingStories from '@/components/home/WeddingStories';

export default function UserDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [inspirationItems, setInspirationItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);

                // Fetch profile
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                if (profileData) setProfile(profileData);

                // Fetch bookings
                const { data: bookingsData } = await supabase.from('bookings').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
                if (bookingsData) setBookings(bookingsData);

                // Fetch inspiration boards
                const { data: boardData } = await supabase.from('inspiration_boards').select('*').eq('user_id', user.id).single();
                if (boardData && boardData.items) {
                    setInspirationItems(boardData.items);
                }
            } else {
                window.location.href = '/login';
            }
        };
        fetchDashboardData();
    }, []);

    if (!user) return <div className="min-h-screen flex items-center justify-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="flex flex-col min-h-screen relative bg-background text-on-surface">
            <Header />

            <main className="flex-1 px-6 md:px-12 py-10 overflow-x-hidden max-w-screen-2xl mx-auto w-full">
                <WeddingStories />
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="font-headline font-bold text-4xl tracking-tight text-on-surface mb-2">
                            Welcome Back, {profile?.name?.split(' ')[0] || user.email.split('@')[0]}
                        </h1>
                        <p className="font-body text-outline max-w-md">Your wedding journey is unfolding beautifully. Here is an overview of your progress for the big day.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.href = '/booking'}
                            className="px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-semibold shadow-xl shadow-primary/10 hover:opacity-90 transition-all scale-100 active:scale-95">
                            Start Planning
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inspiration Board Summary */}
                    <section className="lg:col-span-8 bg-surface-container-lowest rounded-lg p-8 shadow-[0_8px_48px_-12px_rgba(28,28,25,0.04)] border border-outline-variant/5">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-headline text-2xl font-bold">My Wedding Vision</h3>
                            <a href="/inspiration" className="text-xs font-bold uppercase tracking-widest text-primary border-b border-primary/20 pb-1">Edit Board</a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {inspirationItems.slice(0, 3).map((item: any, i) => (
                                <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden relative group">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 to-transparent"></div>
                                    <span className="absolute bottom-3 left-3 text-[10px] text-white font-bold tracking-widest uppercase">{item.category}</span>
                                </div>
                            ))}

                            {inspirationItems.length === 0 && (
                                <div className="col-span-full text-center p-8 bg-surface-container-low rounded-xl">
                                    <p className="text-on-surface-variant font-medium">Your vision board is empty.</p>
                                    <a href="/inspiration" className="text-primary font-bold mt-2 inline-block">Explore Inspiration</a>
                                </div>
                            )}

                            {inspirationItems.length > 0 && Array.from({ length: Math.max(0, 3 - inspirationItems.length) }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-[4/5] rounded-xl overflow-hidden bg-surface-container text-on-surface-variant flex items-center justify-center">
                                    <span className="material-symbols-outlined opacity-30">image</span>
                                </div>
                            ))}

                            <a href="/inspiration" className="aspect-[4/5] rounded-xl overflow-hidden border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors cursor-pointer">
                                <span className="material-symbols-outlined text-outline">add_circle</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Add More</span>
                            </a>
                        </div>
                    </section>

                    {/* Profile Summary */}
                    <section className="lg:col-span-4 bg-surface-container-high rounded-lg p-8 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        </div>
                        <div className="relative mb-6">
                            <div className="w-24 h-24 rounded-full border-4 border-primary-container p-1 shadow-lg shadow-primary/10">
                                <img src={user?.user_metadata?.avatar_url || "https://ui-avatars.com/api/?name=" + (profile?.name || user.email) + "&background=d4af37&color=fff"} alt="Profile" className="w-full h-full object-cover rounded-full" />
                            </div>
                        </div>
                        <h4 className="font-headline font-bold text-xl mb-1">{profile?.name || user.email}</h4>
                        <p className="text-sm text-outline mb-6">Joined: {new Date(user.created_at).toLocaleDateString()}</p>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-outline mb-1">
                                <span>Planning Progress</span>
                                <span>{bookings.length > 0 ? '50%' : '10%'}</span>
                            </div>
                            <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-1/2" style={{ width: bookings.length > 0 ? '50%' : '10%' }}></div>
                            </div>
                        </div>
                    </section>

                    {/* Upcoming Bookings */}
                    <section className="lg:col-span-8 bg-surface-container-low rounded-lg p-8 border border-outline-variant/5">
                        <h3 className="font-headline text-2xl font-bold mb-8">Upcoming Bookings</h3>
                        <div className="space-y-6">
                            {bookings.length === 0 ? (
                                <p className="text-on-surface-variant text-center py-6">No active bookings found. Start planning to see them here.</p>
                            ) : (
                                bookings.map((booking: any) => (
                                    <div key={booking.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-surface-container-lowest rounded-2xl shadow-sm gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-primary flex-shrink-0">
                                                <span className="material-symbols-outlined">{booking.location.toLowerCase().includes('venue') || booking.location.toLowerCase().includes('hotel') ? 'location_on' : 'event'}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{booking.location}</p>
                                                <p className="text-xs text-outline">{new Date(booking.event_date).toLocaleDateString()} • {booking.guest_count} Guests</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${booking.status === 'confirmed' ? 'bg-secondary-container text-on-secondary-fixed-variant' : 'bg-surface-variant text-outline'}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Invitation Drafts Summary */}
                    <section className="lg:col-span-4 bg-surface-container-lowest rounded-lg p-8 shadow-sm border border-outline-variant/5 flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="font-headline text-2xl font-bold">Invitations</h3>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-8 border-2 border-dashed border-outline-variant/30 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => window.location.href = '/invitations'}>
                            <span className="material-symbols-outlined text-4xl text-outline mb-2">drafts</span>
                            <p className="font-bold text-on-surface">Design Invitations</p>
                            <p className="text-xs text-on-surface-variant mt-1">Create QR code invites</p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
