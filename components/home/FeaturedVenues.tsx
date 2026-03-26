'use client';

import { motion } from 'framer-motion';

export default function FeaturedVenues() {
    const venues = [
        {
            name: 'Skylight Grand Ballroom',
            capacity: '1500 Guests • Bole, Addis Ababa',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY1aqFZR2gOL9lZTP-_PVWhWOqPxvPsfznPVPoZhyWrTE_cxeFG614bAmJBmVRPUdbcLcs_FML8cVnKpyxxU4c9KFe-05nOHqcrl-d15IL4CVcT6j6RdfhTHbRPpswnTCi3QJBhAe29pRCoamq4VTzLfZGFBD4lEbLeN83huAn8suyhPiU0SRjguOd8xuQJHN4HafcWD7gHTg7T5FhyzDf1-iIwqTxBhhtqTxVCru-jhYi_RP6nLggK81XOzIqESFH-1OS-LO3mSs',
        },
        {
            name: 'Entoto Forest Gardens',
            capacity: '400 Guests • Entoto Hills',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQW8k8P_d2b-_cneDSAYLy6seE4U5uyrfBX87vWbEMh0JSLHFW4GxggjDPSZ2sWBBpPuB_4Vpq8eXfLW6YaY9mzUkigIPokyAUQ2xAbUQ-ARgh9Eb5P80a_n-ZdtvUae4uFGzCrU6mEb9RrPE7rOSCVtyJDBOzT1ywdT0eay5cpxNLj9g1riIbQrbrGZrezk93ZPWZQGqFU-nb5vciH46-_arA2WuXEnM4zMDpRBBTFwnanIt_rLgWr_biUFc9OoR2SrK3QpV11YI',
        },
        {
            name: 'The Hyatt Regency Terrace',
            capacity: '250 Guests • Meskel Square',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaRTpRSenyBc2V5VBs5rRM0_tmXB9SUrFSUvEvqlZU2qvuyd_k0hPHE39vsst1P3U_g6PFRXsZyNbOmcNaKi_2NO2i72akDidi6_tao2lDHE9ZD9-uzNp_CtVWWW91ejDVSD2QmLPvVy6kvewVkRB8bZzb75QHlMCYBAOgTQW-mnaqDCJS3nSSNC7k9wzv4r-W3N4UF2w9EtKbgwd6EefQHRhmGcDE67M7p8cGXlSAyiwRRXN7jsHW9tILh9A8cU1ihVoK5FBtXEw',
        },
    ];

    return (
        <section className="py-24 bg-surface overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-8 mb-12 flex justify-between items-end">
                <div>
                    <span className="text-primary font-bold tracking-widest uppercase text-sm block mb-4">Elite Locations</span>
                    <h2 className="font-headline text-4xl font-bold text-on-surface">Featured Venues</h2>
                </div>
                <div className="flex gap-4">
                    <button className="p-3 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button className="p-3 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-8 px-8 overflow-x-auto no-scrollbar pb-12 snap-x snap-mandatory">
                {venues.map((venue, index) => (
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        key={index}
                        className="min-w-[400px] h-[550px] relative rounded-lg overflow-hidden group snap-center shadow-xl"
                    >
                        <img
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            src={venue.image}
                            alt={venue.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 glass-panel bg-black/20 m-4 rounded-lg border border-white/10">
                            <h3 className="font-headline text-2xl text-white mb-2">{venue.name}</h3>
                            <p className="text-white/80 text-sm mb-4">Capacity: {venue.capacity}</p>
                            <button className="text-primary-fixed font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                View Details <span className="material-symbols-outlined">arrow_right_alt</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
