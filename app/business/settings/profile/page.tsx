"use client";

import React from "react";
import { User, Save, Building2, Globe, Mail, Phone, MapPin } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/TranslationProvider";

export default function ProfileSettingsPage() {
  const { t } = useTranslation();
  const { partner } = useBusiness();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <User size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              {t("business.settings.profile.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("business.settings.profile.description")}
            </p>
          </div>
        </div>
      </div>

      {/* Business Identity */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" />
          {t("business.settings.profile.sections.identity")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("business.settings.profile.fields.legalName")} value={partner?.name || ""} placeholder={t("business.settings.profile.placeholders.legalName")} />
          <Field label={t("business.settings.profile.fields.tradeRegister")} placeholder={t("business.settings.profile.placeholders.tradeRegister")} />
          <Field label={t("business.settings.profile.fields.taxId")} placeholder={t("business.settings.profile.placeholders.taxId")} />
          <Field label={t("business.settings.profile.fields.establishmentType")} value={partner?.establishment_type || ""} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Phone size={16} className="text-muted-foreground" />
          {t("business.settings.profile.sections.contact")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("business.settings.profile.fields.phone")} value={partner?.phone || ""} icon={<Phone size={14} />} />
          <Field label={t("business.settings.profile.fields.email")} value={partner?.email || ""} icon={<Mail size={14} />} />
          <Field label={t("business.settings.profile.fields.address")} value={partner?.address || ""} icon={<MapPin size={14} />} className="sm:col-span-2" />
          <Field label={t("business.settings.profile.fields.website")} value={partner?.website || ""} icon={<Globe size={14} />} placeholder={t("business.settings.profile.placeholders.website")} className="sm:col-span-2" />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
          {t("business.settings.profile.sections.social")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("business.settings.profile.fields.facebook")} value={partner?.facebook_url || ""} placeholder={t("business.settings.profile.placeholders.facebook")} />
          <Field label={t("business.settings.profile.fields.instagram")} value={partner?.instagram_url || ""} placeholder={t("business.settings.profile.placeholders.instagram")} />
        </div>
      </div>

      {/* Locale */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
          {t("business.settings.profile.sections.locale")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("business.settings.profile.fields.currency")} value="TND" placeholder="TND" />
          <Field label={t("business.settings.profile.fields.timezone")} value="Africa/Tunis" placeholder="Africa/Tunis" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          {t("business.settings.profile.save")}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  icon,
  className,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        )}
        <input
          type="text"
          defaultValue={value || ""}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 ${
            icon ? "pl-9" : ""
          }`}
        />
      </div>
    </div>
  );
}
