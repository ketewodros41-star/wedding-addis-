import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-stone-100 dark:bg-stone-900 full-width relative border-t-4 border-amber-600/20">
            <div className="w-full py-16 px-12 grid grid-cols-1 md:grid-cols-4 gap-12 max-w-screen-2xl mx-auto">
                <div className="col-span-1 md:col-span-1">
                    <Link href="/" className="text-amber-800 dark:text-amber-400 font-headline text-3xl font-bold block mb-6 italic">
                        Wedding Addis
                    </Link>
                    <p className="text-stone-500 font-body text-sm leading-relaxed">
                        Preserving the soul of Ethiopian celebrations through meticulously curated wedding experiences.
                    </p>
                </div>
                <div>
                    <h4 className="font-headline italic text-lg text-amber-700 dark:text-amber-500 mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        <li><Link href="/about" className="text-stone-500 hover:text-amber-700 transition-colors font-body text-sm">About Us</Link></li>
                        <li><Link href="/terms" className="text-stone-500 hover:text-amber-700 transition-colors font-body text-sm">Terms of Service</Link></li>
                        <li><Link href="/privacy" className="text-stone-500 hover:text-amber-700 transition-colors font-body text-sm">Privacy Policy</Link></li>
                        <li><Link href="/contact" className="text-stone-500 hover:text-amber-700 transition-colors font-body text-sm">Contact</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-headline italic text-lg text-amber-700 dark:text-amber-500 mb-6">Social Heritage</h4>
                    <ul className="flex gap-6">
                        <li className="p-3 bg-amber-100/50 rounded-full hover:bg-amber-200 transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-amber-800">share</span>
                        </li>
                        <li className="p-3 bg-amber-100/50 rounded-full hover:bg-amber-200 transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-amber-800">camera</span>
                        </li>
                        <li className="p-3 bg-amber-100/50 rounded-full hover:bg-amber-200 transition-all cursor-pointer">
                            <span className="material-symbols-outlined text-amber-800">videocam</span>
                        </li>
                    </ul>
                </div>
                <div className="relative">
                    <h4 className="font-headline italic text-lg text-amber-700 dark:text-amber-500 mb-6">Newsletter</h4>
                    <div className="flex flex-col gap-4">
                        <input className="bg-white border-none rounded-lg p-3 text-sm focus:ring-1 focus:ring-amber-600" placeholder="Email Address" type="email" />
                        <button className="bg-amber-600 text-white py-3 rounded-lg font-bold text-sm">Join the Elite List</button>
                    </div>
                </div>
            </div>
            <div className="w-full text-center py-8 border-t border-stone-200 dark:border-stone-800">
                <p className="text-stone-400 text-xs font-label tracking-widest uppercase">© {new Date().getFullYear()} Wedding Addis. Heritage in every detail.</p>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-stone-50 dark:bg-stone-950 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] rounded-t-[3rem]">
                <Link href="/" className="flex flex-col items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 rounded-full px-5 py-2 scale-90 duration-150">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
                    <span className="font-sans text-[10px] font-medium tracking-wide uppercase mt-1">Home</span>
                </Link>
                <Link href="/inspiration" className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-5 py-2 hover:text-amber-600 dark:hover:text-amber-300">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span className="font-sans text-[10px] font-medium tracking-wide uppercase mt-1">Inspiration</span>
                </Link>
                <Link href="/booking" className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-5 py-2 hover:text-amber-600 dark:hover:text-amber-300">
                    <span className="material-symbols-outlined">event_available</span>
                    <span className="font-sans text-[10px] font-medium tracking-wide uppercase mt-1">Bookings</span>
                </Link>
                <Link href="/dashboard" className="flex flex-col items-center justify-center text-stone-500 dark:text-stone-400 px-5 py-2 hover:text-amber-600 dark:hover:text-amber-300">
                    <span className="material-symbols-outlined">person</span>
                    <span className="font-sans text-[10px] font-medium tracking-wide uppercase mt-1">Profile</span>
                </Link>
            </nav>
        </footer>
    );
}
