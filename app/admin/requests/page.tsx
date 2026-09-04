"use client";

import React, { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Building2, MapPin } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setRequests([
        { id: '1', company_name: 'Garage Al-Amine', email: 'amine@garage.tn', category: 'Mécanique générale', address: 'Tunis', status: 'pending', created_at: new Date().toISOString() },
        { id: '2', company_name: 'Electro-Auto Tunis', email: 'contact@electroauto.tn', category: 'Électricité & Diagnostic', address: 'Ariana', status: 'pending', created_at: new Date().toISOString() }
      ]);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('partner_requests').select('*').order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  async function handleAction(id: string, email: string, category: string, action: 'accepted' | 'denied') {
    if (!isSupabaseConfigured || !supabase) {
      setRequests(requests.map((r) => r.id === id ? { ...r, status: action } : r));
      return;
    }
    await supabase.from('partner_requests').update({ status: action }).eq('id', id);
    if (action === 'accepted') {
      await supabase.from('profiles').update({ role: 'partner', category }).eq('email', email);
    }
    fetchRequests();
  }

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
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight font-['Space_Grotesk']">Demandes de Partenariat Garages</h2>
        <p className="mt-1 text-sm text-muted-foreground font-['Manrope']">Examinez et validez les candidatures des ateliers souhaitant rejoindre le réseau CarDeal.</p>
      </div>

      {requests.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card/60 p-12 text-center text-sm text-muted-foreground">
          Aucune demande de partenariat disponible pour le moment.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="rounded-2xl border border-border bg-card/60 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Building2 size={18} className="text-[var(--cardeal-primary)] shrink-0" />
                  <h3 className="text-base font-bold text-foreground font-['Space_Grotesk']">{req.company_name}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{req.email} • <span className="text-[var(--cardeal-primary)] font-semibold">{req.category}</span></p>
                {req.address && (
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={12} /> {req.address}
                  </p>
                )}
                <span className="text-[10px] text-muted-foreground block">Soumis le {new Date(req.created_at || Date.now()).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {req.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleAction(req.id, req.email, req.category, 'accepted')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/50 px-4 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30 transition"
                    >
                      <CheckCircle2 size={16} /> Accepter
                    </button>
                    <button
                      onClick={() => handleAction(req.id, req.email, req.category, 'denied')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 rounded-xl bg-secondary border border-border px-4 py-2.5 text-xs font-bold text-[var(--cardeal-primary)] hover:bg-accent transition"
                    >
                      <XCircle size={16} /> Refuser
                    </button>
                  </>
                ) : (
                  <span className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase ${
                    req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] border border-[var(--cardeal-primary)]/30'
                  }`}>
                    {req.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
