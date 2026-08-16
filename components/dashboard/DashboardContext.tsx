"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { cityByLabel, CITY_OPTIONS } from "@/data/dashboard";

export type DashboardLocation = { label: string; lat: number; lng: number };

type DashboardContextValue = {
  location: DashboardLocation;
  setLocation: (loc: DashboardLocation) => void;
  /** Bumped whenever user vehicles/services change so widgets re-read storage. */
  vehiclesVersion: number;
  bumpVehiclesVersion: () => void;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const LOCATION_STORAGE_KEY = "cardeal_dashboard_city";

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<DashboardLocation>(() => {
    if (typeof window === "undefined") return { label: "Tunis", lat: 36.8065, lng: 10.1815 };
    try {
      const saved = window.localStorage.getItem(LOCATION_STORAGE_KEY);
      if (saved) {
        const city = cityByLabel(saved);
        if (city) return city;
      }
    } catch {
      /* storage unavailable */
    }
    return CITY_OPTIONS[0];
  });
  const [vehiclesVersion, setVehiclesVersion] = useState(0);

  const setLocation = (loc: DashboardLocation) => {
    setLocationState(loc);
    try {
      window.localStorage.setItem(LOCATION_STORAGE_KEY, loc.label);
    } catch {
      /* storage unavailable */
    }
  };

  const bumpVehiclesVersion = () => setVehiclesVersion((v) => v + 1);

  return (
    <DashboardContext.Provider value={{ location, setLocation, vehiclesVersion, bumpVehiclesVersion }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}