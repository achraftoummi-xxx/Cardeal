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
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Annuaire des Utilisateurs & Clients</h2>
        <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Gérez les comptes enregistrés, les rôles et les permissions d'accès.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 text-muted-foreground" size={16} />
        <input
          type="text"
          placeholder="Rechercher par email ou rôle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-border bg-card/40 pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs bg-secondary/60">
              <th className="p-4">Utilisateur</th>
              <th className="p-4">Rôle</th>
              <th className="p-4">Date d'inscription</th>
              <th className="p-4 text-right">Statut RLS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c) => (
              <tr key={c.id || c.email} className="hover:bg-accent/30 transition">
                <td className="p-4 font-semibold text-foreground flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-bold border border-border">
                    {(c.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  {c.email}
                </td>
                <td className="p-4">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold uppercase ${
                    c.role === 'admin' ? 'bg-[var(--cardeal-primary)]/20 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/40' :
                    c.role === 'partner' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    {c.role || 'client'}
                  </span>
                </td>
                <td className="p-4 text-xs text-muted-foreground">{new Date(c.created_at || Date.now()).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
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
