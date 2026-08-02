const SERPAPI_BASE = "https://serpapi.com/search.json";
/* Ask SerpApi for the maximum number of places it supports per query.
   There is intentionally NO client-side cap: every place returned is
   passed back to the frontend. */
const SERPAPI_NUM = 50;
const REQUEST_TIMEOUT_MS = 15000;

/* Overpass (OpenStreetMap) fallback — free, keyless, radius-controlled */
/* The public Overpass servers are load-balanced: each one is tried in
   order until one responds. */
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.osm.jp/api/interpreter",
];
/* Search radius in meters (25 km — generous, per requirements) */
const OVERPASS_RADIUS_M = 25000;
/* Every relevant repair-shop tag is queried (nodes AND ways) */
const OVERPASS_TAGS = [
  "shop=car_repair",
  "shop=mechanic",
  "amenity=car_repair",
  "craft=car_repair",
];

/* ------------------------------------------------------------------ */
/*  GET /api/shops                                                     */
/*                                                                     */
/*  Query params:                                                      */
/*    city      – user's location label (e.g. "Tunis")                 */
/*    lat, lng  – optional coordinates for precise ll pinning          */
/*    brand     – selected vehicle brand (e.g. "Toyota")               */
/*    category  – selected service category (e.g. "Brake Repair")      */
/*    q         – free keyword search (e.g. "brake pads")              */
/*                                                                     */
/*  Sources (in order):                                                */
/*    1. SerpApi Google Maps (needs SERPAPI_KEY)                       */
/*    2. Overpass OpenStreetMap fallback (25 km radius, 4 tags) —      */
/*       used automatically when SerpApi fails or returns nothing.     */
/*                                                                     */
/*  Response: { results, total, query, source }                        */
/*  Every fetched shop is returned — no slicing, no result caps.       */
/* ------------------------------------------------------------------ */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city")?.trim();
    const brand = searchParams.get("brand")?.trim();
    const category = searchParams.get("category")?.trim();
    const q = searchParams.get("q")?.trim();
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    /* ---- Build the query text ----------------------------------------
       Combine brand + service category + free keywords into one search,
       then anchor it to the user's location. */
    const parts = [];
    if (brand) parts.push(brand);
    if (category) parts.push(category);
    if (q) parts.push(q);
    if (parts.length === 0) parts.push("car repair");

    let query = parts.join(" ");
    /* Geolocation labels are pure coordinates ("36.8065, 10.1815") —
       don't inject those into the text query; the ll param pins them. */
    const looksLikeCoords = city
      ? /^-?\d{1,3}(\.\d+)?\s*,\s*-?\d{1,3}(\.\d+)?$/.test(city)
      : false;
    if (city && !looksLikeCoords && !query.toLowerCase().includes(city.toLowerCase())) {
      query = `${query} in ${city}`;
    }

    if (!query.trim()) {
      return Response.json(
        { error: "Provide a location (city or lat/lng) or a search term" },
        { status: 400 }
      );
    }

    let results = [];
    let source = null;

    /* ---- 1) SerpApi (Google Maps) — primary source ------------------ */
    if (process.env.SERPAPI_KEY) {
      try {
        results = await searchSerpApi(query, lat, lng);
        source = "serpapi";
      } catch (err) {
        console.error("SerpApi fetch error:", err);
      }
    }

    /* ---- 2) Overpass (OpenStreetMap) — fallback ---------------------
       Only used when SerpApi is unavailable or empty. Covers a 25 km
       radius around the user's coordinates across all relevant tags. */
    if (results.length === 0 && lat && lng) {
      try {
        results = await searchOverpass(Number(lat), Number(lng));
        source = "overpass";
      } catch (err) {
        console.error("Overpass fetch error:", err);
      }
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });

    return Response.json(
      { results, total: results.length, query, source },
      { headers }
    );
  } catch (err) {
    console.error("GET /api/shops error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/*  SerpApi Google Maps search — all returned places kept, no caps     */
/* ------------------------------------------------------------------ */
async function searchSerpApi(query, lat, lng) {
  const url = new URL(SERPAPI_BASE);
  url.searchParams.set("engine", "google_maps");
  url.searchParams.set("type", "search");
  url.searchParams.set("q", query);
  if (lat && lng) {
    /* SerpApi's google_maps engine expects the "@lat,lng,zoomz" format */
    url.searchParams.set("ll", `@${lat},${lng},14z`);
  }
  url.searchParams.set("hl", "en");
  url.searchParams.set("num", String(SERPAPI_NUM));
  url.searchParams.set("api_key", process.env.SERPAPI_KEY);

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("SerpApi error:", res.status, body);
    throw new Error(`SerpApi returned ${res.status}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);

  /* ---- Map + dedupe raw Google Maps places into shop results ------ */
  const seen = new Set();
  const results = [];

  for (const p of data.local_results ?? []) {
    if (!p?.title) continue;
    const key =
      p.place_id ??
      `${p.gps_coordinates?.latitude ?? 0},${p.gps_coordinates?.longitude ?? 0},${p.title}`;
    if (seen.has(key)) continue;
    seen.add(key);

    /* google_maps engine nests coordinates under gps_coordinates */
    const placeLat = p.gps_coordinates?.latitude ?? p.latitude ?? 0;
    const placeLng = p.gps_coordinates?.longitude ?? p.longitude ?? 0;

    results.push({
      placeId: p.place_id,
      title: p.title,
      address: p.address ?? "",
      latitude: placeLat,
      longitude: placeLng,
      rating: p.rating,
      reviews: p.reviews,
      phone: p.phone,
      website: p.website,
      type: p.type,
      category: p.category,
      openState: p.open_state,
      operationalStatus: p.operational_status,
      hours: p.hours,
      description: p.description,
      serviceOptions: p.service_options,
      thumbnail: p.thumbnail,
      distanceKm:
        lat && lng ? haversineKm(Number(lat), Number(lng), placeLat, placeLng) : null,
    });
  }

  return results;
}

/* ------------------------------------------------------------------ */
/*  Overpass (OpenStreetMap) — 25 km radius, all repair tags,          */
/*  every matching shop returned.                                      */
/* ------------------------------------------------------------------ */
async function searchOverpass(lat, lng) {
  const clauses = [];
  for (const tag of OVERPASS_TAGS) {
    const [key, value] = tag.split("=");
    for (const element of ["node", "way"]) {
      clauses.push(
        `${element}["${key}"="${value}"](around:${OVERPASS_RADIUS_M},${lat},${lng});`
      );
    }
  }

  const query = `[out:json][timeout:25];(\n${clauses.join("\n")}\n);out center tags;`;
  const body = new URLSearchParams({ data: query }).toString();

  let lastError = null;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) {
        lastError = new Error(`Overpass ${endpoint} returned ${res.status}`);
        continue;
      }

      const data = await res.json();

      const seen = new Set();
      const results = [];

      for (const el of data.elements ?? []) {
        const name = el.tags?.name;
        if (!name) continue;

        /* ways carry their centroid under el.center */
        const elLat = el.lat ?? el.center?.lat;
        const elLng = el.lon ?? el.center?.lon;
        if (elLat == null || elLng == null) continue;

        const key = `${elLat},${elLng},${name}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const t = el.tags ?? {};
        const address = [
          t["addr:housenumber"],
          t["addr:street"],
          t["addr:postcode"],
          t["addr:city"],
        ]
          .filter(Boolean)
          .join(", ");

        results.push({
          placeId: `osm-${el.id}`,
          title: name,
          address,
          latitude: elLat,
          longitude: elLng,
          rating: null,
          reviews: null,
          phone: t["contact:phone"] ?? t.phone ?? null,
          website: t["contact:website"] ?? t.website ?? null,
          type: null,
          category: t.shop ?? t.amenity ?? t.craft ?? null,
          openState: null,
          operationalStatus: null,
          hours: t.opening_hours ? [t.opening_hours] : null,
          description: null,
          serviceOptions: null,
          thumbnail: null,
          distanceKm: haversineKm(lat, lng, elLat, elLng),
        });
      }

      return results;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("Overpass fetch failed");
}

/* ------------------------------------------------------------------ */
/*  Haversine distance (km) between two coordinate pairs               */
/* ------------------------------------------------------------------ */
function haversineKm(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return null;
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}
