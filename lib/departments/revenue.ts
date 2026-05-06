// lib/departments/revenue.ts
// Source: REVENUE_BUSINESS_ROADMAP.md (May 6, 2026)

export type RevenueMilestone = {
  id: string;
  title: string;
  targetDate: string;
  prerequisite: string;
  actions: string[];
  monthlyValue: string;
};

export const SYNC_PIPELINE = {
  status: "NOT STARTED",
  setupDeadline: "2026-06-30",
  checklist: [
    { id: "sync-instrumentals", task: "Render instrumentals for all EP tracks", done: false },
    { id: "sync-masters", task: "Create -14 LUFS sync masters (streaming = -6 LUFS, sync = -14 LUFS)", done: false },
    { id: "sync-stems", task: "Export stems (vocals, drums, bass, melody, fx) per track", done: false },
    { id: "sync-onesheet", task: "Create one-sheet (artist bio, genre, mood tags, notable placements)", done: false },
    { id: "sync-songtradr", task: "Register on Songtradr (free tier)", done: false },
    { id: "sync-musicbed", task: "Register on Musicbed (application required)", done: false },
    { id: "sync-artlist", task: "Apply to Artlist", done: false },
  ],
  placementTargets: [
    { track: "SEE ME", mood: "Introspective, late-night, urban", scenes: "Drama montage, character reflection, indie film" },
    { track: "East Side Love", mood: "Sexy, confident, smooth", scenes: "Romance scene, date montage, fashion/lifestyle" },
    { track: "Sweet Frustration", mood: "Energetic, dance, KAYTRANADA-adjacent", scenes: "Party scene, workout montage, brand commercial" },
    { track: "Green Light", mood: "Permission, freedom, new beginning", scenes: "Coming-of-age, road trip, breakthrough moment" },
  ],
};

export const REVENUE_LADDER: RevenueMilestone[] = [
  {
    id: "rev-email-list",
    title: "Email list: ConvertKit embed on ethanpayton.com",
    targetDate: "2026-06-15",
    prerequisite: "Wix access + 15 min setup",
    actions: [
      "Create free ConvertKit account.",
      "Create landing page or embed form.",
      "Add to Wix site (embed code block).",
      "Link in bio → email signup.",
      "Target: 50 subscribers by Jul 1.",
    ],
    monthlyValue: "$0 (asset building)",
  },
  {
    id: "rev-sync-setup",
    title: "Sync licensing: platform registration + masters",
    targetDate: "2026-06-30",
    prerequisite: "EP released + instrumentals rendered",
    actions: SYNC_PIPELINE.checklist.map(c => c.task),
    monthlyValue: "$0-$5,000 per placement",
  },
  {
    id: "rev-discovery-mode",
    title: "Discovery Mode: activate on proven tracks",
    targetDate: "2026-05-22",
    prerequisite: "7-day save rate > 3% on at least 1 track",
    actions: [
      "Check Spotify for Artists → track analytics → save rate.",
      "If any track > 3% for 7 days: activate Discovery Mode.",
      "Monitor: if save rate drops below 2% for 14 days, deactivate.",
    ],
    monthlyValue: "+50% saves, +44% playlist adds (royalty trade)",
  },
];

// DoorDash exit criteria
export const DOORDASH_EXIT = {
  targetMonth: "2027-03",
  exitCondition: "Non-DD income consistently > $2,000/month for 3 months",
  currentNonDD: 0,
};
