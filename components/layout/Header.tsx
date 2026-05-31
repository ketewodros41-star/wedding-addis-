'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Menu, X, LogIn, ChevronRight } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const scrollLockRef = useRef(0);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        setIsMounted(true);
        return () => subscription.unsubscribe();
    }, []);

    // Sync body scroll lock when mobile menu opens/closes
    useEffect(() => {
        if (isMobileMenuOpen) {
            scrollLockRef.current = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollLockRef.current}px`;
            document.body.style.width = '100%';
            document.body.style.left = '0';
            document.body.style.right = '0';
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.left = '';
            document.body.style.right = '';
            window.scrollTo(0, scrollLockRef.current);
        }
    }, [isMobileMenuOpen]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
            <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl w-full top-0 sticky z-[100] transition-all duration-300 border-b border-black/5 dark:border-white/5">
            <div className="flex justify-between items-center w-full px-4 sm:px-8 py-4 max-w-screen-2xl mx-auto">
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
                        {user && (
                            <Link href="/dashboard" className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors py-1">
                                Dashboard
                            </Link>
                        )}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {!loading && (
                        user ? (
                            <button onClick={handleLogout} className="hidden md:block text-stone-600 dark:text-stone-400 hover:text-amber-600 font-semibold transition-colors py-1 mr-4">
                                Log Out
                            </button>
                        ) : (
                            <Link href="/login" className="hidden md:block text-stone-600 dark:text-stone-400 hover:text-amber-600 font-semibold transition-colors py-1 mr-4">
                                Log In
                            </Link>
                        )
                    )}
                    <Link href="/booking" className="hidden sm:flex bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
                        Start Planning
                    </Link>

                    {/* Mobile Menu Button - Protected by isMounted */}
                    {isMounted && (
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 active:scale-95 transition-all outline-none"
                            aria-label="Toggle menu"
                            type="button"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        className="md:hidden fixed inset-0 w-full h-[100dvh] bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl border-b border-black/5 dark:border-white/10 shadow-2xl z-[150] overflow-y-auto overscroll-contain"
                    >
                        <div className="flex justify-end p-6 pt-[calc(1.5rem+env(safe-area-inset-top))]">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 active:scale-95 transition-all outline-none"
                                type="button"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <nav className="flex flex-col px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] space-y-4">
                            {[
                                { name: 'Explore', href: '/explore' },
                                { name: 'Venues', href: '/venues' },
                                { name: 'Cakes', href: '/cakes' },
                                { name: 'Invitations', href: '/invitations' },
                                { name: 'Inspiration', href: '/inspiration' },
                                { name: 'Planner', href: '/planner' },
                                ...(user ? [{ name: 'Dashboard', href: '/dashboard' }] : [])
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-lg font-medium hover:bg-amber-500/10 hover:text-amber-600 transition-all group min-h-14"
                                >
                                    {item.name}
                                    <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex flex-col gap-3">
                                {user ? (
                                    <button
                                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                                        className="w-full py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-bold"
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-4 rounded-2xl bg-amber-500/10 text-amber-500 font-bold text-center"
                                    >
                                        Log In
                                    </Link>
                                )}
                                <Link
                                    href="/booking"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-4 rounded-2xl bg-amber-600 text-white font-bold text-center shadow-lg shadow-amber-600/20"
                                >
                                    Start Planning
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
