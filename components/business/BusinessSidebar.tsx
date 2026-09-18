"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  ArrowLeft,
  Briefcase,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import { useTranslation } from "@/components/TranslationProvider";
import {
  FEATURES,
  FEATURE_CATEGORIES,
  type FeatureCategory,
} from "@/lib/business/features";
import { cn } from "@/lib/utils";
import cardealLogo from "@/assets/images/cardeal_logo.png";

const CATEGORY_COLORS: Record<FeatureCategory, string> = {
  core: "text-blue-500",
  operations: "text-amber-500",
  finance: "text-emerald-500",
  relationships: "text-rose-500",
  growth: "text-purple-500",
  legal: "text-slate-400",
  advanced: "text-slate-400",
};

export default function BusinessSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { resolved, partner } = useBusiness();
  const { t } = useTranslation();

  const isActive = (href: string) =>
    href === "/business/dashboard"
      ? pathname === "/business/dashboard"
      : pathname.startsWith(href);

  const enabledByCategory = FEATURE_CATEGORIES.map((cat) => {
    const items = Object.values(FEATURES).filter(
      (f) =>
        f.category === cat.id &&
        (resolved.features[f.id]?.enabled ?? false)
    );
    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shrink-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Business Portal navigation"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] lg:pt-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <img
              src={cardealLogo.src}
              alt="CarDeal"
              draggable={false}
              className="h-10 w-auto dark:brightness-150"
            />
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-500">
              <Briefcase size={16} />
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Partner info */}
        <div className="mx-4 mb-3 rounded-xl border border-border bg-secondary/50 px-3 py-2.5">
          <p className="text-xs font-bold text-foreground truncate">
            {partner?.name || t("business.portal.partnerFallback")}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {partner?.establishment_type || t("business.portal.businessFallback")}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-0.5">
            {/* Dashboard — always visible */}
            <li>
              <SidebarLink
                href="/business/dashboard"
                icon={LayoutDashboard}
                label={t("business.portal.dashboard")}
                active={isActive("/business/dashboard")}
                onClick={onClose}
              />
            </li>

            {/* Feature groups */}
            {enabledByCategory.map((cat) => {
              const color = CATEGORY_COLORS[cat.id];
              return (
                <li key={cat.id} className="mt-3">
                  <p
                    className={cn(
                      "mb-1 px-3.5 text-[10px] font-bold uppercase tracking-widest",
                      color
                    )}
                  >
                    {t(`business.categories.${cat.id}`)}
                  </p>
                  <ul className="space-y-0.5">
                    {cat.items.map((f) => {
                      const Icon = f.icon;
                      const href = `/business/${f.route}`;
                      return (
                        <li key={f.id}>
                          <SidebarLink
                            href={href}
                            icon={Icon}
                            label={t(f.labelKey) || f.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            active={isActive(href)}
                            onClick={onClose}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}

            {/* Settings — always visible */}
            <li className="mt-3">
              <p className="mb-1 px-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t("business.sidebar.settings")}
              </p>
              <ul className="space-y-0.5">
                <li>
                  <SidebarLink
                    href="/business/settings"
                    icon={Settings}
                    label={t("business.sidebar.settings")}
                    active={isActive("/business/settings")}
                    onClick={onClose}
                  />
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex min-h-10 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft size={16} className="shrink-0" />
            <span className="truncate">{t("business.portal.backToDashboard")}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
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
      <span className="truncate">{label}</span>
    </Link>
  );
}
