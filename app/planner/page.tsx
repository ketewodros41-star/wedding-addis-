'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

interface PlannerTask {
    id: string;
    title: string;
    category: string;
    completed: boolean;
    due_date: string | null;
}

export default function PlannerPage() {
    const [user, setUser] = useState<any>(null);
    const [booking, setBooking] = useState<any>(null);
    const [tasks, setTasks] = useState<PlannerTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    // Budget state (keep existing logic but could be synced in future)
    const [venueCost, setVenueCost] = useState(150000);
    const [cateringCost, setCateringCost] = useState(85000);
    const [decorCost, setDecorCost] = useState(45000);
    const [photoCost, setPhotoCost] = useState(60000);

    const totalEstimate = venueCost + cateringCost + decorCost + photoCost;
    const averageCost = 280000;
    const percentage = Math.min((totalEstimate / 500000) * 100, 100);

    useEffect(() => {
        const loadPlannerData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }
            setUser(user);

            // Load most recent booking
            const { data: bookingData } = await supabase
                .from('bookings')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (bookingData) {
                setBooking(bookingData);
                // Load tasks for this booking
                const { data: taskData } = await supabase
                    .from('planner_tasks')
                    .select('*')
                    .eq('booking_id', bookingData.id)
                    .order('created_at', { ascending: true });

                if (taskData && taskData.length > 0) {
                    setTasks(taskData);
                } else {
                    // Seed default tasks if empty
                    await seedDefaultTasks(bookingData.id, user.id);
                }
            }
            setLoading(false);
        };
        loadPlannerData();
    }, []);

    const seedDefaultTasks = async (bookingId: string, userId: string) => {
        const defaultTasks = [
            { title: 'Secure Heritage Venue', category: 'Venue' },
            { title: 'Finalize Ethiopian Menu (Buffet/Fine Dining)', category: 'Catering' },
            { title: 'Hire Photographer & Cinematographer', category: 'Media' },
            { title: 'Traditional Habesha Dress Fitting', category: 'Attire' },
            { title: 'Book Coffee Ceremony Service', category: 'Tradition' },
            { title: 'Design & Send Digital Invitations', category: 'Invites' },
            { title: 'Arrange Melse Celebration Details', category: 'Tradition' },
            { title: 'Order Wedding Cake (Luxe/Modern)', category: 'Cakes' }
        ].map(t => ({ ...t, booking_id: bookingId, user_id: userId, completed: false }));

        const { data, error } = await supabase.from('planner_tasks').insert(defaultTasks).select();
        if (!error && data) {
            setTasks(data);
        }
    };

    const toggleTask = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase.from('planner_tasks').update({ completed: !currentStatus }).eq('id', id);
        if (!error) {
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !currentStatus } : t));
        }
    };

    const addTask = async () => {
        if (!newTaskTitle || !booking) return;
        const newTask = {
            title: newTaskTitle,
            booking_id: booking.id,
            user_id: user.id,
            completed: false,
            category: 'Custom'
        };
        const { data, error } = await supabase.from('planner_tasks').insert([newTask]).select();
        if (!error && data) {
            setTasks([...tasks, data[0]]);
            setNewTaskTitle('');
        }
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from('planner_tasks').delete().eq('id', id);
        if (!error) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const calculateDaysLeft = () => {
        if (!booking?.event_date) return null;
        const diff = new Date(booking.event_date).getTime() - new Date().getTime();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
    const daysLeft = calculateDaysLeft();

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
            <Header />

            <main className="max-w-screen-xl mx-auto px-6 py-12 md:py-20 space-y-24 flex-1 w-full">
                {/* Hero Branding Section */}
                <section className="text-center space-y-4">
                    <span className="text-primary font-bold tracking-widest uppercase text-xs">Planning Excellence</span>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-on-surface">Precision in Every Detail</h1>
                    <p className="text-on-surface-variant max-w-2xl mx-auto text-lg italic">Organize your heritage-inspired celebration with our bespoke financial and timing tools.</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Main Planning Area */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Section 1: Budget Estimator (Existing) */}
                        <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5 space-y-10">
                            <div className="space-y-2">
                                <h2 className="font-headline text-2xl font-bold">Budget Estimator</h2>
                                <p className="text-sm text-on-surface-variant">Adjust the sliders to see how your vision aligns with your investment.</p>
                            </div>

                            <div className="grid gap-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Venue &amp; Space</label>
                                        <span className="font-bold text-primary">ETB {venueCost.toLocaleString()}</span>
                                    </div>
                                    <input className="w-full h-1.5 bg-surface-variant rounded-full appearance-none outline-none accent-primary cursor-pointer" max="1000000" min="50000" step="10000" type="range" value={venueCost} onChange={(e) => setVenueCost(parseInt(e.target.value))} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Traditional Catering</label>
                                        <span className="font-bold text-primary">ETB {cateringCost.toLocaleString()}</span>
                                    </div>
                                    <input className="w-full h-1.5 bg-surface-variant rounded-full appearance-none outline-none accent-primary cursor-pointer" max="500000" min="20000" step="5000" type="range" value={cateringCost} onChange={(e) => setCateringCost(parseInt(e.target.value))} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold uppercase tracking-widest text-outline">Decor &amp; Tibeb Textiles</label>
                                        <span className="font-bold text-primary">ETB {decorCost.toLocaleString()}</span>
                                    </div>
                                    <input className="w-full h-1.5 bg-surface-variant rounded-full appearance-none outline-none accent-primary cursor-pointer" max="250000" min="10000" step="2500" type="range" value={decorCost} onChange={(e) => setDecorCost(parseInt(e.target.value))} />
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Task Checklist (New) */}
                        <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/5">
                            <div className="flex justify-between items-end mb-8">
                                <div className="space-y-2">
                                    <h2 className="font-headline text-2xl font-bold">Wedding Checklist</h2>
                                    <p className="text-sm text-on-surface-variant">Step-by-step to your big day.</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-primary">{progressPercent}%</span>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Complete</p>
                                </div>
                            </div>

                            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mb-10">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1 }}
                                ></motion.div>
                            </div>

                            <div className="space-y-2">
                                {tasks.map((task) => (
                                    <div key={task.id} className="group flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/10">
                                        <button
                                            onClick={() => toggleTask(task.id, task.completed)}
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary text-on-primary' : 'border-outline-variant hover:border-primary'}`}
                                        >
                                            {task.completed && <span className="material-symbols-outlined text-xs">check</span>}
                                        </button>
                                        <div className="flex-1">
                                            <p className={`text-sm font-bold ${task.completed ? 'text-outline line-through' : 'text-on-surface'}`}>{task.title}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-outline">{task.category}</p>
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-2 text-outline hover:text-error transition-all">
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                ))}

                                <div className="mt-8 pt-6 border-t border-outline-variant/10">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            placeholder="Add a custom heritage task..."
                                            value={newTaskTitle}
                                            onChange={e => setNewTaskTitle(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addTask()}
                                            className="flex-1 bg-surface-container-high rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                                        />
                                        <button
                                            onClick={addTask}
                                            className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-sm"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24">
                        {/* Countdown Card */}
                        <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-2xl text-on-primary shadow-xl shadow-primary/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 tibeb-pattern opacity-20 rotate-12 -translate-y-8 translate-x-8"></div>
                            <div className="relative z-10 space-y-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Countdown to Wedding</p>
                                    <h3 className="text-4xl font-headline font-bold italic">{booking?.bride_name?.split(' ')[0] || 'Your'} Wedding</h3>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-6xl font-bold tracking-tighter">{daysLeft ?? '--'}</span>
                                    <span className="text-xl font-headline italic opacity-80">Days remaining</span>
                                </div>
                                <div className="pt-4 border-t border-on-primary/20 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    <span className="text-xs font-bold">{booking ? new Date(booking.event_date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Setting date...'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Budget Summary Card */}
                        <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <span className="material-symbols-outlined text-[6rem]">account_balance_wallet</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline">Current Investment</h3>
                                <div className="text-3xl font-bold text-primary tracking-tight">ETB {totalEstimate.toLocaleString()}</div>
                            </div>
                            <div className="space-y-4 pt-4 border-t border-outline-variant/30">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span className="text-outline">Plan Status</span>
                                    <span className="text-primary">{totalEstimate > averageCost ? 'Premium Scale' : 'Boutique Scale'}</span>
                                </div>
                                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                            <button onClick={() => window.location.href = '/booking'} className="w-full bg-surface-container-low text-primary py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all border border-primary/20">
                                Edit Wedding Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Banner */}
                <section className="relative py-20 px-8 rounded-2xl overflow-hidden bg-surface-container-high shadow-premium">
                    <div className="absolute inset-0 z-0">
                        <img alt="Background" className="w-full h-full object-cover opacity-20 grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1CZahf8WMPa2HdOLuSAZwtqsN2-wl8-rbM4nm75ZCSaJIiU2X1AtkYdfAPDmdc5CcwGW0AYA_mhMRuw506nMI-HfSzoOwQ49yOQ58GrJncETPfv45tfCzpz9mTTPdj5UAg8txzKJAXcZOhOIqmUE0hLkYKv7VvZKT_Kw3V5Xrzg1DvSDdJk7BQVzsd0eba_bQZZisucE7fJwB-SZYCvQ9oDQIClw31io9HgH1aTdqy2M9C-jhe5V7JJF9Tj1LSeD8qwGtpA9lky4" />
                    </div>
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h3 className="font-headline text-4xl font-bold leading-tight italic">Your heritage, <br />our craftsmanship.</h3>
                            <p className="text-lg italic opacity-80">We believe that a wedding isn't just an event, it's a legacy. Every tool we build is designed to honor the traditions that bring us together.</p>
                        </div>
                        <div className="flex justify-center">
                            <div onClick={() => window.location.href = '/booking'} className="cursor-pointer hover:scale-105 transition-transform w-56 h-56 bg-surface rounded-full flex flex-col items-center justify-center p-4 ring-8 ring-primary/10 shadow-xl">
                                <span className="material-symbols-outlined text-primary text-5xl mb-2">verified</span>
                                <div className="font-headline font-bold text-xl italic">Authentic</div>
                                <div className="text-[10px] uppercase tracking-widest text-outline">Planning Tool</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
