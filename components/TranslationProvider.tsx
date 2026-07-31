"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import de from "../locales/de.json";

type Translations = { [k: string]: string | Record<string, any> };

const resources: Record<string, Translations> = { en, fr, ar, es, it, de };

type I18nContextValue = {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  // Default application language is French (fr).
  const [locale, setLocale] = useState<string>("fr");

  // After mount, restore the previously saved locale if it is still supported.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("locale");
      if (stored && resources[stored] && stored !== locale) setLocale(stored);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist locale changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch (e) {}
  }, [locale]);

  // Keep <html lang> and text direction in sync with the active locale.
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
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
