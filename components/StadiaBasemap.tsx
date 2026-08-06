"use client";

import { TileLayer } from "react-leaflet";
import { useTheme } from "./ThemeProvider";

/* Stadia Alidade Smooth basemap — light and dark variants.
   Retina-aware via the {r} placeholder (resolved with `detectRetina`). */
const STADIA_LIGHT_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
const STADIA_DARK_URL =
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

const STADIA_ATTRIBUTION =
  '&copy; <a href="https://www.stadiamaps.com/" target="_blank" rel="noreferrer">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

/* Optional API key — appended when provided (recommended for production). */
const STADIA_API_KEY = process.env.NEXT_PUBLIC_STADIA_API_KEY ?? "";

/**
 * Theme-aware basemap: swaps the tile layer between Alidade Smooth (light)
 * and Alidade Smooth Dark the moment the active theme changes. The `key`
 * remounts the TileLayer so tiles switch instantly.
 */
export default function StadiaBasemap() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const baseUrl = isDark ? STADIA_DARK_URL : STADIA_LIGHT_URL;
  const url = STADIA_API_KEY ? `${baseUrl}?api_key=${STADIA_API_KEY}` : baseUrl;

  return (
    <TileLayer
      key={url}
      url={url}
      attribution={STADIA_ATTRIBUTION}
      maxZoom={20}
      detectRetina
    />
  );
}
