"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Crosshair, Loader2, Search, X } from "lucide-react";
import { useTranslation } from "./TranslationProvider";

type LocationResult = {
  label: string;
  lat: number;
  lng: number;
};

type Props = {
  onLocationChange?: (location: LocationResult | null) => void;
  className?: string;
};

const toFallbackLabel = (lat: number, lng: number) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

/* Geoapify Address Autocomplete — API key from env. Reads the canonical
   NEXT_PUBLIC_GEOAPIFY_API_KEY, falling back to the legacy
   NEXT_PUBLIC_GEOAPIFY_API_URL variable that used to hold the key. */
const GEOAPIFY_API_KEY =
  process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ??
  process.env.NEXT_PUBLIC_GEOAPIFY_API_URL ??
  "";

const SUGGESTION_DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 3;

/**
 * Location input.
 * - Browser Geolocation API for the user's current position (no API keys).
 * - Reverse geocoding via OpenStreetMap Nominatim so the search input
 *   shows a human-readable place name instead of raw coordinates.
 * - Geoapify address autocomplete for real-time, selectable suggestions
 *   with exact coordinates (falls back to free-text when unconfigured).
 */
export default function LocationBar({ onLocationChange, className }: Props) {
  const { t, locale } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationResult[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function notify(loc: LocationResult | null) {
    setLocation(loc);
    onLocationChange?.(loc);
  }

  /* ---- Reverse geocoding (OpenStreetMap Nominatim) ---- */
  const reverseGeocode = useCallback(
    async (lat: number, lng: number): Promise<string | null> => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&accept-language=${locale}`
        );
        if (!res.ok) return null;
        const data = (await res.json()) as {
          display_name?: string;
          address?: {
            city?: string;
            town?: string;
            village?: string;
            municipality?: string;
            suburb?: string;
            neighbourhood?: string;
          };
        };
        const a = data?.address;
        return (
          a?.city ||
          a?.town ||
          a?.village ||
          a?.municipality ||
          a?.suburb ||
          a?.neighbourhood ||
          (typeof data?.display_name === "string" ? data.display_name : null) ||
          null
        );
      } catch {
        return null;
      }
    },
    [locale]
  );

  /* ---- Geoapify address autocomplete (debounced) ---- */
  useEffect(() => {
    if (!GEOAPIFY_API_KEY) return;
    const query = inputValue.trim();
    if (query.length < MIN_QUERY_LENGTH || query === location?.label) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}&format=json&limit=5&lang=${locale}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Geoapify returned ${res.status}`);
        const data = (await res.json()) as {
          results?: Array<{ formatted?: string; lat?: number; lon?: number }>;
        };
        const results = (data.results ?? [])
          .filter((r) => r.formatted && r.lat != null && r.lon != null)
          .map((r) => ({
            label: r.formatted as string,
            lat: r.lat as number,
            lng: r.lon as number,
          }));
        setSuggestions(results);
        setSuggestionsOpen(results.length > 0);
      } catch {
        /* Network or API failure — fall back to free-text behavior. */
      } finally {
        setSuggestionsLoading(false);
      }
    }, SUGGESTION_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue, location?.label, locale]);

  /* Close the dropdown on outside click or Escape */
  useEffect(() => {
    if (!suggestionsOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!suggestionsRef.current?.contains(e.target as Node)) setSuggestionsOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [suggestionsOpen]);

  /* ---- Browser Geolocation (no external service) ---- */
  async function handleGeolocation() {
    if (!navigator.geolocation) {
      setError(t("location.geoNotSupported"));
      return;
    }
    setStatus("loading");
    setError("");
    inputRef.current?.focus();

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const label = (await reverseGeocode(lat, lng)) ?? toFallbackLabel(lat, lng);
        notify({ label, lat, lng });
        setInputValue(label);
        setStatus("ready");
      },
      () => {
        setError(t("location.accessDenied"));
        setStatus("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  /* ---- Free-text input with Geoapify autocomplete ---- */
  function handleInputChange(value: string) {
    setInputValue(value);
    setError("");
    setSuggestionsOpen(false);
    if (value !== location?.label) {
      notify(null);
    }
  }

  function clearLocation() {
    notify(null);
    setInputValue("");
    setStatus("idle");
    setError("");
    setSuggestions([]);
    setSuggestionsOpen(false);
    inputRef.current?.focus();
  }

  /* ---- Select a Geoapify suggestion: fill input, center the map ---- */
  function selectSuggestion(suggestion: LocationResult) {
    notify(suggestion);
    setInputValue(suggestion.label);
    setStatus("ready");
    setSuggestions([]);
    setSuggestionsOpen(false);
  }

  return (
    <div className={cn("", className)}>
      {error && <p className="mb-2 text-xs text-amber-400">{error}</p>}

      <div className="relative">
        <label htmlFor="location-search-input" className="sr-only">
          {t("location.searchCityAria")}
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 shadow-inner shadow-black/5 transition-all max-sm:min-h-12 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 sm:px-4">
          {status === "loading" ? (
            <Loader2 size={16} className="shrink-0 animate-spin text-blue-400" />
          ) : (
            <Search size={16} className="shrink-0 text-muted-foreground" />
          )}
          <input
            id="location-search-input"
            name="locationQuery"
            ref={inputRef}
            className="flex-1 bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={location ? t("location.changePlaceholder") : t("location.placeholder")}
          />
          {inputValue && !location && (
            <button
              onClick={clearLocation}
              aria-label={t("location.clear")}
              className="max-sm:p-2 text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X size={16} />
            </button>
          )}
          {!location && status !== "loading" && (
            <button
              onClick={handleGeolocation}
              className="inline-flex max-sm:self-stretch shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
            >
              <Crosshair size={14} />
              <span className="hidden sm:inline">{t("location.activate")}</span>
            </button>
          )}
          {location && (
            <button
              onClick={clearLocation}
              className="flex shrink-0 items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <MapPin size={12} />
              {t("location.clear")}
            </button>
          )}
        </div>

        {/* Address autocomplete dropdown */}
        {suggestionsOpen && (
          <div
            ref={suggestionsRef}
            role="listbox"
            className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/25 backdrop-blur-xl dark:shadow-black/50"
          >
            {suggestionsLoading && (
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                <Loader2 size={14} className="animate-spin text-blue-400" />
                {t("search.searching")}
              </div>
            )}
            <ul className="max-h-72 overflow-y-auto">
              {suggestions.map((s) => (
                <li key={`${s.lat}-${s.lng}-${s.label}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => selectSuggestion(s)}
                    className="flex w-full items-start gap-2.5 px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <MapPin size={15} className="mt-0.5 shrink-0 text-blue-500" />
                    <span className="min-w-0">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
