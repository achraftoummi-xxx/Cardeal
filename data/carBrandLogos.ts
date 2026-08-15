import type { StaticImageData } from "next/image";
import abarthLogo from "@/assets/car-brands/abarth.png";
import acuraLogo from "@/assets/car-brands/ACURA.png";
import alfaRomeoLogo from "@/assets/car-brands/Alpha-romeo.png";
import astonMartinLogo from "@/assets/car-brands/ASTON-MARTIN.png";
import audiLogo from "@/assets/car-brands/audi.svg";
import bmwLogo from "@/assets/car-brands/bmw.png";
import buickLogo from "@/assets/car-brands/BUICK.png";
import bydLogo from "@/assets/car-brands/BYD.png";
import cadillacLogo from "@/assets/car-brands/CADILLAC.png";
import cheryLogo from "@/assets/car-brands/Chery.png";
import chevroletLogo from "@/assets/car-brands/Chevrolet.png";
import chryslerLogo from "@/assets/car-brands/chrysler.png";
import citroenPngLogo from "@/assets/car-brands/citroein.png";
import citroenSvgLogo from "@/assets/car-brands/citroen.svg";
import cupraLogo from "@/assets/car-brands/cupra.svg";
import dfskLogo from "@/assets/car-brands/DFSK.png";
import dsLogo from "@/assets/car-brands/DS.png";
import ferrariLogo from "@/assets/car-brands/Ferrari.png";
import fiatLogo from "@/assets/car-brands/fiat.svg";
import fordLogo from "@/assets/car-brands/ford.svg";
import geelyLogo from "@/assets/car-brands/Geely.png";
import gmcLogo from "@/assets/car-brands/GMC.png";
import greatWallLogo from "@/assets/car-brands/Greatwall.png";
import hondaLogo from "@/assets/car-brands/honda.svg";
import hyundaiLogo from "@/assets/car-brands/hyundai.png";
import infinitiLogo from "@/assets/car-brands/INFINITY.png";
import isuzuLogo from "@/assets/car-brands/isuzu.png";
import jacLogo from "@/assets/car-brands/JAC.png";
import kiaLogo from "@/assets/car-brands/kia.svg";
import lanciaLogo from "@/assets/car-brands/Lancia.png";
import landRoverLogo from "@/assets/car-brands/landroover.png";
import lexusLogo from "@/assets/car-brands/Lexus.png";
import mahindraLogo from "@/assets/car-brands/mahindra.svg";
import manLogo from "@/assets/car-brands/MAN.png";
import mazdaLogo from "@/assets/car-brands/mazda.png";
import mercedesLogo from "@/assets/car-brands/mercedes.svg";
import mgLogo from "@/assets/car-brands/MG.png";
import miniLogo from "@/assets/car-brands/mini-cooper.png";
import mitsubishiLogo from "@/assets/car-brands/Mitsubitchi.png";
import nissanLogo from "@/assets/car-brands/Nissan.png";
import opelLogo from "@/assets/car-brands/Opel.png";
import peugeotLogo from "@/assets/car-brands/peugeot.svg";
import porscheLogo from "@/assets/car-brands/porshe.png";
import renaultPngLogo from "@/assets/car-brands/renault.png";
import renaultSvgLogo from "@/assets/car-brands/renault.svg";
import rollsRoyceLogo from "@/assets/car-brands/RollsRoys.png";
import subaruLogo from "@/assets/car-brands/Subaro.png";
import suzukiLogo from "@/assets/car-brands/SUZUKI.png";
import tataLogo from "@/assets/car-brands/TATA.png";
import teslaLogo from "@/assets/car-brands/tESLA.png";
import toyotaLogo from "@/assets/car-brands/toyota.png";
import volvoLogo from "@/assets/car-brands/volvo.png";
import volkswagenLogo from "@/assets/car-brands/VW.png";
import defaultCarBrandLogo from "@/assets/dealers_logos/default.png";

/* Car brand logos — keyed by a normalized brand name (lowercase,
   alphanumeric only) so lookups are case/punctuation-insensitive.
   Covers the brands shipped in assets/car-brands (PNG + SVG); any
   brand without an asset falls back to the default logo. */
const CAR_BRAND_LOGOS: Record<string, { src: string }> = {
  abarth: { src: abarthLogo.src },
  acura: { src: acuraLogo.src },
  alfaromeo: { src: alfaRomeoLogo.src },
  astonmartin: { src: astonMartinLogo.src },
  audi: { src: audiLogo },
  bmw: { src: bmwLogo.src },
  buick: { src: buickLogo.src },
  byd: { src: bydLogo.src },
  cadillac: { src: cadillacLogo.src },
  chery: { src: cheryLogo.src },
  chevrolet: { src: chevroletLogo.src },
  chrysler: { src: chryslerLogo.src },
  citroen: { src: citroenSvgLogo ?? citroenPngLogo.src },
  cupra: { src: cupraLogo },
  dfsk: { src: dfskLogo.src },
  ds: { src: dsLogo.src },
  dsautomobiles: { src: dsLogo.src },
  ferrari: { src: ferrariLogo.src },
  fiat: { src: fiatLogo },
  ford: { src: fordLogo },
  geely: { src: geelyLogo.src },
  gmc: { src: gmcLogo.src },
  greatwallmotors: { src: greatWallLogo.src },
  honda: { src: hondaLogo },
  hyundai: { src: hyundaiLogo.src },
  infiniti: { src: infinitiLogo.src },
  isuzu: { src: isuzuLogo.src },
  jac: { src: jacLogo.src },
  kia: { src: kiaLogo },
  lancia: { src: lanciaLogo.src },
  landrover: { src: landRoverLogo.src },
  lexus: { src: lexusLogo.src },
  mahindra: { src: mahindraLogo },
  man: { src: manLogo.src },
  mazda: { src: mazdaLogo.src },
  mercedes: { src: mercedesLogo },
  mg: { src: mgLogo.src },
  mini: { src: miniLogo.src },
  minicooper: { src: miniLogo.src },
  mitsubishi: { src: mitsubishiLogo.src },
  nissan: { src: nissanLogo.src },
  opel: { src: opelLogo.src },
  peugeot: { src: peugeotLogo },
  porsche: { src: porscheLogo.src },
  renault: { src: renaultSvgLogo ?? renaultPngLogo.src },
  rollsroyce: { src: rollsRoyceLogo.src },
  subaru: { src: subaruLogo.src },
  suzuki: { src: suzukiLogo.src },
  tatamotors: { src: tataLogo.src },
  tata: { src: tataLogo.src },
  tesla: { src: teslaLogo.src },
  toyota: { src: toyotaLogo.src },
  volkswagen: { src: volkswagenLogo.src },
  vw: { src: volkswagenLogo.src },
  volvo: { src: volvoLogo.src },
};

export const DEFAULT_CAR_BRAND_LOGO: { src: string } = {
  src: defaultCarBrandLogo.src,
};

export const normalizeCarBrand = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getCarBrandLogo(name: string): { src: string } {
  return CAR_BRAND_LOGOS[normalizeCarBrand(name)] ?? DEFAULT_CAR_BRAND_LOGO;
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
