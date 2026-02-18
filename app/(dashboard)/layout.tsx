"use client";

import React from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Bell, 
  Key, 
  Settings, 
  LogOut, 
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'API Keys', href: '/api-keys', icon: Key },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex">
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#262626] bg-[#0a0a0a] flex flex-col sticky top-0 h-screen">
        
        {/* Branding */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
            <Zap size={22} fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tighter italic">PYLON.</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5">
          <p className="px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                  : 'text-zinc-400 hover:text-white hover:bg-[#161616]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className={`font-medium text-sm ${isActive ? 'font-bold' : ''}`}>
                    {item.name}
                  </span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="p-6 border-t border-[#262626]">
          <div className="bg-[#121212] rounded-2xl p-4 mb-4 border border-[#262626]">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plan: Pro</span>
            </div>
            <p className="text-xs text-zinc-400">Next billing: Mar 18</p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header Placeholder (optional for search or profile) */}
        <header className="h-16 border-b border-[#262626] flex items-center justify-end px-10 bg-[#000000]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-400 border border-[#262626]" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="p-10 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}