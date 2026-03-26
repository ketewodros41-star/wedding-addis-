'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const EXPLORE_CATEGORIES = [
    { id: 'venues', title: 'Venues & Estates', subtitle: 'Historical villas and private estates.', count: 3, color: 'bg-rose-50' },
    { id: 'floral', title: 'Floral Artistry', subtitle: 'Bespoke botanical designs.', count: 2, color: 'bg-cyan-50' },
    { id: 'cakes', title: 'Artisanal Cakes', subtitle: 'Handcrafted confections and desserts.', count: 2, color: 'bg-emerald-50' },
    { id: 'decor', title: 'Signature Decor', subtitle: 'Styling and rentals for every theme.', count: 2, color: 'bg-amber-50' },
    { id: 'catering', title: 'Artisan Catering', subtitle: 'Michelin-star wedding menus.', count: 3, color: 'bg-fuchsia-50' },
    { id: 'couture', title: 'Bespoke Couture', subtitle: 'Handcrafted bridal attire.', count: 2, color: 'bg-indigo-50' },
    { id: 'flowers', title: 'Flowers', subtitle: 'Seasonal floral arrangements.', count: 2, color: 'bg-pink-50' },
    { id: 'attire', title: 'Attire', subtitle: 'Groom and bridal party styling.', count: 2, color: 'bg-slate-50' }
];

const EXPLORE_ITEMS = [
    { id: 1, name: 'Sunset Cliff Estate', category: 'venues', image: '/inspiration/addis_hotel_venue_1774550342819.png', style: 'Modern', budget: '$$$', rating: 4.8 },
    { id: 2, name: 'Golden Tibeb Cake', category: 'cakes', image: '/inspiration/ethiopian_wedding_cake_1774550417649.png', style: 'Traditional', budget: '$$', rating: 4.9 },
    { id: 3, name: 'Royal Banquet Setup', category: 'catering', image: '/inspiration/ethiopian_catering_1774550565302.png', style: 'Royal', budget: '$$$$', rating: 5.0 },
    { id: 4, name: 'White & Gold Textures', category: 'decor', image: '/inspiration/ethiopian_wedding_decor_1774550475448.png', style: 'Traditional', budget: '$$', rating: 4.7 },
    { id: 5, name: 'Highland Garden', category: 'venues', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAU8qu48SGvqFBgUHSxNJSmHu5UOZMg3L4u948E5F6eKYdi0eOBKcAIreW8tpZLgkb186RCrAxfQ8Uw25e2AfkqkYd1-Mcw5dSHyR9WP5SifhHpy2pQ3J5yfgOUThPMIUkvXqs19hEJJF0QXh_IpnZD74ndBr4wdDilOht9tsR234bBsWd3ARtMyAtCSRR9CkM7QGIYfCsIVP-XUUK9fq0sGImwtw8f_8QRLHMXPsvVW4MJtOCW92xHysx13vkbWKa16ESbo_e8AkU', style: 'Rustic', budget: '$$$', rating: 4.5 },
];

export default function ExplorePage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [favourites, setFavourites] = useState<number[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
                const saved = localStorage.getItem(`favs_${user.id}`);
                if (saved) setFavourites(JSON.parse(saved));
            }
        });
    }, []);

    const toggleFavourite = (id: number) => {
        if (!user) return alert("Log in to save to favourites");
        const newFavs = favourites.includes(id) ? favourites.filter(f => f !== id) : [...favourites, id];
        setFavourites(newFavs);
        localStorage.setItem(`favs_${user.id}`, JSON.stringify(newFavs));
    };

    const handleCategoryClick = (id: string) => {
        // Immediate appearance mode - no scroll
        setSelectedCategory(id);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleReset = () => {
        setSelectedCategory(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const filteredItems = EXPLORE_ITEMS.filter(item =>
        (!selectedCategory || item.category === selectedCategory) &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-[#F8F9FA] min-h-screen text-stone-900 font-body">
            <Header />

            {/* COLLAPSED STICKY HEADER (Visible when selected) */}
            <AnimatePresence>
                {selectedCategory && (
                    <motion.div
                        initial={{ y: -100 }}
                        animate={{ y: 0 }}
                        exit={{ y: -100 }}
                        className="sticky top-[72px] inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-b border-stone-200 shadow-sm transition-all"
                    >
                        <div className="max-w-screen-2xl mx-auto px-8 py-3 overflow-x-auto no-scrollbar flex items-center gap-4">
                            <button onClick={handleReset} className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors mr-2">
                                <span className="material-symbols-outlined text-stone-500">arrow_back</span>
                            </button>
                            {EXPLORE_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className={`shrink-0 flex flex-col items-start px-5 py-2 rounded-xl transition-all border ${selectedCategory === cat.id ? 'bg-[#7C2D3D] border-[#7C2D3D] text-white' : 'bg-white border-stone-100 text-stone-900 hover:border-stone-200 shadow-sm'}`}
                                >
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.15em] mb-0.5 ${selectedCategory === cat.id ? 'text-white/60' : 'text-[#7C2D3D]'}`}>Collection</span>
                                    <span className="text-xs font-headline font-bold">{cat.title}</span>
                                    <span className={`text-[8px] uppercase tracking-wider font-medium font-body ${selectedCategory === cat.id ? 'text-white/40' : 'text-stone-400'}`}>{cat.count} Ideas</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-screen-2xl mx-auto px-8 pt-12 pb-24">

                {/* SEARCH BAR (Disappears when selected) */}
                <AnimatePresence>
                    {!selectedCategory && (
                        <motion.div
                            initial={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center mb-12 space-y-8"
                        >
                            <div className="relative w-full max-w-3xl">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400">search</span>
                                <input
                                    type="text"
                                    placeholder="Search venues, cakes, decor..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white border border-stone-100 rounded-2xl py-6 pl-16 pr-8 focus:outline-none focus:ring-2 focus:ring-[#7C2D3D]/20 transition-all font-medium text-lg placeholder:text-stone-400 shadow-lg shadow-black/5"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LARGE CATEGORICAL CARDS (Initial State) */}
                {!selectedCategory && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
                    >
                        {EXPLORE_CATEGORIES.map((cat) => (
                            <motion.div
                                key={cat.id}
                                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                onClick={() => handleCategoryClick(cat.id)}
                                className={`p-8 rounded-[2.5rem] ${cat.color} cursor-pointer border border-stone-100 shadow-sm transition-all relative overflow-hidden group h-[200px]`}
                            >
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div>
                                        <span className="text-[10px] font-bold tracking-[0.2em] text-[#7C2D3D] uppercase mb-4 block">Category</span>
                                        <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-[#7C2D3D] transition-colors">{cat.title}</h3>
                                        <p className="text-stone-500 text-sm leading-relaxed">{cat.subtitle}</p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">{cat.count} Inspirations</span>
                                        <div className="flex items-center gap-1 text-[#7C2D3D] group-hover:gap-2 transition-all">
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
                                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* RESULTS GRID AREA */}
                <div className={`${selectedCategory ? 'mt-4' : 'mt-0'} transition-all duration-300`}>
                    <div className="flex items-center justify-between mb-12 border-b border-stone-100 pb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-stone-400 text-on-surface-variant">Showing </span>
                            <span className="text-xs font-bold text-stone-900">{filteredItems.length} of {filteredItems.length} results</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Page 1 of 1</span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Filters Sidebar */}
                        <aside className="w-full md:w-64 shrink-0">
                            <div className="sticky top-44 space-y-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-headline text-2xl italic font-bold text-[#7C2D3D]">Filters</h3>
                                    <button className="text-[10px] font-bold uppercase tracking-widest text-[#7C2D3D]/60 hover:text-[#7C2D3D]">Clear All</button>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Budget Range</h4>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="Min" className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7C2D3D]" />
                                        <input type="text" placeholder="Max" className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#7C2D3D]" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Aesthetic Style</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['Modern', 'Traditional', 'Rustic', 'Bohemian', 'Royal'].map(s => (
                                            <button key={s} className="px-3 py-1.5 rounded-md border border-stone-200 text-[10px] font-bold uppercase tracking-widest hover:border-[#7C2D3D] hover:text-[#7C2D3D] transition-colors">{s}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Minimum Rating</h4>
                                    <select className="w-full bg-white border border-stone-200 rounded-lg p-3 text-sm focus:outline-none">
                                        <option>All ratings</option>
                                        <option>4+ stars</option>
                                        <option>3+ stars</option>
                                    </select>
                                </div>
                            </div>
                        </aside>

                        {/* Grid */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredItems.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="group"
                                    >
                                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-stone-200">
                                            <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                                            <div className="absolute top-6 right-6 z-20">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleFavourite(item.id); }}
                                                    className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${favourites.includes(item.id) ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/90 text-stone-900 border border-stone-100 hover:bg-white'}`}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: favourites.includes(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                                                </button>
                                            </div>
                                            <div className="absolute top-6 left-6 z-20">
                                                <span className="bg-[#7C2D3D] text-white text-[8px] font-bold px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg">Verified</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2 px-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.category} & Estates</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="text-[10px] font-black text-stone-900">{item.rating}</span>
                                                </div>
                                            </div>
                                            <h4 className="text-[#7C2D3D] font-headline text-xl font-bold italic tracking-tight">{item.name}</h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
