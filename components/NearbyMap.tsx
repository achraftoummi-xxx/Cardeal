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

  // Initialize map instance once using official built-in protocol style URIs
  useEffect(() => {
    const tt = ttRef.current;
    if (!ready || !tt || !containerRef.current) return;

    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY ?? "";
    if (!apiKey) {
      console.warn("❌ [TomTom Telemetry] TomTom API key is not configured");
      return;
    }

    try {
      tt.setProductInfo("Cardeal", "1.0");

      const center = location ? [location.lng, location.lat] : DEFAULT_CENTER;
      const zoom = location ? 14 : DEFAULT_ZOOM;
      const styleUri = resolvedTheme === "dark" ? "tomtom://vector/1/basic-mono-dark" : "tomtom://vector/1/basic-main";

      console.groupCollapsed(`🗺️ [TomTom Telemetry] Initializing Protocol Style URI`);
      console.log("Resolved Theme:", resolvedTheme);
      console.log("Style URI:", styleUri);
      console.groupEnd();

      const map = tt.map({
        key: apiKey,
        container: containerRef.current,
        center,
        zoom,
        style: styleUri,
      });

      map.addControl(new tt.FullscreenControl(), "top-left");
      map.addControl(new tt.NavigationControl(), "top-left");

      map.on("load", () => {
        console.info("✅ [TomTom Telemetry] Map successfully loaded background tiles and vector layers.");
        try {
          map.invalidateSize();
        } catch {}
      });

      map.on("error", (event: any) => {
        console.error("🚨 [TomTom Telemetry] Map engine error event triggered:", event);
      });

      mapRef.current = map;

      const onResize = () => {
        try {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        } catch {}
      };
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        console.info("🧹 [TomTom Telemetry] Cleaning up map instance.");
        try {
          if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
          }
        } catch {}
      };
    } catch (err) {
      console.error("🔥 [TomTom Telemetry] Exception thrown during map setup:", err);
    }
  }, [ready]);

  // Dynamically update TomTom map style when resolvedTheme changes using built-in protocol style URIs
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    try {
      const styleUri = resolvedTheme === "dark" ? "tomtom://vector/1/basic-mono-dark" : "tomtom://vector/1/basic-main";

      console.groupCollapsed(`🔄 [TomTom Telemetry] Dynamic Style Update (Protocol URI)`);
      console.log("Resolved Theme:", resolvedTheme);
      console.log("Style URI:", styleUri);
      console.groupEnd();

      map.setStyle(styleUri);

      map.once("styledata", () => {
        try {
          map.invalidateSize();
          console.info("✨ [TomTom Telemetry] Protocol style successfully applied and size invalidated.");
        } catch {}
      });
    } catch (err) {
      console.error("❌ [TomTom Telemetry] Failed to update map style via setStyle():", err);
    }
  }, [resolvedTheme]);

  // Center map on location change with safety guard
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;
    try {
      if (typeof map.setCenter === "function" && typeof map.setZoom === "function") {
        map.setCenter([location.lng, location.lat]);
        map.setZoom(14);
        map.invalidateSize();
      }
    } catch (err) {
      console.warn("⚠️ [TomTom Telemetry] Failed to center map on location:", err);
    }
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