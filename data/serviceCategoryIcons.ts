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
  "Révisions et Vidange": icon("car-oil.png"),
  Freinage: icon("brake.png"),
  Distribution: icon("timing-belt.png"),
  "Pièces Moteur": icon("engine_diagnostic.png"),
  Embrayage: icon("clutch.png"),
  Suspension: icon("suspension.png"),
  Géométrie: icon("wheel-alignment.png"),
  "Démarrage et Charge": icon("charging.png"),
  Échappement: icon("exhaust.png"),
  Climatisation: icon("airconditionner.png"),
  "Pneumatiques (Hors Achat)": icon("tires.png"),
  Direction: icon("steering-wheel.png"),
  Transmission: icon("drive_train.png"),
  Carrosserie: icon("body-repair.png"),
  "Vision et Pare-Brise": icon("windsheild.png"),
  "Contrôles et Diagnostics": icon("diagnostic.png"),
  "Recherche de Pannes": icon("troubleshooting.png"),
  "Prise de RDV (Autre Problème)": icon("book_appointment.png"),
};

/** Icon per sub-category, overriding the parent category icon when present. */
const SUB_CATEGORY_ICONS: Record<string, string> = {
  "Révisions et Vidange": icon("car-oil.png"),
  "Plaquettes de freins Avant (Remplacement)": icon("brake-pads.png"),
  "Plaquettes de freins Arrière (Remplacement)": icon("brake-pads.png"),
  "Plaquettes de freins Avant/Arrière (Remplacement)": icon("brake-pads.png"),
  "Disques et Plaquettes de freins Avant (Remplacement)": icon("disc-brake.png"),
  "Disques et Plaquettes de freins Arrière (Remplacement)": icon("disc-brake2.png"),
  "Disques et Plaquettes de freins Avant/Arrière (Remplacement)": icon("brake_disk.png"),
  "Kit de frein arrière - mâchoire ou tambour (Remplacement)": icon("brake (1).png"),
  "Liquide de Frein (Remplacement)": icon("brake_oil.png"),
  "Courroie de distribution - Kit complet (Remplacement)": icon("timing-belt_kit.png"),
  "Courroie d’accessoires (Remplacement)": icon("serpentine_belt.png"),
  "Poulie de vilebrequin (Remplacement)": icon("crankshaft_pulley.png"),
  "Injecteurs - Remplacement de tous les injecteurs": icon("injector.png"),
  "Liquide de Refroidissement (Remplacement)": icon("coolant.png"),
  "Thermostat ou calorstat (Remplacement)": icon("thermostat.png"),
  "Injecteur - Remplacement d'un injecteur": icon("injector.png"),
  "Embrayage - Kit complet (Remplacement)": icon("clutch.png"),
  "Embrayage et volant moteur - Kit complet (Remplacement)": icon("flywheel.png"),
  "Amortisseurs Avants (Remplacement)": icon("shock_absorber.png"),
  "Amortisseurs Arrières (Remplacement)": icon("shock_absorber.png"),
  "Amortisseurs Avants/Arrières (Remplacement)": icon("shock_absorber.png"),
  "Triangle de suspensions (non chiffrable)": icon("control_arm.png"),
  "Parallélisme train Avant (Réglage)": icon("wheel-alignment.png"),
  "Parallélisme train Avant/Arrière (Réglage)": icon("wheel-alignment.png"),
  "Batterie (Remplacement)": icon("battery.png"),
  "Bougies d'allumage (Remplacement)": icon("spark-plug.png"),
  "Bougies de préchauffage (Remplacement)": icon("glow_plug.png"),
  "Démarreur (Remplacement)": icon("starter.png"),
  "Alternateur (Remplacement)": icon("alternator.png"),
  "Contrôle Circuit de charge": icon("charging_circuit.png"),
  "Échappement - Silencieux Arrière (Remplacement)": icon("muffler.png"),
  "Vanne EGR (Remplacement)": icon("EGR.png"),
  Décalaminage: icon("decarbonizator.png"),
  "Régénération du filtre à particule (FAP)": icon("regenerator.png"),
  "Recharge Climatisation": icon("ac_charge.png"),
  "Révision Climatisation": icon("airconditionner.png"),
  "Diagnostic Climatisation": icon("airconditionner.png"),
  "Filtre d’habitacle (Remplacement)": icon("airconditionner.png"),
  "Traitement anti-bactérien Climatisation": icon("antibacterial_ac.png"),
  "Réparation crevaison pneu": icon("punctured-tire_repair.png"),
  "Équilibrage des pneus": icon("tires.png"),
  "Pneus - Montage": icon("tires.png"),
  "Kit de roulement arrière (gauche ou droit)": icon("rear_axel.png"),
  "Biellette (Remplacement)": icon("track_rod.png"),
  "Rotules de suspension (Remplacement)": icon("ball-joint.png"),
  "Rotules de direction (Remplacement)": icon("ball-joint.png"),
  "Cardan Avant droit (Remplacement)": icon("cv_joint.png"),
  "Cardan Avant gauche (Remplacement)": icon("cv_joint.png"),
  "Cardan Train Avant (Remplacement)": icon("front_axel.png"),
  "Cardan Arrière droit (Remplacement)": icon("cv_joint.png"),
  "Cardan Arrière gauche (Remplacement)": icon("cv_joint.png"),
  "Cardan Train arrière (Remplacement)": icon("rear_axel.png"),
  "Carrosserie - Rénovation 1 élément": icon("car-painting.png"),
  "Carrosserie - Rénovation 2 éléments": icon("body_work.png"),
  "Remplacement de Pare-brise": icon("windsheild.png"),
  "Réparation de Pare-brise": icon("windshield-repair.png"),
  "Phares - Rénovation des optiques": icon("car-headlight_finish.png"),
  "Phare - Remplacement 1 optique": icon("headlights.png"),
  "Remplacement ampoule ou réglage phare": icon("car-lights_bulb.png"),
  "Diagnostic Sécurité": icon("security_diagnostic.png"),
  "Diagnostic Électronique": icon("electric_diagnostic.png"),
  "Pack contrôle technique": icon("diagnostic.png"),
  "Pré-contrôle technique": icon("diagnostic.png"),
  "Problème de Freinage": icon("brake.png"),
  "Problème de Moteur": icon("engine_diagnostic.png"),
  "Problème d'Embrayage": icon("clutch.png"),
  "Problème de Suspension": icon("suspension.png"),
  "Problème d'Échappement": icon("exhaust.png"),
  "Problème de Roues/Direction": icon("steering-wheel.png"),
  "Problème de Démarrage et Charge": icon("charging.png"),
  "Prendre rendez-vous (Autre Problème)": icon("book_appointment.png"),
};

/** Default icon for any unknown or custom category label. */
const DEFAULT_CATEGORY_ICON = icon("car-repair.png");

/** Resolve the icon for a category or sub-category label. */
export function getServiceCategoryIcon(name: string): string {
  return (
    SUB_CATEGORY_ICONS[name] ?? CATEGORY_ICONS[name] ?? DEFAULT_CATEGORY_ICON
  );
}
