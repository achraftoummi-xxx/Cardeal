"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme, toggle } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Toggle theme"
        onClick={toggle}
        className="rounded-full border px-3 py-1 text-sm"
      >
        {theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"}
      </button>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as any)}
        className="rounded-full border bg-transparent px-3 py-1 text-sm"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
