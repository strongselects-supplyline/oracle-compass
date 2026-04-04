// lib/toolchain.ts
// Artist Toolchain Registry — canonical source for tool references across the app.
// Kill List howTos, Creative Dept, and agent prompts all reference these.
// Update here if tools change — one place, propagates everywhere.

export type ToolRef = {
  name: string;
  category: "creative" | "distribution" | "promotion" | "mastering" | "collaboration";
  platform: "desktop" | "web" | "mobile" | "any";
  openVerb: string;   // "Open", "Go to", "Upload to"
  url?: string;       // if web-based
  cost?: string;      // pricing note if relevant
  promoCode?: string;
};

export const TOOLS: Record<string, ToolRef> = {
  // ── Adobe Creative Suite ──────────────────────────────────────────
  afterEffects: {
    name: "After Effects",
    category: "creative",
    platform: "desktop",
    openVerb: "Open",
    cost: "Included in Adobe Creative Suite ($34.99/mo)",
  },
  photoshop: {
    name: "Photoshop",
    category: "creative",
    platform: "desktop",
    openVerb: "Open",
    cost: "Included in Adobe Creative Suite",
  },
  premierePro: {
    name: "Premiere Pro",
    category: "creative",
    platform: "desktop",
    openVerb: "Open",
    cost: "Included in Adobe Creative Suite",
  },
  lightroom: {
    name: "Lightroom",
    category: "creative",
    platform: "desktop",
    openVerb: "Open",
    cost: "Included in Adobe Creative Suite",
  },
  // ── Content Tools ─────────────────────────────────────────────────
  godaddy: {
    name: "GoDaddy Studio Pro",
    category: "creative",
    platform: "mobile",
    openVerb: "Open",
    cost: "Pro subscription",
  },
  capcut: {
    name: "CapCut",
    category: "creative",
    platform: "mobile",
    openVerb: "Open",
    cost: "Free",
  },
  opusclip: {
    name: "OpusClip",
    category: "creative",
    platform: "web",
    openVerb: "Upload to",
    url: "https://www.opus.pro",
    cost: "Free tier available",
  },
  // ── Distribution & Rights (Amuse) ────────────────────────────────
  amuse: {
    name: "Amuse",
    category: "distribution",
    platform: "mobile",
    openVerb: "Open",
    cost: "Free tier available. Pro unlocks instant distribution and splits.",
  },
  musixmatch: {
    name: "Musixmatch Pro",
    category: "distribution",
    platform: "web",
    openVerb: "Go to",
    url: "https://pro.musixmatch.com",
    cost: "Free tier available. Pro unlocks analytics.",
  },
  // ── Mastering ─────────────────────────────────────────────────────
  masterchannel: {
    name: "Masterchannel",
    category: "mastering",
    platform: "web",
    openVerb: "Go to",
    url: "https://masterchannel.ai",
    cost: "$5.99/track",
  },
  // ── Promotion & Discovery ─────────────────────────────────────────
  songtools: {
    name: "SongTools",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    cost: "Pay-per-submission. Guaranteed curator feedback.",
  },
  groover: {
    name: "Groover",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    url: "https://groover.co",
    cost: "Pay-per-pitch. Guaranteed feedback or credits back.",
  },
  unhurd: {
    name: "un:hurd",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    cost: "Subscription. Playlist analytics and outreach tools.",
  },
  // ── Sync & Collaboration ──────────────────────────────────────────
  disco: {
    name: "DISCO",
    category: "collaboration",
    platform: "web",
    openVerb: "Go to",
    url: "https://disco.ac",
    cost: "Free tier available. Sync licensing catalog management.",
  },
  elasticStage: {
    name: "elasticStage",
    category: "distribution",
    platform: "web",
    openVerb: "Go to",
    cost: "No minimums on vinyl/CD.",
  },
};

// ── howTo snippet builders ────────────────────────────────────────────
// Used by killList.ts to generate tool-specific instructions.

export function openApp(toolKey: keyof typeof TOOLS): string {
  const t = TOOLS[toolKey];
  if (!t) return `Open ${toolKey}`;
  if (t.platform === "mobile") return `Open the ${t.name} app on your phone`;
  if (t.platform === "web") return `Go to ${t.url ?? t.name}`;
  return `Open ${t.name}`;
}

/** Returns an Amuse partner benefit note for a given tool, if one exists. */
export function amusePartnerNote(toolKey: keyof typeof TOOLS): string {
  const notes: Partial<Record<keyof typeof TOOLS, string>> = {
    groover: "Amuse Pro partners get 10% off Groover credits — check the Amuse app under 'Partner Benefits'",
    songtools: "Check Amuse Partner Benefits section for any active SongTools discount",
  };
  return notes[toolKey] ?? "";
}
