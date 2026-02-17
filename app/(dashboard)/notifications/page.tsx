"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Mail, Bell, Smartphone } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*, notification_logs(*)')
        .order('created_at', { ascending: false });
      if (data) setNotifications(data);
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold">Notification History</h1>
          <p className="text-slate-500 mt-1">Alle gesendeten Nachrichten und deren Status.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Suchen..."
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-blue-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Nachricht</th>
              <th className="px-6 py-4 font-semibold">Channels</th>
              <th className="px-6 py-4 font-semibold">Priorität</th>
              <th className="px-6 py-4 font-semibold">Zeitpunkt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <tr key={n.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-xs text-slate-500 truncate max-w-[300px]">{n.message}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {n.channels.email && <Mail size={14} className="text-slate-400" />}
                    {n.channels.dashboard && <Bell size={14} className="text-blue-500" />}
                    {n.channels.push && <Smartphone size={14} className="text-slate-400" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    n.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'
                  }`}>
                    {n.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {new Date(n.created_at).toLocaleString('de-DE')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}