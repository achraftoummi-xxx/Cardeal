"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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

const DEFAULT_CENTER: [number, number] = [10.1861, 36.8838]; // Ariana / Tunis
const DEFAULT_ZOOM = 12;

export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const { resolvedTheme } = useTheme();

  // Initialize map instance securely on mount
  useEffect(() => {
    if (!mapElement.current || mapInstance.current) return;

    const flavor = resolvedTheme === "dark" ? "black" : "light";
    const apiKey = process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY;

    try {
      const center = location ? [location.lng, location.lat] : DEFAULT_CENTER;
      const zoom = location ? 14 : DEFAULT_ZOOM;

      mapInstance.current = new maplibregl.Map({
        container: mapElement.current,
        center: center as [number, number],
        zoom: zoom,
        style: `https://api.protomaps.com/styles/v5/${flavor}/en.json?key=${apiKey}`,
      });

      mapInstance.current.addControl(new maplibregl.NavigationControl(), "top-left");

      mapInstance.current.on("load", () => {
        console.info("✅ Protomaps map loaded successfully.");
        mapInstance.current?.resize();
      });
    } catch (err) {
      console.error("🔥 Error initializing Protomaps map:", err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Dynamically update theme/style layers instantly without page refreshes
  useEffect(() => {
    if (!mapInstance.current) return;

    const flavor = resolvedTheme === "dark" ? "black" : "light";
    const apiKey = process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY;

    try {
      mapInstance.current.setStyle(`https://api.protomaps.com/styles/v5/${flavor}/en.json?key=${apiKey}`);
    } catch (err) {
      console.error("❌ Failed to update map theme style:", err);
    }
  }, [resolvedTheme]);

  // Center map on location change
  useEffect(() => {
    if (!mapInstance.current || !location) return;
    try {
      mapInstance.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 14,
        essential: true,
      });
    } catch (err) {
      console.warn("⚠️ Failed to flyTo location:", err);
    }
  }, [location]);

  // Dynamically sync markers instantly whenever workshop data changes
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
    </div>
  );
}
