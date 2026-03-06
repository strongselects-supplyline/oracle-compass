// lib/releases.ts
// Release data — seeded to IndexedDB on first load so Oracle can shift dates dynamically.
// Never read SINGLES directly in UI components; use getDynamicReleases() instead.

import { getStoreValue, setStoreValue } from "@/lib/db";

export type Release = {
  title: string;
  uploadDate: string;   // YYYY-MM-DD
  releaseDate: string;  // YYYY-MM-DD
  status: "live" | "upload_pending" | "unreleased";
  pitchDeadline?: string | null;
};

// Canonical defaults — source of truth for first seed only
const RELEASE_DEFAULTS: Release[] = [
  { title: "SEE ME", uploadDate: "2026-03-04", releaseDate: "2026-03-06", status: "upload_pending" },
  { title: "ESL", uploadDate: "2026-03-11", releaseDate: "2026-03-13", status: "unreleased" },
  { title: "Sweet Frustration", uploadDate: "2026-03-18", releaseDate: "2026-03-20", status: "unreleased" },
  { title: "I Like Girls", uploadDate: "2026-03-25", releaseDate: "2026-03-27", status: "unreleased" },
  { title: "Like I Did", uploadDate: "2026-04-01", releaseDate: "2026-04-03", status: "unreleased" },
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 2; // Bump this to force re-seed when defaults change

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
  if (stored && stored.length > 0) return stored;
  // First load — seed defaults
  await setStoreValue(RELEASES_KEY, RELEASE_DEFAULTS);
  await setStoreValue(RELEASES_VERSION_KEY, RELEASE_DATA_VERSION);
  return RELEASE_DEFAULTS;
}

export async function saveDynamicReleases(releases: Release[]): Promise<void> {
  await setStoreValue(RELEASES_KEY, releases);
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
export const ALBUM_RELEASE_DATE = "2026-04-10";
