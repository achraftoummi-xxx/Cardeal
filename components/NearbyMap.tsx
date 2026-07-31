"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L, { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { localized } from "@/lib/i18n";

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

/* Fallback center (Tunis, Tunisia) — used on load and when the user
   denies geolocation access. */
const TUNIS_CENTER: [number, number] = [36.8065, 10.1815];
const DEFAULT_ZOOM = 14;
const USER_ZOOM = 14;

const OSM_TILES = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/* ------------------------------------------------------------------ */
/*  Fly to a target whenever the location/user position changes        */
/* ------------------------------------------------------------------ */
function MapController({ target }: { target: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [map]);

  useEffect(() => {
    if (!target) return;
    map.flyTo(target, Math.max(map.getZoom(), USER_ZOOM), { duration: 1 });
  }, [map, target]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Browser Geolocation: center on the user, fall back to Tunis        */
/* ------------------------------------------------------------------ */
function AutoLocate({
  enabled,
  onLocated,
}: {
  enabled: boolean;
  onLocated: (coords: [number, number]) => void;
}) {
  const map = useMap();
  const ran = useRef(false);

  useEffect(() => {
    if (!enabled || ran.current) return;
    ran.current = true;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        onLocated(coords);
        map.flyTo(coords, USER_ZOOM, { duration: 1.2 });
      },
      () => {
        /* Denied or unavailable — keep the Tunis fallback center. */
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [enabled, map, onLocated]);

  return null;
}

/* ------------------------------------------------------------------ */
/*  Map component                                                      */
/* ------------------------------------------------------------------ */
export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const { t } = useTranslation();
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  /* Explicit search location wins; otherwise the auto-located position;
     otherwise the Tunis fallback. */
  const target: [number, number] | null = location
    ? [location.lat, location.lng]
    : userCoords;

  const initialCenter: [number, number] = location
    ? [location.lat, location.lng]
    : TUNIS_CENTER;

  const withCoords = useMemo(
    () => workshops.filter((w) => w.lat != null && w.lng != null),
    [workshops]
  );

  const workshopIcons = useMemo(() => {
    const icons = new Map<string, L.DivIcon>();
    for (const w of withCoords) {
      icons.set(
        w.name,
        divIcon({
          className: "",
          html: `<div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-lg shadow-blue-500/30 ring-2 ring-white cursor-pointer transition-transform hover:scale-110">${w.name
            .charAt(0)
            .toUpperCase()}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -18],
        })
      );
    }
    return icons;
  }, [withCoords]);

  const userIcon = useMemo(
    () =>
      divIcon({
        className: "",
        html: `<svg width="32" height="32" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3" fill="white" stroke="none"/></svg>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -30],
      }),
    []
  );

  return (
    <div className={className}>
      <div
        className={cn(
          "relative h-[420px] w-full overflow-hidden rounded-2xl border shadow-2xl sm:h-[480px] lg:h-[520px]",
          "border-border bg-background shadow-black/10 dark:shadow-black/40"
        )}
      >
        <MapContainer
          center={initialCenter}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom
          className="absolute inset-0 z-0 h-full w-full"
        >
          <TileLayer url={OSM_TILES} attribution={OSM_ATTRIBUTION} maxZoom={19} />

          <MapController target={target} />
          <AutoLocate enabled={!location} onLocated={setUserCoords} />

          {/* User location marker */}
          {target && <Marker position={target} icon={userIcon} />}

          {/* Workshop markers */}
          {withCoords.map((w) =>
            w.lat != null && w.lng != null ? (
              <Marker
                key={w.name}
                position={[w.lat, w.lng]}
                icon={workshopIcons.get(w.name)}
              >
                <Popup>
                  <div className="p-1">
                    <p className="text-sm font-semibold">{w.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {w.services.map((s) => localized(t, "serviceCat", s)).slice(0, 3).join(" · ")}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {w.brand} {w.model}
                      </span>
                      <span>·</span>
                      <span>{w.distance}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ) : null
          )}
        </MapContainer>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: hsl(var(--background));
          font-family: inherit;
          border-radius: inherit;
        }
        .leaflet-tile-pane {
          filter: none;
        }
        html.dark .leaflet-tile-pane {
          filter: invert(1) hue-rotate(180deg) brightness(0.95) contrast(0.9);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 0;
        }
        .leaflet-popup-close-button {
          padding: 6px 8px 0 0 !important;
          color: hsl(var(--muted-foreground)) !important;
        }
        .leaflet-popup-tip {
          box-shadow: none;
        }
        .leaflet-bar a {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
          border-bottom-color: hsl(var(--border));
        }
        .leaflet-bar a:hover {
          background: hsl(var(--accent));
          color: hsl(var(--accent-foreground));
        }
        html.dark .leaflet-popup-content-wrapper {
          background: hsl(var(--card));
          color: hsl(var(--foreground));
        }
        /* Zoom control – subtle by default, full visibility on hover */
        .leaflet-control-zoom {
          opacity: 0.55;
          transition: opacity 0.2s ease;
        }
        .leaflet-control-zoom:hover {
          opacity: 1;
        }
        .leaflet-control-zoom a {
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        /* Attribution – muted, semi-transparent, readable on hover */
        .leaflet-control-attribution {
          background: rgba(0, 0, 0, 0.35) !important;
          color: rgba(255, 255, 255, 0.45) !important;
          font-size: 10px;
          padding: 0 4px;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .leaflet-control-attribution:hover {
          background: rgba(0, 0, 0, 0.7) !important;
          color: rgba(255, 255, 255, 0.85) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(255, 255, 255, 0.55) !important;
          transition: color 0.2s ease;
        }
        .leaflet-control-attribution:hover a {
          color: rgba(255, 255, 255, 0.9) !important;
        }
      `}</style>
    </div>
  );
}
