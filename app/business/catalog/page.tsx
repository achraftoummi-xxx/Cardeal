"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { Package } from "lucide-react";
export default function CatalogPage() {
  return (
    <FeatureGate featureId="catalog">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-500"><Package size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">Catalog</h1>
            <p className="text-xs text-muted-foreground">Parts and services catalog</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Catalog management coming soon.</p>
        </div>
      </div>
    </FeatureGate>
  );
}
