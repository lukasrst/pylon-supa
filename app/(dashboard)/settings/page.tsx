"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Shield, Trash2, MailPlus } from 'lucide-react';

export default function SettingsPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      const { data } = await supabase.from('profiles').select('*');
      if (data) setTeam(data);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Einstellungen</h1>
        <p className="text-slate-500">Verwalte deine Organisation und dein Team.</p>
      </header>

      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <h2 className="text-lg font-semibold">Teammitglieder</h2>
          </div>
          <button className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
            <MailPlus size={16} /> Einladen
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {team.map((member) => (
            <div key={member.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center font-bold">
                  {member.full_name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{member.full_name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Shield size={12} />
                    <span className="capitalize">{member.role}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}