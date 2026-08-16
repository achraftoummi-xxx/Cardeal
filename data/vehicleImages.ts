import type { StaticImageData } from "next/image";
import c3Black from "@/assets/cars/Citroen-c3-black-2009-2015.png";
import c3Gray from "@/assets/cars/Citroen-c3-gray2009-2015.png";
import c3Red from "@/assets/cars/Citroen-c3-red-2009-2015.png";
import c3White from "@/assets/cars/Citroen-c3-white-2009-2015.png";
import golf5Gray from "@/assets/cars/Golf-5-gray.png";
import hyundaiI10 from "@/assets/cars/Hyundai i10.png";
import hyundaiXcent from "@/assets/cars/Hyundai Xcent.png";
import peugeot208 from "@/assets/cars/Peugeot 208 Puretech.png";
import polo7Gray from "@/assets/cars/POLO7-gray.png";
import suzukiSwift from "@/assets/cars/SUZUKI-Swift.png";
import suzukiSwiftRed from "@/assets/cars/SUZUKI-Swift-Red.png";
import vwUp from "@/assets/cars/VW-UP.png";

export type VehicleColor = { id: string; label: string; swatch: string };

export const VEHICLE_COLORS: VehicleColor[] = [
  { id: "black", label: "Noir", swatch: "#16181d" },
  { id: "gray", label: "Gris", swatch: "#8b8f98" },
  { id: "red", label: "Rouge", swatch: "#c0392b" },
  { id: "white", label: "Blanc", swatch: "#f5f5f5" },
];

export function getVehicleColorLabel(id: string): string {
  if (!id) return "";
  return VEHICLE_COLORS.find((c) => c.id === id)?.label ?? id;
}

export type VehicleImageAsset = {
  brand: string;
  model: string;
  color?: string;
  yearStart?: number;
  yearEnd?: number;
  src: StaticImageData;
};

/**
 * Catalog of car pictures available under assets/cars.
 * Brand/model keys are normalized (lowercase, no accents, no punctuation)
 * so selections from the settings form match regardless of spelling.
 */
export const VEHICLE_IMAGE_CATALOG: VehicleImageAsset[] = [
  { brand: "citroen", model: "c3", color: "black", yearStart: 2009, yearEnd: 2015, src: c3Black },
  { brand: "citroen", model: "c3", color: "gray", yearStart: 2009, yearEnd: 2015, src: c3Gray },
  { brand: "citroen", model: "c3", color: "red", yearStart: 2009, yearEnd: 2015, src: c3Red },
  { brand: "citroen", model: "c3", color: "white", yearStart: 2009, yearEnd: 2015, src: c3White },
  { brand: "volkswagen", model: "golf", color: "gray", yearStart: 2003, yearEnd: 2009, src: golf5Gray },
  { brand: "volkswagen", model: "polo", color: "gray", yearStart: 2009, yearEnd: 2014, src: polo7Gray },
  { brand: "hyundai", model: "i10", src: hyundaiI10 },
  { brand: "hyundai", model: "xcent", src: hyundaiXcent },
  { brand: "peugeot", model: "208", src: peugeot208 },
  { brand: "suzuki", model: "swift", color: "red", src: suzukiSwiftRed },
  { brand: "suzuki", model: "swift", src: suzukiSwift },
  { brand: "volkswagen", model: "up", src: vwUp },
];

/** Neutral picture shown when no catalog entry matches the selection. */
export const VEHICLE_IMAGE_FALLBACK: StaticImageData = vwUp;

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function inYearRange(asset: VehicleImageAsset, year: number | null): boolean {
  if (year === null) return true;
  const { yearStart, yearEnd } = asset;
  if (yearStart !== undefined && year < yearStart) return false;
  if (yearEnd !== undefined && year > yearEnd) return false;
  return true;
}

/**
 * Resolve the best car picture for a (brand, model, year, color) selection.
 * Priority: exact model + color + year range, then model + color,
 * then model + year range, then any catalog entry for the model,
 * and finally the default fallback image.
 */
export function getVehicleImage(
  brand: string,
  model: string,
  year: string,
  color: string
): StaticImageData {
  const b = normalize(brand || "");
  const m = normalize(model || "");
  const y = year ? (Number.isNaN(Number(year)) ? null : Number(year)) : null;
  const c = color || "";

  const candidates = VEHICLE_IMAGE_CATALOG.filter((a) => a.brand === b && a.model === m);
  if (candidates.length === 0) return VEHICLE_IMAGE_FALLBACK;

  const withColor = candidates.filter((a) => a.color === c);
  const withColorInYear = withColor.filter((a) => inYearRange(a, y));
  if (withColorInYear.length > 0) return withColorInYear[0].src;
  if (withColor.length > 0) return withColor[0].src;

  const withYear = candidates.filter((a) => inYearRange(a, y));
  if (withYear.length > 0) return withYear[0].src;

  return candidates[0].src;
}
