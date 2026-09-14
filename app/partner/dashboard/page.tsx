"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Wrench,
  Package,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Building2,
  Loader2
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import type { Partner } from "@/lib/partners";

export default function PartnerDashboardPage() {
  const { loading: authLoading, partnerId, profile } = usePartnerAuth();
  const [loadingData, setLoadingData] = useState(true);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [stats, setStats] = useState({
    appointmentsCount: 0,
    quotationsCount: 0,
    inventoryCount: 0,
    staffCount: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [recentQuotations, setRecentQuotations] = useState<any[]>([]);

  useEffect(() => {
    if (authLoading) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        const pId = partnerId || "mock-partner-uuid";

        if (isSupabaseConfigured && supabase) {
          // Fetch partner info
          const { data: pData } = await supabase
            .from("partners")
            .select("*")
            .eq("id", pId)
            .maybeSingle();

          if (pData) setPartner(pData as Partner);

          // Fetch counts
          const [aptRes, quoteRes, invRes, staffRes] = await Promise.all([
            supabase.from("appointments").select("id", { count: "exact", head: true }).eq("partner_id", pId),
            supabase.from("quotations").select("id", { count: "exact", head: true }).eq("partner_id", pId),
            supabase.from("inventory_parts").select("id", { count: "exact", head: true }).eq("partner_id", pId),
            supabase.from("partner_staff").select("id", { count: "exact", head: true }).eq("partner_id", pId),
          ]);

          setStats({
            appointmentsCount: aptRes.count ?? 0,
            quotationsCount: quoteRes.count ?? 0,
            inventoryCount: invRes.count ?? 0,
            staffCount: staffRes.count ?? 0,
          });

          // Fetch recent items
          const [recentApt, recentQ] = await Promise.all([
            supabase.from("appointments").select("*").eq("partner_id", pId).order("created_at", { ascending: false }).limit(5),
            supabase.from("quotations").select("*").eq("partner_id", pId).order("created_at", { ascending: false }).limit(5),
          ]);

          if (recentApt.data) setRecentAppointments(recentApt.data);
          if (recentQ.data) setRecentQuotations(recentQ.data);
        } else {
          // Mock data
          setPartner({
            id: pId,
            name: "El japouni auto service",
            city: "Tunis",
            zip_code: "1002",
            address: "Tunis, 37 Rue du Liban",
            phone: "24505823",
            email: profile?.email || "partner@cardeal.tn",
            establishment_type: "Atelier de mécanique automobile",
            website: null,
            google_map_coords: "36.81283333, 10.17763889",
            latitude: 36.81283333,
            longitude: 10.17763889,
            facebook_url: null,
            instagram_url: null,
            google_rating: 4.9,
            review_count: 64,
            opening_hours: "Ouvert 24/24",
            services_offered: "Vidange",
            additional_info: null,
            garage_capacity: 5
          });
          setStats({ appointmentsCount: 12, quotationsCount: 24, inventoryCount: 45, staffCount: 4 });
          setRecentAppointments([
            { id: "1", full_name: "Karim Ben Salah", phone: "98123456", appointment_date: "2026-03-25", appointment_time: "10:00", status: "pending" },
            { id: "2", full_name: "Sami Trabelsi", phone: "55888999", appointment_date: "2026-03-26", appointment_time: "14:30", status: "confirmed" },
          ]);
          setRecentQuotations([
            { id: "1", full_name: "Mehdi Riahi", phone: "22333444", notes: "Demande de devis embrayage Golf 7", status: "pending" },
          ]);
        }
      } catch (err) {
        console.error("Error loading partner dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    void loadData();
  }, [authLoading, partnerId, profile]);

  if (authLoading || loadingData) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--cardeal-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome & Partner Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--cardeal-primary)]/15 text-[var(--cardeal-primary)] font-bold text-xl">
              {partner?.name?.substring(0, 2).toUpperCase() || "GA"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">{partner?.name}</h1>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Partenaire Approuvé
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{partner?.establishment_type || "Garage & Atelier Automobile"}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                {partner?.city && (
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {partner.city}</span>
                )}
                {partner?.phone && (
                  <span className="flex items-center gap-1.5"><Phone size={14} /> {partner.phone}</span>
                )}
                {partner?.email && (
                  <span className="flex items-center gap-1.5"><Mail size={14} /> {partner.email}</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/partner/settings"
              className="inline-flex items-center justify-center rounded-[--radius] bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
            >
              Gérer les Services & Horaires
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rendez-vous</p>
            <span className="rounded-xl bg-blue-500/15 p-2 text-blue-600 dark:text-blue-400"><CalendarDays size={20} /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{stats.appointmentsCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Réservations clients actives</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quotations / Devis</p>
            <span className="rounded-xl bg-amber-500/15 p-2 text-amber-600 dark:text-amber-400"><Wrench size={20} /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{stats.quotationsCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Demandes de devis reçues</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pièces en Stock</p>
            <span className="rounded-xl bg-purple-500/15 p-2 text-purple-600 dark:text-purple-400"><Package size={20} /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{stats.inventoryCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Références inventoriées</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Équipe & Mécaniciens</p>
            <span className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-400"><Users size={20} /></span>
          </div>
          <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{stats.staffCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Personnel actif rattaché</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Appointments */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground">Rendez-vous Récents</h2>
            <Link href="/partner/appointments" className="text-xs font-semibold text-[var(--cardeal-primary)] hover:underline">
              Voir tout →
            </Link>
          </div>
          {recentAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucun rendez-vous récent.</p>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/60">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{apt.full_name}</p>
                    <p className="text-xs text-muted-foreground">Tél: {apt.phone} • {apt.appointment_date} à {apt.appointment_time}</p>
                  </div>
                  <span className="rounded-full bg-[var(--cardeal-primary)]/15 px-2.5 py-1 text-[11px] font-semibold text-[var(--cardeal-primary)]">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Quotations */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground">Demandes de Devis (Quotations)</h2>
            <Link href="/partner/quotations" className="text-xs font-semibold text-[var(--cardeal-primary)] hover:underline">
              Voir tout →
            </Link>
          </div>
          {recentQuotations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Aucune demande de devis récente.</p>
          ) : (
            <div className="space-y-3">
              {recentQuotations.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/60">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{q.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[220px]">{q.notes || "Demande générale de devis"}</p>
                  </div>
                  <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
