"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Truck } from "lucide-react";
export default function FleetPage() {
  return (
    <FeatureGate featureId="fleet">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-500"><Truck size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Fleet</h1>
            <p className="text-xs text-muted-foreground">Fleet and vehicle management</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Fleet management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
