'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function VenuesExplorer() {
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenue, setSelectedVenue] = useState<any>(null);

    useEffect(() => {
        const fetchVenues = async () => {
            const { data, error } = await supabase.from('venues').select('*');
            if (data) {
                setVenues(data);
            }
            setLoading(false);
        };
        fetchVenues();
    }, []);

    // Use static fallbacks for UI layout if no data yet (for presentation)
    const defaultVenues = [
        {
            id: '1',
            name: 'Sheraton Addis',
            location: 'Bole, Addis Ababa',
            capacity: 1500,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBTO75ATLLxIMGxfHSryR5zWEG1AXO5slRut80_Z3FAT23AxueYURycYRsvfHnzg-dzSVGX-WnpLDXuaFaMK8iw3NPTc9eHodn3cD_RvVt4A_sn-bIcs454A0rBiRftdFGPx3mYxRksFHD8l8rlheoTtRRr-fDETf7n7bwI1TCI6pNt-jeAlaAKC3ifcJcM_mLq2gV0LCDAWUuxcpFbmK0JvYtJnmbJ7yIyd17Mm37voxY7Sh0njddi7fEP5J3kmuQu_zeG7Azuh_U'],
            description: 'Luxurious grand ballroom with crystal chandeliers, gold trimmings, and elegant flower arrangements in a high-end Addis hotel',
        },
        {
            id: '2',
            name: 'Skylight Hotel',
            location: 'Airport Road, Addis Ababa',
            capacity: 2000,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAMd24SZENpYYTg4dLkItpCbvgsv5hM1g2dAHBiMv8P95E41R1qxWioQhI-gAYsSInnHJ5ghEFmSjidhgJL4SRTM_ppbpoyIuXwj4KA4FxhNMCa_80v7Bg1a6gNGC1NYtaV3Oq2IrzjxzLaa5WHxM3mpFJ9QGh5khmO0CN6LKRpQg-vT1OhBtFO0fDb0gOVKk-ni8bMAFttVQedDEglSYFHrpVNMcWlJogPn3pnGMILVZar5r7lUnIVItx1IzqBkl9pcg_8oz24w9E'],
            description: 'Modern architectural marvel hotel interior with high ceilings, marble floors and floor-to-ceiling windows overlooking Addis Ababa',
        },
        {
            id: '3',
            name: 'Ghion Garden Halls',
            location: 'Stadium, Addis Ababa',
            capacity: 800,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBySZBU-_ci83O7Uf2v9yuV-18jQNMBg21uN-yt_tvlDGsiTClc88SNJAj9lhsT_6XOuZPfz7-oC8Sljo5sWxHOc5kU2dzhEeKy-s5mMF1kep3dJuJ1-PbyKkQ0EjikXpn191T7AnnIaowk7nguw4-xFCVDlKfXesG1CkVk8231VFVNeJRH9tO6rdu3nicf1UBdUswbZZtNJcQyCkyoIGeehAk3EXOKjCnviXxALNtk4PtyBjs3Vx63-bhxWM6n3GgH_GsOPkuDcGs'],
            description: 'Lush green garden setting with traditional Ethiopian white tents and colorful flora at golden hour',
        },
        {
            id: '4',
            name: 'Kuriftu Bishoftu',
            location: 'Bishoftu (Debre Zeyit)',
            capacity: 500,
            images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCd-478I1RH8FjSL-CPHiugg5m5buWedXHlTGtGAo_DGzKyRtPsJSu9WV4ItHZhRJn1ljCLqOlD0sV4kFa-jAJrme81fdDpAX6fDgju6lvwGlHC_qI4PMP8ot5HrVucHZX0nud8VGHNTZx3BXfIKlLAde0wNgz542Yf6vkf_9PR3xy9QJpwGjodOrW81iGA8JZLLxtwhPMGyFwxTgUo2SIqxr7fWI5ZGV7iaqQZEv43RgGwuauK3k4vL2LB7x3Qonp5qoVN_02D7N4'],
            description: 'Lakeside resort with traditional straw-roof huts and luxury lounge area overlooking a serene lake at sunset',
        }
    ];

    const displayVenues = venues.length > 0 ? venues : defaultVenues;

    return (
        <>
            <Header />
            <main className="min-h-screen">
                <section className="px-8 pt-12 pb-8 max-w-screen-2xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="font-headline text-5xl font-bold text-secondary mb-4 tracking-tight">Discover Grandeur</h1>
                            <p className="text-on-surface-variant max-w-lg leading-relaxed">From the palatial halls of Bole to hidden garden gems in the highlands, find the perfect stage for your heritage wedding.</p>
                        </div>
                        <div className="flex gap-4 items-center bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                            <div className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-surface-container transition-colors rounded-lg">
                                <span className="material-symbols-outlined text-primary">filter_list</span>
                                <span className="text-sm font-medium">Filter Venues</span>
                            </div>
                            <div className="h-6 w-px bg-outline-variant/30"></div>
                            <button className="bg-surface-container-lowest px-6 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-surface-container transition-colors">Sort by Rating</button>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[800px] border-t-4 border-amber-600/10">
                    <div className="lg:col-span-7 p-8 bg-surface-container-low/30 overflow-y-auto hide-scrollbar max-h-[800px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {displayVenues.map((venue, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={venue.id}
                                        onClick={() => setSelectedVenue(venue)}
                                        className="group relative bg-surface-container-lowest rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                src={venue.images[0]}
                                                alt={venue.name}
                                            />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span className="text-xs font-bold">4.9</span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-headline text-xl font-bold text-on-surface">{venue.name}</h3>
                                                <span className="text-primary font-bold">$$$</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                <span>{venue.location}</span>
                                            </div>
                                            <div className="flex gap-4 mb-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-outline">Capacity</span>
                                                    <span className="text-sm font-bold">{venue.capacity} Guests</span>
                                                </div>
                                                <div className="w-px h-8 bg-outline-variant/30"></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-wider text-outline">Type</span>
                                                    <span className="text-sm font-bold">Luxury Venue</span>
                                                </div>
                                            </div>
                                            <button className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 rounded-xl font-bold text-sm tracking-wide transition-all group-hover:shadow-lg group-hover:shadow-primary/20">
                                                Select Venue
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5 relative bg-surface-container-highest min-h-[500px] overflow-hidden">
                        <div className="absolute inset-0 bg-stone-200 tibeb-pattern opacity-40"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full p-12">
                                <div className="absolute bottom-10 left-10 bg-surface/90 backdrop-blur px-4 py-3 rounded-xl shadow-xl border border-outline-variant/20 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                        <span className="text-xs font-bold">Selected Venue</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                        <span className="text-xs font-bold">Available Venues</span>
                                    </div>
                                </div>

                                <div className="absolute top-10 right-10 flex flex-col gap-2">
                                    <button className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary-container transition-colors">
                                        <span className="material-symbols-outlined">add</span>
                                    </button>
                                    <button className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary-container transition-colors">
                                        <span className="material-symbols-outlined">remove</span>
                                    </button>
                                    <button className="bg-surface p-3 rounded-full shadow-lg hover:bg-primary-container transition-colors">
                                        <span className="material-symbols-outlined">my_location</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {selectedVenue && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 100, opacity: 0 }}
                                    className="absolute bottom-8 right-8 left-8 bg-surface-container-lowest/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-primary/10"
                                >
                                    <div className="flex gap-6 relative">
                                        <button
                                            onClick={() => setSelectedVenue(null)}
                                            className="absolute -top-2 -right-2 bg-surface rounded-full p-1 text-on-surface-variant hover:text-primary z-10 shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                        <img
                                            className="w-32 h-32 object-cover rounded-xl shadow-inner"
                                            src={selectedVenue.images[0]}
                                            alt={selectedVenue.name}
                                        />
                                        <div className="flex-1">
                                            <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block">Featured Venue</span>
                                            <h4 className="font-headline text-2xl font-bold text-on-surface mb-1">{selectedVenue.name}</h4>
                                            <p className="text-sm text-on-surface-variant mb-4 line-clamp-2">{selectedVenue.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-secondary text-sm">groups</span>
                                                        <span className="text-xs font-bold">{selectedVenue.capacity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-secondary text-sm">restaurant</span>
                                                        <span className="text-xs font-bold">Full Catering</span>
                                                    </div>
                                                </div>
                                                <button className="text-primary font-bold text-sm underline underline-offset-4">Explore Gallery</button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>

                <div className="w-full h-12 tibeb-pattern"></div>

                <section className="py-24 px-8 max-w-screen-2xl mx-auto">
                    <h2 className="font-headline text-4xl font-bold text-center text-secondary mb-16 italic">Curated Collections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[400px]">
                            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_yfBodKGj8HqZECvreOIzZafAxNX_ObmesoWcQ0J6ziAWAE12MqkAiqcMtIX7CTKCi5r9WjnxpNSgPLRBX0zcrrINO1XUB7eDHEZR5xgQNWXVEN6av47r0odtLBVJ9vopr1qNtp1j6Z1-7Za423H44t20J7hnvKktkVci5kiCNrrDP_rP6ZyFeCLgiDSf_JbrN0xXdPoqDz8ifN1NJU8eo9CO7DLy7HEJBCX7-jdPm2G-FP6JlYawUO7c77pW_9bL-BJeaUjzAcs" alt="Highland Heights" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                                <h3 className="text-white font-headline text-3xl font-bold mb-2">Highland Heights</h3>
                                <p className="text-white/80 text-sm max-w-sm mb-6">Breathtaking panoramic views of the Entoto mountains for an unforgettable ceremony.</p>
                                <button className="w-fit text-primary-fixed font-bold border-b border-primary-fixed pb-1">Browse 12 Venues</button>
                            </div>
                        </div>
                        <div className="md:col-span-2 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[240px]">
                            <img className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFr9Qq7_I6GHw6cYjnROpoYkMfy2mKDa0eyuUYmvWbbiDUtBBFeYMIqiXMhJlVcljw8wr7WJazHArDJ2ts0Ufw9_3FCo0DrWPIiw6EPxZ0BuHx2N_IBzyToTHfxNTlnbHe4D6rimhefdA2_CP45Oq85b5AkQTWrdNWEFkCI3UplfzhMKDSdYHjC0tuRuUs3BjXfSN4dH3r0ubTLOsfYzxH7MAqFxB7lKeoStwy5IKZq8VRoINjm1IrvcEZAJSCw_-n9Os1FOFaY2g" alt="Boutique & Modern" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-white font-headline text-2xl font-bold">Boutique &amp; Modern</h3>
                                <button className="w-fit text-primary-fixed font-bold text-sm border-b border-primary-fixed">Browse 8 Venues</button>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[240px]">
                            <img className="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc6asv-ti8aa6HGSGD1sgs2vD0TgcEE-Tx2OoZtgScj-t5-Xj_5sCCOrhBjUrUzofcp3FfuRjPpVP1dK0KugwCcJ7pOS15HAnUzJEO6jocH31mkVSjYtFPeEVcHZko3EBBioK8JyGmUXElOxARHp_fl9dfl_-p6D6R19Fb9zCuX6U3giRUAgBaLMISWL6n6ZBm2ORLXVhKNp4gyGl3NL3fd2ISe84I4FwJDuH1t5P6poVtRxLQxTECH0DuNPovdFOAlbNl14A9ZEg" alt="Resorts" />
                            <div className="absolute inset-0 bg-primary/20 flex flex-col justify-center items-center p-6 text-center">
                                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Resorts</h3>
                                <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full font-bold">Destination</span>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[240px]">
                            <img className="absolute inset-0 w-full h-full object-cover opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNIjnDvmxi7JmiDyxtZ7z0Q0gm1MfyXhiBIckXeUpcw6v0rgPyjXLACfrdej7DJRMgFts7A2wowS9tpXPrdqyqLa7WeyYmDBOClx4xcQiJGNHv8cgIaLoHHJ3joJmGJTA1THEay6zd43Nhvbanx8z6Mbh7gv0uS7jlqp3oaROnrtWLE8F8Qp8AO2RqUUZscSppS9kGQOQaQ8HZDE3NB4d8rRmNGihpFZFwL-oeSsuPPjQtwqhrQ7y9YjY3xn4oUus1j145Ddrb59c" alt="Garden Estates" />
                            <div className="absolute inset-0 bg-secondary/20 flex flex-col justify-center items-center p-6 text-center">
                                <h3 className="font-headline text-xl font-bold text-on-surface mb-2">Garden Estates</h3>
                                <span className="text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full font-bold">Traditional</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
