// lib/departments/content.ts
// Source: CONTENT_VISUAL_PLAYBOOK.md (May 6, 2026, post-recalibration)
// 2026 algorithm reality: sends > watch-through > saves > likes

export type ContentPillar = {
  id: string;
  name: string;
  priority: number; // 1 = highest
  shareability: "high" | "medium" | "low";
  format: string[];
  frequency: string;
  platformPrimary: "ig" | "tiktok" | "shorts" | "youtube";
  description: string;
};

export type PlatformSpec = {
  id: string;
  name: string;
  creationOrder: number; // 1 = create here first
  postFormat: string;
  optimalLength: string;
  hashtagStrategy: string;
  signalPriority: string[];
};

// 2026 signal hierarchy (verified May 6, 2026)
export const SIGNAL_HIERARCHY = {
  instagram: ["DM shares (sends-per-reach)", "Watch-through rate", "Saves", "Comments", "Likes (near-zero weight)"],
  tiktok: ["Completion rate", "Shares", "Comments", "Sound usage by others", "Likes"],
  youtubeShorts: ["Watch-through → long-tail", "Shares", "Subscribe clicks", "Comments"],
};

export const CONTENT_PILLARS: ContentPillar[] = [
  {
    id: "talk-to-em",
    name: "Talk to 'Em",
    priority: 1,
    shareability: "high",
    format: ["talking-head reel", "hot take clip", "opinion/reaction", "vlog-style moment"],
    frequency: "3-4×/week",
    platformPrimary: "ig",
    description: "Direct-to-camera personality content. Highest send rate. Topics: music opinions, studio confessions, Milwaukee stories, late-night thoughts. Hook in first 1.5 sec.",
  },
  {
    id: "studio-sauce",
    name: "Studio Sauce",
    priority: 2,
    shareability: "medium",
    format: ["process clip", "before/after", "breakdown", "screen recording"],
    frequency: "2-3×/week",
    platformPrimary: "ig",
    description: "Behind-the-scenes production content. Shows craft without explaining it. Vocal stacking, mixing decisions, beat reactions, 'first time hearing the final mix' moments.",
  },
  {
    id: "release",
    name: "Release",
    priority: 3,
    shareability: "medium",
    format: ["snippet", "lyric visual", "pre-save push", "drop announcement"],
    frequency: "8-day sprint per release",
    platformPrimary: "ig",
    description: "Release-specific content. Only fires during 8-day sprint window. Teaser → announce → drop day → compound. Every post has Follow CTA.",
  },
  {
    id: "world-building",
    name: "World Building",
    priority: 4,
    shareability: "low",
    format: ["aesthetic photo", "moodboard clip", "city content", "lifestyle"],
    frequency: "1-2×/week",
    platformPrimary: "ig",
    description: "Visual identity reinforcement. 2 AM drive aesthetic, Milwaukee, fashion, dark R&B world. Low immediate sends but builds brand gravity over time.",
  },
];

export const PLATFORMS: PlatformSpec[] = [
  {
    id: "instagram",
    name: "Instagram",
    creationOrder: 1, // CREATE NATIVE HERE FIRST
    postFormat: "Reels 90% / Carousels 10% / Static <5%",
    optimalLength: "7-15 sec (Reels), 30-60 sec max",
    hashtagStrategy: "3-5 niche tags IN CAPTION for search only. Dead for distribution.",
    signalPriority: ["Sends (DM shares) — 1 share ≈ 15 likes", "Watch-through rate", "Saves", "Comments > Likes"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    creationOrder: 2, // Cross-post from IG (remove watermark)
    postFormat: "Native vertical video",
    optimalLength: "15-60 sec, hook in 0.5 sec",
    hashtagStrategy: "2-3 relevant tags. Sound selection matters more.",
    signalPriority: ["Completion rate", "Sound re-use", "Shares", "Stitches/Duets"],
  },
  {
    id: "youtube-shorts",
    name: "YouTube Shorts",
    creationOrder: 3, // Cross-post last (long-tail discovery)
    postFormat: "Vertical ≤60 sec",
    optimalLength: "30-60 sec (longer performs better on Shorts than IG)",
    hashtagStrategy: "Title + description for search. Tags barely matter.",
    signalPriority: ["Watch-through", "Subscribe clicks", "Long-tail views (months, not hours)"],
  },
];

// 8-day content sprint template (fires around each release)
export type SprintDay = {
  dayOffset: number; // -7 = T-7, 0 = release day, +1 = T+1
  label: string;
  tasks: string[];
  pillar: string;
};

export const SPRINT_TEMPLATE: SprintDay[] = [
  { dayOffset: -7, label: "T-7: BATCH PREP", tasks: ["Film 30 min B-roll", "Extract color palette from cover art", "Write all captions for sprint", "Lock hero photo"], pillar: "release" },
  { dayOffset: -5, label: "T-5: TEASER", tasks: ["Post 15-sec snippet Reel (hook section)", "Cross-post to TikTok", "Story: 'something coming...' with audio"], pillar: "release" },
  { dayOffset: -3, label: "T-3: WORLD BUILD", tasks: ["Post aesthetic/world-building content", "No direct song push — just vibe alignment", "DM 10 engaged followers with personal message"], pillar: "world-building" },
  { dayOffset: -1, label: "T-1: ANNOUNCE", tasks: ["Feed post: official announcement with date", "Story with countdown sticker", "DM blitz: 25 targeted messages with pre-save link"], pillar: "release" },
  { dayOffset: 0, label: "DROP DAY", tasks: ["9 AM: Release post (link in bio)", "10 AM: DM blitz wave 1 (top 50 engagers)", "2 PM: DM blitz wave 2 (broader list)", "Story: listening reaction", "Every post ends: 'Follow on Spotify'"], pillar: "release" },
  { dayOffset: 1, label: "T+1: MOMENTUM", tasks: ["Post Talk to 'Em: 'How I made this' or reaction", "Respond to every DM reply", "Cross-post everything to TikTok + Shorts"], pillar: "talk-to-em" },
  { dayOffset: 3, label: "T+3: COMPOUND", tasks: ["Post Studio Sauce: breakdown clip", "Check 72-hr data (save rate target: 3%+)", "If save rate > 3%: activate Discovery Mode"], pillar: "studio-sauce" },
  { dayOffset: 7, label: "T+7: DATA + NEXT", tasks: ["Pull 7-day save rate", "If > 3% AND sends/reach > 3%: trigger paid ($50 Meta test)", "Begin next single pre-save prep"], pillar: "release" },
];

// Follow blitz configuration (reactivate for future campaigns)
export const FOLLOW_BLITZ = {
  start: "2026-05-01",
  end: "2026-05-15",
  message: "Follow me on Spotify — link in bio.",
};

// Content Factory V4 integration
export const CF4_CONFIG = {
  modes: ["supercut", "single", "evolution", "longform", "multi", "zoom", "batch"],
  jutsus: {
    "warm-punch": "Talk to 'Em (warm energy, direct address)",
    "gritty": "Studio Sauce (raw, unpolished, authentic)",
    "film-grain": "World Building (cinematic, moody)",
    "neon-dream": "Release day (high energy, color pop)",
    "clean-bright": "Performance / live footage",
  },
  allLoveTemplate: {
    palette: "Deep Emerald / Gold / Navy",
    grain: true,
    font: "Georgia",
  },
};
