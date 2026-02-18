"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X, Radio } from 'lucide-react';

export default function RealtimeFeed() {
  const [latest, setLatest] = useState<{title: string, message: string} | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Listen for new entries in the 'notifications' table via Supabase Realtime
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setLatest(payload.new as {title: string, message: string});
          setShow(true);
          
          // Auto-dismiss after 8 seconds
          const timer = setTimeout(() => setShow(false), 8000);
          return () => clearTimeout(timer);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!show || !latest) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="bg-white text-black p-1 shadow-[0_20px_50px_rgba(255,255,255,0.1)] rounded-2xl overflow-hidden max-w-[360px] border border-zinc-200">
        <div className="bg-black text-white p-5 flex gap-5 rounded-xl">
          <div className="relative shrink-0">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
              <Bell size={22} />
            </div>
            {/* Realtime Pulse Indicator */}
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Radio size={12} className="text-zinc-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Live Inbound</span>
            </div>
            <h4 className="font-bold text-sm tracking-tight truncate">{latest.title}</h4>
            <p className="text-xs text-zinc-400 mt-1 leading-snug line-clamp-2">
              {latest.message}
            </p>
          </div>

          <button 
            onClick={() => setShow(false)} 
            className="text-zinc-600 hover:text-white transition-colors h-fit p-1"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Progress Bar (Visualizer for the 8s timeout) */}
        <div className="h-1 bg-white animate-progress-shrink origin-left" />
      </div>
    </div>
  );
}