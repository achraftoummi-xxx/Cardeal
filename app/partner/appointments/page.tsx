"use client";

import React, { useEffect, useState } from "react";
import { CalendarDays, Clock, Phone, User, CheckCircle2, XCircle, Loader2, FileText, Search } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import type { AppointmentRecord } from "@/lib/partnerTypes";

export default function PartnerAppointmentsPage() {
  const { partnerId } = usePartnerAuth();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    const pId = partnerId || "mock-partner-uuid";
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("partner_id", pId)
          .order("appointment_date", { ascending: false });
        if (data) setAppointments(data as AppointmentRecord[]);
      } else {
        setAppointments([
          {
            id: "1",
            partner_id: pId,
            full_name: "Karim Ben Salah",
            phone: "98123456",
            appointment_date: "2026-03-25",
            appointment_time: "10:00",
            notes: "Vidange complète + filtres",
            status: "pending",
            created_at: new Date().toISOString()
          },
          {
            id: "2",
            partner_id: pId,
            full_name: "Sami Trabelsi",
            phone: "55888999",
            appointment_date: "2026-03-26",
            appointment_time: "14:30",
            notes: "Remplacement plaquettes freins",
            status: "confirmed",
            created_at: new Date().toISOString()
          }
        ]);
      }
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointments();
  }, [partnerId]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("appointments").update({ status: newStatus }).eq("id", id);
      }
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error("Error updating appointment status:", err);
    }
  };

  const filtered = appointments.filter(a =>
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Gestion des Rendez-vous</h1>
          <p className="text-sm text-muted-foreground">Consultez et gérez les réservations d'atelier de vos clients</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par client ou téléphone..."
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
          <CalendarDays size={40} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-base font-bold text-foreground">Aucun rendez-vous trouvé</h2>
          <p className="text-sm text-muted-foreground mt-1">Les réservations en ligne apparaîtront ici en temps réel.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Client</th>
                  <th className="p-4">Téléphone</th>
                  <th className="p-4">Date & Heure</th>
                  <th className="p-4">Notes / Prestation</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/30 transition">
                    <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-[var(--cardeal-primary)]/15 text-[var(--cardeal-primary)] flex items-center justify-center font-bold text-xs">
                        {apt.full_name?.substring(0, 2).toUpperCase()}
                      </div>
                      {apt.full_name}
                    </td>
                    <td className="p-4 text-muted-foreground">{apt.phone}</td>
                    <td className="p-4 text-foreground font-medium">
                      {apt.appointment_date} à {apt.appointment_time}
                    </td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">{apt.notes || "—"}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        apt.status === 'confirmed' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' :
                        apt.status === 'cancelled' ? 'bg-red-500/15 text-red-600 dark:text-red-400' :
                        'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      }`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {apt.status !== 'confirmed' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 text-xs font-semibold transition"
                        >
                          Confirmer
                        </button>
                      )}
                      {apt.status !== 'cancelled' && (
                        <button
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-600 hover:bg-red-500/25 text-xs font-semibold transition"
                        >
                          Annuler
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
