"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Layers,
  Settings,
  MapPin,
  Clock,
  Wrench,
  Users,
  Bell,
  Receipt,
  Banknote,
  Plug,
  Key,
  ShieldCheck,
  CreditCard,
  Trash2,
  ChevronLeft,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/components/TranslationProvider";

type SettingsTab = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  group: string;
};

const SETTINGS_TABS: SettingsTab[] = [
  { id: "profile", label: "Profile", href: "/business/settings/profile", icon: User, group: "businessInfo" },
  { id: "types", label: "Business Types", href: "/business/settings/types", icon: Layers, group: "businessInfo" },
  { id: "locations", label: "Locations", href: "/business/settings/locations", icon: MapPin, group: "businessInfo" },
  { id: "hours", label: "Operating Hours", href: "/business/settings/hours", icon: Clock, group: "businessInfo" },
  { id: "services", label: "Services & Rates", href: "/business/settings/services", icon: Wrench, group: "businessInfo" },

  { id: "features", label: "Features", href: "/business/settings/features", icon: Settings, group: "operations" },
  { id: "team", label: "Team Members", href: "/business/settings/team", icon: Users, group: "operations" },
  { id: "notifications", label: "Notifications", href: "/business/settings/notifications", icon: Bell, group: "operations" },

  { id: "invoices", label: "Invoicing", href: "/business/settings/invoices", icon: Receipt, group: "finance" },
  { id: "payments", label: "Payments & Payouts", href: "/business/settings/payments", icon: Banknote, group: "finance" },
  { id: "billing", label: "Subscription & Billing", href: "/business/settings/billing", icon: CreditCard, group: "finance" },

  { id: "integrations", label: "Integrations", href: "/business/settings/integrations", icon: Plug, group: "technical" },
  { id: "api", label: "API Access", href: "/business/settings/api", icon: Key, group: "technical" },
  { id: "security", label: "Security", href: "/business/settings/security", icon: ShieldCheck, group: "technical" },
  { id: "account", label: "Account Management", href: "/business/settings/account", icon: Trash2, group: "technical" },
];

const GROUP_ORDER = ["businessInfo", "operations", "finance", "technical"];

const GROUP_COLORS: Record<string, string> = {
  businessInfo: "text-blue-500",
  operations: "text-amber-500",
  finance: "text-emerald-500",
  technical: "text-slate-400",
};

function SettingsNav({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="flex-1 overflow-y-auto px-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {GROUP_ORDER.map((group) => {
        const tabs = SETTINGS_TABS.filter((t) => t.group === group);
        const groupActive = tabs.some((t) => isActive(t.href));
        return (
          <div key={group} className="mb-4">
            <p
              className={cn(
                "mb-1 px-3.5 text-[10px] font-bold uppercase tracking-widest",
                groupActive
                  ? GROUP_COLORS[group] || "text-muted-foreground"
                  : "text-muted-foreground"
              )}
            >
              {t(`business.settings.groups.${group}`)}
            </p>
            <ul className="space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = isActive(tab.href);
                return (
                  <li key={tab.id}>
                    <Link
                      href={tab.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-h-10 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(
                          "shrink-0",
                          active ? "text-emerald-500" : "text-muted-foreground"
                        )}
                      />
                      <span className="truncate">{t(`business.settings.tabs.${tab.id}`)}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex gap-6 lg:gap-8">
      {/* Desktop settings sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col rounded-2xl border border-border bg-card shadow-sm sticky top-20 self-start max-h-[calc(100vh-6rem)]">
        <div className="px-4 pt-4 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {t("business.settings.settings")}
          </p>
        </div>
        <SettingsNav onNavigate={() => {}} />
      </aside>

      {/* Mobile settings nav toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open settings menu"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile settings overlay */}
      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card lg:hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-sm font-bold font-['Space_Grotesk'] text-foreground">
                {t("business.settings.settings")}
              </p>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close settings menu"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <SettingsNav onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
