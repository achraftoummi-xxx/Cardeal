"use client";

import React from "react";
import { Receipt, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export default function InvoicesSettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Receipt size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.invoices.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.invoices.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">{t("business.settings.invoices.defaults")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.invoices.prefix")}</label>
            <input type="text" defaultValue="INV-" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.invoices.nextNumber")}</label>
            <input type="number" defaultValue="1001" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.invoices.taxRate")}</label>
            <input type="number" defaultValue="19" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.invoices.paymentTerms")}</label>
            <input type="number" defaultValue="30" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("business.settings.invoices.footer")}</label>
          <textarea rows={3} placeholder={t("business.settings.invoices.footerPlaceholder")} className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 resize-none" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.invoices.save")}
        </Button>
      </div>
    </div>
  );
}
