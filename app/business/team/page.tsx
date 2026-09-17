"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Users } from "lucide-react";
export default function TeamPage() {
  return (
    <FeatureGate featureId="team">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-500"><Users size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Team</h1>
            <p className="text-xs text-muted-foreground">Team member management</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Team management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
