"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, X } from 'lucide-react';

export default function RealtimeFeed() {
  const [latest, setLatest] = useState<{title: string, message: string} | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setLatest(payload.new as {title: string, message: string});
          setShow(true);
          setTimeout(() => setShow(false), 8000);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (!show || !latest) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-500 shadow-2xl rounded-2xl p-5 flex gap-4 max-w-sm">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
          <Bell className="animate-ring" size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Neue Mitteilung</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            <strong>{latest.title}</strong>: {latest.message}
          </p>
        </div>
        <button onClick={() => setShow(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}