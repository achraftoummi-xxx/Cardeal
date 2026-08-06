import type { StaticImageData } from "next/image";
import michelinLogo from "@/assets/images/michelin.png";
import bridgestoneLogo from "@/assets/images/Bridgestone.png";
import continentalLogo from "@/assets/images/continental.png";
import pirelliLogo from "@/assets/images/Pirelli.png";
import goodyearLogo from "@/assets/images/goodyear.png";
import hankookLogo from "@/assets/images/hankook.png";

/* Tire brand logos — keyed by a normalized brand name (lowercase,
   alphanumeric only) so lookups are case/punctuation-insensitive. */
const TIRE_BRAND_LOGOS: Record<string, StaticImageData> = {
  michelin: michelinLogo,
  bridgestone: bridgestoneLogo,
  continental: continentalLogo,
  pirelli: pirelliLogo,
  goodyear: goodyearLogo,
  hankook: hankookLogo,
};

export const normalizeBrand = (brand: string) =>
  brand.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getTireBrandLogo(brand: string): StaticImageData | null {
  return TIRE_BRAND_LOGOS[normalizeBrand(brand)] ?? null;
}
