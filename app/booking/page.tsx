'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function BookingFormWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        // Step 1: Identity
        brideName: '',
        groomName: '',
        email: '',
        phone: '',
        date: '2025-11-14',
        guests: 450,
        
        // Step 2: Details
        weddingType: 'Traditional', // Traditional, Modern, Fusion
        ceremonyType: 'Religious', // Religious, Civil, Garden
        venuePreference: 'Sheraton Addis',
        area: 'Bole',
        culturalPrefs: [] as string[],
        
        // Step 3: Mood & Vision
        styles: [] as string[],
        colorPalette: [] as string[],
        visionNotes: '',
        
        // Step 4: Planning & Theme
        theme: 'Traditional Heritage',
        budgetLevel: 3,
        cateringPref: 'Traditional Buffet',
        photoPref: 'Full Day Cinematic',
    });

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    }, []);

    const handleBookingSubmit = async () => {
        if (!user) {
            alert("Please log in to save your booking.");
            return window.location.href = '/login';
        }

        setLoading(true);
        
        // Generate a simple slug
        const slug = `${formData.brideName.split(' ')[0] || 'bride'}-${formData.groomName.split(' ')[0] || 'groom'}-${Date.now().toString().slice(-4)}`.toLowerCase().replace(/\s+/g, '-');

        const { error } = await supabase.from('bookings').insert([
            {
                user_id: user.id,
                event_date: formData.date,
                location: formData.venuePreference,
                guest_count: formData.guests,
                budget: formData.budgetLevel * 100000, 
                bride_name: formData.brideName,
                groom_name: formData.groomName,
                phone: formData.phone,
                wedding_type: formData.weddingType,
                ceremony_type: formData.ceremonyType,
                preferred_area: formData.area,
                budget_range: ['Boutique', 'Premium', 'Signature', 'Ultra Luxe', 'Royal'][formData.budgetLevel - 1],
                themes: [formData.theme, ...formData.styles],
                vision_notes: formData.visionNotes,
                slug: slug,
                preferences: { 
                    catering: formData.cateringPref,
                    photo: formData.photoPref,
                    colors: formData.colorPalette,
                    cultural: formData.culturalPrefs
                },
                status: 'pending',
            }
        ]);
        
        setLoading(false);

        if (error) {
            alert("Error saving booking: " + error.message);
        } else {
            alert("Your wedding journey has officially begun! Our concierges will reach out shortly.");
            window.location.href = '/dashboard';
        }
    };

    const toggleArrayItem = (key: 'culturalPrefs' | 'styles' | 'colorPalette', item: string) => {
        setFormData(prev => ({
            ...prev,
            [key]: prev[key].includes(item) 
                ? prev[key].filter(i => i !== item)
                : [...prev[key], item]
        }));
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const previousStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="bg-background min-h-screen font-body text-on-surface">
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 min-h-[80vh]">
                <header className="text-center mb-16">
                    <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-on-surface mb-4 italic">Craft Your Celebration</h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto italic font-headline text-lg">Every legacy begins with a single intentional choice. Let us weave your story together.</p>
                </header>

                {/* Progress Bar */}
                <div className="relative mb-16 px-4">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant/30 -translate-y-1/2"></div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((step - 1) / 3) * 100}%` }}
                        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
                    ></motion.div>
                    <div className="relative flex justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2" onClick={() => s < step && setStep(s)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-background transition-all duration-300 ${s <= step ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}`}>
                                    {s < step ? <span className="material-symbols-outlined text-sm">check</span> : s}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${s <= step ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {['Identity', 'Details', 'Mood', 'Vision'][s - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Identity */}
                    {step === 1 && (
                        <motion.section
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-premium"
                        >
                            <div className="space-y-8">
                                <div className="border-b border-outline-variant/20 pb-6">
                                    <h2 className="font-headline text-2xl font-bold text-primary">Couple Identity</h2>
                                    <p className="text-sm text-on-surface-variant italic">Tell us who we are celebrating.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Bride's Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Helina Selassie"
                                            value={formData.brideName}
                                            onChange={e => setFormData({...formData, brideName: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Groom's Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Abebe Bikila"
                                            value={formData.groomName}
                                            onChange={e => setFormData({...formData, groomName: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Contact Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="hello@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            placeholder="0911..."
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Wedding Date</label>
                                        <input 
                                            type="date" 
                                            value={formData.date}
                                            onChange={e => setFormData({...formData, date: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Guest Estimate</label>
                                        <input 
                                            type="number" 
                                            value={formData.guests}
                                            onChange={e => setFormData({...formData, guests: parseInt(e.target.value)})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <motion.section
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-premium"
                        >
                            <div className="space-y-10">
                                <div className="border-b border-outline-variant/20 pb-6">
                                    <h2 className="font-headline text-2xl font-bold text-primary">Wedding Details</h2>
                                    <p className="text-sm text-on-surface-variant italic">Define the essence of your ceremony.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Wedding Style</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Traditional', 'Modern', 'Fusion', 'Vintage'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFormData({...formData, weddingType: type})}
                                                    className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${formData.weddingType === type ? 'bg-primary text-on-primary border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Ceremony Nature</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Religious', 'Civil', 'Garden', 'Destination'].map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => setFormData({...formData, ceremonyType: type})}
                                                    className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${formData.ceremonyType === type ? 'bg-secondary text-on-secondary border-secondary' : 'border-outline-variant text-on-surface-variant hover:border-secondary'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Preferred Area in Addis</label>
                                        <select 
                                            value={formData.area}
                                            onChange={e => setFormData({...formData, area: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none appearance-none"
                                        >
                                            {['Bole', 'Kirkos', 'Yeka', 'Kazanchis', 'Entoto', 'Sarbet', 'Old Airport'].map(a => (
                                                <option key={a} value={a}>{a}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Cultural Elements</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Melse', 'Telosh', 'Nikah', 'Gurs', 'Coffee Ceremony'].map(tag => (
                                                <button
                                                    key={tag}
                                                    onClick={() => toggleArrayItem('culturalPrefs', tag)}
                                                    className={`px-4 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.culturalPrefs.includes(tag) ? 'bg-primary-container text-on-primary-container border-primary-container' : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-high'}`}
                                                >
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Step 3: Mood & Vision */}
                    {step === 3 && (
                        <motion.section
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-premium"
                        >
                            <div className="space-y-10">
                                <div className="border-b border-outline-variant/20 pb-6">
                                    <h2 className="font-headline text-2xl font-bold text-primary">Mood &amp; Vision</h2>
                                    <p className="text-sm text-on-surface-variant italic">Paint a picture of your dream celebration.</p>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Preferred Styles</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['Royal Habesha', 'Minimalist Elegance', 'Lush Botanical', 'Gilded Luxury', 'Contemporary Chic', 'Rustic Heritage'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => toggleArrayItem('styles', s)}
                                                    className={`p-4 rounded-xl border text-left flex flex-col gap-2 transition-all ${formData.styles.includes(s) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant/30 hover:bg-surface-container-low'}`}
                                                >
                                                    <span className={`material-symbols-outlined text-sm ${formData.styles.includes(s) ? 'text-primary' : 'text-outline'}`}>
                                                        {formData.styles.includes(s) ? 'auto_awesome' : 'add'}
                                                    </span>
                                                    <span className="text-xs font-bold">{s}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Color Palette</label>
                                        <div className="flex gap-4">
                                            {[
                                                { name: 'Gold & Ivory', colors: ['#735c00', '#fdf9f4'] },
                                                { name: 'Emerald & Cream', colors: ['#29695b', '#f7f3ee'] },
                                                { name: 'Ruby & White', colors: ['#af2b3e', '#ffffff'] },
                                                { name: 'Amethyst & Silver', colors: ['#8c0d27', '#e6e2dd'] }
                                            ].map(p => (
                                                <button
                                                    key={p.name}
                                                    onClick={() => setFormData({...formData, colorPalette: p.colors})}
                                                    className={`relative group w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${formData.colorPalette[0] === p.colors[0] ? 'border-primary scale-110 shadow-lg' : 'border-transparent'}`}
                                                >
                                                    <div className="absolute inset-0 flex">
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: p.colors[0] }}></div>
                                                        <div className="w-1/2 h-full" style={{ backgroundColor: p.colors[1] }}></div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Vision Notes</label>
                                        <textarea 
                                            rows={4}
                                            placeholder="Tell us about specific flowers, family traditions, or lighting themes..."
                                            value={formData.visionNotes}
                                            onChange={e => setFormData({...formData, visionNotes: e.target.value})}
                                            className="w-full bg-surface-container-high rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none resize-none"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {/* Step 4: Vision & Planning summary */}
                    {step === 4 && (
                        <motion.section
                            key="step4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-surface-container-lowest rounded-2xl p-8 md:p-12 shadow-premium relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 tibeb-pattern opacity-10 rotate-12 -translate-y-8 translate-x-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Final Vision &amp; Plan</h2>
                                        <p className="text-sm text-on-surface-variant italic">Scale your celebration and refine preferences.</p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Primary Theme Direction</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['Traditional Heritage', 'Modern Minimalist', 'Luxe Grandeur'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData({ ...formData, theme: t })}
                                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${formData.theme === t ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary' : 'border-outline-variant/30 hover:bg-surface-container-low'}`}
                                                    >
                                                        <span className="block font-bold">{t}</span>
                                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: formData.theme === t ? "'FILL' 1" : "'FILL' 0" }}>
                                                            {formData.theme === t ? 'check_circle' : 'radio_button_unchecked'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Investment Range</label>
                                                <span className="text-[10px] font-bold text-primary tracking-widest">
                                                    {['BOUTIQUE', 'PREMIUM', 'SIGNATURE', 'ULTRA LUXE', 'ROYAL'][formData.budgetLevel - 1]}
                                                </span>
                                            </div>
                                            <input
                                                type="range" min="1" max="5"
                                                value={formData.budgetLevel}
                                                onChange={(e) => setFormData({ ...formData, budgetLevel: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-[8px] font-bold text-outline px-1 tracking-tighter">
                                                <span>100k+</span>
                                                <span>250k+</span>
                                                <span>500k+</span>
                                                <span>1M+</span>
                                                <span>3M+</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-outline">Catering Preference</label>
                                                <select 
                                                    value={formData.cateringPref}
                                                    onChange={e => setFormData({...formData, cateringPref: e.target.value})}
                                                    className="w-full bg-surface-container-high rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                                >
                                                    {['Traditional Buffet', 'Heritage Fine Dining', 'Modern Fusion Platter', 'Garden Cocktail Service'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10 space-y-4">
                                        <h3 className="font-headline text-lg font-bold text-on-surface">Vision Summary</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-outline">Guests</span>
                                                <span className="font-bold">{formData.guests}</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-outline">Ceremony</span>
                                                <span className="font-bold">{formData.ceremonyType} ({formData.weddingType})</span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-outline">Area</span>
                                                <span className="font-bold">{formData.area}, Addis</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {formData.styles.map(s => <span key={s} className="px-2 py-1 bg-white text-[8px] font-bold uppercase tracking-wider rounded border border-outline-variant/20">{s}</span>)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-headline text-xl font-bold text-on-surface">Selected Colors</h3>
                                        <div className="flex gap-2">
                                            {formData.colorPalette.length > 0 ? (
                                                formData.colorPalette.map(c => <div key={c} className="w-12 h-12 rounded-lg shadow-sm border border-white" style={{ backgroundColor: c }}></div>)
                                            ) : (
                                                <div className="text-xs italic text-outline">No palette selected in Step 3</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20">
                                        <div className="flex items-start gap-4">
                                            <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-primary uppercase tracking-widest">Heritage Concierge Ready</p>
                                                <p className="text-xs text-on-surface-variant leading-relaxed italic">Once submitted, our experts will curate a selection of vendors matching your scale and Habesha aesthetic.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Footer Controls */}
                <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    {step > 1 ? (
                        <button onClick={previousStep} className="flex items-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to {['Identity', 'Details', 'Mood'][step - 2]}
                        </button>
                    ) : (
                        <div></div>
                    )}
                    
                    {step < 4 ? (
                        <button
                            onClick={nextStep}
                            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold tracking-wide shadow-premium hover:-translate-y-1 transition-all duration-300"
                        >
                            Continue to {['Details', 'Mood', 'Vision'][step - 1]}
                        </button>
                    ) : (
                        <button
                            onClick={handleBookingSubmit}
                            disabled={loading}
                            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary rounded-xl font-bold tracking-wide shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Send to Wedding Addis'}
                        </button>
                    )}
                </div>
            </main>
            <Footer />

            <style jsx global>{`
                .shadow-premium {
                    shadow: 0 8px 48px -12px rgba(115, 92, 0, 0.08);
                }
            `}</style>
        </div>
    );
}
