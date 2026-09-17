"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { useTranslation } from "@/components/TranslationProvider";
import { Hammer } from "lucide-react";
export default function JobsPage() {
  const { t } = useTranslation();
  return (
    <FeatureGate featureId="jobs">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-500"><Hammer size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">{t("business.features.jobs")}</h1>
            <p className="text-xs text-muted-foreground">{t("business.features.jobsDesc")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{t("business.stub.comingSoon", { module: t("business.features.jobs") })}</p>
        </div>
      </div>
    </FeatureGate>
  );
}
