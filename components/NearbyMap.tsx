"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

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

function getTomTomStyle(isDark: boolean) {
  const key = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
  if (!key) return undefined;
  return isDark
    ? `https://api.tomtom.com/style/1/clone/basic-night.json?key=${key}`
    : `https://api.tomtom.com/style/1/clone/basic-main.json?key=${key}`;
}

export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [ready, setReady] = useState(false);
  const [ttModule, setTtModule] = useState<any>(null);

  useEffect(() => {
    import("@tomtom-international/web-sdk-maps").then((mod) => {
      setTtModule(() => mod.default);
      setReady(true);
    });
    import("@tomtom-international/web-sdk-maps/dist/maps.css");
  }, []);

  useEffect(() => {
    if (!ready || !ttModule || !containerRef.current || mapRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
    if (!apiKey) {
      console.warn("[NearbyMap] TomTom API key (NEXT_PUBLIC_TOMTOM_API_KEY) is not configured — map will not render");
      return;
    }

    ttModule.setProductInfo("Cardeal", "1.0");

    const map = ttModule.map({
      key: apiKey,
      container: containerRef.current,
      center: location ? [location.lng, location.lat] : [2.3522, 48.8566],
      zoom: location ? 14 : 5,
      style: getTomTomStyle(isDark),
    });

    map.addControl(new ttModule.FullscreenControl(), "top-left");
    map.addControl(new ttModule.NavigationControl(), "top-left");

    mapRef.current = map;
  }, [ready, ttModule, location, isDark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    map.setCenter([location.lng, location.lat]);
    map.setZoom(14);
  }, [location]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ttModule) return;

    const token = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
    const styleUrl = getTomTomStyle(isDark);
    if (styleUrl) {
      map.setStyle(styleUrl);
    }
  }, [isDark, ttModule]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ttModule) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const withCoords = workshops.filter((w) => w.lat != null && w.lng != null);
    if (withCoords.length === 0) return;

    withCoords.forEach((w) => {
      const el = document.createElement("div");
      el.className =
        "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/30 ring-2 ring-white/20 cursor-pointer transition-transform hover:scale-110";
      el.textContent = w.name.charAt(0).toUpperCase();

      const popup = new ttModule.Popup({ offset: 25 }).setHTML(`
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

      const marker = new ttModule.Marker({ element: el })
        .setLngLat([w.lng!, w.lat!])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [workshops, ttModule, isDark]);

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
