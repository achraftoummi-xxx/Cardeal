"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { isAuthenticated } from "@/lib/auth";
import { DashboardProvider } from "./DashboardContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import LowHealthToast from "./LowHealthToast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [auth, setAuth] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  if (auth === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-[var(--cardeal-primary)]" />
      </div>
    );
  }

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--cardeal-primary)]/10 ring-1 ring-[var(--cardeal-primary)]/20">
            <Lock size={24} className="text-[var(--cardeal-primary)]" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-foreground">
            {t("dashboard.header.loginRequiredTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("dashboard.header.loginRequiredMessage")}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[var(--cardeal-primary)] px-5 text-sm font-medium text-white transition-colors hover:bg-[#9E1F23]"
          >
            {t("dashboard.header.backHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-background text-foreground antialiased">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onMenu={() => setSidebarOpen((o) => !o)} />
          <main className="flex-1 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:pt-6">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
      <LowHealthToast />
    </DashboardProvider>
  );
}