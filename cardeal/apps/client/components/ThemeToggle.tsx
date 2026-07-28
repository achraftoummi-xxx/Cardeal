"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] p-1 shadow-sm" role="radiogroup" aria-label="Theme selection">
      {(["light", "dark", "system"] as const).map((t) => {
        const label = t === "light" ? "☀️" : t === "dark" ? "🌙" : "🖥";
        return (
          <button
            key={t}
            role="radio"
            aria-checked={theme === t}
            aria-label={`${t} mode`}
            onClick={() => setTheme(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              theme === t
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}