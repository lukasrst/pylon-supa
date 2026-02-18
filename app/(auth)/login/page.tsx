"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Falls der User bereits eine Session hat, schicken wir ihn direkt weg
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) window.location.href = '/dashboard';
    };
    checkUser();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Login-Versuch
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData?.user) {
        // 2. Profil abrufen, um zu prüfen, ob Onboarding nötig ist
        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id')
          .eq('id', authData.user.id)
          .maybeSingle();

        // 3. Finaler Redirect via window.location für Middleware-Synchronisation
        if (profile?.org_id) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/onboarding';
        }
      }
    } catch (err: any) {
      const message = err.message === 'Invalid login credentials' 
        ? 'Invalid email or password. Please try again.'
        : err.message || "An unexpected error occurred.";
      
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 text-white font-sans selection:bg-white selection:text-black">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        
        {/* Card Container */}
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent opacity-30" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-black mb-6 shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <Lock size={28} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">System Access</h1>
            <p className="text-zinc-500 text-sm mt-3 font-medium">Identify yourself to enter the workspace</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Identity</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#121212] border border-[#262626] rounded-2xl text-white placeholder:text-zinc-800 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#121212] border border-[#262626] rounded-2xl text-white placeholder:text-zinc-800 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={16} className="shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-2 bg-white hover:bg-zinc-200 text-black rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Login
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-[#161616] text-center">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Security Protocol v2.4.0
            </p>
          </div>
        </div>

        {/* Geänderter Footer Link */}
        <p className="mt-8 text-center text-zinc-500 text-sm font-medium">
          New here?{' '}
          <Link 
            href="/register" 
            className="text-white font-bold hover:underline underline-offset-4 transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}