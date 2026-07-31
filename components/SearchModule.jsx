"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Loader2, AlertCircle, MapPin, Star, Phone, ChevronDown, SlidersHorizontal } from "lucide-react";
import LocationBar from "@/components/LocationBar";
import { useTranslation } from "./TranslationProvider";
import { localized } from "@/lib/i18n";

/**
 * Workshop – local seed data entry (same shape as data/workshops.ts).
 * @typedef {Object} Workshop
 * @property {string} name
 * @property {string[]} services
 * @property {string} distance
 * @property {string} brand
 * @property {string} model
 * @property {string} year
 * @property {string} engine
 * @property {string} capacity
 * @property {string} [cylinders]
 * @property {number} [lat]
 * @property {number} [lng]
 */

/**
 * ShopResult – live Google Maps business returned by /api/shops.
 * @typedef {Object} ShopResult
 * @property {string} [placeId]
 * @property {string} title
 * @property {string} address
 * @property {number} latitude
 * @property {number} longitude
 * @property {number} [rating]
 * @property {number} [reviews]
 * @property {string} [phone]
 * @property {string} [website]
 * @property {string} [type]
 * @property {string} [category]
 * @property {string} [openState]
 * @property {string} [operationalStatus]
 * @property {string[]} [hours]
 * @property {string} [description]
 * @property {string[]} [serviceOptions]
 * @property {string} [thumbnail]
 * @property {number} [distanceKm]
 */

/**
 * @typedef {Object} Location
 * @property {string} label
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} Props
 * @property {Record<string, string[]>} brandModels
 * @property {Workshop[]} workshops
 * @property {(location: Location | null) => void} [onLocationChange]
 * @property {(results: Workshop[]) => void} [onResultsFiltered]
 * @property {(shops: ShopResult[]) => void} [onShopsLoaded]
 */

export const SERVICE_CATEGORIES = [
  "Oil Change & Filters",
  "Brake Repair & Service",
  "Engine Diagnostics",
  "Transmission & Clutch",
  "Suspension & Steering",
  "Battery & Electrical",
  "Air Conditioning & Cooling",
  "General Repair & Maintenance",
];

const ENGINE_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "LPG", "CNG"];
const CYLINDER_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 1960 + 1 }, (_, i) => String(CURRENT_YEAR - i));

/**
 * Advanced search & filtering module for the shop directory.
 * Drop-in compatible with the existing WorkshopSearch props contract.
 */
export default function SearchModule({
  brandModels,
  workshops,
  onLocationChange,
  onResultsFiltered,
  onShopsLoaded,
}: Props) {
  const { t } = useTranslation();
  /* ---- vehicle filter state ---- */
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cylinders, setCylinders] = useState("");

  /* ---- service + keyword state ---- */
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");

  /* ---- advanced filters accordion (mobile only) ---- */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeFilterCount = [brand, model, year, engine, capacity, cylinders, category].filter(Boolean).length;

  /* ---- location state (driven by the shared LocationBar) ---- */
  const [location, setLocation] = useState(null);

  /* ---- live results state ---- */
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(false);
  const [shopsError, setShopsError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const abortRef = useRef(null);

  /* ---- derived values ---- */
  const models = useMemo(() => {
    if (!brand) return [];
    return [...(brandModels[brand] ?? [])].sort();
  }, [brand, brandModels]);

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

  const categoryOptions = useMemo(
    () => [
      { value: "", label: t("filters.any") },
      ...SERVICE_CATEGORIES.map((c) => ({ value: c, label: localized(t, "serviceCat", c) })),
    ],
    [t]
  );

  /* category → keyword terms for local matching ("Oil Change & Filters" → ["oil change", "filters"]) */
  const categoryTerms = useMemo(() => {
    if (!category) return [];
    return category
      .toLowerCase()
      .split("&")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [category]);

  /* ---- local database filtering (existing behavior preserved) ---- */
  const results = useMemo(() => {
    const q = keyword.toLowerCase().trim();

    return workshops.filter((w) => {
      if (q && !(w.name.toLowerCase().includes(q) || w.services.some((s) => s.toLowerCase().includes(q)))) {
        return false;
      }
      if (categoryTerms.length > 0) {
        const haystack = `${w.name} ${w.services.join(" ")}`.toLowerCase();
        if (!categoryTerms.some((term) => haystack.includes(term))) return false;
      }
      if (brand && w.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (model && w.model.toLowerCase() !== model.toLowerCase()) return false;
      if (year && w.year !== year) return false;
      if (engine && w.engine.toLowerCase() !== engine.toLowerCase()) return false;
      if (capacity && w.capacity !== capacity) return false;
      if (cylinders && w.cylinders !== cylinders) return false;
      return true;
    });
  }, [keyword, categoryTerms, brand, model, year, engine, capacity, cylinders, workshops]);

  useEffect(() => {
    onResultsFiltered?.(results);
  }, [results, onResultsFiltered]);

  /* ---- location handling ---- */
  const handleLocationChange = useCallback(
    (loc) => {
      setLocation(loc);
      onLocationChange?.(loc);
    },
    [onLocationChange]
  );

  /* ---- live shop search (SerpApi Google Maps via /api/shops) ---- */
  const searchShops = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setShopsLoading(true);
    setShopsError(null);
    setHasSearched(true);

    const params = new URLSearchParams();
    if (location) {
      params.set("city", location.label);
      params.set("lat", String(location.lat));
      params.set("lng", String(location.lng));
    }
    if (brand) params.set("brand", brand);
    if (category) params.set("category", category);
    if (keyword.trim()) params.set("q", keyword.trim());

    try {
      const res = await fetch(`/api/shops?${params.toString()}`, {
        signal: controller.signal,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t("errors.serverError", { status: res.status }));
      }
      const data = await res.json();
      if (!controller.signal.aborted) {
        const list = data.results ?? [];
        setShops(list);
        onShopsLoaded?.(list);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setShopsError(err instanceof Error ? err.message : t("errors.loadShops"));
      setShops([]);
    } finally {
      if (!controller.signal.aborted) setShopsLoading(false);
    }
  }, [location, brand, category, keyword, onShopsLoaded, t]);

  /* abort in-flight request on unmount */
  useEffect(() => () => abortRef.current?.abort(), []);

  const handleSearchClick = () => searchShops();
  const handleKeywordKeyDown = (e) => {
    if (e.key === "Enter") searchShops();
  };

  /* ---- UI flags ---- */
  const showIdle = !hasSearched && !shopsLoading && !shopsError;
  const showEmpty = hasSearched && !shopsLoading && !shopsError && shops.length === 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xl sm:p-8">
      {/* Location (reuses the existing LocationBar) */}
      <LocationBar onLocationChange={handleLocationChange} className="mb-4 sm:mb-6" />

      {/* Advanced filters toggle (mobile only — always expanded on sm+) */}
      <div className="mb-4 sm:hidden">
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
      <div className={showAdvanced ? "block" : "hidden sm:block"}>
        {/* Vehicle filter grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label={t("filters.brand")}
            value={brand}
            onChange={(v) => {
              setBrand(v);
              setModel("");
            }}
            options={["", ...Object.keys(brandModels).sort()]}
          />
          <Select label={t("filters.model")} value={model} onChange={setModel} options={["", ...models]} />
          <Select label={t("filters.year")} value={year} onChange={setYear} options={["", ...YEAR_OPTIONS]} />
          <Select label={t("filters.engine")} value={engine} onChange={setEngine} options={engineOptions} />
          <Select label={t("filters.capacity")} value={capacity} onChange={setCapacity} options={capacities} />
          <Select label={t("filters.cylinders")} value={cylinders} onChange={setCylinders} options={cylindersOptions} />
        </div>

        {/* Service category dropdown */}
        <div className="mt-4 sm:mt-6">
          <Select
            label={t("search.serviceCategory")}
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Keyword search + Search button */}
      <div className="mt-4">
        <label
          htmlFor="search-module-keyword"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          {t("search.keywords")}
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2 shadow-inner shadow-black/5 dark:shadow-black/10 sm:px-5">
          <input
            id="search-module-keyword"
            name="searchKeywords"
            className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder={t("search.keywordPlaceholder")}
          />
          {keyword && (
            <button
              onClick={() => setKeyword("")}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X size={18} />
            </button>
          )}
          <button
            onClick={handleSearchClick}
            disabled={shopsLoading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
          >
            {shopsLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            <span className="hidden sm:inline">{shopsLoading ? t("search.searching") : t("search.search")}</span>
          </button>
        </div>
      </div>

      {/* ---- Results ---- */}
      <div className="mt-6 border-t border-zinc-800/60 pt-5">
        {shopsError && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <AlertCircle size={16} className="shrink-0" />
            <span>{shopsError}</span>
          </div>
        )}

        {shopsLoading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border bg-card/50"
              />
            ))}
          </div>
        )}

        {showIdle && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <MapPin size={24} className="mx-auto mb-2 opacity-40" />
            <p>
              {t("results.idle", { search: "__SEARCH__" }).split("__SEARCH__").map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="font-semibold text-foreground">{t("search.search")}</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}

        {showEmpty && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <AlertCircle size={24} className="mx-auto mb-2 opacity-40" />
            <p>{t("results.noShops")}</p>
            <p className="mt-1 text-xs">{t("results.noShopsHint")}</p>
          </div>
        )}

        {!shopsLoading && shops.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {shops.length === 1
                ? t("results.shopFound", { count: shops.length })
                : t("results.shopsFound", { count: shops.length })}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <div
                  key={shop.placeId ?? `${shop.latitude}-${shop.longitude}-${shop.title}`}
                  className="rounded-xl border border-border bg-card/50 p-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    {shop.thumbnail ? (
                      <img
                        src={shop.thumbnail}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-400 ring-1 ring-blue-500/20">
                        {shop.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{shop.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{shop.address}</p>
                    </div>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {shop.rating != null && (
                      <span className="flex items-center gap-1 font-medium text-amber-500">
                        <Star size={12} fill="currentColor" />
                        {shop.rating.toFixed(1)}
                        {shop.reviews != null && (
                          <span className="font-normal text-muted-foreground">({shop.reviews})</span>
                        )}
                      </span>
                    )}
                    {shop.distanceKm != null && (
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-medium text-blue-500 ring-1 ring-blue-500/20">
                        {shop.distanceKm < 1
                          ? t("results.underOneKm")
                          : t("results.km", { count: Math.round(shop.distanceKm) })}
                      </span>
                    )}
                    {shop.openState && (
                      <span
                        className={
                          shop.openState.toLowerCase().includes("open")
                            ? "font-medium text-green-500"
                            : "text-muted-foreground"
                        }
                      >
                        {shop.openState.toLowerCase().includes("open")
                          ? t("results.open")
                          : shop.openState.toLowerCase().includes("clos")
                          ? t("results.closed")
                          : shop.openState}
                      </span>
                    )}
                  </div>

                  {shop.phone && (
                    <a
                      href={`tel:${shop.phone}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                    >
                      <Phone size={11} />
                      {shop.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Local database matches (vehicle filters apply here) */}
        <div className="mt-5 border-t border-border pt-4">
          <p className="mb-3 text-sm text-muted-foreground">
            {results.length
              ? results.length === 1
                ? t("results.match", { count: results.length })
                : t("results.matches", { count: results.length })
              : t("results.noMatch")}
          </p>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
            {results.map((w) => (
              <div
                key={w.name}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card/50 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-accent hover:shadow-md sm:px-4 sm:py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {w.services.map((s) => localized(t, "serviceCat", s)).slice(0, 2).join(", ")}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 ring-1 ring-blue-500/20">
                  {w.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================ */
/*  Select sub-component (same visual language as the codebase)     */
/* ================================================================ */
function Select({ label, value, options, onChange }) {
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
          className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
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
