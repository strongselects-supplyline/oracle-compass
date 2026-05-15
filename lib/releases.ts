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
  pipelineState: Record<string, boolean>; // step ID → done (per lib/pipeline.ts)
};

// Canonical defaults — source of truth for first seed only
// EP BOMB: Full 5-track EP drops May 29. GL+SF+WU2 upload May 19.
// ESL advance single May 8 (LIVE). Post-EP vault waterfall starts Jun 12.
const RELEASE_DEFAULTS: Release[] = [
  {
    title: "SEE ME", uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, ascap: "pending", mlc: "pending", soundExchange: "complete", songtrust: "pending", notes: "Live Mar 13. EP track 3. ISRC carries from Mar 13 upload. Core Drive: 2,713 tracks / 38 playlists." },
    // Live since Mar 13 — creation + upload + pre-release + release day all complete
    pipelineState: {
      "0.1": true, "0.2": true, "0.3": true, "0.4": true, "0.5": true,
      "0.6": true, "0.7": true, "0.8": true, "0.9": true, "0.10": true,
      "1.1": true, "1.2": true, "1.3": true, "1.4": true, "1.5": true, "1.6": true,
      "2.1": true, "2.2": true, "2.3": true, "2.4": true, "2.5": true, "2.6": true, "2.7": true,
      "3.1": true, "3.2": true, "3.3": true, "3.4": true, "3.5": true, "3.6": true,
    },
  },
  {
    title: "East Side Love", uploadDate: "2026-04-30", releaseDate: "2026-05-08", status: "live", type: "waterfall_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "ADVANCE SINGLE — uploaded Apr 30, dropped May 8 (LIVE). EP track 4. Release Radar trigger #1 (May 8). EP carries it as track 4 on May 29. Cyanite MSTR 2: 104 BPM, C# minor, R&B 0.82, Sexy 0.82. Core Drive: 1,221 tracks / 20 playlists. ISRC carries from Apr 30 upload." },
    // LIVE May 8 — all 4 phases complete
    pipelineState: {
      "0.1": true, "0.2": true, "0.3": true, "0.4": true, "0.5": true,
      "0.6": true, "0.7": true, "0.8": true, "0.9": true, "0.10": true,
      "1.1": true, "1.2": true, "1.3": true, "1.4": true, "1.5": true, "1.6": true,
      "2.1": true, "2.2": true, "2.3": true, "2.4": true, "2.5": true, "2.6": true, "2.7": true,
      "3.1": true, "3.2": true, "3.3": true, "3.4": true, "3.5": true, "3.6": true,
    },
  },
  {
    title: "Green Light", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP track 1. Opens the EP. NOT a standalone single. Drops as part of EP bomb May 29." },
    pipelineState: {},
  },
  {
    title: "Sweet Frustration", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "EP track 2. KAYTRANADA lane. NOT a standalone single. Drops as part of EP bomb May 29. Editorial pitch target (genre outlier)." },
    pipelineState: {},
  },
  {
    title: "WANT U 2", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP track 5. EP-exclusive — never released as single. Gives listeners incentive to play the full EP." },
    pipelineState: {},
  },
  {
    title: "ALL LOVE (EP)", uploadDate: "2026-05-19", releaseDate: "2026-05-29", status: "unreleased", type: "ep",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "5-track EP: Green Light → Sweet Frustration → SEE ME → East Side Love → WANT U 2. GL/SF open — 2.0 streams/listener means most bail after track 2, new tracks must hit first. ESL advance single May 8 (Release Radar #1). EP May 29 (Release Radar #2 via GL/SF/WU2). Editorial pitch: Sweet Frustration (KAYTRANADA lane, genre outlier). Cover art DONE. Needs: UPC, EP-level Spotify pitch." },
    pipelineState: {},
  },
  {
    title: "I Like Girls", uploadDate: "2026-06-05", releaseDate: "2026-06-12", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #1. 107 BPM, F# minor, R&B 0.74. High R&B confidence. Leads post-EP waterfall — strongest Cluster A opener." },
    pipelineState: {},
  },
  {
    title: "Like I Did", uploadDate: "2026-06-19", releaseDate: "2026-06-26", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #2. 110 BPM, D major. Warmth after the ILG lead." },
    pipelineState: {},
  },
  {
    title: "Worth It", uploadDate: "2026-07-03", releaseDate: "2026-07-10", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #3. 97 BPM, F minor, R&B 0.57. Slower tempo = mood shift." },
    pipelineState: {},
  },
  {
    title: "Just Say So", uploadDate: "2026-07-17", releaseDate: "2026-07-24", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #4. 122 BPM, Bb minor, R&B 0.60. Uptempo. Meme-friendly." },
    pipelineState: {},
  },
  {
    title: "Reconnect", uploadDate: "2026-07-31", releaseDate: "2026-08-07", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #5. 82 BPM, D major, R&B 0.56. Warm/intimate. Palette cleanser before CREAM." },
    pipelineState: {},
  },
  // Loosies are added dynamically by the user — no defaults seeded here.
  // Use addLoosie() to register a new loosie at any time.
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 40; // v40: May 14 — vault reorder: ILG leads (Jun 12), LID mid (Jun 26). May 29 EP dates. ESL phases 0-3. Track numbering fixed.

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
    // Back-fill type + contentDeliverables + pipelineState for any releases that lack them (migration safety)
    const patched = stored.map(r => ({
      ...r,
      type: r.type || 'ep_track' as ReleaseType,
      contentDeliverables: r.contentDeliverables
        ? { ...DEFAULT_DELIVERABLES, ...r.contentDeliverables }
        : { ...DEFAULT_DELIVERABLES },
      pipelineState: r.pipelineState || {},
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
    pipelineState: {},
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
// EP BOMB: Full EP drops May 29. GL+SF+WU2 upload May 19. ESL advance single May 8 (LIVE).
// Post-EP vault waterfall: ILG Jun 12 → LID Jun 26 → WI Jul 10 → JSS Jul 24 → RCN Aug 7.
export const EP_RELEASE_DATE = "2026-05-29";
export const EP_UPLOAD_DATE = "2026-05-19";
export const ESL_SINGLE_RELEASE_DATE = "2026-05-08";
export const ALBUM_RELEASE_DATE = EP_RELEASE_DATE;

// How many days after EP drop we display "Honeymoon Phase" on the homepage instead of a countdown
export const EP_HONEYMOON_DAYS = 30;
