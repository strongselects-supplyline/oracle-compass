// lib/visualQueue.ts
// Visual Bible content sprint — shot queue for the ALL LOVE marketing window.
// Derived from past-el-visual-bible.html (Apr 20, 2026).
// One seeded queue of hero shots tied to the 4 Worlds + 6 shot types.

import { getStoreValue, setStoreValue } from "@/lib/db";

export type VisualWorld = "cosmic" | "ghibli" | "retro" | "threshold";
export type ShotType =
  | "silhouette"
  | "scale-micro"
  | "window-warm"
  | "streetlamp"
  | "painted-motion"
  | "threshold";

export type VisualShot = {
  id: string;
  track: string;            // e.g. "SEE ME", "East Side Love"
  world: VisualWorld;
  shotType: ShotType;
  urgency: "RED" | "AMBER" | "GREEN";
  description: string;
  howTo: string[];           // Pipeline steps 1-7 plain-english
  jutsu: string;             // --jutsu flag for content-factory-v4
  done: boolean;
};

const STORE_KEY = "visual_queue_v1";

// ── Seed data — 8 hero shots for the ALL LOVE sprint window ──────────
// Prioritized by track live date + sync-lane fit.
const SEED: VisualShot[] = [
  {
    id: "vs-seeme-silhouette",
    track: "SEE ME",
    world: "cosmic",
    shotType: "silhouette",
    urgency: "RED",
    description: "Streetlamp halo · figure silhouette forward of navy depth · literal cover-art thesis in motion",
    howTo: [
      "Capture: stand in the marked spot on floor tape, Godox keyed 45° left, navy backdrop behind.",
      "Plate: Higgsfield prompt — 'urban night street, single warm streetlamp overhead, navy sky, film grain, Kodak 2383 emulation, 24fps, locked wide'.",
      "Mask in DaVinci Magic Mask, ProRes 4444 alpha.",
      "Composite onto the generated plate — match perspective + ground plane.",
      "Relight in SwitchLight Pro: add warm halo backlight over figure, halation on edges.",
      "Grade in Dehancer: Kodak 2383, navy-shifted midtones, gold-shifted highlights, grain pass.",
      "Export with `--jutsu cosmic` → 9 aspect variants (9:16, 1:1, 16:9, GIF loop, thumbnail).",
      "Tap ✓ when the hero cut is posted on IG Reels.",
    ],
    jutsu: "cosmic",
    done: false,
  },
  {
    id: "vs-eastside-streetlamp",
    track: "East Side Love",
    world: "cosmic",
    shotType: "streetlamp",
    urgency: "RED",
    description: "Night Milwaukee east side · figure under sodium streetlamp · walking-shot motion",
    howTo: [
      "Capture: walk-cycle on floor-taped path, Godox warmed to 3200K for mixed temp feel.",
      "Plate: Higgsfield — 'Milwaukee east side sidewalk, single sodium streetlamp, autumn pavement, cinematic'.",
      "Mask → Composite → add streetlamp backlight halo in Fusion.",
      "Grade with Dehancer, Kodak 2383 stock, heavy halation.",
      "Export with `--jutsu cosmic`.",
      "Tap ✓ when posted (captioning: '414 Day footage · East Side Love').",
    ],
    jutsu: "cosmic",
    done: false,
  },
  {
    id: "vs-sweetfrust-window",
    track: "Sweet Frustration",
    world: "ghibli",
    shotType: "window-warm",
    urgency: "AMBER",
    description: "Interior at golden hour · 2700K window key from frame-right · Ghibli quiet intimacy",
    howTo: [
      "Capture: natural window light hour (~6pm), no artificial fill, medium shot.",
      "Plate: Higgsfield — 'Miyazaki-style painterly interior, dust motes in warm window beam, low contrast'.",
      "Mask + composite — keep it soft, no hard edges.",
      "Relight: subtle bloom pass, keep skin warm.",
      "Grade with Dehancer: Fuji 8553 stock, held shadows, soft highlights.",
      "Export with `--jutsu ghibli`.",
      "Tap ✓ when posted.",
    ],
    jutsu: "ghibli",
    done: false,
  },
  {
    id: "vs-likeidid-window",
    track: "Like I Did",
    world: "ghibli",
    shotType: "window-warm",
    urgency: "AMBER",
    description: "Close-up skin · warm window wash · held emotion, static frame",
    howTo: [
      "Capture: close 35mm equivalent, skin holds warm, eyes closed or looking off-camera.",
      "Plate: Higgsfield — 'soft interior wall, painterly bokeh, warm amber wash'.",
      "Minimal composite — this shot is 80% capture, 20% enhancement.",
      "Grade with Dehancer Fuji, slight grain.",
      "Export with `--jutsu ghibli`.",
      "Tap ✓ when posted.",
    ],
    jutsu: "ghibli",
    done: false,
  },
  {
    id: "vs-seeme-threshold",
    track: "SEE ME",
    world: "threshold",
    shotType: "threshold",
    urgency: "AMBER",
    description: "Figure crossing painted horizon line · Truman stairway energy · cream halo at threshold",
    howTo: [
      "Capture: full-body wide, figure small in frame, walking toward camera slowly.",
      "Plate: Higgsfield — 'Truman Show final stairway, painted horizon, soft cream halo at crossing point'.",
      "Mask + composite — figure stays small, <15% of frame.",
      "Relight: cream halo at the threshold line.",
      "Grade: cream-shifted highlights, navy ground, heavy grain.",
      "Export with `--jutsu threshold`.",
      "Tap ✓ when posted (album anchor visual).",
    ],
    jutsu: "threshold",
    done: false,
  },
  {
    id: "vs-ilikegirls-retro",
    track: "I Like Girls",
    world: "retro",
    shotType: "painted-motion",
    urgency: "GREEN",
    description: "Retro anime cel · motion lines · rust+gold on navy · velocity shot",
    howTo: [
      "Capture: quick pan or match-cut setup, figure mid-movement.",
      "Plate: Higgsfield — 'Cowboy Bebop retro anime cel, VHS grain, painted rim light, rust and gold accents'.",
      "Composite with hard edges — no feathered mask, keep it graphic.",
      "Grade: saturation up, contrast up, heavy grain.",
      "Export with `--jutsu retro`.",
      "Tap ✓ when posted (album promo teaser).",
    ],
    jutsu: "retro",
    done: false,
  },
  {
    id: "vs-luxury-cosmic",
    track: "Luxury",
    world: "cosmic",
    shotType: "streetlamp",
    urgency: "GREEN",
    description: "Single gold source on navy ground · minimal figure · highest sync-lane fit (A24/HBO)",
    howTo: [
      "Capture: static medium, figure mostly still, warm key only.",
      "Plate: Higgsfield — 'cinematic night, single gold sodium light, shallow depth, A24 aesthetic'.",
      "Composite for sync pitch — clean, no heavy effects.",
      "Grade: deep navy blacks, gold highlights, subtle grain.",
      "Export with `--jutsu cosmic`, also 16:9 master for sync agency pitches.",
      "Tap ✓ when posted + uploaded to sync deck.",
    ],
    jutsu: "cosmic",
    done: false,
  },
  {
    id: "vs-reconnect-threshold",
    track: "Reconnect",
    world: "threshold",
    shotType: "scale-micro",
    urgency: "GREEN",
    description: "Figure tiny against vast sky · album outro visual · decision-moment framing",
    howTo: [
      "Capture: full body, framed for composite against massive sky plate.",
      "Plate: Higgsfield — 'vast sky at twilight, painted horizon, Gregory Crewdson vibe, empty vastness'.",
      "Composite figure at <10% of frame, bottom-center third.",
      "Relight: subtle cream halo, backlit.",
      "Grade: navy-dominant, cream-highlighted.",
      "Export with `--jutsu threshold`.",
      "Tap ✓ when posted.",
    ],
    jutsu: "threshold",
    done: false,
  },
];

// ── Store access ─────────────────────────────────────────────────────

export async function getVisualQueue(): Promise<VisualShot[]> {
  const stored = await getStoreValue<VisualShot[]>(STORE_KEY);
  if (!stored) {
    await setStoreValue(STORE_KEY, SEED);
    return SEED;
  }
  const storedIds = new Set(stored.map(s => s.id));
  const merged = [...stored, ...SEED.filter(s => !storedIds.has(s.id))];
  if (merged.length !== stored.length) {
    await setStoreValue(STORE_KEY, merged);
  }
  return merged;
}

export async function markVisualShotDone(id: string): Promise<void> {
  const shots = await getVisualQueue();
  const updated = shots.map(s => s.id === id ? { ...s, done: true } : s);
  await setStoreValue(STORE_KEY, updated);
}

export async function getVisualQueueSummary(): Promise<{ open: number; done: number; redOpen: number }> {
  const shots = await getVisualQueue();
  return {
    open: shots.filter(s => !s.done).length,
    done: shots.filter(s => s.done).length,
    redOpen: shots.filter(s => !s.done && s.urgency === "RED").length,
  };
}
