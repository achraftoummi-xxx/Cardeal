"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";

type Translations = { [k: string]: string | Record<string, any> };

const resources: Record<string, Translations> = { en, fr, ar };

type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  // Use a stable server/client initial locale to avoid hydration mismatches.
  const [locale, setLocale] = useState<string>("en");

  // After mount, detect saved locale or navigator preference and apply it.
  useEffect(() => {
    let detected = "en";
    try {
      const stored = localStorage.getItem("locale");
      if (stored && resources[stored]) detected = stored;
      else if (typeof navigator !== "undefined") {
        const nav = navigator.language.split("-")[0];
        if (resources[nav]) detected = nav;
      }
    } catch (e) {}
    if (detected !== locale) setLocale(detected);
  }, []);

  // Persist locale changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch (e) {}
  }, [locale]);

  const t = (key: string, vars?: Record<string, string | number>) => {
    const parts = key.split(".");
    let cur: any = resources[locale] || {};
    for (const p of parts) {
      cur = cur?.[p];
      if (cur === undefined) break;
    }
    if (cur === undefined) return key;
    if (typeof cur === "string") {
      let text = cur;
      if (vars) {
        for (const k of Object.keys(vars)) {
          text = text.replace(new RegExp(`\\{${k}\\}`, "g"), String(vars[k]));
        }
      }
      return text;
    }
    // If the resolved value is an object or array, return it as-is so callers can map over it
    return cur;
  };

  const value = useMemo(() => ({ locale, setLocale, t }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
