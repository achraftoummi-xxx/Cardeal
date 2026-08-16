"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Car,
  CircleDot,
  Cog,
  Disc,
  Droplets,
  FileCheck,
  Filter,
  Gauge,
  Heart,
  Lightbulb,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Snowflake,
  Wallet,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import {
  DASHBOARD_APPOINTMENTS,
  DASHBOARD_HISTORY,
  DASHBOARD_MESSAGES,
  DASHBOARD_QUOTES,
  DASHBOARD_REMINDERS,
  computeVehicleHealth,
  formatMileageKm,
  getDashboardVehicle,
  getUserName,
  loadUserVehicles,
  POPULAR_PARTS,
  quoteCounts,
  seedUserVehicle,
  type ReminderType,
  type UserVehicle,
} from "@/data/dashboard";
import { getVehicleImage } from "@/data/vehicleImages";
import { fetchPartners, type Partner } from "@/lib/partners";
import { cn } from "@/lib/utils";

const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] w-full animate-pulse rounded-2xl border border-border bg-card/50 sm:h-[380px]" />
  ),
});

type MapFilter = "all" | "garages" | "partsShops" | "bodyShops";

const MAP_FILTERS: { key: MapFilter; labelKey: string; match: (type: string | null) => boolean }[] = [
  { key: "all", labelKey: "dashboard.map.all", match: () => true },
  { key: "garages", labelKey: "dashboard.map.garages", match: (t) => /garage|atelier|mecanicien/i.test(t ?? "") },
  { key: "partsShops", labelKey: "dashboard.map.partsShops", match: (t) => /magasin|piece|distribution|accessoire/i.test(t ?? "") },
  { key: "bodyShops", labelKey: "dashboard.map.bodyShops", match: (t) => /carrosserie/i.test(t ?? "") },
];

const PART_CATEGORIES: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Disc, label: "Freinage", href: "/dashboard/pieces" },
  { icon: Cog, label: "Moteur", href: "/dashboard/pieces" },
  { icon: Lightbulb, label: "Éclairage", href: "/dashboard/pieces" },
  { icon: Car, label: "Carrosserie", href: "/dashboard/pieces" },
  { icon: CircleDot, label: "Pneus", href: "/dashboard/pieces" },
  { icon: Zap, label: "Électrique", href: "/dashboard/pieces" },
  { icon: Snowflake, label: "Climatisation", href: "/dashboard/pieces" },
  { icon: Filter, label: "Filtres", href: "/dashboard/pieces" },
];

const REMINDER_ICONS: Record<ReminderType, LucideIcon> = {
  oil: Droplets,
  inspection: ShieldCheck,
  insurance: FileCheck,
};

const REMINDER_COLORS: Record<ReminderType, string> = {
  oil: "text-blue-500 bg-blue-500/10 ring-blue-500/20",
  inspection: "text-amber-500 bg-amber-500/10 ring-amber-500/20",
  insurance: "text-green-500 bg-green-500/10 ring-green-500/20",
};

function HealthScoreRing({ score }: { score: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-foreground">{score}</span>
        <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground">/100</span>
      </div>
    </div>
  );
}

export default function DashboardHomePage() {
  const { t } = useTranslation();
  const { location } = useDashboard();
  const [vehicle] = useState<UserVehicle>(() => {
    const stored = loadUserVehicles();
    if (stored && stored.length > 0) return stored[0];
    return seedUserVehicle(getDashboardVehicle());
  });
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [mapFilter, setMapFilter] = useState<MapFilter>("all");

  const { healthScore, maintenanceUptoDate } = useMemo(
    () => computeVehicleHealth(DASHBOARD_REMINDERS, DASHBOARD_QUOTES, DASHBOARD_HISTORY),
    []
  );
  const vehicleSpecs = [
    vehicle.year,
    vehicle.fuel,
    vehicle.capacity,
    vehicle.cylinders ? `${vehicle.cylinders} cyl.` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const counts = quoteCounts(DASHBOARD_QUOTES);
  const userName = getUserName();
  const unreadMessages = DASHBOARD_MESSAGES.filter((m) => m.unread).length;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchPartners();
        if (!cancelled) setPartners(data);
      } catch (err) {
        console.error("Dashboard services fetch error:", err);
        if (!cancelled) setPartners([]);
      } finally {
        if (!cancelled) setLoadingServices(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePartners = useCallback(
    (filter: MapFilter) =>
      partners.filter((p) => MAP_FILTERS.find((f) => f.key === filter)?.match(p.establishment_type) ?? true),
    [partners]
  );

  const mapPartners = visiblePartners(mapFilter);

  return (
    <div className="space-y-6">
      {/* ---------------- Greeting banner ---------------- */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C] p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12)_0%,transparent_55%)]" />
        <div className="relative">
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("dashboard.greeting.hello", { name: userName })}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-blue-50/90 sm:text-base">
            {t("dashboard.greeting.subtitle")}
          </p>
        </div>
      </section>

      {/* ---------------- Quick actions ---------------- */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/recherche"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--cardeal-primary)]/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20 transition-transform group-hover:scale-105">
            <FileCheck size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-foreground">{t("dashboard.greeting.requestQuote")}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{t("dashboard.greeting.requestQuoteDesc")}</span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--cardeal-primary)]" />
        </Link>
        <Link
          href="/dashboard/pieces"
          className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:shadow-md"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 transition-transform group-hover:scale-105">
            <Search size={22} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold text-foreground">{t("dashboard.greeting.findPart")}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{t("dashboard.greeting.findPartDesc")}</span>
          </span>
          <ArrowRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
        </Link>
      </section>

      {/* ---------------- Vehicle / Quotes / Appointments ---------------- */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* Vehicle profile & health */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Car size={15} />
              {t("dashboard.vehicle.title")}
            </h2>
            <Link href="/dashboard/vehicules" className="text-xs font-medium text-[var(--cardeal-primary)] hover:underline">
              {t("dashboard.vehicle.viewDetails")}
            </Link>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40 p-2">
              <img
                src={getVehicleImage(vehicle.brand, vehicle.model, vehicle.year, vehicle.color).src}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-foreground">
                {vehicle.brand || "—"} {vehicle.model}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {vehicleSpecs || "—"}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Gauge size={12} className="text-blue-500" />
                {t("dashboard.vehicle.mileage")}: {formatMileageKm(vehicle.mileageKm)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 p-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {t("dashboard.vehicle.healthScore")}
              </p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                  maintenanceUptoDate
                    ? "bg-green-500/10 text-green-500 ring-green-500/20"
                    : "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                )}
              >
                <ShieldCheck size={11} />
                {t(maintenanceUptoDate ? "dashboard.vehicle.uptoDate" : "dashboard.vehicle.recommended")}
              </span>
            </div>
            <HealthScoreRing score={healthScore} />
          </div>
        </div>

        {/* Active quotes */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("dashboard.quotes.title")}
            </h2>
            <Link href="/dashboard/devis" className="text-xs font-medium text-[var(--cardeal-primary)] hover:underline">
              {t("dashboard.quotes.viewAll")}
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: t("dashboard.quotes.pending"), value: counts.pending, cls: "text-amber-500 bg-amber-500/10 ring-amber-500/20" },
              { label: t("dashboard.quotes.accepted"), value: counts.accepted, cls: "text-blue-500 bg-blue-500/10 ring-blue-500/20" },
              { label: t("dashboard.quotes.completed"), value: counts.completed, cls: "text-green-500 bg-green-500/10 ring-green-500/20" },
            ].map((c) => (
              <div key={c.label} className="rounded-xl bg-muted/40 p-3 text-center">
                <p className={cn("mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ring-1", c.cls)}>
                  {c.value}
                </p>
                <p className="mt-1.5 truncate text-[11px] font-medium text-muted-foreground">{c.label}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {DASHBOARD_QUOTES.filter((q) => q.status === "pending")
              .slice(0, 2)
              .map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-2 rounded-xl border border-border/70 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{q.service}</p>
                    <p className="truncate text-xs text-muted-foreground">{q.partner}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">{q.amount} DT</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Appointments + reminders */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("dashboard.appointments.title")}
            </h2>
            <Link href="/dashboard/rendez-vous" className="text-xs font-medium text-[var(--cardeal-primary)] hover:underline">
              {t("dashboard.appointments.viewAll")}
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {DASHBOARD_APPOINTMENTS.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                  <Wrench size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{a.service}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.partner}</p>
                </div>
                <span className="shrink-0 text-right text-[11px] font-medium text-muted-foreground">
                  {a.date.slice(8)}/{a.date.slice(5, 7)}
                  <br />
                  {a.time}
                </span>
              </li>
            ))}
          </ul>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dashboard.reminders.title")}
          </h3>
          <ul className="mt-3 space-y-2">
            {DASHBOARD_REMINDERS.map((r) => {
              const Icon = REMINDER_ICONS[r.type];
              const dueLabel =
                r.dueInDays === 0
                  ? t("dashboard.reminders.dueToday")
                  : r.dueInDays < 0
                    ? t("dashboard.reminders.overdue", { count: Math.abs(r.dueInDays) })
                    : t("dashboard.reminders.dueIn", { count: r.dueInDays });
              return (
                <li key={r.id} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1", REMINDER_COLORS[r.type])}>
                    <Icon size={15} />
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {t(`dashboard.reminders.${r.type}`)}
                  </p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                      r.dueInDays <= 7
                        ? "bg-red-500/10 text-red-500 ring-red-500/20"
                        : r.dueInDays <= 30
                          ? "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                          : "bg-green-500/10 text-green-500 ring-green-500/20"
                    )}
                  >
                    {dueLabel}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Parts search + support ---------------- */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-bold text-foreground">{t("dashboard.parts.title")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("dashboard.parts.subtitle")}</p>

          <Link
            href="/dashboard/pieces"
            className="mt-4 flex min-h-12 items-center gap-3 rounded-xl border border-border bg-muted/40 px-4 text-sm text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-foreground"
          >
            <Search size={16} className="shrink-0 text-blue-500" />
            <span className="flex-1">{t("dashboard.parts.search")}</span>
            <ArrowRight size={15} className="shrink-0" />
          </Link>

          <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
            {PART_CATEGORIES.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-1.5 rounded-xl border border-border/70 px-2 py-3 text-center transition-all hover:border-blue-500/40 hover:bg-blue-500/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-500">
                  <Icon size={16} />
                </span>
                <span className="w-full truncate text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {t("dashboard.parts.popular")}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_PARTS.map((part) => (
              <Link
                key={part}
                href="/dashboard/pieces"
                className="rounded-full border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-500/40 hover:text-blue-500"
              >
                {part}
              </Link>
            ))}
          </div>
        </div>

        {/* Support card */}
        <div className="flex flex-col rounded-2xl border border-border bg-gradient-to-b from-card to-muted/30 p-5 shadow-sm">
          <h2 className="text-base font-bold text-foreground">{t("dashboard.support.title")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("dashboard.support.subtitle")}</p>
          <div className="mt-4 flex flex-1 flex-col gap-2">
            <a
              href="tel:+21671234567"
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Phone size={15} className="text-[var(--cardeal-primary)]" />
              {t("dashboard.support.call")}
            </a>
            <a
              href="mailto:support@cardeal.tn"
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <MessageCircle size={15} className="text-blue-500" />
              {t("dashboard.support.email")}
            </a>
            <a
              href="/dashboard/conseils"
              className="flex min-h-11 items-center gap-2.5 rounded-xl border border-border px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Search size={15} className="text-amber-500" />
              {t("dashboard.support.faq")}
            </a>
            <Link
              href="/dashboard/messages"
              className="flex min-h-11 items-center gap-2.5 rounded-xl bg-[var(--cardeal-primary)] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#9E1F23]"
            >
              <Heart size={15} />
              {t("dashboard.support.chat")}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Map widget ---------------- */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground">{t("dashboard.map.title")}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t("dashboard.map.subtitle")} · {location.label}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MAP_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setMapFilter(f.key)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  mapFilter === f.key
                    ? "bg-[var(--cardeal-primary)] text-white"
                    : "border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {loadingServices ? (
            <div className="h-[320px] w-full animate-pulse rounded-2xl border border-border bg-card/50 sm:h-[380px]" />
          ) : (
            <PartnerMap
              location={location}
              partners={mapPartners}
              revalidateKey={`${mapFilter}-${mapPartners.length}`}
            />
          )}
        </div>
      </section>

      {/* ---------------- Messages + history ---------------- */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <MessageCircle size={15} />
              {t("dashboard.messages.title")}
              {unreadMessages > 0 && (
                <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadMessages}</span>
              )}
            </h2>
            <Link href="/dashboard/messages" className="text-xs font-medium text-[var(--cardeal-primary)] hover:underline">
              {t("dashboard.messages.viewAll")}
            </Link>
          </div>
          <ul className="mt-4 space-y-2">
            {DASHBOARD_MESSAGES.map((m) => (
              <li key={m.id}>
                <Link
                  href="/dashboard/messages"
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                    m.unread ? "border-blue-500/30 bg-blue-500/5" : "border-border/70 hover:bg-accent"
                  )}
                >
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {m.from.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-foreground">{m.from}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{m.snippet}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Wallet size={15} />
              {t("dashboard.history.title")}
            </h2>
            <Link href="/dashboard/historique" className="text-xs font-medium text-[var(--cardeal-primary)] hover:underline">
              {t("dashboard.history.viewAll")}
            </Link>
          </div>
          <ol className="mt-4 space-y-0">
            {DASHBOARD_HISTORY.map((h, i) => (
              <li key={h.id} className="relative flex gap-3 pb-4 last:pb-0">
                {i < DASHBOARD_HISTORY.length - 1 && (
                  <span className="absolute left-[7px] top-5 bottom-0 w-px bg-border" aria-hidden />
                )}
                <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-[var(--cardeal-primary)] bg-background" aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{h.service}</p>
                    <span className="shrink-0 text-sm font-bold text-foreground">{h.amount} DT</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {h.partner} · {h.date}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}