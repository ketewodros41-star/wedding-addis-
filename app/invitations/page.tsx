'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/layout/Header';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, Type, Users, Palette, LayoutTemplate, MapPin, Calendar,
    CheckCircle2, Share2, Eye, Music, Sparkles, Wand2, Layers, Move3d
} from 'lucide-react';
import VenueMap from '@/components/VenueMap';

const TEMPLATES = [
    { id: 'ethereal', name: 'Ethereal Gold', icon: '✨', category: 'Premium', bg: 'bg-black', text: 'text-amber-100', accent: '#d4af37', border: 'gold-border' },
    { id: 'parchment', name: 'Vintage Parchment', icon: '📜', category: 'Classic', bg: 'bg-parchment', text: 'text-stone-900', accent: '#4a3728' },
    { id: 'velvet', name: 'Midnight Velvet', icon: '🌌', category: 'Atmospheric', bg: 'bg-velvet', text: 'text-purple-100', accent: '#a855f7' },
    { id: 'luxury', name: 'Modern Luxury', icon: '💎', category: 'Luxury', bg: 'bg-stone-950', text: 'text-stone-100', accent: '#d4af37' },
    { id: 'habesha', name: 'Royal Habesha', icon: '👑', category: 'Traditional', bg: 'bg-amber-900', text: 'text-amber-50', accent: '#ffd700' },
    { id: 'floral', name: 'Garden Romance', icon: '🌸', category: 'Floral', bg: 'bg-rose-50', text: 'text-rose-950', accent: '#f43f5e' },
    { id: 'minimal', name: 'Clean Editorial', icon: '📖', category: 'Minimal', bg: 'bg-white', text: 'text-stone-900', accent: '#000000' },
    { id: 'cinematic', name: 'Cinematic Story', icon: '🎬', category: 'Cinematic', bg: 'bg-black', text: 'text-white', accent: '#ffffff' }
];

const FONTS = [
    { id: 'font-playfair', name: 'Playfair Display' },
    { id: 'font-script', name: 'Great Vibes Script' },
    { id: 'font-amharic', name: 'Amharic (Ethiopic)' },
    { id: 'font-cinzel', name: 'Cinzel Decorative' },
    { id: 'font-montserrat', name: 'Montserrat Clean' },
    { id: 'font-serif', name: 'Classic Serif' },
];

const FILTERS = [
    { id: 'none', name: 'Original', class: '' },
    { id: 'grayscale', name: 'Noir', class: 'grayscale' },
    { id: 'sepia', name: 'Vintage', class: 'sepia' },
    { id: 'saturate-150 contrast-110', name: 'Cinematic', class: 'saturate-150 contrast-110' },
];

const EFFECTS = [
    { id: 'none', name: 'None', icon: '🚫' },
    { id: 'gold-dust', name: 'Gold Dust', icon: '✨' },
    { id: 'petals', name: 'Falling Petals', icon: '🌸' },
    { id: 'bokeh', name: 'Cinematic Haze', icon: '🌫️' }
];

const MUSIC_TRACKS = [
    { id: 'none', name: 'No Music' },
    { id: 'habesha-inst', name: 'Traditional Instrumental (Kirar)' },
    { id: 'orchestral', name: 'Cinematic Strings' },
    { id: 'jazz', name: 'Smooth Jazz Ambient' }
];

export default function NextGenInvitationStudio() {
    const [user, setUser] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('templates');
    const [invitationSlug, setInvitationSlug] = useState('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [showAiAssistant, setShowAiAssistant] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const [data, setData] = useState({
        template: 'habesha',
        partner1: 'Abeba',
        partner2: 'Dawit',
        date: 'October 14, 2026',
        time: '4:00 PM',
        venue: 'Skylight Grand Ballroom, Addis Ababa',
        photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiNY3KP8aM7nbeMg0J117_MtRjKFO5wxv2oHuO3CeApOW28ZkTaR0rTxYD7WN8eQU1c1RclTZHEbxKOljZwadnvt4prpSdskbUhcZBQ7OpvzJ1yEZEshygDbvS9BQSPNYFlMe8EK6sBZ40upQKSxnlBO5_t5eUzJQc1Ehq0LK7PbqIlccGCidI4QgFVtuHOEKtM1P1NpOeC0_HUamdJgjRsfXmAY75c_txynHSQ5XQr0ubn4o46zdZRiPJ5T3B53JoQUEzWOiapBc',
        story: 'Our journey began in the heart of Addis. Through seasons of joy and growth, we have built a foundation of love. We are honored to invite you to celebrate the beginning of our forever.',
        fontFamily: 'font-playfair',
        photoFilter: 'saturate-150 contrast-110',
        customMessage: 'Join us for an evening of joy, dancing, and traditional celebration.',
        effect: 'gold-dust',
        music: 'habesha-inst',
        multiEvent: false,
        melseVenue: 'Sheraton Addis, Gaslight',
        melseDate: 'October 16, 2026',
        heroSubtitle: 'A Cinematic Union',
        loreTitle: 'The Lore',
        chaptersTitle: 'The Chapters',
        ceremonyTitle: 'Chapter 1: The Ceremony',
        melseTitle: 'Chapter 2: The Melse',
    });

    useEffect(() => {
        const loadInitialData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data: bookingData } = await supabase
                    .from('bookings')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (bookingData) {
                    setData(prev => ({
                        ...prev,
                        partner1: bookingData.bride_name?.split(' ')[0] || prev.partner1,
                        partner2: bookingData.groom_name?.split(' ')[0] || prev.partner2,
                        date: new Date(bookingData.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }),
                        venue: bookingData.location || prev.venue,
                        photo: bookingData.preferences?.photo_url || prev.photo
                    }));
                    setInvitationSlug(bookingData.slug || `${user.id.slice(0, 4)}-wedding`);
                }
            }
        };
        loadInitialData();
        setIsMounted(true);
    }, []);

    const handleSaveInvitation = async () => {
        if (!user) return alert("Please log in to save your invitation.");
        setSaving(true);

        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://weddingaddis.com';
        const fallbackSlug = `${data.partner1}-${data.partner2}`.toLowerCase().replace(/\s+/g, '-');
        const finalSlug = invitationSlug || fallbackSlug;
        const uniqueUrl = `${origin}/invite/${finalSlug}`;

        const { error } = await supabase.from('invitations').upsert([
            {
                user_id: user.id,
                template: data.template,
                data: data,
                slug: finalSlug,
                qr_code_url: uniqueUrl,
                is_public: true
            }
        ], { onConflict: 'slug' });

        setSaving(false);
        if (error) {
            alert("Error saving: " + error.message);
        } else {
            alert("Your cinematic invitation is live: " + uniqueUrl);
            window.location.href = '/dashboard';
        }
    };

    const activeTemplate = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];

    return (
        <div className="bg-[#0a0a0a] text-stone-200 font-body h-screen flex flex-col overflow-hidden selection:bg-amber-600/30">
            {/* Minimalist Top Nav for Studio */}
            <Header />
            <header className="h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-tr from-amber-600 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(217,119,6,0.5)]">
                        <Wand2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-serif italic text-xl tracking-wide text-white">Cinematic Studio</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowAiAssistant(!showAiAssistant)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                        <Sparkles className="w-3 h-3" /> AI Co-Pilot
                    </button>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden relative">

                {/* Spatial Left Panel: Adaptive Controls */}
                <aside className={`w-full lg:w-[480px] xl:w-[500px] bg-stone-900/80 backdrop-blur-2xl border-r border-white/5 z-20 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isPreviewMode ? 'hidden lg:flex lg:-translate-x-full absolute h-full' : 'flex'}`}>

                    {/* Floating Navigation */}
                    <div className="p-6 pb-2">
                        <nav className="flex space-x-1 p-1 bg-black/50 rounded-2xl border border-white/5 shadow-inner">
                            {[
                                { id: 'templates', icon: LayoutTemplate, label: 'Theme' },
                                { id: 'details', icon: Users, label: 'Data' },
                                { id: 'wording', icon: Type, label: 'Words' },
                                { id: 'design', icon: Move3d, label: 'Spatial' },
                                { id: 'audio', icon: Music, label: 'Sense' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300 ${activeTab === tab.id ? 'bg-stone-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-amber-500 border border-white/10' : 'text-stone-500 hover:text-stone-300 hover:bg-white/5'}`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {activeTab === 'templates' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-3xl font-serif italic text-white mb-2">Visual Soul</h2>
                                            <p className="text-sm text-stone-400">Select the atmospheric foundation for your story.</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {TEMPLATES.map(t => (
                                                <button
                                                    key={t.id}
                                                    onClick={() => setData({ ...data, template: t.id })}
                                                    className={`relative group overflow-hidden rounded-2xl border text-left p-6 transition-all duration-500 ${data.template === t.id ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                                    <div className="flex justify-between items-center mb-3 relative z-10">
                                                        <span className="text-3xl filter drop-shadow-lg">{t.icon}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">{t.category}</span>
                                                    </div>
                                                    <h3 className="font-serif italic text-xl text-white relative z-10">{t.name}</h3>
                                                    {data.template === t.id && (
                                                        <div className="absolute top-4 right-4 text-amber-500">
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-serif italic text-white mb-6">Logistics & Lore</h2>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2 group">
                                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors group-focus-within:text-amber-500">Partner One</label>
                                                        <input type="text" value={data.partner1} onChange={e => setData({ ...data, partner1: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" />
                                                    </div>
                                                    <div className="space-y-2 group text-left">
                                                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors group-focus-within:text-amber-500">Partner Two</label>
                                                        <input type="text" value={data.partner2} onChange={e => setData({ ...data, partner2: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 group">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors group-focus-within:text-amber-500">Dates & Temporality</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <input type="text" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                        <input type="text" value={data.time} onChange={e => setData({ ...data, time: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                    </div>
                                                </div>

                                                <div className="space-y-2 group text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 transition-colors group-focus-within:text-amber-500">Spatial Coordinates (Venue)</label>
                                                    <input type="text" value={data.venue} onChange={e => setData({ ...data, venue: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                </div>

                                                <div className="pt-4 border-t border-white/5">
                                                    <label className="flex items-center gap-3 cursor-pointer">
                                                        <input type="checkbox" checked={data.multiEvent} onChange={e => setData({ ...data, multiEvent: e.target.checked })} className="accent-amber-500 w-4 h-4 rounded bg-black/50 border-white/10" />
                                                        <span className="text-sm font-bold text-white">Add Multi-Event (e.g. Melse)</span>
                                                    </label>
                                                </div>

                                                {data.multiEvent && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="grid grid-cols-2 gap-4 pt-2 overflow-hidden">
                                                        <div className="space-y-2 group">
                                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Melse Date</label>
                                                            <input type="text" value={data.melseDate} onChange={e => setData({ ...data, melseDate: e.target.value })} className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-4 text-sm text-amber-100 outline-none transition-all shadow-inner" />
                                                        </div>
                                                        <div className="space-y-2 group">
                                                            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Melse Venue</label>
                                                            <input type="text" value={data.melseVenue} onChange={e => setData({ ...data, melseVenue: e.target.value })} className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-4 text-sm text-amber-100 outline-none transition-all shadow-inner" />
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'wording' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-serif italic text-white mb-6">Wording & Lore</h2>
                                            <div className="space-y-8">
                                                <div className="space-y-4 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Hero Section</label>
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Subtitle</p>
                                                        <input type="text" value={data.heroSubtitle} onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Narrative & Labels</label>
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Lore Header</p>
                                                        <input type="text" value={data.loreTitle} onChange={(e) => setData({ ...data, loreTitle: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Story Text</p>
                                                        <textarea value={data.story} onChange={(e) => setData({ ...data, story: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500/50 outline-none transition-all h-24 resize-none shadow-inner" />
                                                    </div>
                                                </div>

                                                <div className="space-y-4 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500">Event Headings</label>
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Chapters Title</p>
                                                        <input type="text" value={data.chaptersTitle} onChange={(e) => setData({ ...data, chaptersTitle: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Ceremony Title</p>
                                                        <input type="text" value={data.ceremonyTitle} onChange={(e) => setData({ ...data, ceremonyTitle: e.target.value })} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-sm focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                    </div>
                                                    {data.multiEvent && (
                                                        <div className="space-y-3">
                                                            <p className="text-[10px] text-white/30 uppercase tracking-widest">Melse Title</p>
                                                            <input type="text" value={data.melseTitle} onChange={(e) => setData({ ...data, melseTitle: e.target.value })} className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-4 text-amber-100 text-sm focus:border-amber-500/50 outline-none transition-all shadow-inner" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'design' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-serif italic text-white mb-6">Spatial Aesthetics</h2>
                                            <div className="space-y-8">
                                                <div className="space-y-3 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2"><Camera className="w-3 h-3" /> Cinematic Color Grade</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {FILTERS.map(f => (
                                                            <button key={f.id} onClick={() => setData({ ...data, photoFilter: f.id })} className={`relative aspect-video rounded-xl overflow-hidden border ${data.photoFilter === f.id ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/10 hover:border-white/30'}`}>
                                                                <img src={data.photo} className={`w-full h-full object-cover ${f.class}`} alt={f.name} />
                                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                    <span className="text-white text-[10px] font-bold uppercase tracking-widest">{f.name}</span>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-stone-500 flex items-center gap-2"><Type className="w-3 h-3" /> Typographic Engine</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {FONTS.map(f => (
                                                            <button key={f.id} onClick={() => setData({ ...data, fontFamily: f.id })} className={`px-5 py-4 rounded-xl border text-left flex justify-between items-center transition-all ${data.fontFamily === f.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-inner' : 'border-white/10 bg-black/50 hover:border-white/30 text-white'}`}>
                                                                <span className={`text-xl ${f.id} ${f.id === 'font-script' ? '' : 'italic'}`}>
                                                                    {f.id === 'font-amharic' ? 'ሰላም (Amharic)' : `Aa — ${f.name}`}
                                                                </span>
                                                                {data.fontFamily === f.id && <CheckCircle2 className="w-4 h-4" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'audio' && (
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-3xl font-serif italic text-white mb-6">Sensory Experience</h2>
                                            <div className="space-y-8">
                                                <div className="space-y-4 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2"><Music className="w-3 h-3" /> Background Soundscape</label>
                                                    <div className="space-y-2">
                                                        {MUSIC_TRACKS.map(m => (
                                                            <button key={m.id} onClick={() => setData({ ...data, music: m.id })} className={`w-full px-5 py-4 rounded-xl border text-left flex justify-between items-center transition-all ${data.music === m.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-white/10 bg-black/50 hover:border-white/30 text-white'}`}>
                                                                <span className="text-sm font-bold tracking-wide">{m.name}</span>
                                                                {data.music === m.id && (
                                                                    <div className="flex gap-1 items-end h-4 w-4">
                                                                        <motion.div animate={{ height: ['40%', '100%', '60%'] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-amber-500 rounded-full" />
                                                                        <motion.div animate={{ height: ['80%', '40%', '100%'] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 bg-amber-500 rounded-full" />
                                                                        <motion.div animate={{ height: ['60%', '100%', '40%'] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-amber-500 rounded-full" />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 text-left">
                                                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 flex items-center gap-2"><Layers className="w-3 h-3" /> Environmental Effects</label>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {EFFECTS.map(e => (
                                                            <button key={e.id} onClick={() => setData({ ...data, effect: e.id })} className={`px-4 py-6 rounded-xl border flex flex-col items-center gap-2 transition-all ${data.effect === e.id ? 'border-amber-500/50 bg-amber-500/10 text-amber-400' : 'border-white/10 bg-black/50 hover:border-white/30 text-white'}`}>
                                                                <span className="text-3xl">{e.icon}</span>
                                                                <span className="text-[10px] font-bold tracking-widest uppercase">{e.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-stone-900/90 backdrop-blur-3xl">
                        {invitationSlug && (
                            <div className="mb-4 p-4 bg-black/40 rounded-xl flex items-center justify-between border border-white/10 shadow-inner">
                                <div className="overflow-hidden mr-4">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 mb-1">Live Link</p>
                                    <a href={`/invite/${invitationSlug}`} target="_blank" rel="noreferrer" className="text-amber-500 text-xs truncate block hover:text-amber-400 transition-colors">
                                        {typeof window !== 'undefined' ? window.location.host : 'weddingaddis.com'}/invite/<br />{invitationSlug}
                                    </a>
                                </div>
                                <div className="flex flex-col items-center gap-1 opacity-50">
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                                        <Share2 className="w-3 h-3" />
                                    </div>
                                    <span className="text-[8px] font-bold">READY</span>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={handleSaveInvitation}
                            disabled={saving}
                            className="relative w-full py-4 bg-white hover:bg-stone-200 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 group hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
                            <Share2 className="w-4 h-4" />
                            {saving ? 'Rendering Protocol...' : 'Publish & Finalize Cinematic'}
                        </button>
                    </div>
                </aside>

                {/* Right Panel: Infinite Live Canvas */}
                <section className={`flex-1 bg-black relative overflow-hidden flex flex-col items-center justify-center p-4 lg:p-12 ${isPreviewMode ? 'flex' : 'hidden lg:flex'}`}>

                    {/* Ambient Canvas Lighting */}
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-900/20 rounded-full blur-[150px] -mr-96 -mt-96 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-rose-900/10 rounded-full blur-[150px] -ml-96 -mb-96 pointer-events-none"></div>

                    {/* Toggle Preview Button */}
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className="absolute top-6 right-6 z-50 bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-xl text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all hover:scale-105"
                    >
                        {isPreviewMode ? <><LayoutTemplate className="w-4 h-4" /> Return to Board</> : <><Eye className="w-4 h-4" /> Immersive Mode</>}
                    </button>

                    {/* Smart Canvas Device Frame (Spatial Depth) */}
                    <motion.div
                        layout
                        className={`relative w-full max-w-[420px] lg:h-[850px] lg:max-h-[90vh] h-full rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.1)] lg:border-[10px] border-stone-900 bg-black transition-all duration-700 ${activeTemplate.bg} ${activeTemplate.text} ${isPreviewMode ? 'lg:scale-110 shadow-[0_0_150px_rgba(245,158,11,0.1)]' : ''}`}
                    >
                        {/* Dynamic Render Surface */}
                        <div className="w-full h-full overflow-y-auto hide-scrollbar scroll-smooth perspective-1000">

                            {/* Cinematic Hero */}
                            <div className="relative h-screen w-full flex flex-col items-center justify-center preserve-3d">
                                <motion.div className="absolute inset-0 z-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 5, ease: "easeOut" }}>
                                    <img src={data.photo} className={`w-full h-full object-cover ${FILTERS.find(f => f.id === data.photoFilter)?.class}`} alt="Cover" />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40"
                                        style={{
                                            background: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.4), ${activeTemplate.id === 'floral' ? '#fff1f2' :
                                                activeTemplate.id === 'minimal' ? '#ffffff' :
                                                    activeTemplate.id === 'habesha' ? '#78350f' :
                                                        activeTemplate.id === 'luxury' ? '#0c0a09' :
                                                            activeTemplate.id === 'parchment' ? '#f4e4bc' :
                                                                activeTemplate.id === 'velvet' ? '#0f051a' :
                                                                    '#000000'
                                                })`
                                        }}
                                    ></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative z-10 text-center px-8 flex flex-col items-center transform translate-z-50"
                                >
                                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mb-8 text-white/70 drop-shadow-md">{data.heroSubtitle}</p>
                                    <h1 className={`text-6xl sm:text-7xl ${data.fontFamily} ${data.fontFamily === 'font-script' ? '' : 'italic'} mb-8 leading-[0.9] text-white drop-shadow-2xl`}>
                                        {data.partner1} <br /><span className="opacity-50 text-4xl">&amp;</span><br /> {data.partner2}
                                    </h1>
                                    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white to-transparent mb-8"></div>
                                    <p className="text-sm font-bold uppercase tracking-widest text-white/90 drop-shadow-lg">{data.date}</p>
                                </motion.div>
                            </div>

                            {/* Narrative Flow */}
                            <div className={`px-10 py-32 text-center space-y-10 relative z-10 ${activeTemplate.bg}`}>
                                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                                    <h2 className={`text-4xl ${data.fontFamily} italic mb-8 capitalize`}>{data.loreTitle}</h2>
                                    <p className="text-sm leading-relaxed opacity-80 max-w-xs mx-auto italic">"{data.story}"</p>
                                </motion.div>
                            </div>

                            {/* Logistics & Multi-Event Spatial Block */}
                            <div className="px-10 py-32 bg-black/10 dark:bg-white/5 text-center relative z-10 border-y border-current/10">
                                <h2 className={`text-4xl ${data.fontFamily} italic mb-20`}>{data.chaptersTitle}</h2>

                                <div className="space-y-20 max-w-sm mx-auto">
                                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-6">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-4 border-b border-current/20 pb-2 inline-block">{data.ceremonyTitle}</div>
                                        <h3 className="text-2xl font-bold">{data.venue}</h3>
                                        <p className="text-sm uppercase tracking-widest opacity-70">Starts at {data.time}</p>
                                        <VenueMap
                                            address={data.venue}
                                            theme={activeTemplate.id === 'parchment' ? 'sepia' : (['floral', 'minimal'].includes(activeTemplate.id) ? 'light' : 'dark')}
                                            className="mt-6"
                                        />
                                    </motion.div>
                                    {data.multiEvent && (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-6">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-4 border-b border-current/20 pb-2 inline-block">{data.melseTitle}</div>
                                            <h3 className="text-2xl font-bold">{data.melseVenue}</h3>
                                            <p className="text-sm uppercase tracking-widest opacity-70">{data.melseDate}</p>
                                            <VenueMap
                                                address={data.melseVenue}
                                                theme={activeTemplate.id === 'parchment' ? 'sepia' : (['floral', 'minimal'].includes(activeTemplate.id) ? 'light' : 'dark')}
                                                className="mt-6"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </div>

                            {/* Integrated QR Code Section */}
                            <div className={`px-10 py-24 text-center relative z-10 flex flex-col items-center gap-6 ${activeTemplate.bg}`}>
                                <div className="h-[1px] w-32 bg-current/20 mb-4"></div>
                                <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 ${data.fontFamily}`}>Scan to Open Digital Invitation</p>
                                <div className={`p-4 bg-white rounded-2xl shadow-2xl transition-transform hover:scale-105 ${activeTemplate.id === 'ethereal' ? 'ring-4 ring-amber-500/20' : ''}`}>
                                    {isMounted && (
                                        <QRCodeSVG
                                            value={`${window.location.origin}/invite/${invitationSlug || `${data.partner1}-${data.partner2}`.toLowerCase().replace(/\s+/g, '-')}`}
                                            size={140}
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                            level="H"
                                            includeMargin={true}
                                        />
                                    )}
                                </div>
                                <p className="text-[10px] opacity-40 font-mono tracking-tighter">
                                    {invitationSlug ? `weddingaddis.com/invite/${invitationSlug}` : `weddingaddis.com/invite/${data.partner1.toLowerCase()}-${data.partner2.toLowerCase()}`}
                                </p>
                            </div>
                        </div>

                        {/* Faux Device Home Indicator */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50"></div>
                    </motion.div>

                </section>
            </main>
        </div >
    );
}