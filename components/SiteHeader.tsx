"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "@/components/TranslationProvider";
import { useAuth } from "@/components/AuthProvider";
import { useAdminRole } from "@/components/admin/useAdminRole";
import { AdminPortal } from "@/components/admin/AdminPortal";
import cardealLogo from "@/assets/images/cardeal_logo.png";

export default function SiteHeader({
  onLogin,
  onPartner,
}: {
  onLogin: () => void;
  onPartner: () => void;
}) {
  const { t } = useTranslation();
  const { authed, email } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const { isAdmin } = useAdminRole(undefined, email);
  const isUserAdmin = isAdmin || (email && ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'].includes(email.toLowerCase()));

  const navLinks = [
    { href: authed ? "/dashboard/recherche" : "/#find-service", label: t("nav.findService") },
    { href: "/rechercher-des-pieces", label: t("nav.searchParts") },
    { href: "/pneus", label: t("nav.tires") },
    { href: "/conseil-auto", label: t("nav.advice") },
    { href: "/bons-plans", label: t("nav.deals") },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl box-border w-full">
        <nav className="flex items-center justify-between gap-2 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3 lg:px-8 box-border w-full max-w-full">
          <Link
            href={authed ? "/dashboard" : "/"}
            className="shrink-0"
            aria-label={t("site.name")}
          >
            <img
              src={cardealLogo.src}
              alt={t("site.name")}
              draggable={false}
              className="h-12 w-auto dark:brightness-150 sm:h-14"
            />
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground lg:flex xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="whitespace-nowrap transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
          {/* Desktop right controls */}
          <div className="hidden lg:flex shrink-0 items-center gap-3">
            <ThemeToggle />
            <LanguageSelector />
            <Button variant="outline" className="text-sm" onClick={onPartner}>{t("buttons.becomePartner")}</Button>
            <Button onClick={onLogin} className="text-sm">
              {t("buttons.login")}
            </Button>
          </div>
          {/* Mobile hamburger toggle (only logo + hamburger on mobile top bar) */}
          <div className="flex lg:hidden shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-label={t("nav.menu")}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-700/50 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/30 dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-700/30"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
        {/* Mobile nav panel with all controls relocated inside */}
        {menuOpen && (
          <div className="border-t border-border bg-background/95 px-[max(1rem,env(safe-area-inset-left))] py-4 pr-[max(1rem,env(safe-area-inset-right))] backdrop-blur-xl lg:hidden space-y-3 box-border w-full">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-3">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Préférences</span>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSelector />
                </div>
              </div>

              {authed && (
                <div className="grid grid-cols-2 gap-2 px-3">
                  <a
                    href="/dashboard/messages"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                  >
                    <span>Messages</span>
                  </a>
                  <a
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                  >
                    <span>Dashboard</span>
                  </a>
                </div>
              )}

              {isUserAdmin && (
                <div className="px-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setAdminOpen(true);
                    }}
                    className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-red-500/50 bg-red-600/20 px-4 text-xs font-semibold text-red-400 shadow-sm transition-colors hover:bg-red-600/30"
                  >
                    <span>Admin Portal</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 px-3 pt-1">
                <Button
                  variant="outline"
                  className="w-full min-h-11 text-xs"
                  onClick={() => {
                    setMenuOpen(false);
                    onPartner();
                  }}
                >
                  {t("buttons.becomePartner")}
                </Button>
                <Button
                  className="w-full min-h-11 text-xs bg-[var(--cardeal-primary)] text-white hover:bg-[#9E1F23]"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogin();
                  }}
                >
                  {t("buttons.login")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      {isUserAdmin && <AdminPortal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />}
    </>
  );
}
