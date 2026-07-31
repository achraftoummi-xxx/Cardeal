"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useTranslation } from "./TranslationProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-32 animate-pulse rounded-full bg-muted" />;
  }

  const options = [
    { value: "light" as const, label: t("theme.light"), icon: Sun },
    { value: "dark" as const, label: t("theme.dark"), icon: Moon },
    { value: "system" as const, label: t("theme.system"), icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1 shadow-sm" role="radiogroup" aria-label={t("theme.selectorAria")}>
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          role="radio"
          aria-checked={theme === value}
          aria-label={t("theme.mode", { label })}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            theme === value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Icon size={14} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
