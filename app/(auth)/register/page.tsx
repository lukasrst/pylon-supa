"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Successful registration - redirecting to onboarding
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 text-white font-sans">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black mx-auto mb-4">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-zinc-500 text-sm mt-2">Start your API-first notification journey today.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="text" 
                required 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder:text-zinc-600 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Error Display */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Create Account
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-medium hover:underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}