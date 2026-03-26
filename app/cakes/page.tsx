'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CakesGallery() {
    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary-container/30 min-h-screen flex flex-col">
            <Header />

            <main className="max-w-screen-2xl mx-auto px-6 md:px-8 pt-16 pb-32 flex-1 w-full">
                {/* Hero Section */}
                <section className="mb-24 flex flex-col md:flex-row items-end gap-12">
                    <div className="md:w-1/2">
                        <span className="font-label text-primary font-bold tracking-widest uppercase text-xs mb-4 block">The Confectionary Suite</span>
                        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-on-surface leading-[1.1]">
                            Artisanal <span className="italic font-normal text-primary">Sculptures</span>
                        </h1>
                        <p className="mt-8 text-on-surface-variant text-lg max-w-md leading-relaxed">
                            From the regal gold threads of traditional motifs to the minimal elegance of modern fondant, explore our curated selection of Ethiopia's finest wedding cakes.
                        </p>
                    </div>
                    <div className="md:w-1/2 relative w-full">
                        <div className="aspect-[4/5] rounded-lg overflow-hidden bg-surface-container">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuADnEgEihs-7e9M80YOSECKY7BeN1o-fw9tS5CsOMUrrAEMGHhcFbHd_YtPdxftHNcxFXqvTnTyhq2x4LeqEXCcZR7g0MAMlKyF3Xl9LGXafy3Ohvik7Q9gECuCNdSUwjmYCY0CxKFXaJrNiXVUKs8fTnf5W2fBIgOHiN9GS4Tuhq6nTWpm6y7wX5au8P_80E3Z9yuX8YvvzNiGY2kZl2YQ-YBkgo6_VJDz4usWV57QPOPdmxQco-EWGqhzIEjCfKuBTnFnleF000c" alt="luxury multi-tier wedding cake" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-8 md:-left-8 bg-surface-container-lowest p-6 md:p-8 rounded-lg shadow-xl max-w-xs border border-outline-variant/10 z-10 w-[90%] md:w-auto left-1/2 md:translate-x-0 -translate-x-1/2">
                            <p className="font-headline italic text-xl text-primary mb-2">Editor's Choice</p>
                            <p className="text-sm text-on-surface-variant">"The Golden Highlands" – A 5-tier masterpiece infused with honey and spiced with Ethiopian cardamom.</p>
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <div className="space-y-32">
                    {/* Category: Modern Luxe */}
                    <section>
                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                            <h2 className="font-headline text-2xl md:text-3xl italic text-primary shrink-0 px-2 md:px-4 text-center">Modern Luxe Cakes</h2>
                            <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Large Feature Card */}
                            <div
                                onClick={() => window.location.href = '/booking'}
                                className="col-span-1 md:col-span-7 group relative overflow-hidden rounded-lg bg-surface-container-low cursor-pointer transition-all duration-500"
                            >
                                <div className="aspect-[4/5] md:aspect-[16/10]">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJqLeWvrOxMNRYPfb_MGqmEgABgrYGRKAj6XdIJKD846pw-dit0NiYXb5yl_43ALlbRIOY79zcE2cH6Ih76UuRnhEmzfBtMZSovKwug34jp3Get-hrEW0Qr7oU2KA4FKmMfr8o2qwMi_zS7go-rynHEALJpWitSzgLUCZvSllIkGbvTb7_3wFvSx8WoTe2ApxZjyaTevqm2qCmlY4pighLP6jCeSsVJKMdHpXLGp23R6V8k7YE2DuAPVzTzMSMCA_rm2N_R4UEZLM" alt="modern minimalist white wedding cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="font-headline text-white text-3xl font-bold">The Marble Pillar</h3>
                                            <p className="text-white/80 font-label">Price Range: ETB 45,000 - 65,000</p>
                                        </div>
                                        <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                            <span className="material-symbols-outlined text-sm">event_available</span> Book
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Side Cards */}
                            <div className="col-span-1 md:col-span-5 grid grid-cols-1 gap-8">
                                <div onClick={() => window.location.href = '/booking'} className="group relative rounded-lg overflow-hidden bg-surface-container cursor-pointer">
                                    <div className="aspect-[4/3]">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcKRsXyp79h1yZMbhMtrHfvlWQyJ0d15FuU5qQ0jjNn2xH2u3uwCBIKOsI0K5DMBf1iK1Z6UB1MN5pW2VfRH3EHa7i8VdpT_RIWONZBOBlBL0laMHlVCGtVPvnPH27y8iz84uDW5QJ-8Z0FOuP0rTCzNqVCrcaewGmRcpPqaUsFVNFKU8aZKlXSJDyFxbKGzZM8K4YLCOt6ZSmUMHMMughBw6F0l2RMxuTPpfngOraPB6cj85OIourOA0EBRhc8cGfAspRff43pyo" alt="modern three tier wedding cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="text-center p-6 text-white">
                                            <span className="font-headline text-2xl block mb-2">Ethereal Bloom</span>
                                            <p className="text-sm font-label uppercase tracking-widest mb-4">ETB 32,000+</p>
                                            <span className="text-xs border border-white/40 px-4 py-2 rounded-full">Book This Design</span>
                                        </div>
                                    </div>
                                </div>
                                <div onClick={() => window.location.href = '/booking'} className="group relative rounded-lg overflow-hidden bg-surface-container cursor-pointer">
                                    <div className="aspect-[4/3]">
                                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJlt5WZfbasv5WV2kgbfblchMLd8axT1tOH6vkj5t1vbiC16vEp40LlZPeoa2tXiGefpwB4_w5R0ME4nFSZyGA3u3a2sO5Xp1OMzjm8esRhhgm5dBzN4h9D9URhcW4_ifG--qfHUuAIiulRklw2Q_gXFHGyBpVqLbReJBXydF7FVDmf3NW0Vu-VR7wq9i_wAp_ISGfwJAEyPW2jyFGgO4skXmMCU7eLSFcIqGxgLmGSeOCExv_zKpQwlUC1C2tCGEYbOFdML1CpvA" alt="contemporary black and gold wedding cake" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="text-center p-6 text-white">
                                            <span className="font-headline text-2xl block mb-2">Midnight Onyx</span>
                                            <p className="text-sm font-label uppercase tracking-widest mb-4">ETB 55,000+</p>
                                            <span className="text-xs border border-white/40 px-4 py-2 rounded-full">Book This Design</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Category: Traditional */}
                    <section className="relative">
                        <div className="absolute inset-0 opacity-30 pointer-events-none -mx-8" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l5 15h15l-12 9 5 16-13-10-13 10 5-16-12-9h15z' fill='%23d4af37' fill-opacity='0.1'/%3E%3C/svg%3E\")" }}></div>
                        <div className="flex items-center gap-6 mb-12 relative">
                            <div className="h-[1px] flex-grow bg-primary/20"></div>
                            <h2 className="font-headline text-2xl md:text-3xl italic text-primary shrink-0 px-2 md:px-4 text-center">Traditional Ethiopian Cakes</h2>
                            <div className="h-[1px] flex-grow bg-primary/20"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            <div className="group">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-6 relative">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdc4imo1QQ6iy8c7oCeuA_YZoyii5gnqh5SeD8g6bsAUMmHRtRNaGmKBoZ3pNQEu34tQkpNzCB1_n--PeaFjpSJQ0QEih5LHr0E8sC0Eq5lDWrSvMvFIxo6KSc9R_c4we4dfbjCDjPbYVYuZYKZ9MXAzB1lH_4tt_cwf3q0dG__vNqVsQOWKr2daImsANwAxuD3Znqerdkl7iTlxmxr4Z6oLlCTEy6lJQSPf4KL9ZeT_92-CoxLZKt3ODtA3oEDrMvELu801MpZng" alt="traditional wedding cake" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter text-primary uppercase">Bestseller</div>
                                </div>
                                <h3 className="font-headline text-2xl text-on-surface mb-1">The Habesha Heritage</h3>
                                <p className="font-label text-primary font-bold text-sm mb-4">ETB 75,000 - 110,000</p>
                                <button onClick={() => window.location.href = '/booking'} className="w-full border border-outline-variant/30 py-3 rounded-lg font-label text-sm hover:bg-primary hover:text-white transition-all">Book Now</button>
                            </div>

                            <div className="group mt-0 md:mt-24">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-6 relative">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdIViu_EDQacpoxY2loQ5kWSu9Ojp9hDVO9aCuY-4Tcyoe1_3zLRTtxxBaP7Q1zGNpWTUTEfyYjMOGrtIUzzbLPDUxoITuHicCRgFo_B9BAnvK00HkoBLHKW6jyrdwhXtMisFtWuPTD7EbH3UAA7Q7e36ewOL1vtR-A6SvIk43LY0oeuPYmGXHqeL0TUZPd0radtTY8JeOxvObnUpjwfZJ39fjrJZUBUohND9tBw16rLXREWdIcLyzF-dj-JiCxvqlQ415HvNDJnw" alt="axumite gold cake" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                                <h3 className="font-headline text-2xl text-on-surface mb-1">Axumite Gold</h3>
                                <p className="font-label text-primary font-bold text-sm mb-4">ETB 90,000 - 150,000</p>
                                <button onClick={() => window.location.href = '/booking'} className="w-full border border-outline-variant/30 py-3 rounded-lg font-label text-sm hover:bg-primary hover:text-white transition-all">Book Now</button>
                            </div>

                            <div className="group">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden mb-6 relative">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkVgpdKxDWvGZE4VTPZP5MyqbiB9XO3wH7g9b3Leh-jN7lKa-jLhCa2SgHMk8A7pzX_LZzCRx6aXY-EQVZGNW66eSm_5yiz_DqrEeQeJs-CttK-w4iMmCSgMpOQcQ7Lto4HZZE0JI2hluo1Sov515BsNmzfrqpYIC0wZXle6Y-j3UybARuTP9eSNcKKZ3WNe02qFCvGMQZDRHZRT4np-C0sqmgCaQhBCq2vEZTSICZsBie5txVwd3ODYhqx10kvU6T_vuNrSrqyhc" alt="cotton & clove cake" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                                <h3 className="font-headline text-2xl text-on-surface mb-1">Cotton &amp; Clove</h3>
                                <p className="font-label text-primary font-bold text-sm mb-4">ETB 60,000 - 85,000</p>
                                <button onClick={() => window.location.href = '/booking'} className="w-full border border-outline-variant/30 py-3 rounded-lg font-label text-sm hover:bg-primary hover:text-white transition-all">Book Now</button>
                            </div>
                        </div>
                    </section>
                </div>
            </main >

            <Footer />
        </div >
    );
}
