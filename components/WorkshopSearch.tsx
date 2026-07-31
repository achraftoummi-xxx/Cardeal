"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, MapPin, ChevronDown, SlidersHorizontal } from "lucide-react";
import LocationBar from "@/components/LocationBar";
import { useTranslation } from "@/components/TranslationProvider";
import { localized } from "@/lib/i18n";

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

export const SERVICE_CATEGORIES: string[] = [
  "Oil Change",
  "Engine Oil Replacement",
  "Oil Filter Replacement",
  "Air Filter Replacement",
  "Fuel Filter Replacement",
  "Cabin Filter Replacement",
  "Brake Pads Replacement",
  "Brake Disc Replacement",
  "Brake Fluid Change",
  "Brake Inspection",
  "Battery Replacement",
  "Battery Diagnosis",
  "Alternator Repair",
  "Starter Motor Repair",
  "Engine Diagnostics",
  "Check Engine Light Diagnosis",
  "Engine Repair",
  "Engine Tune-Up",
  "Spark Plug Replacement",
  "Ignition Coil Replacement",
  "Timing Belt Replacement",
  "Timing Chain Replacement",
  "Clutch Replacement",
  "Clutch Repair",
  "Transmission Service",
  "Transmission Repair",
  "Gearbox Oil Change",
  "Coolant Change",
  "Radiator Repair",
  "Cooling System Repair",
  "Thermostat Replacement",
  "Water Pump Replacement",
  "AC Service",
  "AC Recharge",
  "AC Repair",
  "Suspension Repair",
  "Shock Absorber Replacement",
  "Strut Replacement",
  "Wheel Alignment",
  "Wheel Balancing",
  "Tire Replacement",
  "Tire Repair",
  "TPMS Service",
  "Steering Repair",
  "Power Steering Service",
  "Exhaust Repair",
  "Catalytic Converter Repair",
  "Muffler Replacement",
  "AdBlue Service",
  "DPF Cleaning",
  "Turbo Repair",
  "Injector Cleaning",
  "Fuel System Cleaning",
  "Car Inspection",
  "Vehicle Maintenance",
  "Electrical Diagnosis",
  "Sensor Replacement",
  "ECU Diagnostics",
  "Software Update",
  "Body Repair",
  "Paint Repair",
  "Windshield Replacement",
  "Glass Repair",
  "Interior Repair",
  "Other",
];

const ENGINE_OPTIONS = ["Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "LPG", "CNG"];
const CYLINDER_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

type Props = {
  brandModels: Record<string, string[]>;
  workshops: Workshop[];
  onLocationChange?: (location: { lat: number; lng: number; label: string } | null) => void;
  onResultsFiltered?: (results: Workshop[]) => void;
};

export default function WorkshopSearch({ brandModels, workshops, onLocationChange, onResultsFiltered }: Props) {
  const { t } = useTranslation();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [engine, setEngine] = useState("");
  const [capacity, setCapacity] = useState("");
  const [cylinders, setCylinders] = useState("");
  const [query, setQuery] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");

  /* ---- advanced filters accordion (mobile only) ---- */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const activeFilterCount = [brand, model, year, engine, capacity, cylinders, serviceCategory].filter(Boolean).length;

  const models = useMemo(() => {
    if (!brand) return [];
    return [...(brandModels[brand] ?? [])].sort();
  }, [brand, brandModels]);

  const capacities = useMemo(() => ["", ...Array.from({ length: 81 }, (_, i) => ((5 + i) / 10).toFixed(1) + "L")], []);
  const engineOptions = useMemo(
    () => [
      { value: "", label: t("filters.any") },
      ...ENGINE_OPTIONS.map((v) => ({ value: v, label: localized(t, "engines", v) })),
    ],
    [t]
  );
  const cylindersOptions = useMemo(
    () => [
      { value: "", label: t("filters.any") },
      ...CYLINDER_COUNTS.map((c) => ({
        value: `${c} Cylinder${c > 1 ? "s" : ""}`,
        label: t(c === 1 ? "filters.cylinderOne" : "filters.cylindersMany", { count: c }),
      })),
    ],
    [t]
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
      if (serviceCategory) {
        const svc = serviceCategory.toLowerCase();
        const matches = w.services.some((s) => {
          const ws = s.toLowerCase();
          return ws.includes(svc) || svc.includes(ws);
        });
        if (!matches) return false;
      }
      return true;
    });
  }, [query, brand, model, year, engine, capacity, cylinders, serviceCategory, workshops]);

  useEffect(() => {
    onResultsFiltered?.(results);
  }, [results, onResultsFiltered]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-xl sm:p-8">
      <LocationBar onLocationChange={onLocationChange} className="mb-4 sm:mb-6" />

      {/* Advanced filters toggle (mobile only — always expanded on sm+) */}
      <div className="mb-4 sm:hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          aria-expanded={showAdvanced}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground shadow-inner shadow-black/5 dark:shadow-black/10 transition-colors hover:bg-muted"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-blue-500" />
            {t("filters.advanced")}
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown
            size={16}
            className={`text-zinc-500 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Vehicle filters + service category (collapsible on mobile, always visible on sm+) */}
      <div className={showAdvanced ? "block" : "hidden sm:block"}>
        {/* Filter grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Select
            label={t("filters.brand")}
            value={brand}
            onChange={(v) => { setBrand(v); setModel(""); }}
            options={["", ...Object.keys(brandModels).sort()]}
            anyLabel={t("filters.any")}
          />
          <Select label={t("filters.model")} value={model} onChange={setModel} options={["", ...models]} anyLabel={t("filters.any")} />
          <Select
            label={t("filters.year")}
            value={year}
            onChange={setYear}
            options={["", ...Array.from({ length: 2026 - 1960 + 1 }, (_, i) => String(2026 - i))]}
            anyLabel={t("filters.any")}
          />
          <Select
            label={t("filters.engine")}
            value={engine}
            onChange={setEngine}
            options={engineOptions}
          />
          <Select label={t("filters.capacity")} value={capacity} onChange={setCapacity} options={capacities} anyLabel={t("filters.any")} />
          <Select label={t("filters.cylinders")} value={cylinders} onChange={setCylinders} options={cylindersOptions} />
        </div>

        {/* Service category combobox (searchable, custom values allowed) */}
        <div className="mt-4 sm:mt-6">
          <ServiceCategorySelect value={serviceCategory} onChange={setServiceCategory} />
        </div>
      </div>

      {/* Search input */}
      <div className="mt-4">
        <label htmlFor="service-search-input" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
          {t("search.services")}
        </label>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-2 shadow-inner shadow-black/5 dark:shadow-black/10 sm:px-5">
          <input
            id="service-search-input"
            name="serviceQuery"
            className="flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.keywordPlaceholder")}
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-zinc-500 transition-colors hover:text-zinc-300" aria-label={t("location.clear")}>
              <X size={18} />
            </button>
          )}
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95">
            <Search size={16} />
            <span className="hidden sm:inline">{t("search.search")}</span>
          </button>
        </div>
      </div>

      {/* Workshop results */}
      <div className="mt-4 border-t border-zinc-800/60 pt-4 sm:mt-6 sm:pt-5">
        <p className="mb-4 text-sm text-muted-foreground">
          {results.length
            ? results.length === 1
              ? t("results.workshopNearby", { count: results.length })
              : t("results.workshopsNearby", { count: results.length })
            : t("results.noWorkshops")}
        </p>

        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible">
          {results.map((w) => (
            <div
              key={w.name}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-border bg-card/50 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/30 hover:bg-accent hover:shadow-md sm:gap-3 sm:px-4 sm:py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {w.services.map((s) => localized(t, "serviceCat", s)).slice(0, 2).join(", ")}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500 ring-1 ring-blue-500/20">
                {w.distance}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <MapPin size={14} />
          {t("results.help")}
        </div>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  anyLabel = "Any",
}: {
  label: string;
  value: string;
  options: string[] | { value: string; label: string }[];
  onChange: (v: string) => void;
  anyLabel?: string;
}) {
  const fieldId = `select-${label.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={fieldId} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          name={label.toLowerCase()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
        >
          {options.map((o) => {
            const v = typeof o === "string" ? o : o.value;
            const display = typeof o === "string" ? o || anyLabel : v ? o.label : anyLabel;
            return (
              <option key={v} value={v} className="bg-card text-foreground">
                {display}
              </option>
            );
          })}
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

function ServiceCategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICE_CATEGORIES.filter((o) => !q || o.toLowerCase().includes(q));
  }, [query]);

  const handleFocus = () => {
    setQuery(value);
    setOpen(true);
  };

  const handleChange = (v: string) => {
    setQuery(v);
    setOpen(true);
  };

  const handleBlur = () => {
    const q = query.trim();
    if (q && q !== value) onChange(q);
    setOpen(false);
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setQuery("");
    setOpen(false);
  };

  return (
    <div>
      <label htmlFor="service-category-select" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
        {t("search.serviceCategory")}
      </label>
      <div className="relative">
        <input
          id="service-category-select"
          name="serviceCategory"
          role="combobox"
          aria-expanded={open}
          aria-controls="service-category-options"
          autoComplete="off"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
          value={open ? query : value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={t("search.servicePlaceholder")}
        />
        {open && query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 transition-colors hover:text-zinc-300"
            aria-label={t("search.clearServiceCategory")}
          >
            <X size={18} />
          </button>
        ) : (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
        {open && (
          <ul
            id="service-category-options"
            role="listbox"
            className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card py-1 shadow-lg shadow-black/10 dark:shadow-black/40"
          >
            {filtered.map((option) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
                className="cursor-pointer px-4 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-blue-500"
              >
                {localized(t, "serviceCat", option)}
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-muted-foreground">
                {t("search.noServiceMatches")}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
