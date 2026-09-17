"use client";

import React from "react";
import { CreditCard, Check } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";

const PLAN_IDS = ["starter", "pro", "enterprise"] as const;

export default function BillingSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <CreditCard size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.billing.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.billing.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Usage */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{t("business.settings.billing.currentUsage")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <UsageStat label={t("business.settings.billing.usage.bookings")} value="23" limit="Unlimited" />
          <UsageStat label={t("business.settings.billing.usage.teamMembers")} value="2" limit="10" />
          <UsageStat label={t("business.settings.billing.usage.apiCalls")} value="1,247" limit="10,000/mo" />
          <UsageStat label={t("business.settings.billing.usage.storage")} value="180 MB" limit="1 GB" />
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PLAN_IDS.map((planId) => {
          const isCurrent = planId === "pro";
          const planFeatures = t(`business.settings.billing.plans.${planId}.features`);
          return (
            <div
              key={planId}
              className={`rounded-2xl border bg-card p-6 shadow-sm ${
                isCurrent
                  ? "border-emerald-500/50 ring-2 ring-emerald-500/20"
                  : "border-border"
              }`}
            >
              {isCurrent && (
                <span className="mb-3 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {t("business.settings.billing.currentPlan")}
                </span>
              )}
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-foreground">{t(`business.settings.billing.plans.${planId}.name`)}</h3>
              <p className="mt-1 text-2xl font-extrabold font-['Space_Grotesk'] text-foreground">{t(`business.settings.billing.plans.${planId}.price`)}</p>
              <ul className="mt-4 space-y-2">
                {Array.isArray(planFeatures) && planFeatures.map((f: string) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check size={14} className="shrink-0 text-emerald-500 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <button className="mt-6 w-full rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
                  {planId === "enterprise" ? t("business.settings.billing.contactSales") : t("business.settings.billing.upgrade")}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsageStat({
  label,
  value,
  limit,
}: {
  label: string;
  value: string;
  limit: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-extrabold font-['Space_Grotesk'] text-foreground">{value}</p>
      <p className="mt-0.5 text-[10px] text-muted-foreground/70">{limit}</p>
    </div>
  );
}
