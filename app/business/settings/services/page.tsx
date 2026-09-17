"use client";

import React from "react";
import { Wrench, Save } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export default function ServicesSettingsPage() {
  const { t } = useTranslation();
  const { verticals } = useBusiness();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Wrench size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.services.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.services.description")}
            </p>
          </div>
        </div>
      </div>

      {verticals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-8 text-center">
          <Wrench size={24} className="mx-auto text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            {t("business.settings.services.noVerticals")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {verticals.map((v) => (
            <div
              key={v}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground capitalize">
                {v.replace(/_/g, " ")}
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("business.settings.services.laborRate")}
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {t("business.settings.services.diagnosticFee")}
                  </label>
                  <input
                    type="number"
                    defaultValue="30"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {t("business.settings.services.terms")}
                </label>
                <textarea
                  rows={3}
                  placeholder={t("business.settings.services.termsPlaceholder")}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.services.save")}
        </Button>
      </div>
    </div>
  );
}
