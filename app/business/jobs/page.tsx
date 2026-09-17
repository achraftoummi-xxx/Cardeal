"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Hammer } from "lucide-react";
export default function JobsPage() {
  return (
    <FeatureGate featureId="jobs">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500"><Hammer size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Jobs</h1>
            <p className="text-xs text-muted-foreground">Manage your active jobs and bookings</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Job management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
