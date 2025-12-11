'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Database, Globe, Zap, Shield, Layout, Github } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          LinkCheck
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">System Online</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-tight">
            Control Your <br />
            <span className="text-gradient">Digital Flow.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The professional link management platform for modern teams.
            Shorten URLs, track analytics, and optimize Google Drive downloads instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                Start for Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank">
              <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                <Github className="mr-2 w-5 h-5" />
                View Source
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <FeatureCard
            icon={Globe}
            title="Smart Redirects"
            desc="Lightning fast redirection engine powered by Vercel Edge Network."
          />
          <FeatureCard
            icon={Database}
            title="Drive Integration"
            desc="Automatically converts Google Drive view links to direct downloads."
          />
          <FeatureCard
            icon={Shield}
            title="Secure Analytics"
            desc="Privacy-focused click tracking with detailed dashboard insights."
          />
        </motion.div>
      </main>

      <footer className="py-12 text-center text-slate-600 text-sm">
        <p>&copy; 2025 LinkCheck Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all hover:-translate-y-1 text-left">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}
