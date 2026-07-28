"use client";

import React from "react";
import { useTranslation } from "./TranslationProvider";

const locales: Record<string, { label: string; code: string }> = {
  en: { label: "En", code: "GB" },
  fr: { label: "Fr", code: "FR" },
  ar: { label: "Ar", code: "SA" },
};

import Flag from "react-world-flags";

export default function LanguageSelector({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  const current = locales[locale] || locales.en;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="w-5 h-4 overflow-hidden rounded-sm">
        <Flag code={current.code} style={{ width: 20, height: 14 }} />
      </div>
      <select
        aria-label="Select language"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="border border-[var(--border)] rounded-md px-2 py-1 bg-[var(--background)] text-[var(--foreground)] text-sm"
      >
        {Object.keys(locales).map((l) => (
          <option key={l} value={l}>
            {locales[l].label}
          </option>
        ))}
      </select>
    </div>
  );
}
