"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import BusinessProvider, {
  useBusiness,
} from "@/components/business/BusinessProvider";
import BusinessSidebar from "@/components/business/BusinessSidebar";

function BusinessShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { partner } = useBusiness();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-['Manrope'] antialiased">
      <BusinessSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/85 px-4 py-3 sm:px-6 backdrop-blur-xl">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-[--radius] border border-border bg-secondary text-foreground hover:bg-accent transition lg:hidden"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <h1 className="text-sm font-extrabold tracking-tight text-foreground sm:text-base font-['Space_Grotesk']">
              CarDeal Business Portal
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Partner
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:pt-6 box-border min-w-0 overflow-x-hidden">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 box-border">
            {children}
          </div>
        </main>
      </div>
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
