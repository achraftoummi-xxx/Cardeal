import type { StaticImageData } from "next/image";
import adTunisiaLogo from "@/assets/dealers_logos/logo_AD_tunisia.png";
import benHrizLogo from "@/assets/dealers_logos/benhriz.png";
import bmAutoPartsLogo from "@/assets/dealers_logos/BMautoparts-logo.png";
import globalPiecesAutoLogo from "@/assets/dealers_logos/GPA.png";
import amineLogo from "@/assets/dealers_logos/AMINE.png";
import defaultDealerLogo from "@/assets/dealers_logos/default.png";

/* Dealer logos — keyed by a normalized dealer name (lowercase, alphanumeric
   only) so lookups are case/punctuation-insensitive. Keys include exact
   normalized names plus common aliases/abbreviations. */
const DEALER_LOGOS: Record<string, StaticImageData> = {
  adtunisie: adTunisiaLogo,
  adtunisia: adTunisiaLogo,
  "benhrizauto": benHrizLogo,
  benhriz: benHrizLogo,
  "societebenhrizaauto": benHrizLogo,
  bmautoparts: bmAutoPartsLogo,
  "bmautopartstunis": bmAutoPartsLogo,
  gpa: globalPiecesAutoLogo,
  "globalpiecesauto": globalPiecesAutoLogo,
  "steglobalpiecesauto": globalPiecesAutoLogo,
  amine: amineLogo,
  "aminepneus": amineLogo,
};

export const DEFAULT_DEALER_LOGO: StaticImageData = defaultDealerLogo;

export const normalizeDealerName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getDealerLogo(name: string): StaticImageData {
  return DEALER_LOGOS[normalizeDealerName(name)] ?? DEFAULT_DEALER_LOGO;
}
