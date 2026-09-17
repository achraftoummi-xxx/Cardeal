"use client";
import FeatureGate from "@/components/business/FeatureGate";
import { useTranslation } from "@/components/TranslationProvider";
import { CalendarClock } from "lucide-react";
export default function SchedulePage() {
  const { t } = useTranslation();
  return (
    <FeatureGate featureId="schedule">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-500"><CalendarClock size={20} /></div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">{t("business.features.schedule")}</h1>
            <p className="text-xs text-muted-foreground">{t("business.features.scheduleDesc")}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">{t("business.stub.comingSoon", { module: t("business.features.schedule") })}</p>
        </div>
      </div>
    </FeatureGate>
  );
}
