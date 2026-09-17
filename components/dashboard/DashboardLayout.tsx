"use client";

import { useState } from "react";
import { useTranslation } from "@/components/TranslationProvider";
import { DashboardProvider } from "./DashboardContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import LowHealthToast from "./LowHealthToast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="flex min-h-screen bg-background text-foreground antialiased">
        <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onMenu={() => setSidebarOpen((o) => !o)} />
          <main className="flex-1 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:pt-6 box-border min-w-0 overflow-x-hidden">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 box-border">{children}</div>
          </main>
        </div>
      </div>
      <LowHealthToast />
    </DashboardProvider>
  );
}