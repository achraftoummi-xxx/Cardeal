"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { useTranslation } from "@/components/TranslationProvider";
import { Receipt } from "lucide-react";
export default function InvoicesPage() {
  const { t } = useTranslation();
  return (
    <FeatureGate featureId="invoices">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20 text-orange-500"><Receipt size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">{t("business.features.invoices")}</h1>
            <p className="text-xs text-muted-foreground">{t("business.features.invoicesDesc")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{t("business.stub.comingSoon", { module: t("business.features.invoices") })}</p>
        </div>
      </div>
    </FeatureGate>
  );
}
