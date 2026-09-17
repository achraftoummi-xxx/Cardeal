"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  BarChart3,
  Users,
  Clock,
  Wrench,
  Settings,
  ArrowLeft,
  Activity,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
