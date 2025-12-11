'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Link as LinkIcon, HardDrive, Copy, X,
    ChevronDown, ChevronUp, Trash2, Edit2, Calendar, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SpotlightCard from '@/components/SpotlightCard';

interface LinkData {
    _id: string;
    originalUrl: string;
    shortCode: string;
    type: 'url' | 'drive';
    clicks: number;
    isActive: boolean;
    expiresAt?: string;
    createdAt: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [links, setLinks] = useState<LinkData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchLinks();
        }
    }, [status, router]);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/links');
            if (res.ok) {
                const data = await res.json();
                setLinks(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto relative pb-24">
            <div className="mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                    Dashboard Overview
                </h1>
                <p className="text-slate-400 mt-1">Detailed reports and analytics</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard
                    label="Total Links"
                    value={links.length}
                    color="text-slate-800 dark:text-white"
                    gradient="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10"
                />
                <StatsCard
                    label="Total Clicks"
                    value={links.reduce((acc, link) => acc + link.clicks, 0)}
                    color="text-indigo-600 dark:text-indigo-400"
                    gradient="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/10 dark:to-cyan-500/10"
                />
                <StatsCard
                    label="Drive Links"
                    value={links.filter(l => l.type === 'drive').length}
                    color="text-emerald-600 dark:text-emerald-400"
                    gradient="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10"
                />
            </div>

            {/* Placeholder for Detailed Reports */}
            <div className="glass-panel p-8 rounded-2xl text-center border-dashed border-2 border-slate-200 dark:border-white/10 bg-white/50 dark:bg-transparent">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">Detailed Analytics Reports</h3>
                <p className="text-slate-500 dark:text-slate-400">Advanced graphs and geographic data coming soon.</p>
            </div>
        </div >
    );
}

function StatsCard({ label, value, color, gradient }: { label: string, value: number, color?: string, gradient?: string }) {
    return (
        <SpotlightCard className={`p-6 flex flex-col justify-center h-32 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 border-white/10 dark:border-white/5 ${gradient || 'bg-white/5'}`}>
            <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</h3>
            <p className={`text-4xl font-black tracking-tight ${color} drop-shadow-sm`}>{value}</p>
        </SpotlightCard>
    );
}
