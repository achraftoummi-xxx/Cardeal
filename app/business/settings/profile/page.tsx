"use client";

import React from "react";
import { User, Save, Building2, Globe, Mail, Phone, MapPin } from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { Button } from "@/components/ui/button";

export default function ProfileSettingsPage() {
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
              Business Profile
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your business identity, legal info, and contact details
            </p>
          </div>
        </div>
      </div>

      {/* Business Identity */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Building2 size={16} className="text-muted-foreground" />
          Business Identity
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Legal Business Name" value={partner?.name || ""} placeholder="e.g. El Japouni Auto Service SARL" />
          <Field label="Trade Register Number" placeholder="e.g. RN0012345678" />
          <Field label="Tax / VAT ID" placeholder="e.g. 12345678/M" />
          <Field label="Establishment Type" value={partner?.establishment_type || ""} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground flex items-center gap-2">
          <Phone size={16} className="text-muted-foreground" />
          Contact Information
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone Number" value={partner?.phone || ""} icon={<Phone size={14} />} />
          <Field label="Email" value={partner?.email || ""} icon={<Mail size={14} />} />
          <Field label="Address" value={partner?.address || ""} icon={<MapPin size={14} />} className="sm:col-span-2" />
          <Field label="Website" value={partner?.website || ""} icon={<Globe size={14} />} placeholder="https://" className="sm:col-span-2" />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
          Social Media Links
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Facebook URL" value={partner?.facebook_url || ""} placeholder="https://facebook.com/..." />
          <Field label="Instagram URL" value={partner?.instagram_url || ""} placeholder="https://instagram.com/..." />
        </div>
      </div>

      {/* Locale */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
          Locale & Display
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Currency" value="TND" placeholder="TND" />
          <Field label="Timezone" value="Africa/Tunis" placeholder="Africa/Tunis" />
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" className="flex items-center gap-2">
          <Save size={14} />
          Save Profile
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
