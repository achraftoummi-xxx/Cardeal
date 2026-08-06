/**
 * Icon mapping for automotive service categories and sub-categories.
 * Keys are the canonical French strings from SERVICE_CATEGORY_GROUPS
 * (stable identifiers used for i18n lookups and database seeding).
 */

import carOilIcon from "@/assets/icons/car-oil.png";
import brakeIcon from "@/assets/icons/brake.png";
import brakePadsIcon from "@/assets/icons/brake-pads.png";
import brakeDiskIcon from "@/assets/icons/brake_disk.png";
import discBrakeIcon from "@/assets/icons/disc-brake.png";
import discBrake2Icon from "@/assets/icons/disc-brake2.png";
import brakeDrumIcon from "@/assets/icons/brake (1).png";
import brakeOilIcon from "@/assets/icons/brake_oil.png";
import timingBeltIcon from "@/assets/icons/timing-belt.png";
import timingBeltKitIcon from "@/assets/icons/timing-belt_kit.png";
import serpentineBeltIcon from "@/assets/icons/serpentine_belt.png";
import crankshaftPulleyIcon from "@/assets/icons/crankshaft_pulley.png";
import engineDiagnosticIcon from "@/assets/icons/engine_diagnostic.png";
import injectorIcon from "@/assets/icons/injector.png";
import coolantIcon from "@/assets/icons/coolant.png";
import thermostatIcon from "@/assets/icons/thermostat.png";
import clutchIcon from "@/assets/icons/clutch.png";
import flywheelIcon from "@/assets/icons/flywheel.png";
import suspensionIcon from "@/assets/icons/suspension.png";
import shockAbsorberIcon from "@/assets/icons/shock_absorber.png";
import controlArmIcon from "@/assets/icons/control_arm.png";
import wheelAlignmentIcon from "@/assets/icons/wheel-alignment.png";
import chargingIcon from "@/assets/icons/charging.png";
import batteryIcon from "@/assets/icons/battery.png";
import sparkPlugIcon from "@/assets/icons/spark-plug.png";
import glowPlugIcon from "@/assets/icons/glow_plug.png";
import starterIcon from "@/assets/icons/starter.png";
import alternatorIcon from "@/assets/icons/alternator.png";
import chargingCircuitIcon from "@/assets/icons/charging_circuit.png";
import exhaustIcon from "@/assets/icons/exhaust.png";
import mufflerIcon from "@/assets/icons/muffler.png";
import egrIcon from "@/assets/icons/EGR.png";
import decarbonizatorIcon from "@/assets/icons/decarbonizator.png";
import regeneratorIcon from "@/assets/icons/regenerator.png";
import airConditionnerIcon from "@/assets/icons/airconditionner.png";
import acChargeIcon from "@/assets/icons/ac_charge.png";
import antibacterialAcIcon from "@/assets/icons/antibacterial_ac.png";
import tiresIcon from "@/assets/icons/tires.png";
import puncturedTireRepairIcon from "@/assets/icons/punctured-tire_repair.png";
import steeringWheelIcon from "@/assets/icons/steering-wheel.png";
import rearAxelIcon from "@/assets/icons/rear_axel.png";
import trackRodIcon from "@/assets/icons/track_rod.png";
import ballJointIcon from "@/assets/icons/ball-joint.png";
import driveTrainIcon from "@/assets/icons/drive_train.png";
import cvJointIcon from "@/assets/icons/cv_joint.png";
import frontAxelIcon from "@/assets/icons/front_axel.png";
import bodyRepairIcon from "@/assets/icons/body-repair.png";
import carPaintingIcon from "@/assets/icons/car-painting.png";
import bodyWorkIcon from "@/assets/icons/body_work.png";
import windshieldIcon from "@/assets/icons/windsheild.png";
import windshieldRepairIcon from "@/assets/icons/windshield-repair.png";
import headlightFinishIcon from "@/assets/icons/car-headlight_finish.png";
import headlightsIcon from "@/assets/icons/headlights.png";
import carLightsBulbIcon from "@/assets/icons/car-lights_bulb.png";
import diagnosticIcon from "@/assets/icons/diagnostic.png";
import securityDiagnosticIcon from "@/assets/icons/security_diagnostic.png";
import electricDiagnosticIcon from "@/assets/icons/electric_diagnostic.png";
import troubleshootingIcon from "@/assets/icons/troubleshooting.png";
import bookAppointmentIcon from "@/assets/icons/book_appointment.png";
import carRepairIcon from "@/assets/icons/car-repair.png";

/** Icon per main category (falls back to the sub-category map, then a default). */
const CATEGORY_ICONS: Record<string, string> = {
  "Révisions et Vidange": carOilIcon.src,
  Freinage: brakeIcon.src,
  Distribution: timingBeltIcon.src,
  "Pièces Moteur": engineDiagnosticIcon.src,
  Embrayage: clutchIcon.src,
  Suspension: suspensionIcon.src,
  Géométrie: wheelAlignmentIcon.src,
  "Démarrage et Charge": chargingIcon.src,
  Échappement: exhaustIcon.src,
  Climatisation: airConditionnerIcon.src,
  "Pneumatiques (Hors Achat)": tiresIcon.src,
  Direction: steeringWheelIcon.src,
  Transmission: driveTrainIcon.src,
  Carrosserie: bodyRepairIcon.src,
  "Vision et Pare-Brise": windshieldIcon.src,
  "Contrôles et Diagnostics": diagnosticIcon.src,
  "Recherche de Pannes": troubleshootingIcon.src,
  "Prise de RDV (Autre Problème)": bookAppointmentIcon.src,
};

/** Icon per sub-category, overriding the parent category icon when present. */
const SUB_CATEGORY_ICONS: Record<string, string> = {
  "Révisions et Vidange": carOilIcon.src,
  "Plaquettes de freins Avant (Remplacement)": brakePadsIcon.src,
  "Plaquettes de freins Arrière (Remplacement)": brakePadsIcon.src,
  "Plaquettes de freins Avant/Arrière (Remplacement)": brakePadsIcon.src,
  "Disques et Plaquettes de freins Avant (Remplacement)": discBrakeIcon.src,
  "Disques et Plaquettes de freins Arrière (Remplacement)": discBrake2Icon.src,
  "Disques et Plaquettes de freins Avant/Arrière (Remplacement)": brakeDiskIcon.src,
  "Kit de frein arrière - mâchoire ou tambour (Remplacement)": brakeDrumIcon.src,
  "Liquide de Frein (Remplacement)": brakeOilIcon.src,
  "Courroie de distribution - Kit complet (Remplacement)": timingBeltKitIcon.src,
  "Courroie d’accessoires (Remplacement)": serpentineBeltIcon.src,
  "Poulie de vilebrequin (Remplacement)": crankshaftPulleyIcon.src,
  "Injecteurs - Remplacement de tous les injecteurs": injectorIcon.src,
  "Liquide de Refroidissement (Remplacement)": coolantIcon.src,
  "Thermostat ou calorstat (Remplacement)": thermostatIcon.src,
  "Injecteur - Remplacement d'un injecteur": injectorIcon.src,
  "Embrayage - Kit complet (Remplacement)": clutchIcon.src,
  "Embrayage et volant moteur - Kit complet (Remplacement)": flywheelIcon.src,
  "Amortisseurs Avants (Remplacement)": shockAbsorberIcon.src,
  "Amortisseurs Arrières (Remplacement)": shockAbsorberIcon.src,
  "Amortisseurs Avants/Arrières (Remplacement)": shockAbsorberIcon.src,
  "Triangle de suspensions (non chiffrable)": controlArmIcon.src,
  "Parallélisme train Avant (Réglage)": wheelAlignmentIcon.src,
  "Parallélisme train Avant/Arrière (Réglage)": wheelAlignmentIcon.src,
  "Batterie (Remplacement)": batteryIcon.src,
  "Bougies d'allumage (Remplacement)": sparkPlugIcon.src,
  "Bougies de préchauffage (Remplacement)": glowPlugIcon.src,
  "Démarreur (Remplacement)": starterIcon.src,
  "Alternateur (Remplacement)": alternatorIcon.src,
  "Contrôle Circuit de charge": chargingCircuitIcon.src,
  "Échappement - Silencieux Arrière (Remplacement)": mufflerIcon.src,
  "Vanne EGR (Remplacement)": egrIcon.src,
  Décalaminage: decarbonizatorIcon.src,
  "Régénération du filtre à particule (FAP)": regeneratorIcon.src,
  "Recharge Climatisation": acChargeIcon.src,
  "Révision Climatisation": airConditionnerIcon.src,
  "Diagnostic Climatisation": airConditionnerIcon.src,
  "Filtre d’habitacle (Remplacement)": airConditionnerIcon.src,
  "Traitement anti-bactérien Climatisation": antibacterialAcIcon.src,
  "Réparation crevaison pneu": puncturedTireRepairIcon.src,
  "Équilibrage des pneus": tiresIcon.src,
  "Pneus - Montage": tiresIcon.src,
  "Kit de roulement arrière (gauche ou droit)": rearAxelIcon.src,
  "Biellette (Remplacement)": trackRodIcon.src,
  "Rotules de suspension (Remplacement)": ballJointIcon.src,
  "Rotules de direction (Remplacement)": ballJointIcon.src,
  "Cardan Avant droit (Remplacement)": cvJointIcon.src,
  "Cardan Avant gauche (Remplacement)": cvJointIcon.src,
  "Cardan Train Avant (Remplacement)": frontAxelIcon.src,
  "Cardan Arrière droit (Remplacement)": cvJointIcon.src,
  "Cardan Arrière gauche (Remplacement)": cvJointIcon.src,
  "Cardan Train arrière (Remplacement)": rearAxelIcon.src,
  "Carrosserie - Rénovation 1 élément": carPaintingIcon.src,
  "Carrosserie - Rénovation 2 éléments": bodyWorkIcon.src,
  "Remplacement de Pare-brise": windshieldIcon.src,
  "Réparation de Pare-brise": windshieldRepairIcon.src,
  "Phares - Rénovation des optiques": headlightFinishIcon.src,
  "Phare - Remplacement 1 optique": headlightsIcon.src,
  "Remplacement ampoule ou réglage phare": carLightsBulbIcon.src,
  "Diagnostic Sécurité": securityDiagnosticIcon.src,
  "Diagnostic Électronique": electricDiagnosticIcon.src,
  "Pack contrôle technique": diagnosticIcon.src,
  "Pré-contrôle technique": diagnosticIcon.src,
  "Problème de Freinage": brakeIcon.src,
  "Problème de Moteur": engineDiagnosticIcon.src,
  "Problème d'Embrayage": clutchIcon.src,
  "Problème de Suspension": suspensionIcon.src,
  "Problème d'Échappement": exhaustIcon.src,
  "Problème de Roues/Direction": steeringWheelIcon.src,
  "Problème de Démarrage et Charge": chargingIcon.src,
  "Prendre rendez-vous (Autre Problème)": bookAppointmentIcon.src,
};

/** Default icon for any unknown or custom category label. */
const DEFAULT_CATEGORY_ICON = carRepairIcon.src;

/** Resolve the icon for a category or sub-category label. */
export function getServiceCategoryIcon(name: string): string {
  return (
    SUB_CATEGORY_ICONS[name] ?? CATEGORY_ICONS[name] ?? DEFAULT_CATEGORY_ICON
  );
}
