'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function BookingFormWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        theme: 'Traditional Heritage',
        budget: 3,
        date: '2024-11-14',
        guests: 450,
        venue: 'Sheraton Addis',
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
        const { error } = await supabase.from('bookings').insert([
            {
                user_id: user.id,
                event_date: formData.date,
                location: formData.venue,
                guest_count: formData.guests,
                budget: formData.budget * 10000, // example
                preferences: { theme: formData.theme },
                status: 'pending',
            }
        ]);
        setLoading(false);

        if (error) {
            alert("Error saving booking: " + error.message);
        } else {
            alert("Booking successfully submitted to Wedding Addis concierges!");
            window.location.href = '/dashboard';
        }
    };

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24 min-h-screen">
                <header className="text-center mb-16">
                    <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight text-on-surface mb-4">Craft Your Celebration</h1>
                    <p className="text-on-surface-variant max-w-lg mx-auto italic font-headline text-lg">Every legacy begins with a single intentional choice. Let us weave your story together.</p>
                </header>

                <div className="relative mb-12 px-4">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-outline-variant/30 -translate-y-1/2"></div>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                        className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-500"
                    ></motion.div>
                    <div className="relative flex justify-between">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => setStep(s)}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 ring-background transition-colors duration-300 ${s <= step ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                                    {s}
                                </div>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${s <= step ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {['Identity', 'Details', 'Mood', 'Vision'][s - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-12">
                    {step === 4 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface-container-lowest rounded-lg p-8 md:p-12 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 tibeb-pattern opacity-10 rotate-12 -translate-y-8 translate-x-8"></div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Budget &amp; Preferences</h2>
                                        <p className="text-sm text-on-surface-variant">We tailor every detail to your scale and style.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Theme Direction</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {['Traditional Heritage', 'Modern Minimalist', 'Luxe Grandeur'].map(t => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setFormData({ ...formData, theme: t })}
                                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all group ${formData.theme === t ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 hover:bg-surface-container-low'}`}
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
                                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant">Investment Range</label>
                                            <input
                                                type="range" min="1" max="5"
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <div className="flex justify-between text-[10px] font-bold text-on-surface-variant px-1">
                                                <span>BOUTIQUE</span>
                                                <span>PREMIUM</span>
                                                <span>SIGNATURE</span>
                                                <span>ULTRA LUXE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Selected Moods</h3>
                                        <p className="text-sm text-on-surface-variant">Items from your inspiration board.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container-high"></div>
                                        <div className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container-high"></div>
                                        <div className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container-high"></div>
                                        <div className="relative group aspect-square rounded-lg overflow-hidden bg-surface-container flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 hover:border-primary transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-outline">add_circle</span>
                                            <span className="text-[10px] font-bold mt-1 text-on-surface-variant">ADD MORE</span>
                                        </div>
                                    </div>

                                    <div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/10">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-primary">info</span>
                                            <p className="text-xs text-on-surface-variant leading-relaxed">Your selections help our wedding concierges match you with the perfect Ethiopian heritage vendors.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}

                    {step < 4 && (
                        <div className="bg-surface-container-lowest p-12 text-center rounded-lg shadow-sm">
                            <p className="text-xl font-headline text-on-surface-variant">Please fill out the {['Identity', 'Details', 'Mood'][step - 1]} information.</p>
                            <button
                                onClick={() => setStep(step + 1)}
                                className="mt-6 px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-colors"
                            >
                                Continue Next Step
                            </button>
                        </div>
                    )}
                </div>

                {step === 4 && (
                    <div className="mt-12 pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <button onClick={() => setStep(3)} className="flex items-center gap-2 text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Mood
                        </button>
                        <button
                            onClick={handleBookingSubmit}
                            disabled={loading}
                            className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl font-bold tracking-wide shadow-[0_10px_30px_-10px_rgba(115,92,0,0.4)] hover:shadow-[0_15px_40px_-10px_rgba(115,92,0,0.6)] hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {loading ? 'Submitting...' : 'Send to Wedding Addis'}
                        </button>
                    </div>
                )}

            </main>
            <Footer />
        </>
    );
}
