'use client';

import Header from '@/components/Header';

export default function SettingsPage() {

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                    Settings
                </h1>
                <p className="text-slate-400 mt-1">Manage your account preferences</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Account Settings</h2>
                <p className="text-slate-500 dark:text-slate-400">Settings configuration will appear here.</p>
            </div>
        </div>
    );
}
