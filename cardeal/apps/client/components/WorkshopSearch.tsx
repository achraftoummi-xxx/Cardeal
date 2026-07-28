"use client";

import { useMemo, useState } from "react";
import { Search, X, MapPin } from "lucide-react";

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
};

type Props = {
  brandModels: Record<string, string[]>;
  workshops: Workshop[];
};

export default function WorkshopSearch({ brandModels, workshops }: Props) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [query, setQuery] = useState("");

  const [locationActive, setLocationActive] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
      {/* Location bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3">
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2 w-2 rounded-full ${locationActive ? "bg-emerald-400" : "bg-slate-600"}`} />
          <span className="text-slate-400">
            {locationActive ? "Location active" : "Location not activated"}
          </span>
        </div>
        <button
          onClick={activateLocation}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-300 transition-colors hover:bg-white/10"
        >
          {locationActive ? "Update location" : "Activate location"}
        </button>
        {coords && (
          <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-slate-500">
            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
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
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 sm:px-5">
        <input
          className="flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-slate-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Service keyword (e.g. brake, oil, battery)"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-slate-500 transition-colors hover:text-white">
            <X size={18} />
          </button>
        )}
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500">
          <Search size={16} />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Workshop results */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="mb-4 text-sm text-slate-400">
          {results.length
            ? `${results.length} workshop${results.length > 1 ? "s" : ""} nearby`
            : "No workshops found"}
        </p>

        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {results.map((w) => (
            <div
              key={w.name}
              className="flex shrink-0 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-blue-500/50 hover:bg-white/10"
            >
              <div>
                <p className="whitespace-nowrap text-sm font-medium text-white">{w.name}</p>
                <p className="text-xs text-slate-400">{w.services.slice(0, 2).join(", ")}</p>
              </div>
              <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-xs font-medium text-blue-300">
                {w.distance}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-500">
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
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-slate-800 text-white">{o || "Any"}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
