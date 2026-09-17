"use client";

import React from "react";
import { Clock, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

const DAYS_KEYS = [
  "business.settings.hours.days.monday",
  "business.settings.hours.days.tuesday",
  "business.settings.hours.days.wednesday",
  "business.settings.hours.days.thursday",
  "business.settings.hours.days.friday",
  "business.settings.hours.days.saturday",
  "business.settings.hours.days.sunday",
];

export default function HoursSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Clock size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.hours.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.hours.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {DAYS_KEYS.map((dayKey, i) => (
          <div
            key={dayKey}
            className={`flex items-center gap-4 px-6 py-4 ${
              i < DAYS_KEYS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span className="w-28 text-sm font-medium text-foreground">{t(dayKey)}</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="time"
                defaultValue="08:00"
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              />
              <span className="text-xs text-muted-foreground">{t("business.settings.hours.to")}</span>
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
              <span className="text-xs text-muted-foreground">{t("business.settings.hours.open")}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.hours.save")}
        </Button>
      </div>
    </div>
  );
}
