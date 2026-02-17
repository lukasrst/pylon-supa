"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Bell, Key, Settings, LogOut, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
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
    <div className={`${darkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col">
          <div className="flex items-center gap-2 font-bold text-xl mb-10 tracking-tight">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">N</div>
            <span>NotifyAPI</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}