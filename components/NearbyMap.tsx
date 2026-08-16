"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import { ExternalLink } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { localized } from "@/lib/i18n";
import { googleMapsUrl } from "@/lib/partners";
import StadiaBasemap from "./StadiaBasemap";
import CarBrandLogo from "./CarBrandLogo";

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

  /* Custom repair-shop marker: 40x40 pin whose bottom-center point
     sits exactly on the geographic coordinate. Served as a static
     asset from the public/ directory. */
  const workshopIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/assets/icons/car-repair.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      }),
    []
  );

  /* Custom user-position marker: 36x36 pin whose bottom-center point
     sits exactly on the user's coordinates. */
  const userIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/assets/icons/pin-map.png",
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
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
          <StadiaBasemap />

          <MapController target={target} />
          <AutoLocate enabled={!location} onLocated={setUserCoords} />

          {/* User location marker */}
          {target && <Marker position={target} icon={userIcon} />}

          {/* Workshop markers */}
          {withCoords.map((w) =>
            w.lat != null && w.lng != null ? (
              <Marker key={w.name} position={[w.lat, w.lng]} icon={workshopIcon}>
                <Popup>
                  <div className="p-1">
                    <p className="text-sm font-semibold">{w.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {w.services.map((s) => localized(t, "serviceCat", s)).slice(0, 3).join(" · ")}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="flex h-5 w-9 shrink-0 items-center justify-center">
                          <CarBrandLogo name={w.brand} className="h-4 w-auto max-w-[32px]" />
                        </span>
                        <span>
                          {w.brand} {w.model}
                        </span>
                      </span>
                      <span>·</span>
                      <span>{w.distance}</span>
                    </div>
                    <a
                      href={googleMapsUrl(w.lat, w.lng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
                    >
                      <ExternalLink size={12} />
                      {t("partnerCard.checkOnGoogleMaps")}
                    </a>
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
