'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut, User, Moon, Sun,
    Monitor, ChevronDown, Check,
    Menu
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Header({
    children,
    title,
    subtitle
}: {
    children?: React.ReactNode,
    title?: string,
    subtitle?: string
}) {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const userInitials = session?.user?.name
        ? session.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
                {title && (
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                        {title}
                    </h1>
                )}
                {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-4">
                {children}

                <div className="relative z-50">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-3 p-2 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/20 group-hover:border-indigo-500/40 transition-colors">
                            {userInitials}
                        </div>
                        <div className="text-left hidden md:block">
                            <p className="text-sm font-medium text-slate-700 dark:text-white group-hover:text-indigo-400 transition-colors">
                                {session?.user?.name || 'User'}
                            </p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-2 w-56 rounded-xl glass-panel overflow-hidden shadow-2xl"
                            >
                                <div className="p-3 border-b border-white/10 px-4 py-3">
                                    <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">{session?.user?.email}</p>
                                    <p className="text-xs text-slate-500 mt-1">Free Plan</p>
                                </div>

                                <div className="p-1">
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
        </header>
    );
}

function ThemeDropdown() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors"
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
                        className="absolute right-0 mt-2 w-36 rounded-xl glass-panel overflow-hidden shadow-2xl p-1"
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
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
        >
            {icon}
            <span>{label}</span>
            {active && <Check size={14} className="ml-auto" />}
        </button>
    );
}
