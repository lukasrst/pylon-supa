"use client";
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Building2, Rocket } from 'lucide-react';

export default function OnboardingPage() {
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Session abrufen
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const user = session.user;

      // 2. Organisation erstellen
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name: orgName }])
        .select()
        .single();

      if (orgError) throw orgError;

      // 3. Profil aktualisieren
      // WICHTIG: Wir nutzen upsert, um sicherzugehen, dass das Profil existiert
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          org_id: org.id,
          role: 'admin',
          full_name: user.user_metadata.full_name || 'User'
        });

      if (profileError) throw profileError;

      // 4. Session im Client aktualisieren (Wichtig für Middleware!)
      await supabase.auth.refreshSession();

      // 5. Weiterleitung
      window.location.href = '/dashboard'
      router.refresh(); // Aktualisiert die Server-Side Daten
      
    } catch (err: any) {
      console.error("Onboarding Error:", err);
      alert(err.message || "Fehler beim Setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Fast geschafft!</h1>
          <p className="text-slate-500 mt-2">Wie soll deine Organisation heißen?</p>
        </div>

        <form onSubmit={handleCreateOrg} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-1.5 block text-slate-700 dark:text-slate-300">Name der Organisation</label>
            <div className="relative text-slate-900 dark:text-white">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" required value={orgName} onChange={(e) => setOrgName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="z.B. Mein SaaS Projekt"
              />
            </div>
          </div>

          <button 
            disabled={loading || !orgName}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            <Rocket size={18} />
            {loading ? 'Erstelle...' : 'Setup abschließen'}
          </button>
        </form>
      </div>
    </div>
  );
}