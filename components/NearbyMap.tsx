"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

type Workshop = {
  name: string;
  services: string[];
  distance: string;
  brand: string;
  model: string;
  year: string;
  engine: string;
  capacity: string;
  cylinders?: string;
  lat?: number;
  lng?: number;
};

type Props = {
  location: { lat: number; lng: number; label: string } | null;
  workshops: Workshop[];
  className?: string;
};

const DEFAULT_CENTER: [number, number] = [10.1861, 36.8838];
const DEFAULT_ZOOM = 12;

export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ttRef = useRef<any>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    import("@tomtom-international/web-sdk-maps").then((mod) => {
      ttRef.current = mod.default || mod;
      setReady(true);
    });
    import("@tomtom-international/web-sdk-maps/dist/maps.css");
  }, []);

  // Initialize map instance once
  useEffect(() => {
    const tt = ttRef.current;
    if (!ready || !tt || !containerRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
    if (!apiKey) {
      console.warn("[NearbyMap] TomTom API key is not configured");
      return;
    }

    tt.setProductInfo("Cardeal", "1.0");

    const center = location ? [location.lng, location.lat] : DEFAULT_CENTER;
    const zoom = location ? 14 : DEFAULT_ZOOM;
    const styleVariant = resolvedTheme === "dark" ? "2/basic_mono-dark" : "2/basic_street-light";
    const map = tt.map({
      key: apiKey,
      container: containerRef.current,
      center,
      zoom,
      style: `https://api.tomtom.com/style/1/style/${styleVariant}?key=${apiKey}`,
    });

    map.addControl(new tt.FullscreenControl(), "top-left");
    map.addControl(new tt.NavigationControl(), "top-left");

    map.on("load", () => map.invalidateSize());

    mapRef.current = map;

    const onResize = () => map.invalidateSize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      map.remove();
      mapRef.current = null;
    };
  }, [ready]);

  // Dynamically update TomTom map style when resolvedTheme changes using v2 API endpoints
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
    if (!apiKey) return;

    const styleVariant = resolvedTheme === "dark" ? "2/basic_mono-dark" : "2/basic_street-light";
    const styleUrl = `https://api.tomtom.com/style/1/style/${styleVariant}?key=${apiKey}`;

    map.setStyle(styleUrl);
  }, [resolvedTheme]);

  // Center map on location change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    map.setCenter([location.lng, location.lat]);
    map.setZoom(14);
    map.invalidateSize();
  }, [location]);

  // Render workshop markers & popups
  useEffect(() => {
    const map = mapRef.current;
    const tt = ttRef.current;
    if (!map || !tt) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const withCoords = workshops.filter((w) => w.lat != null && w.lng != null);
    if (withCoords.length === 0) return;

    const isDark = resolvedTheme === "dark";

    withCoords.forEach((w) => {
      const el = document.createElement("div");
      el.className =
        "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/30 ring-2 ring-white/20 cursor-pointer transition-transform hover:scale-110";
      el.textContent = w.name.charAt(0).toUpperCase();

      const popup = new tt.Popup({ offset: 25 }).setHTML(`
        <div class="${isDark ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900"} p-3 rounded-xl min-w-[180px] shadow-lg">
          <p class="font-semibold text-sm">${w.name}</p>
          <p class="text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"} mt-1">${w.services.slice(0, 3).join(" · ")}</p>
          <div class="flex items-center gap-2 mt-2 text-xs ${isDark ? "text-zinc-500" : "text-zinc-400"}">
            <span>${w.brand} ${w.model}</span>
            <span>·</span>
            <span>${w.distance}</span>
          </div>
        </div>
      `);

      const marker = new tt.Marker({ element: el })
        .setLngLat([w.lng!, w.lat!])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [workshops, resolvedTheme]);

  return (
    <div className={className}>
      <div
        className={cn(
          "relative h-[420px] w-full overflow-hidden rounded-2xl border shadow-2xl sm:h-[480px] lg:h-[520px]",
          "border-border bg-background shadow-black/10 dark:shadow-black/40"
        )}
      >
        {!ready && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              Loading map...
            </div>
          </div>
        )}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}