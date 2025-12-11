'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RedirectCardProps {
    destinationUrl: string;
    type: 'url' | 'drive';
}

export default function RedirectCard({ destinationUrl, type }: RedirectCardProps) {
    const handleAction = () => {
        window.location.href = destinationUrl;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#030712] text-slate-200">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel max-w-md w-full p-8 rounded-2xl text-center relative z-10 border border-white/10 shadow-2xl"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10">
                    <ShieldCheck size={32} className="text-indigo-400" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">
                    {type === 'drive' ? 'File Ready' : 'Link Ready'}
                </h1>
                <p className="text-slate-400 mb-8">
                    {type === 'drive'
                        ? 'Your secure download is ready. Click below to start.'
                        : 'You are about to be redirected to an external site.'}
                </p>

                <Button
                    size="lg"
                    className="w-full h-12 text-base shadow-lg shadow-indigo-500/20"
                    onClick={handleAction}
                >
                    {type === 'drive' ? (
                        <>
                            <Download size={20} className="mr-2" /> Download Now
                        </>
                    ) : (
                        <>
                            <ExternalLink size={20} className="mr-2" /> Continue to Link
                        </>
                    )}
                </Button>

                <div className="mt-6 text-xs text-slate-600">
                    Protected by V-TAC Secure Link
                </div>
            </motion.div>
        </div>
    );
}
