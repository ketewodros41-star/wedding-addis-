'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function AdminVendors() {
    const [vendors, setVendors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const [
            { data: vendorsData },
            { data: categoriesData }
        ] = await Promise.all([
            supabase.from('vendors').select('*, vendor_categories(name)').order('created_at', { ascending: false }),
            supabase.from('vendor_categories').select('*')
        ]);
        setVendors(vendorsData || []);
        setCategories(categoriesData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleVerify = async (id: string, current: boolean) => {
        await supabase.from('vendors').update({ is_verified: !current }).eq('id', id);
        fetchData();
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="font-headline text-4xl font-bold italic text-on-surface">Manage Vendors</h1>
                    <p className="text-on-surface-variant mt-2 text-sm">Verify and curate the marketplace for your couples.</p>
                </div>
                <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-100 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-stone-50 transition-all">
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
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Vendor</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Rating</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">Verification</th>
                                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-stone-400 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vendors.map((vendor) => (
                                <tr key={vendor.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-100 flex-shrink-0">
                                                <img src={vendor.cover_image} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{vendor.name}</p>
                                                <p className="text-[10px] text-stone-400 font-medium uppercase tracking-widest">{vendor.location}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-stone-500">{vendor.vendor_categories?.name}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-xs text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span className="text-xs font-black text-stone-900">{vendor.rating.toFixed(1)}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleVerify(vendor.id, vendor.is_verified)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${vendor.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-red-400 border border-red-100'}`}
                                        >
                                            <span className="material-symbols-outlined text-sm">{vendor.is_verified ? 'verified' : 'new_releases'}</span>
                                            {vendor.is_verified ? 'Verified' : 'Unverified'}
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className={`text-[10px] font-bold uppercase tracking-widest ${vendor.is_featured ? 'text-primary' : 'text-stone-300'}`}>
                                            {vendor.is_featured ? 'Featured' : 'Standard'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
