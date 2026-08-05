/**
 * Standardized automotive service categories and sub-categories.
 * The canonical values are French strings used as stable identifiers
 * (database seed, search filters, i18n lookups via `localized(t, "serviceCat", v)`).
 */

export type ServiceCategoryGroup = {
  category: string;
  subCategories: string[];
};

export const SERVICE_CATEGORY_GROUPS: ServiceCategoryGroup[] = [
  {
    category: "Révisions et Vidange",
    subCategories: ["Révisions et Vidange"],
  },
  {
    category: "Freinage",
    subCategories: [
      "Plaquettes de freins Avant (Remplacement)",
      "Plaquettes de freins Arrière (Remplacement)",
      "Plaquettes de freins Avant/Arrière (Remplacement)",
      "Disques et Plaquettes de freins Avant (Remplacement)",
      "Disques et Plaquettes de freins Arrière (Remplacement)",
      "Disques et Plaquettes de freins Avant/Arrière (Remplacement)",
      "Kit de frein arrière - mâchoire ou tambour (Remplacement)",
      "Liquide de Frein (Remplacement)",
    ],
  },
  {
    category: "Distribution",
    subCategories: [
      "Courroie de distribution - Kit complet (Remplacement)",
      "Courroie d’accessoires (Remplacement)",
      "Poulie de vilebrequin (Remplacement)",
    ],
  },
  {
    category: "Pièces Moteur",
    subCategories: [
      "Injecteurs - Remplacement de tous les injecteurs",
      "Liquide de Refroidissement (Remplacement)",
      "Thermostat ou calorstat (Remplacement)",
      "Injecteur - Remplacement d'un injecteur",
    ],
  },
  {
    category: "Embrayage",
    subCategories: [
      "Embrayage - Kit complet (Remplacement)",
      "Embrayage et volant moteur - Kit complet (Remplacement)",
    ],
  },
  {
    category: "Suspension",
    subCategories: [
      "Amortisseurs Avants (Remplacement)",
      "Amortisseurs Arrières (Remplacement)",
      "Amortisseurs Avants/Arrières (Remplacement)",
      "Triangle de suspensions (non chiffrable)",
    ],
  },
  {
    category: "Géométrie",
    subCategories: [
      "Parallélisme train Avant (Réglage)",
      "Parallélisme train Avant/Arrière (Réglage)",
    ],
  },
  {
    category: "Démarrage et Charge",
    subCategories: [
      "Batterie (Remplacement)",
      "Bougies d'allumage (Remplacement)",
      "Bougies de préchauffage (Remplacement)",
      "Démarreur (Remplacement)",
      "Alternateur (Remplacement)",
      "Contrôle Circuit de charge",
    ],
  },
  {
    category: "Échappement",
    subCategories: [
      "Échappement - Silencieux Arrière (Remplacement)",
      "Vanne EGR (Remplacement)",
      "Décalaminage",
      "Régénération du filtre à particule (FAP)",
    ],
  },
  {
    category: "Climatisation",
    subCategories: [
      "Recharge Climatisation",
      "Révision Climatisation",
      "Diagnostic Climatisation",
      "Filtre d’habitacle (Remplacement)",
      "Traitement anti-bactérien Climatisation",
    ],
  },
  {
    category: "Pneumatiques (Hors Achat)",
    subCategories: [
      "Réparation crevaison pneu",
      "Équilibrage des pneus",
      "Pneus - Montage",
    ],
  },
  {
    category: "Direction",
    subCategories: [
      "Kit de roulement arrière (gauche ou droit)",
      "Biellette (Remplacement)",
      "Rotules de suspension (Remplacement)",
      "Rotules de direction (Remplacement)",
    ],
  },
  {
    category: "Transmission",
    subCategories: [
      "Cardan Avant droit (Remplacement)",
      "Cardan Avant gauche (Remplacement)",
      "Cardan Train Avant (Remplacement)",
      "Cardan Arrière droit (Remplacement)",
      "Cardan Arrière gauche (Remplacement)",
      "Cardan Train arrière (Remplacement)",
    ],
  },
  {
    category: "Carrosserie",
    subCategories: [
      "Carrosserie - Rénovation 1 élément",
      "Carrosserie - Rénovation 2 éléments",
    ],
  },
  {
    category: "Vision et Pare-Brise",
    subCategories: [
      "Remplacement de Pare-brise",
      "Réparation de Pare-brise",
      "Phares - Rénovation des optiques",
      "Phare - Remplacement 1 optique",
      "Remplacement ampoule ou réglage phare",
    ],
  },
  {
    category: "Contrôles et Diagnostics",
    subCategories: [
      "Diagnostic Sécurité",
      "Diagnostic Électronique",
      "Pack contrôle technique",
      "Pré-contrôle technique",
    ],
  },
  {
    category: "Recherche de Pannes",
    subCategories: [
      "Problème de Freinage",
      "Problème de Moteur",
      "Problème d'Embrayage",
      "Problème de Suspension",
      "Problème d'Échappement",
      "Problème de Roues/Direction",
      "Problème de Démarrage et Charge",
    ],
  },
  {
    category: "Prise de RDV (Autre Problème)",
    subCategories: ["Prendre rendez-vous (Autre Problème)"],
  },
];

/** Flat list of every selectable sub-category (kept for backward compatibility). */
export const SERVICE_CATEGORIES: string[] = SERVICE_CATEGORY_GROUPS.flatMap(
  (group) => group.subCategories
);

const groupBySubCategory = new Map<string, ServiceCategoryGroup>();
for (const group of SERVICE_CATEGORY_GROUPS) {
  for (const sub of group.subCategories) groupBySubCategory.set(sub, group);
}

/** Parent category name of a sub-category, if any. */
export function getServiceCategoryName(subCategory: string): string | undefined {
  return groupBySubCategory.get(subCategory)?.category;
}

/** Accent-insensitive, case-insensitive normalizer used for search matching. */
export function normalizeServiceText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Filter the category hierarchy for search-as-you-type.
 * A group matches when its category matches (all its sub-categories are kept)
 * or when at least one of its sub-categories matches.
 */
export function searchServiceCategories(query: string): ServiceCategoryGroup[] {
  const q = normalizeServiceText(query.trim());
  if (!q) return SERVICE_CATEGORY_GROUPS;

  return SERVICE_CATEGORY_GROUPS.flatMap((group) => {
    const categoryMatches = normalizeServiceText(group.category).includes(q);
    if (categoryMatches) return [group];
    const subCategories = group.subCategories.filter((sub) =>
      normalizeServiceText(sub).includes(q)
    );
    return subCategories.length > 0 ? [{ ...group, subCategories }] : [];
  });
}
