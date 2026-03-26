'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

export default function PlannerPage() {
    const [venueCost, setVenueCost] = useState(150000);
    const [cateringCost, setCateringCost] = useState(85000);
    const [decorCost, setDecorCost] = useState(45000);
    const [photoCost, setPhotoCost] = useState(60000);

    const totalEstimate = venueCost + cateringCost + decorCost + photoCost;
    const averageCost = 280000;
    const percentage = Math.min((totalEstimate / 500000) * 100, 100);

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
            <Header />

            <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-20 space-y-24 flex-1 w-full">
                {/* Hero Branding Section */}
                <section className="text-center space-y-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Planning Excellence</span>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface">Precision in Every Detail</h1>
                    <p className="text-on-surface-variant max-w-2xl mx-auto text-lg italic">Organize your heritage-inspired celebration with our bespoke financial and timing tools.</p>
                </section>

                {/* Section 1: Budget Estimator */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-7 space-y-10">
                        <div className="space-y-2">
                            <h2 className="font-headline text-3xl font-bold">Budget Estimator</h2>
                            <p className="text-on-surface-variant">Adjust the sliders to see how your vision aligns with your investment.</p>
                        </div>

                        <div className="grid gap-10">
                            {/* Venue Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">location_on</span>
                                        Venue &amp; Space
                                    </label>
                                    <span className="font-label text-primary font-bold">ETB {venueCost.toLocaleString()}</span>
                                </div>
                                <input className="w-full h-1 bg-surface-variant rounded-full appearance-none outline-none target:border-transparent accent-primary" max="1000000" min="50000" step="10000" type="range" value={venueCost} onChange={(e) => setVenueCost(parseInt(e.target.value))} />
                            </div>

                            {/* Catering Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">restaurant</span>
                                        Traditional Catering
                                    </label>
                                    <span className="font-label text-primary font-bold">ETB {cateringCost.toLocaleString()}</span>
                                </div>
                                <input className="w-full h-1 bg-surface-variant rounded-full appearance-none outline-none target:border-transparent accent-primary" max="500000" min="20000" step="5000" type="range" value={cateringCost} onChange={(e) => setCateringCost(parseInt(e.target.value))} />
                            </div>

                            {/* Decor Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                                        Decor &amp; Tibeb Textiles
                                    </label>
                                    <span className="font-label text-primary font-bold">ETB {decorCost.toLocaleString()}</span>
                                </div>
                                <input className="w-full h-1 bg-surface-variant rounded-full appearance-none outline-none target:border-transparent accent-primary" max="250000" min="10000" step="2500" type="range" value={decorCost} onChange={(e) => setDecorCost(parseInt(e.target.value))} />
                            </div>

                            {/* Photography Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="font-semibold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">photo_camera</span>
                                        Photography &amp; Film
                                    </label>
                                    <span className="font-label text-primary font-bold">ETB {photoCost.toLocaleString()}</span>
                                </div>
                                <input className="w-full h-1 bg-surface-variant rounded-full appearance-none outline-none target:border-transparent accent-primary" max="200000" min="15000" step="5000" type="range" value={photoCost} onChange={(e) => setPhotoCost(parseInt(e.target.value))} />
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 sticky top-24">
                        <div className="relative p-1 bg-gradient-to-br from-primary-container to-primary rounded-lg overflow-hidden">
                            <div className="bg-surface-container-lowest rounded-[1.8rem] p-10 space-y-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <span className="material-symbols-outlined text-[8rem]">account_balance_wallet</span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-on-surface-variant">Estimated Total</h3>
                                    <div className="text-5xl font-bold text-primary tracking-tighter">ETB {totalEstimate.toLocaleString()}</div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-on-surface-variant italic">Average local wedding cost</span>
                                        <span className="font-bold">ETB {(averageCost / 1000)}k</span>
                                    </div>
                                    <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                                        <div className="bg-secondary h-full transition-all duration-300 ease-out" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <p className="text-xs text-on-surface-variant">
                                        {totalEstimate > averageCost ? `Your budget is ${Math.round(((totalEstimate - averageCost) / averageCost) * 100)}% above the local average for Addis Ababa celebrations.` : `Your budget is ${Math.round(((averageCost - totalEstimate) / averageCost) * 100)}% below the local average for Addis Ababa celebrations.`}
                                    </p>
                                </div>

                                <button onClick={() => window.location.href = '/booking'} className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold flex justify-center items-center gap-3 hover:shadow-xl transition-shadow">
                                    Save My Budget
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Wedding Timeline Planner */}
                <section className="space-y-16">
                    <div className="text-center space-y-2">
                        <h2 className="font-headline text-3xl font-bold">Wedding Timeline Planner</h2>
                        <p className="text-on-surface-variant">Mapping the journey from the proposal to the reception.</p>
                    </div>

                    <div className="relative p-8 md:p-16 rounded-lg bg-surface-container-low" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l20 20-20 20L0 20z' fill='%23d4af37' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")" }}>
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary-container/30 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-16 relative">
                            {/* Milestone 1: Left */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                                <div className="w-full md:w-[45%] text-right space-y-4">
                                    <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                                        <h4 className="font-headline text-xl font-bold">Engagement Ceremony</h4>
                                        <p className="text-sm text-on-surface-variant">Traditional 'Telosh' and family gathering arrangements.</p>
                                        <div className="mt-4 flex items-center justify-end gap-3">
                                            <label className="text-xs font-semibold text-secondary">COMPLETE</label>
                                            <input checked readOnly className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-on-primary ring-8 ring-background">
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </div>
                                <div className="hidden md:block md:w-[45%] text-left italic text-on-surface-variant font-label text-sm uppercase tracking-widest">Month 1</div>
                            </div>

                            {/* Milestone 2: Right */}
                            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-0">
                                <div className="w-full md:w-[45%] text-left space-y-4">
                                    <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                                        <h4 className="font-headline text-xl font-bold">Venue Booking</h4>
                                        <p className="text-sm text-on-surface-variant">Securing the Grand Ballroom and finalizing the guest list capacity.</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <input checked readOnly className="rounded border-outline-variant text-secondary focus:ring-secondary" type="checkbox" />
                                            <label className="text-xs font-semibold text-secondary">COMPLETE</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-primary rounded-full flex items-center justify-center text-on-primary ring-8 ring-background">
                                    <span className="material-symbols-outlined">foundation</span>
                                </div>
                                <div className="hidden md:block md:w-[45%] text-right italic text-on-surface-variant font-label text-sm uppercase tracking-widest">Month 3</div>
                            </div>

                            {/* Milestone 3: Left */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
                                <div className="w-full md:w-[45%] text-right space-y-4">
                                    <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10 ring-2 ring-primary-container ring-offset-4 ring-offset-surface-container-low">
                                        <h4 className="font-headline text-xl font-bold">Invitation Sending</h4>
                                        <p className="text-sm text-on-surface-variant">Distributing custom-designed parchment invites with gold accents.</p>
                                        <div className="mt-4 flex items-center justify-end gap-3">
                                            <label className="text-xs font-semibold text-primary">IN PROGRESS</label>
                                            <input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-surface-container-highest border-4 border-primary rounded-full flex items-center justify-center text-primary ring-8 ring-background">
                                    <span className="material-symbols-outlined">mail</span>
                                </div>
                                <div className="hidden md:block md:w-[45%] text-left italic text-primary font-label text-sm uppercase tracking-widest">Month 6 (Current)</div>
                            </div>

                            {/* Milestone 4: Right */}
                            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-0">
                                <div className="w-full md:w-[45%] text-left space-y-4">
                                    <div className="bg-surface-container-lowest/60 p-6 rounded-lg shadow-sm border border-outline-variant/10 opacity-70">
                                        <h4 className="font-headline text-xl font-bold text-on-surface-variant">The Big Day</h4>
                                        <p className="text-sm text-on-surface-variant">The celebration of unity and heritage in the heart of Addis.</p>
                                        <div className="mt-4 flex items-center gap-3">
                                            <input className="rounded border-outline-variant text-primary bg-surface-container-high" disabled type="checkbox" />
                                            <label className="text-xs font-semibold text-on-surface-variant">UPCOMING</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface-variant ring-8 ring-background">
                                    <span className="material-symbols-outlined">celebration</span>
                                </div>
                                <div className="hidden md:block md:w-[45%] text-right italic text-on-surface-variant font-label text-sm uppercase tracking-widest">Month 12</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Signature Editorial Component */}
                <section className="relative py-20 px-8 rounded-lg overflow-hidden bg-surface-container-high">
                    <div className="absolute inset-0 z-0">
                        <img alt="Close-up of golden embroidery on traditional Ethiopian white cotton fabric with blurred wedding background" className="w-full h-full object-cover opacity-20 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1CZahf8WMPa2HdOLuSAZwtqsN2-wl8-rbM4nm75ZCSaJIiU2X1AtkYdfAPDmdc5CcwGW0AYA_mhMRuw506nMI-HfSzoOwQ49yOQ58GrJncETPfv45tfCzpz9mTTPdj5UAg8txzKJAXcZOhOIqmUE0hLkYKv7VvZKT_Kw3V5Xrzg1DvSDdJk7BQVzsd0eba_bQZZisucE7fJwB-SZYCvQ9oDQIClw31io9HgH1aTdqy2M9C-jhe5V7JJF9Tj1LSeD8qwGtpA9lky4" />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="font-headline text-4xl font-bold leading-tight">Your heritage, <br />our craftsmanship.</h3>
                            <p className="text-lg italic">We believe that a wedding isn't just an event, it's a legacy. Every tool we build is designed to honor the traditions that bring us together.</p>
                        </div>
                        <div className="flex justify-center">
                            <div onClick={() => window.location.href = '/booking'} className="cursor-pointer hover:scale-105 transition-transform w-64 h-64 bg-surface rounded-full flex items-center justify-center p-4 ring-8 ring-primary/10">
                                <div className="text-center">
                                    <span className="material-symbols-outlined text-primary text-5xl mb-2">verified</span>
                                    <div className="font-headline font-bold text-2xl">Premium</div>
                                    <div className="text-xs uppercase tracking-widest text-on-surface-variant">Planning Tool</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
