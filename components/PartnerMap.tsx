"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { useTranslation } from "./TranslationProvider";
import { partnerDistanceKm, type Partner } from "@/lib/partners";
import StadiaBasemap from "./StadiaBasemap";

type Props = {
  location: { lat: number; lng: number; label: string } | null;
  partners: Partner[];
  activePartnerId?: string | null;
  onPartnerSelect?: (id: string) => void;
  revalidateKey?: string | number;
  className?: string;
};

const TUNIS_CENTER: [number, number] = [36.8065, 10.1815];
const DEFAULT_ZOOM = 13;
const USER_ZOOM = 14;
const PARTNER_ZOOM = 15;

/* ------------------------------------------------------------------ */
/*  Map controller: fly to the target when location/user changes       */
/* ------------------------------------------------------------------ */
function MapController({
  target,
  revalidateKey,
}: {
  target: [number, number] | null;
  revalidateKey?: string | number;
}) {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [map, revalidateKey]);

  useEffect(() => {
    if (!target) return;
    map.flyTo(target, Math.max(map.getZoom(), USER_ZOOM), { duration: 1 });
  }, [map, target]);

  return null;
}

function ActivePartnerFocus({
  activeId,
  markerRefs,
}: {
  activeId: string | null;
  markerRefs: React.MutableRefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();

  useEffect(() => {
    if (!activeId) return;
    const marker = markerRefs.current[activeId];
    if (!marker) return;
    map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), PARTNER_ZOOM), { duration: 0.8 });
    marker.openPopup();
  }, [activeId, map, markerRefs]);

  return null;
}

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
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocated(coords);
        map.flyTo(coords, USER_ZOOM, { duration: 1.2 });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [enabled, map, onLocated]);

  return null;
}

export default function PartnerMap({
  location,
  partners,
  activePartnerId = null,
  onPartnerSelect,
  revalidateKey,
  className = "",
}: Props) {
  const { t } = useTranslation();
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  const target: [number, number] | null = location
    ? [location.lat, location.lng]
    : userCoords;

  const initialCenter: [number, number] = location
    ? [location.lat, location.lng]
    : TUNIS_CENTER;

  const partnerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "/assets/icons/car-repair.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      }),
    []
  );

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
          "relative h-[300px] w-full overflow-hidden rounded-2xl border shadow-2xl sm:h-[420px] lg:h-[560px]",
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

          <MapController target={target} revalidateKey={revalidateKey} />
          <AutoLocate enabled={!location} onLocated={setUserCoords} />
          <ActivePartnerFocus activeId={activePartnerId} markerRefs={markerRefs} />

          {target && <Marker position={target} icon={userIcon} />}

          {partners.map((p) => {
            if (p.latitude == null || p.longitude == null) return null;
            const distance = partnerDistanceKm(p, location);
            const active = p.id === activePartnerId;
            return (
              <Marker
                key={p.id}
                position={[p.latitude, p.longitude]}
                icon={partnerIcon}
                ref={(m) => {
                  markerRefs.current[p.id] = m;
                }}
                eventHandlers={{
                  click: () => onPartnerSelect?.(p.id),
                }}
              >
                <Popup>
                  <div className="p-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    {p.establishment_type && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {p.establishment_type}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {p.google_rating != null && (
                        <span className="font-medium text-amber-500">
                          ★ {Number(p.google_rating).toFixed(1)}
                        </span>
                      )}
                      {distance != null && (
                        <span>
                          {distance < 1
                            ? t("results.underOneKm")
                            : t("results.km", { count: Math.round(distance) })}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onPartnerSelect?.(p.id)}
                      className={cn(
                        "mt-2 w-full rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500",
                        active && "bg-blue-500"
                      )}
                    >
                      {t("partnerCard.takeAppointment")}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
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
