'use client';

import { motion } from 'framer-motion';

export default function Styles() {
    const stylesInfo = [
        {
            title: 'Traditional Heritage',
            desc: 'Authentic Habesha celebrations featuring rich patterns, Telala bread, and cultural rituals.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFeftjc2PgQFEWuA0UTf7A5qcuqK-9v_28oznvdboOCJxo5teokgG4QRnSqkmuwKHt5jkpcKix3O0-1hfBHBuXKaT2ALOdsn9IBdppd6yXb3P7myixudV49BctD4g7y2Em8whGeLi9ve5YORkRENnrVkAtgVGXD-zDWTQuMe47NElX6TTJhV2BDIk4H_wJRDOXNgrn_dE5BZYYvFWwJSOxHUqMtVrPMGRSAYgyUsksBfqEqD-tWEjj1OAQdUi_XjbbFlF6iN17L0M',
            color: 'bg-primary'
        },
        {
            title: 'Modern Luxury',
            desc: 'Clean lines, architectural floral design, and contemporary high-end urban elegance.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiA9Uk8EZ3rUUEPFmKaHFita_9sIhM0S_bkyOJe4y1MaZ0L7MRBUZD_l9cN30LSB1wFwqfFh4Vuggl01H70jYwy0f7JLj0UPC5ra2r-5mKkm2jnh40IONqZnqPH8aSMi1AdTDlQUEDP3z_3tyXLlVl1vnxBhtfevHad6Px2y9GMDJfcXOqllg_Qdvjq8MkuvGZwkbzS2wnAqkIVF57YrAKHMJBu7xLcxAJjZ-XOV-f5RmEHFr7i6kiHilSltKHWQTvCH9smg7unkA',
            color: 'bg-secondary'
        },
        {
            title: 'Garden Fusion',
            desc: 'A harmonious blend of Ethiopian warmth and breezy, sun-drenched outdoor aesthetics.',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUmkWuyt3Q9WarulckpYFiZ3Da5S4n9C32HWV4uIGh6QeMymeXLlHiTfitiBW6pksymqPSxwceXSaPoBNqZY4A12Fca4mARC3V1Txpylfm-Pf1_lxbd2iE1jGcqrIUSVcxWLHa78AQx23fNJr6hRURZKn5Flc7dNbIkgMxsHRxu8xoMW1uqfCihQMrBSur31p7e_sHFF92M4C27OwfVbd44cp3QozyUOp6pUBU68UvhB26cSob1FExv7bjuaHLaECcpbF3Ekkc_FY',
            color: 'bg-tertiary'
        }
    ];

    return (
        <section className="py-24 bg-surface-container-low">
            <div className="max-w-screen-2xl mx-auto px-8">
                <div className="text-center mb-16">
                    <h2 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-4">Aesthetic Collections</h2>
                    <p className="max-w-2xl mx-auto text-on-surface-variant">From the ancient threads of tradition to the minimalist lines of modern luxury.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {stylesInfo.map((style, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            key={index}
                            className="group cursor-pointer"
                        >
                            <div className="relative h-[450px] rounded-lg overflow-hidden mb-6">
                                <img
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    src={style.image}
                                    alt={style.title}
                                />
                                <div className={`absolute inset-0 ${style.color}/10 group-hover:${style.color}/0 transition-colors`}></div>
                            </div>
                            <h3 className="font-headline text-2xl font-bold mb-2">{style.title}</h3>
                            <p className="text-on-surface-variant mb-4">{style.desc}</p>
                            <div className={`h-1 w-12 ${style.color} transition-all group-hover:w-full`}></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
