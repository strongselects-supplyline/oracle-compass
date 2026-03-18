// lib/releases.ts
// Release data — seeded to IndexedDB on first load so Oracle can shift dates dynamically.
// Never read SINGLES directly in UI components; use getDynamicReleases() instead.

import { getStoreValue, setStoreValue } from "@/lib/db";

/* ── Content Deliverables ── */
export type ContentDeliverables = {
  visualIdea: string;                                   // "The One Idea" per track
  primaryVideo: "none" | "planned" | "shot" | "edited" | "done";
  lyricVideo: "none" | "planned" | "edited" | "done";
  reelsPosted: number;                                  // running tally
  reelsGoal: number;                                    // target per release window
  tiktoksPosted: number;
  tiktoksGoal: number;
  brollClips: number;                                   // raw B-roll clips captured
  notes: string;                                        // freeform production notes
};

const DEFAULT_DELIVERABLES: ContentDeliverables = {
  visualIdea: "",
  primaryVideo: "none",
  lyricVideo: "none",
  reelsPosted: 0,
  reelsGoal: 20,
  tiktoksPosted: 0,
  tiktoksGoal: 30,
  brollClips: 0,
  notes: "",
};

/* ── Release type ── */
export type Release = {
  title: string;
  uploadDate: string;   // YYYY-MM-DD
  releaseDate: string;  // YYYY-MM-DD
  status: "live" | "upload_pending" | "unreleased";
  pitchDeadline?: string | null;
  contentDeliverables: ContentDeliverables;
};

// Canonical defaults — source of truth for first seed only
const RELEASE_DEFAULTS: Release[] = [
  { title: "SEE ME",            uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live", contentDeliverables: { ...DEFAULT_DELIVERABLES } },
  { title: "East Side Love",    uploadDate: "2026-03-23", releaseDate: "2026-03-27", status: "unreleased", contentDeliverables: { ...DEFAULT_DELIVERABLES } },
  { title: "Sweet Frustration", uploadDate: "2026-03-30", releaseDate: "2026-04-03", status: "unreleased", contentDeliverables: { ...DEFAULT_DELIVERABLES } },
  { title: "Like I Did",        uploadDate: "2026-04-06", releaseDate: "2026-04-10", status: "unreleased", contentDeliverables: { ...DEFAULT_DELIVERABLES } },
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 9; // v9: SEE ME status → live, studioData synced, flag dedup fix. Mar 18 2026

// Read from IndexedDB, seeding defaults on first call or after version bump
export async function getDynamicReleases(): Promise<Release[]> {
  const storedVersion = await getStoreValue<number>(RELEASES_VERSION_KEY);
  if (storedVersion !== RELEASE_DATA_VERSION) {
    // Force re-seed — defaults have changed
    await setStoreValue(RELEASES_KEY, RELEASE_DEFAULTS);
    await setStoreValue(RELEASES_VERSION_KEY, RELEASE_DATA_VERSION);
    return RELEASE_DEFAULTS;
  }
  const stored = await getStoreValue<Release[]>(RELEASES_KEY);
  if (stored && stored.length > 0) {
    // Back-fill contentDeliverables for any releases that lack it (migration safety)
    const patched = stored.map(r => ({
      ...r,
      contentDeliverables: r.contentDeliverables
        ? { ...DEFAULT_DELIVERABLES, ...r.contentDeliverables }
        : { ...DEFAULT_DELIVERABLES },
    }));
    return patched;
  }
  // First load — seed defaults
  await setStoreValue(RELEASES_KEY, RELEASE_DEFAULTS);
  await setStoreValue(RELEASES_VERSION_KEY, RELEASE_DATA_VERSION);
  return RELEASE_DEFAULTS;
}

export async function saveDynamicReleases(releases: Release[]): Promise<void> {
  await setStoreValue(RELEASES_KEY, releases);
}

// Update content deliverables for a specific track
export async function updateContentDeliverables(
  title: string,
  patch: Partial<ContentDeliverables>
): Promise<void> {
  const releases = await getDynamicReleases();
  const updated = releases.map(r => {
    if (r.title !== title) return r;
    return {
      ...r,
      contentDeliverables: { ...r.contentDeliverables, ...patch },
    };
  });
  await saveDynamicReleases(updated);
}

// Shift a specific release's dates forward by N days
export async function shiftRelease(title: string, days: number): Promise<void> {
  const releases = await getDynamicReleases();
  const updated = releases.map(r => {
    if (r.title !== title) return r;
    const upload = new Date(r.uploadDate);
    const release = new Date(r.releaseDate);
    upload.setUTCDate(upload.getUTCDate() + days);
    release.setUTCDate(release.getUTCDate() + days);
    return {
      ...r,
      uploadDate: upload.toISOString().split("T")[0],
      releaseDate: release.toISOString().split("T")[0],
    };
  });
  await saveDynamicReleases(updated);
}

// Static album date — this is the fixed north star, doesn't shift
export const ALBUM_RELEASE_DATE = "2026-04-17";
