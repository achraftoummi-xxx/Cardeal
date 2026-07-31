"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslation } from "./TranslationProvider";

const themeOptions = [
  { value: "light" as const, icon: Sun },
  { value: "dark" as const, icon: Moon },
  { value: "system" as const, icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-9 animate-pulse rounded-lg bg-muted" />;
  }

  const current = themeOptions.find((o) => o.value === theme) ?? themeOptions[2];
  const CurrentIcon = current.icon;

  const handleSelect = (value: (typeof themeOptions)[number]["value"]) => {
    setTheme(value);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={t("theme.selectorAria")}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-9 items-center justify-center rounded-lg border border-zinc-700/50 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/30 dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-700/30"
      >
        <CurrentIcon size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-zinc-700/50 bg-white py-1 shadow-2xl shadow-black/40 backdrop-blur-xl dark:bg-zinc-900/95"
        >
          {themeOptions.map(({ value, icon: Icon }) => {
            const isActive = value === theme;
            return (
              <button
                key={value}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
                }`}
              >
                <Icon size={14} />
                <span className="flex-1">{t(`theme.${value}`)}</span>
                {isActive && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
