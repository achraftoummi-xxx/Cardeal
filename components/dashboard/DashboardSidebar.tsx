"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Car,
  FileText,
  Wrench,
  CalendarDays,
  History,
  MessageCircle,
  Heart,
  FolderOpen,
  Wallet,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { cn } from "@/lib/utils";
import cardealLogo from "@/assets/images/cardeal_logo.png";

export type NavKey =
  | "home"
  | "vehicles"
  | "quotes"
  | "parts"
  | "appointments"
  | "history"
  | "messages"
  | "favorites"
  | "documents"
  | "expenses"
  | "settings";

export const NAV_ITEMS: { key: NavKey; href: string; icon: LucideIcon }[] = [
  { key: "home", href: "/dashboard", icon: Home },
  { key: "vehicles", href: "/dashboard/vehicules", icon: Car },
  { key: "quotes", href: "/dashboard/devis", icon: FileText },
  { key: "parts", href: "/dashboard/pieces", icon: Wrench },
  { key: "appointments", href: "/dashboard/rendez-vous", icon: CalendarDays },
  { key: "history", href: "/dashboard/historique", icon: History },
  { key: "messages", href: "/dashboard/messages", icon: MessageCircle },
  { key: "favorites", href: "/dashboard/favoris", icon: Heart },
  { key: "documents", href: "/dashboard/documents", icon: FolderOpen },
  { key: "expenses", href: "/dashboard/depenses", icon: Wallet },
  { key: "settings", href: "/dashboard/parametres", icon: Settings },
];

export function navLabel(t: (key: string) => string, key: NavKey): string {
  return t(`dashboard.nav.${key}`);
}

export default function DashboardSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

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
        aria-label={t("dashboard.nav.home")}
      >
        <div className="flex items-center justify-between px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] lg:pt-4">
          <Link href="/" onClick={onClose} aria-label={t("site.name")}>
            <img
              src={cardealLogo.src}
              alt={t("site.name")}
              draggable={false}
              className="h-11 w-auto dark:brightness-150"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("dashboard.header.closeMenu")}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[var(--cardeal-primary)]/10 text-[var(--cardeal-primary)] ring-1 ring-[var(--cardeal-primary)]/20"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="truncate">{navLabel(t, key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border p-4">
          <Link
            href="/"
            onClick={onClose}
            className="flex min-h-11 items-center justify-center rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {t("dashboard.header.backToSite")}
          </Link>
        </div>
      </aside>
    </>
  );
}