"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type BrandSelectGroup = {
  label: string;
  countries: { name: string; flag: string; brands: string[] }[];
};

export default function BrandSelect({
  label,
  value,
  groups,
  onChange,
  placeholder,
  renderBrand,
}: {
  label: string;
  value: string;
  groups: BrandSelectGroup[];
  onChange: (v: string) => void;
  placeholder?: string;
  renderBrand?: (brand: string) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  const fieldId = `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const selected = groups.flatMap((g) => g.countries).flatMap((c) => c.brands).find((o) => o === value);

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          id={fieldId}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex w-full max-sm:min-h-12 items-center justify-between gap-2 rounded-xl border border-border bg-background px-4 py-3 text-left text-sm shadow-sm outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
            !value && "text-muted-foreground/70"
          )}
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-2">
              <span className="truncate font-medium text-foreground">
                {renderBrand ? renderBrand(selected) : selected}
              </span>
            </span>
          ) : (
            <span>{placeholder ?? ""}</span>
          )}
          <svg className="h-4 w-4 shrink-0 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-30 mt-2 max-h-80 w-full min-w-64 overflow-y-auto rounded-xl border border-border bg-background p-1 shadow-xl">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-[var(--cardeal-primary)]">
                  {group.label}
                </p>
                {group.countries.map((country) => (
                  <div key={country.name}>
                    <p className="flex items-center gap-2 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {country.flag ? (
                        <img
                          src={country.flag}
                          alt=""
                          draggable={false}
                          className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover"
                        />
                      ) : null}
                      {country.name}
                    </p>
                    {country.brands.map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={option === value}
                        onClick={() => {
                          onChange(option);
                          setOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-lg px-3 py-2 pl-6 text-left text-sm text-foreground transition-colors hover:bg-accent",
                          option === value && "bg-accent font-semibold"
                        )}
                      >
                        <span className="truncate">
                          {renderBrand ? renderBrand(option) : option}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
