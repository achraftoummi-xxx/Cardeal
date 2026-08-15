import type { StaticImageData } from "next/image";
import abarthLogo from "@/assets/car-brands/abarth.png";
import acuraLogo from "@/assets/car-brands/ACURA.png";
import alfaRomeoLogo from "@/assets/car-brands/Alpha-romeo.png";
import astonMartinLogo from "@/assets/car-brands/ASTON-MARTIN.png";
import audiLogo from "@/assets/car-brands/audi.png";
import bmwLogo from "@/assets/car-brands/bmw.png";
import buickLogo from "@/assets/car-brands/BUICK.png";
import bydLogo from "@/assets/car-brands/BYD.png";
import cadillacLogo from "@/assets/car-brands/CADILLAC.png";
import cheryLogo from "@/assets/car-brands/Chery.png";
import chevroletLogo from "@/assets/car-brands/Chevrolet.png";
import chryslerLogo from "@/assets/car-brands/chrysler.png";
import citroenLogo from "@/assets/car-brands/citroen.png";
import cupraLogo from "@/assets/car-brands/cupra.png";
import dfskLogo from "@/assets/car-brands/DFSK.png";
import dsLogo from "@/assets/car-brands/DS.png";
import ferrariLogo from "@/assets/car-brands/Ferrari.png";
import fiatLogo from "@/assets/car-brands/fiat.png";
import fordLogo from "@/assets/car-brands/ford.png";
import geelyLogo from "@/assets/car-brands/Geely.png";
import gmcLogo from "@/assets/car-brands/GMC.png";
import greatWallLogo from "@/assets/car-brands/Greatwall.png";
import hondaLogo from "@/assets/car-brands/honda.png";
import hyundaiLogo from "@/assets/car-brands/hyundai.png";
import infinitiLogo from "@/assets/car-brands/INFINITY.png";
import isuzuLogo from "@/assets/car-brands/isuzu.png";
import jacLogo from "@/assets/car-brands/JAC.png";
import kiaLogo from "@/assets/car-brands/kia.png";
import lanciaLogo from "@/assets/car-brands/Lancia.png";
import landRoverLogo from "@/assets/car-brands/landroover.png";
import lexusLogo from "@/assets/car-brands/Lexus.png";
import mahindraLogo from "@/assets/car-brands/mahindra.png";
import manLogo from "@/assets/car-brands/MAN.png";
import mazdaLogo from "@/assets/car-brands/mazda.png";
import mercedesLogo from "@/assets/car-brands/mercedes.png";
import mgLogo from "@/assets/car-brands/MG.png";
import miniLogo from "@/assets/car-brands/mini-cooper.png";
import mitsubishiLogo from "@/assets/car-brands/Mitsubitchi.png";
import nissanLogo from "@/assets/car-brands/Nissan.png";
import opelLogo from "@/assets/car-brands/Opel.png";
import peugeotLogo from "@/assets/car-brands/peugeot.png";
import porscheLogo from "@/assets/car-brands/porshe.png";
import renaultLogo from "@/assets/car-brands/renault.png";
import rollsRoyceLogo from "@/assets/car-brands/RollsRoys.png";
import subaruLogo from "@/assets/car-brands/Subaro.png";
import suzukiLogo from "@/assets/car-brands/SUZUKI.png";
import tataLogo from "@/assets/car-brands/TATA.png";
import teslaLogo from "@/assets/car-brands/tESLA.png";
import toyotaLogo from "@/assets/car-brands/toyota.png";
import volvoLogo from "@/assets/car-brands/volvo.png";
import volkswagenLogo from "@/assets/car-brands/VW.png";
import defaultCarBrandLogo from "@/assets/dealers_logos/default.png";

/* File registry — keyed by the normalized filename stem of every asset
   actually present in assets/car-brands (lowercase, alphanumeric only).
   Because keys are derived from the exact on-disk filenames, lookups are
   case- and separator-insensitive regardless of how the files are named
   (Alpha-romeo.png, tESLA.png, VW.png, mini-cooper.png…). */
const CAR_BRAND_FILE_REGISTRY: Record<string, { src: string }> = {
  abarth: { src: abarthLogo.src },
  acura: { src: acuraLogo.src },
  alpharomeo: { src: alfaRomeoLogo.src },
  astonmartin: { src: astonMartinLogo.src },
  audi: { src: audiLogo.src },
  bmw: { src: bmwLogo.src },
  buick: { src: buickLogo.src },
  byd: { src: bydLogo.src },
  cadillac: { src: cadillacLogo.src },
  chery: { src: cheryLogo.src },
  chevrolet: { src: chevroletLogo.src },
  chrysler: { src: chryslerLogo.src },
  citroen: { src: citroenLogo.src },
  cupra: { src: cupraLogo.src },
  dfsk: { src: dfskLogo.src },
  ds: { src: dsLogo.src },
  ferrari: { src: ferrariLogo.src },
  fiat: { src: fiatLogo.src },
  ford: { src: fordLogo.src },
  geely: { src: geelyLogo.src },
  gmc: { src: gmcLogo.src },
  greatwall: { src: greatWallLogo.src },
  honda: { src: hondaLogo.src },
  hyundai: { src: hyundaiLogo.src },
  infinity: { src: infinitiLogo.src },
  isuzu: { src: isuzuLogo.src },
  jac: { src: jacLogo.src },
  kia: { src: kiaLogo.src },
  lancia: { src: lanciaLogo.src },
  landroover: { src: landRoverLogo.src },
  lexus: { src: lexusLogo.src },
  mahindra: { src: mahindraLogo.src },
  man: { src: manLogo.src },
  mazda: { src: mazdaLogo.src },
  mercedes: { src: mercedesLogo.src },
  mg: { src: mgLogo.src },
  minicooper: { src: miniLogo.src },
  mitsubitchi: { src: mitsubishiLogo.src },
  nissan: { src: nissanLogo.src },
  opel: { src: opelLogo.src },
  peugeot: { src: peugeotLogo.src },
  porshe: { src: porscheLogo.src },
  renault: { src: renaultLogo.src },
  rollsroys: { src: rollsRoyceLogo.src },
  subaro: { src: subaruLogo.src },
  suzuki: { src: suzukiLogo.src },
  tata: { src: tataLogo.src },
  tesla: { src: teslaLogo.src },
  toyota: { src: toyotaLogo.src },
  volvo: { src: volvoLogo.src },
  vw: { src: volkswagenLogo.src },
};

/* Brand → asset name mapping. Direct matches are resolved automatically by
   normalized filename (any casing); this table only bridges brand names to
   assets whose filename differs (typos, abbreviations, multi-word variants,
   diacritics like Citroën). */
const BRAND_TO_FILE: Record<string, string> = {
  alfaromeo: "alpharomeo",
  dsautomobiles: "ds",
  greatwallmotors: "greatwall",
  infiniti: "infinity",
  landrover: "landroover",
  mini: "minicooper",
  mitsubishi: "mitsubitchi",
  porsche: "porshe",
  rollsroyce: "rollsroys",
  subaru: "subaro",
  tatamotors: "tata",
  volkswagen: "vw",
};

export const DEFAULT_CAR_BRAND_LOGO: { src: string } = {
  src: defaultCarBrandLogo.src,
};

export const normalizeCarBrand = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

export function getCarBrandLogo(name: string): { src: string } {
  const key = normalizeCarBrand(name);
  if (!key) return DEFAULT_CAR_BRAND_LOGO;
  /* 1) Direct hit: a file whose normalized stem matches the brand name
        (handles any filename casing, e.g. Audi.png, AUDI.png, audi.png). */
  const direct = CAR_BRAND_FILE_REGISTRY[key];
  if (direct) return direct;
  /* 2) Bridged hit: brand name mapped to its on-disk asset name. */
  const alias = BRAND_TO_FILE[key];
  if (alias) return CAR_BRAND_FILE_REGISTRY[alias] ?? DEFAULT_CAR_BRAND_LOGO;
  /* 3) No asset shipped for this brand yet — graceful fallback. */
  return DEFAULT_CAR_BRAND_LOGO;
}

/* Build the region -> country -> brands grouping used by the shared
   BrandSelect dropdown, translating region labels via the caller. */
export function buildCarBrandGroups(
  regions: { id: string; countries: { name: string; flag: string; brands: string[] }[] }[],
  labelFor: (regionId: string) => string
) {
  return regions
    .filter((region) => region.countries.some((c) => c.brands.length > 0))
    .map((region) => ({
      label: labelFor(region.id),
      countries: region.countries
        .filter((c) => c.brands.length > 0)
        .map((c) => ({ name: c.name, flag: c.flag, brands: [...c.brands] })),
    }));
}
