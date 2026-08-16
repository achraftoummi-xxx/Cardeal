import type { StaticImageData } from "next/image";
import alfaMitoBlack from "@/assets/cars/alfa_romeo_mito-black.png";
import alfaMitoRed from "@/assets/cars/alfa_romeo_mito-red.png";
import alfaMitoWhite from "@/assets/cars/alfa_romeo_mito-white.png";
import audiA3White from "@/assets/cars/Audi-A3-white.png";
import cheryQqWhite from "@/assets/cars/Chery-QQ-white.png";
import c1White from "@/assets/cars/Citroen-c1-white-2009-2015.png";
import c3Black from "@/assets/cars/Citroen-c3-black-2009-2015.png";
import c3BlackLate from "@/assets/cars/Citroen-c3-black-2015-2022.png";
import c3DarkGrayEarly from "@/assets/cars/Citroen-c3-dark-gray-2000-2009.png";
import c3Gray from "@/assets/cars/Citroen-c3-gray2009-2015.png";
import c3Red from "@/assets/cars/Citroen-c3-red-2009-2015.png";
import c3White from "@/assets/cars/Citroen-c3-white-2009-2015.png";
import c3WhiteLate from "@/assets/cars/Citroen-c3-white-2015-2022.png";
import c15White from "@/assets/cars/Citroën C15-white.png";
import c4White from "@/assets/cars/Citroen-c4-white-2009-2015.png";
import cElyseeBlue from "@/assets/cars/Citroën Elysée-petrol-blue.png";
import berlingoBlue from "@/assets/cars/Citroen-berlingo-petrol-blue.png";
import ds3Black from "@/assets/cars/Citroen-DS-3-black.png";
import ds3White from "@/assets/cars/Citroen-DS-3-White.png";
import ds4Gray from "@/assets/cars/Citroen-DS-4-gray.png";
import sparkPistache from "@/assets/cars/Chevrolet Spark-pistache.png";
import fiat500DarkGray from "@/assets/cars/fiat-500-dark-gray.png";
import fiat500White from "@/assets/cars/fiat-500-white.png";
import fiat500XBeige from "@/assets/cars/fiat-500-x-beige.png";
import fiatPandaBlack from "@/assets/cars/fiat-panda-black.png";
import fiatPandaWhite from "@/assets/cars/fiat-panda-white.png";
import fiatPuntoBlack from "@/assets/cars/Fiat-punto-black.png";
import fiatPuntoRed from "@/assets/cars/Fiat-punto-red.png";
import fiatPuntoWhite from "@/assets/cars/Fiat-punto-white.png";
import fiatTipo from "@/assets/cars/fiat-tipo.png";
import fiestaBlack from "@/assets/cars/ford fiesta-2010-2014-black.png";
import fiestaBlue from "@/assets/cars/ford fiesta-2014-2017-blue.png";
import fiestaGray from "@/assets/cars/ford fiesta-2014-2017-gray.png";
import fiestaWhite from "@/assets/cars/ford fiesta-2014-2017-white.png";
import focus2010 from "@/assets/cars/ford-focus-2010.png";
import golf5Gray from "@/assets/cars/Golf-5-gray.png";
import hondaCityGray from "@/assets/cars/Honda-city-gray.png";
import hyundaiI10 from "@/assets/cars/Hyundai i10.png";
import hyundaiXcent from "@/assets/cars/Hyundai Xcent.png";
import lanciaGray from "@/assets/cars/Lancia-gray.png";
import miniCooperSuvWhite from "@/assets/cars/Mini-Cooper-SUV-white.png";
import miniCooperWhite from "@/assets/cars/Mini-Cooper-white.png";
import attrageWhite from "@/assets/cars/Mitsuboshi-attrage-white.png";
import qashqaiBlack from "@/assets/cars/nissan-qashqai-black.png";
import qashqaiGray from "@/assets/cars/nissan-qashqai-gray.png";
import qashqaiWhite from "@/assets/cars/nissan-qashqai-white.png";
import corsaGray from "@/assets/cars/opel-corsa-gray.png";
import peugeot208Black from "@/assets/cars/Peugeot 208 Puretech-black.png";
import peugeot208Champagne from "@/assets/cars/Peugeot 208 Puretech-Champagne.png";
import peugeot208DarkGray from "@/assets/cars/Peugeot 208 Puretech-dark-gray.png";
import peugeot208White from "@/assets/cars/Peugeot 208 Puretech-white.png";
import peugeot206Silver from "@/assets/cars/Peugeot 206-silver.png";
import peugeot207Silver from "@/assets/cars/Peugeot 207-silver.png";
import peugeot301Silver from "@/assets/cars/Peugeot 301-Puretech-silver.png";
import peugeot307DarkGray from "@/assets/cars/Peugeot 307-dark-gray.png";
import polo7Gray from "@/assets/cars/POLO7-gray.png";
import clio4White from "@/assets/cars/clio-4-white.png";
import clio5Red from "@/assets/cars/clio-5-red.png";
import kwidGray from "@/assets/cars/Renault Kwid-gray.png";
import megane2Black from "@/assets/cars/MEGANE-2-Black.png";
import megane2Gray from "@/assets/cars/Renault-Megane-2-sedan-gray.png";
import megane2Red from "@/assets/cars/MEGANE-2-RED.png";
import megane2Silver from "@/assets/cars/MEGANE-2-SILVER.png";
import megane3Blue from "@/assets/cars/Renault-Megane-3-blue.png";
import megane3White from "@/assets/cars/Renault-Megane-3-white.png";
import rangeRoverRed from "@/assets/cars/rang-rover-2017-red.png";
import suzukiSwift from "@/assets/cars/SUZUKI-Swift.png";
import suzukiSwiftRed from "@/assets/cars/SUZUKI-Swift-Red.png";
import hiluxWhite from "@/assets/cars/Toyota-Hilux-white.png";
import amarokBlue from "@/assets/cars/volkswagen-amarok-blue.png";
import caddyWhite from "@/assets/cars/volkswagen-caddy-white.png";
import vwUp from "@/assets/cars/volkswagen-UP-white.png";

export type VehicleColor = { id: string; label: string; swatch: string };

export const VEHICLE_COLORS: VehicleColor[] = [
  { id: "black", label: "Noir", swatch: "#16181d" },
  { id: "gray", label: "Gris", swatch: "#8b8f98" },
  { id: "red", label: "Rouge", swatch: "#c0392b" },
  { id: "white", label: "Blanc", swatch: "#f5f5f5" },
  { id: "blue", label: "Bleu", swatch: "#1d4ed8" },
  { id: "beige", label: "Beige", swatch: "#d8c9a3" },
  { id: "champagne", label: "Champagne", swatch: "#e0d2b0" },
  { id: "pistache", label: "Pistache", swatch: "#a8cc6b" },
  { id: "silver", label: "Argent", swatch: "#c0c4cc" },
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
 * Entries are ordered so the most generic picture of a model comes first
 * (used as the final fallback when no color/year entry matches).
 */
export const VEHICLE_IMAGE_CATALOG: VehicleImageAsset[] = [
  { brand: "alfaromeo", model: "mito", color: "white", yearStart: 2008, yearEnd: 2018, src: alfaMitoWhite },
  { brand: "alfaromeo", model: "mito", color: "black", yearStart: 2008, yearEnd: 2018, src: alfaMitoBlack },
  { brand: "alfaromeo", model: "mito", color: "red", yearStart: 2008, yearEnd: 2018, src: alfaMitoRed },
  { brand: "audi", model: "a3", color: "white", yearStart: 2003, yearEnd: 2012, src: audiA3White },
  { brand: "chery", model: "qq", color: "white", src: cheryQqWhite },
  { brand: "chevrolet", model: "spark", color: "pistache", yearStart: 2010, yearEnd: 2015, src: sparkPistache },
  { brand: "citroen", model: "c1", color: "white", yearStart: 2009, yearEnd: 2015, src: c1White },
  { brand: "citroen", model: "c15", color: "white", yearStart: 1984, yearEnd: 2005, src: c15White },
  { brand: "citroen", model: "berlingo", color: "blue", src: berlingoBlue },
  { brand: "citroen", model: "celysee", color: "blue", yearStart: 2012, yearEnd: 2020, src: cElyseeBlue },
  { brand: "citroen", model: "c3", color: "gray", yearStart: 2000, yearEnd: 2009, src: c3DarkGrayEarly },
  { brand: "citroen", model: "c3", color: "black", yearStart: 2009, yearEnd: 2015, src: c3Black },
  { brand: "citroen", model: "c3", color: "black", yearStart: 2015, yearEnd: 2022, src: c3BlackLate },
  { brand: "citroen", model: "c3", color: "gray", yearStart: 2009, yearEnd: 2015, src: c3Gray },
  { brand: "citroen", model: "c3", color: "red", yearStart: 2009, yearEnd: 2015, src: c3Red },
  { brand: "citroen", model: "c3", color: "white", yearStart: 2009, yearEnd: 2015, src: c3White },
  { brand: "citroen", model: "c3", color: "white", yearStart: 2015, yearEnd: 2022, src: c3WhiteLate },
  { brand: "citroen", model: "c4", color: "white", yearStart: 2009, yearEnd: 2015, src: c4White },
  { brand: "citroen", model: "ds3", color: "black", yearStart: 2010, yearEnd: 2019, src: ds3Black },
  { brand: "citroen", model: "ds3", color: "white", yearStart: 2010, yearEnd: 2019, src: ds3White },
  { brand: "citroen", model: "ds4", color: "gray", yearStart: 2011, yearEnd: 2018, src: ds4Gray },
  { brand: "fiat", model: "panda", color: "black", yearStart: 2003, yearEnd: 2012, src: fiatPandaBlack },
  { brand: "fiat", model: "panda", color: "white", yearStart: 2003, yearEnd: 2012, src: fiatPandaWhite },
  { brand: "fiat", model: "punto", color: "white", yearStart: 2005, yearEnd: 2012, src: fiatPuntoWhite },
  { brand: "fiat", model: "punto", color: "black", yearStart: 2005, yearEnd: 2012, src: fiatPuntoBlack },
  { brand: "fiat", model: "punto", color: "red", yearStart: 2005, yearEnd: 2012, src: fiatPuntoRed },
  { brand: "fiat", model: "500", color: "white", src: fiat500White },
  { brand: "fiat", model: "500", color: "gray", src: fiat500DarkGray },
  { brand: "fiat", model: "500x", color: "beige", yearStart: 2014, src: fiat500XBeige },
  { brand: "fiat", model: "tipo", yearStart: 2015, src: fiatTipo },
  { brand: "ford", model: "fiesta", color: "black", yearStart: 2010, yearEnd: 2014, src: fiestaBlack },
  { brand: "ford", model: "fiesta", color: "white", yearStart: 2014, yearEnd: 2017, src: fiestaWhite },
  { brand: "ford", model: "fiesta", color: "blue", yearStart: 2014, yearEnd: 2017, src: fiestaBlue },
  { brand: "ford", model: "fiesta", color: "gray", yearStart: 2014, yearEnd: 2017, src: fiestaGray },
  { brand: "ford", model: "focus", color: "gray", yearStart: 2005, yearEnd: 2011, src: focus2010 },
  { brand: "honda", model: "city", color: "gray", yearStart: 2008, yearEnd: 2013, src: hondaCityGray },
  { brand: "hyundai", model: "i10", src: hyundaiI10 },
  { brand: "hyundai", model: "xcent", src: hyundaiXcent },
  { brand: "lancia", model: "ypsilon", color: "gray", src: lanciaGray },
  { brand: "mini", model: "minicooper", color: "white", src: miniCooperWhite },
  { brand: "mini", model: "minicountryman", color: "white", yearStart: 2010, yearEnd: 2016, src: miniCooperSuvWhite },
  { brand: "mitsubishi", model: "attrage", color: "white", yearStart: 2013, src: attrageWhite },
  { brand: "nissan", model: "qashqai", color: "white", yearStart: 2007, yearEnd: 2013, src: qashqaiWhite },
  { brand: "nissan", model: "qashqai", color: "black", yearStart: 2007, yearEnd: 2013, src: qashqaiBlack },
  { brand: "nissan", model: "qashqai", color: "gray", yearStart: 2007, yearEnd: 2013, src: qashqaiGray },
  { brand: "opel", model: "corsa", color: "gray", src: corsaGray },
  { brand: "peugeot", model: "206", color: "silver", yearStart: 1998, yearEnd: 2009, src: peugeot206Silver },
  { brand: "peugeot", model: "207", color: "silver", yearStart: 2006, yearEnd: 2012, src: peugeot207Silver },
  { brand: "peugeot", model: "301", color: "silver", yearStart: 2012, yearEnd: 2020, src: peugeot301Silver },
  { brand: "peugeot", model: "307", color: "gray", yearStart: 2001, yearEnd: 2008, src: peugeot307DarkGray },
  { brand: "peugeot", model: "208", color: "white", yearStart: 2012, yearEnd: 2019, src: peugeot208White },
  { brand: "peugeot", model: "208", color: "black", yearStart: 2012, yearEnd: 2019, src: peugeot208Black },
  { brand: "peugeot", model: "208", color: "gray", yearStart: 2012, yearEnd: 2019, src: peugeot208DarkGray },
  { brand: "peugeot", model: "208", color: "champagne", yearStart: 2012, yearEnd: 2019, src: peugeot208Champagne },
  { brand: "renault", model: "clio", color: "white", yearStart: 2012, yearEnd: 2019, src: clio4White },
  { brand: "renault", model: "clio", color: "red", yearStart: 2019, src: clio5Red },
  { brand: "renault", model: "kwid", color: "gray", yearStart: 2015, src: kwidGray },
  { brand: "renault", model: "megane", color: "gray", yearStart: 2002, yearEnd: 2009, src: megane2Gray },
  { brand: "renault", model: "megane", color: "black", yearStart: 2002, yearEnd: 2009, src: megane2Black },
  { brand: "renault", model: "megane", color: "red", yearStart: 2002, yearEnd: 2009, src: megane2Red },
  { brand: "renault", model: "megane", color: "silver", yearStart: 2002, yearEnd: 2009, src: megane2Silver },
  { brand: "renault", model: "megane", color: "white", yearStart: 2009, yearEnd: 2016, src: megane3White },
  { brand: "renault", model: "megane", color: "blue", yearStart: 2009, yearEnd: 2016, src: megane3Blue },
  { brand: "landrover", model: "rangerover", color: "red", yearStart: 2013, yearEnd: 2021, src: rangeRoverRed },
  { brand: "suzuki", model: "swift", src: suzukiSwift },
  { brand: "suzuki", model: "swift", color: "red", src: suzukiSwiftRed },
  { brand: "toyota", model: "hilux", color: "white", src: hiluxWhite },
  { brand: "volkswagen", model: "amarok", color: "blue", yearStart: 2010, yearEnd: 2020, src: amarokBlue },
  { brand: "volkswagen", model: "caddy", color: "white", yearStart: 2004, yearEnd: 2015, src: caddyWhite },
  { brand: "volkswagen", model: "golf", color: "gray", yearStart: 2003, yearEnd: 2009, src: golf5Gray },
  { brand: "volkswagen", model: "polo", color: "gray", yearStart: 2009, yearEnd: 2014, src: polo7Gray },
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
 * then model + year range, then any catalog entry for the model.
 * Returns null when no catalog entry matches the selection.
 */
export function resolveVehicleImage(
  brand: string,
  model: string,
  year: string,
  color: string
): VehicleImageAsset | null {
  const b = normalize(brand || "");
  const m = normalize(model || "");
  const y = year ? (Number.isNaN(Number(year)) ? null : Number(year)) : null;
  const c = color || "";

  const candidates = VEHICLE_IMAGE_CATALOG.filter((a) => a.brand === b && a.model === m);
  if (candidates.length === 0) return null;

  const withColor = candidates.filter((a) => a.color === c);
  const withColorInYear = withColor.filter((a) => inYearRange(a, y));
  if (withColorInYear.length > 0) return withColorInYear[0];
  if (withColor.length > 0) return withColor[0];

  const withYear = candidates.filter((a) => inYearRange(a, y));
  if (withYear.length > 0) return withYear[0];

  return candidates[0];
}

/**
 * Resolve the best car picture for a (brand, model, year, color) selection,
 * falling back to the neutral default image when nothing matches.
 */
export function getVehicleImage(
  brand: string,
  model: string,
  year: string,
  color: string
): StaticImageData {
  return resolveVehicleImage(brand, model, year, color)?.src ?? VEHICLE_IMAGE_FALLBACK;
}
