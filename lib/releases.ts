// lib/releases.ts
// Release data — seeded to IndexedDB on first load so Oracle can shift dates dynamically.
// Never read SINGLES directly in UI components; use getDynamicReleases() instead.

import { getStoreValue, setStoreValue } from "@/lib/db";

/* ── Content Deliverables ── */
export type ContentDeliverables = {
  // Creative assets
  visualIdea: string;                                   // "The One Idea" per track
  primaryVideo: "none" | "planned" | "shot" | "edited" | "done";
  lyricVideo: "none" | "planned" | "edited" | "done";
  spotifyCanvas: boolean;
  announcementPost: boolean;
  instagramStory: boolean;
  youtubeVisualizer: boolean;
  youtubeThumbnail: boolean;
  prereleaseTeaser: boolean;
  reelsPosted: number;
  reelsGoal: number;
  tiktoksPosted: number;
  tiktoksGoal: number;
  brollClips: number;
  // Production prep
  variableSwapSheet: boolean;                           // palette, photos, copy angle filled
  paletteExtracted: boolean;
  sourcePhotoLocked: boolean;
  captionsWritten: boolean;
  postsScheduled: boolean;
  // Distribution
  amuseUploaded: boolean;
  preSaveLive: boolean;
  streamingLinksVerified: boolean;
  spotifyPitchSubmitted: boolean;
  // Registrations (per-track)
  isrcPulled: boolean;
  ascapRegistered: boolean;
  mlcRegistered: boolean;
  songtrustRegistered: boolean;
  musixmatchSubmitted: boolean;
  instrumentalRendered: boolean;
  // Marketing & Growth (Multiplier Engine)
  grooverPitchesSent: boolean;
  songtoolsCampaignLive: boolean;
  unhurdDataLogged: boolean;
  // Meta
  notes: string;
};

const DEFAULT_DELIVERABLES: ContentDeliverables = {
  visualIdea: "",
  primaryVideo: "none",
  lyricVideo: "none",
  spotifyCanvas: false,
  announcementPost: false,
  instagramStory: false,
  youtubeVisualizer: false,
  youtubeThumbnail: false,
  prereleaseTeaser: false,
  reelsPosted: 0,
  reelsGoal: 20,
  tiktoksPosted: 0,
  tiktoksGoal: 30,
  brollClips: 0,
  variableSwapSheet: false,
  paletteExtracted: false,
  sourcePhotoLocked: false,
  captionsWritten: false,
  postsScheduled: false,
  amuseUploaded: false,
  preSaveLive: false,
  streamingLinksVerified: false,
  spotifyPitchSubmitted: false,
  isrcPulled: false,
  ascapRegistered: false,
  mlcRegistered: false,
  songtrustRegistered: false,
  musixmatchSubmitted: false,
  instrumentalRendered: false,
  grooverPitchesSent: false,
  songtoolsCampaignLive: false,
  unhurdDataLogged: false,
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
  { title: "ALL LOVE (Album)",  uploadDate: "2026-04-07", releaseDate: "2026-04-17", status: "unreleased", contentDeliverables: { ...DEFAULT_DELIVERABLES } },
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 12; // v12: added ALL LOVE album entry for album-level Kill List task derivation

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
