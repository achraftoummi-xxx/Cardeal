import type { StaticImageData } from "next/image";
import franceFlag from "@/assets/flags/france.png";
import germanyFlag from "@/assets/flags/germany.png";
import italyFlag from "@/assets/flags/italy.png";
import spainFlag from "@/assets/flags/Spain.png";
import ukFlag from "@/assets/flags/united-kingdom.png";
import belgiumFlag from "@/assets/flags/belgium.png";
import netherlandsFlag from "@/assets/flags/netherlands.png";
import swedenFlag from "@/assets/flags/sweden.png";
import japanFlag from "@/assets/flags/japan.png";
import southKoreaFlag from "@/assets/flags/south-korea.png";
import usaFlag from "@/assets/flags/united-states.png";
import turkeyFlag from "@/assets/flags/turkey.png";
import chinaFlag from "@/assets/flags/china.png";
import tunisiaFlag from "@/assets/flags/Tunisia.png";

export type ManufacturerCountry = {
  id: string;
  name: string;
  flag: string;
  brands: string[];
};

export type ManufacturerRegion = {
  id: string;
  countries: ManufacturerCountry[];
};

const flagOf = (flag: StaticImageData) => flag.src;

/* Complete auto parts manufacturers catalog, organized hierarchically by
   region → country of origin. Brand names are matched to logo assets in
   data/manufacturerLogos.ts; missing assets fall back to the default logo. */
export const MANUFACTURER_CATALOG: ManufacturerRegion[] = [
  {
    id: "europe",
    countries: [
      {
        id: "france",
        name: "France",
        flag: flagOf(franceFlag),
        brands: ["Purflux", "Valeo", "SNR", "Klaxcar", "SASIC", "Restagraf"],
      },
      {
        id: "germany",
        name: "Germany",
        flag: flagOf(germanyFlag),
        brands: [
          "Bosch",
          "Continental",
          "ATE",
          "Corteco",
          "FEBI",
          "FAG",
          "HELLA",
          "INA",
          "Kolbenschmidt",
          "Lemförder",
          "Luk",
          "MAHLE",
          "MANN-FILTER",
          "Pierburg",
          "Ruville",
          "Sachs",
          "SWAG",
          "vanWezel",
          "VDO",
          "ZF",
        ],
      },
      {
        id: "italy",
        name: "Italy",
        flag: flagOf(italyFlag),
        brands: ["Brembo", "ERA", "Facet", "LPR", "Magneti Marelli", "Metelli", "OCAP"],
      },
      {
        id: "spain",
        name: "Spain",
        flag: flagOf(spainFlag),
        brands: ["Ajusa", "Autofren Seinsa", "DOGA", "FerSA", "Frenkit", "Lizarte", "MECAFILTER"],
      },
      {
        id: "united-kingdom",
        name: "United Kingdom",
        flag: flagOf(ukFlag),
        brands: ["AP", "BGA", "Comline", "Ferodo", "Girling", "GKN", "Quantum"],
      },
      {
        id: "belgium",
        name: "Belgium",
        flag: flagOf(belgiumFlag),
        brands: ["Bosal", "MILES"],
      },
      {
        id: "netherlands",
        name: "Netherlands",
        flag: flagOf(netherlandsFlag),
        brands: ["Nipparts"],
      },
      {
        id: "sweden",
        name: "Sweden",
        flag: flagOf(swedenFlag),
        brands: ["SKF"],
      },
    ],
  },
  {
    id: "japan",
    countries: [
      {
        id: "japan",
        name: "Japan",
        flag: flagOf(japanFlag),
        brands: ["Aisin", "Denso", "KYB", "NTN"],
      },
    ],
  },
  {
    id: "southKorea",
    countries: [
      {
        id: "south-korea",
        name: "South Korea",
        flag: flagOf(southKoreaFlag),
        brands: ["GMB", "Mando", "Silla"],
      },
    ],
  },
  {
    id: "unitedStates",
    countries: [
      {
        id: "united-states",
        name: "United States",
        flag: flagOf(usaFlag),
        brands: ["ACDelco", "BorgWarner", "Dayco", "Delphi", "Moog", "TRW"],
      },
    ],
  },
  {
    id: "turkey",
    countries: [
      {
        id: "turkey",
        name: "Turkey",
        flag: flagOf(turkeyFlag),
        brands: ["MGA"],
      },
    ],
  },
  {
    id: "chinaAsia",
    countries: [
      {
        id: "china",
        name: "China",
        flag: flagOf(chinaFlag),
        brands: ["Sanhua", "Wanxiang"],
      },
    ],
  },
  {
    id: "tunisia",
    countries: [
      {
        id: "tunisia",
        name: "Tunisia",
        flag: flagOf(tunisiaFlag),
        brands: ["Amine"],
      },
    ],
  },
];

export function getAllCatalogBrands(): string[] {
  return MANUFACTURER_CATALOG.flatMap((region) =>
    region.countries.flatMap((country) => country.brands)
  );
}
