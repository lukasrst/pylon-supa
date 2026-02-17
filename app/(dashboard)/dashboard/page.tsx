"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  Bell, 
  Key, 
  Settings,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    notifications: 0,
    apiKeys: 0,
    orgName: ''
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // 1. Org-Daten und Name holen
        const { data: profile } = await supabase
          .from('profiles')
          .select('organizations(name)')
          .eq('id', session.user.id)
          .single();

        // 2. Anzahl der Notifications zählen
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true });

        // 3. Anzahl der API-Keys zählen
        const { count: keyCount } = await supabase
          .from('api_keys')
          .select('*', { count: 'exact', head: true });

        setStats({
          notifications: notifCount || 0,
          apiKeys: keyCount || 0,
          orgName: (profile?.organizations as any)?.name || 'Meine Organisation'
        });
      } catch (error) {
        console.error("Fehler beim Laden der Stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Bereich */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Willkommen zurück 👋
        </h1>
        <p className="text-slate-500 mt-2">
          Dashboard Übersicht für <span className="font-semibold text-blue-600">{stats.orgName}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Gesendete Notifications" 
          value={stats.notifications.toString()} 
          icon={<Bell size={24} />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Aktive API Keys" 
          value={stats.apiKeys.toString()} 
          icon={<Key size={24} />} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="System Status" 
          value="Online" 
          icon={<Activity size={24} />} 
          color="bg-purple-500" 
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold mb-6">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionLink href="/notifications" label="Notifications senden" icon={<Bell size={20} />} />
          <QuickActionLink href="/api-keys" label="API Keys verwalten" icon={<Key size={20} />} />
          <QuickActionLink href="/settings" label="Einstellungen" icon={<Settings size={20} />} />
          <QuickActionLink href="/dashboard" label="User verwalten" icon={<Users size={20} />} />
        </div>
      </div>
    </div>
  );
}

// Hilfskomponente für die Stats
function StatCard({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl text-white ${color}`}>
          {icon}
        </div>
        <ArrowUpRight className="text-slate-400" size={20} />
      </div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

// Hilfskomponente für Quick Actions
function QuickActionLink({ href, label, icon }: { href: string, label: string, icon: any }) {
  return (
    <a href={href} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
      <div className="text-slate-500 group-hover:text-blue-600">
        {icon}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}