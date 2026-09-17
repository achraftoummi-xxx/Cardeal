"use client";

import React, { useCallback, useState } from "react";
import {
  Settings,
  Lock,
  AlertTriangle,
  Info,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useBusiness } from "@/components/business/BusinessProvider";
import {
  FEATURES,
  featuresByCategory,
  dependenciesMet,
  dependentsOf,
  FEATURE_CATEGORIES,
  type FeatureCategory,
  type FeatureDefinition,
} from "@/lib/business/features";

function FeatureToggle({
  feature,
  state,
  onToggle,
  saving,
  disabledReason,
}: {
  feature: FeatureDefinition;
  state: { enabled: boolean; mandatory: boolean; killSwitched: boolean; depsMet: boolean; missingDeps: string[] };
  onToggle: (enabled: boolean) => void;
  saving: boolean;
  disabledReason: string | null;
}) {
  const Icon = feature.icon;
  const canToggle = !state.mandatory && !state.killSwitched && state.depsMet;

  return (
    <div
      className={`flex items-center gap-4 rounded-xl border px-4 py-4 transition-colors ${
        state.enabled
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-border bg-secondary/30"
      } ${!canToggle && !state.mandatory ? "opacity-60" : ""}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          state.enabled
            ? "bg-emerald-500/20 text-emerald-500"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">
            {feature.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </p>
          {state.mandatory && (
            <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
              Required
            </span>
          )}
          {state.killSwitched && (
            <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-500">
              Disabled by Admin
            </span>
          )}
        </div>
        {!state.depsMet && state.missingDeps.length > 0 && (
          <p className="mt-0.5 text-[11px] text-amber-500 flex items-center gap-1">
            <AlertTriangle size={11} />
            Requires: {state.missingDeps.map((d) => FEATURES[d]?.id ?? d).join(", ")}
          </p>
        )}
      </div>

      <button
        type="button"
        disabled={!canToggle || saving}
        onClick={() => onToggle(!state.enabled)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          state.enabled ? "bg-emerald-500" : "bg-muted"
        } ${!canToggle ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        role="switch"
        aria-checked={state.enabled}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            state.enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function FeaturesSettingsPage() {
  const { resolved, toggleFeature, saving, partner, verticals } = useBusiness();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(FEATURE_CATEGORIES.map((c) => c.id))
  );

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  const handleToggle = useCallback(
    (featureId: string, enabled: boolean) => {
      // If disabling, check for dependents
      if (!enabled) {
        const affected = dependentsOf(featureId);
        const activeDependents = affected.filter(
          (depId) => resolved.features[depId]?.enabled
        );
        if (activeDependents.length > 0) {
          const names = activeDependents
            .map((d) => FEATURES[d]?.id?.replace(/_/g, " ") ?? d)
            .join(", ");
          if (
            !window.confirm(
              `Disabling this feature will also turn off: ${names}. Continue?`
            )
          ) {
            return;
          }
          // Disable dependents first
          for (const depId of activeDependents) {
            toggleFeature(depId, false);
          }
        }
      }
      toggleFeature(featureId, enabled);
    },
    [resolved.features, toggleFeature]
  );

  const grouped = featuresByCategory();

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">
              Feature Settings
            </h1>
            <p className="text-xs text-muted-foreground">
              Enable or disable features for your business portal
            </p>
          </div>
        </div>
      </div>

      {/* Partner Info */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3 text-sm">
          <Info size={16} className="text-muted-foreground shrink-0" />
          <p className="text-muted-foreground">
            Features are resolved based on your business vertical
            {verticals.length > 0 && (
              <>
                {" "}(
                {verticals.map((v) => v.replace(/_/g, " ")).join(", ")}
                )
              </>
            )}
            , your custom overrides, and platform-wide settings. Mandatory features
            cannot be disabled.
          </p>
        </div>
      </div>

      {/* Feature Groups */}
      <div className="space-y-4">
        {FEATURE_CATEGORIES.map((cat) => {
          const features = grouped[cat.id] || [];
          const expanded = expandedCategories.has(cat.id);
          const enabledCount = features.filter(
            (f) => resolved.features[f.id]?.enabled
          ).length;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
            >
              {/* Category Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expanded ? (
                    <ChevronDown size={18} className="text-muted-foreground" />
                  ) : (
                    <ChevronRight size={18} className="text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-bold font-['Space_Grotesk'] text-foreground capitalize">
                      {cat.id}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {enabledCount}/{features.length} active
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {features.map((f) => (
                    <span
                      key={f.id}
                      className={`h-2 w-2 rounded-full ${
                        resolved.features[f.id]?.enabled
                          ? "bg-emerald-500"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </button>

              {/* Feature List */}
              {expanded && (
                <div className="border-t border-border px-6 py-4 space-y-3">
                  {features.map((feature) => {
                    const state = resolved.features[feature.id];
                    if (!state) return null;

                    let disabledReason: string | null = null;
                    if (state.mandatory) disabledReason = "This feature is required and cannot be disabled.";
                    else if (state.killSwitched) disabledReason = "This feature has been disabled by the platform.";
                    else if (!state.depsMet) disabledReason = `Missing dependencies: ${state.missingDeps.join(", ")}`;

                    return (
                      <FeatureToggle
                        key={feature.id}
                        feature={feature}
                        state={state}
                        onToggle={(enabled) => handleToggle(feature.id, enabled)}
                        saving={saving}
                        disabledReason={disabledReason}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
