"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import { usePartnerAuth } from "@/components/partner/usePartnerAuth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  resolveFeatures,
  type ResolvedFeatures,
  type FeatureState,
} from "@/lib/business/resolve";
import type { FeatureVertical } from "@/lib/business/features";
import type { Partner } from "@/lib/partners";

type BusinessContextValue = {
  /** The resolved partner record from the partners table. */
  partner: Partner | null;
  /** Active verticals for this partner. */
  verticals: FeatureVertical[];
  /** Resolved feature states. */
  resolved: ResolvedFeatures;
  /** Toggle a single feature on/off. Returns the new enabled state. */
  toggleFeature: (featureId: string, enabled: boolean) => void;
  /** Whether initial data is still loading. */
  loading: boolean;
  /** Whether a save operation is in progress. */
  saving: boolean;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}

export default function BusinessProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading, partnerId, profile } = usePartnerAuth();

  const [partner, setPartner] = useState<Partner | null>(null);
  const [verticals, setVerticals] = useState<FeatureVertical[]>([]);
  const [overrides, setOverrides] = useState<Record<string, boolean> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ── Fetch partner record + feature overrides ── */
  useEffect(() => {
    if (authLoading) return;

    if (!partnerId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async (attempt = 1) => {
      try {
        if (!isSupabaseConfigured || !supabase) {
          // Mock mode
          if (!cancelled) {
            setPartner({
              id: partnerId,
              name: "El Japouni Auto Service",
              city: "Tunis",
              zip_code: "1002",
              address: "37 Rue du Liban, Tunis",
              phone: "24505823",
              email: profile?.email || "partner@cardeal.tn",
              establishment_type: "Atelier de mécanique automobile",
              website: null,
              google_map_coords: "36.81283333, 10.17763889",
              latitude: 36.81283333,
              longitude: 10.17763889,
              facebook_url: null,
              instagram_url: null,
              google_rating: 4.9,
              review_count: 64,
              opening_hours: "Ouvert 24/24",
              services_offered: "Vidange",
              additional_info: null,
              garage_capacity: 5,
            });
            setVerticals(["workshop"]);
            setOverrides(null);
          }
          return;
        }

        const { data: pData, error: pErr } = await supabase
          .from("partners")
          .select("*")
          .eq("id", partnerId)
          .maybeSingle();

        if (cancelled) return;

        if (pErr) {
          console.error("BusinessProvider: partner query error:", pErr.message);
          // Retry up to 2 times on transient errors
          if (attempt < 3) {
            await new Promise((r) => setTimeout(r, attempt * 500));
            return load(attempt + 1);
          }
        }

        if (pData) {
          setPartner(pData as Partner);
          // Parse verticals from establishment_type or a dedicated column
          const rawVerticals = (pData as Record<string, unknown>).verticals;
          if (Array.isArray(rawVerticals)) {
            setVerticals(rawVerticals as FeatureVertical[]);
          } else {
            // Derive from establishment_type
            const est = (pData as Partner).establishment_type?.toLowerCase() ?? "";
            const inferred: FeatureVertical[] = [];
            if (est.includes("pneu") || est.includes("tire")) inferred.push("tire_shop");
            if (est.includes("carross") || est.includes("body")) inferred.push("body_shop");
            if (est.includes("location") || est.includes("rental")) inferred.push("rental");
            if (est.includes("mobile") || est.includes("dépannage")) inferred.push("mobile_mechanic");
            if (est.includes("concession") || est.includes("dealership")) inferred.push("dealership");
            if (inferred.length === 0) inferred.push("workshop");
            setVerticals(inferred);
          }
          // Parse feature overrides (JSONB column)
          const rawOverrides = (pData as Record<string, unknown>).feature_overrides;
          setOverrides(
            rawOverrides && typeof rawOverrides === "object"
              ? (rawOverrides as Record<string, boolean>)
              : null
          );
        }
      } catch (err) {
        console.error("BusinessProvider load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [authLoading, partnerId, profile]);

  /* ── Resolve features ── */
  const resolved = useMemo(
    () => resolveFeatures(verticals, overrides),
    [verticals, overrides]
  );

  /* ── Toggle a feature ── */
  const toggleFeature = useCallback(
    async (featureId: string, enabled: boolean) => {
      const newOverrides = { ...(overrides ?? {}), [featureId]: enabled };
      setOverrides(newOverrides);

      // Persist to Supabase
      if (isSupabaseConfigured && supabase && partnerId) {
        setSaving(true);
        try {
          await supabase
            .from("partners")
            .update({ feature_overrides: newOverrides })
            .eq("id", partnerId);
        } catch (err) {
          console.error("Failed to save feature override:", err);
          // Revert on failure
          setOverrides(overrides);
        } finally {
          setSaving(false);
        }
      }
    },
    [overrides, partnerId]
  );

  const value = useMemo<BusinessContextValue>(
    () => ({
      partner,
      verticals,
      resolved,
      toggleFeature,
      loading: authLoading || loading,
      saving,
    }),
    [partner, verticals, resolved, toggleFeature, authLoading, loading, saving]
  );

  /* ── Loading gate ── */
  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--cardeal-primary)]" />
      </div>
    );
  }

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}
