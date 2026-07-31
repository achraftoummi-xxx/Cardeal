"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Loader2, AlertCircle, MapPin, Star, Phone } from "lucide-react";
import LocationBar from "@/components/LocationBar";

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
const CYLINDERS_OPTIONS = [
  "",
  "1 Cylinder", "2 Cylinders", "3 Cylinders", "4 Cylinders", "5 Cylinders",
  "6 Cylinders", "8 Cylinders", "10 Cylinders", "12 Cylinders", "16 Cylinders",
];

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
        throw new Error(body.error || `Server error: ${res.status}`);
      }
      const data = await res.json();
      if (!controller.signal.aborted) {
        const list = data.results ?? [];
        setShops(list);
        onShopsLoaded?.(list);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setShopsError(err instanceof Error ? err.message : "Failed to load nearby shops");
      setShops([]);
    } finally {
      if (!controller.signal.aborted) setShopsLoading(false);
    }
  }, [location, brand, category, keyword, onShopsLoaded]);

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
    <div className="rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xl sm:p-8">
      {/* Location (reuses the existing LocationBar) */}
      <LocationBar onLocationChange={handleLocationChange} className="mb-6" />

      {/* Vehicle filter grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Brand"
          value={brand}
          onChange={(v) => {
            setBrand(v);
            setModel("");
          }}
          options={["", ...Object.keys(brandModels).sort()]}
        />
        <Select label="Model" value={model} onChange={setModel} options={["", ...models]} />
        <Select label="Year" value={year} onChange={setYear} options={["", ...YEAR_OPTIONS]} />
        <Select label="Engine" value={engine} onChange={setEngine} options={["", ...ENGINE_OPTIONS]} />
        <Select label="Capacity" value={capacity} onChange={setCapacity} options={capacities} />
        <Select label="Cylinders" value={cylinders} onChange={setCylinders} options={CYLINDERS_OPTIONS} />
      </div>

      {/* Service category dropdown */}
      <div className="mt-6">
        <Select
          label="Search Services Category"
          value={category}
          onChange={setCategory}
          options={["", ...SERVICE_CATEGORIES]}
        />
      </div>

      {/* Keyword search + Search button */}
      <div className="mt-4">
        <label
          htmlFor="search-module-keyword"
          className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          Keywords
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2 shadow-inner shadow-black/5 dark:shadow-black/10 sm:px-5">
          <input
            id="search-module-keyword"
            name="searchKeywords"
            className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder="e.g. brake pads, oil change, battery…"
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
            <span className="hidden sm:inline">{shopsLoading ? "Searching…" : "Search"}</span>
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
              Set your filters and click <span className="font-semibold text-foreground">Search</span>{" "}
              to find real nearby repair shops
            </p>
          </div>
        )}

        {showEmpty && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <AlertCircle size={24} className="mx-auto mb-2 opacity-40" />
            <p>No shops found</p>
            <p className="mt-1 text-xs">Try adjusting your location, category, or keywords</p>
          </div>
        )}

        {!shopsLoading && shops.length > 0 && (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {shops.length} shop{shops.length > 1 ? "s" : ""} found nearby
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shops.map((shop) => (
                <div
                  key={shop.placeId ?? `${shop.latitude}-${shop.longitude}-${shop.title}`}
                  className="rounded-xl border border-border bg-card/50 p-4 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:shadow-md"
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
                        {shop.distanceKm < 1 ? "<1" : Math.round(shop.distanceKm)} km
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
                        {shop.openState}
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
              ? `${results.length} workshop${results.length > 1 ? "s" : ""} match your vehicle filters`
              : "No workshops match your vehicle filters"}
          </p>
          <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
            {results.map((w) => (
              <div
                key={w.name}
                className="flex shrink-0 items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-accent hover:shadow-md"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                  <p className="text-xs text-muted-foreground">{w.services.slice(0, 2).join(", ")}</p>
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
          {options.map((o) => (
            <option key={o} value={o} className="bg-card text-foreground">
              {o || "Any"}
            </option>
          ))}
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
