"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { BarChart3 } from "lucide-react";
export default function AnalyticsPage() {
  return (
    <FeatureGate featureId="analytics">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-500"><BarChart3 size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Analytics</h1>
            <p className="text-xs text-muted-foreground">Business performance analytics</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Analytics dashboard coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
