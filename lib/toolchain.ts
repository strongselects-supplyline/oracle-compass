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
  amusePartner?: boolean;
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
  // ── Distribution & Rights (Amuse) ─────────────────────────────────
  amuse: {
    name: "Amuse",
    category: "distribution",
    platform: "mobile",
    openVerb: "Open",
    amusePartner: true,
  },
  musixmatch: {
    name: "Musixmatch Pro",
    category: "distribution",
    platform: "web",
    openVerb: "Go to",
    url: "https://pro.musixmatch.com",
    amusePartner: true,
    cost: "Free verification via Amuse. Code AMUSEPRO30 for additional features.",
  },
  // ── Mastering ─────────────────────────────────────────────────────
  masterchannel: {
    name: "Masterchannel",
    category: "mastering",
    platform: "web",
    openVerb: "Go to",
    url: "https://masterchannel.ai",
    amusePartner: true,
    cost: "$5.99/track via Amuse",
  },
  // ── Promotion & Discovery ─────────────────────────────────────────
  songtools: {
    name: "SongTools",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    amusePartner: true,
    cost: "50% off first playlisting campaign via Amuse",
  },
  groover: {
    name: "Groover",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    url: "https://groover.co",
    amusePartner: true,
    cost: "Pay-per-pitch. Guaranteed feedback or credits back.",
  },
  unhurd: {
    name: "un:hurd",
    category: "promotion",
    platform: "web",
    openVerb: "Go to",
    amusePartner: true,
    promoCode: "AMUSEPASS",
    cost: "10% off first month/year with code AMUSEPASS",
  },
  // ── Sync & Collaboration ──────────────────────────────────────────
  disco: {
    name: "DISCO",
    category: "collaboration",
    platform: "web",
    openVerb: "Go to",
    url: "https://disco.ac",
    amusePartner: true,
    cost: "Free via Amuse activation",
  },
  elasticStage: {
    name: "elasticStage",
    category: "distribution",
    platform: "web",
    openVerb: "Go to",
    amusePartner: true,
    promoCode: "AMUSE15",
    cost: "15% off first order. No minimums on vinyl/CD.",
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

export function amusePartnerNote(toolKey: keyof typeof TOOLS): string {
  const t = TOOLS[toolKey];
  if (!t?.amusePartner) return "";
  return `Available through your Amuse Pro account → Member Offers → ${t.name}.`;
}
