import type { StaticImageData } from "next/image";
import franceFlag from "@/assets/flags/france.png";
import germanyFlag from "@/assets/flags/germany.png";
import italyFlag from "@/assets/flags/italy.png";
import spainFlag from "@/assets/flags/Spain.png";
import ukFlag from "@/assets/flags/united-kingdom.png";
import czechFlag from "@/assets/flags/czech _republic.png";
import polandFlag from "@/assets/flags/poland.png";
import swedenFlag from "@/assets/flags/sweden.png";
import austriaFlag from "@/assets/flags/AUSTRIA.png";
import netherlandsFlag from "@/assets/flags/netherlands.png";
import chinaFlag from "@/assets/flags/china.png";
import japanFlag from "@/assets/flags/japan.png";
import southKoreaFlag from "@/assets/flags/south-korea.png";
import usaFlag from "@/assets/flags/united-states.png";
import turkeyFlag from "@/assets/flags/turkey.png";

const flagOf = (flag: StaticImageData) => flag.src;

/* Car brand catalog, organized hierarchically by region -> country of origin.
   Mirrors the auto parts manufacturer catalog (data/manufacturerCatalog.ts) so
   the same categorized dropdown can power brand selection everywhere. */
export const CAR_BRAND_REGIONS = [
  {
    id: "europe",
    countries: [
      {
        id: "france",
        name: "France",
        flag: flagOf(franceFlag),
        brands: ["Peugeot", "Citroën", "Renault", "DS Automobiles", "Alpine", "Bugatti", "Venturi", "Ligier", "Aixam", "Microcar"],
      },
      {
        id: "germany",
        name: "Germany",
        flag: flagOf(germanyFlag),
        brands: ["Audi", "BMW", "Mercedes", "Maybach", "Volkswagen", "Porsche", "Opel", "Alpina", "Borgward", "Wiesmann", "Ruf", "Isdera", "Gumpert", "Apollo", "Smart", "MAN"],
      },
      {
        id: "italy",
        name: "Italy",
        flag: flagOf(italyFlag),
        brands: ["Abarth", "Alfa Romeo", "Fiat", "Ferrari", "Lamborghini", "Maserati", "Lancia", "Pagani", "De Tomaso", "Pininfarina", "Automobili Pininfarina", "Italdesign", "Mazzanti", "Iveco", "DR Automobiles"],
      },
      {
        id: "spain",
        name: "Spain",
        flag: flagOf(spainFlag),
        brands: ["SEAT", "Cupra", "Tauro", "Hispano Suiza"],
      },
      {
        id: "united-kingdom",
        name: "United Kingdom",
        flag: flagOf(ukFlag),
        brands: ["Aston Martin", "Aston Martin Lagonda", "Bentley", "Jaguar", "Land Rover", "Rolls-Royce", "Lotus", "McLaren", "Morgan", "TVR", "Caterham", "Noble", "Ginetta", "Radical", "MG", "Rover", "Vauxhall", "Mini", "McMurtry", "Prodrive"],
      },
      {
        id: "czech-republic",
        name: "Czech Republic",
        flag: flagOf(czechFlag),
        brands: ["Škoda", "Tatra", "Praga"],
      },
      {
        id: "poland",
        name: "Poland",
        flag: flagOf(polandFlag),
        brands: ["Solaris", "Arrinera"],
      },
      {
        id: "sweden",
        name: "Sweden",
        flag: flagOf(swedenFlag),
        brands: ["Volvo", "SAAB", "Koenigsegg", "Polestar", "Scania"],
      },
      {
        id: "austria",
        name: "Austria",
        flag: flagOf(austriaFlag),
        brands: ["KTM"],
      },
      {
        id: "netherlands",
        name: "Netherlands",
        flag: flagOf(netherlandsFlag),
        brands: ["Spyker"],
      },
      {
        id: "romania",
        name: "Romania",
        flag: "",
        brands: ["Dacia"],
      },
      {
        id: "croatia",
        name: "Croatia",
        flag: "",
        brands: ["Rimac"],
      },
      {
        id: "russia",
        name: "Russia",
        flag: "",
        brands: ["Lada", "GAZ", "Moskvich", "UAZ", "KamAZ"],
      },
      {
        id: "belarus",
        name: "Belarus",
        flag: "",
        brands: ["MAZ", "BelAZ"],
      },
      {
        id: "serbia",
        name: "Serbia",
        flag: "",
        brands: ["Zastava"],
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
        brands: ["Toyota", "Honda", "Nissan", "Mazda", "Subaru", "Suzuki", "Mitsubishi", "Daihatsu", "Isuzu", "Lexus", "Acura", "Infiniti", "Datsun", "Scion", "Mitsuoka", "UD Trucks"],
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
        brands: ["Hyundai", "Kia", "Genesis", "Daewoo", "SsangYong", "KG Mobility", "Solus"],
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
        brands: ["Ford", "Chevrolet", "GMC", "Cadillac", "Buick", "Lincoln", "Chrysler", "Dodge", "Jeep", "RAM", "Plymouth", "Pontiac", "Oldsmobile", "Saturn", "Mercury", "Eagle", "Tesla", "Lucid", "Lucid Motors", "Rivian", "Fisker", "Karma", "Karma Automotive", "Canoo", "Faraday Future", "Shelby", "Saleen", "Hennessey", "Vector", "SSC", "Rezvani", "VLF"],
      },
      {
        id: "canada",
        name: "Canada",
        flag: "",
        brands: ["Campagna"],
      },
      {
        id: "mexico",
        name: "Mexico",
        flag: "",
        brands: ["Mastretta"],
      },
      {
        id: "brazil",
        name: "Brazil",
        flag: "",
        brands: ["Troller"],
      },
      {
        id: "argentina",
        name: "Argentina",
        flag: "",
        brands: ["IKA"],
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
        brands: ["TOGG", "Otokar", "BMC"],
      },
      {
        id: "lebanon",
        name: "Lebanon",
        flag: "",
        brands: ["W Motors"],
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
        brands: ["BYD", "Geely", "Great Wall Motors", "Haval", "Changan", "Chery", "FAW", "GAC", "BAIC", "Dongfeng", "Hongqi", "JAC", "Roewe", "SAIC", "Wuling", "Baojun", "Bestune", "Denza", "Exeed", "Jetour", "Leapmotor", "Li Auto", "NIO", "ORA", "Seres", "XPeng", "Zeekr", "Aion", "Fangchengbao", "Lifan", "Qoros", "Skywell", "Zotye", "Neta", "Kandi", "Rely", "Xiali", "Lynk & Co", "Oley", "Arcfox", "Jiefang", "Foton"],
      },
      {
        id: "india",
        name: "India",
        flag: "",
        brands: ["Mahindra", "Tata Motors", "Maruti Suzuki", "Hindustan Motors", "Force Motors"],
      },
      {
        id: "malaysia",
        name: "Malaysia",
        flag: "",
        brands: ["Proton", "Perodua", "Naza"],
      },
      {
        id: "iran",
        name: "Iran",
        flag: "",
        brands: ["Iran Khodro", "SAIPA"],
      },
      {
        id: "vietnam",
        name: "Vietnam",
        flag: "",
        brands: ["VinFast"],
      },
      {
        id: "taiwan",
        name: "Taiwan",
        flag: "",
        brands: ["Yulon"],
      },
      {
        id: "thailand",
        name: "Thailand",
        flag: "",
        brands: ["Thai Rung"],
      },
      {
        id: "australia",
        name: "Australia",
        flag: "",
        brands: ["Holden", "Bolwell", "Elfin"],
      },
      {
        id: "south-africa",
        name: "South Africa",
        flag: "",
        brands: ["Perana"],
      },
    ],
  },
  {
    id: "tunisia",
    countries: [
      {
        id: "tunisia",
        name: "Tunisia",
        flag: "",
        brands: ["Wallyscar"],
      },
    ],
  },
];
