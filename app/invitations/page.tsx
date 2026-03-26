'use client';

import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

export default function InvitationBuilder() {
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);

    const [data, setData] = useState({
        template: 'minimalist',
        partner1: 'Abebe',
        partner2: 'Helina',
        date: 'January 12, 2025',
        time: "4:00 PM",
        venue: 'Sheraton Addis, Ethiopia',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiNY3KP8aM7nbeMg0J117_MtRjKFO5wxv2oHuO3CeApOW28ZkTaR0rTxYD7WN8eQU1c1RclTZHEbxKOljZwadnvt4prpSdskbUhcZBQ7OpvzJ1yEZEshygDbvS9BQSPNYFlMe8EK6sBZ40upQKSxnlBO5_t5eUzJQc1Ehq0LK7PbqIlccGCidI4QgFVtuHOEKtM1P1NpOeC0_HUamdJgjRsfXmAY75c_txynHSQ5XQr0ubn4o46zdZRiPJ5T3B53JoQUEzWOiapBc'
    });

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    }, []);

    const handleSaveInvitation = async () => {
        if (!user) return alert("Please log in to save your invitation.");
        setSaving(true);

        // In a real app we would upload the generated image from previewRef or just save the DB record and redirect to a sharable page.
        // For this prototype, we'll save the json settings to DB.
        // We'll generate a dummy URL to place in the QR code
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://weddingaddis.com';
        const uniqueUrl = `${origin}/invite/${user.id}-${Date.now()}`;

        const { error } = await supabase.from('invitations').insert([
            {
                user_id: user.id,
                template: data.template,
                data: data,
                qr_code_url: uniqueUrl
            }
        ]);

        setSaving(false);
        if (error) {
            alert("Error saving: " + error.message);
        } else {
            alert("Invitation saved successfully!");
            window.location.href = '/dashboard';
        }
    };
    const generateShareText = () => {
        let text = `Hello! Here is my invitation draft from Wedding Addis.\nMy registered email is: ${user?.email}\n\n`;
        text += `Couple: ${data.partner1} & ${data.partner2}\n`;
        text += `Date: ${data.date} at ${data.time}\n`;
        text += `Venue: ${data.venue}\n`;
        text += `Template Style: ${data.template}\n`;
        return encodeURIComponent(text);
    };

    const handleShareWhatsApp = () => {
        window.open(`https://wa.me/0973094991?text=${generateShareText()}`, '_blank');
    };

    const handleShareEmail = () => {
        window.location.href = `mailto:ketewodros41@gmail.com?subject=My Wedding Invitation Draft&body=${generateShareText()}`;
    };

    return (
        <div className="bg-background text-on-surface font-body min-h-screen selection:bg-primary-container selection:text-on-primary-container">
            <Header />

            <main className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] overflow-hidden">
                {/* Left Panel: Customization Controls */}
                <aside className="w-full lg:w-[450px] bg-surface-container-low/50 backdrop-blur-md p-8 lg:overflow-y-auto border-r border-outline-variant/20 z-10 flex flex-col justify-between">
                    <div>
                        <header className="mb-10">
                            <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Invite Builder</h1>
                            <p className="text-on-surface-variant font-body">Craft your digital heirloom with Ethiopian heritage.</p>
                        </header>

                        <div className="space-y-12">
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">1</span>
                                    <h2 className="text-xl font-bold">Select Template</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setData({ ...data, template: 'minimalist' })}
                                        className={`group relative aspect-[4/5] rounded-lg overflow-hidden border-2 p-1 bg-surface-container-lowest transition-colors ${data.template === 'minimalist' ? 'border-primary' : 'border-outline-variant/30'}`}
                                    >
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJm-aslpHrCTolduNjZ6jldI-UNtwfrNbPN9D_hhErBMNtkd4dYi4y5IVHM3MmbRH0VOu5Y07_1KdkIpHxwtgN34A7veES2Aeiu1bBmOfXB9coXvJNiBGHQm8ei-THpfYuMAtcMnmQeODw_g9Fssg4linPz0ahj2mRsCOwFikaoTUkB8x7nLro_FsOytqDoQCeLv8xVeF2xSWznsVMKhLsvpc6uJmu2oXIP0fhfwAWc9JIJNHJmTjlnTafpKLAfnpHzcXtPBJGm80" alt="minimalist template" className="w-full h-full object-cover rounded-md opacity-80 group-hover:opacity-100 transition-opacity" />
                                        {data.template === 'minimalist' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            </div>
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setData({ ...data, template: 'floral' })}
                                        className={`group relative aspect-[4/5] rounded-lg overflow-hidden border-2 p-1 bg-surface-container-lowest transition-colors ${data.template === 'floral' ? 'border-primary' : 'border-outline-variant/30 hover:border-primary/50'}`}
                                    >
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgAYPO1oCZTKXKLyNUDFawQ2kEjOHTLP_c8EZnwADSPNS5OpYb7AO7D4Q-QBcIGmjQIVyZhfXrnM-zCAoA9dJR_1gE-9p0SKUmIhJ8pBOuCWE4YEtaswuw8w3keqb8cpgi4Fs_QunZXKGX7fZZg_80WokF2x3LxCxHnhAWavvB2j5tLTeueX3yGMRQ3nAJlfgtkTWAH07z08rgU1pwU9A4avwYVBFbdl7C2yOPDSIZeqyBSoXxb2MGV2_drmm4WTlcdegw3IDSFIk" alt="floral template" className="w-full h-full object-cover rounded-md opacity-60 group-hover:opacity-100 transition-opacity" />
                                        {data.template === 'floral' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">2</span>
                                    <h2 className="text-xl font-bold">The Couple</h2>
                                </div>
                                <div className="space-y-5">
                                    <div className="relative">
                                        <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Partner One</label>
                                        <input
                                            type="text"
                                            value={data.partner1}
                                            onChange={(e) => setData({ ...data, partner1: e.target.value })}
                                            className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Partner Two</label>
                                        <input
                                            type="text"
                                            value={data.partner2}
                                            onChange={(e) => setData({ ...data, partner2: e.target.value })}
                                            className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">3</span>
                                    <h2 className="text-xl font-bold">Date &amp; Venue</h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-5">
                                    <div className="relative">
                                        <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Date</label>
                                        <input
                                            type="text"
                                            value={data.date}
                                            onChange={(e) => setData({ ...data, date: e.target.value })}
                                            className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                        />
                                    </div>
                                    <div className="relative">
                                        <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Time</label>
                                        <input
                                            type="text"
                                            value={data.time}
                                            onChange={(e) => setData({ ...data, time: e.target.value })}
                                            className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Location</label>
                                    <input
                                        type="text"
                                        value={data.venue}
                                        onChange={(e) => setData({ ...data, venue: e.target.value })}
                                        className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                    />
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">4</span>
                                    <h2 className="text-xl font-bold">Featured Photo URL</h2>
                                </div>
                                <div className="relative">
                                    <label className="absolute -top-2.5 left-4 bg-surface-container-low px-1 text-xs font-semibold text-primary">Image URL</label>
                                    <input
                                        type="text"
                                        value={data.photo}
                                        onChange={(e) => setData({ ...data, photo: e.target.value })}
                                        className="w-full bg-surface-container-high border-none rounded-xl px-5 py-4 focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                                    />
                                </div>
                            </section>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-3">
                        <button
                            onClick={handleSaveInvitation}
                            disabled={saving}
                            className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-md"
                        >
                            <span className="material-symbols-outlined">save</span>
                            {saving ? 'Saving...' : 'Save & Generate RSVPs'}
                        </button>
                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <button
                                onClick={handleShareWhatsApp}
                                className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">chat</span>
                                WhatsApp
                            </button>
                            <button
                                onClick={handleShareEmail}
                                className="w-full bg-surface-container-high text-on-surface border border-outline-variant py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all shadow-sm"
                            >
                                <span className="material-symbols-outlined text-lg">mail</span>
                                Email
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Right Panel: Live Preview */}
                <section className="flex-1 bg-surface-container p-4 lg:p-12 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-container/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

                    {/* Preview Canvas */}
                    <div
                        ref={previewRef}
                        className={`w-full max-w-[500px] aspect-[1/1.4] bg-surface-container-lowest rounded-lg shadow-[0_20px_50px_rgba(115,92,0,0.08)] relative overflow-hidden flex flex-col items-center text-center p-1 ${data.template === 'floral' ? 'bg-amber-50' : 'bg-surface-container-lowest'}`}
                    >
                        {data.template === 'minimalist' ? (
                            <div className="absolute inset-4 border-[12px] border-double border-primary/20 pointer-events-none rounded-sm"></div>
                        ) : (
                            <div className="absolute inset-2 border-[4px] border-dashed border-amber-800/20 pointer-events-none rounded-lg"></div>
                        )}
                        <div className="absolute top-0 inset-x-0 h-16 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20z\' fill=\'%23735c00\' fill-opacity=\'0.05\'/%3E%3C/svg%3E')] opacity-60"></div>
                        <div className="absolute bottom-0 inset-x-0 h-16 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0l20 20-20 20L0 20z\' fill=\'%23735c00\' fill-opacity=\'0.05\'/%3E%3C/svg%3E')] opacity-60 scale-y-[-1]"></div>

                        <div className="z-10 w-full h-full flex flex-col px-10 py-16 overflow-y-auto hide-scrollbar">
                            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-8">Save the Date</span>
                            <div className="relative w-48 h-48 mx-auto mb-10 group overflow-visible flex-shrink-0">
                                <div className="absolute -inset-2 bg-primary/10 rounded-full rotate-3"></div>
                                <img className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl relative z-10" src={data.photo} alt="Couple" />
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg z-20">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                </div>
                            </div>

                            <h3 className={`font-serif italic text-4xl text-primary mb-2 ${data.template === 'floral' ? 'text-amber-800' : ''}`}>{data.partner1} &amp; {data.partner2}</h3>
                            <div className="w-12 h-0.5 bg-primary-container mx-auto mb-6 shrink-0"></div>

                            <p className="font-serif text-lg text-on-surface-variant leading-relaxed mb-6">
                                Together with our families, we invite you to celebrate our union as we embark on a lifelong journey of love and heritage.
                            </p>

                            <div className="mt-auto space-y-4 mb-8">
                                <div className="flex flex-col">
                                    <span className="font-bold text-on-surface text-xl uppercase">{data.date}</span>
                                    <span className="text-sm text-on-surface-variant uppercase tracking-widest font-medium">at {data.time}</span>
                                </div>
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-base">location_on</span>
                                    <span className="font-serif italic text-lg">{data.venue}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2 mt-auto">
                                <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Scan to RSVP</span>
                                <div className="p-2 bg-white rounded-lg shadow-sm border border-outline-variant/10">
                                    <QRCodeSVG value={`${typeof window !== 'undefined' ? window.location.origin : 'https://weddingaddis.com'}/invite/preview`} size={80} level="M" />
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
