"use client";

import React from "react";
import { MapPin, Plus, Navigation } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { Button } from "@/components/ui/button";

export default function LocationsSettingsPage() {
  const { partner } = useBusiness();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
              <MapPin size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
                Locations
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage branches, addresses, and geo coordinates
              </p>
            </div>
          </div>
          <Button variant="primary" className="flex items-center gap-1.5 text-xs">
            <Plus size={14} />
            Add Location
          </Button>
        </div>
      </div>

      {/* Primary location */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            Primary
          </span>
          <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
            Main Branch
          </h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0" />
            {partner?.address || "No address set"}
          </p>
          <p className="flex items-center gap-2">
            <Navigation size={14} className="shrink-0" />
            {partner?.city || "—"}, {partner?.zip_code || "—"}
          </p>
          {partner?.latitude && partner?.longitude && (
            <p className="text-[11px] text-muted-foreground/70 font-mono">
              {partner.latitude}, {partner.longitude}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
        <MapPin size={24} className="mx-auto text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground">
          Add additional branch locations to expand your service area
        </p>
      </div>
    </div>
  );
}
