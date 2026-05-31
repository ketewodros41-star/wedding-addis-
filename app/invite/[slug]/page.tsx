'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { QRCodeSVG } from 'qrcode.react';
import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import VenueMap from '@/components/VenueMap';

const TEMPLATES = [
    { id: 'ethereal', name: 'Ethereal Gold', bg: 'bg-black', text: 'text-amber-100' },
    { id: 'parchment', name: 'Vintage Parchment', bg: 'bg-parchment', text: 'text-stone-900' },
    { id: 'velvet', name: 'Midnight Velvet', bg: 'bg-velvet', text: 'text-purple-100' },
    { id: 'luxury', name: 'Modern Luxury', bg: 'bg-stone-950', text: 'text-stone-100' },
    { id: 'habesha', name: 'Royal Habesha', bg: 'bg-amber-900', text: 'text-amber-50' },
    { id: 'floral', name: 'Garden Romance', bg: 'bg-rose-50', text: 'text-rose-950' },
    { id: 'minimal', name: 'Clean Editorial', bg: 'bg-white', text: 'text-stone-900' },
    { id: 'cinematic', name: 'Cinematic Story', bg: 'bg-black', text: 'text-white' }
];

const FILTERS = [
    { id: 'none', class: '' },
    { id: 'grayscale', class: 'grayscale' },
    { id: 'sepia', class: 'sepia' },
    { id: 'saturate-150 contrast-110', class: 'saturate-150 contrast-110' },
];

export default function VisitorInvitationPage() {
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            setPageUrl(window.location.href);
        });

        return () => window.cancelAnimationFrame(frame);
    }, []);

    const data = {
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
    };

    const activeTemplate = TEMPLATES.find(t => t.id === data.template) || TEMPLATES[0];

    return (
        <div className={`min-h-svh ${activeTemplate.bg} ${activeTemplate.text} selection:bg-amber-600/30 overflow-x-hidden`}>
            <Header />

            <main className="w-full">
                {/* Cinematic Hero */}
                <div className="relative min-h-svh w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
                    <motion.div className="absolute inset-0 z-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 5, ease: "easeOut" }}>
                        <Image
                            src={data.photo}
                            alt="Cover"
                            fill
                            priority
                            sizes="100vw"
                            unoptimized
                            className={`object-cover ${FILTERS.find(f => f.id === data.photoFilter)?.class}`}
                        />
                        <div
                            className="absolute inset-0"
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
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent lg:hidden"></div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 text-center flex flex-col items-center max-w-4xl"
                    >
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] mb-6 lg:mb-8 text-white/70 drop-shadow-md">{data.heroSubtitle}</p>
                        <h1 className={`text-4xl sm:text-6xl lg:text-8xl ${data.fontFamily} ${data.fontFamily === 'font-script' ? '' : 'italic'} mb-6 lg:mb-8 leading-[0.95] text-white drop-shadow-2xl`}>
                            {data.partner1} <br /><span className="opacity-50 text-3xl sm:text-4xl">&amp;</span><br /> {data.partner2}
                        </h1>
                        <div className="h-px w-20 sm:w-24 bg-linear-to-r from-transparent via-white to-transparent mb-6 lg:mb-8"></div>
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-lg">{data.date}</p>
                    </motion.div>
                </div>

                {/* Narrative Section */}
                <div className={`px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-40 text-center space-y-8 lg:space-y-12 relative z-10 ${activeTemplate.bg}`}>
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }}>
                        <h2 className={`text-2xl sm:text-3xl lg:text-5xl ${data.fontFamily} italic mb-8 capitalize`}>{data.loreTitle}</h2>
                        <p className="text-sm sm:text-base lg:text-lg leading-relaxed opacity-80 max-w-xs sm:max-w-md lg:max-w-2xl mx-auto italic">&quot;{data.story}&quot;</p>
                    </motion.div>
                </div>

                {/* Logistics Section */}
                <div className="px-4 sm:px-6 lg:px-10 py-20 sm:py-24 lg:py-40 bg-black/5 dark:bg-white/5 text-center relative z-10 border-y border-current/10">
                    <h2 className={`text-2xl sm:text-3xl lg:text-5xl ${data.fontFamily} italic mb-12 lg:mb-24`}>{data.chaptersTitle}</h2>

                    <div className="space-y-20 lg:space-y-32 max-w-3xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6">
                            <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-4 border-b border-current/20 pb-2 inline-block">{data.ceremonyTitle}</div>
                            <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{data.venue}</h3>
                            <p className="text-xs sm:text-base uppercase tracking-[0.2em] opacity-70">Starts at {data.time}</p>
                            <div className="rounded-3xl overflow-hidden shadow-2xl mt-8">
                                <VenueMap
                                    address={data.venue}
                                    theme={activeTemplate.id === 'parchment' ? 'sepia' : (['floral', 'minimal'].includes(activeTemplate.id) ? 'light' : 'dark')}
                                />
                            </div>
                        </motion.div>

                        {data.multiEvent && (
                            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 pt-12">
                                <div className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 mb-4 border-b border-current/20 pb-2 inline-block">{data.melseTitle}</div>
                                <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{data.melseVenue}</h3>
                                <p className="text-xs sm:text-base uppercase tracking-[0.2em] opacity-70">{data.melseDate}</p>
                                <div className="rounded-3xl overflow-hidden shadow-2xl mt-8">
                                    <VenueMap
                                        address={data.melseVenue}
                                        theme={activeTemplate.id === 'parchment' ? 'sepia' : (['floral', 'minimal'].includes(activeTemplate.id) ? 'light' : 'dark')}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Engagement Section */}
                <div className={`px-4 sm:px-6 py-20 lg:py-32 text-center relative z-10 flex flex-col items-center gap-8 ${activeTemplate.bg}`}>
                    <div className="h-px w-24 lg:w-32 bg-current/20 mb-4"></div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.3em] opacity-60 ${data.fontFamily}`}>Scan to Open Digital Invitation</p>
                    <div className="p-4 bg-white rounded-[2rem] shadow-2xl max-w-full overflow-hidden">
                        {pageUrl && (
                            <QRCodeSVG
                                value={pageUrl}
                                size={180}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                                includeMargin={true}
                            />
                        )}
                    </div>
                    <button className="flex items-center gap-2 px-8 py-4 bg-current/10 hover:bg-current/15 transition-all rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                        <Share2 className="w-4 h-4" /> Share This Union
                    </button>
                    <p className="text-[8px] opacity-30 font-mono tracking-widest mt-4">
                        DESIGNED BY WEDDING ADDIS CINEMATIC STUDIO
                    </p>
                </div>
            </main>
        </div>
    );
}