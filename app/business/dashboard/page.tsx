"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Hammer,
  MessageSquare,
  FileText,
  CalendarClock,
  Package,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { FEATURES, type FeatureDefinition } from "@/lib/business/features";

export default function BusinessDashboardPage() {
  const { partner, resolved, verticals } = useBusiness();
  const [stats, setStats] = useState({
    jobsCount: 0,
    messagesCount: 0,
    quotesCount: 0,
    teamCount: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isSupabaseConfigured || !supabase || !partner?.id) {
        setStats({ jobsCount: 18, messagesCount: 5, quotesCount: 12, teamCount: 4 });
        setLoadingData(false);
        return;
      }

      const pId = partner.id;
      try {
        const [jobsRes, msgRes, quoteRes, staffRes] = await Promise.all([
          supabase.from("appointments").select("id", { count: "exact", head: true }).eq("partner_id", pId),
          supabase.from("quotations").select("id", { count: "exact", head: true }).eq("partner_id", pId),
          supabase.from("quotations").select("id", { count: "exact", head: true }).eq("partner_id", pId).eq("status", "pending"),
          supabase.from("partner_staff").select("id", { count: "exact", head: true }).eq("partner_id", pId),
        ]);

        setStats({
          jobsCount: jobsRes.count ?? 0,
          messagesCount: msgRes.count ?? 0,
          quotesCount: quoteRes.count ?? 0,
          teamCount: staffRes.count ?? 0,
        });
      } catch (err) {
        console.error("Business dashboard load error:", err);
      } finally {
        setLoadingData(false);
      }
    };

    void load();
  }, [partner?.id]);

  const enabledFeatures = Object.values(FEATURES).filter(
    (f) => resolved.features[f.id]?.enabled && !f.mandatory
  );

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 font-bold text-xl">
              {partner?.name?.substring(0, 2).toUpperCase() || "BP"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">
                  {partner?.name}
                </h1>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Verified Partner
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {partner?.establishment_type || "Business Account"}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {verticals.map((v) => (
                  <span
                    key={v}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground border border-border"
                  >
                    {v.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/business/settings/features"
            className="inline-flex items-center justify-center rounded-[--radius] bg-secondary px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
          >
            <Settings size={14} className="mr-1.5" />
            Manage Features
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      {loadingData ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--cardeal-primary)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Jobs
              </p>
              <span className="rounded-xl bg-blue-500/15 p-2 text-blue-600 dark:text-blue-400">
                <Hammer size={20} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">
              {stats.jobsCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Current bookings</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Messages
              </p>
              <span className="rounded-xl bg-emerald-500/15 p-2 text-emerald-600 dark:text-emerald-400">
                <MessageSquare size={20} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">
              {stats.messagesCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Unread conversations</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Quotes
              </p>
              <span className="rounded-xl bg-amber-500/15 p-2 text-amber-600 dark:text-amber-400">
                <FileText size={20} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">
              {stats.quotesCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting response</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Team Members
              </p>
              <span className="rounded-xl bg-purple-500/15 p-2 text-purple-600 dark:text-purple-400">
                <Users size={20} />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">
              {stats.teamCount}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active staff</p>
          </div>
        </div>
      )}

      {/* Quick Access: Enabled Features */}
      {enabledFeatures.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {enabledFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <Link
                  key={f.id}
                  href={`/business/${f.route}`}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-secondary/50 p-4 text-center transition-colors hover:bg-accent/50 hover:border-emerald-500/30"
                >
                  <Icon size={22} className="text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    {f.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Feature Status */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold font-['Space_Grotesk'] text-foreground">
            Feature Status
          </h2>
          <Link
            href="/business/settings/features"
            className="text-xs font-semibold text-emerald-500 hover:underline"
          >
            Configure →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(resolved.features).map(([id, state]) => {
            const def = FEATURES[id];
            if (!def) return null;
            const Icon = def.icon;
            return (
              <div
                key={id}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                  state.enabled
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-secondary/30 opacity-60"
                }`}
              >
                <Icon
                  size={16}
                  className={state.enabled ? "text-emerald-500" : "text-muted-foreground"}
                />
                <span className="flex-1 font-medium text-foreground">
                  {id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    state.enabled
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {state.enabled ? "ON" : "OFF"}
                </span>
                {state.mandatory && (
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    Required
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
