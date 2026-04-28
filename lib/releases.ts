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
// Apr 27 WATERFALL PIVOT: Singles drip 2 weeks apart → EP compilation at end.
// ESL May 9 → GL May 23 → SF Jun 6 → EP Jun 20. WU2 is EP-exclusive.
const RELEASE_DEFAULTS: Release[] = [
  {
    title: "SEE ME", uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, ascap: "pending", mlc: "pending", soundExchange: "complete", songtrust: "pending", notes: "Live Mar 13. Core Drive: 2,713 tracks / 38 playlists. Campaign kit in docs/handoff_mar24/." }
  },
  {
    title: "East Side Love", uploadDate: "2026-05-02", releaseDate: "2026-05-09", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "SINGLE #1 (lead). Waterfall → EP track Jun 20. Fix audio file, re-upload to Amuse. Core Drive: 1,221 tracks / 20 playlists." }
  },
  {
    title: "Green Light", uploadDate: "2026-05-16", releaseDate: "2026-05-23", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "SINGLE #2. Master must lock by May 14. Upload May 16. Waterfall → EP track Jun 20." }
  },
  {
    title: "Sweet Frustration", uploadDate: "2026-05-30", releaseDate: "2026-06-06", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "SINGLE #3. KAYTRANADA lane. Master must lock by May 28. Upload May 30. Waterfall → EP track Jun 20." }
  },
  {
    title: "WANT U 2", uploadDate: "2026-06-13", releaseDate: "2026-06-20", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP-EXCLUSIVE. Not released as single. Gives listeners incentive to play the full EP. Master must lock by Jun 11." }
  },
  {
    title: "ALL LOVE (EP)", uploadDate: "2026-06-13", releaseDate: "2026-06-20", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "5-track EP compilation: SEE ME → East Side Love → Green Light → Sweet Frustration → WANT U 2. Waterfall all 3 single ISRCs + SEE ME ISRC onto EP tracks. WU2 is EP-exclusive new content. Needs: EP cover art, UPC, EP-level Spotify pitch." }
  },
  {
    title: "Like I Did", uploadDate: "2026-07-18", releaseDate: "2026-07-25", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #1. 110 BPM, D major. First post-EP release. Tests if audience stuck. Jul 18 unconditional topline/recording batch week begins." }
  },
  {
    title: "I Like Girls", uploadDate: "2026-08-01", releaseDate: "2026-08-08", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #2. 107 BPM, F# minor, R&B 0.74. High R&B confidence. Strong standalone." }
  },
  {
    title: "Worth It", uploadDate: "2026-08-15", releaseDate: "2026-08-22", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #3. 97 BPM, F minor, R&B 0.57. Slower tempo = mood shift. Tests range." }
  },
  {
    title: "Just Say So", uploadDate: "2026-08-29", releaseDate: "2026-09-05", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #4. 122 BPM, Bb minor, R&B 0.60. Uptempo. Meme-friendly energy." }
  },
  {
    title: "Reconnect", uploadDate: "2026-09-12", releaseDate: "2026-09-19", status: "unreleased",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #5. 82 BPM, D major, R&B 0.56. Only major key. Warm/intimate. Palette cleanser before CREAM." }
  },
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 33; // v33: Apr 28 — INDEPENDENCE BUILD. Vault singles: Like I Did Jul 25, I Like Girls Aug 8, Worth It Aug 22, Just Say So Sep 5, Reconnect Sep 19. Oracle runs autonomously through Sep 25.

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
// Apr 27 WATERFALL PIVOT: Singles drip → EP Jun 20. ESL May 9, GL May 23, SF Jun 6.
export const EP_RELEASE_DATE = "2026-06-20";
export const ESL_SINGLE_RELEASE_DATE = "2026-05-09";
/** @deprecated Use EP_RELEASE_DATE. Kept for any stale import references. */
export const ALBUM_RELEASE_DATE = EP_RELEASE_DATE;

// How many days after EP drop we display "Honeymoon Phase" on the homepage instead of a countdown
export const EP_HONEYMOON_DAYS = 30;
