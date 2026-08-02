"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  X,
  Loader2,
  AlertCircle,
  MapPin,
  List,
  Map as MapIcon,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import LocationBar from "@/components/LocationBar";
import PartnerCard from "@/components/PartnerCard";
import AppointmentModal from "@/components/AppointmentModal";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";
import { SERVICE_CATEGORIES } from "@/components/WorkshopSearch";
import { fetchPartners, sortPartners, type Partner } from "@/lib/partners";
import { cn } from "@/lib/utils";

const PartnerMap = dynamic(() => import("@/components/PartnerMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-2xl border border-border bg-card/50 sm:h-[480px] lg:h-[560px]" />
  ),
});

type LocationResult = { lat: number; lng: number; label: string } | null;

export default function SearchAndMapSection() {
  const { t } = useTranslation();
  const [location, setLocation] = useState<LocationResult>(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null);
  const [bookingPartner, setBookingPartner] = useState<Partner | null>(null);
  const [mobileTab, setMobileTab] = useState<"list" | "map">("list");
  const resultsRef = useRef<HTMLDivElement>(null);
  const activeFilterCount = [keyword, category].filter(Boolean).length;

  const loadPartners = useCallback(async (searchKeyword?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPartners(searchKeyword);
      setPartners(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Fetch partners error:", err);
      setError(err instanceof Error ? err.message : t("errors.loadPartners"));
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadPartners();
  }, [loadPartners]);

  const visible = useMemo(() => {
    const search = { keyword, category, origin: location ?? null };
    return sortPartners(partners, search);
  }, [partners, keyword, category, location]);

  const handleSearchClick = useCallback(() => {
    setActivePartnerId(null);
    loadPartners(keyword.trim() || undefined);
    setMobileTab("list");
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [keyword, loadPartners]);

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

  const showEmpty = !loading && !error && visible.length === 0;
  const showIdle = !loading && !error && !hasSearched;

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/10 backdrop-blur-xl dark:shadow-black/40 sm:p-6">
        <h2 className="text-lg font-bold text-foreground sm:text-xl">{t("search.title")}</h2>

        <LocationBar onLocationChange={handleLocationChange} className="mt-4" />

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label
              htmlFor="partner-keyword-input"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
            >
              {t("search.keywords")}
            </label>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2 shadow-inner shadow-black/5 dark:shadow-black/10 max-sm:min-h-12 sm:px-5">
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
            </div>
          </div>

          <div className="sm:col-span-1">
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

          <div className="flex items-end lg:col-span-1">
            <button
              onClick={handleSearchClick}
              disabled={loading}
              className="flex w-full max-sm:min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              <span>{loading ? t("search.searching") : t("search.search")}</span>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div ref={resultsRef} className="mt-6 scroll-mt-24">
        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
            <AlertCircle size={16} className="shrink-0" />
            <span className="flex-1">{error}</span>
            <button
              onClick={() => loadPartners(keyword.trim() || undefined)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-red-500/10"
            >
              <RefreshCw size={12} />
              {t("errors.retry")}
            </button>
          </div>
        )}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-card/50" />
            ))}
          </div>
        )}

        {!loading && !error && (
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

            <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-card/50 p-1 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileTab("list")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  mobileTab === "list"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <List size={16} />
                {t("map.list")}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                    mobileTab === "list" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-500"
                  )}
                >
                  {visible.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("map")}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  mobileTab === "map"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <MapIcon size={16} />
                {t("map.map")}
              </button>
            </div>

            {showIdle && (
              <div className="rounded-xl border border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
                <MapPin size={24} className="mx-auto mb-2 opacity-40" />
                <p>{t("results.searchHint")}</p>
              </div>
            )}

            {showEmpty && (
              <div className="rounded-xl border border-border bg-card/50 p-6 text-center text-sm text-muted-foreground">
                <AlertCircle size={24} className="mx-auto mb-2 opacity-40" />
                <p>{t("results.noPartners")}</p>
                <p className="mt-1 text-xs">{t("results.noPartnersHint")}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div
                className={cn(
                  "grid content-start gap-3 sm:grid-cols-2 lg:block lg:max-h-[560px] lg:gap-4 lg:overflow-y-auto lg:pr-1",
                  mobileTab === "map" && "hidden lg:block"
                )}
              >
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

              <div className={cn(mobileTab === "list" && "hidden lg:block")}>
                <PartnerMap
                  location={location}
                  partners={visible}
                  activePartnerId={activePartnerId}
                  onPartnerSelect={selectPartner}
                  revalidateKey={mobileTab}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <AppointmentModal
        partner={bookingPartner}
        onClose={() => setBookingPartner(null)}
      />
    </section>
  );
}
