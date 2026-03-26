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
  canvasRendered: boolean;
  lyricsSynced: boolean;
  creditsWritten: boolean;
  folderOrganized: boolean;
  preSaveLinkActive: boolean;
  // Distribution
  amuseUploaded: boolean;
  preSaveLive: boolean;
  streamingLinksVerified: boolean;
  spotifyPitchSubmitted: boolean;
  musixmatchSubmitted: boolean;
  instrumentalRendered: boolean;
  // Compliance / Registration
  isrcPulled: boolean;
  ascap: string;
  ascapRegistered: boolean;
  mlc: string;
  mlcRegistered: boolean;
  soundExchange: string;
  songtrust: string;
  songtrustRegistered: boolean;
  copyrightOffice: string;
  splitSheetSigned: boolean;
  // Marketing & Growth (Multiplier Engine)
  grooverPitchesSent: boolean;
  songtoolsCampaignLive: boolean;
  unhurdDataLogged: boolean;
  // Core Drive Pipeline
  coreDriveComplete: boolean;        // Cyanite → Antigravity matrix pipeline has been run
  campaignKitGenerated: boolean;     // 4-agent refinement pipeline produced a campaign kit
  masteringVerified: boolean;        // New Age Mastering protocol verified
  gorillaGeoComplete: boolean;       // Gorilla Geo pipeline executed
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
  canvasRendered: false,
  lyricsSynced: false,
  creditsWritten: false,
  folderOrganized: false,
  preSaveLinkActive: false,
  amuseUploaded: false,
  preSaveLive: false,
  streamingLinksVerified: false,
  spotifyPitchSubmitted: false,
  musixmatchSubmitted: false,
  instrumentalRendered: false,
  isrcPulled: false,
  ascap: "not_started",
  ascapRegistered: false,
  mlc: "not_started",
  mlcRegistered: false,
  soundExchange: "not_started",
  songtrust: "not_started",
  songtrustRegistered: false,
  copyrightOffice: "not_started",
  splitSheetSigned: false,
  grooverPitchesSent: false,
  songtoolsCampaignLive: false,
  unhurdDataLogged: false,
  coreDriveComplete: false,
  campaignKitGenerated: false,
  masteringVerified: false,
  gorillaGeoComplete: false,
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
// EP tracks only: SEE ME, East Side Love, Sweet Frustration, Like I Did, ALL LOVE (EP)
// 7 parked album tracks are NOT in this list — they do not drive Kill List tasks
const RELEASE_DEFAULTS: Release[] = [
  { 
    title: "SEE ME", uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live", 
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, ascap: "pending", mlc: "pending", soundExchange: "complete", songtrust: "pending", notes: "Live Mar 13. Core Drive: 2,713 tracks / 38 playlists. Campaign kit in docs/handoff_mar24/." } 
  },
  { 
    title: "East Side Love", uploadDate: "2026-03-26", releaseDate: "2026-04-03", status: "unreleased", 
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "Core Drive: 1,221 tracks / 20 playlists. Campaign kit in docs/handoff_mar24/." } 
  },
  { 
    title: "Sweet Frustration", uploadDate: "2026-04-06", releaseDate: "2026-04-10", status: "unreleased", 
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "Core Drive: 1,134 tracks / 20 playlists. KAYTRANADA lane. Campaign kit in docs/handoff_mar24/." } 
  },
  { 
    title: "Like I Did", uploadDate: "2026-04-13", releaseDate: "2026-04-17", status: "unreleased", 
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "Core Drive: via Worth It analysis (97 BPM F minor pocket). Campaign kit = worth_it_campaign_kit.md in docs/handoff_mar24/." } 
  },
  { 
    title: "ALL LOVE (EP)", uploadDate: "2026-04-14", releaseDate: "2026-04-24", status: "unreleased", 
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP entity. Upload to Amuse by Apr 14. Drops Apr 24. Needs: EP cover art, track sequencing, UPC, EP-level Spotify pitch." } 
  },
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 19; // v19: ESL upload accelerated to Mar 26 (tonight) per user request

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

// Static EP date — this is the fixed north star, doesn't shift
// (ALL LOVE converted from album to EP on Mar 21, 2026 — 7 tracks parked for post-EP release)
export const EP_RELEASE_DATE = "2026-04-24";
/** @deprecated Use EP_RELEASE_DATE. Kept for any stale import references. */
export const ALBUM_RELEASE_DATE = EP_RELEASE_DATE;
