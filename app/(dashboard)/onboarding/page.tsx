"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Building2, Rocket, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const user = session.user;

      // 2. Create the Organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: orgName }])
        .select()
        .single();

      if (orgError) throw orgError;

      // 3. Link Profile to Organization and set Admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          org_id: org.id,
          role: 'admin',
          full_name: user.user_metadata.full_name || 'New Member'
        });

      if (profileError) throw profileError;

      // 4. Force refresh the session for the middleware to pick up the org_id
      await supabase.auth.refreshSession();

      // 5. Clean redirect to dashboard
      window.location.href = '/dashboard';
      
    } catch (err: any) {
      console.error("Onboarding Error:", err);
      setErrorMsg(err.message || "Something went wrong during setup.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] p-4 text-white font-sans">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-[#262626] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Decorative element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-black mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Building2 size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Final Steps</h1>
          <p className="text-zinc-500 mt-2 text-sm">Let's set up your workspace environment.</p>
        </div>

        <form onSubmit={handleCreateOrg} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">
              Organization Name
            </label>
            <div className="relative group">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
              <input 
                type="text" 
                required 
                autoFocus
                value={orgName} 
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-[#121212] border border-[#262626] rounded-xl text-white placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-white focus:border-white transition-all"
                placeholder="Acme Corp, Inc."
              />
            </div>
            <p className="text-[10px] text-zinc-600 flex items-center gap-1.5 ml-1">
              <ShieldCheck size={12} /> This will be your primary workspace name.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center animate-in fade-in zoom-in-95">
              {errorMsg}
            </div>
          )}

          <button 
            disabled={loading || !orgName}
            className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Initialize Workspace
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-[#262626] text-center">
          <p className="text-xs text-zinc-600">
            Need to join an existing organization? <br />
            <span className="text-zinc-400 cursor-pointer hover:text-white transition-colors underline underline-offset-4">Request access from your admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}