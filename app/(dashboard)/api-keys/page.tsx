"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Key, 
  Copy, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  ShieldCheck,
  Fingerprint
} from 'lucide-react';

interface ApiKey {
  id: string;
  label: string;
  key_snippet: string;
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyFull, setNewKeyFull] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, label, key_snippet, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) setKeys(data);
    setLoading(false);
  };

  const generateKey = async () => {
    setIsGenerating(true);
    setNewKeyFull(null);
    try {
      const { data, error } = await supabase.functions.invoke('manage-keys', {
        body: { label: 'Production Key' }
      });

      if (error) throw error;

      setNewKeyFull(data.apiKey);
      fetchKeys();
    } catch (err: any) {
      console.error("Generation failed:", err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">API Credentials</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage secret keys to authenticate your API requests.</p>
        </div>
        <button 
          onClick={generateKey}
          disabled={isGenerating}
          className="bg-white hover:bg-zinc-200 text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Generate New Key
        </button>
      </div>

      {/* One-time Display for New Key */}
      {newKeyFull && (
        <div className="bg-white text-black p-8 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.15)] animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-black text-white rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Secret Key Generated</h2>
          </div>
          <p className="text-sm text-zinc-600 mb-6 font-medium">
            Please copy this key now. For security reasons, it will <span className="underline decoration-2">never be shown again</span>.
          </p>
          <div className="flex items-center gap-3 bg-zinc-100 p-4 rounded-2xl border border-zinc-200">
            <code className="flex-1 font-mono text-sm font-bold break-all">{newKeyFull}</code>
            <button 
              onClick={() => copyToClipboard(newKeyFull)}
              className="p-3 bg-black text-white hover:bg-zinc-800 rounded-xl transition-all flex items-center gap-2 shrink-0"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              <span className="text-xs font-bold uppercase">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Keys Table/List */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-[#262626] bg-[#0c0c0c] flex items-center gap-2">
          <Fingerprint size={18} className="text-zinc-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Active Access Keys</h3>
        </div>

        <div className="divide-y divide-[#262626]">
          {loading ? (
            <div className="p-20 flex justify-center">
              <Loader2 className="animate-spin text-zinc-700" size={32} />
            </div>
          ) : keys.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#121212] rounded-full flex items-center justify-center text-zinc-700 mb-4">
                <Key size={32} />
              </div>
              <p className="text-zinc-500 font-medium italic">No API keys found. Create one to get started.</p>
            </div>
          ) : (
            keys.map((k) => (
              <div key={k.id} className="p-6 flex items-center justify-between hover:bg-[#121212]/50 transition-all group">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-[#121212] border border-[#262626] rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:border-zinc-500 transition-all">
                    <Key size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:translate-x-1 transition-transform">{k.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs text-zinc-500 font-mono bg-[#161616] px-2 py-0.5 rounded">
                        sk_live_••••••••{k.key_snippet}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Created</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{new Date(k.created_at).toLocaleDateString()}</p>
                  </div>
                  <button className="p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="flex items-center gap-4 p-6 bg-[#121212] border border-[#262626] rounded-2xl text-zinc-400">
        <AlertCircle size={20} className="shrink-0" />
        <p className="text-sm">
          Keep your API keys secure. If a key is compromised, delete it immediately and generate a new one. 
          View our <span className="text-white hover:underline cursor-pointer flex-inline items-center gap-1">Security Documentation <ExternalLink size={12} className="inline mb-1" /></span>.
        </p>
      </div>
    </div>
  );
}