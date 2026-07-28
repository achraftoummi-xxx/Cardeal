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
      if (
        q &&
        !(w.name.toLowerCase().includes(q) || w.services.some((s) => s.toLowerCase().includes(q)))
      ) {
        return false;
      }

      if (brand && w.brand.toLowerCase() !== brand.toLowerCase()) {
        return false;
      }

      if (model && w.model.toLowerCase() !== model.toLowerCase()) {
        return false;
      }

      if (year && w.year !== year) {
        return false;
      }

      if (engine && w.engine.toLowerCase() !== engine.toLowerCase()) {
        return false;
      }

      if (capacity && w.capacity !== capacity) {
        return false;
      }

      if (cylinders && (w as any).cylinders !== cylinders) {
        return false;
      }

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
    <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-[var(--border)] bg-[var(--background)] p-8 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-full border border-[var(--border)] bg-[var(--muted)] px-6 py-2">
        <div className="flex flex-1 items-center gap-2 text-sm">
          <span
            className={`h-2.5 w-2.5 rounded-full ${locationActive ? "bg-emerald-500" : "bg-[var(--border)]"}`}
          />
          {locationActive ? "Location active" : "Location not activated"}
        </div>

        <button
          onClick={activateLocation}
          className="rounded-full border border-[var(--border)] bg-[var(--background)] px-5 py-2 text-sm hover:bg-[var(--accent)]"
        >
          {locationActive ? "Update location" : "Activate location"}
        </button>

        <span className="rounded-full bg-[var(--muted)] px-4 py-1 text-xs text-[var(--muted-foreground)]">
          {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "—"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
        <Select
          label="Brand"
          value={brand}
          onChange={(v) => {
            setBrand(v);
            setModel("");
          }}
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

      <div className="mt-6 flex items-center rounded-full border border-[var(--border)] bg-[var(--muted)] px-6 py-2">
        <input
          className="flex-1 bg-transparent outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Service keyword (e.g. brake, oil, battery)"
        />

        {query && (
          <button onClick={() => setQuery("")} className="mr-2">
            <X size={18} />
          </button>
        )}

        <button className="flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-[var(--primary-foreground)]">
          <Search size={18} />
          Search
        </button>
      </div>

      <div className="mt-6 border-t pt-5">
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          {results.length ? `${results.length} workshop${results.length > 1 ? "s" : ""} nearby` : "No workshops found"}
        </p>

        <div className="flex flex-wrap gap-3">
          {results.map((w) => (
            <div key={w.name} className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2">
              <span>{w.name}</span>
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs text-[var(--card-foreground)]">{w.distance}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t pt-4 text-xs text-[var(--muted-foreground)]">
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
      <label className="mb-1 block text-xs uppercase text-[var(--muted-foreground)]">{label}</label>

      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-full border border-[var(--border)] bg-[var(--muted)] px-4 py-2 text-sm text-[var(--foreground)]">
        {options.map((o) => (
          <option key={o} value={o}>
            {o || "Any"}
          </option>
        ))}
      </select>
    </div>
  );
}
