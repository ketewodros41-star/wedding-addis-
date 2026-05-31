'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const INSPIRATION_DATA = [
    { id: 1, title: 'Highland Garden Venue', category: 'Venue', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU8qu48SGvqFBgUHSxNJSmHu5UOZMg3L4u948E5F6eKYdi0eOBKcAIreW8tpZLgkb186RCrAxfQ8Uw25e2AfkqkYd1-Mcw5dSHyR9WP5SifhHpy2pQ3J5yfgOUThPMIUkvXqs19hEJJF0QXh_IpnZD74ndBr4wdDilOht9tsR234bBsWd3ARtMyAtCSRR9CkM7QGIYfCsIVP-XUUK9fq0sGImwtw8f_8QRLHMXPsvVW4MJtOCW92xHysx13vkbWKa16ESbo_e8AkU' },
    { id: 2, title: 'Gold Leaf Tibeb Cake', category: 'Cakes', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBomuBSTL3XAIlmtAEoJiu_XhaLnq8rFiyl_tB4CWEEvNUpAS11zHnZs5uCtxrEIBtf4Ir4F8UqN58nb-vy5PCuWKfSYe0kdIYK6UoF0XCUAyIdBWdqK2LiDqCZpPQqvLa9etzQoYVU_wlor9M1WPtN3rmea7GkMUQXWUv1EpeJypOH3aFeKFyCG-6jz2v17lKhRvSAezYGc-fveYe5ctOlBT3v38kI8ubTMk3vTg9Q_VREZU3R6BachrCOCdZDIWPxv6gHs3XqfhU' },
    { id: 3, title: 'Traditional Embroidery', category: 'Style', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRyUC_ZOQllFh7FSiKKGUU4h4nYK29zumpCaNeE677yOXB4Pg8fuh7zQADzeTlHPTVMDjJnasJl3RFbj3ArChBplhGVnUrTHWZxQTzc5jtTrnnQuLrCXOBrQzDzLVu4MqjE6XF1X-w7GmjzVnFE32Kd9vmgYasgTopBV4ecI0N3jZ9pXFE1kbZ0qQ1MerZ9QHNBzFffHp7ALdW_ltY2N9dgK4zTGDrB_Q8g24Mqkcgg-yYnDgGydQKXEk7teX7voIVzSET9Yo6Dz0' },
    { id: 4, title: 'Rustic Elegance Decor', category: 'Decor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAgZK8WwevpTjJn1j0rTdbdUAq94XBWN6J_zKxLC6WrcpdnvL8Txq_JzTi3q-yA2NCfi6M35QckFJMI5LuE26hpdFVLzkk0xWxE4QqN8gB1mtmLVSjEPRajzc_BLwjxc7tJah6fVnsKTbt2wJfXQ17gqMLtIR-GiBgnA3em9z3fC9D9PF5reuZFWfnaE-k-c2trBDMINujszQ2MupG0JSs8tenrYJIBkgAZRn4wetEgTXvncr5XxwSm5s5HWmlqHh4oCU9GFmK3Xg' },
    { id: 5, title: 'Heritage Bridal Look', category: 'Style', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH0uAJHlHtK-xKunqutYFOM9Rud-zys-9vX4ZL1ajZsfI1yF-qoDY0BxSmPLeq9orNprOtjuDD-b0ASADx1g5iGrvvZl9Tb30ytVfjILsJ5vAhcw4ZZnwyO_AtCmY_LDGnf9J2oCwVDuaCRupRsyxjkjJL2LvBtHKpr8ca9_zDkZqVYduhVv-QQ8pwQpYT8l6C7R3ct49EVYIYkesxCw_bqtHD3EQJELcRVtkgGNShwwEcq4jdps4kHd5rAKwXXeTi4M2S-6FYyEA' },
    { id: 6, title: 'Luxe Reception Details', category: 'Decor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB701FC1EMbgQW7eLLqG9ox64xRLJzfxpmFGxlQNfkjE1B0y9alJHIF3nirKw9Sl-wGYx05-bq4y7sWNTpvFGxQ4g35we3Y73p_qlYorNSHbS23oNmGnWNlWWNbLptyJSr1GMgu9tXImj5PXmfgGz7E-TykSAKYPnQKqqQPypkaB385HoB9r277U9NJDgTTZ5mo8TqpbI4w256F-zlZ1H37DLx4J0TN44Dlfx4ysE5L3Igfmo1A8wyNtA2n7Mz367JypGJvgq3tuVk' },
    { id: 7, title: 'Addis Skyline Hotel Wedding', category: 'Venue', image: '/inspiration/addis_hotel_venue_1774550342819.png' },
    { id: 8, title: 'Golden Tibeb Motif Cake', category: 'Cakes', image: '/inspiration/ethiopian_wedding_cake_1774550417649.png' },
    { id: 9, title: 'Traditional White & Gold Decor', category: 'Decor', image: '/inspiration/ethiopian_wedding_decor_1774550475448.png' },
    { id: 10, title: 'Heritage Catering Setup', category: 'Catering', image: '/inspiration/ethiopian_catering_1774550565302.png' }
];

type BoardItem = {
    id: number;
    title: string;
    category: string;
    image: string;
};

type BoardUser = {
    id: string;
    email: string | null;
    user_metadata?: {
        full_name?: string;
    };
};

type BookingSummary = {
    id: string;
    event_date: string;
    budget_range: string | null;
};

const getErrorMessage = (error: unknown) => error instanceof Error ? error.message : 'Something went wrong.';

const ensureProfileExists = async (currentUser: BoardUser) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .maybeSingle();

    if (profile) return;

    const { error } = await supabase.from('profiles').upsert([
        {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'Wedding Addis member',
        },
    ]);

    if (error) throw error;
};

export default function InspirationBoard() {
    const [user, setUser] = useState<BoardUser | null>(null);
    const [boardId, setBoardId] = useState<string | null>(null);
    const [booking, setBooking] = useState<BookingSummary | null>(null);
    const [savedItems, setSavedItems] = useState<BoardItem[]>([]);
    const [saving, setSaving] = useState(false);
    const [loadingBoard, setLoadingBoard] = useState(true);
    const [boardError, setBoardError] = useState<string | null>(null);
    const [filter, setFilter] = useState('All');
    const [favourites, setFavourites] = useState<number[]>([]);
    const [plannerModalOpen, setPlannerModalOpen] = useState(false);
    const [plannerNotes, setPlannerNotes] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadBoard = async (currentUser: BoardUser | null) => {
            setLoadingBoard(true);
            setBoardError(null);

            if (!currentUser) {
                if (isActive) {
                    setUser(null);
                    setBoardId(null);
                    setBooking(null);
                    setSavedItems([]);
                    setFavourites([]);
                    setLoadingBoard(false);
                }
                return;
            }

            if (!isActive) return;

            setUser(currentUser);

            await ensureProfileExists(currentUser);

            if (!isActive) return;

            const { data, error } = await supabase
                .from('inspiration_boards')
                .select('id, items')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!isActive) return;

            if (error) {
                setBoardError(error.message);
            } else if (data) {
                setBoardId(data.id);
                setSavedItems(Array.isArray(data.items) ? data.items : []);
            } else {
                const { data: newBoard, error: createError } = await supabase
                    .from('inspiration_boards')
                    .upsert([{ user_id: currentUser.id, items: [] }], { onConflict: 'user_id' })
                    .select('id, items')
                    .maybeSingle();

                if (!isActive) return;

                if (createError) {
                    setBoardError(createError.message);
                } else if (newBoard) {
                    setBoardId(newBoard.id);
                    setSavedItems(Array.isArray(newBoard.items) ? newBoard.items : []);
                }
            }

            const { data: bookingData } = await supabase
                .from('bookings')
                .select('id, event_date, budget_range')
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!isActive) return;

            if (bookingData) {
                setBooking(bookingData);
            }

            const savedFavs = localStorage.getItem(`favs_${currentUser.id}`);
            setFavourites(savedFavs ? JSON.parse(savedFavs) : []);
            setLoadingBoard(false);
        };

        supabase.auth.getUser().then(({ data: { user } }) => {
            void loadBoard(user as any);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            void loadBoard((session?.user as any) ?? null);
        });

        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
    }, []);

    const persistBoardItems = async (items: BoardItem[]) => {
        if (!user) {
            throw new Error('Please log in to save to your board');
        }

        let activeBoardId = boardId;

        if (!activeBoardId) {
            const { data: existingBoard, error: lookupError } = await supabase
                .from('inspiration_boards')
                .select('id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (lookupError) throw lookupError;

            if (existingBoard) {
                activeBoardId = existingBoard.id;
                setBoardId(existingBoard.id);
            }
        }

        if (!activeBoardId) {
            const { data: createdBoard, error: createError } = await supabase
                .from('inspiration_boards')
                .upsert([{ user_id: user.id, items }], { onConflict: 'user_id' })
                .select('id, items')
                .maybeSingle();

            if (createError) throw createError;

            if (createdBoard) {
                setBoardId(createdBoard.id);
                return;
            }

            throw new Error('Unable to create inspiration board.');
        }

        const { error } = await supabase
            .from('inspiration_boards')
            .update({ items })
            .eq('id', activeBoardId);

        if (error) throw error;
    };

    const handleSaveItem = async (item: BoardItem) => {
        if (!user) { alert('Please log in to save to your board'); return; }
        if (savedItems.find(i => i.id === item.id)) return;

        const newItems = [...savedItems, item];
        setSavedItems(newItems);
        setSaving(true);
        setBoardError(null);

        try {
            await persistBoardItems(newItems);
        } catch (error: unknown) {
            setSavedItems(savedItems);
            const message = getErrorMessage(error);
            setBoardError(message || 'Unable to save this item right now.');
            alert(message || 'Unable to save this item right now.');
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        const newItems = savedItems.filter(i => i.id !== itemId);
        setSavedItems(newItems);
        setSaving(true);
        setBoardError(null);

        try {
            await persistBoardItems(newItems);
        } catch (error: unknown) {
            setSavedItems(savedItems);
            const message = getErrorMessage(error);
            setBoardError(message || 'Unable to update your board right now.');
            alert(message || 'Unable to update your board right now.');
        } finally {
            setSaving(false);
        }
    };

    const handleSendToPlanner = async () => {
        if (!user) return alert("Please log in first.");
        if (savedItems.length === 0) return alert("Add some items to your board first.");
        setSending(true);
        await supabase.from('inspiration_requests').insert([{
            user_id: user.id,
            booking_id: booking?.id || null,
            board_items: savedItems,
            notes: plannerNotes,
            wedding_date: booking?.event_date || null,
            budget_range: booking?.budget_range || null,
        }]);
        setSending(false);
        setSent(true);
        setPlannerModalOpen(false);
    };

    const generateShareText = () => {
        let text = '✨ My Wedding Addis Vision Board\n';
        if (user?.email) {
            text += `Account: ${user.email}\n`;
        }
        text += '\n';
        savedItems.forEach(item => { text += `• ${item.title} (${item.category})\n`; });
        return text;
    };

    const openWhatsAppShare = () => {
        if (savedItems.length === 0) return alert('Add some items to your board first.');
        const text = encodeURIComponent(generateShareText());
        window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    const openGmailShare = () => {
        if (savedItems.length === 0) return alert('Add some items to your board first.');
        const subject = encodeURIComponent('My Wedding Addis Vision Board');
        const body = encodeURIComponent(generateShareText());
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
    };

    const categories = ['All', 'Favourites', 'Venue', 'Cakes', 'Decor', 'Style', 'Catering'];
    const filteredItems = filter === 'All' ? INSPIRATION_DATA
        : filter === 'Favourites' ? INSPIRATION_DATA.filter(i => favourites.includes(i.id))
            : INSPIRATION_DATA.filter(i => i.category === filter);

    return (
        <div className="bg-background text-on-surface font-body min-h-screen">
            <Header />
            <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row gap-8 pb-24">
                {/* Gallery */}
                <div className="flex-1">
                    <div className="mb-12">
                        <h1 className="font-headline font-bold text-5xl md:text-6xl tracking-tight italic mb-4">Inspiration Board</h1>
                        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                            Curate your dream wedding gallery. Click items to save to your vision board, then send directly to our planning team.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {categories.map(c => (
                            <button key={c} onClick={() => setFilter(c)}
                                className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${filter === c ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/5'}`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.length === 0 && filter === 'Favourites' ? (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-outline-variant rounded-3xl">
                                <span className="material-symbols-outlined text-6xl text-outline/20 block mb-4">heart_broken</span>
                                <p className="text-on-surface-variant italic">You haven&apos;t favourited anything yet.</p>
                                <button onClick={() => window.location.href = '/explore'} className="mt-4 text-primary font-bold">Go to Explore →</button>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div key={item.id} className="group relative overflow-hidden rounded-3xl bg-surface-container-low cursor-pointer aspect-square" onClick={() => handleSaveItem(item)}>
                                    <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                        <p className="text-white font-headline text-xl mb-2">{item.title}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="bg-primary/80 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category}</span>
                                            <span className="material-symbols-outlined text-white">add_circle</span>
                                        </div>
                                    </div>
                                    {savedItems.find(s => s.id === item.id) && (
                                        <div className="absolute top-4 right-4 bg-primary text-on-primary rounded-full p-1 shadow-lg">
                                            <span className="material-symbols-outlined text-sm">check</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Board */}
                <aside className="w-full md:w-80 lg:w-96 shrink-0">
                    <div className="md:sticky top-24 bg-surface-container-lowest/80 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_32px_80px_-16px_rgba(115,92,0,0.1)] border border-outline-variant/10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-headline text-2xl font-bold italic">My Vision Board</h2>
                            <span className="bg-primary text-on-primary text-[10px] font-bold px-3 py-1 rounded-full">{savedItems.length} Saved</span>
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 mb-8">
                            {savedItems.length === 0 ? (
                                <div className="aspect-square w-full rounded-2xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center text-on-surface-variant text-center p-8">
                                    <div>
                                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">imagesmode</span>
                                        <span className="text-sm">Click gallery items to add them here</span>
                                    </div>
                                </div>
                            ) : (
                                savedItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 group">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 relative">
                                            <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{item.title}</p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">{item.category}</p>
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-outline/40 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-lg">close</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {boardError && <p className="text-xs text-red-500 text-center mb-4">{boardError}</p>}
                        {(saving || loadingBoard) && <p className="text-xs text-primary text-center mb-4 italic">{loadingBoard ? 'Loading board...' : 'Saving...'}</p>}

                        {savedItems.length > 0 && (
                            <div className="space-y-3">
                                {sent ? (
                                    <div className="text-center py-4">
                                        <span className="material-symbols-outlined text-4xl text-secondary block mb-2">check_circle</span>
                                        <p className="font-bold italic text-secondary">Board sent to our planning team!</p>
                                        <p className="text-xs text-outline mt-1">We&apos;ll be in touch soon.</p>
                                    </div>
                                ) : (
                                    <button onClick={() => setPlannerModalOpen(true)} className="w-full py-4 bg-primary text-on-primary font-bold tracking-widest uppercase text-xs rounded-2xl hover:-translate-y-1 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">send</span>
                                        Send to Planning Team
                                    </button>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={openWhatsAppShare} className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 transition-all">WhatsApp</button>
                                    <button onClick={openGmailShare} className="w-full bg-surface-container-high border border-outline-variant py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-all">Gmail</button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </main>

            <Footer />

            {/* Send to Planner Modal */}
            <AnimatePresence>
                {plannerModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setPlannerModalOpen(false)}></motion.div>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface-container-lowest w-full max-w-lg rounded-3xl border border-outline-variant/10 shadow-2xl z-10 relative">
                            <header className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                                <h3 className="font-headline text-xl font-bold italic">Send Board to Planning Team</h3>
                                <button onClick={() => setPlannerModalOpen(false)} className="text-outline"><span className="material-symbols-outlined">close</span></button>
                            </header>
                            <div className="p-8 space-y-6">
                                <div className="bg-primary/5 rounded-2xl p-4">
                                    <p className="text-xs text-on-surface-variant">Sending <span className="font-bold text-primary">{savedItems.length} inspiration items</span> to our team. They will review your vision and reach out to discuss your wedding plan.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Additional Notes</label>
                                    <textarea rows={4} value={plannerNotes} onChange={e => setPlannerNotes(e.target.value)} placeholder="Any specific requests, preferences, or cultural traditions to note..." className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none resize-none text-sm focus:ring-1 focus:ring-primary"></textarea>
                                </div>
                                <button disabled={sending} onClick={handleSendToPlanner} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:-translate-y-1 transition-all disabled:opacity-50 shadow-lg">
                                    {sending ? 'Sending...' : 'Confirm & Send My Vision'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
