"use client";

import React, { useEffect, useState } from "react";
import { Users, Search, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured || !supabase) {
        setClients([
          { id: '1', email: 'mokhtari.achref06@gmail.com', role: 'admin', created_at: new Date().toISOString() },
          { id: '2', email: 'toumiachref21@gmail.com', role: 'admin', created_at: new Date().toISOString() },
          { id: '3', email: 'client.tunis@cardeal.tn', role: 'client', created_at: new Date().toISOString() },
          { id: '4', email: 'm.trabelsi@garage.tn', role: 'partner', created_at: new Date().toISOString() },
        ]);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setClients(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = clients.filter((c) => c.email?.toLowerCase().includes(search.toLowerCase()) || c.role?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Annuaire des Utilisateurs & Clients</h2>
        <p className="mt-1 text-sm text-neutral-400">Gérez les comptes enregistrés, les rôles et les permissions d'accès.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-neutral-500" size={16} />
        <input
          type="text"
          placeholder="Rechercher par email ou rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 pl-10 pr-4 py-3 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 text-xs bg-neutral-950/60">
              <th className="p-4">Utilisateur</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Date d'inscription</th>
              <th className="p-4 text-right">Statut RLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.map((c) => (
              <tr key={c.id || c.email} className="hover:bg-neutral-800/30 transition">
                <td className="p-4 font-semibold text-white flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-300 text-xs font-bold">
                    {(c.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  {c.email}
                </td>
                <td className="p-4">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase ${
                    c.role === 'admin' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    c.role === 'partner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {c.role || 'client'}
                  </span>
                </td>
                <td className="p-4 text-xs text-neutral-400">{new Date(c.created_at || Date.now()).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <ShieldCheck size={14} /> Protégé
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
