'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORIES = [
    {
        id: 1,
        couple: 'Elena & James',
        title: 'Lake Como Garden Ceremony',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAinoJOdAQBaj0FIBR5HWhqsg21q1pchtEV-owjG5RCLiwBEsHqOnv1EQyNQIeO3NnaA4pa5vBdISQTpRHCcWI5Ym2BbleMQ-IHSJA0b0ucFvZ_X111dOjWoQ6iM2X7Y4Fw59Uhm68s8-ffCz9_dUwZAO9-4Oc97PHXZvI9vlgq7UMBb9_L78lpueYl-SVOTGwVXdcwvF5Mf6a_TLqloPXJJxoMmihXAf3BuBcbJIGcwntyt8hP0hNMZKm9kqkBvMlpCoYzvqT0nbc',
        parts: [
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvLY2L3-OLVLqwg1IKTLBWz3nSGEXnkelz7x7xvKd4v27omQ2NCRDooMngHcZvTxFXM0hYjwtHtO3YPyROQsPCx5UkQ3e-WSImE_Y_nmX3CPRTcbfwqsFHOxPLz3wiVAutZW35k8KX9j7SklIWBEWu6W2ToKuJMVdb7kRpVzCWfO9V4vauzkUB1fHeR7H49yIzk7DnV4g1tKQU9M7xEg4JWhblXD_jGwQoMsIZI30r1SV3sYQbxMUUWQ9kAR7XoKaBt_cRFAse8cA',
                description: 'The beauty of tradition meets modern luxury. A three-day journey of family, heritage, and timeless love.'
            },
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGHdO6cur4XmLpssZjAEEDkmQVND7HmaCz0OXKjEY9bhA4he0ClUIuiuzNLS0dZGyrqc_uO-8aW8MeVDG7rrFlnA_m2rt_gwopR4RVwG2TZ5puMSjP-rTkK2mQ0fiP5E3pAaG10dI4-7vxbWjGu57ixez_JSWv34LubA-oPRuIjqwLGawa_XdIk_itA2PV7goEWM_hbH3GpxQZ5bSUPLghUyd67Vs2_j2IUiift6xMcJ3nknCtFCOXhsglv35QGH6AeWZ4jP6xqT0',
                description: 'A moment captured in the golden hour, where every detail shines with a touch of elegance.'
            }
        ]
    },
    {
        id: 2,
        couple: 'Sofia & Mateo',
        title: 'Old Town Rooftop Celebration',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHtqpxX_PYSTlC3q9oPdxgIa3sXhkGD9aP4DDYBHcZyu-Y5Yp9DfoKPyAsP0nL4Jm77CO30u9QG_0Oj2i5CqOi46SeYDfQV1QtwF1VP4tST5b3cKIrhkftloYz_NMGz6L_Ra7SpBYJWNnY89FMFhvY9asmzi1-Qj-K8dTjdldJHlnMlSqeFjiLZtFSFboFAZREP2WVWN8xhKFYdT8MVd1AhFmmSovdTaezh_9UXCMiBOvC36q5UdK__EkgVDFAuEkMwa6TM_-hVUs',
        parts: [
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHtqpxX_PYSTlC3q9oPdxgIa3sXhkGD9aP4DDYBHcZyu-Y5Yp9DfoKPyAsP0nL4Jm77CO30u9QG_0Oj2i5CqOi46SeYDfQV1QtwF1VP4tST5b3cKIrhkftloYz_NMGz6L_Ra7SpBYJWNnY89FMFhvY9asmzi1-Qj-K8dTjdldJHlnMlSqeFjiLZtFSFboFAZREP2WVWN8xhKFYdT8MVd1AhFmmSovdTaezh_9UXCMiBOvC36q5UdK__EkgVDFAuEkMwa6TM_-hVUs',
                description: 'The immersive inspiration galleries helped us align on style in one evening. Everything clicked from there.'
            },
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJqLeWvrOxMNRYPfb_MGqmEgABgrYGRKAj6XdIJKD846pw-dit0NiYXb5yl_43ALlbRIOY79zcE2cH6Ih76UuRnhEmzfBtMZSovKwug34jp3Get-hrEW0Qr7oU2KA4FKmMfr8o2qwMi_zS7go-rynHEALJpWitSzgLUCZvSllIkGbvTb7_3wFvSx8WoTe2ApxZjyaTevqm2qCmlY4pighLP6jCeSsVJKMdHpXLGp23R6V8k7YE2DuAPVzTzMSMCA_rm2N_R4UEZLM',
                description: 'Overlooking the heart of Addis, our reception was a testament to modern Ethiopian vibrant culture.'
            }
        ]
    },
    {
        id: 3,
        couple: 'Marcus & Chloe',
        title: 'Sunset Coastal Reception',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLf70bK5mVNYURuuJdpCPke6Sa-ncRAgPOX7baUYd8fwaw59yYBG_DuFQGe9oWuoWvfhxw946MEg_GWYAm59sTulmKswp_XXO_RDakPHz5LWLQiFbG51hdFLLpSfei1JnFJp6T7-W6ZexanKpLFmhhIIZboB_Tt-QiJa-d4SwwgpWn_18ase9PH0L8duF0hyOjpf1eN-P6AEp9W-tEbTlHijPMCd1rEmqej8GOMJwVXlDjgMQO_fzG2hliqjL12wS2aJ_hoeeS3W4',
        parts: [
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLf70bK5mVNYURuuJdpCPke6Sa-ncRAgPOX7baUYd8fwaw59yYBG_DuFQGe9oWuoWvfhxw946MEg_GWYAm59sTulmKswp_XXO_RDakPHz5LWLQiFbG51hdFLLpSfei1JnFJp6T7-W6ZexanKpLFmhhIIZboB_Tt-QiJa-d4SwwgpWn_18ase9PH0L8duF0hyOjpf1eN-P6AEp9W-tEbTlHijPMCd1rEmqej8GOMJwVXlDjgMQO_fzG2hliqjL12wS2aJ_hoeeS3W4',
                description: 'Vibrant colors, lakeside views, and traditional Kebero beats bringing everyone to the dance floor.'
            }
        ]
    },
    {
        id: 4,
        couple: 'Noor & Aiden',
        title: 'City Palace Winter Wedding',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAinoJOdAQBaj0FIBR5HWhqsg21q1pchtEV-owjG5RCLiwBEsHqOnv1EQyNQIeO3NnaA4pa5vBdISQTpRHCcWI5Ym2BbleMQ-IHSJA0b0ucFvZ_X111dOjWoQ6iM2X7Y4Fw59Uhm68s8-ffCz9_dUwZAO9-4Oc97PHXZvI9vlgq7UMBb9_L78lpueYl-SVOTGwVXdcwvF5Mf6a_TLqloPXJJxoMmihXAf3BuBcbJIGcwntyt8hP0hNMZKm9kqkBvMlpCoYzvqT0nbc',
        parts: [
            {
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJqLeWvrOxMNRYPfb_MGqmEgABgrYGRKAj6XdIJKD846pw-dit0NiYXb5yl_43ALlbRIOY79zcE2cH6Ih76UuRnhEmzfBtMZSovKwug34jp3Get-hrEW0Qr7oU2KA4FKmMfr8o2qwMi_zS7go-rynHEALJpWitSzgLUCZvSllIkGbvTb7_3wFvSx8WoTe2ApxZjyaTevqm2qCmlY4pighLP6jCeSsVJKMdHpXLGp23R6V8k7YE2DuAPVzTzMSMCA_rm2N_R4UEZLM',
                description: 'A winter wonderland in the heart of the city, where every moment felt like a dream brought to life.'
            }
        ]
    }
];

const STORY_DURATION = 5000; // 5 seconds per part

export default function WeddingStories() {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [activeStoryIndex, setActiveStoryIndex] = useState(0);
    const [activePartIndex, setActivePartIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const scrollLockRef = useRef(0);

    const closeStory = useCallback(() => {
        setViewerOpen(false);
        setActivePartIndex(0);
        setProgress(0);

        // Restore scroll for all devices including iOS
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.left = '';
        document.body.style.right = '';
        window.scrollTo(0, scrollLockRef.current);
    }, []);

    const nextPart = useCallback(() => {
        const activeStory = STORIES[activeStoryIndex];
        if (activePartIndex < activeStory.parts.length - 1) {
            setActivePartIndex(prev => prev + 1);
            setProgress(0);
        } else {
            // Move to next story if available
            if (activeStoryIndex < STORIES.length - 1) {
                setActiveStoryIndex(prev => prev + 1);
                setActivePartIndex(0);
                setProgress(0);
            } else {
                closeStory();
            }
        }
    }, [activeStoryIndex, activePartIndex, closeStory]);

    const prevPart = useCallback(() => {
        if (activePartIndex > 0) {
            setActivePartIndex(prev => prev - 1);
            setProgress(0);
        } else {
            // Move to previous story if available
            if (activeStoryIndex > 0) {
                const prevStory = STORIES[activeStoryIndex - 1];
                setActiveStoryIndex(prev => prev - 1);
                setActivePartIndex(prevStory.parts.length - 1);
                setProgress(0);
            }
        }
    }, [activeStoryIndex, activePartIndex]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (viewerOpen) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        nextPart();
                        return 0;
                    }
                    return prev + (100 / (STORY_DURATION / 100));
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [viewerOpen, nextPart]);

    const openStory = (index: number) => {
        setActiveStoryIndex(index);
        setActivePartIndex(0);
        setProgress(0);
        setViewerOpen(true);

        // Robust Scroll Lock for iOS Safari
        scrollLockRef.current = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollLockRef.current}px`;
        document.body.style.width = '100%';
        document.body.style.left = '0';
        document.body.style.right = '0';
    };

    const activeStory = STORIES[activeStoryIndex];
    const activePart = activeStory.parts[activePartIndex];

    return (
        <>
            <section className="py-16 sm:py-20 bg-background text-center">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 relative z-10">
                    <h2 className="font-headline font-bold text-3xl sm:text-4xl mb-2 tracking-tight">Stories of Forever</h2>
                    <p className="text-on-surface-variant font-body mb-16 italic">Tap any story to preview a wedding moment.</p>

                    <div className="flex justify-start sm:justify-center gap-8 sm:gap-12 md:gap-20 overflow-x-auto pb-8 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {STORIES.map((story, i) => (
                            <button key={story.id} type="button" onClick={() => openStory(i)} className="flex flex-col items-center gap-4 shrink-0 cursor-pointer group touch-manipulation bg-transparent">
                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-primary shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-full h-full rounded-full border-[3px] border-background overflow-hidden bg-surface-container">
                                        <img src={story.avatar} alt={story.couple} className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block whitespace-nowrap">{story.title}</span>
                                    <span className="text-sm font-headline italic font-medium text-on-surface group-hover:text-primary transition-colors">{story.couple}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {viewerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex items-center justify-center p-0 md:p-8 overscroll-contain touch-none"
                    >
                        {/* Static Content / Background Blur */}
                        <div className="absolute inset-0 z-[-1] overflow-hidden">
                            <img src={activePart.image} className="w-full h-full object-cover opacity-20 blur-3xl scale-110" alt="" />
                        </div>

                        {/* Close button - high z-index and larger hit area */}
                        <button
                            onClick={closeStory}
                            className="absolute top-6 right-6 md:top-8 md:right-8 z-[200] text-white/40 hover:text-white transition-colors bg-white/10 rounded-full p-3 backdrop-blur-md active:scale-95"
                            aria-label="Close story"
                            type="button"
                        >
                            <span className="material-symbols-outlined text-2xl">close</span>
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative aspect-[9/16] h-[100dvh] md:h-full max-h-[100dvh] md:max-h-[850px] w-full max-w-[480px] mx-auto bg-stone-900 md:rounded-3xl shadow-2xl overflow-hidden border border-white/5"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activePart.image}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    src={activePart.image}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    alt={activeStory.couple}
                                />
                            </AnimatePresence>

                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90 flex flex-col justify-between p-6 pt-8">
                                {/* Top Progress & Title */}
                                <div className="z-20">
                                    <div className="flex gap-1.5 w-full mb-6">
                                        {activeStory.parts.map((_, i) => (
                                            <div key={i} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-white transition-all duration-100 ease-linear"
                                                    style={{
                                                        width: i === activePartIndex ? `${progress}%` : (i < activePartIndex ? '100%' : '0%')
                                                    }}
                                                ></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{storyTitleStyle(activeStory.title)}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-white/40 text-sm">schedule</span>
                                                <span className="text-white/40 text-[10px] uppercase font-medium">Recently</span>
                                            </div>
                                        </div>
                                        <button className="text-white/40 hover:text-white transition-colors">
                                            <span className="material-symbols-outlined rotate-90">more_horiz</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Click Zones - 50/50 split for intuitive navigation */}
                                <button type="button" aria-label="Previous story" onClick={(e) => { e.stopPropagation(); prevPart(); }} className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer touch-none bg-transparent"></button>
                                <button type="button" aria-label="Next story" onClick={(e) => { e.stopPropagation(); nextPart(); }} className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer touch-none bg-transparent"></button>

                                {/* Bottom Info */}
                                <div className="z-20 pb-4">
                                    <div className="mb-6">
                                        <span className="text-white/60 font-body italic text-sm mb-2 block">{activeStory.couple}</span>
                                        <h3 className="text-white font-headline text-3xl font-bold leading-tight drop-shadow-lg mb-4">
                                            {activeStory.title}
                                        </h3>
                                        <p className="text-white/80 text-sm leading-relaxed font-body font-medium pr-4">
                                            "{activePart.description}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/10 px-6 py-2 rounded-full flex items-center gap-2 transition-all" type="button">
                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Story Info</span>
                                        </button>
                                        <div className="flex gap-6">
                                            <button className="text-white/60 hover:text-white transition-colors" type="button">
                                                <span className="material-symbols-outlined">favorite</span>
                                            </button>
                                            <button className="text-white/60 hover:text-white transition-colors" type="button">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function storyTitleStyle(title: string) {
    return title.toUpperCase();
}
