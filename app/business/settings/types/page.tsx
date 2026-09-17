"use client";

import React from "react";
import { Layers, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";

export default function TypesSettingsPage() {
  const { verticals } = useBusiness();

  const ALL_VERTICALS = [
    { id: "workshop", label: "Workshop / Garage", description: "General automotive repair and maintenance" },
    { id: "tire_shop", label: "Tire Shop", description: "Tire sales, mounting, and balancing" },
    { id: "body_shop", label: "Body Shop", description: "Collision repair, painting, and bodywork" },
    { id: "dealership", label: "Dealership", description: "New and used vehicle sales" },
    { id: "rental", label: "Car Rental", description: "Vehicle rental and fleet management" },
    { id: "mobile_mechanic", label: "Mobile Mechanic", description: "On-site repair and roadside assistance" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Layers size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Business Types
            </h1>
            <p className="text-xs text-muted-foreground">
              Your registered verticals and their approval status
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ALL_VERTICALS.map((v) => {
          const active = verticals.includes(v.id as typeof verticals[number]);
          return (
            <div
              key={v.id}
              className={`flex items-center gap-4 rounded-xl border px-4 py-4 transition-colors ${
                active
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border bg-secondary/30 opacity-60"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  active
                    ? "bg-emerald-500/20 text-emerald-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {active ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{v.label}</p>
                <p className="text-[11px] text-muted-foreground">{v.description}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  active
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {active ? "Active" : "Inactive"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
