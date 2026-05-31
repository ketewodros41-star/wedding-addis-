'use client';

import { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

function ExploreContent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    // -- STATE --
    const [items, setItems] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [favourites, setFavourites] = useState<number[]>([]);
    const [user, setUser] = useState<any>(null);

    // Derived from URL
    const selectedCategorySlug = searchParams.get('category') || null;
    const urlQuery = searchParams.get('q') || '';

    // Local state for immediate typing feedback
    const [searchQuery, setSearchQuery] = useState(urlQuery);
    const [debouncedSearch, setDebouncedSearch] = useState(urlQuery);

    // -- INITIAL LOAD --
    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(user);
                const saved = localStorage.getItem(`favs_${user.id}`);
                if (saved) setFavourites(JSON.parse(saved));
            }
        });

        // Use the categories from the user's preferred list but check DB for counts?
        // Let's actually fetch real categories from DB.
        supabase.from('vendor_categories').select('*').order('name').then(({ data }) => {
            setCategories(data || []);
        });
    }, []);

    // -- NAVIGATION HELPERS --
    const updateParams = useCallback((newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null) params.delete(key);
            else params.set(key, value);
        });

        const newUrl = `${pathname}?${params.toString()}`;
        // Only push if different to prevent loops
        if (newUrl !== `${pathname}?${searchParams.toString()}`) {
            router.push(newUrl, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    // -- SEARCH DEBOUNCE & SYNC --
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedSearch !== urlQuery) {
            updateParams({ q: debouncedSearch || null });
        }
    }, [debouncedSearch, urlQuery, updateParams]);

    // -- DATA FETCHING --
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let query = supabase
                .from('vendors')
                .select('*, vendor_categories(name, slug, icon)')
                .order('is_featured', { ascending: false })
                .order('rating', { ascending: false });

            if (selectedCategorySlug && categories.length > 0) {
                const cat = categories.find(c => c.slug === selectedCategorySlug);
                if (cat) query = query.eq('category_id', cat.id);
            }

            if (urlQuery) {
                query = query.ilike('name', `%${urlQuery}%`);
            }

            const budget = searchParams.get('budget');
            if (budget) query = query.eq('price_range', budget);

            const { data } = await query;
            setItems(data || []);
            setLoading(false);
        };

        if (categories.length > 0 || !selectedCategorySlug) {
            fetchData();
        }
    }, [selectedCategorySlug, urlQuery, searchParams, categories]);

    // -- INTERACTION --
    const toggleFavourite = (id: number) => {
        if (!user) return alert("Log in to save to favourites");
        const newFavs = favourites.includes(id) ? favourites.filter(f => f !== id) : [...favourites, id];
        setFavourites(newFavs);
        localStorage.setItem(`favs_${user.id}`, JSON.stringify(newFavs));
    };

    const handleCategoryClick = (slug: string) => {
        updateParams({ category: slug });
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const handleReset = useCallback(() => {
        router.push(pathname);
        setSearchQuery('');
    }, [pathname, router]);

    // -- RENDER HELPERS --
    const selectedCategory = categories.find(c => c.slug === selectedCategorySlug);

    return (
        <div className="bg-[#F8F9FA] min-h-screen text-stone-900 font-body">
            <Header />

            {/* COLLAPSED STICKY HEADER (Visible when selected) */}
            <AnimatePresence>
                {selectedCategorySlug && (
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
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`shrink-0 flex flex-col items-start px-5 py-2 rounded-xl transition-all border ${selectedCategorySlug === cat.slug ? 'bg-primary border-primary text-white' : 'bg-white border-stone-100 text-stone-900 hover:border-stone-200 shadow-sm'}`}
                                >
                                    <span className={`text-[8px] font-bold uppercase tracking-[0.15em] mb-0.5 ${selectedCategorySlug === cat.slug ? 'text-white/60' : 'text-primary'}`}>Collection</span>
                                    <span className="text-xs font-headline font-bold">{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="max-w-screen-2xl mx-auto px-8 pt-12 pb-24">

                {/* SEARCH BAR (Disappears when category selected, unless searching) */}
                <AnimatePresence>
                    {!selectedCategorySlug && (
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
                                    className="w-full bg-white border border-stone-100 rounded-2xl py-6 pl-16 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg placeholder:text-stone-400 shadow-lg shadow-black/5"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* LARGE CATEGORICAL CARDS (Initial State) */}
                {!selectedCategorySlug && !urlQuery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
                    >
                        {categories.map((cat, i) => {
                            const colors = ['bg-rose-50', 'bg-cyan-50', 'bg-emerald-50', 'bg-amber-50', 'bg-fuchsia-50', 'bg-indigo-50', 'bg-pink-50', 'bg-slate-50'];
                            const colorClass = colors[i % colors.length];

                            return (
                                <motion.div
                                    key={cat.id}
                                    whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`p-8 rounded-[2.5rem] ${colorClass} cursor-pointer border border-stone-100 shadow-sm transition-all relative overflow-hidden group h-[200px]`}
                                >
                                    <div className="relative z-10 flex flex-col justify-between h-full">
                                        <div>
                                            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-4 block">Category</span>
                                            <h3 className="font-headline text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{cat.name}</h3>
                                            <p className="text-stone-500 text-sm leading-relaxed">{cat.description || 'Discover refined wedding inspirations.'}</p>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Explore</span>
                                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-6 -right-6 material-symbols-outlined text-8xl opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">{cat.icon}</span>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}

                {/* RESULTS GRID AREA */}
                {(selectedCategorySlug || urlQuery) && (
                    <div className={`${selectedCategorySlug ? 'mt-4' : 'mt-0'} transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-12 border-b border-stone-100 pb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-stone-400">Showing </span>
                                <span className="text-xs font-bold text-stone-900">{items.length} Curations</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <select
                                    onChange={(e) => updateParams({ budget: e.target.value === 'all' ? null : e.target.value })}
                                    value={searchParams.get('budget') || 'all'}
                                    className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest text-stone-900 cursor-pointer outline-none"
                                >
                                    <option value="all">Any Budget</option>
                                    <option value="budget">$ Budget Friendly</option>
                                    <option value="mid">$$ Mid Range</option>
                                    <option value="premium">$$$ Premium</option>
                                    <option value="luxury">$$$$ Luxury</option>
                                </select>
                                <div className="h-4 w-px bg-stone-200"></div>
                                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Live Discoveries</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-12">
                            {/* Grid */}
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {loading ? (
                                    [1, 2, 3, 4].map(i => (
                                        <div key={i} className="space-y-4 animate-pulse">
                                            <div className="aspect-[4/5] bg-stone-100 rounded-[2rem]"></div>
                                            <div className="h-4 bg-stone-100 rounded-full w-2/3"></div>
                                        </div>
                                    ))
                                ) : items.length === 0 ? (
                                    <div className="col-span-full py-32 text-center">
                                        <span className="material-symbols-outlined text-6xl text-stone-100 mb-4">auto_fix_off</span>
                                        <h3 className="font-headline text-2xl font-bold italic text-stone-400">No curations match your criteria</h3>
                                        <button onClick={handleReset} className="mt-4 text-primary font-bold hover:underline font-body text-sm uppercase tracking-widest">Clear all filters</button>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {items.map(item => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="group cursor-pointer"
                                                onClick={() => router.push(`/vendors/${item.slug}`)}
                                            >
                                                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-stone-200">
                                                    <img src={item.cover_image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                                                    <div className="absolute top-6 right-6 z-20">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleFavourite(item.id); }}
                                                            className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${favourites.includes(item.id) ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/90 text-stone-900 border border-stone-100 hover:bg-white'}`}
                                                        >
                                                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: favourites.includes(item.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                                                        </button>
                                                    </div>
                                                    <div className="absolute top-6 left-6 z-20">
                                                        <span className="bg-primary text-white text-[8px] font-bold px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg">Verified</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 px-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.vendor_categories?.name}</span>
                                                        <div className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                            <span className="text-[10px] font-black text-stone-900">{item.rating?.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                    <h4 className="text-primary font-headline text-xl font-bold italic tracking-tight">{item.name}</h4>
                                                    <p className="text-[10px] text-stone-400 italic truncate">{item.tagline}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 italic">Curating Excellence...</p>
                </div>
            </div>
        }>
            <ExploreContent />
        </Suspense>
    );
}
