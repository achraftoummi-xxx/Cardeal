"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MapPin } from "lucide-react";

export type Workshop = {
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
  brandModels: Record<string, string[]>;
  workshops: Workshop[];
  externalLocation?: { lat: number; lng: number } | null;
  onResultsFiltered?: (results: Workshop[]) => void;
};

export default function WorkshopSearch({ brandModels, workshops, externalLocation, onResultsFiltered }: Props) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [query, setQuery] = useState("");

  const [locationActive, setLocationActive] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const effectiveCoords = externalLocation ?? coords;
  const effectiveLocationActive = externalLocation ? true : locationActive;

  const models = useMemo(() => {
    if (!brand) return [];
    return [...(brandModels[brand] ?? [])].sort();
  }, [brand, brandModels]);

  const capacities = useMemo(() => ["", ...Array.from({ length: 81 }, (_, i) => ((5 + i) / 10).toFixed(1) + "L")], []);
  const cylindersOptions = useMemo(
    () => ["", "1 Cylinder", "2 Cylinders", "3 Cylinders", "4 Cylinders", "5 Cylinders", "6 Cylinders", "8 Cylinders", "10 Cylinders", "12 Cylinders", "16 Cylinders"],
    []
  );

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    return workshops.filter((w) => {
      if (q && !(w.name.toLowerCase().includes(q) || w.services.some((s) => s.toLowerCase().includes(q)))) {
        return false;
      }
      if (brand && w.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (model && w.model.toLowerCase() !== model.toLowerCase()) return false;
      if (year && w.year !== year) return false;
      if (engine && w.engine.toLowerCase() !== engine.toLowerCase()) return false;
      if (capacity && w.capacity !== capacity) return false;
      if (cylinders && (w as any).cylinders !== cylinders) return false;
      return true;
    });
  }, [query, brand, model, year, engine, capacity, cylinders, workshops]);

  useEffect(() => {
    onResultsFiltered?.(results);
  }, [results, onResultsFiltered]);

  function activateLocation() {
    if (!navigator.geolocation) {
      setCoords({ lat: 52.52, lng: 13.405 });
      setLocationActive(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationActive(true);
      },
      () => {
        setCoords({ lat: 52.52, lng: 13.405 });
        setLocationActive(true);
      }
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/70 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
      {/* Location bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-5 py-3 shadow-inner shadow-black/10">
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2 w-2 rounded-full ring-1 ring-inset ${effectiveLocationActive ? "bg-emerald-400 ring-emerald-500/30" : "bg-zinc-600 ring-zinc-500/30"}`} />
          <span className="text-zinc-400">
            {effectiveLocationActive ? "Location active" : "Location not activated"}
          </span>
        </div>
        {!externalLocation && (
          <button
            onClick={activateLocation}
            className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 px-4 py-1.5 text-sm text-zinc-300 shadow-sm transition-all hover:bg-zinc-700/50 hover:text-zinc-100"
          >
            {effectiveLocationActive ? "Update location" : "Activate location"}
          </button>
        )}
        {effectiveCoords && (
          <span className="rounded-md bg-zinc-800/50 px-2.5 py-1 text-xs text-zinc-500">
            {effectiveCoords.lat.toFixed(4)}, {effectiveCoords.lng.toFixed(4)}
          </span>
        )}
      </div>

      {/* Filter grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          label="Brand"
          value={brand}
          onChange={(v) => { setBrand(v); setModel(""); }}
          options={["", ...Object.keys(brandModels).sort()]}
        />
        <Select label="Model" value={model} onChange={setModel} options={["", ...models]} />
        <Select
          label="Year"
          value={year}
          onChange={setYear}
          options={["", ...Array.from({ length: 2026 - 1960 + 1 }, (_, i) => String(2026 - i))]}
        />
        <Select
          label="Engine"
          value={engine}
          onChange={setEngine}
          options={["", "Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "LPG", "CNG"]}
        />
        <Select label="Capacity" value={capacity} onChange={setCapacity} options={capacities} />
        <Select label="Cylinders" value={cylinders} onChange={setCylinders} options={cylindersOptions} />
      </div>

      {/* Search input */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 px-4 py-2 shadow-inner shadow-black/10 sm:px-5">
        <input
          className="flex-1 bg-transparent py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Service keyword (e.g. brake, oil, battery)"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-zinc-500 transition-colors hover:text-zinc-300">
            <X size={18} />
          </button>
        )}
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95">
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Workshop results */}
      <div className="mt-6 border-t border-zinc-800/60 pt-5">
        <p className="mb-4 text-sm text-zinc-400">
          {results.length
            ? `${results.length} workshop${results.length > 1 ? "s" : ""} nearby`
            : "No workshops found"}
        </p>

        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {results.map((w) => (
            <div
              key={w.name}
              className="flex shrink-0 items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/30 px-4 py-3 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-zinc-800/50 hover:shadow-md"
            >
              <div>
                <p className="whitespace-nowrap text-sm font-medium text-zinc-100">{w.name}</p>
                <p className="text-xs text-zinc-400">{w.services.slice(0, 2).join(", ")}</p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 ring-1 ring-blue-500/20">
                {w.distance}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-zinc-800/60 pt-4 text-xs text-zinc-500">
          <MapPin size={14} />
          Filters + location help find relevant workshops
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-4 py-3 pr-10 text-sm text-zinc-100 shadow-sm outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-800/80 focus:ring-2 focus:ring-blue-500/20"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-zinc-900 text-zinc-100">{o || "Any"}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
