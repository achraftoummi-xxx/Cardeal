const CDN_BASE = "https://cdn.protomaps.com/tiles/v4/sprites";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const spritePath = path.join("/");
  const url = `${CDN_BASE}/${spritePath}`;

  try {
    const originRes = await fetch(url);

    const headers = new Headers(originRes.headers);
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Vary", "Origin");

    return new Response(originRes.body, {
      status: originRes.status,
      headers,
    });
  } catch (err) {
    console.error("sprite proxy error:", err);
    return new Response("Upstream fetch failed", { status: 502 });
  }
}
