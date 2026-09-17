"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { useTranslation } from "@/components/TranslationProvider";
import { FileText } from "lucide-react";
export default function QuotesPage() {
  const { t } = useTranslation();
  return (
    <FeatureGate featureId="quotes">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500"><FileText size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">{t("business.features.quotes")}</h1>
            <p className="text-xs text-muted-foreground">{t("business.features.quotesDesc")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{t("business.stub.comingSoon", { module: t("business.features.quotes") })}</p>
        </div>
      </div>
    </FeatureGate>
  );
}
