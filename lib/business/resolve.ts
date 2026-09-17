import {
  FEATURES,
  FEATURE_IDS,
  dependenciesMet,
  type FeatureVertical,
  type FeatureDefinition,
} from "./features";

export type FeatureState = {
  /** Whether the feature is available for this partner (resolved). */
  enabled: boolean;
  /** Whether the partner explicitly toggled this feature. Null = using default. */
  override: boolean | null;
  /** Whether the feature is disabled by a platform-wide kill-switch. */
  killSwitched: boolean;
  /** Whether the feature is mandatory and cannot be toggled off. */
  mandatory: boolean;
  /** Whether required dependencies are satisfied. */
  depsMet: boolean;
  /** Missing dependency IDs (for display). */
  missingDeps: string[];
};

export type ResolvedFeatures = {
  /** Map of featureId -> resolved state. */
  features: Record<string, FeatureState>;
  /** Convenience set of enabled feature IDs. */
  enabledSet: Set<string>;
  /** Features grouped by category for the settings UI. */
  byCategory: Record<string, FeatureDefinition[]>;
};

/**
 * Platform-wide kill-switches.
 * Set a feature ID to `true` to disable it for ALL partners regardless of
 * their individual settings. Useful for rolling back broken features.
 */
const KILL_SWITCHES: Record<string, boolean> = {};

/**
 * Resolve the effective feature set for a partner.
 *
 * Resolution order (highest priority first):
 * 1. Platform kill-switch  → feature OFF
 * 2. Mandatory flag        → feature ON (always)
 * 3. Partner override      → partner's explicit toggle
 * 4. Default verticals     → enabled if partner's vertical matches or list is empty
 *
 * After the above, any feature whose dependencies are not satisfied is forced OFF.
 */
export function resolveFeatures(
  partnerVerticals: FeatureVertical[],
  partnerOverrides: Record<string, boolean> | null
): ResolvedFeatures {
  const states: Record<string, FeatureState> = {};

  for (const id of FEATURE_IDS) {
    const def = FEATURES[id];
    const killSwitched = KILL_SWITCHES[id] === true;
    const override = partnerOverrides?.[id] ?? null;
    const mandatory = def.mandatory;

    let enabled: boolean;

    if (killSwitched) {
      enabled = false;
    } else if (mandatory) {
      enabled = true;
    } else if (override !== null) {
      enabled = override;
    } else {
      // Default: enabled if defaultVerticals is empty (all verticals) or partner's vertical is listed
      enabled =
        def.defaultVerticals.length === 0 ||
        def.defaultVerticals.some((v) => partnerVerticals.includes(v));
    }

    states[id] = {
      enabled,
      override,
      killSwitched,
      mandatory,
      depsMet: true,
      missingDeps: [],
    };
  }

  // Enforce dependency constraints (iterate twice to handle chains)
  for (let pass = 0; pass < 3; pass++) {
    for (const id of FEATURE_IDS) {
      const state = states[id];
      if (!state || state.killSwitched || state.mandatory) continue;

      const def = FEATURES[id];
      const missing = def.dependencies.filter((dep) => !states[dep]?.enabled);
      state.missingDeps = missing;
      state.depsMet = missing.length === 0;

      if (!state.depsMet && state.enabled) {
        state.enabled = false;
      }
    }
  }

  const enabledSet = new Set(
    Object.entries(states)
      .filter(([, s]) => s.enabled)
      .map(([id]) => id)
  );

  // Group by category
  const byCategory: Record<string, FeatureDefinition[]> = {};
  for (const id of FEATURE_IDS) {
    const def = FEATURES[id];
    if (!byCategory[def.category]) byCategory[def.category] = [];
    byCategory[def.category].push(def);
  }

  return { features: states, enabledSet, byCategory };
}

/**
 * Check if a specific feature is enabled for the resolved state.
 */
export function isFeatureEnabled(
  resolved: ResolvedFeatures,
  featureId: string
): boolean {
  return resolved.features[featureId]?.enabled ?? false;
}

/**
 * Validate whether a proposed override set is consistent
 * (no dangling dependencies). Returns list of affected feature IDs.
 */
export function validateOverrides(
  overrides: Record<string, boolean>
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];

  // Build a temporary resolved set from the overrides
  const tempEnabled = new Set<string>();
  for (const [id, on] of Object.entries(overrides)) {
    if (on) tempEnabled.add(id);
  }
  // Always-on features
  for (const id of FEATURE_IDS) {
    if (FEATURES[id].mandatory) tempEnabled.add(id);
  }

  for (const [id, on] of Object.entries(overrides)) {
    if (!on) continue;
    const def = FEATURES[id];
    if (!def) continue;
    for (const dep of def.dependencies) {
      if (!tempEnabled.has(dep)) {
        violations.push(id);
        break;
      }
    }
  }

  return { valid: violations.length === 0, violations };
}
