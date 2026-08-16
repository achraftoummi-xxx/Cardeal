import type { StaticImageData } from "next/image";
import valeoLogo from "@/assets/manufacturers/valeo.png";
import boschLogo from "@/assets/manufacturers/Bosch_logo.png";
import bremboLogo from "@/assets/manufacturers/Brembo-logo.png";
import densoLogo from "@/assets/manufacturers/denso.png";
import ajusaLogo from "@/assets/manufacturers/Ajusa.png";
import apLogo from "@/assets/manufacturers/AP.png";
import bgaLogo from "@/assets/manufacturers/bga-logo.png";
import borgWarnerLogo from "@/assets/manufacturers/BorgWarner.webp";
import bosalLogo from "@/assets/manufacturers/bosal-seeklogo.png";
import cofapLogo from "@/assets/manufacturers/Cofap-Logo-Vector.jpg";
import comlineLogo from "@/assets/manufacturers/Comline.jpg";
import cortecoLogo from "@/assets/manufacturers/CORTECo.png";
import daycoLogo from "@/assets/manufacturers/dayco.png";
import delphiLogo from "@/assets/manufacturers/delphi.png";
import dogaLogo from "@/assets/manufacturers/doga.jpg";
import facetLogo from "@/assets/manufacturers/facet.jpg";
import fagLogo from "@/assets/manufacturers/FAG.gif";
import febiLogo from "@/assets/manufacturers/FEBI.png";
import ferodoLogo from "@/assets/manufacturers/Ferodo.png";
import fersaLogo from "@/assets/manufacturers/fersa.webp";
import hellaLogo from "@/assets/manufacturers/HELLA.png";
import inaLogo from "@/assets/manufacturers/INA.png";
import klaxcarLogo from "@/assets/manufacturers/KLAXCAR.jpg";
import kolbenschmidtLogo from "@/assets/manufacturers/Kolbenschmidt.webp";
import lemforderLogo from "@/assets/manufacturers/lemforder.png";
import lizarteLogo from "@/assets/manufacturers/lizarte.png";
import eraLogo from "@/assets/manufacturers/logo_ERA.png";
import metelliLogo from "@/assets/manufacturers/logo_metelli.png";
import ruvilleLogo from "@/assets/manufacturers/logo_RUVILLE_web.png";
import ateLogo from "@/assets/manufacturers/logo-ate.png";
import restagrafLogo from "@/assets/manufacturers/logo-restagraf.png";
import lprLogo from "@/assets/manufacturers/lprbrakes_logo.jpg";
import lukLogo from "@/assets/manufacturers/luk.png";
import magnetiLogo from "@/assets/manufacturers/magneti.png";
import mahleLogo from "@/assets/manufacturers/MAHLE.png";
import mecafilterLogo from "@/assets/manufacturers/MECAFILTER.png";
import mgaLogo from "@/assets/manufacturers/mga.webp";
import milesLogo from "@/assets/manufacturers/mile.webp";
import nippartsLogo from "@/assets/manufacturers/niparts.jpg";
import ntnLogo from "@/assets/manufacturers/NTN.png";
import ocapLogo from "@/assets/manufacturers/ocap.png";
import pierburgLogo from "@/assets/manufacturers/Pierburg.png";
import quantumLogo from "@/assets/manufacturers/Quantum.png";
import sachsLogo from "@/assets/manufacturers/sachs.png";
import sasicLogo from "@/assets/manufacturers/SASIC.png";
import skfLogo from "@/assets/manufacturers/SKF.jpg";
import snrLogo from "@/assets/manufacturers/SNR.png";
import swagLogo from "@/assets/manufacturers/SWAG.png";
import trwLogo from "@/assets/manufacturers/trw.png";
import vanwezelLogo from "@/assets/manufacturers/vanwezl.png";
import zfLogo from "@/assets/manufacturers/ZF.png";
import amineLogo from "@/assets/dealers_logos/AMINE.png";
import defaultManufacturerLogo from "@/assets/dealers_logos/default.png";

/* Manufacturer logos — keyed by a normalized brand name (lowercase,
   alphanumeric only) so lookups are case/punctuation-insensitive.
   SVG logos live in public/ and are referenced by URL path. */
const MANUFACTURER_LOGOS: Record<string, { src: string }> = {
  valeo: { src: valeoLogo.src },
  bosch: { src: boschLogo.src },
  purflux: { src: "/assets/manufacturers/logo-purfluxgroup.svg" },
  brembo: { src: bremboLogo.src },
  denso: { src: densoLogo.src },
  ajusa: { src: ajusaLogo.src },
  ap: { src: apLogo.src },
  autofrenseinsa: { src: "/assets/manufacturers/autofren-seinsa.svg" },
  bga: { src: bgaLogo.src },
  borgwarner: { src: borgWarnerLogo.src },
  bosal: { src: bosalLogo.src },
  cofap: { src: cofapLogo.src },
  comline: { src: comlineLogo.src },
  corteco: { src: cortecoLogo.src },
  dayco: { src: daycoLogo.src },
  delphi: { src: delphiLogo.src },
  doga: { src: dogaLogo.src },
  facet: { src: facetLogo.src },
  fag: { src: fagLogo.src },
  febi: { src: febiLogo.src },
  ferodo: { src: ferodoLogo.src },
  fersa: { src: fersaLogo.src },
  girling: { src: "/assets/manufacturers/girling.svg" },
  gkn: { src: "/assets/manufacturers/gkn.svg" },
  hella: { src: hellaLogo.src },
  ina: { src: inaLogo.src },
  klaxcar: { src: klaxcarLogo.src },
  kolbenschmidt: { src: kolbenschmidtLogo.src },
  lemforder: { src: lemforderLogo.src },
  lizarte: { src: lizarteLogo.src },
  era: { src: eraLogo.src },
  metelli: { src: metelliLogo.src },
  ruville: { src: ruvilleLogo.src },
  ate: { src: ateLogo.src },
  frenkit: { src: "/assets/manufacturers/frenkit.svg" },
  restagraf: { src: restagrafLogo.src },
  lpr: { src: lprLogo.src },
  luk: { src: lukLogo.src },
  magnetimarelli: { src: magnetiLogo.src },
  marelli: { src: magnetiLogo.src },
  mahle: { src: mahleLogo.src },
  mannfilter: { src: "/assets/manufacturers/mann-filter.svg" },
  mann: { src: "/assets/manufacturers/mann-filter.svg" },
  mecafilter: { src: mecafilterLogo.src },
  mga: { src: mgaLogo.src },
  miles: { src: milesLogo.src },
  nipparts: { src: nippartsLogo.src },
  ntn: { src: ntnLogo.src },
  ocap: { src: ocapLogo.src },
  pierburg: { src: pierburgLogo.src },
  quantum: { src: quantumLogo.src },
  sachs: { src: sachsLogo.src },
  sasic: { src: sasicLogo.src },
  skf: { src: skfLogo.src },
  snr: { src: snrLogo.src },
  swag: { src: swagLogo.src },
  trw: { src: trwLogo.src },
  vanwezel: { src: vanwezelLogo.src },
  vdo: { src: "/assets/manufacturers/vdo.svg" },
  zf: { src: zfLogo.src },
  amine: { src: amineLogo.src },
};

export const DEFAULT_MANUFACTURER_LOGO: { src: string } = {
  src: defaultManufacturerLogo.src,
};

export const normalizeManufacturer = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function getManufacturerLogo(name: string): { src: string } {
  return MANUFACTURER_LOGOS[normalizeManufacturer(name)] ?? DEFAULT_MANUFACTURER_LOGO;
}
