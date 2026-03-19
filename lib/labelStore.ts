// lib/labelStore.ts
// Persistent storage for Label OS agent outputs.
// Every agent writes here. Every agent reads from here.
// Cross-agent pull happens through this shared store.

import { getStoreValue, setStoreValue } from "@/lib/db";

// ── Types ────────────────────────────────────────────────────────────

export type CopyVariant = {
  id: string;
  type: "tiktok_caption" | "ig_feed" | "spotify_pitch" | "curator_dm" | "press_bio_short";
  text: string;
  score: number;          // 0-100 from Sonnet scoring
  isCanonical: boolean;   // user selected this as THE version
  editedText: string | null; // user's edited version (null = unedited)
  generatedAt: string;    // ISO timestamp
};

export type CreativeAsset = {
  id: string;
  type: "video_treatment" | "cover_art_prompt" | "merch_concept" | "spotify_canvas_concept";
  content: string;        // the generated text/prompt
  isCanonical: boolean;
  editedContent: string | null;
  generatedAt: string;
};

export type SonicProfile = {
  bpm: number;
  key: string;
  genreBreakdown: Record<string, number>; // e.g. { "R&B": 40, "Pop": 25 }
  moodTags: string[];
  comparableArtists: string[];
  pitchAngle: string;     // one-sentence sonic positioning
  generatedAt: string;
};

export type TrackLabelData = {
  trackTitle: string;
  // Copy Vault
  copyVariants: CopyVariant[];
  // Creative Dept
  creativeAssets: CreativeAsset[];
  // A&R
  sonicProfile: SonicProfile | null;
  // Voice examples (user-curated canonical selections for future generation)
  voiceExamples: {
    type: string;
    original: string;
    edited: string;       // what the user actually wanted
    selectedAt: string;
  }[];
};

// ── Storage Keys ─────────────────────────────────────────────────────

function trackKey(title: string): string {
  return `label_track:${title.toLowerCase().replace(/\s+/g, "_")}`;
}

// ── CRUD ─────────────────────────────────────────────────────────────

export async function getTrackLabelData(title: string): Promise<TrackLabelData> {
  const stored = await getStoreValue<TrackLabelData>(trackKey(title));
  if (stored) return stored;
  return {
    trackTitle: title,
    copyVariants: [],
    creativeAssets: [],
    sonicProfile: null,
    voiceExamples: [],
  };
}

export async function saveTrackLabelData(data: TrackLabelData): Promise<void> {
  await setStoreValue(trackKey(data.trackTitle), data);
}

// ── Canonical Getters (for cross-agent pull) ─────────────────────────

export async function getCanonicalCopy(title: string, type: CopyVariant["type"]): Promise<string | null> {
  const data = await getTrackLabelData(title);
  const canonical = data.copyVariants.find(v => v.type === type && v.isCanonical);
  if (!canonical) return null;
  return canonical.editedText || canonical.text;
}

export async function getCanonicalCreative(title: string, type: CreativeAsset["type"]): Promise<string | null> {
  const data = await getTrackLabelData(title);
  const canonical = data.creativeAssets.find(a => a.type === type && a.isCanonical);
  if (!canonical) return null;
  return canonical.editedContent || canonical.content;
}

export async function getSonicProfile(title: string): Promise<SonicProfile | null> {
  const data = await getTrackLabelData(title);
  return data.sonicProfile;
}

// ── Voice Examples (for learning loop) ───────────────────────────────

export async function getVoiceExamples(type: string, limit: number = 5): Promise<{ original: string; edited: string }[]> {
  // Pull voice examples across ALL tracks for this content type
  // This is the learning loop — past selections inform future generation
  const allKeys = await getStoreValue<string[]>("label_track_keys");
  if (!allKeys) return [];

  const examples: { original: string; edited: string; selectedAt: string }[] = [];
  for (const key of allKeys) {
    const data = await getStoreValue<TrackLabelData>(key);
    if (data?.voiceExamples) {
      examples.push(...data.voiceExamples.filter(e => e.type === type));
    }
  }

  // Sort by most recent, return top N
  examples.sort((a, b) => new Date(b.selectedAt).getTime() - new Date(a.selectedAt).getTime());
  return examples.slice(0, limit).map(e => ({ original: e.original, edited: e.edited }));
}

// ── Track key registry (for cross-track queries) ─────────────────────

export async function registerTrackKey(title: string): Promise<void> {
  const key = trackKey(title);
  const existing = await getStoreValue<string[]>("label_track_keys") || [];
  if (!existing.includes(key)) {
    existing.push(key);
    await setStoreValue("label_track_keys", existing);
  }
}

// ── Select as Canonical ──────────────────────────────────────────────

export async function selectCanonicalCopy(
  title: string,
  variantId: string,
  editedText?: string
): Promise<void> {
  const data = await getTrackLabelData(title);

  // Deselect all variants of the same type
  const variant = data.copyVariants.find(v => v.id === variantId);
  if (!variant) return;

  data.copyVariants = data.copyVariants.map(v => ({
    ...v,
    isCanonical: v.id === variantId ? true : (v.type === variant.type ? false : v.isCanonical),
    editedText: v.id === variantId ? (editedText ?? v.editedText) : v.editedText,
  }));

  // Save as voice example for future learning
  if (editedText && editedText !== variant.text) {
    data.voiceExamples.push({
      type: variant.type,
      original: variant.text,
      edited: editedText,
      selectedAt: new Date().toISOString(),
    });
  }

  await saveTrackLabelData(data);
  await registerTrackKey(title);
}

export async function selectCanonicalCreative(
  title: string,
  assetId: string,
  editedContent?: string
): Promise<void> {
  const data = await getTrackLabelData(title);
  const asset = data.creativeAssets.find(a => a.id === assetId);
  if (!asset) return;

  data.creativeAssets = data.creativeAssets.map(a => ({
    ...a,
    isCanonical: a.id === assetId ? true : (a.type === asset.type ? false : a.isCanonical),
    editedContent: a.id === assetId ? (editedContent ?? a.editedContent) : a.editedContent,
  }));

  if (editedContent && editedContent !== asset.content) {
    data.voiceExamples.push({
      type: asset.type,
      original: asset.content,
      edited: editedContent,
      selectedAt: new Date().toISOString(),
    });
  }

  await saveTrackLabelData(data);
  await registerTrackKey(title);
}
