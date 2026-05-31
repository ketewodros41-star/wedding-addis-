'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PRICE_LABELS: Record<string, string> = {
    budget: 'Budget Friendly',
    mid: 'Mid Range',
    premium: 'Premium',
    luxury: 'Luxury'
};

const AVAILABILITY_COLORS: Record<string, string> = {
    available: 'bg-secondary/10 text-secondary',
    busy: 'bg-outline/10 text-outline',
    inquiry_only: 'bg-primary-container/20 text-on-primary-container'
};

export default function VendorMarketplace() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activePriceFilter, setActivePriceFilter] = useState('all');

    const fetchVendors = useCallback(async () => {
        let query = supabase
            .from('vendors')
            .select('*, vendor_categories(name, slug, icon)')
            .order('is_featured', { ascending: false })
            .order('rating', { ascending: false });

        if (activeCategory !== 'all') {
            const cat = categories.find(c => c.slug === activeCategory);
            if (cat) query = query.eq('category_id', cat.id);
        }
        if (activePriceFilter !== 'all') {
            query = query.eq('price_range', activePriceFilter);
        }
        if (searchQuery.trim()) {
            query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data } = await query;
        setVendors(data || []);
        setLoading(false);
    }, [activeCategory, activePriceFilter, searchQuery, categories]);

    useEffect(() => {
        supabase.from('vendor_categories').select('*').order('name').then(({ data }) => {
            setCategories(data || []);
        });
    }, []);

    useEffect(() => {
        if (categories.length >= 0) fetchVendors();
    }, [fetchVendors, categories]);

    return (
        <div className="min-h-screen bg-background text-on-surface font-body">
            <Header />
            <main>
                {/* Hero Banner */}
                <section className="relative h-64 bg-surface-container-high flex items-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0l30 30-30 30L0 30z\' fill=\'%23735c00\' fill-opacity=\'0.04\'/%3E%3C/svg%3E')]"></div>
                    <div className="absolute right-0 w-96 h-96 bg-primary/5 rounded-full blur-[80px] -mr-32"></div>
                    <div className="relative max-w-7xl mx-auto px-8 w-full">
                        <h1 className="font-headline italic text-5xl font-bold text-on-surface mb-3">Vendor Marketplace</h1>
                        <p className="text-on-surface-variant max-w-lg">Discover the finest Ethiopian wedding professionals — vetted, verified, and ready for your big day.</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
                    {/* Search + Filters */}
                    <div className="flex flex-col md:flex-row gap-4 sticky top-0 pt-4 pb-6 bg-background z-30">
                        <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-xl">search</span>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search vendors, florists, photographers..."
                                className="w-full bg-surface-container-low rounded-2xl pl-12 pr-5 py-4 outline-none focus:ring-1 focus:ring-primary text-sm border border-outline-variant/20"
                            />
                        </div>
                        <select
                            value={activePriceFilter}
                            onChange={e => setActivePriceFilter(e.target.value)}
                            className="bg-surface-container-low rounded-2xl px-5 py-4 outline-none text-sm border border-outline-variant/20 font-bold"
                        >
                            <option value="all">All Budgets</option>
                            <option value="budget">Budget Friendly</option>
                            <option value="mid">Mid Range</option>
                            <option value="premium">Premium</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/5'}`}
                        >
                            All Services
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${activeCategory === cat.slug ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary/5'}`}
                            >
                                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Vendor Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="bg-surface-container-low rounded-3xl aspect-[4/5] animate-pulse"></div>
                            ))}
                        </div>
                    ) : vendors.length === 0 ? (
                        <div className="py-32 text-center">
                            <span className="material-symbols-outlined text-6xl text-outline/20 mb-4">storefront</span>
                            <h3 className="text-xl font-bold font-headline italic text-on-surface-variant">No vendors found</h3>
                            <p className="text-sm text-outline mt-1">Try adjusting your filters.</p>
                        </div>
                    ) : (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {vendors.map(vendor => (
                                    <motion.div
                                        layout
                                        key={vendor.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <Link href={`/vendors/${vendor.slug}`} className="group block bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/10 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2">
                                            {/* Cover Image */}
                                            <div className="aspect-[4/3] overflow-hidden relative">
                                                <img
                                                    src={vendor.cover_image}
                                                    alt={vendor.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 to-transparent"></div>
                                                {vendor.is_featured && (
                                                    <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        Featured
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                                    <div>
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${AVAILABILITY_COLORS[vendor.availability_status]}`}>
                                                            {vendor.availability_status.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                    {vendor.is_verified && (
                                                        <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{vendor.vendor_categories?.name}</p>
                                                    <h3 className="font-headline text-xl font-bold">{vendor.name}</h3>
                                                    <p className="text-sm text-on-surface-variant mt-1 italic">{vendor.tagline}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                        <span className="font-bold text-sm">{vendor.rating.toFixed(1)}</span>
                                                        <span className="text-xs text-outline">({vendor.review_count})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-outline">
                                                        <span className="material-symbols-outlined text-xs">location_on</span>
                                                        <span className="text-xs font-medium truncate max-w-[120px]">{vendor.location}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-container bg-primary/5 px-2 py-0.5 rounded-full">{PRICE_LABELS[vendor.price_range]}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
