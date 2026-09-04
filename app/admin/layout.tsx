"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Car,
  Clock,
  Wrench,
  Activity,
  CheckCircle2,
  XCircle,
  ChevronRight,
  BarChart3,
  Settings,
  ArrowLeft,
  FileText,
  AlertCircle
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { useAdminRole } from "@/components/admin/useAdminRole";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { email, authed } = useAuth();
  const { isAdmin } = useAdminRole(undefined, email);
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const ADMIN_EMAILS = ['mokhtari.achref06@gmail.com', 'toumiachref21@gmail.com'];
  const isUserAdmin = isAdmin || (email && ADMIN_EMAILS.includes(email.toLowerCase()));

  useEffect(() => {
    if (!authed) {
      router.replace("/");
      return;
    }
    setAuthorized(Boolean(isUserAdmin));
  }, [authed, isUserAdmin, router]);

  if (authorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-[var(--cardeal-primary)]" />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <div className="w-full max-w-md rounded-[--radius] border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cardeal-primary)]/15 ring-1 ring-[var(--cardeal-primary)]/30">
            <AlertCircle size={26} className="text-[var(--cardeal-primary)]" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-foreground font-['Space_Grotesk']">Accès Restreint Admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous n'avez pas les autorisations requises pour accéder au sous-système d'administration global.
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

  const tabs = [
    { label: "Dashboard", href: "/admin", icon: BarChart3 },
    { label: "Services Management", href: "/admin/services", icon: Wrench },
    { label: "Operational Analytics", href: "/admin/analytics", icon: Activity },
    { label: "Customer Directory", href: "/admin/clients", icon: Users },
    { label: "Partnership Requests", href: "/admin/requests", icon: Clock },
    { label: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-['Manrope'] antialiased">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 px-4 py-3 sm:px-6 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-border bg-secondary text-foreground hover:bg-accent transition"
            title="Quitter l'Admin"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[--radius] bg-[var(--cardeal-primary)]/20 border border-[var(--cardeal-primary)]/40 text-[var(--cardeal-primary)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-foreground sm:text-base font-['Space_Grotesk']">CarDeal Admin Subsystem</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Command & Operations Center</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Supabase RLS Active</span>
          </div>
        </div>
      </header>

      {/* Sub-Navigation Header */}
      <nav className="border-b border-border bg-card/40 px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = pathname === tab.href || (tab.href !== "/admin" && pathname.startsWith(tab.href));
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  active
                    ? "border-[var(--cardeal-primary)] text-foreground bg-accent/40"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/20"
                }`}
              >
                <Icon size={16} className={active ? "text-[var(--cardeal-primary)]" : "text-muted-foreground"} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
