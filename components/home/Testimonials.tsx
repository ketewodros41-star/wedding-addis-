'use client';

import { motion } from 'framer-motion';

export default function Testimonials() {
    const testimonials = [
        {
            name: 'Selam & Dawit',
            date: 'December 2023',
            text: '"The way Wedding Addis managed to blend my husband\'s modern style with my family\'s deep-rooted traditions was breathtaking. A day we will never forget."',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2spFik_5u2Jk8ANC8VVHY3OSWv_x3IAYigNbAXkP6gCEjWoN_FFehxjPmQZTnWPCRU4Lw2mnnx1mfPhPHLUPf6hd7SLkBwhioVk94cvpvV3Db4DghKsH3PVc1HLDniWkNj5viUDRKR3u6-7BO-cRBjNx_t7Xe73tLWzpAWkxTwSK07JtXobljK2z6-fMjSEcHhFAr3F6lfhvN-tJv9aw-JBPUV24cml6mlEQQM6J2SEwOKk78I0H4U7JyBI8uOHDBpX7UVCcsqyo',
            color: 'border-primary',
            textColor: 'text-primary'
        },
        {
            name: 'Elias & Martha',
            date: 'October 2023',
            text: '"Professionalism at its peak. They took the stress of planning in Addis off our shoulders entirely, allowing us to truly enjoy our heritage."',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAnPpBE5ioYIOssNyszJkBO7hxNEAvit5x98NDxpcQ8RwlcnRPKIVamcdDK31ufkvmGq32zyCeAwAVxbl_8haOC-XMI1ycXbPRNH-B-BehYtIKF2PrZVWJ1-wcbxX1tanBWnc2Si7sTlISiiyHEfTLz0PzV9XqhAQiwrkdI-bY6Ps0QThokizRDdZHYPnwTV2x4md5sNxNH4LKbQUW5UVANVbRJ3wVO2n6y7Ze75-Oa-Mi_4XP4gPypucbqT2SajeDb7dedRfmXto',
            color: 'border-secondary',
            textColor: 'text-secondary'
        }
    ];

    return (
        <section className="py-24 bg-surface overflow-hidden">
            <div className="max-w-4xl mx-auto px-8 text-center mb-16">
                <h2 className="font-headline text-4xl font-bold text-on-surface">Eternal Memories</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-6 md:px-8 overflow-x-auto md:no-scrollbar snap-x snap-mandatory justify-center items-center">
                {testimonials.map((testimonial, index) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        key={index}
                        className={`min-w-[320px] md:min-w-[500px] max-w-[500px] bg-surface-container-lowest p-12 rounded-lg snap-center border-b-4 ${testimonial.color} shadow-sm flex flex-col items-center mx-auto md:mx-0`}
                    >
                        <div className="w-20 h-20 rounded-full mb-6 overflow-hidden bg-surface-container-high">
                            <img
                                className="w-full h-full object-cover"
                                src={testimonial.image}
                                alt={testimonial.name}
                            />
                        </div>
                        <p className="font-headline text-xl italic text-on-surface-variant mb-8 leading-relaxed">
                            {testimonial.text}
                        </p>
                        <h4 className={`font-bold ${testimonial.textColor}`}>{testimonial.name}</h4>
                        <span className="text-xs uppercase tracking-widest text-on-surface/50 mt-1">{testimonial.date}</span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
