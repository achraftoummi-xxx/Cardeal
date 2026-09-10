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
    category: "Atelier de Mécanique & Entretien",
    subCategories: [
      "Révisions et Vidange",
      "Plaquettes de freins Avant (Remplacement)",
      "Courroie de distribution - Kit complet (Remplacement)",
      "Amortisseurs Avants (Remplacement)",
      "Embrayage - Kit complet (Remplacement)",
    ],
  },
  {
    category: "Spécialiste Pneumatiques & Géométrie",
    subCategories: [
      "Pneus - Montage et Équilibrage",
      "Réparation crevaison pneu",
      "Parallélisme train Avant (Réglage)",
    ],
  },
  {
    category: "Vente de Pièces Détachées",
    subCategories: [
      "Pièces Moteur & Filtration",
      "Freinage & Suspension",
      "Électricité & Démarrage",
    ],
  },
  {
    category: "Diagnostic & Électronique",
    subCategories: [
      "Diagnostic Sécurité & Électronique",
      "Recharge Climatisation",
      "Contrôle Circuit de charge",
    ],
  },
  {
    category: "Peintures et carosserie",
    subCategories: [
      "Polissage",
      "Stickage",
      "Peinture complète et personnalisée",
      "rénovation des optiques de phare",
    ],
  },
  {
    category: "Assurance",
    subCategories: [
      "Assurance Automobile - Tous Risques",
      "Assurance Automobile - Au Tiers / Vol / Incendie",
      "Assistance Routière & Dépannage",
    ],
  },
  {
    category: "Location de voitures",
    subCategories: [
      "Location de Véhicules Courte Durée",
      "Location de Véhicules Longue Durée (LLD)",
      "Location de Voitures de Luxe & Utilitaires",
    ],
  },
  {
    category: "Autres Services",
    subCategories: ["Autres services et prestations automobiles"],
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
