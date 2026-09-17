"use client";

import React from "react";
import { Plug, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

const INTEGRATIONS = [
  { id: "stripe", name: "Stripe", description: "Accept online payments via credit/debit cards", connected: true },
  { id: "quickbooks", name: "QuickBooks", description: "Sync invoices and accounting data", connected: false },
  { id: "whatsapp", name: "WhatsApp Business", description: "Send appointment reminders and quotes via WhatsApp", connected: true },
  { id: "google_calendar", name: "Google Calendar", description: "Sync appointments with Google Calendar", connected: false },
  { id: "google_maps", name: "Google Maps", description: "Embed your business location on the map", connected: true },
];

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Plug size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Integrations
            </h1>
            <p className="text-xs text-muted-foreground">
              Connect third-party services and sync status
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {INTEGRATIONS.map((intg) => (
          <div
            key={intg.id}
            className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-4 shadow-sm"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              intg.connected
                ? "bg-emerald-500/20 text-emerald-500"
                : "bg-muted text-muted-foreground"
            }`}>
              {intg.connected ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{intg.name}</p>
              <p className="text-[11px] text-muted-foreground">{intg.description}</p>
            </div>
            <button
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                intg.connected
                  ? "border border-border bg-secondary text-foreground hover:bg-accent"
                  : "bg-emerald-500 text-white hover:bg-emerald-600"
              }`}
            >
              {intg.connected ? "Configure" : "Connect"}
              <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
