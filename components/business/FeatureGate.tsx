"use client";

import React from "react";
import Link from "next/link";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { useTranslation } from "@/components/TranslationProvider";
import { FEATURES } from "@/lib/business/features";

/**
 * Wraps page content and blocks rendering if the specified feature is disabled.
 * Shows an access-denied screen with a link back to the dashboard.
 */
export default function FeatureGate({
  featureId,
  children,
}: {
  featureId: string;
  children: React.ReactNode;
}) {
  const { resolved } = useBusiness();
  const { t } = useTranslation();
  const state = resolved.features[featureId];

  if (!state?.enabled) {
    const def = FEATURES[featureId];
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[--radius] border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
            <ShieldOff size={26} className="text-muted-foreground" />
          </span>
          <h1 className="mt-4 text-lg font-bold font-['Space_Grotesk'] text-foreground">
            {t("business.settings.features.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {state?.killSwitched
              ? t("business.settings.features.killSwitchReason")
              : state?.mandatory === false && !state?.depsMet
                ? t("business.settings.features.requires", { deps: state.missingDeps.map((d) => FEATURES[d]?.id?.replace(/_/g, " ") ?? d).join(", ") })
                : t("business.settings.features.description")}
          </p>
          <Link
            href="/business/dashboard"
            className="mt-6 inline-flex items-center gap-2 min-h-11 rounded-[--radius] bg-[var(--cardeal-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[#9E1F23]"
          >
            <ArrowLeft size={16} />
            {t("business.portal.backToDashboard")}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
