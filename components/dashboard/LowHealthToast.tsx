"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "@/components/TranslationProvider";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import {
  computeVehicleHealthFromServices,
  consumeLowHealthWarning,
  getDashboardVehicle,
  loadUserVehicles,
  seedUserVehicle,
} from "@/data/dashboard";

/**
 * Warning toast shown when the health of the primary vehicle drops below
 * 55%, advising the user to service the car immediately. Fires at most
 * once per 6h window per vehicle.
 */
export default function LowHealthToast() {
  const { t } = useTranslation();
  const { vehiclesVersion } = useDashboard();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = loadUserVehicles();
    const vehicle =
      stored && stored.length > 0 ? stored[0] : seedUserVehicle(getDashboardVehicle());
    const health = computeVehicleHealthFromServices(vehicle);
    if (health < 55 && consumeLowHealthWarning(vehicle.id, health)) {
      setVisible(true);
      const timer = window.setTimeout(() => setVisible(false), 10000);
      return () => window.clearTimeout(timer);
    }
  }, [vehiclesVersion]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-[60] flex w-[min(92vw,380px)] items-start gap-3 rounded-2xl border border-amber-500/40 bg-card p-4 shadow-2xl shadow-black/30"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 ring-1 ring-amber-500/30">
        <AlertTriangle size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">
          {t("dashboard.vehicles.healthAlert.title")}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("dashboard.vehicles.healthAlert.body")}
        </p>
        <Link
          href="/dashboard/vehicules"
          onClick={() => setVisible(false)}
          className="mt-2 inline-block text-xs font-semibold text-[var(--cardeal-primary)] hover:underline"
        >
          {t("dashboard.vehicles.healthAlert.viewVehicles")}
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label={t("dashboard.vehicles.healthAlert.dismiss")}
        className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <X size={14} />
      </button>
    </div>
  );
}