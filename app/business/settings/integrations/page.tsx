"use client";

import React from "react";
import { Plug, CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";

const INTEGRATION_IDS = ["stripe", "quickbooks", "whatsapp", "google_calendar", "google_maps"] as const;

export default function IntegrationsSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Plug size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.integrations.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.integrations.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {INTEGRATION_IDS.map((intgId) => {
          const connected = intgId === "stripe" || intgId === "whatsapp" || intgId === "google_maps";
          return (
            <div
              key={intgId}
              className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 shadow-sm"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                connected
                  ? "bg-emerald-500/20 text-emerald-500"
                  : "bg-muted text-muted-foreground"
              }`}>
                {connected ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{t(`business.settings.integrations.items.${intgId}.name`)}</p>
                <p className="text-[11px] text-muted-foreground">{t(`business.settings.integrations.items.${intgId}.description`)}</p>
              </div>
              <button
                className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                  connected
                    ? "border border-border bg-secondary text-foreground hover:bg-accent"
                    : "bg-emerald-500 text-white hover:bg-emerald-600"
                }`}
              >
                {connected ? t("business.settings.integrations.configure") : t("business.settings.integrations.connect")}
                <ExternalLink size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
