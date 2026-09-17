"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Hammer,
  MessageSquare,
  FileText,
  CalendarClock,
  Package,
  Truck,
  ShieldCheck,
  Receipt,
  Banknote,
  Star,
  Users,
  BarChart3,
  Plug,
  Key,
  Settings,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import BusinessProvider, { useBusiness } from "@/components/business/BusinessProvider";

const ALL_NAV_ITEMS = [
  { featureId: null, label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
  { featureId: "jobs", label: "Jobs", href: "/business/jobs", icon: Hammer },
  { featureId: "messages", label: "Messages", href: "/business/messages", icon: MessageSquare },
  { featureId: "quotes", label: "Quotes", href: "/business/quotes", icon: FileText },
  { featureId: "schedule", label: "Schedule", href: "/business/schedule", icon: CalendarClock },
  { featureId: "catalog", label: "Catalog", href: "/business/catalog", icon: Package },
  { featureId: "fleet", label: "Fleet", href: "/business/fleet", icon: Truck },
  { featureId: "claims", label: "Claims", href: "/business/claims", icon: ShieldCheck },
  { featureId: "invoices", label: "Invoices", href: "/business/invoices", icon: Receipt },
  { featureId: "payouts", label: "Payouts", href: "/business/payouts", icon: Banknote },
  { featureId: "reviews", label: "Reviews", href: "/business/reviews", icon: Star },
  { featureId: "team", label: "Team", href: "/business/team", icon: Users },
  { featureId: "analytics", label: "Analytics", href: "/business/analytics", icon: BarChart3 },
  { featureId: "integrations", label: "Integrations", href: "/business/integrations", icon: Plug },
  { featureId: "api-access", label: "API Access", href: "/business/api-access", icon: Key },
  { featureId: null, label: "Features", href: "/business/settings/features", icon: Settings },
];

function BusinessShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolved, partner } = useBusiness();

  const navItems = ALL_NAV_ITEMS.filter((item) => {
    if (!item.featureId) return true;
    return resolved.features[item.featureId]?.enabled ?? false;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-['Manrope'] antialiased">
      {/* Business Portal Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/85 px-4 py-3 sm:px-6 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-border bg-secondary text-foreground hover:bg-accent transition"
            title="Back to Dashboard"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[--radius] bg-emerald-500/25 border border-emerald-500/40 text-emerald-500">
              <Briefcase size={20} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-foreground sm:text-base font-['Space_Grotesk']">
                CarDeal Business Portal
              </h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">
                {partner?.name || "Partner Command Center"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSelector />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Verified Partner</span>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="border-b border-border bg-card/40 px-4 sm:px-6 overflow-x-auto">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-3 text-xs sm:text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  active
                    ? "border-emerald-500 text-foreground bg-accent/40"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-accent/20"
                }`}
              >
                <Icon
                  size={16}
                  className={active ? "text-emerald-500" : "text-muted-foreground"}
                />
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

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessProvider>
      <BusinessShell>{children}</BusinessShell>
    </BusinessProvider>
  );
}
