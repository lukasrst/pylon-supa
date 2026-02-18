"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Shield, 
  Trash2, 
  MailPlus, 
  Loader2, 
  Search,
  MoreVertical,
  UserCircle
} from 'lucide-react';

export default function SettingsPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      // Fetching profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });
      
      if (!error && data) setTeam(data);
      setLoading(false);
    };
    fetchTeam();
  }, []);

  const filteredTeam = team.filter(member => 
    member.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage your organization, billing, and team members.</p>
        </div>
        <button className="hidden md:flex items-center gap-2 bg-white hover:bg-zinc-200 text-black px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 text-sm">
          <MailPlus size={18} />
          Invite Member
        </button>
      </header>

      {/* Team Section */}
      <section className="bg-[#0a0a0a] border border-[#262626] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Section Header & Search */}
        <div className="p-8 border-b border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#121212] border border-[#262626] flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Team Members</h2>
              <p className="text-zinc-500 text-sm">You have {team.length} active members in your workspace.</p>
            </div>
          </div>
          
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121212] border border-[#262626] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-white focus:border-white transition-all outline-none"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-[#262626]">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-zinc-600">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-medium tracking-wide uppercase">Syncing team database...</p>
            </div>
          ) : filteredTeam.length > 0 ? (
            filteredTeam.map((member) => (
              <div key={member.id} className="p-6 flex items-center justify-between hover:bg-[#121212]/50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#121212] border border-[#262626] rounded-full flex items-center justify-center font-bold text-white overflow-hidden group-hover:border-zinc-400 transition-colors">
                      {member.avatar_url ? (
                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        member.full_name?.charAt(0) || <UserCircle size={20} />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0a0a0a] rounded-full" />
                  </div>
                  <div>
                    <p className="font-semibold text-white tracking-tight">{member.full_name || 'Anonymous'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors uppercase tracking-widest flex items-center gap-1.5">
                        <Shield size={12} className="text-zinc-600" />
                        {member.role || 'Member'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2.5 text-zinc-500 hover:text-white hover:bg-[#262626] rounded-lg transition-all">
                    <MoreVertical size={18} />
                  </button>
                  <button className="p-2.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <p className="text-zinc-500">No members found matching your search.</p>
            </div>
          )}
        </div>
        
        {/* Section Footer */}
        <div className="p-6 bg-[#121212]/30 text-center">
          <p className="text-xs text-zinc-600 font-medium">
            Manage roles and permissions in the <span className="text-zinc-400 cursor-pointer hover:underline">Access Control</span> tab.
          </p>
        </div>
      </section>

      {/* Danger Zone Placeholder */}
      <section className="p-8 border border-red-900/20 bg-red-900/5 rounded-3xl flex items-center justify-between">
        <div>
          <h3 className="text-red-500 font-bold tracking-tight">Danger Zone</h3>
          <p className="text-zinc-500 text-sm mt-1">Permanently delete this organization and all associated data.</p>
        </div>
        <button className="px-5 py-2.5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-sm font-bold transition-all">
          Delete Organization
        </button>
      </section>
    </div>
  );
}