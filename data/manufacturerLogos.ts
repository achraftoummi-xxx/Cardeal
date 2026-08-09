import type { StaticImageData } from "next/image";
import valeoLogo from "@/assets/manufacturers/valeo.png";
import boschLogo from "@/assets/manufacturers/Bosch_logo.png";
import bremboLogo from "@/assets/manufacturers/Brembo-logo.png";
import densoLogo from "@/assets/manufacturers/denso.png";
import defaultManufacturerLogo from "@/assets/dealers_logos/default.png";

/* Manufacturer logos — keyed by a normalized brand name (lowercase,
   alphanumeric only) so lookups are case/punctuation-insensitive. */
const MANUFACTURER_LOGOS: Record<string, { src: string }> = {
  valeo: { src: valeoLogo.src },
  bosch: { src: boschLogo.src },
  purflux: { src: "/assets/manufacturers/logo-purfluxgroup.svg" },
  brembo: { src: bremboLogo.src },
  denso: { src: densoLogo.src },
};

export const DEFAULT_MANUFACTURER_LOGO: { src: string } = {
  src: defaultManufacturerLogo.src,
};

export const normalizeManufacturer = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getManufacturerLogo(name: string): { src: string } {
  return MANUFACTURER_LOGOS[normalizeManufacturer(name)] ?? DEFAULT_MANUFACTURER_LOGO;
}
