'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Link as LinkIcon, HardDrive, LogOut, Copy, X,
    ChevronDown, ChevronUp, Trash2, Edit2, Calendar, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Expanded State
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Edit State
    const [editingLink, setEditingLink] = useState<LinkData | null>(null);

    // Form State
    const [url, setUrl] = useState('');
    const [type, setType] = useState<'url' | 'drive'>('url');
    const [customCode, setCustomCode] = useState('');
    const [expiry, setExpiry] = useState('');

    // Expiry Mode State
    const [expiryMode, setExpiryMode] = useState('never');

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

    const openCreateModal = () => {
        setEditingLink(null);
        setUrl('');
        setType('url');
        setCustomCode('');
        setExpiry('');
        setExpiryMode('never');
        setIsModalOpen(true);
    };

    const openEditModal = (link: LinkData) => {
        setEditingLink(link);
        setUrl(link.originalUrl);
        setType(link.type);
        setCustomCode(link.shortCode);

        if (link.expiresAt) {
            setExpiry(new Date(link.expiresAt).toISOString().slice(0, 16));
            setExpiryMode('custom');
        } else {
            setExpiry('');
            setExpiryMode('never');
        }

        setIsModalOpen(true);
    };

    const handleExpiryPresetChange = (val: string) => {
        setExpiryMode(val);
        const now = new Date();

        switch (val) {
            case 'never':
                setExpiry('');
                break;
            case '3d':
                now.setDate(now.getDate() + 3);
                setExpiry(now.toISOString().slice(0, 16));
                break;
            case '7d':
                now.setDate(now.getDate() + 7);
                setExpiry(now.toISOString().slice(0, 16));
                break;
            case '14d':
                now.setDate(now.getDate() + 14);
                setExpiry(now.toISOString().slice(0, 16));
                break;
            case '30d':
                now.setDate(now.getDate() + 30);
                setExpiry(now.toISOString().slice(0, 16));
                break;
            case 'custom':
                // keep current expiry or set to tomorrow if empty
                if (!expiry) {
                    now.setDate(now.getDate() + 1);
                    setExpiry(now.toISOString().slice(0, 16));
                }
                break;
        }
    };

    const handleLinkSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateLoading(true);

        // Check editing or creating
        const isEdit = !!editingLink;
        const endpoint = isEdit ? `/api/links/${editingLink._id}` : '/api/links';
        const method = isEdit ? 'PATCH' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url,
                    type,
                    ...(hasChanged(customCode, editingLink?.shortCode) && { shortCode: customCode || undefined }),
                    expiresAt: expiry || null
                }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchLinks();
                // Reset
                setUrl('');
                setCustomCode('');
                setExpiry('');
                setEditingLink(null);
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to save link');
            }
        } catch (err) {
            alert('Error saving link');
        } finally {
            setCreateLoading(false);
        }
    };

    const deleteLink = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLinks(links.filter(l => l._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting');
        }
    };

    const copyToClipboard = (shortCode: string) => {
        const fullUrl = `${window.location.origin}/${shortCode}`;
        navigator.clipboard.writeText(fullUrl);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Helper to prevent sending null if unchanged, mainly for shortCode collision checks
    function hasChanged(newVal: string, oldVal?: string) {
        if (!oldVal && !newVal) return false;
        if (!oldVal && newVal) return true;
        return newVal !== oldVal;
    }

    if (loading || status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto relative pb-24">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">Manage your links and analytics</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button onClick={openCreateModal} className="flex-1 md:flex-none">
                        <Plus size={18} className="mr-2" />
                        Create Link
                    </Button>
                    <Button variant="secondary" onClick={() => signOut()}>
                        <LogOut size={18} />
                    </Button>
                </div>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatsCard label="Total Links" value={links.length} color="text-white" />
                <StatsCard
                    label="Total Clicks"
                    value={links.reduce((acc, link) => acc + link.clicks, 0)}
                    color="text-indigo-400"
                />
                <StatsCard
                    label="Drive Links"
                    value={links.filter(l => l.type === 'drive').length}
                    color="text-green-400"
                />
            </div>

            {/* Links List */}
            <div className="grid grid-cols-1 gap-4">
                {links.length === 0 ? (
                    <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <LinkIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No links created yet. Click "Create Link" to get started.</p>
                    </div>
                ) : (
                    links.map((link) => (
                        <motion.div
                            key={link._id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-panel rounded-xl overflow-hidden transition-all group"
                        >
                            <div
                                className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => toggleExpand(link._id)}
                            >
                                <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${link.type === 'drive' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                                        {link.type === 'drive' ? <HardDrive size={20} /> : <LinkIcon size={20} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-semibold text-lg text-white truncate">/{link.shortCode}</h3>
                                            {link.type === 'drive' && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">Drive</span>
                                            )}
                                            {link.expiresAt && new Date(link.expiresAt) < new Date() && (
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">Expired</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 truncate max-w-[200px] md:max-w-[400px]">
                                            {link.originalUrl}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold font-mono text-indigo-300">{link.clicks}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Clicks</p>
                                    </div>
                                    <div className="flex gap-2 text-slate-400 items-center">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyToClipboard(link.shortCode); }}
                                            className="p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-400 transition-colors mr-2"
                                            title="Copy Link"
                                        >
                                            <Copy size={16} />
                                        </button>
                                        {expandedId === link._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedId === link._id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 bg-black/20"
                                    >
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {/* QRCode Placeholder (Functionality could be added via library later) */}
                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Short Link</span>
                                                <div className="flex gap-2">
                                                    <Input readOnly value={`${typeof window !== 'undefined' ? window.location.origin : ''}/${link.shortCode}`} className="bg-black/40 border-slate-800" />
                                                    <Button onClick={() => copyToClipboard(link.shortCode)} variant="secondary"><Copy size={16} /></Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Expiry Date</span>
                                                <div className="flex items-center gap-2 text-slate-300 h-10 px-3 rounded-lg border border-slate-800 bg-slate-950/50">
                                                    <Calendar size={16} className="text-indigo-400" />
                                                    <span className="text-sm">
                                                        {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Never'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Actions</span>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => openEditModal(link)} className="flex-1" variant="secondary">
                                                        <Edit2 size={16} className="mr-2" /> Edit
                                                    </Button>
                                                    <Button onClick={() => deleteLink(link._id)} className="flex-1" variant="danger">
                                                        <Trash2 size={16} className="mr-2" /> Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-[#0f1118] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">{editingLink ? 'Edit Link' : 'Create New Link'}</h2>
                            <form onSubmit={handleLinkSubmit} className="space-y-5">
                                <Input
                                    label="Destination URL"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Link Type</label>
                                        <div className="relative">
                                            <select
                                                value={type}
                                                onChange={(e) => setType(e.target.value as any)}
                                                className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-slate-300"
                                            >
                                                <option value="url">Standard Rewrite</option>
                                                <option value="drive">Drive Download</option>
                                            </select>
                                            <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    <Input
                                        label="Alias (Optional)"
                                        type="text"
                                        value={customCode}
                                        onChange={(e) => setCustomCode(e.target.value)}
                                        placeholder="my-link"
                                        disabled={!!editingLink} // Disable editing alias to prevent broken links or complexity
                                    />
                                    {editingLink && <p className="text-[10px] text-slate-500 col-span-2 -mt-3 ml-1">* Alias cannot be changed after creation</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Expiry Date</label>
                                    <div className="relative mb-3">
                                        <select
                                            value={expiryMode}
                                            onChange={(e) => handleExpiryPresetChange(e.target.value)}
                                            className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer text-slate-300"
                                        >
                                            <option value="never">Never Dies</option>
                                            <option value="3d">Expires in 3 Days</option>
                                            <option value="7d">Expires in 7 Days</option>
                                            <option value="14d">Expires in 2 Weeks</option>
                                            <option value="30d">Expires in 1 Month</option>
                                            <option value="custom">Custom Date...</option>
                                        </select>
                                        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>

                                    {expiryMode === 'custom' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <Input
                                                type="datetime-local"
                                                value={expiry}
                                                onChange={(e) => setExpiry(e.target.value)}
                                                className="text-slate-300 [&::-webkit-calendar-picker-indicator]:invert"
                                                min={new Date().toISOString().slice(0, 16)}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={createLoading}
                                    >
                                        {editingLink ? 'Save Changes' : 'Create Link'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatsCard({ label, value, color }: { label: string, value: number, color?: string }) {
    return (
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</h3>
            <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
        </div>
    );
}
