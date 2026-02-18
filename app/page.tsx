"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Terminal, 
  Shield, 
  Layers, 
  Code2, 
  CheckCircle2,
  Github
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-white selection:text-black">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-[#161616]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black">
            <Zap size={20} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tighter italic">Notify.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#api" className="hover:text-white transition-colors">API</a>
          <a href="/login" className="hover:text-white transition-colors">Log in</a>
          <Link 
            href="/register" 
            className="bg-white text-black px-5 py-2 rounded-xl font-bold hover:bg-zinc-200 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-24 pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212] border border-[#262626] text-zinc-400 text-xs font-bold tracking-widest uppercase mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Now in Private Beta
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          Notification infrastructure <br className="hidden md:block" /> for modern teams.
        </h1>
        
        <p className="max-w-2xl mx-auto text-zinc-500 text-lg md:text-xl leading-relaxed mb-12">
          The API-first solution to deliver multi-channel notifications. 
          Email, Push, and In-App alerts with a single line of code.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Start Building Free
            <ArrowRight size={20} />
          </Link>
          <button className="w-full sm:w-auto bg-[#0a0a0a] border border-[#262626] text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#121212] transition-all">
            <Github size={20} />
            View Documentation
          </button>
        </div>
      </section>

      {/* Code Preview Section */}
      <section id="api" className="px-8 py-20 max-w-5xl mx-auto">
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-3xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-[#0c0c0c] border-b border-[#262626]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#262626]" />
              <div className="w-3 h-3 rounded-full bg-[#262626]" />
              <div className="w-3 h-3 rounded-full bg-[#262626]" />
            </div>
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={12} /> notify-api.js
            </div>
          </div>
          <div className="p-8 overflow-x-auto">
            <pre className="font-mono text-sm leading-relaxed">
              <code className="text-zinc-400">
                <span className="text-zinc-600">// Send a multi-channel alert</span> {"\n"}
                <span className="text-white">await</span> <span className="text-zinc-200">notify.send</span>({"{"} {"\n"}
                {"  "}recipient: <span className="text-zinc-100">"user_99"</span>, {"\n"}
                {"  "}channels: [<span className="text-zinc-100">"email", "in-app", "push"</span>], {"\n"}
                {"  "}priority: <span className="text-zinc-100">"high"</span>, {"\n"}
                {"  "}template: <span className="text-zinc-100">"order_shipped"</span>, {"\n"}
                {"  "}data: {"{"} order_id: <span className="text-zinc-100">"5011"</span> {"}"} {"\n"}
                {"}"});
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="px-8 py-32 max-w-7xl mx-auto border-t border-[#161616]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <Feature 
            icon={<Shield size={24} />} 
            title="Enterprise Security" 
            desc="Role-based access, API key rotation, and full audit logs come standard."
          />
          <Feature 
            icon={<Layers size={24} />} 
            title="Channel Routing" 
            desc="Smart logic to decide whether to send a push or fallback to an email."
          />
          <Feature 
            icon={<Code2 size={24} />} 
            title="Developer First" 
            desc="Type-safe SDKs, webhooks, and a CLI designed for your workflow."
          />
        </div>
      </section>

      {/* Social Proof / Footer Callout */}
      <section className="px-8 py-32 bg-[#050505] border-y border-[#161616]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 italic tracking-tighter">"The last notification API you'll ever need."</h2>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black">Trusted by 200+ engineering teams</p>
          <div className="mt-12">
            <Link 
              href="/register" 
              className="inline-flex items-center gap-2 text-white font-bold hover:gap-4 transition-all group border-b border-white pb-1"
            >
              Build your first project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="px-8 py-12 text-center text-zinc-600 text-xs font-medium uppercase tracking-widest">
        &copy; 2026 Notify API Infrastructure. All rights reserved.
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="space-y-4 group">
      <div className="w-12 h-12 bg-[#121212] border border-[#262626] rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-zinc-500 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">{desc}</p>
      <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CheckCircle2 size={14} className="text-emerald-500" />
        Fully Managed
      </div>
    </div>
  );
}