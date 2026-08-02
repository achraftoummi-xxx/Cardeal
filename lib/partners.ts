import { supabase } from "@/lib/supabase";

export type Partner = {
  id: string;
  city: string | null;
  zip_code: string | null;
  name: string;
  establishment_type: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  google_map_coords: string | null;
  latitude: number | null;
  longitude: number | null;
  facebook_url: string | null;
  instagram_url: string | null;
  google_rating: number | null;
  review_count: number | null;
  opening_hours: string | null;
  services_offered: string | null;
  additional_info: string | null;
};

export type PartnerSearch = {
  keyword?: string;
  category?: string;
  origin?: { lat: number; lng: number } | null;
};

export const TUNIS_CENTER = { lat: 36.8065, lng: 10.1815 };

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

export function partnerDistanceKm(
  partner: Partner,
  origin: { lat: number; lng: number } | null
): number | null {
  if (!origin || partner.latitude == null || partner.longitude == null) return null;
  return haversineKm(origin.lat, origin.lng, partner.latitude, partner.longitude);
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  oil: ["vidange", "huile", "filtre"],
  brake: ["frein", "freinage", "plaquette", "disque"],
  battery: ["batterie"],
  diagnostic: ["diagnostic", "diagnostics"],
  engine: ["moteur", "mecanique", "mecanique"],
  transmission: ["transmission", "boite", "embrayage"],
  clutch: ["embrayage"],
  suspension: ["suspension", "amortisseur", "direction"],
  steering: ["direction"],
  electrical: ["electrique", "electricite"],
  tire: ["pneu", "pneus"],
  "air conditioning": ["climatisation", "climatiseur"],
  cooling: ["refroidissement", "radiateur"],
  exhaust: ["echappement", "silencieux"],
  body: ["carrosserie"],
  paint: ["peinture"],
  inspection: ["controle", "inspection", "visite"],
  maintenance: ["entretien", "maintenance"],
  alignment: ["alignement", "parallellisme"],
  wheel: ["roue", "equilibrage"],
  turbo: ["turbo"],
  injector: ["injecteur", "injection"],
  filter: ["filtre"],
  coolant: ["refroidissement"],
  wiper: ["essuie-glace", "essuie-glaces"],
};

function categoryTerms(category: string): string[] {
  const terms = new Set<string>();
  const tokens = normalize(category).split(/[^a-z0-9]+/).filter(Boolean);
  for (const token of tokens) {
    const synonyms = CATEGORY_SYNONYMS[token];
    if (synonyms) synonyms.forEach((s) => terms.add(s));
    else if (token.length > 1) terms.add(token);
  }
  return [...terms];
}

export function partnerRelevance(partner: Partner, search: PartnerSearch): number {
  let score = 0;
  const haystack = normalize(
    [partner.name, partner.establishment_type, partner.services_offered, partner.additional_info, partner.city]
      .filter(Boolean)
      .join(" ")
  );

  if (search.keyword?.trim()) {
    const tokens = normalize(search.keyword).split(/[^a-z0-9]+/).filter((t) => t.length > 1);
    score += tokens.filter((t) => haystack.includes(t)).length;
  }

  if (search.category) {
    score += categoryTerms(search.category).filter((t) => haystack.includes(t)).length;
  }

  return score;
}

export function sortPartners(partners: Partner[], search: PartnerSearch): Partner[] {
  const hasFilters = Boolean(search.keyword?.trim() || search.category);
  return partners
    .map((p) => ({
      p,
      score: partnerRelevance(p, search),
      distance: partnerDistanceKm(p, search.origin ?? null),
    }))
    .filter((x) => !hasFilters || x.score > 0)
    .sort((a, b) => {
      if (hasFilters && b.score !== a.score) return b.score - a.score;
      if (a.distance != null && b.distance != null) return a.distance - b.distance;
      if (a.distance != null) return -1;
      if (b.distance != null) return 1;
      return (b.p.google_rating ?? 0) - (a.p.google_rating ?? 0);
    })
    .map((x) => x.p);
}

export async function fetchPartners(keyword?: string): Promise<Partner[]> {
  if (!supabase) return [];
  let query = supabase.from("partners").select("*");
  const kw = keyword?.trim();
  if (kw) {
    const escaped = kw.replace(/[%_\\]/g, (m) => `\\${m}`);
    query = query.or(
      `name.ilike.%${escaped}%,services_offered.ilike.%${escaped}%,establishment_type.ilike.%${escaped}%,city.ilike.%${escaped}%`
    );
  }
  const { data, error } = await query.limit(200);
  if (error) throw error;
  return (data ?? []) as Partner[];
}
