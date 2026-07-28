"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "./TranslationProvider";
import Flag from "react-world-flags";

const locales: Record<string, { label: string; code: string }> = {
  en: { label: "En", code: "GB" },
  fr: { label: "Fr", code: "FR" },
  ar: { label: "Ar", code: "SA" },
};

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = locales[locale] || locales.en;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
      >
        <div className="h-4 w-5 overflow-hidden rounded-sm">
          <Flag code={current.code} style={{ width: 20, height: 14 }} />
        </div>
        <span>{current.label}</span>
        <svg
          className={`h-3 w-3 text-[var(--muted-foreground)] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-32 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl">
          {Object.keys(locales).map((l) => {
            const isActive = l === locale;
            return (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <div className="h-3.5 w-5 overflow-hidden rounded-sm">
                  <Flag code={locales[l].code} style={{ width: 20, height: 14 }} />
                </div>
                <span>{locales[l].label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
