"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Key, Copy, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

interface ApiKey {
  id: string;
  label: string;
  key_snippet: string; // Wir speichern nur ein Fragment zur Anzeige
  created_at: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyFull, setNewKeyFull] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Echte Keys beim Laden der Seite abrufen
  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, label, key_snippet, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setKeys(data);
    }
    setLoading(false);
  };

  // 2. Einen echten Key über die Edge Function generieren
  const generateKey = async () => {
    setIsGenerating(true);
    try {
      // Aufruf der Supabase Edge Function "manage-keys"
      const { data, error } = await supabase.functions.invoke('manage-keys', {
        body: { label: 'Produktions Key' }
      });

      if (error) throw error;

      // Den vollen Key nur EINMALIG anzeigen (Sicherheitsgründen)
      setNewKeyFull(data.apiKey);
      
      // Liste neu laden
      fetchKeys();
    } catch (err: any) {
      alert("Fehler: " + (err.message || "Key konnte nicht erstellt werden"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-slate-500 mt-2">Verwalte deine Zugangsdaten für externe Systeme.</p>
        </div>
        <button 
          onClick={generateKey}
          disabled={isGenerating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          {isGenerating ? 'Generiere...' : 'Key erstellen'}
        </button>
      </div>

      {/* Warnung wenn ein neuer Key erstellt wurde */}
      {newKeyFull && (
        <div className="bg-emerald-50 border-2 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 p-6 rounded-3xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
            <Check size={20} />
            Key erfolgreich generiert!
          </div>
          <p className="text-sm text-emerald-600 dark:text-emerald-500">
            Kopiere diesen Key jetzt. Er wird danach nie wieder vollständig angezeigt:
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-emerald-200">
            <code className="flex-1 font-mono text-blue-600 truncate">{newKeyFull}</code>
            <button 
              onClick={() => navigator.clipboard.writeText(newKeyFull)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Liste der Keys */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500 text-sm">Lade Keys...</div>
        ) : keys.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Key className="mx-auto text-slate-300 mb-3" size={40} />
            <p className="text-slate-500">Noch keine API Keys vorhanden.</p>
          </div>
        ) : (
          keys.map((k) => (
            <div key={k.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">{k.label}</h3>
                  <code className="text-xs text-slate-400 font-mono">sk_live_...{k.key_snippet}</code>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs text-slate-400">
                  Erstellt am {new Date(k.created_at).toLocaleDateString()}
                </span>
                <button className="text-slate-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}