'use client';

import { motion } from 'framer-motion';

export default function BookingPreview() {
    return (
        <section className="relative py-20 px-8">
            <div className="absolute inset-0 tibeb-pattern pointer-events-none"></div>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto bg-surface-container-lowest p-6 md:p-12 rounded-lg shadow-2xl relative z-10 border border-outline-variant/20"
            >
                <div className="text-center mb-10">
                    <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Secure Your Date</h2>
                    <p className="text-on-surface-variant">Tell us when and where, we'll handle the magic.</p>
                </div>
                <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary">Wedding Date</label>
                        <input className="bg-surface-container-high border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container transition-all" type="date" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary">Desired Area</label>
                        <select className="bg-surface-container-high border-none rounded-lg p-4 focus:ring-2 focus:ring-primary-container transition-all">
                            <option>Bole District</option>
                            <option>Old Airport</option>
                            <option>Piazza</option>
                            <option>Entoto Hills</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 justify-end">
                        <button type="submit" className="w-full bg-secondary text-white py-4 rounded-lg font-bold hover:bg-secondary/90 shadow-lg transition-all active:scale-[0.98]">
                            Check Availability
                        </button>
                    </div>
                </form>
            </motion.div>
        </section>
    );
}
