"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Car,
  Clock,
  Download,
  FileText,
  FolderOpen,
  Gauge,
  Heart,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import SearchAndMapSection from "@/components/SearchAndMapSection";
import DealerCard from "@/components/DealerCard";
import BrandSelect from "@/components/BrandSelect";
import CarBrandLogo from "@/components/CarBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "@/components/TranslationProvider";
import { useAuth } from "@/components/AuthProvider";
import { navLabel, type NavKey } from "@/components/dashboard/DashboardSidebar";
import { fetchDealers, type Dealer } from "@/lib/dealers";
import { getManufacturerLogo } from "@/data/manufacturerLogos";
import { MANUFACTURER_CATALOG } from "@/data/manufacturerCatalog";
import { getTireBrandLogo } from "@/data/tireBrandLogos";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { setAuthenticated } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  DASHBOARD_APPOINTMENTS,
  DASHBOARD_DOCUMENTS,
  DASHBOARD_EXPENSES,
  DASHBOARD_FAVORITES,
  DASHBOARD_HISTORY,
  DASHBOARD_MESSAGES,
  DASHBOARD_QUOTES,
  getDashboardVehicle,
  getUserName,
} from "@/data/dashboard";

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

export function SectionHeader({ navKey }: { navKey: NavKey }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
        {navLabel(t, navKey)}
      </h1>
    </div>
  );
}

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

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 ring-amber-500/20",
  accepted: "bg-blue-500/10 text-blue-500 ring-blue-500/20",
  completed: "bg-green-500/10 text-green-500 ring-green-500/20",
};

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Garage finder — the full advanced search module                     */
/* ------------------------------------------------------------------ */

export function GarageSearchView() {
  return (
    <div className="space-y-4">
      <SectionHeader navKey="search" />
      <SearchAndMapSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parts search                                                        */
/* ------------------------------------------------------------------ */

type PartItem = { brand: string; model: string; category: string; price: string; dealer: string };

export function PartsView() {
  const { t } = useTranslation();
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loadingDealers, setLoadingDealers] = useState(true);
  const [dealersError, setDealersError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDealers()
      .then((rows) => {
        if (!cancelled) setDealers(rows);
      })
      .catch(() => {
        if (!cancelled) setDealersError(true);
      })
      .finally(() => {
        if (!cancelled) setLoadingDealers(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const parts = t("parts.items") as unknown as PartItem[];
  const categories = useMemo(() => [...new Set(parts.map((p) => p.category))], [parts]);
  const brandGroups = useMemo(
    () =>
      MANUFACTURER_CATALOG.filter((region) => region.countries.some((c) => c.brands.length > 0))
        .map((region) => ({
          label: t(`parts.regions.${region.id}`),
          countries: region.countries
            .filter((c) => c.brands.length > 0)
            .map((c) => ({ name: c.name, flag: c.flag, brands: [...c.brands] })),
        })),
    [t]
  );
  const filtered = useMemo(
    () =>
      parts.filter(
        (p) => (!category || p.category === category) && (!brand || p.brand === brand)
      ),
    [parts, category, brand]
  );

  return (
    <div className="space-y-4">
      <SectionHeader navKey="parts" />

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <Select
            label={t("parts.category")}
            value={category}
            onChange={setCategory}
            options={["", ...categories]}
            placeholder={t("parts.all")}
          />
          <BrandSelect
            label={t("parts.brand")}
            value={brand}
            onChange={setBrand}
            groups={brandGroups}
            placeholder={t("parts.all")}
            renderBrand={(b) => (
              <span className="flex min-w-0 items-center gap-2">
                <span className="flex h-6 w-16 shrink-0 items-center justify-center">
                  <img
                    src={getManufacturerLogo(b).src}
                    alt={b}
                    draggable={false}
                    className="h-5 w-auto max-w-[60px] object-contain"
                  />
                </span>
                <span className="truncate">{b}</span>
              </span>
            )}
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((part, i) => (
            <div
              key={`${part.brand}-${part.model}-${i}`}
              className="flex flex-col rounded-xl border border-border/70 bg-muted/20 p-4 transition-colors hover:border-muted-foreground/30"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {part.brand} {part.model}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{part.category}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--cardeal-primary)]/10 px-2.5 py-1 text-xs font-bold text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                  {part.price}
                </span>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wrench size={12} className="shrink-0 text-blue-500" />
                <span className="truncate">{part.dealer}</span>
              </p>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-6 text-center text-sm text-muted-foreground">{t("results.noPartners")}</p>
        )}
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
          <MapPin size={16} className="text-[var(--cardeal-primary)]" />
          {t("dealers.title")}
        </h2>
        {loadingDealers ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl border border-border bg-card/50" />
            ))}
          </div>
        ) : dealersError ? (
          <p className="mt-4 text-sm text-muted-foreground">{t("dealers.error")}</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dealers.map((dealer) => (
              <DealerCard key={dealer.id} dealer={dealer} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tires                                                               */
/* ------------------------------------------------------------------ */

type TireOffer = { brand: string; model: string; size: string; season: string; price: string; dealer: string };

const TIRE_BRANDS = ["Bridgestone", "Continental", "Goodyear", "Hankook", "Michelin", "Pirelli"];

export function TiresView() {
  const { t } = useTranslation();
  const [brand, setBrand] = useState("");
  const tires = t("pneus.tires") as unknown as TireOffer[];
  const filtered = brand ? tires.filter((tire) => tire.brand === brand) : tires;

  return (
    <div className="space-y-4">
      <SectionHeader navKey="tires" />

      <Card className="py-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xs">
          <Select
            label={t("pneus.brand")}
            value={brand}
            onChange={setBrand}
            options={["", ...TIRE_BRANDS]}
            placeholder={t("pneus.all")}
          />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tire, i) => (
          <Card key={`${tire.brand}-${tire.model}-${i}`} className="flex flex-col">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {(() => {
                  const logo = getTireBrandLogo(tire.brand);
                  return logo ? (
                    <div className="flex h-11 items-center">
                      <img
                        src={logo.src}
                        alt={tire.brand}
                        title={tire.brand}
                        draggable={false}
                        className="h-9 w-auto max-w-[300px] object-contain"
                      />
                    </div>
                  ) : (
                    <h2 className="text-lg font-semibold text-foreground">{tire.brand}</h2>
                  );
                })()}
                <p className="mt-1 truncate text-sm text-muted-foreground">{tire.model}</p>
              </div>
              <span className="shrink-0 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/20">
                {tire.season}
              </span>
            </div>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("pneus.size")}</dt>
                <dd className="font-semibold text-foreground">{tire.size}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("pneus.dealer")}</dt>
                <dd className="text-right font-semibold text-foreground">{tire.dealer}</dd>
              </div>
            </dl>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-5">
              <p className="text-2xl font-extrabold tracking-tight text-foreground">{tire.price}</p>
              <Link
                href="/dashboard/recherche"
                className="rounded-lg bg-[var(--cardeal-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23]"
              >
                {t("pneus.cta")}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */

type Deal = { badge: string; title: string; desc: string; date: string };

export function DealsView() {
  const { t } = useTranslation();
  const deals = t("deals.deals") as unknown as Deal[];

  return (
    <div className="space-y-4">
      <SectionHeader navKey="deals" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal, i) => (
          <Card key={`${deal.title}-${i}`} className="group relative flex flex-col overflow-hidden">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#BA2529]/10 blur-2xl" aria-hidden />
            <span className="inline-flex w-fit items-center rounded-full bg-[var(--cardeal-primary)] px-3 py-1 text-sm font-extrabold text-white shadow-lg shadow-[#BA2529]/25">
              {deal.badge}
            </span>
            <h2 className="mt-5 text-lg font-semibold leading-snug text-foreground">{deal.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{deal.desc}</p>
            <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays size={14} />
                {t("deals.until", { date: deal.date })}
              </span>
              <Link
                href="/dashboard/recherche"
                className="rounded-lg bg-[var(--cardeal-primary)] px-4 py-2 text-sm font-bold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23]"
              >
                {t("deals.cta")}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Advice                                                              */
/* ------------------------------------------------------------------ */

type Article = { category: string; title: string; excerpt: string; readTime: string };

export function AdviceView() {
  const { t } = useTranslation();
  const articles = t("advice.articles") as unknown as Article[];

  return (
    <div className="space-y-4">
      <SectionHeader navKey="advice" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <Card key={`${article.title}-${i}`} className="flex flex-col">
            <span className="inline-flex w-fit items-center rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-500 ring-1 ring-blue-500/20">
              {article.category}
            </span>
            <h2 className="mt-4 text-base font-semibold leading-snug text-foreground">
              {article.title}
            </h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {article.excerpt}
            </p>
            <p className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-medium text-muted-foreground">
              <Clock size={13} />
              {article.readTime}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* My vehicles                                                         */
/* ------------------------------------------------------------------ */

export function VehiclesView() {
  const { t } = useTranslation();
  const [vehicle] = useState(getDashboardVehicle);

  return (
    <div className="space-y-4">
      <SectionHeader navKey="vehicles" />
      <Card>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40 p-3">
            <CarBrandLogo name={vehicle.brand} className="max-h-full w-auto max-w-full" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold text-foreground">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle.year} · {vehicle.engine}
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Gauge size={14} className="text-blue-500" />
              {t("dashboard.vehicle.mileage")}: {vehicle.mileageKm.toLocaleString("fr-FR")} km
            </p>
            <span
              className={cn(
                "mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                vehicle.maintenanceUptoDate
                  ? "bg-green-500/10 text-green-500 ring-green-500/20"
                  : "bg-amber-500/10 text-amber-500 ring-amber-500/20"
              )}
            >
              <ShieldCheck size={12} />
              {t(vehicle.maintenanceUptoDate ? "dashboard.vehicle.uptoDate" : "dashboard.vehicle.recommended")}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {t("dashboard.vehicle.healthScore")}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {t("dashboard.vehicle.title")}
              </p>
            </div>
            <HealthScoreRing score={vehicle.healthScore} />
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Quotes                                                              */
/* ------------------------------------------------------------------ */

export function QuotesView() {
  const { t } = useTranslation();
  const statusLabel = (s: string) => t(`dashboard.quotes.${s}`);

  return (
    <div className="space-y-4">
      <SectionHeader navKey="quotes" />
      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-border">
          {DASHBOARD_QUOTES.map((q) => (
            <li key={q.id} className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{q.service}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {q.partner} · {q.date}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-bold text-foreground">{q.amount} DT</span>
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-medium ring-1", STATUS_CLASSES[q.status])}>
                  {statusLabel(q.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments                                                        */
/* ------------------------------------------------------------------ */

export function AppointmentsView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <SectionHeader navKey="appointments" />
      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-border">
          {DASHBOARD_APPOINTMENTS.map((a) => (
            <li key={a.id} className="flex items-center gap-4 px-5 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                <Wrench size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{a.service}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{a.partner}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-foreground">{a.time}</p>
                <p className="text-xs text-muted-foreground">
                  {a.date.slice(8)}/{a.date.slice(5, 7)}/{a.date.slice(0, 4)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* History                                                             */
/* ------------------------------------------------------------------ */

export function HistoryView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <SectionHeader navKey="history" />
      <Card>
        <ol className="space-y-0">
          {DASHBOARD_HISTORY.map((h, i) => (
            <li key={h.id} className="relative flex gap-3 pb-5 last:pb-0">
              {i < DASHBOARD_HISTORY.length - 1 && (
                <span className="absolute bottom-0 left-[7px] top-5 w-px bg-border" aria-hidden />
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
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Messages                                                            */
/* ------------------------------------------------------------------ */

export function MessagesView() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState(DASHBOARD_MESSAGES);
  const unreadCount = messages.filter((m) => m.unread).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
          {navLabel(t, "messages")}
        </h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-border">
          {messages.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() =>
                  setMessages((prev) =>
                    prev.map((x) => (x.id === m.id ? { ...x, unread: false } : x))
                  )
                }
                className={cn(
                  "flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30",
                  m.unread && "bg-blue-500/5"
                )}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                  {m.from.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{m.from}</span>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{m.time}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{m.snippet}</span>
                </span>
                {m.unread && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden />
                )}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Favorites                                                           */
/* ------------------------------------------------------------------ */

export function FavoritesView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <SectionHeader navKey="favorites" />
      <div className="grid gap-4 md:grid-cols-2">
        {DASHBOARD_FAVORITES.map((f) => (
          <Card key={f.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-foreground">{f.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {f.type} · {f.location}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-500 ring-1 ring-amber-500/20">
                <Star size={12} fill="currentColor" />
                {f.rating.toFixed(1)}
              </span>
            </div>
            <p className="mt-3 rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">{f.note}</p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/dashboard/recherche"
                className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[var(--cardeal-primary)] px-3 text-xs font-medium text-white transition-colors hover:bg-[#9E1F23]"
              >
                <MapPin size={13} />
                {t("partnerCard.checkOnGoogleMaps")}
              </Link>
              <Link
                href="/dashboard/messages"
                className="flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
              >
                <MessageCircle size={13} />
                {t("dashboard.support.chat")}
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

const DOC_ICONS: Record<string, LucideIcon> = { PDF: FileText, Facture: Wallet, Autre: FolderOpen };

export function DocumentsView() {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <SectionHeader navKey="documents" />
      <Card className="overflow-hidden p-0">
        <ul className="divide-y divide-border">
          {DASHBOARD_DOCUMENTS.map((d) => {
            const Icon = DOC_ICONS[d.type] ?? FolderOpen;
            return (
              <li key={d.id} className="flex items-center gap-4 px-5 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{d.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {d.type} · {d.date} · {d.size}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label={d.title}
                >
                  <Download size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Expenses                                                            */
/* ------------------------------------------------------------------ */

export function ExpensesView() {
  const { t } = useTranslation();
  const total = DASHBOARD_EXPENSES.reduce((sum, e) => sum + e.amount, 0);
  const thisYear = DASHBOARD_EXPENSES.length;

  return (
    <div className="space-y-4">
      <SectionHeader navKey="expenses" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-[var(--cardeal-primary)] via-[#932024] to-[#4A0A0C] text-white">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-blue-100/80">
            <Wallet size={14} />
            {t("dashboard.expenses.title")}
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight">
            {total.toLocaleString("fr-FR")} DT
          </p>
          <p className="mt-1 text-xs text-blue-100/80">
            {thisYear} {t("dashboard.history.title").toLowerCase()}
          </p>
        </Card>
        <Card className="overflow-hidden p-0">
          <ul className="divide-y divide-border">
            {DASHBOARD_EXPENSES.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{e.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {e.category} · {e.date}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold text-foreground">−{e.amount} DT</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-[var(--cardeal-primary)]" : "bg-muted-foreground/30"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

export function SettingsView() {
  const { t } = useTranslation();
  const { email } = useAuth();
  const userName = getUserName();
  const [notifyMaintenance, setNotifyMaintenance] = useState(true);
  const [notifyQuotes, setNotifyQuotes] = useState(true);
  const [notifyPromos, setNotifyPromos] = useState(false);

  const handleLogout = () => {
    setAuthenticated(false);
    if (isSupabaseConfigured) void supabase!.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="space-y-4">
      <SectionHeader navKey="settings" />

      <Card>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--cardeal-primary)]/10 text-xl font-bold text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
            {userName.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">{userName}</p>
            <p className="truncate text-sm text-muted-foreground">{email || userName}</p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-sm font-medium text-foreground">{t("theme.selectorAria")}</span>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-sm font-medium text-foreground">{t("dashboard.settings.language")}</span>
            <LanguageSelector />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <Bell size={14} />
          {t("dashboard.header.notifications")}
        </h2>
        <div className="mt-2 divide-y divide-border">
          <Toggle checked={notifyMaintenance} onChange={setNotifyMaintenance} label={t("dashboard.reminders.title")} />
          <Toggle checked={notifyQuotes} onChange={setNotifyQuotes} label={t("dashboard.quotes.title")} />
          <Toggle checked={notifyPromos} onChange={setNotifyPromos} label={t("dashboard.map.title")} />
        </div>
      </Card>

      <Card className="border-red-500/20">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 text-sm font-semibold text-red-500 ring-1 ring-red-500/20 transition-colors hover:bg-red-500/20"
        >
          <LogOut size={16} />
          {t("dashboard.header.logout")}
        </button>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const { t } = useTranslation();
  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full max-sm:min-h-12 appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70"
          )}
        >
          <option value="">{placeholder ?? t("filters.any")}</option>
          {options.map((o) =>
            o ? (
              <option key={o} value={o} className="bg-card text-foreground">
                {o}
              </option>
            ) : null
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function SectionBackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <ArrowRight size={14} className="rotate-180" />
      {label}
    </Link>
  );
}