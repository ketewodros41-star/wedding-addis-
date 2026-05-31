'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();

    const navItems = [
        { label: 'Overview', path: '/admin', icon: 'dashboard' },
        { label: 'Bookings', path: '/admin/bookings', icon: 'event' },
        { label: 'Inspiration Requests', path: '/admin/requests', icon: 'auto_fix_high' },
        { label: 'Vendor Inquiries', path: '/admin/inquiries', icon: 'mail' },
        { label: 'Manage Vendors', path: '/admin/vendors', icon: 'storefront' },
    ];

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col font-body">
            <Header />

            <div className="flex-1 flex flex-col lg:flex-row max-w-screen-2xl mx-auto w-full px-6 md:px-12 py-12 gap-8">
                {/* Admin Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm sticky top-24">
                        <div className="mb-10">
                            <h2 className="font-headline text-2xl font-bold italic text-primary">Admin Console</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mt-1">Wedding Addis HQ</p>
                        </div>

                        <nav className="space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === item.path ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-stone-500 hover:bg-primary/5 hover:text-primary'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Admin content */}
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}
