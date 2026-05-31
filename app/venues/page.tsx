'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Users, Star, Filter, ArrowRight, X, Navigation, Info, Search } from 'lucide-react';
import VenueMap from '@/components/VenueMap';

export default function VenuesExplorer() {
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState<any>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const defaultVenues = [
        {
            id: '1',
            name: 'Sheraton Addis',
            location: 'Bole, Addis Ababa',
            capacity: 1500,
            type: 'Luxury Hotel',
            price: '$$$$',
            rating: 4.9,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBTO75ATLLxIMGxfHSryR5zWEG1AXO5slRut80_Z3FAT23AxueYURycYRsvfHnzg-dzSVGX-WnpLDXuaFaMK8iw3NPTc9eHodn3cD_RvVt4A_sn-bIcs454A0rBiRftdFGPx3mYxRksFHD8l8rlheoTtRRr-fDETf7n7bwI1TCI6pNt-jeAlaAKC3ifcJcM_mLq2gV0LCDAWUuxcpFbmK0JvYtJnmbJ7yIyd17Mm37voxY7Sh0njddi7fEP5J3kmuQu_zeG7Azuh_U'],
            description: 'Luxurious grand ballroom with crystal chandeliers, gold trimmings, and elegant flower arrangements in the heart of the capital.',
        },
        {
            id: '2',
            name: 'Skylight Hotel',
            location: 'Airport Road, Addis Ababa',
            capacity: 2000,
            type: 'Modern Hotel',
            price: '$$$$',
            rating: 4.8,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAMd24SZENpYYTg4dLkItpCbvgsv5hM1g2dAHBiMv8P95E41R1qxWioQhI-gAYsSInnHJ5ghEFmSjidhgJL4SRTM_ppbpoyIuXwj4KA4FxhNMCa_80v7Bg1a6gNGC1NYtaV3Oq2IrzjxzLaa5WHxM3mpFJ9QGh5khmO0CN6LKRpQg-vT1OhBtFO0fDb0gOVKk-ni8bMAFttVQedDEglSYFHrpVNMcWlJogPn3pnGMILVZar5r7lUnIVItx1IzqBkl9pcg_8oz24w9E'],
            description: 'Modern architectural marvel with high ceilings, marble floors and floor-to-ceiling windows overlooking the city.',
        },
        {
            id: '3',
            name: 'Ghion Garden Halls',
            location: 'Stadium, Addis Ababa',
            capacity: 800,
            type: 'Garden Estate',
            price: '$$$',
            rating: 4.7,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBySZBU-_ci83O7Uf2v9yuV-18jQNMBg21uN-yt_tvlDGsiTClc88SNJAj9lhsT_6XOuZPfz7-oC8Sljo5sWxHOc5kU2dzhEeKy-s5mMF1kep3dJuJ1-PbyKkQ0EjikXpn191T7AnnIaowk7nguw4-xFCVDlKfXesG1CkVk8231VFVNeJRH9tO6rdu3nicf1UBdUswbZZtNJcQyCkyoIGeehAk3EXOKjCnviXxALNtk4PtyBjs3Vx63-bhxWM6n3GgH_GsOPkuDcGs'],
            description: 'Lush green garden setting with traditional Ethiopian white tents and colorful flora at golden hour.',
        },
        {
            id: '4',
            name: 'Kuriftu Bishoftu',
            location: 'Bishoftu (Debre Zeyit)',
            capacity: 500,
            type: 'Resort',
            price: '$$$$',
            rating: 4.9,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCd-478I1RH8FjSL-CPHiugg5m5buWedXHlTGtGAo_DGzKyRtPsJSu9WV4ItHZhRJn1ljCLqOlD0sV4kFa-jAJrme81fdDpAX6fDgju6lvwGlHC_qI4PMP8ot5HrVucHZX0nud8VGHNTZx3BXfIKlLAde0wNgz542Yf6vkf_9PR3xy9QJpwGjodOrW81iGA8JZLLxtwhPMGyFwxTgUo2SIqxr7fWI5ZGV7iaqQZEv43RgGwuauK3k4vL2LB7x3Qonp5qoVN_02D7N4'],
            description: 'Lakeside resort with traditional architecture and luxury lounge area overlooking a serene volcanic lake.',
        }
    ];

    useEffect(() => {
        setIsMounted(true);
        const fetchVenues = async () => {
            const { data, error } = await supabase.from('venues').select('*');
            if (data && data.length > 0) {
                setVenues(data);
            } else {
                setVenues(defaultVenues);
            }
            setLoading(false);
        };
        fetchVenues();
    }, []);

    const filteredVenues = (venues.length > 0 ? venues : defaultVenues).filter(v =>
        (v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.location.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (activeFilter === 'All' || v.type?.toLowerCase().includes(activeFilter.toLowerCase()))
    );

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-stone-200 font-sans selection:bg-amber-500/30">
            <Header />

            <main className="max-w-[1800px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Explorer Content */}
                <div className={`lg:col-span-7 space-y-12 ${selectedVenue ? 'hidden lg:block' : 'block'}`}>

                    {/* Header Section */}
                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl md:text-7xl font-serif italic text-white tracking-tight"
                        >
                            Heritage <br />
                            <span className="text-amber-500 not-italic uppercase text-4xl md:text-5xl font-sans font-bold tracking-[0.2em] block mt-2">Venues</span>
                        </motion.h1>
                        <p className="text-stone-400 max-w-xl text-lg leading-relaxed">
                            Discover the most atmospheric stages for your cinematic union. From the palatial halls of Addis to serene lakeside resorts.
                        </p>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 group w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 group-focus-within:text-amber-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-stone-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-stone-600 shadow-inner"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar shrink-0 w-full md:w-auto">
                            {['All', 'Hotel', 'Garden', 'Resort'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={`px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all border ${activeFilter === f ? 'bg-white text-black border-white' : 'bg-stone-900/50 text-stone-500 border-white/5 hover:border-white/20'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Venues Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="aspect-[4/5] bg-stone-900/50 animate-pulse rounded-3xl border border-white/5"></div>
                            ))
                        ) : (
                            filteredVenues.map((venue, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    key={venue.id}
                                    onClick={() => setSelectedVenue(venue)}
                                    className={`group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-700 border-4 ${selectedVenue?.id === venue.id ? 'border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'border-transparent'}`}
                                >
                                    <img
                                        src={venue.images?.[0]}
                                        alt={venue.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                                    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                        <span className="text-[10px] font-bold text-white">{venue.rating || 4.9}</span>
                                    </div>

                                    <div className="absolute bottom-8 left-8 right-8 space-y-3">
                                        <div className="flex justify-between items-end gap-4">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-1">{venue.type || 'Luxury Venue'}</p>
                                                <h3 className="text-3xl font-serif italic text-white leading-tight">{venue.name}</h3>
                                            </div>
                                            <span className="text-sm font-bold text-white/50">{venue.price || '$$$'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-stone-400 text-xs">
                                            <MapPin className="w-3 h-3 text-stone-600" />
                                            <span>{venue.location}</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{venue.capacity} GUESTS</span>
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                        {!loading && filteredVenues.length === 0 && (
                            <div className="col-span-full py-20 text-center space-y-4 border-2 border-dashed border-white/5 rounded-[3rem]">
                                <X className="w-12 h-12 text-stone-800 mx-auto" />
                                <p className="text-stone-500 italic uppercase text-[10px] tracking-widest">No heritage stages found for your search.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Interaction & Map (Sticky) */}
                <div className={`lg:col-span-5 h-[calc(100vh-200px)] sticky top-32 space-y-6 ${selectedVenue ? 'block' : 'hidden lg:block'}`}>
                    <AnimatePresence mode="wait">
                        {selectedVenue ? (
                            <motion.div
                                key={selectedVenue.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full flex flex-col space-y-6"
                            >
                                {/* Active Venue Card */}
                                <div className="bg-stone-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 space-y-8 flex-1 overflow-y-auto hide-scrollbar custom-scrollbar">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            {/* Mobile-only back button */}
                                            <button
                                                onClick={() => setSelectedVenue(null)}
                                                className="lg:hidden flex items-center gap-2 text-stone-500 hover:text-white transition-colors mb-4 text-[10px] font-bold uppercase tracking-widest pl-1"
                                            >
                                                <ArrowRight className="w-3 h-3 rotate-180" />
                                                Back to Venues
                                            </button>
                                            <h2 className="text-4xl font-serif italic text-white leading-tight">{selectedVenue.name}</h2>
                                            <p className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px]">{selectedVenue.location}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedVenue(null)}
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                                        <img src={selectedVenue.images?.[0]} className="w-full h-full object-cover" alt="Detail" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 text-stone-400">
                                            <Info className="w-4 h-4 text-stone-600 mt-1 flex-shrink-0" />
                                            <p className="text-sm italic leading-relaxed">"{selectedVenue.description}"</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Capacity</p>
                                                <p className="text-xl font-bold text-white">{selectedVenue.capacity}</p>
                                            </div>
                                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-1">
                                                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Pricing Model</p>
                                                <p className="text-xl font-bold text-white">{selectedVenue.price}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Real Map Integration */}
                                    {isMounted && (
                                        <VenueMap
                                            address={selectedVenue.name + ", " + selectedVenue.location}
                                            theme="dark"
                                            className="mt-4"
                                        />
                                    )}

                                    <button className="w-full py-5 bg-white hover:bg-stone-200 text-black rounded-2xl font-bold tracking-[0.2em] uppercase text-xs transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98]">
                                        Request Availability Protocol
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full rounded-[3rem] bg-stone-900/20 border-2 border-dashed border-white/5 flex flex-col items-center justify-center p-12 text-center space-y-6"
                            >
                                <div className="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center border border-white/5">
                                    <Navigation className="w-8 h-8 text-stone-700 animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-stone-500 uppercase tracking-widest">Select a Venue</h3>
                                    <p className="text-stone-700 text-sm italic">Reveal the spatial profile and interactive coordinates.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </main>

            <Footer />
        </div>
    );
}
