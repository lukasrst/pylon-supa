"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email, password
      });

      if (error) throw error;

      // Wir holen uns das Profil, um zu wissen wohin die Reise geht
      const { data: profile } = await supabase
        .from('profiles')
        .select('org_id')
        .eq('id', data.user.id)
        .single();

      // Harter Sprung - das umgeht alle Next.js Routing Probleme
      if (profile?.org_id) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/onboarding';
      }
    } catch (err: any) {
      alert("Fehler: " + err.message);
      setLoading(false); // Wichtig, damit der Button wieder klickbar wird!
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="p-8 bg-slate-800 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-white">Login</h1>
        <input 
          type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white outline-none focus:ring-2 ring-blue-500"
        />
        <input 
          type="password" placeholder="Passwort" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-slate-700 text-white outline-none focus:ring-2 ring-blue-500"
        />
        <button 
          type="submit" disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Verarbeite...' : 'Jetzt Einloggen'}
        </button>
      </form>
    </div>
  );
}