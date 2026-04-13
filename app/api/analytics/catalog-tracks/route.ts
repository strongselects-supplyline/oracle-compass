// app/api/analytics/catalog-tracks/route.ts
// Returns all live tracks from catalog_intelligence_matrix.json for the intake form.

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const CATALOG_PATH = path.resolve(
  process.cwd(),
  "../../brain/catalog_intelligence_matrix.json"
);

export type LiveTrack = {
  track_id: string;
  title: string;
  release_date: string;
  spotify_uri: string | null;
  current_popularity: number | null;
  current_streams_cumulative: number | null;
  current_saves: number | null;
  current_save_rate: number | null;
  current_top_cities: string[];
  current_playlist_adds: number | null;
  current_discover_weekly: boolean;
  last_s4a_date: string | null;
};

export async function GET() {
  try {
    if (!fs.existsSync(CATALOG_PATH)) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    const raw = fs.readFileSync(CATALOG_PATH, "utf8");
    const catalog = JSON.parse(raw);

    const liveTracks: LiveTrack[] = catalog.catalog
      .filter((t: any) => t.status === "live" && t.entity_type !== "ep")
      .map((t: any) => ({
        track_id: t.track_id,
        title: t.title,
        release_date: t.release_date,
        spotify_uri: t.metadata?.spotify_uri ?? null,
        current_popularity: t.streaming?.spotify_popularity ?? null,
        current_streams_cumulative: t.streaming?.streams_cumulative ?? null,
        current_saves: t.streaming?.saves ?? null,
        current_save_rate: t.streaming?.save_rate_percent ?? null,
        current_top_cities: t.streaming?.top_cities ?? [],
        current_playlist_adds: t.streaming?.playlist_adds ?? null,
        current_discover_weekly: t.streaming?.discover_weekly ?? false,
        last_s4a_date: t.streaming?.spotify_for_artists_date ?? null,
      }));

    return NextResponse.json({ tracks: liveTracks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
