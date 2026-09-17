"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Key } from "lucide-react";
export default function ApiAccessPage() {
  return (
    <FeatureGate featureId="api_access">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-500/20 text-zinc-400"><Key size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">API Access</h1>
            <p className="text-xs text-muted-foreground">API keys and developer access</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">API access management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
