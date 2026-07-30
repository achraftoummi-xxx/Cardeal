export const runtime = "edge";

import { NextResponse } from "next/server";

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

    return new NextResponse(originRes.body, {
      status: originRes.status,
      statusText: originRes.statusText,
      headers,
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
