const SERPAPI_BASE = "https://serpapi.com/search.json";
const MAX_RESULTS = 20;
const REQUEST_TIMEOUT_MS = 15000;

/* ------------------------------------------------------------------ */
/*  GET /api/shops                                                     */
/*                                                                     */
/*  Query params:                                                      */
/*    city      – user's location label (e.g. "Tunis")                 */
/*    lat, lng  – optional coordinates for precise ll pinning          */
/*    brand     – selected vehicle brand (e.g. "Toyota")               */
/*    category  – selected service category (e.g. "Brake Repair")      */
/*    q         – free keyword search (e.g. "brake pads")              */
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

    /* ---- Build the SerpApi query string ------------------------------
       Combine brand + service category + free keywords into one search,
       then anchor it to the user's location. */
    const parts = [];
    if (brand) parts.push(brand);
    if (category) parts.push(category);
    if (q) parts.push(q);
    if (parts.length === 0) parts.push("car repair");

    let query = parts.join(" ");
    if (city && !query.toLowerCase().includes(city.toLowerCase())) {
      query = `${query} in ${city}`;
    }

    if (!query.trim()) {
      return Response.json(
        { error: "Provide a location (city or lat/lng) or a search term" },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "SERPAPI_KEY environment variable is not set" },
        { status: 500 }
      );
    }

    const url = new URL(SERPAPI_BASE);
    url.searchParams.set("engine", "google_maps");
    url.searchParams.set("type", "search");
    url.searchParams.set("q", query);
    if (lat && lng) {
      /* SerpApi's google_maps engine expects the "@lat,lng,zoomz" format */
      url.searchParams.set("ll", `@${lat},${lng},14z`);
    }
    url.searchParams.set("hl", "en");
    url.searchParams.set("num", String(MAX_RESULTS));
    url.searchParams.set("api_key", apiKey);

    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("SerpApi error:", res.status, body);
      return Response.json(
        { error: `SerpApi returned ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (data.error) {
      return Response.json({ error: data.error }, { status: 502 });
    }

    /* ---- Map + dedupe raw Google Maps places into shop results ------ */
    const seen = new Set();
    const results = [];

    for (const p of data.local_results ?? []) {
      if (!p?.title) continue;
      const key = p.place_id ?? `${p.gps_coordinates?.latitude ?? 0},${p.gps_coordinates?.longitude ?? 0},${p.title}`;
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

      if (results.length >= MAX_RESULTS) break;
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });

    return Response.json({ results, total: results.length, query }, { headers });
  } catch (err) {
    console.error("SerpApi fetch error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
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
