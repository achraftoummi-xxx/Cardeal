"use client";

import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { layers, LIGHT, BLACK } from "@protomaps/basemaps";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

const API_KEY = process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY || "";
if (typeof window !== "undefined" && !API_KEY) {
  console.warn("NEXT_PUBLIC_PROTOMAPS_API_KEY is not set. Map tiles will not render.");
}
const TILES_URL = `https://api.protomaps.com/tiles/v4/{z}/{x}/{y}.mvt?key=${API_KEY}`;
const GLYPHS_URL = `https://api.protomaps.com/glyphs/v2/{fontstack}/{range}.pbf?key=${API_KEY}`;
const ATTRIBUTION =
  '&copy; <a href="https://protomaps.com">Protomaps</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>';
const SPRITE_URL = "/api/sprite/sprite";

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

function buildStyle(flavor: typeof LIGHT): maplibregl.StyleSpecification {
  const sourceId = "protomaps";
  return {
    version: 8,
    name: `Protomaps ${flavor === LIGHT ? "light" : "dark"}`,
    sources: {
      [sourceId]: {
        type: "vector",
        tiles: [TILES_URL],
        maxzoom: 15,
        attribution: ATTRIBUTION,
      },
    },
    glyphs: GLYPHS_URL,
    sprite: SPRITE_URL,
    layers: layers(sourceId, flavor, { lang: "en" }),
  };
}

const LIGHT_STYLE = buildStyle(LIGHT);
const BLACK_STYLE = buildStyle(BLACK);

export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mapElement.current || !mounted) return;
    const el = mapElement.current;
    const observer = new ResizeObserver(() => {
      mapInstance.current?.resize();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return;

    try {
      const center = location ? [location.lng, location.lat] : DEFAULT_CENTER;
      const zoom = location ? 14 : DEFAULT_ZOOM;
      const style = resolvedTheme === "dark" ? BLACK_STYLE : LIGHT_STYLE;

      mapInstance.current = new maplibregl.Map({
        container: mapElement.current,
        center: center as [number, number],
        zoom,
        style,
      });

      mapInstance.current.addControl(new maplibregl.NavigationControl(), "top-left");

      mapInstance.current.on("load", () => {
        mapInstance.current?.resize();
      });

      mapInstance.current.on("error", (e) => {
        if (e.error?.status === 404) return;
        if (e.error?.status === 403) {
          console.warn("Protomaps tile 403 — verify API key and CORS whitelist");
          return;
        }
        console.error("Map error:", e.error);
      });
    } catch (err) {
      console.error("Error initializing map:", err);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    const style = resolvedTheme === "dark" ? BLACK_STYLE : LIGHT_STYLE;
    mapInstance.current.setStyle(style);
  }, [resolvedTheme]);

  useEffect(() => {
    if (!mapInstance.current || !location) return;
    try {
      mapInstance.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        essential: true,
      });
    } catch (err) {
      console.warn("Failed to flyTo location:", err);
    }
  }, [location]);

  useEffect(() => {
    if (!mapInstance.current) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const withCoords = workshops.filter((w) => w.lat != null && w.lng != null);

    withCoords.forEach((w) => {
      if (!w.lng || !w.lat) return;

      const markerElement = document.createElement("div");
      markerElement.className =
        "flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/30 ring-2 ring-white cursor-pointer transition-transform hover:scale-110";
      markerElement.textContent = w.name.charAt(0).toUpperCase();

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div class="${resolvedTheme === "dark" ? "bg-zinc-900 text-zinc-100" : "bg-white text-zinc-900"} p-3 rounded-xl min-w-[180px] shadow-lg">
          <p class="font-semibold text-sm">${w.name}</p>
          <p class="text-xs ${resolvedTheme === "dark" ? "text-zinc-400" : "text-zinc-500"} mt-1">${w.services.slice(0, 3).join(" · ")}</p>
          <div class="flex items-center gap-2 mt-2 text-xs ${resolvedTheme === "dark" ? "text-zinc-500" : "text-zinc-400"}">
            <span>${w.brand} ${w.model}</span>
            <span>·</span>
            <span>${w.distance}</span>
          </div>
        </div>
      `);

      const newMarker = new maplibregl.Marker({ element: markerElement })
        .setLngLat([w.lng, w.lat])
        .setPopup(popup)
        .addTo(mapInstance.current!);

      markersRef.current.push(newMarker);
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
        <div ref={mapElement} className="absolute inset-0 h-full w-full" />
      </div>
      <style jsx global>{`
        .maplibregl-ctrl-bottom-right,
        .maplibregl-ctrl-top-left {
          opacity: 0.3;
          transition: opacity 0.25s ease-in-out;
        }
        .maplibregl-map:hover .maplibregl-ctrl-bottom-right,
        .maplibregl-map:hover .maplibregl-ctrl-top-left {
          opacity: 1;
        }
        .maplibregl-ctrl-attrib {
          background: transparent !important;
          box-shadow: none !important;
          font-size: 10px;
        }
        .maplibregl-ctrl-attrib-button {
          display: none !important;
        }
        .maplibregl-ctrl-attrib-inner {
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
