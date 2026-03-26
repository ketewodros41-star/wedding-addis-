'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-[921px] min-h-[700px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGHdO6cur4XmLpssZjAEEDkmQVND7HmaCz0OXKjEY9bhA4he0ClUIuiuzNLS0dZGyrqc_uO-8aW8MeVDG7rrFlnA_m2rt_gwopR4RVwG2TZ5puMSjP-rTkK2mQ0fiP5E3pAaG10dI4-7vxbWjGu57ixez_JSWv34LubA-oPRuIjqwLGawa_XdIk_itA2PV7goEWM_hbH3GpxQZ5bSUPLghUyd67Vs2_j2IUiift6xMcJ3nknCtFCOXhsglv35QGH6AeWZ4jP6xqT0"
                    alt="stunning luxury Ethiopian wedding ceremony in Addis Ababa"
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="font-headline text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight drop-shadow-xl"
                >
                    Plan Your Dream Wedding in Addis
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <Link href="/booking" className="bg-primary text-white px-10 py-5 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl flex items-center gap-2">
                        Start Planning
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                    <Link href="/inspiration" className="glass-panel bg-white/10 text-white border border-white/30 px-10 py-5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
                        Explore Inspirations
                    </Link>
                </motion.div>
            </div>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/80"
            >
                <span className="material-symbols-outlined text-4xl">expand_more</span>
            </motion.div>
        </section>
    );
}
