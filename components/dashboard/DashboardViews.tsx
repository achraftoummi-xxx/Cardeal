"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Car,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  FolderOpen,
  Gauge,
  Heart,
  Loader2,
  LogOut,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Trash2,
  User,
  Wallet,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import SearchAndMapSection from "@/components/SearchAndMapSection";
import DealerCard from "@/components/DealerCard";
import BrandSelect from "@/components/BrandSelect";
import CarBrandLogo from "@/components/CarBrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { useTranslation } from "@/components/TranslationProvider";
import { useAuth } from "@/components/AuthProvider";
import { navLabel, type NavKey } from "@/components/dashboard/DashboardSidebar";
import { fetchDealers, type Dealer } from "@/lib/dealers";
import { getManufacturerLogo } from "@/data/manufacturerLogos";
import { MANUFACTURER_CATALOG } from "@/data/manufacturerCatalog";
import { getTireBrandLogo } from "@/data/tireBrandLogos";
import { brandModels } from "@/data/carBrands";
import {
  getVehicleColorLabel,
  getVehicleImage,
  resolveVehicleImage,
  VEHICLE_COLORS,
} from "@/data/vehicleImages";
import { getCarBrandLogo } from "@/data/carBrandLogos";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { setAuthenticated, setUserName } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  computeVehicleHealthFromServices,
  CUSTOM_SERVICE_ID,
  CUSTOM_SERVICE_INTERVAL_KM,
  CYLINDER_OPTIONS,
  DASHBOARD_APPOINTMENTS,
  DASHBOARD_DOCUMENTS,
  DASHBOARD_EXPENSES,
  DASHBOARD_FAVORITES,
  DASHBOARD_HISTORY,
  DASHBOARD_MESSAGES,
  DASHBOARD_QUOTES,
  FUEL_OPTIONS,
  emptyUserVehicle,
  formatMileageKm,
  getDashboardVehicle,
  getUserName,
  loadUserProfile,
  loadUserVehicles,
  saveUserProfile,
  saveUserVehicles,
  seedUserVehicle,
  SERVICE_CATALOG,
  type UserService,
  type UserVehicle,
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

const TIRE_BRANDS = ["Amine", "Bridgestone", "Continental", "Goodyear", "Hankook", "Michelin", "Pirelli"];

export function TiresView() {
  const { t } = useTranslation();
  const [brand, setBrand] = useState("");
  const tires = t("pneus.tires") as unknown as TireOffer[];
  const filtered = brand ? tires.filter((tire) => tire.brand === brand) : tires;

  return (
    <div className="space-y-4">
      <SectionHeader navKey="tires" />

      <div className="mb-6">
        <Link
          href="/wheels/selector?from=dashboard"
          className="text-[#BA2529] hover:underline font-medium text-sm md:text-base transition-all inline-flex items-center gap-1.5 cursor-pointer"
        >
          <span>{t("pneus.checkWheelAndTireSize")}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

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

function ServiceModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: UserVehicle;
  onClose: () => void;
  onSave: (service: UserService) => void;
}) {
  const { t } = useTranslation();
  const [type, setType] = useState(SERVICE_CATALOG[0].id);
  const [customLabel, setCustomLabel] = useState("");
  const [customWeight, setCustomWeight] = useState(5);
  const [mileage, setMileage] = useState(
    vehicle.mileageKm != null ? String(vehicle.mileageKm) : ""
  );
  const [error, setError] = useState(false);

  const catalogItem = SERVICE_CATALOG.find((c) => c.id === type);
  const isCustom = type === CUSTOM_SERVICE_ID;
  const weight = isCustom ? customWeight : (catalogItem?.weight ?? 0);

  const handleSave = () => {
    const km = Number(mileage);
    if (!Number.isFinite(km) || km < 0 || (isCustom && !customLabel.trim())) {
      setError(true);
      return;
    }
    onSave({
      id: `service-${Date.now().toString(36)}`,
      type,
      label: isCustom ? customLabel.trim() : (catalogItem?.label ?? ""),
      weight,
      mileageKm: km,
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[var(--cardeal-primary)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-foreground">
              {t("dashboard.vehicles.logService")}
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {vehicle.brand || "—"} {vehicle.model}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("dashboard.settings.cancel")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t("dashboard.vehicles.serviceType")}
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputCls}
            >
              {SERVICE_CATALOG.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
              <option value={CUSTOM_SERVICE_ID}>
                {t("dashboard.vehicles.customService")}
              </option>
            </select>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              {t("dashboard.vehicles.serviceIntervalHint", {
                km: formatMileageKm(
                  isCustom ? CUSTOM_SERVICE_INTERVAL_KM : (catalogItem?.intervalKm ?? 0)
                ),
                weight,
              })}
            </p>
          </div>
          {isCustom && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t("dashboard.vehicles.serviceCustomName")}
                </label>
                <input
                  value={customLabel}
                  onChange={(e) => {
                    setCustomLabel(e.target.value);
                    setError(false);
                  }}
                  placeholder="Ex. Parallélisme"
                  className={cn(inputCls, error && "border-red-500")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  {t("dashboard.vehicles.serviceWeight")}
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Number(e.target.value))}
                  className={inputCls}
                />
              </div>
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              {t("dashboard.vehicles.serviceMileage")}
            </label>
            <input
              type="number"
              min={0}
              value={mileage}
              onChange={(e) => {
                setMileage(e.target.value);
                setError(false);
              }}
              placeholder="0"
              className={cn(inputCls, error && "border-red-500")}
            />
            {error && (
              <p className="mt-1.5 text-[11px] text-red-500">
                {t("dashboard.vehicles.serviceError")}
              </p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              {t("dashboard.settings.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-4 text-sm font-semibold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] active:scale-95"
            >
              <Plus size={15} />
              {t("dashboard.vehicles.saveService")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VehiclesView() {
  const { t } = useTranslation();
  const { bumpVehiclesVersion } = useDashboard();
  const [vehicles, setVehicles] = useState<UserVehicle[]>(() => {
    const stored = loadUserVehicles();
    if (stored && stored.length > 0) return stored;
    return [seedUserVehicle(getDashboardVehicle())];
  });
  const [serviceTarget, setServiceTarget] = useState<UserVehicle | null>(null);

  useEffect(() => {
    saveUserVehicles(vehicles);
    bumpVehiclesVersion();
  }, [vehicles, bumpVehiclesVersion]);

  const specs = (v: UserVehicle) =>
    [
      { label: t("dashboard.settings.year"), value: v.year },
      { label: t("dashboard.settings.fuel"), value: v.fuel },
      { label: t("dashboard.settings.capacity"), value: v.capacity },
      { label: t("dashboard.settings.cylinders"), value: v.cylinders },
      {
        label: t("dashboard.settings.mileage"),
        value: v.mileageKm != null ? formatMileageKm(v.mileageKm) : "",
      },
      { label: t("dashboard.settings.color"), value: getVehicleColorLabel(v.color) },
    ].filter((s) => s.value);

  const sortedServices = (v: UserVehicle) =>
    [...(v.services ?? [])].sort((a, b) => b.mileageKm - a.mileageKm);

  const addService = (service: UserService) => {
    if (!serviceTarget) return;
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === serviceTarget.id
          ? { ...v, services: [...(v.services ?? []), service] }
          : v
      )
    );
    setServiceTarget(null);
  };

  const removeService = (vehicleId: string, serviceId: string) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === vehicleId
          ? { ...v, services: (v.services ?? []).filter((s) => s.id !== serviceId) }
          : v
      )
    );
  };

  return (
    <div className="space-y-4">
      <SectionHeader navKey="vehicles" />
      {vehicles.map((v) => {
        const health = computeVehicleHealthFromServices(v);
        const uptoDate = health >= 75;
        return (
          <Card key={v.id}>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/40 p-2">
                <img
                  src={getVehicleImage(v.brand, v.model, v.year, v.color).src}
                  alt={`${v.brand} ${v.model}`}
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-lg font-bold text-foreground">
                    {v.brand || "—"} {v.model}
                  </p>
                  <HealthScoreRing score={health} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                  {specs(v).map((s) => (
                    <div key={s.label}>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-foreground">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t("dashboard.vehicle.healthScore")}
                </p>
                <span
                  className={cn(
                    "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                    uptoDate
                      ? "bg-green-500/10 text-green-500 ring-green-500/20"
                      : "bg-amber-500/10 text-amber-500 ring-amber-500/20"
                  )}
                >
                  <ShieldCheck size={11} />
                  {t(uptoDate ? "dashboard.vehicle.uptoDate" : "dashboard.vehicle.recommended")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setServiceTarget(v)}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-4 text-sm font-semibold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] active:scale-95"
              >
                <Plus size={15} />
                {t("dashboard.vehicles.addService")}
              </button>
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Wrench size={13} />
                {t("dashboard.vehicles.serviceHistory")}
              </h3>
              {sortedServices(v).length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("dashboard.vehicles.noServices")}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {sortedServices(v).map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-3 rounded-xl border border-border/70 px-3 py-2.5"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                        <Wrench size={14} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{s.label}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {formatMileageKm(s.mileageKm)} · {s.date.slice(8)}/{s.date.slice(5, 7)}/
                          {s.date.slice(0, 4)}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-muted/50 px-2 py-0.5 text-[11px] font-medium text-muted-foreground ring-1 ring-border">
                        {s.weight}%
                      </span>
                      <button
                        type="button"
                        onClick={() => removeService(v.id, s.id)}
                        aria-label={t("dashboard.vehicles.removeService")}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        );
      })}
      {serviceTarget && (
        <ServiceModal
          vehicle={serviceTarget}
          onClose={() => setServiceTarget(null)}
          onSave={addService}
        />
      )}
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
  const { email, avatarUrl, setAvatarUrl } = useAuth();
  const { bumpVehiclesVersion } = useDashboard();
  const initialProfile = useMemo(() => loadUserProfile(), []);
  const [name, setName] = useState(() => getUserName());
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [notifyMaintenance, setNotifyMaintenance] = useState(
    initialProfile?.prefs.notifyMaintenance ?? true
  );
  const [notifyQuotes, setNotifyQuotes] = useState(initialProfile?.prefs.notifyQuotes ?? true);
  const [notifyPromos, setNotifyPromos] = useState(initialProfile?.prefs.notifyPromos ?? false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [vehicles, setVehicles] = useState<UserVehicle[]>(() => {
    const stored = loadUserVehicles();
    return stored ?? [seedUserVehicle(getDashboardVehicle())];
  });
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<UserVehicle>(emptyUserVehicle);

  useEffect(() => {
    saveUserVehicles(vehicles);
    bumpVehiclesVersion();
  }, [vehicles, bumpVehiclesVersion]);

  const vehicleBrands = useMemo(() => Object.keys(brandModels).sort(), []);
  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 1960 + 1 }, (_, i) => String(current - i));
  }, []);
  const capacityOptions = useMemo(
    () => Array.from({ length: 81 }, (_, i) => ((5 + i) / 10).toFixed(1) + "L"),
    []
  );
  const modelsFor = (brand: string) => (brand ? [...(brandModels[brand] ?? [])].sort() : []);

  const handleSaveProfile = () => {
    setUserName(name.trim() || "Karim");
    saveUserProfile({ phone, prefs: { notifyMaintenance, notifyQuotes, notifyPromos } });
    if (isSupabaseConfigured) {
      void supabase!.auth.updateUser({ data: { full_name: name.trim() } }).catch(() => {});
    }
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const openAddForm = () => {
    setDraft(emptyUserVehicle());
    setEditingId(null);
    setFormOpen(true);
  };

  const openEditForm = (v: UserVehicle) => {
    setDraft({ ...v, color: v.color ?? "" });
    setEditingId(v.id);
    setFormOpen(true);
  };

  const submitVehicle = () => {
    if (!draft.brand) return;
    setVehicles((prev) => {
      const isEdit = editingId && prev.some((v) => v.id === editingId);
      return isEdit ? prev.map((v) => (v.id === editingId ? draft : v)) : [...prev, draft];
    });
    setFormOpen(false);
    setEditingId(null);
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    if (editingId === id) setFormOpen(false);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    if (isSupabaseConfigured) void supabase!.auth.signOut();
    window.location.href = "/";
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!(file.type === "image/png" || file.type === "image/jpeg") || file.size > 2 * 1024 * 1024)
      return;
    setAvatarUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("read failed"));
        reader.readAsDataURL(file);
      });
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: userData } = await supabase.auth.getUser();
          const userId = userData.user?.id ?? "anonymous";
          const ext = file.type === "image/png" ? "png" : "jpg";
          const path = `avatars/${userId}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("avatars")
            .upload(path, file, { upsert: true, contentType: file.type });
          if (!upErr) {
            const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
            setAvatarUrl(pub.publicUrl);
            return;
          }
        } catch {
          /* storage unavailable — fall back to local */
        }
      }
      setAvatarUrl(dataUrl);
    } finally {
      setAvatarUploading(false);
    }
  };

  const previewImage =
    formOpen && draft.brand ? (resolveVehicleImage(draft.brand, draft.model, draft.year, draft.color)?.src ?? null) : null;
  const previewEmptyLabel = t("dashboard.settings.vehiclePreviewEmpty");
  const previewHintLabel = t("dashboard.settings.vehiclePreviewHint");

  return (
    <div className="space-y-4">
      <SectionHeader navKey="settings" />

      <Card>
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          <User size={14} />
          {t("dashboard.settings.profile")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("dashboard.settings.profileSubtitle")}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={t("dashboard.settings.avatar")}
                className="h-14 w-14 rounded-full object-cover ring-1 ring-[var(--cardeal-primary)]/20"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cardeal-primary)]/10 text-xl font-bold text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20">
                {(name || "K").charAt(0).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              disabled={avatarUploading}
              aria-label={t("dashboard.settings.avatar")}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow transition-colors hover:bg-accent hover:text-foreground disabled:opacity-60"
            >
              {avatarUploading ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Camera size={12} />
              )}
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleAvatarFile}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-foreground">{name || "—"}</p>
            <p className="truncate text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <TextInput label={t("dashboard.settings.fullName")} value={name} onChange={setName} />
          <TextInput label={t("dashboard.settings.email")} value={email} readOnly />
          <TextInput
            label={t("dashboard.settings.phone")}
            value={phone}
            onChange={setPhone}
            type="tel"
            placeholder="+216 ..."
          />
        </div>
        <button
          type="button"
          onClick={handleSaveProfile}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-5 text-sm font-semibold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] active:scale-95"
        >
          {savedFlash ? <Check size={16} /> : <Save size={16} />}
          {savedFlash ? t("dashboard.settings.saved") : t("dashboard.settings.save")}
        </button>
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

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Car size={14} />
              {t("dashboard.settings.vehiclesTitle")}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">{t("dashboard.settings.vehiclesSubtitle")}</p>
          </div>
          {!formOpen && (
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[var(--cardeal-primary)] px-4 text-sm font-semibold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] active:scale-95"
            >
              <Plus size={15} />
              {t("dashboard.settings.addVehicle")}
            </button>
          )}
        </div>

        {vehicles.length === 0 && !formOpen && (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            {t("dashboard.settings.noVehicles")}
          </p>
        )}

        {vehicles.map((v) => (
          <div
            key={v.id}
            className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-background/60 p-4"
          >
            <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 p-1.5">
              <img
                src={getVehicleImage(v.brand, v.model, v.year, v.color).src}
                alt={`${v.brand} ${v.model}`}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {v.brand || "—"} {v.model}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {[
                  v.fuel,
                  v.capacity,
                  v.cylinders ? `${v.cylinders} cyl.` : "",
                  v.year,
                  getVehicleColorLabel(v.color),
                  v.mileageKm != null ? formatMileageKm(v.mileageKm) : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => openEditForm(v)}
                aria-label={t("dashboard.settings.edit")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Pencil size={15} />
              </button>
              <button
                type="button"
                onClick={() => deleteVehicle(v.id)}
                aria-label={t("dashboard.settings.delete")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {formOpen && (
          <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-3">
              <span className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border border-border bg-background p-1.5">
                {previewImage ? (
                  <img
                    src={previewImage.src}
                    alt={`${draft.brand} ${draft.model}`}
                    className="max-h-full w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="px-1 text-center text-[10px] leading-tight text-muted-foreground">
                    {previewEmptyLabel === "dashboard.settings.vehiclePreviewEmpty"
                      ? "No preview available"
                      : previewEmptyLabel}
                  </span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5">
                  {draft.brand && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background p-1">
                      <img
                        src={getCarBrandLogo(draft.brand).src}
                        alt={`${draft.brand} logo`}
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </span>
                  )}
                  <p className="truncate text-sm font-semibold text-foreground">
                    {[draft.brand, draft.model, draft.year, draft.color ? getVehicleColorLabel(draft.color) : ""]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {previewHintLabel === "dashboard.settings.vehiclePreviewHint"
                    ? "The picture updates automatically with brand, model, year and color."
                    : previewHintLabel}
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Select
                label={t("dashboard.settings.brand")}
                value={draft.brand}
                options={vehicleBrands}
                onChange={(brand) => setDraft((d) => ({ ...d, brand, model: "" }))}
              />
              <Select
                label={t("dashboard.settings.model")}
                value={draft.model}
                options={modelsFor(draft.brand)}
                onChange={(model) => setDraft((d) => ({ ...d, model }))}
                disabled={!draft.brand}
              />
              <Select
                label={t("dashboard.settings.capacity")}
                value={draft.capacity}
                options={capacityOptions}
                onChange={(capacity) => setDraft((d) => ({ ...d, capacity }))}
              />
              <Select
                label={t("dashboard.settings.cylinders")}
                value={draft.cylinders}
                options={CYLINDER_OPTIONS}
                onChange={(cylinders) => setDraft((d) => ({ ...d, cylinders }))}
              />
              <Select
                label={t("dashboard.settings.fuel")}
                value={draft.fuel}
                options={FUEL_OPTIONS}
                onChange={(fuel) => setDraft((d) => ({ ...d, fuel }))}
              />
              <Select
                label={t("dashboard.settings.year")}
                value={draft.year}
                options={yearOptions}
                onChange={(year) => setDraft((d) => ({ ...d, year }))}
              />
              <Select
                label={t("dashboard.settings.color")}
                value={draft.color}
                options={VEHICLE_COLORS.map((c) => ({ value: c.id, label: c.label }))}
                onChange={(color) => setDraft((d) => ({ ...d, color }))}
              />
              <TextInput
                label={t("dashboard.settings.mileage")}
                type="number"
                min={0}
                value={draft.mileageKm?.toString() ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, mileageKm: v === "" ? null : Number(v) }))}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={submitVehicle}
                disabled={!draft.brand}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cardeal-primary)] px-5 text-sm font-semibold text-white shadow-lg shadow-[#BA2529]/25 transition-all hover:bg-[#9E1F23] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingId ? t("dashboard.settings.updateVehicle") : t("dashboard.settings.saveVehicle")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {t("dashboard.settings.cancel")}
              </button>
            </div>
          </div>
        )}
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
  disabled = false,
}: {
  label: string;
  value: string;
  options: (string | { value: string; label: string })[];
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
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
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full max-sm:min-h-12 appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70",
            disabled && "cursor-not-allowed opacity-60"
          )}
        >
          <option value="">{placeholder ?? t("filters.any")}</option>
          {options.map((o) => {
            const optValue = typeof o === "string" ? o : o.value;
            const optLabel = typeof o === "string" ? o : o.label;
            return optValue ? (
              <option key={optValue} value={optValue} className="bg-card text-foreground">
                {optLabel}
              </option>
            ) : null;
          })}
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

function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly = false,
  min,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
  min?: number;
}) {
  const fieldId = `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        id={fieldId}
        type={type}
        value={value}
        readOnly={readOnly}
        min={min}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full max-sm:min-h-12 rounded-xl border border-border bg-background px-4 py-3 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
          readOnly && "cursor-not-allowed opacity-70"
        )}
      />
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