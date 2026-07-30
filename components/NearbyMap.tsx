"use client";

import { MapPin } from "lucide-react";
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

export default function NearbyMap({ location, workshops, className = "" }: Props) {
  const withCoords = workshops.filter((w) => w.lat != null && w.lng != null);

  return (
    <div className={className}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center h-[420px] w-full overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card/50 p-6 text-center shadow-lg backdrop-blur-xl sm:h-[480px] sm:p-8 lg:h-[520px]"
        )}
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20">
          <MapPin size={32} />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">Map Placeholder — Ready for Protomaps</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          {location
            ? `Centered around ${location.label} (${location.lat.toFixed(4)}, ${location.lng.toFixed(4)})`
            : "Select a location or activate geolocation to display nearby workshops."}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 ring-1 ring-blue-500/20">
            {withCoords.length} Workshops Available
          </span>
          {location && (
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 ring-1 ring-emerald-500/20">
              Active Pin Set
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
