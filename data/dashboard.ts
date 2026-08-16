/**
 * Mock data for the authenticated user dashboard ("Accueil").
 * Replaced by real API data once the backend exposes these resources;
 * types below mirror the expected API contracts.
 */

export type QuoteStatus = "pending" | "accepted" | "completed";

export type DashboardQuote = {
  id: string;
  partner: string;
  service: string;
  amount: number;
  date: string;
  status: QuoteStatus;
};

export type DashboardAppointment = {
  id: string;
  partner: string;
  service: string;
  date: string;
  time: string;
};

export type ReminderType = "oil" | "inspection" | "insurance";

export type MaintenanceReminder = {
  id: string;
  type: ReminderType;
  dueInDays: number;
};

export type DashboardMessage = {
  id: string;
  from: string;
  snippet: string;
  time: string;
  unread: boolean;
};

export type ServiceHistoryEntry = {
  id: string;
  service: string;
  partner: string;
  date: string;
  amount: number;
};

export type DashboardVehicle = {
  brand: string;
  model: string;
  year: string;
  engine: string;
  mileageKm: number;
  healthScore: number;
  maintenanceUptoDate: boolean;
};

export const DASHBOARD_USER_NAME_KEY = "cardeal_user_name";

export function getUserName(): string {
  if (typeof window === "undefined") return "Karim";
  try {
    return window.sessionStorage.getItem(DASHBOARD_USER_NAME_KEY) || "Karim";
  } catch {
    return "Karim";
  }
}

/** Vehicle: prefer the one picked during sign-up, else a demo profile. */
export function getDashboardVehicle(): DashboardVehicle {
  if (typeof window !== "undefined") {
    try {
      const raw = window.sessionStorage.getItem("selectedVehicle");
      if (raw) {
        const v = JSON.parse(raw) as {
          brand?: string;
          model?: string;
          year?: string;
          engine?: string;
        };
        if (v?.brand) {
          return {
            brand: v.brand,
            model: v.model ?? "—",
            year: v.year ?? "—",
            engine: v.engine ?? "—",
            mileageKm: 68400,
            healthScore: 82,
            maintenanceUptoDate: true,
          };
        }
      }
    } catch {
      /* ignore malformed storage */
    }
  }
  return {
    brand: "Toyota",
    model: "Corolla",
    year: "2021",
    engine: "1.8L Essence",
    mileageKm: 68400,
    healthScore: 82,
    maintenanceUptoDate: true,
  };
}

/** User-managed profile details persisted locally (mock backend). */
export type UserProfilePrefs = {
  notifyMaintenance: boolean;
  notifyQuotes: boolean;
  notifyPromos: boolean;
};

export type UserProfile = {
  phone: string;
  prefs: UserProfilePrefs;
};

export const PROFILE_STORAGE_KEY = "cardeal_profile";
export const VEHICLES_STORAGE_KEY = "cardeal_vehicles";

export function loadUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    /* storage unavailable — ignore */
  }
}

/** Vehicle specs managed from the settings screen. */
export type UserVehicle = {
  id: string;
  brand: string;
  model: string;
  year: string;
  capacity: string;
  cylinders: string;
  fuel: string;
  mileageKm: number | null;
};

export const FUEL_OPTIONS = ["Essence", "Diesel", "Hybride", "Électrique", "GPL"];
export const CYLINDER_OPTIONS = ["2", "3", "4", "5", "6", "8", "10", "12"];

/** null = never initialized (seed from the demo/sign-up vehicle), [] = user cleared them. */
export function loadUserVehicles(): UserVehicle[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserVehicle[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveUserVehicles(vehicles: UserVehicle[]): void {
  try {
    window.localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
  } catch {
    /* storage unavailable — ignore */
  }
}

export function emptyUserVehicle(): UserVehicle {
  return {
    id: `vehicle-${Date.now().toString(36)}`,
    brand: "",
    model: "",
    year: "",
    capacity: "",
    cylinders: "",
    fuel: "",
    mileageKm: null,
  };
}

export function seedUserVehicle(v: DashboardVehicle): UserVehicle {
  const capacityMatch = /^([\d.]+)L/i.exec(v.engine);
  return {
    id: "seed-vehicle",
    brand: v.brand,
    model: v.model === "—" ? "" : v.model,
    year: v.year === "—" ? "" : v.year,
    capacity: capacityMatch ? `${capacityMatch[1]}L` : "",
    cylinders: "",
    fuel: /diesel/i.test(v.engine) ? "Diesel" : "Essence",
    mileageKm: v.mileageKm ?? null,
  };
}

export const DASHBOARD_QUOTES: DashboardQuote[] = [
  { id: "q1", partner: "El Mecano Garage", service: "Vidange + filtres", amount: 120, date: "2026-08-14", status: "pending" },
  { id: "q2", partner: "Das Auto Repair", service: "Plaquettes de freins avant", amount: 260, date: "2026-08-15", status: "pending" },
  { id: "q3", partner: "Garage l'Expert", service: "Diagnostic électronique", amount: 90, date: "2026-08-10", status: "accepted" },
  { id: "q4", partner: "El Mecano Garage", service: "Révision 40 000 km", amount: 380, date: "2026-07-28", status: "completed" },
  { id: "q5", partner: "MTS Auto Center", service: "Remplacement batterie", amount: 210, date: "2026-07-19", status: "completed" },
  { id: "q6", partner: "Das Auto Repair", service: "Parallélisme train avant", amount: 60, date: "2026-07-02", status: "completed" },
  { id: "q7", partner: "LE GRAND GARAGE MNIHLA", service: "Courroie de distribution", amount: 340, date: "2026-06-21", status: "completed" },
];

export const DASHBOARD_APPOINTMENTS: DashboardAppointment[] = [
  { id: "a1", partner: "El Mecano Garage", service: "Vidange moteur", date: "2026-08-20", time: "09:30" },
  { id: "a2", partner: "Das Auto Repair", service: "Contrôle technique", date: "2026-08-27", time: "14:00" },
];

export const DASHBOARD_REMINDERS: MaintenanceReminder[] = [
  { id: "r1", type: "oil", dueInDays: 18 },
  { id: "r2", type: "inspection", dueInDays: 41 },
  { id: "r3", type: "insurance", dueInDays: 92 },
];

export const DASHBOARD_MESSAGES: DashboardMessage[] = [
  { id: "m1", from: "El Mecano Garage", snippet: "Votre rendez-vous du 20 août est confirmé à 09h30.", time: "09:12", unread: true },
  { id: "m2", from: "Das Auto Repair", snippet: "Votre devis n°q2 a été mis à jour : 260 DT.", time: "Hier", unread: true },
  { id: "m3", from: "Garage l'Expert", snippet: "Merci pour votre confiance ! Pensez à la vidange.", time: "12 août", unread: false },
];

export const DASHBOARD_HISTORY: ServiceHistoryEntry[] = [
  { id: "h1", service: "Révision 40 000 km", partner: "El Mecano Garage", date: "28 juil. 2026", amount: 380 },
  { id: "h2", service: "Remplacement batterie", partner: "MTS Auto Center", date: "19 juil. 2026", amount: 210 },
  { id: "h3", service: "Parallélisme train avant", partner: "Das Auto Repair", date: "2 juil. 2026", amount: 60 },
  { id: "h4", service: "Courroie de distribution", partner: "LE GRAND GARAGE MNIHLA", date: "21 juin 2026", amount: 340 },
];

export const DASHBOARD_NOTIFICATIONS = [
  { id: "n1", title: "Nouveau devis reçu", detail: "El Mecano Garage — 120 DT", time: "Il y a 2 h" },
  { id: "n2", title: "Rendez-vous confirmé", detail: "Das Auto Repair — 27 août, 14:00", time: "Il y a 5 h" },
  { id: "n3", title: "Rappel d'entretien", detail: "Vidange recommandée dans 18 jours", time: "Hier" },
];

export type DashboardFavorite = {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  note: string;
};

export const DASHBOARD_FAVORITES: DashboardFavorite[] = [
  { id: "f1", name: "El Mecano Garage", type: "Garage", location: "Tunis, La Marsa", rating: 4.8, note: "Vidange + filtres — 120 DT" },
  { id: "f2", name: "Das Auto Repair", type: "Garage", location: "Tunis, Le Bardo", rating: 4.6, note: "Plaquettes de freins avant — 260 DT" },
  { id: "f3", name: "Auto Pièces Nord", type: "Pièces détachées", location: "Ariana, Charguia", rating: 4.5, note: "Batterie VARTA 60Ah — 210 DT" },
  { id: "f4", name: "Garage l'Expert", type: "Garage", location: "Tunis, Lafayette", rating: 4.7, note: "Diagnostic électronique — 90 DT" },
];

export type DashboardDocument = {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
};

export const DASHBOARD_DOCUMENTS: DashboardDocument[] = [
  { id: "d1", title: "Facture révision 40 000 km", type: "PDF", date: "28 juil. 2026", size: "284 Ko" },
  { id: "d2", title: "Devis n°q2 — plaquettes avant", type: "PDF", date: "15 août 2026", size: "142 Ko" },
  { id: "d3", title: "Carte grise (copie)", type: "PDF", date: "12 juin 2026", size: "1,1 Mo" },
  { id: "d4", title: "Attestation d'assurance 2026", type: "PDF", date: "2 juin 2026", size: "98 Ko" },
  { id: "d5", title: "Certificat contrôle technique", type: "PDF", date: "27 mai 2026", size: "310 Ko" },
];

export type DashboardExpense = {
  id: string;
  label: string;
  category: string;
  date: string;
  amount: number;
};

export const DASHBOARD_EXPENSES: DashboardExpense[] = [
  { id: "e1", label: "Révision 40 000 km", category: "Entretien", date: "28 juil. 2026", amount: 380 },
  { id: "e2", label: "Remplacement batterie", category: "Réparation", date: "19 juil. 2026", amount: 210 },
  { id: "e3", label: "Plein carburant", category: "Carburant", date: "9 août 2026", amount: 95 },
  { id: "e4", label: "Parallélisme train avant", category: "Réparation", date: "2 juil. 2026", amount: 60 },
  { id: "e5", label: "Assurance auto 2026", category: "Assurance", date: "2 juin 2026", amount: 520 },
  { id: "e6", label: "Courroie de distribution", category: "Entretien", date: "21 juin 2026", amount: 340 },
];

export type PartCategory = {
  id: string;
  label: string;
  icon: string;
};

export const POPULAR_PARTS = [
  "Plaquettes de frein",
  "Batterie",
  "Amortisseurs",
  "Courroie de distribution",
  "Filtre à huile",
  "Bougies d'allumage",
  "Disques de frein",
  "Alternateur",
];

export const CITY_OPTIONS: { label: string; lat: number; lng: number }[] = [
  { label: "Tunis", lat: 36.8065, lng: 10.1815 },
  { label: "Sousse", lat: 35.8256, lng: 10.6084 },
  { label: "Sfax", lat: 34.7406, lng: 10.7603 },
  { label: "Bizerte", lat: 37.2744, lng: 9.8739 },
  { label: "Nabeul", lat: 36.4564, lng: 10.7353 },
  { label: "Monastir", lat: 35.778, lng: 10.8262 },
  { label: "Gabès", lat: 33.8886, lng: 10.0982 },
  { label: "Kairouan", lat: 35.6781, lng: 10.0963 },
];

export function cityByLabel(label: string) {
  return CITY_OPTIONS.find((c) => c.label === label) ?? null;
}

export function quoteCounts(quotes: DashboardQuote[]) {
  return {
    pending: quotes.filter((q) => q.status === "pending").length,
    accepted: quotes.filter((q) => q.status === "accepted").length,
    completed: quotes.filter((q) => q.status === "completed").length,
  };
}