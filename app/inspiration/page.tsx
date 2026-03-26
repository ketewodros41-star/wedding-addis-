'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

const INSPIRATION_DATA = [
    { id: 1, title: 'Highland Garden Venue', category: 'Venue', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU8qu48SGvqFBgUHSxNJSmHu5UOZMg3L4u948E5F6eKYdi0eOBKcAIreW8tpZLgkb186RCrAxfQ8Uw25e2AfkqkYd1-Mcw5dSHyR9WP5SifhHpy2pQ3J5yfgOUThPMIUkvXqs19hEJJF0QXh_IpnZD74ndBr4wdDilOht9tsR234bBsWd3ARtMyAtCSRR9CkM7QGIYfCsIVP-XUUK9fq0sGImwtw8f_8QRLHMXPsvVW4MJtOCW92xHysx13vkbWKa16ESbo_e8AkU' },
    { id: 2, title: 'Gold Leaf Tibeb Cake', category: 'Cakes', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBomuBSTL3XAIlmtAEoJiu_XhaLnq8rFiyl_tB4CWEEvNUpAS11zHnZs5uCtxrEIBtf4Ir4F8UqN58nb-vy5PCuWKfSYe0kdIYK6UoF0XCUAyIdBWdqK2LiDqCZpPQqvLa9etzQoYVU_wlor9M1WPtN3rmea7GkMUQXWUv1EpeJypOH3aFeKFyCG-6jz2v17lKhRvSAezYGc-fveYe5ctOlBT3v38kI8ubTMk3vTg9Q_VREZU3R6BachrCOCdZDIWPxv6gHs3XqfhU' },
    { id: 3, title: 'Traditional Embroidery', category: 'Style', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRyUC_ZOQllFh7FSiKKGUU4h4nYK29zumpCaNeE677yOXB4Pg8fuh7zQADzeTlHPTVMDjJnasJl3RFbj3ArChBplhGVnUrTHWZxQTzc5jtTrnnQuLrCXOBrQzDzLVu4MqjE6XF1X-w7GmjzVnFE32Kd9vmgYasgTopBV4ecI0N3jZ9pXFE1kbZ0qQ1MerZ9QHNBzFffHp7ALdW_ltY2N9dgK4zTGDrB_Q8g24Mqkcgg-yYnDgGydQKXEk7teX7voIVzSET9Yo6Dz0' },
    { id: 4, title: 'Rustic Elegance Decor', category: 'Decor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAgZK8WwevpTjJn1j0rTdbdUAq94XBWN6J_zKxLC6WrcpdnvL8Txq_JzTi3q-yA2NCfi6M35QckFJMI5LuE26hpdFVLzkk0xWxE4QqN8gB1mtmLVSjEPRajzc_BLwjxc7tJah6fVnsKTbt2wJfXQ17gqMLtIR-GiBgnA3em9z3fC9D9PF5reuZFWfnaE-k-c2trBDMINujszQ2MupG0JSs8tenrYJIBkgAZRn4wetEgTXvncr5XxwSm5s5HWmlqHh4oCU9GFmK3Xg' },
    { id: 5, title: 'Heritage Bridal Look', category: 'Style', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBH0uAJHlHtK-xKunqutYFOM9Rud-zys-9vX4ZL1ajZsfI1yF-qoDY0BxSmPLeq9orNprOtjuDD-b0ASADx1g5iGrvvZl9Tb30ytVfjILsJ5vAhcw4ZZnwyO_AtCmY_LDGnf9J2oCwVDuaCRupRsyxjkjJL2LvBtHKpr8ca9_zDkZqVYduhVv-QQ8pwQpYT8l6C7R3ct49EVYIYkesxCw_bqtHD3EQJELcRVtkgGNShwwEcq4jdps4kHd5rAKwXXeTi4M2S-6FYyEA' },
    { id: 6, title: 'Luxe Reception Details', category: 'Decor', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB701FC1EMbgQW7eLLqG9ox64xRLJzfxpmFGxlQNfkjE1B0y9alJHIF3nirKw9Sl-wGYx05-bq4y7sWNTpvFGxQ4g35we3Y73p_qlYorNSHbS23oNmGnWNlWWNbLptyJSr1GMgu9tXImj5PXmfgGz7E-TykSAKYPnQKqqQPypkaB385HoB9r277U9NJDgTTZ5mo8TqpbI4w256F-zlZ1H37DLx4J0TN44Dlfx4ysE5L3Igfmo1A8wyNtA2n7Mz367JypGJvgq3tuVk' },

    // New Highly Accurate Ethiopian Assets
    { id: 7, title: 'Addis Skyline Hotel Wedding', category: 'Venue', image: '/inspiration/addis_hotel_venue_1774550342819.png' },
    { id: 8, title: 'Golden Tibeb Motif Cake', category: 'Cakes', image: '/inspiration/ethiopian_wedding_cake_1774550417649.png' },
    { id: 9, title: 'Traditional White & Gold Decor', category: 'Decor', image: '/inspiration/ethiopian_wedding_decor_1774550475448.png' },
    { id: 10, title: 'Heritage Catering Setup', category: 'Catering', image: '/inspiration/ethiopian_catering_1774550565302.png' }
];

export default function InspirationBoard() {
    const [user, setUser] = useState<any>(null);
    const [boardId, setBoardId] = useState<string | null>(null);
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [filter, setFilter] = useState('All');
    const [favourites, setFavourites] = useState<number[]>([]);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
                setUser(user);
                // Fetch board
                const { data } = await supabase.from('inspiration_boards').select('*').eq('user_id', user.id).single();
                if (data) {
                    setBoardId(data.id);
                    setSavedItems(data.items || []);
                } else {
                    const { data: newBoard } = await supabase.from('inspiration_boards').insert([{ user_id: user.id, items: [] }]).select().single();
                    if (newBoard) setBoardId(newBoard.id);
                }

                // Fetch Favourites from localStorage (shared with Explore page)
                const savedFavs = localStorage.getItem(`favs_${user.id}`);
                if (savedFavs) setFavourites(JSON.parse(savedFavs));
            }
        });
    }, []);

    const handleSaveItem = async (item: any) => {
        if (!user) {
            alert("Please log in to save to your board");
            return;
        }
        if (savedItems.find(i => i.id === item.id)) return;

        const newItems = [...savedItems, item];
        setSavedItems(newItems);
        setSaving(true);
        if (boardId) {
            await supabase.from('inspiration_boards').update({ items: newItems }).eq('id', boardId);
        }
        setSaving(false);
    };

    const handleRemoveItem = async (itemId: number) => {
        const newItems = savedItems.filter(i => i.id !== itemId);
        setSavedItems(newItems);
        if (boardId) {
            await supabase.from('inspiration_boards').update({ items: newItems }).eq('id', boardId);
        }
    };

    const categories = ['All', 'Favourites', 'Venue', 'Cakes', 'Decor', 'Style', 'Catering'];

    // Combine local data with any potentially favourited items from Explore (simplified for this demo)
    const ALL_ITEMS = [...INSPIRATION_DATA];

    const filteredItems = filter === 'All'
        ? ALL_ITEMS
        : filter === 'Favourites'
            ? ALL_ITEMS.filter(i => favourites.includes(i.id))
            : ALL_ITEMS.filter(i => i.category === filter);

    const generateShareText = () => {
        let text = `Hello! This is my wedding vision board from Wedding Addis.\nMy registered email is: ${user?.email}\n\nHere are the items I selected:\n`;
        savedItems.forEach(item => {
            text += `- ${item.title} (${item.category})\n`;
        });
        return encodeURIComponent(text);
    };

    const handleShareWhatsApp = () => {
        if (!user) return alert("Log in to share.");
        if (savedItems.length === 0) return alert("Select some items first.");
        window.open(`https://wa.me/0973094991?text=${generateShareText()}`, '_blank');
    };

    const handleShareEmail = () => {
        if (!user) return alert("Log in to share.");
        if (savedItems.length === 0) return alert("Select some items first.");
        window.location.href = `mailto:ketewodros41@gmail.com?subject=My Wedding Vision Board&body=${generateShareText()}`;
    };

    return (
        <div className="bg-background text-on-surface font-body min-h-screen">
            <Header />

            <main className="max-w-screen-2xl mx-auto px-6 md:px-12 pt-8 flex flex-col md:flex-row gap-8 pb-24">
                {/* Gallery */}
                <div className="flex-1">
                    <div className="mb-12">
                        <h1 className="font-headline font-bold text-5xl md:text-6xl tracking-tight text-on-surface mb-4">Inspiration Board</h1>
                        <p className="text-on-surface-variant max-w-2xl text-lg leading-relaxed">
                            Curate your dream wedding by exploring our heritage-rich gallery. Click items to add them to your vision board.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-12">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                className={`px-6 py-2 rounded-full border-2 font-medium text-sm transition-all flex items-center gap-2 ${filter === c ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'}`}
                            >
                                {c === 'Favourites' && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>}
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.length === 0 && filter === 'Favourites' ? (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-outline-variant rounded-2xl">
                                <span className="material-symbols-outlined text-6xl text-stone-200 mb-4 block">heart_broken</span>
                                <p className="text-stone-400 font-medium">You haven't favourited anything in the Explore section yet.</p>
                                <button onClick={() => window.location.href = '/explore'} className="mt-4 text-primary font-bold hover:underline">Go to Explore</button>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div key={item.id} className="group relative overflow-hidden rounded-lg bg-surface-container-low cursor-pointer" onClick={() => handleSaveItem(item)}>
                                    <img src={item.image} alt={item.title} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                        <p className="text-white font-headline text-xl mb-1">{item.title}</p>
                                        <div className="flex justify-between items-center w-full">
                                            <span className="w-fit bg-primary/80 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest">{item.category}</span>
                                            <span className="material-symbols-outlined text-white hover:text-primary-container transition-colors">add_circle</span>
                                        </div>
                                    </div>
                                    {favourites.includes(item.id) && (
                                        <div className="absolute top-4 right-4 z-10 text-rose-500 drop-shadow-md">
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Board */}
                <aside className="w-full md:w-80 lg:w-96 flex-shrink-0">
                    <div className="md:sticky top-24 bg-surface-container-highest/70 backdrop-blur-2xl rounded-lg p-8 shadow-sm border border-outline-variant/10 min-h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-headline text-2xl font-bold text-primary">My Vision Board</h2>
                            <span className="bg-primary-container text-on-primary-container text-xs font-bold px-3 py-1 rounded-full">{savedItems.length} SAVED</span>
                        </div>

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {savedItems.length === 0 ? (
                                <div className="aspect-square w-full rounded-md border-2 border-dashed border-outline-variant flex items-center justify-center text-on-surface-variant text-center p-6">
                                    <div>
                                        <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">imagesmode</span>
                                        <span className="text-sm font-medium">Click items in the gallery to add them here</span>
                                    </div>
                                </div>
                            ) : (
                                savedItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-md border border-outline-variant/10 shadow-sm group">
                                        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-variant">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{item.title}</p>
                                            <p className="text-xs text-on-surface-variant">{item.category}</p>
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.id)} className="text-stone-400 hover:text-error transition-colors p-2">
                                            <span className="material-symbols-outlined text-xl">delete</span>
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {saving && <p className="text-xs text-primary mt-4 text-center">Saving...</p>}

                        {savedItems.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => window.location.href = '/dashboard'}
                                    className="w-full py-4 bg-primary text-on-primary font-bold tracking-wide uppercase text-sm rounded-xl hover:bg-primary/90 transition-all shadow-md">
                                    Back to Dashboard
                                </button>
                                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-outline-variant/20">
                                    <button
                                        onClick={handleShareWhatsApp}
                                        className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex flex-col items-center justify-center hover:opacity-90 transition-all shadow-sm"
                                    >
                                        <span className="text-xs uppercase tracking-widest leading-tight">Share via</span>
                                        <span>WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={handleShareEmail}
                                        className="w-full bg-surface-container-high text-on-surface border border-outline-variant py-3 rounded-xl font-bold flex flex-col items-center justify-center hover:bg-surface-container-highest transition-all shadow-sm"
                                    >
                                        <span className="text-xs uppercase tracking-widest leading-tight">Share via</span>
                                        <span>Email</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>
            </main>

            <Footer />
        </div>
    );
}
