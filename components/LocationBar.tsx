"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Crosshair, Loader2, Search, X } from "lucide-react";

type LocationResult = {
  label: string;
  lat: number;
  lng: number;
};

type Props = {
  onLocationChange?: (location: LocationResult | null) => void;
  className?: string;
};

/**
 * Dependency-free location input.
 * - Browser Geolocation API for the user's current position (no API keys).
 * - Free-text city/address input passed straight to the search query
 *   (geocoding is handled downstream by the SerpApi backend).
 */
export default function LocationBar({ onLocationChange, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("idle");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  function notify(loc: LocationResult | null) {
    setLocation(loc);
    onLocationChange?.(loc);
  }

  /* ---- Browser Geolocation (no external service) ---- */
  function handleGeolocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setStatus("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const label = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        notify({ label, lat, lng });
        setInputValue(label);
        setStatus("ready");
      },
      () => {
        setError("Location access denied. Type a city or address instead.");
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
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-sm">
          {status === "loading" ? (
            <Loader2 size={14} className="animate-spin text-blue-400" />
          ) : location ? (
            <span className="h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-emerald-500/30" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-zinc-600 ring-1 ring-zinc-500/30" />
          )}
          <span className="text-muted-foreground">
            {status === "loading"
              ? "Detecting location..."
              : location
              ? location.label
              : "Location not activated"}
          </span>
        </div>

        {!location && (
          <button
            onClick={handleGeolocation}
            disabled={status === "loading"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            <Crosshair size={14} />
            Activate location
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}

      <div className="relative mt-3">
        <label htmlFor="location-search-input" className="sr-only">
          Search city or address
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 shadow-inner shadow-black/5 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 sm:px-4">
          <Search size={16} className="shrink-0 text-muted-foreground" />
          <input
            id="location-search-input"
            name="locationQuery"
            ref={inputRef}
            className="flex-1 bg-transparent py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={location ? "Change location" : "Search city or address..."}
          />
          {inputValue && (
            <button
              onClick={clearLocation}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              <X size={16} />
            </button>
          )}
          {location && (
            <button
              onClick={clearLocation}
              className="flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <MapPin size={12} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
