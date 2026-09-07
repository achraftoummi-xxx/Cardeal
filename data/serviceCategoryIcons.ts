/**
 * Icon mapping for automotive service categories and sub-categories.
 * Keys are the canonical French strings from SERVICE_CATEGORY_GROUPS
 * (stable identifiers used for i18n lookups and database seeding).
 *
 * Icons are served as static assets from the `public/` directory
 * (Cloudflare Assets binding) so they are never inlined into the
 * worker bundle — keeping the deployed script far below the
 * Workers size limit.
 */

/** Public base path for the service category icons. */
const ICON_BASE = "/assets/icons";

const icon = (name: string): string => `${ICON_BASE}/${name}`;

/** Icon per main category (falls back to the sub-category map, then a default). */
const CATEGORY_ICONS: Record<string, string> = {
  "Atelier de Mécanique & Entretien": icon("car-oil.png"),
  "Spécialiste Pneumatiques & Géométrie": icon("tires.png"),
  "Vente de Pièces Détachées": icon("engine_diagnostic.png"),
  "Diagnostic & Électronique": icon("diagnostic.png"),
  "Assurance": icon("security_diagnostic.png"),
  "Location de voitures": icon("fuel-station.png"),
  "Autres Services": icon("book_appointment.png"),
};

/** Icon per sub-category, overriding the parent category icon when present. */
const SUB_CATEGORY_ICONS: Record<string, string> = {
  "Révisions et Vidange": icon("car-oil.png"),
  "Plaquettes de freins Avant (Remplacement)": icon("brake-pads.png"),
  "Courroie de distribution - Kit complet (Remplacement)": icon("timing-belt_kit.png"),
  "Amortisseurs Avants (Remplacement)": icon("shock_absorber.png"),
  "Embrayage - Kit complet (Remplacement)": icon("clutch.png"),
  "Pneus - Montage et Équilibrage": icon("tires.png"),
  "Réparation crevaison pneu": icon("punctured-tire_repair.png"),
  "Parallélisme train Avant (Réglage)": icon("wheel-alignment.png"),
  "Pièces Moteur & Filtration": icon("engine_diagnostic.png"),
  "Freinage & Suspension": icon("brake.png"),
  "Électricité & Démarrage": icon("battery.png"),
  "Diagnostic Sécurité & Électronique": icon("security_diagnostic.png"),
  "Recharge Climatisation": icon("ac_charge.png"),
  "Contrôle Circuit de charge": icon("charging_circuit.png"),
  "Assurance Automobile - Tous Risques": icon("security_diagnostic.png"),
  "Assurance Automobile - Au Tiers / Vol / Incendie": icon("security_diagnostic.png"),
  "Assistance Routière & Dépannage": icon("troubleshooting.png"),
  "Location de Véhicules Courte Durée": icon("car-repair.png"),
  "Location de Véhicules Longue Durée (LLD)": icon("car-repair.png"),
  "Location de Voitures de Luxe & Utilitaires": icon("car-repair.png"),
  "Autres services et prestations automobiles": icon("book_appointment.png"),
};

/** Default icon for any unknown or custom category label. */
const DEFAULT_CATEGORY_ICON = icon("car-repair.png");

/** Resolve the icon for a category or sub-category label. */
export function getServiceCategoryIcon(name: string): string {
  return (
    SUB_CATEGORY_ICONS[name] ?? CATEGORY_ICONS[name] ?? DEFAULT_CATEGORY_ICON
  );
}
