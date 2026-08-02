"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import LocationBar from "@/components/LocationBar";
import PartnerCard from "@/components/PartnerCard";
import AppointmentModal from "@/components/AppointmentModal";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/components/WorkshopSearch";
import { brandModels } from "@/data/carBrands";
import { fetchPartners, sortPartners, type Partner } from "@/lib/partners";
import { cn } from "@/lib/utils";

const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl border border-border bg-card/50 sm:h-[480px] lg:h-[560px]" />
  ),
});

type LocationResult = { lat: number; lng: number; label: string } | null;

const ENGINE_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "LPG", "CNG"];
const CYLINDER_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

export default function SearchAndMapSection() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<LocationResult>(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [bookingPartner, setBookingPartner] = useState<Partner | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef("");
  const activeFilterCount = [brand, model, year, engine, capacity, cylinders, category, keyword].filter(Boolean).length;

  const models = useMemo(() => {
    if (!brand) return [];
    return [...(brandModels[brand] ?? [])].sort();
  }, [brand]);

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: current - 1960 + 1 }, (_, i) => String(current - i));
  }, []);

  const capacities = useMemo(
    () => ["", ...Array.from({ length: 81 }, (_, i) => ((5 + i) / 10).toFixed(1) + "L")],
    []
  );

  const engineOptions = useMemo(
    () => [
      { value: "", label: t("filters.any") },
      ...ENGINE_OPTIONS.map((v) => ({ value: v, label: localized(t, "engines", v) })),
    ],
    [t]
  );

  const cylindersOptions = useMemo(
    () => [
      { value: "", label: t("filters.any") },
      ...CYLINDER_COUNTS.map((c) => ({
        value: `${c} Cylinder${c > 1 ? "s" : ""}`,
        label: t(c === 1 ? "filters.cylinderOne" : "filters.cylindersMany", { count: c }),
      })),
    ],
    [t]
  );

  const runSearch = useCallback(async () => {
    const query = [keyword, category, brand, model, year, capacity, cylinders]
      .map((v) => v.trim())
      .filter(Boolean)
      .join(" ");
    lastQueryRef.current = query;
    setLoading(true);
    setError("");
    setActivePartnerId(null);
    try {
      const data = await fetchPartners(query || undefined);
      setPartners(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Fetch partners error:", err);
      setError(err instanceof Error ? err.message : t("errors.loadPartners"));
      setPartners([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, brand, model, year, capacity, cylinders, t]);

  const visible = useMemo(() => {
    const search = { keyword, category, origin: location ?? null };
    return sortPartners(partners, search);
  }, [partners, keyword, category, location]);

  const handleSearchClick = useCallback(() => {
    runSearch();
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [runSearch]);

  const handleLocationChange = useCallback((loc: LocationResult) => {
    setLocation(loc);
    setActivePartnerId(null);
  }, []);

  const selectPartner = useCallback((id: string) => {
    setActivePartnerId(id);
    document
      .getElementById(`partner-card-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  const bookingPartnerFor = (partner: Partner) => {
    setBookingPartner(partner);
    setActivePartnerId(partner.id);
  };

  const showInitial = !loading && !error && !hasSearched;
  const showEmpty = !loading && !error && hasSearched && visible.length === 0;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40 sm:p-6">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">{t("search.title")}</h2>

        <LocationBar onLocationChange={handleLocationChange} className="mt-4" />

        {/* Advanced filters toggle (mobile only — always expanded on sm+) */}
        <div className="mt-4 sm:hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced((s) => !s)}
            aria-expanded={showAdvanced}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground shadow-inner shadow-black/5 dark:shadow-black/10 transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-blue-500" />
              {t("filters.advanced")}
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </span>
            <ChevronDown
              size={16}
              className={`text-zinc-500 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Vehicle filters + service category (collapsible on mobile, always visible on sm+) */}
        <div className={cn("mt-4 sm:mt-6", showAdvanced ? "block" : "hidden sm:block")}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select
              label={t("filters.brand")}
              value={brand}
              onChange={(v) => {
                setBrand(v);
                setModel("");
                setActivePartnerId(null);
              }}
              options={["", ...Object.keys(brandModels).sort()]}
            />
            <Select
              label={t("filters.model")}
              value={model}
              onChange={setModel}
              options={["", ...models]}
            />
            <Select
              label={t("filters.year")}
              value={year}
              onChange={setYear}
              options={["", ...yearOptions]}
            />
            <Select label={t("filters.engine")} value={engine} onChange={setEngine} options={engineOptions} />
            <Select label={t("filters.capacity")} value={capacity} onChange={setCapacity} options={capacities} />
            <Select label={t("filters.cylinders")} value={cylinders} onChange={setCylinders} options={cylindersOptions} />
          </div>

          <div className="mt-4 sm:mt-6">
            <label
              htmlFor="partner-category-select"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              {t("search.serviceCategory")}
            </label>
            <div className="relative">
              <select
                id="partner-category-select"
                name="partnerCategory"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setActivePartnerId(null);
                }}
                className={cn(
                  "w-full max-sm:min-h-12 appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                  !category && "text-muted-foreground/70"
                )}
              >
                <option value="">{t("search.allServices")}</option>
                {SERVICE_CATEGORIES.map((s) => (
                  <option key={s} value={s} className="text-foreground">
                    {localized(t, "serviceCat", s)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <SlidersHorizontal size={16} className="text-zinc-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Service keyword + Search button */}
        <div className="mt-4 sm:mt-6">
          <label
            htmlFor="partner-keyword-input"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
          >
            {t("search.keywords")}
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2 shadow-inner shadow-black/5 dark:shadow-black/10 sm:px-5">
            <input
              id="partner-keyword-input"
              name="partnerKeyword"
              className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setActivePartnerId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchClick();
              }}
              placeholder={t("search.keywordPlaceholder")}
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="text-zinc-500 transition-colors hover:text-zinc-300"
                aria-label={t("location.clear")}
              >
                <X size={18} />
              </button>
            )}
            <button
              onClick={handleSearchClick}
              disabled={loading}
              className="flex max-sm:min-h-12 items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span className="hidden sm:inline">
                {loading ? t("search.searching") : t("search.search")}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="mt-6 grid grid-cols-1 gap-4 scroll-mt-24 lg:grid-cols-2">
        {/* Partner list column — hidden until the user submits a search */}
        <div className="order-2 min-w-0 lg:order-1">
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
              <AlertCircle size={16} className="shrink-0" />
              <span className="flex-1">{error}</span>
              <button
                onClick={() => runSearch()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-500/10"
              >
                <RefreshCw size={12} />
                {t("errors.retry")}
              </button>
            </div>
          )}

          {loading && (
            <div className="grid gap-3 sm:grid-cols-2 lg:block">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-card/50" />
              ))}
            </div>
          )}

          {showInitial && (
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-12 text-center backdrop-blur-sm sm:py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                <MapPin size={26} className="text-blue-500" />
              </div>
              <p className="max-w-md text-sm text-muted-foreground">{t("results.searchHint")}</p>
            </div>
          )}

          {showEmpty && (
            <div className="flex flex-col items-center rounded-2xl border border-border bg-card/50 px-6 py-12 text-center backdrop-blur-sm sm:py-16">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
                <AlertCircle size={26} className="text-red-400" />
              </div>
              <h3 className="text-base font-semibold text-foreground sm:text-lg">
                {t("results.noPartners")}
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                {t("results.noPartnersHint")}
              </p>
            </div>
          )}

          {hasSearched && !loading && !error && visible.length > 0 && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {visible.length === 1
                    ? t("results.partnerFound", { count: visible.length })
                    : t("results.partnersFound", { count: visible.length })}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={13} />
                  {t("results.sortedByProximity")}
                </p>
              </div>

              <div className="grid content-start gap-3 sm:grid-cols-2 lg:block lg:max-h-[560px] lg:gap-4 lg:overflow-y-auto lg:pr-1">
                {visible.map((p) => (
                  <PartnerCard
                    key={p.id}
                    partner={p}
                    origin={location}
                    active={p.id === activePartnerId}
                    onSelect={() => selectPartner(p.id)}
                    onBook={() => bookingPartnerFor(p)}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Map column — always visible (Tunis context or user location before any search) */}
        <div className="order-1 lg:order-2">
          <PartnerMap
            location={location}
            partners={visible}
            activePartnerId={activePartnerId}
            onPartnerSelect={selectPartner}
            revalidateKey={visible.length}
          />
        </div>
      </div>

      <AppointmentModal partner={bookingPartner} onClose={() => setBookingPartner(null)} />
    </section>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation();
  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          name={label.toLowerCase().replace(/\s+/g, "-")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full max-sm:min-h-12 appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70"
          )}
        >
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const display = typeof o === "string" ? o || t("filters.any") : v ? o.label : t("filters.any");
            return (
              <option key={v} value={v} className="bg-card text-foreground">
                {display}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
