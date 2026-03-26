'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/dashboard';
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Check your email for the confirmation link!');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <main className="min-h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Left Side: Emotional Hero Section */}
            <section className="relative w-full md:w-1/2 h-[409px] md:h-screen overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Ethiopian Wedding Ceremony"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRufKTfOpv3tx-RMVZTVJmptAJPx10sAza5AKxlpkkTP_mM8DwY1DWNYSnnGMm_Pg4uaVLz4nvL3jYGKXMn-nvYBmMKx90rjcR6egTSJozoYdEmUU3Px3xDvaGDbRgFNZRv8RE0smFLARZyhOj6GV9DmGRSaDSUz9jE8OExAU1H3WEJ5TYPEoUmtoUl6pziv6EfZZw53kiy4g5lgXtUJ_rKQViEfIeQGIYyxPMA29MsY7gYr9E8AbB3Hh041Eca7GGxNQOr1_JpSE"
                    />
                </div>
                <div className="absolute inset-0 hero-gradient z-10"></div>

                {/* Branding Overlay */}
                <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-headline italic text-3xl text-white drop-shadow-md">
                            Wedding Addis
                        </Link>
                    </div>
                    <div className="max-w-md">
                        <h2 className="font-headline text-4xl md:text-5xl text-white font-bold leading-tight mb-4 drop-shadow-lg">
                            Heritage in every detail.
                        </h2>
                        <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md">
                            Begin your journey where tradition meets modern elegance.
                        </p>
                    </div>
                </div>
            </section>

            {/* Right Side: Clean Modern Form */}
            <section className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 md:px-24 bg-surface relative">
                <div className="absolute top-0 right-0 w-64 h-64 tibeb-pattern opacity-40 -z-10"></div>
                <div className="w-full max-w-md space-y-10">

                    <div className="text-center">
                        <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">
                            {isLogin ? 'Welcome Back' : 'Join the Elite'}
                        </h1>
                        <p className="text-on-surface-variant font-body">
                            {isLogin ? 'Sign in to manage your dream wedding.' : 'Create an account to start planning.'}
                        </p>
                    </div>

                    {/* Form Toggle */}
                    <div className="bg-surface-container-low p-1.5 rounded-full flex relative">
                        <motion.div
                            layout
                            className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-primary-container rounded-full shadow-sm"
                            initial={false}
                            animate={{
                                left: isLogin ? '6px' : '50%',
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-semibold text-center z-10 transition-colors duration-300 ${isLogin ? 'text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-semibold text-center z-10 transition-colors duration-300 ${!isLogin ? 'text-on-primary-container' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-error-container text-on-error-container p-4 rounded-xl text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Fields */}
                    <form onSubmit={handleAuth} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-1.5 ml-4">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-surface-container-high border-2 border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:ring-0 rounded-xl px-5 py-4 transition-all duration-300 outline-none"
                                        placeholder="hello@weddingaddis.com"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-1.5 ml-4">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-surface-container-high border-2 border-transparent focus:border-primary-container focus:bg-surface-container-lowest focus:ring-0 rounded-xl px-5 py-4 transition-all duration-300 outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-outline">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                                {isLogin && (
                                    <div className="flex justify-end mt-2">
                                        <a href="#" className="text-sm font-medium text-primary hover:text-on-primary-fixed-variant transition-colors italic">Forgot Password?</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg rounded-xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                        >
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                        <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-widest">Or continue with</span>
                        <div className="flex-grow border-t border-outline-variant/30"></div>
                    </div>

                    {/* Social Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 py-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl hover:bg-surface-container transition-all duration-300"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                        </svg>
                        <span className="font-semibold text-on-surface">Continue with Google</span>
                    </button>

                    <div className="pt-8 border-t border-outline-variant/20">
                        <div className="tibeb-pattern h-8 w-full opacity-60 rounded-lg mb-4"></div>
                        <p className="text-center text-sm text-on-surface-variant italic">
                            By continuing, you agree to Wedding Addis' <a className="underline text-primary" href="#">Terms of Service</a> and <a className="underline text-primary" href="#">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
