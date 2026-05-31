'use client';

import { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function VendorProfilePage(props: { params: Promise<{ slug: string }> }) {
    const params = use(props.params);
    const slug = params.slug;

    const [vendor, setVendor] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [booking, setBooking] = useState<any>(null);

    const [inquiryOpen, setInquiryOpen] = useState(false);
    const [inquiryData, setInquiryData] = useState({ message: '', event_date: '', budget_range: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        const load = async () => {
            const [{ data: v }, { data: r }, { data: { user: u } }] = await Promise.all([
                supabase.from('vendors').select('*, vendor_categories(name, icon)').eq('slug', slug).single(),
                supabase.from('vendor_reviews').select('*').eq('vendor_id', (await supabase.from('vendors').select('id').eq('slug', slug).single()).data?.id || '').order('created_at', { ascending: false }),
                supabase.auth.getUser()
            ]);
            setVendor(v);
            setReviews(r || []);
            setUser(u);
            if (u) {
                const { data: b } = await supabase.from('bookings').select('id').eq('user_id', u.id).single();
                setBooking(b);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) { alert('Please sign in to send an inquiry.'); return; }
        setSending(true);
        const { error } = await supabase.from('vendor_inquiries').insert([{
            vendor_id: vendor.id,
            user_id: user.id,
            booking_id: booking?.id || null,
            message: inquiryData.message,
            event_date: inquiryData.event_date || null,
            budget_range: inquiryData.budget_range || null,
        }]);
        setSending(false);
        if (!error) { setSent(true); setInquiryOpen(false); }
        else alert("Error: " + error.message);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    if (!vendor) return <div className="min-h-screen flex items-center justify-center bg-background text-on-surface-variant italic">Vendor not found.</div>;

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : vendor.rating.toFixed(1);

    return (
        <div className="min-h-screen bg-background text-on-surface font-body">
            <Header />
            <main>
                {/* Hero */}
                <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
                    <img src={vendor.cover_image} alt={vendor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 px-8 pb-12 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{vendor.vendor_categories?.name}</span>
                                    {vendor.is_verified && <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>}
                                </div>
                                <h1 className="font-headline italic text-5xl md:text-6xl font-bold text-white drop-shadow-xl">{vendor.name}</h1>
                                <p className="text-white/70 text-lg italic">{vendor.tagline}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-center border border-white/20">
                                    <p className="text-3xl font-bold">{avgRating}</p>
                                    <p className="text-[10px] uppercase tracking-widest">Rating</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-white text-center border border-white/20">
                                    <p className="text-3xl font-bold">{vendor.review_count}</p>
                                    <p className="text-[10px] uppercase tracking-widest">Reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* About */}
                        <section className="space-y-6">
                            <h2 className="font-headline text-3xl font-bold italic">About {vendor.name}</h2>
                            <p className="text-on-surface-variant leading-relaxed text-lg">{vendor.description}</p>
                        </section>

                        {/* Portfolio */}
                        {vendor.portfolio_images?.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="font-headline text-3xl font-bold italic">Portfolio</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {vendor.portfolio_images.map((img: string, i: number) => (
                                        <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
                                            <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Reviews */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="font-headline text-3xl font-bold italic">Client Testimonials</h2>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <span key={s} className={`material-symbols-outlined text-sm ${s <= Math.round(parseFloat(avgRating)) ? 'text-primary' : 'text-outline/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                    <span className="font-bold">{avgRating}</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {reviews.map(r => (
                                    <div key={r.id} className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-bold">{r.couple_names || "Anonymous"}</p>
                                                <p className="text-xs text-outline">{r.wedding_date ? new Date(r.wedding_date).toLocaleDateString() : ""}</p>
                                            </div>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <span key={s} className={`material-symbols-outlined text-sm ${s <= r.rating ? 'text-primary' : 'text-outline/30'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-on-surface-variant italic">"{r.body}"</p>
                                    </div>
                                ))}
                                {reviews.length === 0 && (
                                    <div className="text-center py-12 text-on-surface-variant italic">Be the first to leave a review.</div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Contact Card */}
                    <aside className="space-y-8">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-[0_32px_80px_-16px_rgba(115,92,0,0.1)] space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        <span>{vendor.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="material-symbols-outlined text-primary">payments</span>
                                        <span className="font-bold capitalize">{vendor.price_range} pricing</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="material-symbols-outlined text-primary">schedule</span>
                                        <span className="capitalize">{vendor.availability_status.replace('_', ' ')}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-outline-variant/10 space-y-3">
                                    {sent ? (
                                        <div className="text-center py-4 text-secondary font-bold italic">
                                            <span className="material-symbols-outlined text-3xl block mb-2">check_circle</span>
                                            Inquiry sent!
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setInquiryOpen(true)}
                                                className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold hover:-translate-y-1 transition-all shadow-lg shadow-primary/20 text-xs uppercase tracking-widest"
                                            >
                                                Send Inquiry
                                            </button>
                                            {vendor.contact_whatsapp && (
                                                <button
                                                    onClick={() => window.open(`https://wa.me/${vendor.contact_whatsapp}?text=Hello! I found you on Wedding Addis.`, '_blank')}
                                                    className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">chat</span>
                                                    WhatsApp
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />

            {/* Inquiry Modal */}
            {inquiryOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setInquiryOpen(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-surface-container-lowest w-full max-w-lg rounded-3xl border border-outline-variant/10 shadow-2xl relative z-10"
                    >
                        <header className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold font-headline italic">Send an Inquiry</h3>
                            <button onClick={() => setInquiryOpen(false)} className="text-outline"><span className="material-symbols-outlined">close</span></button>
                        </header>
                        <form onSubmit={handleInquiry} className="p-8 space-y-5">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Your Message</label>
                                <textarea required rows={4} value={inquiryData.message} onChange={e => setInquiryData({ ...inquiryData, message: e.target.value })} placeholder="Tell us about your wedding vision..." className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none resize-none text-sm focus:ring-1 focus:ring-primary"></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Wedding Date</label>
                                    <input type="date" value={inquiryData.event_date} onChange={e => setInquiryData({ ...inquiryData, event_date: e.target.value })} className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none text-sm focus:ring-1 focus:ring-primary" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-outline">Budget Range</label>
                                    <select value={inquiryData.budget_range} onChange={e => setInquiryData({ ...inquiryData, budget_range: e.target.value })} className="w-full bg-surface-container-high rounded-xl px-4 py-3 outline-none text-sm focus:ring-1 focus:ring-primary">
                                        <option value="">Select...</option>
                                        <option value="budget">Budget Friendly</option>
                                        <option value="mid">Mid Range</option>
                                        <option value="premium">Premium</option>
                                        <option value="luxury">Luxury</option>
                                    </select>
                                </div>
                            </div>
                            <button disabled={sending} className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:-translate-y-1 transition-all disabled:opacity-50 shadow-lg">
                                {sending ? 'Sending...' : 'Submit Inquiry'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
