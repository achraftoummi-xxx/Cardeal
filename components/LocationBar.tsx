"use client";

import { useCallback, useRef, useState } from "react";
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

/**
 * Dependency-free location input.
 * - Browser Geolocation API for the user's current position (no API keys).
 * - Reverse geocoding via OpenStreetMap Nominatim so the search input
 *   shows a human-readable place name instead of raw coordinates.
 * - Free-text city/address input passed straight to the search query
 *   (geocoding is handled downstream by the SerpApi backend).
 */
export default function LocationBar({ onLocationChange, className }: Props) {
  const { t, locale } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");

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

  /* ---- Free-text input (no autocomplete service) ---- */
  function handleInputChange(value: string) {
    setInputValue(value);
    setError("");
    if (value !== location?.label) {
      notify(null);
    }
  }

  function clearLocation() {
    notify(null);
    setInputValue("");
    setStatus("idle");
    setError("");
    inputRef.current?.focus();
  }

  return (
    <div className={cn("", className)}>
      {error && <p className="mb-2 text-xs text-amber-400">{error}</p>}

      <div className="relative">
        <label htmlFor="location-search-input" className="sr-only">
          {t("location.searchCityAria")}
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 shadow-inner shadow-black/5 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 sm:px-4">
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
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X size={16} />
            </button>
          )}
          {!location && status !== "loading" && (
            <button
              onClick={handleGeolocation}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground"
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
      </div>
    </div>
  );
}
