// lib/assetVault.ts
// Master Asset Vault — centralized resource layer for all Label OS agents.
// Static data: studioData.ts (Cyanite / sonic analysis), brandVoice.ts
// Dynamic data: lyrics, cover art, reference photos → persisted in IndexedDB

import { getStoreValue, setStoreValue } from "@/lib/db";
import { PROJECTS, type Track } from "@/lib/studioData";
import { BRAND_VOICE } from "@/lib/brandVoice";

// ── Types ────────────────────────────────────────────────────────────

export type MoodScores = {
  sexy: number | null;
  chill: number | null;
  romantic: number | null;
  happy: number | null;
  energetic: number | null;
  uplifting: number | null;
};

export type SonicInfo = {
  bpm: number | null;
  key: string;
  moodScores: MoodScores;
  rbConfidence: number | null;
  project: string;       // which album/project
  projectRole: string;   // e.g. "Re-establish presence, lead project"
};

export type TrackAssets = {
  title: string;
  sonic: SonicInfo;
  // User-provided — stored in IndexedDB
  lyrics: string | null;
  lyricsSnippet: string | null;  // first 4 non-empty lines, auto-extracted
  // Visual — user-uploaded or AI-generated (stored as data URLs or remote URLs)
  coverArtUrl: string | null;
  visualReferences: string[];    // mood board image URLs/data-URLs
};

export type ArtistAssets = {
  baselinePhotos: string[];  // artist reference photos for AI image gen (data URLs)
  physicalDescription: string | null;
  pressKitBio: string | null;
  oneLiner: string | null;
  brandVoice: typeof BRAND_VOICE;
};

// ── Static Lookup (from Cyanite data in studioData.ts) ───────────────

function findTrack(title: string): { track: Track; project: string; role: string } | null {
  for (const project of PROJECTS) {
    const track = project.tracks.find(
      t => t.title.toLowerCase() === title.toLowerCase()
    );
    if (track) return { track, project: project.name, role: project.role };
  }
  return null;
}

const EMPTY_SONIC: SonicInfo = {
  bpm: null,
  key: "",
  moodScores: { sexy: null, chill: null, romantic: null, happy: null, energetic: null, uplifting: null },
  rbConfidence: null,
  project: "",
  projectRole: "",
};

function buildSonicInfo(title: string): SonicInfo {
  const found = findTrack(title);
  if (!found) return EMPTY_SONIC;
  const t = found.track;
  return {
    bpm: t.bpm,
    key: t.key,
    moodScores: {
      sexy: t.sexy,
      chill: t.chill,
      romantic: t.romantic,
      happy: t.happy,
      energetic: t.energetic,
      uplifting: t.uplifting,
    },
    rbConfidence: t.rbConf,
    project: found.project,
    projectRole: found.role,
  };
}

// ── Track Asset CRUD ─────────────────────────────────────────────────

function vaultKey(title: string) {
  return `vault_track:${title.toLowerCase().replace(/\s+/g, "_")}`;
}

export async function getTrackAssets(title: string): Promise<TrackAssets> {
  // Sonic is always auto-populated from studioData (static, no API needed)
  const sonic = buildSonicInfo(title);
  // Dynamic data from IndexedDB
  const stored = await getStoreValue<Partial<TrackAssets>>(vaultKey(title));
  return {
    title,
    sonic,
    lyrics: stored?.lyrics ?? null,
    lyricsSnippet: stored?.lyricsSnippet ?? null,
    coverArtUrl: stored?.coverArtUrl ?? null,
    visualReferences: stored?.visualReferences ?? [],
  };
}

async function patchVaultTrack(title: string, patch: Partial<TrackAssets>): Promise<void> {
  const stored = await getStoreValue<Partial<TrackAssets>>(vaultKey(title)) ?? {};
  await setStoreValue(vaultKey(title), { ...stored, ...patch });
}

export async function saveTrackLyrics(title: string, lyrics: string): Promise<void> {
  const lines = lyrics.split("\n").filter(l => l.trim());
  await patchVaultTrack(title, {
    lyrics,
    lyricsSnippet: lines.slice(0, 4).join("\n"),
  });
}

export async function saveTrackCoverArt(title: string, url: string): Promise<void> {
  await patchVaultTrack(title, { coverArtUrl: url });
}

export async function addVisualReference(title: string, url: string): Promise<void> {
  const assets = await getTrackAssets(title);
  const refs = [...assets.visualReferences, url];
  await patchVaultTrack(title, { visualReferences: refs });
}

export async function removeVisualReference(title: string, index: number): Promise<void> {
  const assets = await getTrackAssets(title);
  const refs = assets.visualReferences.filter((_, i) => i !== index);
  await patchVaultTrack(title, { visualReferences: refs });
}

// ── Artist-Level CRUD ────────────────────────────────────────────────

const ARTIST_KEY = "vault_artist";

export async function getArtistAssets(): Promise<ArtistAssets> {
  const stored = await getStoreValue<Partial<ArtistAssets>>(ARTIST_KEY);
  return {
    baselinePhotos: stored?.baselinePhotos ?? [],
    physicalDescription: stored?.physicalDescription ?? null,
    pressKitBio: stored?.pressKitBio ?? null,
    oneLiner: stored?.oneLiner ?? null,
    brandVoice: BRAND_VOICE,
  };
}

export async function addArtistPhoto(dataUrl: string): Promise<void> {
  const stored = await getStoreValue<Partial<ArtistAssets>>(ARTIST_KEY) ?? {};
  const photos = [...(stored.baselinePhotos ?? []), dataUrl];
  await setStoreValue(ARTIST_KEY, { ...stored, baselinePhotos: photos });
}

export async function removeArtistPhoto(index: number): Promise<void> {
  const stored = await getStoreValue<Partial<ArtistAssets>>(ARTIST_KEY) ?? {};
  const photos = (stored.baselinePhotos ?? []).filter((_, i) => i !== index);
  await setStoreValue(ARTIST_KEY, { ...stored, baselinePhotos: photos });
}

export async function saveArtistBio(bio: string, oneLiner: string): Promise<void> {
  const stored = await getStoreValue<Partial<ArtistAssets>>(ARTIST_KEY) ?? {};
  await setStoreValue(ARTIST_KEY, { ...stored, pressKitBio: bio, oneLiner });
}

export async function saveArtistPhysicalDescription(desc: string): Promise<void> {
  const stored = await getStoreValue<Partial<ArtistAssets>>(ARTIST_KEY) ?? {};
  await setStoreValue(ARTIST_KEY, { ...stored, physicalDescription: desc });
}

// ── Context Builders — prompt-ready text for agent injection ─────────

export function buildSonicContext(assets: TrackAssets): string {
  const s = assets.sonic;
  if (!s.bpm && !s.key) {
    return `TRACK: "${assets.title}" — no Cyanite data available.`;
  }
  const m = s.moodScores;
  const moods: string[] = [];
  if (m.sexy    != null && m.sexy    > 0.4) moods.push(`sexy ${Math.round(m.sexy    * 100)}%`);
  if (m.chill   != null && m.chill   > 0.4) moods.push(`chill ${Math.round(m.chill   * 100)}%`);
  if (m.romantic != null && m.romantic > 0.4) moods.push(`romantic ${Math.round(m.romantic * 100)}%`);
  if (m.happy   != null && m.happy   > 0.4) moods.push(`happy ${Math.round(m.happy   * 100)}%`);
  if (m.energetic != null && m.energetic > 0.3) moods.push(`energetic ${Math.round(m.energetic * 100)}%`);
  if (m.uplifting != null && m.uplifting > 0.3) moods.push(`uplifting ${Math.round(m.uplifting * 100)}%`);

  return [
    `TRACK: "${assets.title}" — from project "${s.project}"`,
    `BPM: ${s.bpm ?? "unknown"} | KEY: ${s.key || "unknown"}`,
    s.rbConfidence != null ? `R&B CONFIDENCE: ${Math.round(s.rbConfidence * 100)}%` : "",
    moods.length > 0 ? `MOOD PROFILE (Cyanite): ${moods.join(", ")}` : "",
    s.projectRole ? `PROJECT ROLE: ${s.projectRole}` : "",
  ].filter(Boolean).join("\n");
}

export function buildLyricsContext(assets: TrackAssets): string {
  if (!assets.lyrics) return "LYRICS: Not yet provided.";
  return `LYRICS:\n${assets.lyrics}`;
}

export function buildLyricsSnippetContext(assets: TrackAssets): string {
  if (!assets.lyricsSnippet) return "LYRICS SNIPPET: Not yet provided.";
  return `LYRICS SNIPPET:\n${assets.lyricsSnippet}`;
}

export function buildVisualContext(assets: TrackAssets): string {
  const parts: string[] = [];
  if (assets.coverArtUrl) {
    parts.push("COVER ART: Uploaded and available in vault. Use this as the primary visual anchor when generating new assets.");
  }
  if (assets.visualReferences.length > 0) {
    parts.push(`VISUAL REFERENCES: ${assets.visualReferences.length} mood board image(s) uploaded. These represent the artist's visual direction for this track.`);
  }
  return parts.length > 0 ? `VISUAL ASSETS:\n${parts.join("\n")}` : "VISUAL ASSETS: None uploaded yet.";
}

export function buildFullTrackContext(assets: TrackAssets): string {
  return [
    buildSonicContext(assets),
    "",
    buildLyricsContext(assets),
    "",
    buildVisualContext(assets),
  ].join("\n");
}

// Lightweight version for APIs with smaller context budgets
export function buildCompactTrackContext(assets: TrackAssets): string {
  return [
    buildSonicContext(assets),
    "",
    buildLyricsSnippetContext(assets),
  ].join("\n");
}

// Full context for Creative Dept — includes past canonical creative direction
export function buildCreativeContext(
  assets: TrackAssets,
  pastCanonicalPrompts: string[]
): string {
  const parts = [
    buildSonicContext(assets),
    "",
    buildLyricsContext(assets),
    "",
    buildVisualContext(assets),
  ];

  if (pastCanonicalPrompts.length > 0) {
    parts.push("");
    parts.push("PAST CANONICAL SELECTIONS (artist approved these — match this direction):");
    pastCanonicalPrompts.forEach((p, i) => {
      parts.push(`  ${i + 1}. ${p.slice(0, 200)}${p.length > 200 ? "..." : ""}`);
    });
  }

  return parts.join("\n");
}
