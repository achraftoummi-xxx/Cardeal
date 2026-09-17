import {
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
  type LucideIcon,
} from "lucide-react";

export type FeatureCategory = "core" | "operations" | "finance" | "growth" | "advanced";

export type FeatureVertical =
  | "workshop"
  | "tire_shop"
  | "body_shop"
  | "dealership"
  | "rental"
  | "mobile_mechanic";

export type FeatureDefinition = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: LucideIcon;
  category: FeatureCategory;
  /** Default verticals this feature is enabled for. Empty = all verticals. */
  defaultVerticals: FeatureVertical[];
  /** Features that must be enabled before this one can be turned on. */
  dependencies: string[];
  /** If true, the partner cannot toggle this off. */
  mandatory: boolean;
  /** Route path relative to /business (e.g. "jobs", "settings/features"). */
  route: string;
};

/**
 * Canonical feature registry.
 * Order within each category determines display order in the settings UI.
 */
export const FEATURES: Record<string, FeatureDefinition> = {
  /* ─── Core ─── */
  jobs: {
    id: "jobs",
    labelKey: "business.features.jobs",
    descriptionKey: "business.features.jobsDesc",
    icon: Hammer,
    category: "core",
    defaultVerticals: [],
    dependencies: [],
    mandatory: true,
    route: "jobs",
  },
  messages: {
    id: "messages",
    labelKey: "business.features.messages",
    descriptionKey: "business.features.messagesDesc",
    icon: MessageSquare,
    category: "core",
    defaultVerticals: [],
    dependencies: [],
    mandatory: true,
    route: "messages",
  },
  quotes: {
    id: "quotes",
    labelKey: "business.features.quotes",
    descriptionKey: "business.features.quotesDesc",
    icon: FileText,
    category: "core",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "quotes",
  },

  /* ─── Operations ─── */
  schedule: {
    id: "schedule",
    labelKey: "business.features.schedule",
    descriptionKey: "business.features.scheduleDesc",
    icon: CalendarClock,
    category: "operations",
    defaultVerticals: [],
    dependencies: ["jobs"],
    mandatory: false,
    route: "schedule",
  },
  catalog: {
    id: "catalog",
    labelKey: "business.features.catalog",
    descriptionKey: "business.features.catalogDesc",
    icon: Package,
    category: "operations",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "catalog",
  },
  fleet: {
    id: "fleet",
    labelKey: "business.features.fleet",
    descriptionKey: "business.features.fleetDesc",
    icon: Truck,
    category: "operations",
    defaultVerticals: ["rental", "dealership", "mobile_mechanic"],
    dependencies: [],
    mandatory: false,
    route: "fleet",
  },
  claims: {
    id: "claims",
    labelKey: "business.features.claims",
    descriptionKey: "business.features.claimsDesc",
    icon: ShieldCheck,
    category: "operations",
    defaultVerticals: ["workshop", "body_shop"],
    dependencies: ["jobs"],
    mandatory: false,
    route: "claims",
  },

  /* ─── Finance ─── */
  invoices: {
    id: "invoices",
    labelKey: "business.features.invoices",
    descriptionKey: "business.features.invoicesDesc",
    icon: Receipt,
    category: "finance",
    defaultVerticals: [],
    dependencies: ["jobs"],
    mandatory: false,
    route: "invoices",
  },
  payouts: {
    id: "payouts",
    labelKey: "business.features.payouts",
    descriptionKey: "business.features.payoutsDesc",
    icon: Banknote,
    category: "finance",
    defaultVerticals: [],
    dependencies: ["invoices"],
    mandatory: false,
    route: "payouts",
  },

  /* ─── Growth ─── */
  reviews: {
    id: "reviews",
    labelKey: "business.features.reviews",
    descriptionKey: "business.features.reviewsDesc",
    icon: Star,
    category: "growth",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "reviews",
  },
  team: {
    id: "team",
    labelKey: "business.features.team",
    descriptionKey: "business.features.teamDesc",
    icon: Users,
    category: "growth",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "team",
  },
  analytics: {
    id: "analytics",
    labelKey: "business.features.analytics",
    descriptionKey: "business.features.analyticsDesc",
    icon: BarChart3,
    category: "growth",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "analytics",
  },

  /* ─── Advanced ─── */
  integrations: {
    id: "integrations",
    labelKey: "business.features.integrations",
    descriptionKey: "business.features.integrationsDesc",
    icon: Plug,
    category: "advanced",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "integrations",
  },
  api_access: {
    id: "api_access",
    labelKey: "business.features.apiAccess",
    descriptionKey: "business.features.apiAccessDesc",
    icon: Key,
    category: "advanced",
    defaultVerticals: [],
    dependencies: [],
    mandatory: false,
    route: "api-access",
  },
};

export const FEATURE_IDS = Object.keys(FEATURES) as (keyof typeof FEATURES)[];

export const FEATURE_CATEGORIES: { id: FeatureCategory; labelKey: string }[] = [
  { id: "core", labelKey: "business.categories.core" },
  { id: "operations", labelKey: "business.categories.operations" },
  { id: "finance", labelKey: "business.categories.finance" },
  { id: "growth", labelKey: "business.categories.growth" },
  { id: "advanced", labelKey: "business.categories.advanced" },
];

/** Features grouped by category for the settings UI. */
export function featuresByCategory(): Record<FeatureCategory, FeatureDefinition[]> {
  const grouped = {} as Record<FeatureCategory, FeatureDefinition[]>;
  for (const cat of FEATURE_CATEGORIES) {
    grouped[cat.id] = [];
  }
  for (const f of Object.values(FEATURES)) {
    grouped[f.category].push(f);
  }
  return grouped;
}

/** Check whether a feature's dependencies are all satisfied. */
export function dependenciesMet(
  featureId: string,
  activeFeatures: Set<string>
): boolean {
  const def = FEATURES[featureId];
  if (!def) return false;
  return def.dependencies.every((dep) => activeFeatures.has(dep));
}

/** Return feature IDs that would become invalid if `featureId` were disabled. */
export function dependentsOf(featureId: string): string[] {
  return Object.values(FEATURES)
    .filter((f) => f.dependencies.includes(featureId) && !f.mandatory)
    .map((f) => f.id);
}
