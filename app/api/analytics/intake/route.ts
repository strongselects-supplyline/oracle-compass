// app/api/analytics/intake/route.ts
// Accepts monthly Spotify for Artists data, writes to catalog_intelligence_matrix.json.
// No LLM. No tokens. Pure data write.

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const CATALOG_PATH = path.resolve(
  process.cwd(),
  "../../brain/catalog_intelligence_matrix.json"
);

export type TrackIntake = {
  streams_7day: number | null;
  streams_cumulative: number | null;
  saves: number | null;
  save_rate_percent: number | null;
  city_1: string;
  city_2: string;
  city_3: string;
  playlist_adds: number | null;
  discover_weekly: boolean;
  notes: string;
};

export type IntakePayload = {
  date: string; // YYYY-MM-DD
  tracks: Record<string, TrackIntake>; // keyed by track_id
};

export async function POST(req: NextRequest) {
  try {
    const body: IntakePayload = await req.json();

    if (!body.date || !body.tracks) {
      return NextResponse.json({ error: "Missing date or tracks" }, { status: 400 });
    }

    if (!fs.existsSync(CATALOG_PATH)) {
      return NextResponse.json({ error: "Catalog not found at " + CATALOG_PATH }, { status: 404 });
    }

    const raw = fs.readFileSync(CATALOG_PATH, "utf8");
    const catalog = JSON.parse(raw);

    const flags: { strong: string[]; weak: string[]; dw: string[] } = {
      strong: [],
      weak: [],
      dw: [],
    };

    const cityCounts: Record<string, number> = {};
    let updatedCount = 0;

    for (const track of catalog.catalog) {
      const intake = body.tracks[track.track_id];
      if (!intake) continue;

      // Ensure streaming object exists
      if (!track.streaming) track.streaming = {};

      // Write all fields — only overwrite if value provided
      if (intake.streams_7day !== null && intake.streams_7day !== undefined) {
        track.streaming.streams_7day = intake.streams_7day;
      }
      if (intake.streams_cumulative !== null && intake.streams_cumulative !== undefined) {
        track.streaming.streams_cumulative = intake.streams_cumulative;
      }
      if (intake.saves !== null && intake.saves !== undefined) {
        track.streaming.saves = intake.saves;
      }
      if (intake.save_rate_percent !== null && intake.save_rate_percent !== undefined) {
        track.streaming.save_rate_percent = intake.save_rate_percent;
      }

      // Cities
      const cities = [intake.city_1, intake.city_2, intake.city_3].filter(Boolean);
      if (cities.length > 0) {
        track.streaming.top_cities = cities;
        cities.forEach(c => { cityCounts[c] = (cityCounts[c] || 0) + 1; });
      }

      if (intake.playlist_adds !== null && intake.playlist_adds !== undefined) {
        track.streaming.playlist_adds = intake.playlist_adds;
      }

      track.streaming.discover_weekly = intake.discover_weekly;
      track.streaming.spotify_for_artists_date = body.date;

      // Append notes if provided
      if (intake.notes?.trim()) {
        const noteEntry = `[S4A ${body.date}]: ${intake.notes.trim()}`;
        const existing = track.streaming.s4a_notes || "";
        track.streaming.s4a_notes = existing
          ? `${existing}\n${noteEntry}`
          : noteEntry;
      }

      // Flags
      const sr = intake.save_rate_percent;
      if (sr !== null && sr !== undefined) {
        if (sr > 4) flags.strong.push(track.title);
        if (sr < 2) flags.weak.push(track.title);
      }
      if (intake.discover_weekly) flags.dw.push(track.title);

      updatedCount++;
    }

    // Update meta
    catalog._meta.updated = body.date;

    // Write back
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + "\n");

    // Top city
    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      flags,
      top_city: topCity,
      message: `${updatedCount} track${updatedCount !== 1 ? "s" : ""} updated`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
