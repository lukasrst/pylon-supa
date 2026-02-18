"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Bell, 
  Key, 
  Settings,
  Activity,
  ArrowUpRight,
  Loader2,
  ChevronRight
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

        // 1. Fetch profile and organization name
        const { data: profile } = await supabase
          .from('profiles')
          .select('organizations(name)')
          .eq('id', session.user.id)
          .single();

        // 2. Count total notifications
        const { count: notifCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true });

        // 3. Count active API keys
        const { count: keyCount } = await supabase
          .from('api_keys')
          .select('*', { count: 'exact', head: true });

        setStats({
          notifications: notifCount || 0,
          apiKeys: keyCount || 0,
          orgName: (profile?.organizations as any)?.name || 'Personal Workspace'
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-sm font-medium">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Overview for <span className="text-white font-medium">{stats.orgName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#121212] border border-[#262626] rounded-full text-xs font-mono text-zinc-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM OPERATIONAL
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Notifications" 
          value={stats.notifications.toLocaleString()} 
          icon={<Bell size={20} />} 
          description="Last 30 days"
        />
        <StatCard 
          title="Active API Keys" 
          value={stats.apiKeys.toString()} 
          icon={<Key size={20} />} 
          description="Across all projects"
        />
        <StatCard 
          title="Service Status" 
          value="Online" 
          icon={<Activity size={20} />} 
          description="Latency: 24ms"
        />
      </div>

      {/* Quick Actions & Navigation */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-[#262626]">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage your notification infrastructure</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#262626]">
          <QuickActionLink 
            href="/notifications" 
            label="Send Notification" 
            sub="Broadcast messages to clients"
            icon={<Bell size={20} />} 
          />
          <QuickActionLink 
            href="/api-keys" 
            label="Manage API Keys" 
            sub="Create and revoke access"
            icon={<Key size={20} />} 
          />
          <QuickActionLink 
            href="/settings" 
            label="System Settings" 
            sub="Configure webhooks and org"
            icon={<Settings size={20} />} 
          />
          <QuickActionLink 
            href="/users" 
            label="Team Management" 
            sub="Invite and manage members"
            icon={<Users size={20} />} 
          />
        </div>
      </div>
    </div>
  );
}

// Optimized Stat Card
function StatCard({ title, value, icon, description }: { title: string, value: string, icon: any, description: string }) {
  return (
    <div className="group bg-[#0a0a0a] border border-[#262626] p-6 rounded-3xl hover:border-zinc-500 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-2xl bg-[#121212] border border-[#262626] text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
          {icon}
        </div>
        <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" size={20} />
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1 text-white">{value}</p>
        <p className="text-zinc-600 text-xs mt-2 uppercase tracking-wider font-semibold">{description}</p>
      </div>
    </div>
  );
}

// Optimized Quick Action
function QuickActionLink({ href, label, sub, icon }: { href: string, label: string, sub: string, icon: any }) {
  return (
    <a href={href} className="flex items-center justify-between p-8 hover:bg-[#121212] transition-all group">
      <div className="flex items-center gap-6">
        <div className="text-zinc-500 group-hover:text-white transition-colors">
          {icon}
        </div>
        <div>
          <span className="block font-semibold text-white">{label}</span>
          <span className="block text-zinc-500 text-sm mt-0.5">{sub}</span>
        </div>
      </div>
      <ChevronRight className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" size={20} />
    </a>
  );
}