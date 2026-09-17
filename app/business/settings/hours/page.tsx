"use client";

import React from "react";
import { Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function HoursSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Clock size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Operating Hours
            </h1>
            <p className="text-xs text-muted-foreground">
              Set weekly hours, breaks, holidays, and special overrides
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {DAYS.map((day, i) => (
          <div
            key={day}
            className={`flex items-center gap-4 px-6 py-4 ${
              i < DAYS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-28 text-sm font-medium text-foreground">{day}</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                defaultValue="08:00"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="time"
                defaultValue="17:00"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={i < 6}
                className="h-4 w-4 rounded border-border accent-emerald-500"
              />
              <span className="text-xs text-muted-foreground">Open</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          Save Hours
        </Button>
      </div>
    </div>
  );
}
