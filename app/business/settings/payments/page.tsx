"use client";

import React from "react";
import { Banknote, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export default function PaymentsSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Banknote size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.payments.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.payments.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{t("business.settings.payments.bankDetails")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.accountHolder")}</label>
            <input type="text" placeholder="e.g. El Japouni Auto Service SARL" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.bankName")}</label>
            <input type="text" placeholder="e.g. Banque Internationale Arabe de Tunisie" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.iban")}</label>
            <input type="text" placeholder="e.g. TN59 0400 0000 0000 0000 0000" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.swift")}</label>
            <input type="text" placeholder="e.g. BIATITT" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{t("business.settings.payments.payoutSchedule")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.payoutFrequency")}</label>
            <select className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20">
              <option value="weekly">{t("business.settings.payments.frequencyOptions.weekly")}</option>
              <option value="biweekly">{t("business.settings.payments.frequencyOptions.biweekly")}</option>
              <option value="monthly" selected>{t("business.settings.payments.frequencyOptions.monthly")}</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.payments.minimumPayout")}</label>
            <input type="number" defaultValue="100" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.payments.save")}
        </Button>
      </div>
    </div>
  );
}
