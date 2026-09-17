"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Banknote } from "lucide-react";
export default function PayoutsPage() {
  return (
    <FeatureGate featureId="payouts">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-500"><Banknote size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Payouts</h1>
            <p className="text-xs text-muted-foreground">Payment processing and payouts</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Payout management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
