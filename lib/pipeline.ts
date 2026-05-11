// lib/pipeline.ts
// Per-release pipeline definition. Every release goes through these phases.
// State is stored per-release in releases.ts pipelineState field.

import { getDynamicReleases, saveDynamicReleases } from "@/lib/releases";

// ── Pipeline Definition ──────────────────────────────────────────────

export type PipelineStep = {
  id: string;         // "0.1", "1.3", etc.
  label: string;      // Short action label
  doneWhen: string;   // Completion criteria
  tools?: string;     // Tools used (display only)
};

export type PipelinePhase = {
  id: number;
  name: string;
  color: string;       // Phase accent color
  icon: string;        // Emoji
  steps: PipelineStep[];
};

export const PIPELINE_PHASES: PipelinePhase[] = [
  {
    id: 0, name: "CREATION", color: "#C9A84C", icon: "🎹",
    steps: [
      { id: "0.1", label: "Idea capture", doneWhen: "Idea exists in any form", tools: "Voice memo / FL Studio" },
      { id: "0.2", label: "Production topline", doneWhen: "Instrumental plays start to finish", tools: "FL Studio" },
      { id: "0.3", label: "Re-production (refine)", doneWhen: "Beat is release quality", tools: "FL Studio" },
      { id: "0.4", label: "Recording", doneWhen: "All vocal takes captured", tools: "FL Studio" },
      { id: "0.5", label: "Rough vocal mix", doneWhen: "Clean vocal comp baked (de-breath, AT Pro graph, comp)", tools: "FL Studio + Auto-Tune Pro" },
      { id: "0.6", label: "Rough mixing", doneWhen: "Plays well on phone + car", tools: "FL Studio" },
      { id: "0.7", label: "Cyanite analysis", doneWhen: "Genre/mood scores logged", tools: "Cyanite" },
      { id: "0.8", label: "Second draft", doneWhen: "Adjustments applied or rejected", tools: "FL Studio" },
      { id: "0.9", label: "Final mix / polish", doneWhen: "Mix is final", tools: "FL Studio" },
      { id: "0.10", label: "Master", doneWhen: "-9 to -11 LUFS streaming + -14 LUFS sync exported", tools: "FL Studio (Illangelo chain)" },
    ],
  },
  {
    id: 1, name: "PRE-UPLOAD", color: "#22c55e", icon: "📦",
    steps: [
      { id: "1.1", label: "Cover art", doneWhen: "Final PNG exported (3000x3000+)", tools: "Photopea" },
      { id: "1.2", label: "Spotify Canvas", doneWhen: "MP4 under 20MB, loops clean", tools: "Photopea → CapCut" },
      { id: "1.3", label: "Metadata prep", doneWhen: "Title, genre (R&B not Pop), ISRC, date ready", tools: "—" },
      { id: "1.4", label: "Upload to Amuse", doneWhen: "Amuse confirms Processing", tools: "Amuse" },
      { id: "1.5", label: "Pull ISRC", doneWhen: "ISRC saved to releases.ts + catalog matrix", tools: "Amuse → Oracle" },
      { id: "1.6", label: "Update Oracle", doneWhen: "releases.ts status = upload_pending, dates verified", tools: "Oracle Compass" },
    ],
  },
  {
    id: 2, name: "PRE-RELEASE", color: "#8B5CF6", icon: "📡",
    steps: [
      { id: "2.1", label: "Batch content prep", doneWhen: "5-7 content pieces shot/captured", tools: "Phone + CapCut" },
      { id: "2.2", label: "Editorial pitch", doneWhen: "Submitted via Spotify for Artists", tools: "Spotify for Artists" },
      { id: "2.3", label: "Pre-save link", doneWhen: "Link live, in IG bio", tools: "Amuse / linkfire" },
      { id: "2.4", label: "Teaser post (T-5)", doneWhen: "15-sec clip posted IG + TikTok + Shorts", tools: "CapCut → IG" },
      { id: "2.5", label: "World build post (T-3)", doneWhen: "Aesthetic post live", tools: "IG" },
      { id: "2.6", label: "Announce + cover reveal (T-1)", doneWhen: "Cover art + date + pre-save CTA posted", tools: "IG" },
      { id: "2.7", label: "DM blitz prep", doneWhen: "Core 50 / Warm 100 / Cold 50 messages drafted", tools: "Notes" },
    ],
  },
  {
    id: 3, name: "RELEASE DAY", color: "#FF2D2D", icon: "🔥",
    steps: [
      { id: "3.1", label: "Release announcement", doneWhen: "Reel or carousel posted", tools: "IG" },
      { id: "3.2", label: "Upload Canvas", doneWhen: "Canvas live on Spotify", tools: "Spotify for Artists" },
      { id: "3.3", label: "DM blitz", doneWhen: "All 3 tiers sent", tools: "IG DMs" },
      { id: "3.4", label: "Story blitz", doneWhen: "3-5 stories posted throughout day", tools: "IG Stories" },
      { id: "3.5", label: "Update IG bio link", doneWhen: "Bio link points to new release", tools: "IG" },
      { id: "3.6", label: "Oracle status → live", doneWhen: "releases.ts status = live", tools: "Oracle Compass" },
    ],
  },
  {
    id: 4, name: "COMPOUND", color: "#3ECF71", icon: "📈",
    steps: [
      { id: "4.1", label: "T+1 momentum post", doneWhen: "Second content piece posted (different angle)", tools: "IG" },
      { id: "4.2", label: "T+1 community trace", doneWhen: "Replied to comments, DM'd sharers (15 min timer)", tools: "IG" },
      { id: "4.3", label: "T+3 compound post", doneWhen: "Third content piece posted", tools: "IG" },
      { id: "4.4", label: "T+3 data pull", doneWhen: "72-hr streams, saves, save rate, playlists logged", tools: "Spotify for Artists" },
      { id: "4.5", label: "Paid trigger check", doneWhen: "Meta/Marquee/Discovery decision made based on data", tools: "Meta Ads / Spotify" },
      { id: "4.6", label: "Compliance Thursday", doneWhen: "ASCAP + MLC + Songtrust registered", tools: "ASCAP / MLC / Songtrust" },
      { id: "4.7", label: "T+7 data review", doneWhen: "Week 1 full data pull. Save rate assessed.", tools: "Spotify for Artists" },
      { id: "4.8", label: "Catalog refresh", doneWhen: "refresh-catalog.mjs run, matrix updated", tools: "Oracle / brain" },
    ],
  },
  {
    id: 5, name: "SYNC PREP", color: "#60A5FA", icon: "🎬",
    steps: [
      { id: "5.1", label: "Export stems", doneWhen: "Vocals, drums, bass, melodic, FX exported at -14 LUFS", tools: "FL Studio" },
      { id: "5.2", label: "Instrumental render", doneWhen: "Full instrumental mastered", tools: "FL Studio" },
      { id: "5.3", label: "One-sheet", doneWhen: "PDF/PNG with BPM, key, mood, genre, contact, PRO", tools: "Photopea" },
      { id: "5.4", label: "Platform submission", doneWhen: "Uploaded to Songtradr / Musicbed / Artlist", tools: "Sync platforms" },
    ],
  },
];

// ── Total step count (for progress bars) ──
export const TOTAL_PIPELINE_STEPS = PIPELINE_PHASES.reduce((sum, p) => sum + p.steps.length, 0);

// ── State helpers ─────────────────────────────────────────────────────

export type PipelineState = Record<string, boolean>; // step ID → done

export function getCompletedCount(state: PipelineState): number {
  return Object.values(state).filter(Boolean).length;
}

export function getCurrentPhase(state: PipelineState): PipelinePhase {
  for (const phase of PIPELINE_PHASES) {
    const allDone = phase.steps.every(s => state[s.id] === true);
    if (!allDone) return phase;
  }
  return PIPELINE_PHASES[PIPELINE_PHASES.length - 1]; // all complete
}

export function getNextStep(state: PipelineState): PipelineStep | null {
  for (const phase of PIPELINE_PHASES) {
    for (const step of phase.steps) {
      if (!state[step.id]) return step;
    }
  }
  return null; // all done
}

export function isPhaseComplete(state: PipelineState, phaseId: number): boolean {
  const phase = PIPELINE_PHASES.find(p => p.id === phaseId);
  if (!phase) return false;
  return phase.steps.every(s => state[s.id] === true);
}

// ── Persistence (writes through to releases.ts) ──────────────────────

export async function togglePipelineStep(releaseTitle: string, stepId: string): Promise<void> {
  const releases = await getDynamicReleases();
  const idx = releases.findIndex(r => r.title === releaseTitle);
  if (idx === -1) return;

  const release = releases[idx];
  const state = release.pipelineState || {};
  state[stepId] = !state[stepId];
  releases[idx] = { ...release, pipelineState: state };
  await saveDynamicReleases(releases);
}

export async function markPipelineStep(releaseTitle: string, stepId: string, done: boolean): Promise<void> {
  const releases = await getDynamicReleases();
  const idx = releases.findIndex(r => r.title === releaseTitle);
  if (idx === -1) return;

  const release = releases[idx];
  const state = release.pipelineState || {};
  state[stepId] = done;
  releases[idx] = { ...release, pipelineState: state };
  await saveDynamicReleases(releases);
}
