"use client";

import React, { useEffect, useState } from "react";
import { Wrench, Search, Phone, Mail, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import type { QuotationRecord } from "@/lib/partnerTypes";

export default function PartnerQuotationsPage() {
  const { partnerId } = usePartnerAuth();
  const [quotations, setQuotations] = useState<QuotationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadQuotations = async () => {
    setLoading(true);
    const pId = partnerId || "mock-partner-uuid";
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("quotations")
          .select("*")
          .eq("partner_id", pId)
          .order("created_at", { ascending: false });
        if (data) setQuotations(data as QuotationRecord[]);
      } else {
        setQuotations([
          {
            id: "1",
            partner_id: pId,
            full_name: "Mehdi Riahi",
            phone: "22333444",
            notes: "Demande de devis embrayage Golf 7",
            status: "pending",
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Error loading quotations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadQuotations();
  }, [partnerId]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("quotations").update({ status: newStatus }).eq("id", id);
      }
      setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    } catch (err) {
      console.error("Error updating quotation status:", err);
    }
  };

  const filtered = quotations.filter(q =>
    q.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Gestion des Devis (Quotations)</h1>
          <p className="text-sm text-muted-foreground">Traitez et répondez aux demandes de devis de vos clients et visiteurs</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2 text-sm text-foreground outline-none focus:border-[var(--cardeal-primary)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--cardeal-primary)]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Wrench size={40} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-bold text-foreground">Aucune demande de devis</h2>
          <p className="text-sm text-muted-foreground mt-1">Les requêtes de quotations envoyées depuis la carte ou le profil s'afficheront ici.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Client</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Détails de la demande</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-muted/30 transition">
                    <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[var(--cardeal-primary)]/15 text-[var(--cardeal-primary)] flex items-center justify-center font-bold text-xs">
                        {q.full_name?.substring(0, 2).toUpperCase()}
                      </div>
                      {q.full_name}
                    </td>
                    <td className="p-4 text-muted-foreground">{q.phone}</td>
                    <td className="p-4 text-foreground">{q.notes || "Demande générale de devis"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        q.status === 'replied' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                        'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {q.status !== 'replied' && (
                        <button
                          onClick={() => updateStatus(q.id, 'replied')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 text-xs font-semibold transition"
                        >
                          Marquer Traité
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
