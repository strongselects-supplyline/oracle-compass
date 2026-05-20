// lib/releases.ts
// Release data — seeded to IndexedDB on first load so Oracle can shift dates dynamically.
// Never read SINGLES directly in UI components; use getDynamicReleases() instead.
//
// ⚠️ MAY 20 UPDATE (Antigravity): Recording sprint May 15-18 DID NOT HAPPEN.
// GL/SF/WU2 are NOT recorded. Sobriety reset Day 0 (May 20). Financial emergency: $25.
// Single-first pivot: GL as standalone single (~May 29), EP postponed to next cycle.
// ICEMAN dropped May 15 — piggyback strategy dead. Post-ICEMAN R&B lane differentiation is the play.
// ESL LIVE May 8 — 10.2% save rate, Release Radar activated, pop 24 (1pt from Discover Weekly).

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
  status: "live" | "upload_pending" | "unreleased" | "not_recorded" | "postponed";
  type: ReleaseType;    // determines Oracle handling + campaign lifecycle
  projectTarget?: string | null; // if loosie, which project it MIGHT roll into ("EP2", "deluxe", etc.)
  pitchDeadline?: string | null;
  contentDeliverables: ContentDeliverables;
  pipelineState: Record<string, boolean>; // step ID → done (per lib/pipeline.ts)
};

// Canonical defaults — source of truth for first seed only
// MAY 20 STATE: GL single-first. EP postponed. ESL LIVE. Recording sprint failed.
// Post-EP vault waterfall starts after EP drops (~Jun 12+).
const RELEASE_DEFAULTS: Release[] = [
  {
    title: "SEE ME", uploadDate: "2026-03-09", releaseDate: "2026-03-13", status: "live", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, ascap: "pending", mlc: "pending", soundExchange: "complete", songtrust: "pending", notes: "Live Mar 13. EP track 3. ISRC carries from Mar 13 upload. Core Drive: 2,713 tracks / 38 playlists. Cyanite: Sexy 0.89, Chill 0.57, R&B 0.60, 120 BPM, B minor." },
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
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "LIVE May 8. 206 streams / 123 listeners / 21 saves as of May 20 (12 days). Save rate: 10.2% (3.4x above 3% target). Release Radar: 108 streams (52% of total). Top city: Chicago (22). Pop 24 (Musicstax May 20). Cyanite: Sexy 0.87, Chill 0.63, Romantic 0.62, R&B 0.82, 105 BPM, C# minor. TrapSoul/PND-Bryson lane. 100% self-credit SongDNA." },
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
    // MAY 20 PIVOT: GL is now a STANDALONE SINGLE (not ep_track). NOT RECORDED.
    // Beat exists. Cyanite done: Sexy 0.70, Romantic 0.63, Chill 0.59, R&B 0.82, 104 BPM, D minor.
    // Alt-R&B / Trap / Melodic Rap lane. Target upload: May 22 (Thu). Target release: May 29.
    title: "Green Light", uploadDate: "2026-05-22", releaseDate: "2026-05-29", status: "not_recorded", type: "waterfall_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "SINGLE-FIRST PIVOT (May 20). NOT RECORDED. Beat exists. Cyanite done: Sexy 0.70, Romantic 0.63, Chill 0.59, R&B 0.82, 104 BPM, D minor. Alt-R&B/Trap/Melodic Rap lane. Record May 21. Mix/master/upload May 22. Target release May 29. Will later become EP track 1 when EP uploads." },
    pipelineState: {},
  },
  {
    // EP POSTPONED. SF not recorded. Beat exists. Cyanite done (Sexy 0.85, KAYTRANADA lane).
    // Different curator set from ESL/SEE ME — do NOT pitch to same playlists.
    title: "Sweet Frustration", uploadDate: "2026-06-05", releaseDate: "2026-06-12", status: "not_recorded", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, coreDriveComplete: true, campaignKitGenerated: true, soundExchange: "complete", notes: "EP POSTPONED (May 20). NOT RECORDED. Beat exists. Cyanite: Sexy 0.85, Happy 0.69, Uplifting 0.58, Energetic 0.48, R&B 0.25. KAYTRANADA/House-R&B lane — GENRE OUTLIER. Record after GL. Different editorial curator set from ESL/SEE ME. French electronic market strong." },
    pipelineState: {},
  },
  {
    title: "WANT U 2", uploadDate: "2026-06-05", releaseDate: "2026-06-12", status: "not_recorded", type: "ep_track",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "EP POSTPONED (May 20). NOT RECORDED. Beat exists. No Cyanite yet (needs recording first). EP-exclusive — never released as single. Record after SF." },
    pipelineState: {},
  },
  {
    // EP is POSTPONED. Cover art DONE. 3/5 tracks unrecorded (GL/SF/WU2).
    // SEE ME + ESL are live and carry ISRCs. EP will upload when GL+SF+WU2 are recorded.
    // Revised target: ~Jun 12 release (uploads ~Jun 5 after recording sprint week of Jun 1).
    title: "ALL LOVE (EP)", uploadDate: "2026-06-05", releaseDate: "2026-06-12", status: "postponed", type: "ep",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "POSTPONED (May 20 pivot). 3/5 tracks unrecorded (GL/SF/WU2). Cover art DONE. SEE ME + ESL ISRCs ready. EP uploads when all 3 remaining tracks are mastered (~Jun 5). Tracklist: GL → SF → SEE ME → ESL → WU2. Release Radar #2 trigger on GL/SF/WU2 upload. Editorial pitch: SF (KAYTRANADA lane). UPC assigned by Amuse at EP upload." },
    pipelineState: {},
  },
  {
    // Vault waterfall delayed to accommodate EP. ILG leads (strongest Cluster A opener).
    title: "I Like Girls", uploadDate: "2026-06-19", releaseDate: "2026-06-26", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #1. 107 BPM, F# minor, R&B 0.74. High R&B confidence. Leads post-EP waterfall — strongest Cluster A opener. Dates shifted from Jun 12 to Jun 26 to accommodate EP delay." },
    pipelineState: {},
  },
  {
    title: "Like I Did", uploadDate: "2026-07-03", releaseDate: "2026-07-10", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #2. 110 BPM, D major. Warmth after ILG lead. Dates shifted from Jun 26 to Jul 10." },
    pipelineState: {},
  },
  {
    title: "Worth It", uploadDate: "2026-07-17", releaseDate: "2026-07-24", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #3. 97 BPM, F minor, R&B 0.57. Slower tempo = mood shift. Rap/Hip-Hop 0.60 primary — tests hip-hop lane." },
    pipelineState: {},
  },
  {
    title: "Just Say So", uploadDate: "2026-07-31", releaseDate: "2026-08-07", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #4. 122 BPM, Bb minor, R&B 0.60. Uptempo. Meme-friendly. CREAM tracklist lock happens around this release window." },
    pipelineState: {},
  },
  {
    title: "Reconnect", uploadDate: "2026-08-14", releaseDate: "2026-08-21", status: "unreleased", type: "vault_single",
    contentDeliverables: { ...DEFAULT_DELIVERABLES, notes: "Vault single #5. 82 BPM, D major, R&B 0.56. Warm/intimate. Palette cleanser. APG activation threshold hits around this time (100-day mark from May 20)." },
    pipelineState: {},
  },
  // Loosies are added dynamically by the user — no defaults seeded here.
  // Use addLoosie() to register a new loosie at any time.
];

const RELEASES_KEY = "dynamic_releases";
const RELEASES_VERSION_KEY = "releases_data_version";
const RELEASE_DATA_VERSION = 41; // v41: May 20 — single-first pivot. GL standalone single. EP postponed.
// GL status: not_recorded. SF/WU2: not_recorded. EP: postponed.
// ESL live data: 206 streams, 10.2% save rate, Release Radar active, pop 24.
// ICEMAN piggyback strategy dead. Post-ICEMAN R&B lane differentiation.
// Sobriety reset Day 0 (May 20). Recording sprint May 15-18 DID NOT HAPPEN.
// Vault waterfall dates shifted to accommodate EP delay.

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

// Static GL single date — single-first pivot (May 20). GL is the next release.
// EP POSTPONED — drops after GL single + SF + WU2 are recorded (~Jun 12).
// Post-EP vault waterfall: ILG Jun 26 → LID Jul 10 → WI Jul 24 → JSS Aug 7 → RCN Aug 21.
export const GL_SINGLE_RELEASE_DATE = "2026-05-29";
export const GL_SINGLE_UPLOAD_DATE = "2026-05-22";
export const EP_RELEASE_DATE = "2026-06-12"; // REVISED from May 29 — EP postponed
export const EP_UPLOAD_DATE = "2026-06-05";  // REVISED from May 19
export const ESL_SINGLE_RELEASE_DATE = "2026-05-08"; // CONFIRMED LIVE
export const ALBUM_RELEASE_DATE = EP_RELEASE_DATE;

// How many days after EP drop we display "Honeymoon Phase" on the homepage instead of a countdown
export const EP_HONEYMOON_DAYS = 30;
