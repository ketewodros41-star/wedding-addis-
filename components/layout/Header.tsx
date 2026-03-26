import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
    return (
        <header className="bg-stone-50/70 dark:bg-stone-900/70 backdrop-blur-xl docked full-width top-0 sticky z-50 transition-all duration-300">
            <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto">
                <div className="flex items-center gap-8">
                    <Link href="/" className="font-headline italic text-2xl text-amber-700 dark:text-amber-500 font-bold tracking-tight">
                        Wedding Addis
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/explore" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Explore
                        </Link>
                        <Link href="/venues" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Venues
                        </Link>
                        <Link href="/cakes" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Cakes
                        </Link>
                        <Link href="/invitations" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Invitations
                        </Link>
                        <Link href="/inspiration" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Inspiration
                        </Link>
                        <Link href="/planner" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Planner
                        </Link>
                        <Link href="/dashboard" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                            Dashboard
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 font-semibold transition-colors py-1 mr-4">
                        Log In
                    </Link>
                    <Link href="/booking" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                        Start Planning
                    </Link>
                </div>
            </div>
        </header>
    );
}
