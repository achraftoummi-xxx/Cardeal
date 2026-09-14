"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Users,
  Package,
  Settings,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Loader2
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";

const partnerNavItems = [
  { label: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/partner/appointments", icon: CalendarDays },
  { label: "Quotations & Requests", href: "/partner/quotations", icon: Wrench },
  { label: "Inventory Parts", href: "/partner/inventory", icon: Package },
  { label: "Staff Roster", href: "/partner/staff", icon: Users },
  { label: "Services & Hours", href: "/partner/settings", icon: Settings },
];

export default function PartnerRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { loading, isPartner, profile } = usePartnerAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--cardeal-primary)]" />
      </div>
    );
  }

  if (!isPartner) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-[--radius] border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cardeal-primary)]/15 ring-1 ring-[var(--cardeal-primary)]/30">
            <ShieldAlert size={26} className="text-[var(--cardeal-primary)]" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-foreground font-['Space_Grotesk']">Accès Partenaire Restreint</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {profile
              ? "Votre compte n'est pas encore approuvé en tant que partenaire, ou vous n'avez pas les privilèges requis."
              : "Veuillez vous connecter avec un compte partenaire CarDeal approuvé pour accéder à cette interface."}
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[--radius] bg-[var(--cardeal-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[#9E1F23]"
          >
            Retourner au Tableau de Bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-['Manrope'] antialiased">
      {/* Partner Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 px-4 py-3 sm:px-6 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-border bg-secondary text-foreground hover:bg-accent transition"
            title="Quitter l'Espace Partenaire"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[--radius] bg-[var(--cardeal-primary)]/25 border border-[var(--cardeal-primary)]/40 text-[var(--cardeal-primary)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-foreground sm:text-base font-['Space_Grotesk']">CarDeal Partner Portal</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Garage & Workshop Command Center</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>RLS Protected</span>
          </div>
        </div>
      </header>

      {/* Partner Navigation Bar */}
      <nav className="border-b border-border bg-card/40 px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {partnerNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  active
                    ? "border-[var(--cardeal-primary)] text-foreground bg-accent/40"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/20"
                }`}
              >
                <Icon size={16} className={active ? "text-[var(--cardeal-primary)]" : "text-muted-foreground"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
