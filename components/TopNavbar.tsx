'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, LogOut, Moon, Sun, Monitor,
    ChevronDown, Check
} from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function TopNavbar() {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-50/80 dark:bg-[#0f1118]/80 backdrop-blur-xl border-b border-white/10 w-full">
            {/* Left Side: Search */}
            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search shortlinks or long URLs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Right Side: Theme & Profile */}
            <div className="flex items-center gap-4 ml-4">
                <ThemeDropdown />

                <div className="relative z-50">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                            {userInitials}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-xs font-semibold text-slate-700 dark:text-white group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                                {session?.user?.name || 'User'}
                            </p>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-56 rounded-xl glass-panel overflow-hidden shadow-2xl z-50"
                            >
                                <div className="p-3 border-b border-white/10 px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{session?.user?.email}</p>
                                    <p className="text-xs text-slate-500 mt-1">Free Plan</p>
                                </div>

                                <div className="p-1">
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            setShowSignOutConfirm(true);
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            {/* Sign Out Confirmation Modal */}
            <AnimatePresence>
                {showSignOutConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSignOutConfirm(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-sm glass-panel p-6 rounded-2xl shadow-2xl border border-white/10"
                        >
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Sign Out?</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-6">
                                Are you sure you want to sign out of your account?
                            </p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowSignOutConfirm(false)}
                                    className="flex-1 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="flex-1 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium shadow-lg shadow-red-500/20"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    );
}

function ThemeDropdown() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-full bg-white/5 border border-slate-200 dark:border-white/10" />
        );
    }

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                title="Change Theme"
            >
                {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <Monitor size={20} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 rounded-xl glass-panel overflow-hidden shadow-2xl p-1 z-50"
                    >
                        <ThemeItem active={theme === 'light'} onClick={() => { setTheme('light'); setIsOpen(false); }} icon={<Sun size={16} />} label="Light" />
                        <ThemeItem active={theme === 'system'} onClick={() => { setTheme('system'); setIsOpen(false); }} icon={<Monitor size={16} />} label="System" />
                        <ThemeItem active={theme === 'dark'} onClick={() => { setTheme('dark'); setIsOpen(false); }} icon={<Moon size={16} />} label="Dark" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ThemeItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${active ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400 hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200'}`}
        >
            {icon}
            <span>{label}</span>
            {active && <Check size={14} className="ml-auto" />}
        </button>
    );
}
