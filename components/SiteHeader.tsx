"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "@/components/LanguageSelector";
import ThemeToggle from "@/components/ThemeToggle";
import { useTranslation } from "@/components/TranslationProvider";
import cardealLogo from "@/assets/images/cardeal_logo.png";

export default function SiteHeader({
  onLogin,
  onPartner,
}: {
  onLogin: () => void;
  onPartner: () => void;
}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "#find-service", label: t("nav.findService") },
    { href: "#request-quote", label: t("nav.requestQuote") },
    { href: "/rechercher-des-pieces", label: t("nav.searchParts") },
    { href: "/pneus", label: t("nav.tires") },
    { href: "/conseil-auto", label: t("nav.advice") },
    { href: "/bons-plans", label: t("nav.deals") },
    { href: "/dealers", label: t("nav.dealers") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="flex items-center justify-between gap-2 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3 lg:px-8">
        <a href="/" className="shrink-0" aria-label={t("site.name")}>
          <img
            src={cardealLogo.src}
            alt={t("site.name")}
            draggable={false}
            className="h-12 w-auto dark:brightness-150 sm:h-14"
          />
        </a>
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
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <Button variant="outline" className="hidden text-sm sm:inline-flex" onClick={onPartner}>{t("buttons.becomePartner")}</Button>
          <Button onClick={onLogin} className="text-sm">{t("buttons.login")}</Button>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={t("nav.menu")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-700/50 bg-white text-zinc-700 shadow-sm transition-all hover:border-zinc-600/50 hover:bg-zinc-700/30 lg:hidden dark:bg-zinc-800/30 dark:text-zinc-300 dark:hover:border-zinc-600/50 dark:hover:bg-zinc-700/30"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {/* Mobile nav panel */}
      {menuOpen && (
        <div className="border-t border-border bg-background/95 px-[max(1rem,env(safe-area-inset-left))] py-2 pr-[max(1rem,env(safe-area-inset-right))] backdrop-blur-xl lg:hidden">
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
      )}
    </header>
  );
}
