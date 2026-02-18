"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  // Synchronize with system preference or local storage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light') {
      setDark(false);
    } else if (savedTheme === 'dark' || systemPrefersDark) {
      setDark(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button 
      onClick={() => setDark(!dark)}
      className="relative flex items-center justify-center p-2.5 rounded-xl border border-[#262626] bg-[#0a0a0a] text-zinc-400 hover:text-white hover:border-zinc-500 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      {/* Background Glow Effect on Hover */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10 transition-transform duration-500 rotate-0 group-active:rotate-90">
        {dark ? (
          <Sun size={18} strokeWidth={2.5} className="animate-in zoom-in duration-300" />
        ) : (
          <Moon size={18} strokeWidth={2.5} className="animate-in zoom-in duration-300" />
        )}
      </div>

      {/* Subtle Tooltip (Optional) */}
      <span className="sr-only">Switch to {dark ? 'Light' : 'Dark'} Mode</span>
    </button>
  );
}