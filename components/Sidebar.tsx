'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Link as LinkIcon, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Links', href: '/dashboard/links', icon: LinkIcon },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-slate-50/80 dark:bg-[#0f1118]/80 backdrop-blur-xl hidden md:flex flex-col z-40">
            {/* Logo Area */}
            <div className="p-6 border-b border-white/10">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                        V
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        V-TAC
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-indigo-500 dark:hover:text-indigo-400'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-indigo-500 dark:group-hover:text-indigo-400'} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>


        </aside>
    );
}
