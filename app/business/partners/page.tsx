"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { useTranslation } from "@/components/TranslationProvider";
import { Handshake } from "lucide-react";
export default function PartnersPage() {
  const { t } = useTranslation();
  return (
    <FeatureGate featureId="partners">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-500"><Handshake size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">{t("business.features.partners")}</h1>
            <p className="text-xs text-muted-foreground">{t("business.features.partnersDesc")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{t("business.stub.comingSoon", { module: t("business.features.partners") })}</p>
        </div>
      </div>
    </FeatureGate>
  );
}
