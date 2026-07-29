"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation, Loader2, Search, X } from "lucide-react";

type TomTomSuggestion = {
  id: string;
  address: {
    freeformAddress: string;
    country: string;
    countryCode: string;
    municipality?: string;
  };
  position: { lat: number; lon: number };
};

type LocationResult = {
  label: string;
  lat: number;
  lng: number;
};

type Props = {
  onLocationChange?: (location: LocationResult | null) => void;
  className?: string;
};

const TOMTOM_BASE = "https://api.tomtom.com";

export default function LocationBar({ onLocationChange, className }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "geocoding" | "ready">("idle");
  const [location, setLocation] = useState<LocationResult | null>(null);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<TomTomSuggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";

  function notify(loc: LocationResult | null) {
    setLocation(loc);
    onLocationChange?.(loc);
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setStatus("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setStatus("geocoding");
        try {
          if (!apiKey) {
            console.error("[LocationBar] TomTom API key (NEXT_PUBLIC_TOMTOM_API_KEY) is not configured");
            setStatus("idle");
            return;
          }
          const res = await fetch(
            `${TOMTOM_BASE}/search/2/reverseGeocode/${lat},${lng}.json?key=${apiKey}`
          );
          if (!res.ok) {
            setError("Could not resolve address. Try typing a location.");
            setStatus("idle");
            return;
          }
          const data = await res.json();
          const addr = data?.addresses?.[0]?.address;
          const label = addr?.freeformAddress || addr?.municipality || addr?.streetName;
          if (!label) {
            setError("Could not resolve address. Try typing a location.");
            setStatus("idle");
            return;
          }
          notify({ label, lat, lng });
          setInputValue(label);
          setStatus("ready");
        } catch {
          setError("Could not resolve address. Try typing a location.");
          setStatus("idle");
        }
      },
      () => {
        setError("Location access denied. Type an address instead.");
        setStatus("idle");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  const searchTomTom = useCallback(
    async (query: string) => {
      if (!query.trim() || !apiKey) return;
      setSearching(true);
      try {
        const res = await fetch(
          `${TOMTOM_BASE}/search/2/search/${encodeURIComponent(query)}.json?key=${apiKey}&limit=5&countrySet=FR`
        );
        const data = await res.json();
        setSuggestions(data?.results ?? []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    },
    [apiKey]
  );

  function handleInputChange(value: string) {
    setInputValue(value);
    setError("");
    if (value !== location?.label) {
      notify(null);
    }
    clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(() => searchTomTom(value), 350);
  }

  function selectSuggestion(s: TomTomSuggestion) {
    const label = s.address.freeformAddress;
    notify({ label, lat: s.position.lat, lng: s.position.lon });
    setInputValue(label);
    setShowDropdown(false);
    setSuggestions([]);
    setStatus("ready");
  }

  function clearLocation() {
    notify(null);
    setInputValue("");
    setSuggestions([]);
    setShowDropdown(false);
    setStatus("idle");
    setError("");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("", className)}>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-sm">
          {status === "loading" || status === "geocoding" ? (
            <Loader2 size={14} className="animate-spin text-blue-400" />
          ) : location ? (
            <span className="h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-emerald-500/30" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-zinc-600 ring-1 ring-zinc-500/30" />
          )}
          <span className="text-zinc-400">
            {status === "loading"
              ? "Detecting location..."
              : status === "geocoding"
              ? "Resolving address..."
              : location
              ? location.label
              : "Location not activated"}
          </span>
        </div>

        {!location && (
          <button
            onClick={handleGeolocation}
            disabled={status === "loading" || status === "geocoding"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-3 py-1.5 text-sm text-zinc-300 shadow-sm transition-all hover:bg-zinc-700/50 hover:text-zinc-100 disabled:opacity-50"
          >
            <Navigation size={14} />
            Activate location
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-amber-400">{error}</p>
      )}

      <div className="relative mt-3">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-3 py-2 shadow-inner shadow-black/10 transition-all focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 sm:px-4">
          <Search size={16} className="shrink-0 text-zinc-500" />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent py-1 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={location ? "Change location" : "Search city or address..."}
          />
          {searching && (
            <Loader2 size={14} className="animate-spin text-zinc-500" />
          )}
          {inputValue && !searching && (
            <button onClick={clearLocation} className="text-zinc-500 transition-colors hover:text-zinc-300">
              <X size={16} />
            </button>
          )}
          {location && (
            <button
              onClick={clearLocation}
              className="flex items-center gap-1 rounded-md bg-zinc-700/40 px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700/60 hover:text-zinc-200"
            >
              <MapPin size={12} />
              Clear
            </button>
          )}
        </div>

        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-zinc-700/50 bg-zinc-900 shadow-2xl shadow-black/40"
          >
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => selectSuggestion(s)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
              >
                <MapPin size={14} className="shrink-0 text-zinc-500" />
                <div className="min-w-0">
                  <span className="block truncate">{s.address.freeformAddress}</span>
                  {s.address.municipality && (
                    <span className="block truncate text-xs text-zinc-500">
                      {s.address.municipality}, {s.address.country}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
