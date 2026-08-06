"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "./TranslationProvider";

const locales: Record<string, { label: string; flag: string }> = {
  en: { label: "En", flag: "/assets/flags/gb.svg" },
  fr: { label: "Fr", flag: "/assets/flags/fr.svg" },
  ar: { label: "Ar", flag: "/assets/flags/sa.svg" },
  es: { label: "Es", flag: "/assets/flags/es.svg" },
  it: { label: "It", flag: "/assets/flags/it.svg" },
  de: { label: "De", flag: "/assets/flags/de.svg" },
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
        className="flex items-center gap-2 rounded-lg border border-zinc-700/50 bg-white px-2.5 py-1.5 text-sm text-zinc-700 shadow-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/30 dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-700/30"
      >
        <div className="h-4 w-5 overflow-hidden rounded-sm">
          <img src={current.flag} alt={current.label} draggable={false} className="h-full w-full object-cover" />
        </div>
        <span>{current.label}</span>
        <svg
          className={`h-3 w-3 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-32 overflow-hidden rounded-xl border border-zinc-700/50 bg-white py-1 shadow-2xl shadow-black/40 backdrop-blur-xl dark:bg-zinc-900/95">
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
                    ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                }`}
              >
                <div className="h-3.5 w-5 overflow-hidden rounded-sm">
                  <img src={locales[l].flag} alt={locales[l].label} draggable={false} className="h-full w-full object-cover" />
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
