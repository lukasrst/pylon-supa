"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  Mail, 
  Bell, 
  Smartphone, 
  Loader2, 
  Inbox,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('notifications')
        .select('*, notification_logs(*)')
        .order('created_at', { ascending: false });
      
      if (data) setNotifications(data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Notification History</h1>
          <p className="text-zinc-500 mt-2 text-lg">Track and monitor all outgoing messages and their delivery status.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
            <input 
              className="pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-sm text-white outline-none focus:ring-1 focus:ring-white focus:border-white transition-all w-64"
              placeholder="Search logs..."
            />
          </div>
          <button className="p-2.5 bg-[#0a0a0a] border border-[#262626] rounded-xl text-zinc-400 hover:text-white hover:border-zinc-500 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#262626] bg-[#0c0c0c]">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Message Content</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Channels</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Priority</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Timestamp</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-zinc-600" size={32} />
                      <span className="text-zinc-500 text-sm font-medium uppercase tracking-widest">Fetching logs...</span>
                    </div>
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center text-zinc-700">
                        <Inbox size={32} />
                      </div>
                      <p className="text-zinc-500 font-medium">No notifications sent yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="group hover:bg-[#121212]/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:translate-x-1 transition-transform">{n.title}</span>
                        <span className="text-sm text-zinc-500 line-clamp-1 max-w-xs mt-1">{n.message}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        {n.channels.email && (
                          <div className="p-2 bg-[#161616] rounded-lg text-zinc-400 group-hover:text-white transition-colors" title="Email">
                            <Mail size={16} />
                          </div>
                        )}
                        {n.channels.dashboard && (
                          <div className="p-2 bg-white text-black rounded-lg" title="In-App Notification">
                            <Bell size={16} />
                          </div>
                        )}
                        {n.channels.push && (
                          <div className="p-2 bg-[#161616] rounded-lg text-zinc-400 group-hover:text-white transition-colors" title="Push Message">
                            <Smartphone size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        n.priority === 'high' 
                        ? 'bg-white text-black' 
                        : 'border border-[#262626] text-zinc-500'
                      }`}>
                        {n.priority}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-zinc-700" />
                        <span>
                          {new Date(n.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-zinc-700 group-hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-[#262626] bg-[#0c0c0c] flex justify-between items-center">
          <span className="text-xs text-zinc-600 font-medium">Showing {notifications.length} entries</span>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 border border-[#262626] rounded-lg text-xs font-bold text-zinc-500 hover:text-white disabled:opacity-30" disabled>Previous</button>
            <button className="px-4 py-1.5 border border-[#262626] rounded-lg text-xs font-bold text-zinc-500 hover:text-white disabled:opacity-30" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}