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
// type breakdown:
//   waterfall_single — planned single in the EP waterfall (ESL, GL, SF)
//   ep               — the ALL LOVE EP compilation itself
//   ep_track         — track on the EP that is NOT released as a standalone single
//   vault_single     — post-EP scheduled release (Like I Did, ILG, etc.)
//   loosie           — spontaneous standalone; unscheduled, may absorb into future project
export type ReleaseType = "waterfall_single" | "ep" | "ep_track" | "vault_single" | "loosie";

export type Release = {
  title: string;
  uploadDate: string;   // YYYY-MM-DD
  releaseDate: string;  // YYYY-MM-DD
  status: "live" | "upload_pending" | "unreleased";
  type: ReleaseType;    // determines Oracle handling + campaign lifecycle
  projectTarget?: string | null; // if loosie, which project it MIGHT roll into ("EP2", "deluxe", etc.)
  pitchDeadline?: string | null;
  contentDeliverables: ContentDeliverables;
};

// Canonical defaults — source of truth for first seed only
// Apr 29 EP BOMB PIVOT: Full 5-track EP drops May 15 (ICEMAN day).
// All tracks upload May 7. Post-EP vault waterfall starts May 30.
const RELEASE_DEFAULTS: Release[] = [
  {
    title: "SEE ME", uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, ascap: "pending", mlc: "pending", soundExchange: "complete", songtrust: "pending", notes: "Live Mar 13. EP track 1. Core Drive: 2,713 tracks / 38 playlists. ISRC exists (not recorded — pull from Amuse)." }
  },
  {
    title: "East Side Love", uploadDate: "2026-04-30", releaseDate: "2026-05-08", status: "upload_pending", type: "waterfall_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "ADVANCE SINGLE — uploaded Apr 30, releases May 8 (MSTR 2). Also EP track 2. Release Radar trigger #1 (May 8). EP carries it as track 2 on May 15. Cyanite: 104 BPM, C# minor, R&B 0.84, Sexy 0.85. Core Drive: 1,221 tracks / 20 playlists." }
  },
  {
    title: "Green Light", uploadDate: "2026-05-07", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP track 3. NOT a standalone single. Drops as part of EP bomb May 15." }
  },
  {
    title: "Sweet Frustration", uploadDate: "2026-05-07", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "EP track 4. KAYTRANADA lane. NOT a standalone single. Drops as part of EP bomb May 15." }
  },
  {
    title: "WANT U 2", uploadDate: "2026-05-07", releaseDate: "2026-05-15", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP track 5. EP-exclusive — never released as single. Gives listeners incentive to play the full EP." }
  },
  {
    title: "ALL LOVE (EP)", uploadDate: "2026-05-07", releaseDate: "2026-05-15", status: "unreleased", type: "ep",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "5-track EP: Green Light → Sweet Frustration → SEE ME → East Side Love → WANT U 2. GL/SF open — 2.0 streams/listener means most bail after track 2, new tracks must hit first. ESL advance single May 8 (Release Radar #1). EP May 15 (Release Radar #2 via GL/SF/WU2). Editorial pitch: Sweet Frustration (KAYTRANADA lane, genre outlier). Needs: EP cover art (DEADLINE May 5), UPC, EP-level Spotify pitch." }
  },
  {
    title: "Like I Did", uploadDate: "2026-05-23", releaseDate: "2026-05-30", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #1. 110 BPM, D major. First post-EP release. 2-week cadence begins." }
  },
  {
    title: "I Like Girls", uploadDate: "2026-06-06", releaseDate: "2026-06-13", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #2. 107 BPM, F# minor, R&B 0.74. High R&B confidence." }
  },
  {
    title: "Worth It", uploadDate: "2026-06-20", releaseDate: "2026-06-27", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #3. 97 BPM, F minor, R&B 0.57. Slower tempo = mood shift." }
  },
  {
    title: "Just Say So", uploadDate: "2026-07-04", releaseDate: "2026-07-11", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #4. 122 BPM, Bb minor, R&B 0.60. Uptempo. Meme-friendly." }
  },
  {
    title: "Reconnect", uploadDate: "2026-07-18", releaseDate: "2026-07-25", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #5. 82 BPM, D major, R&B 0.56. Warm/intimate. Palette cleanser before CREAM." }
  },
  // Loosies are added dynamically by the user — no defaults seeded here.
  // Use addLoosie() to register a new loosie at any time.
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 36; // v36: May 1 — STAGGER AMENDMENT. ESL advance single May 8, EP May 15. Tracklist reorder (GL/SF first). SF editorial pitch.

// Read from IndexedDB, seeding defaults on first call or after version bump
export async function getDynamicReleases(): Promise<Release[]> {
  const storedVersion = await getStoreValue<number>(RELEASES_VERSION_KEY);
  if (storedVersion !== RELEASE_DATA_VERSION) {
    // Force re-seed — defaults have changed. Preserve any loosies already added.
    const existing = await getStoreValue<Release[]>(RELEASES_KEY);
    const existingLoosies = (existing || []).filter(r => r.type === 'loosie');
    const merged = [...RELEASE_DEFAULTS, ...existingLoosies];
    await setStoreValue(RELEASES_KEY, merged);
    await setStoreValue(RELEASES_VERSION_KEY, RELEASE_DATA_VERSION);
    return merged;
  }
  const stored = await getStoreValue<Release[]>(RELEASES_KEY);
  if (stored && stored.length > 0) {
    // Back-fill type + contentDeliverables for any releases that lack them (migration safety)
    const patched = stored.map(r => ({
      ...r,
      type: r.type || 'ep_track' as ReleaseType,
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

/**
 * Register a new loosie — a spontaneous standalone track, unscheduled.
 * Loosies skip the waterfall lifecycle. They can optionally be assigned
 * to a projectTarget (e.g. "EP2", "deluxe", "CREAM") later.
 */
export async function addLoosie({
  title,
  uploadDate,
  releaseDate,
  projectTarget = null,
  notes = "",
}: {
  title: string;
  uploadDate: string;
  releaseDate: string;
  projectTarget?: string | null;
  notes?: string;
}): Promise<void> {
  const releases = await getDynamicReleases();
  const loosie: Release = {
    title,
    uploadDate,
    releaseDate,
    status: 'unreleased',
    type: 'loosie',
    projectTarget,
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes },
  };
  await saveDynamicReleases([...releases, loosie]);
}

/**
 * Promote a loosie into a project — changes its type and assigns it.
 * Call this when EP decides to absorb a loosie into an EP/album/deluxe.
 */
export async function promoteLoosie(title: string, projectTarget: string, newType: Exclude<ReleaseType, 'loosie'> = 'vault_single'): Promise<void> {
  const releases = await getDynamicReleases();
  const updated = releases.map(r =>
    r.title === title && r.type === 'loosie'
      ? { ...r, type: newType, projectTarget }
      : r
  );
  await saveDynamicReleases(updated);
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
// Apr 29 EP BOMB PIVOT: Full EP drops May 15. Upload May 7. Post-EP vault waterfall starts May 30.
export const EP_RELEASE_DATE = "2026-05-15";
export const EP_UPLOAD_DATE = "2026-05-07";
export const ESL_SINGLE_RELEASE_DATE = "2026-05-08";
export const ALBUM_RELEASE_DATE = EP_RELEASE_DATE;

// How many days after EP drop we display "Honeymoon Phase" on the homepage instead of a countdown
export const EP_HONEYMOON_DAYS = 30;
