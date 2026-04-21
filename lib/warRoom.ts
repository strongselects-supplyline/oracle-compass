// lib/warRoom.ts
// War Room rebuild — procurement + sequence state for the bedroom command center.
// Derived from past-el-war-room.html deck (Apr 20, 2026).
// Simple KV store: one seeded list of procurement items with done-state per id.

import { getStoreValue, setStoreValue } from "@/lib/db";

export type WarRoomTier = "wk1" | "wk2" | "wk3";
export type WarRoomUrgency = "RED" | "AMBER" | "GREEN";

export type WarRoomItem = {
  id: string;
  name: string;
  purpose: string;
  tier: WarRoomTier;
  urgency: WarRoomUrgency;
  cost: number;
  howTo: string[];
  done: boolean;
};

const STORE_KEY = "war_room_procurement_v1";

// ── Seed data — 11 procurement items from the blueprint ──────────────
const SEED: WarRoomItem[] = [
  {
    id: "wr-rug",
    name: "Large rug (5×8 ft, low pile, muted)",
    purpose: "Ops/Floor zone foundation · earth element · bodywork surface",
    tier: "wk1", urgency: "RED", cost: 110,
    howTo: [
      "Pick a neutral muted color — charcoal, navy, rust, or cream.",
      "Low pile so it stays under the foam roller without snagging.",
      "5×8 minimum — needs to cover the full Ops zone (~40 sqft clear).",
      "Target: Amazon or IKEA, delivered this week.",
      "Tap ✓ once it's laid down in the Ops zone.",
    ],
    done: false,
  },
  {
    id: "wr-curtain",
    name: "Blackout curtain + rod",
    purpose: "Sleep zone · stop window glare contaminating bed",
    tier: "wk1", urgency: "RED", cost: 45,
    howTo: [
      "Measure window width + add 8 inches for coverage.",
      "Target 98%+ blackout — not just 'darkening.'",
      "Rod mounts above the frame, curtain pools slightly at the floor.",
      "Install same day it arrives.",
      "Tap ✓ when the window is fully covered after sundown.",
    ],
    done: false,
  },
  {
    id: "wr-bias",
    name: "Bias light strip (behind dual monitors)",
    purpose: "Produce zone · reduces eye strain · warm fill",
    tier: "wk1", urgency: "RED", cost: 25,
    howTo: [
      "USB-powered LED strip (Govee or MediaLight), 2700K–3200K warm.",
      "Stick to the back of the monitor, diffused side out.",
      "Turn on when the monitors are on. Off with them.",
      "Keeps midtones accurate when grading in DaVinci.",
      "Tap ✓ when it's lighting the wall behind the screens.",
    ],
    done: false,
  },
  {
    id: "wr-amber",
    name: "Warm amber bedside bulb + dimmer",
    purpose: "Sleep zone ambient · replaces red LED ceiling strip",
    tier: "wk1", urgency: "RED", cost: 30,
    howTo: [
      "2200K amber bulb — Philips Hue or equivalent dimmable.",
      "Pair with a physical dimmer at the bedside.",
      "REMOVE the red LED ceiling strip entirely — don't repurpose.",
      "Hard off rule: lights out by 10pm.",
      "Tap ✓ when red LED is gone and amber bulb is installed.",
    ],
    done: false,
  },
  {
    id: "wr-godox",
    name: "Godox SL-60W LED + softbox",
    purpose: "Capture zone key light · 5600K daylight, 95+ CRI",
    tier: "wk2", urgency: "AMBER", cost: 150,
    howTo: [
      "Godox SL-60W Mark II on a C-stand or light stand.",
      "60cm softbox with inner baffle + front diffuser.",
      "5600K fixed daylight — never use tungsten for Capture.",
      "Permanent placement: 45° camera-left, 1.5m high, angled down.",
      "Tap ✓ when it's set and tested with the ZV-E1 or iPhone.",
    ],
    done: false,
  },
  {
    id: "wr-backdrop",
    name: "Navy backdrop cloth (6×9 ft)",
    purpose: "Capture zone backdrop · brand-consistent navy ground",
    tier: "wk2", urgency: "AMBER", cost: 35,
    howTo: [
      "Muslin or wrinkle-resistant polyester, navy (#0d1b2a adjacent).",
      "6×9 ft covers framing for medium + wide.",
      "Hang on collapsible backdrop stand behind the floor-tape spot.",
      "Iron or steam before first shoot.",
      "Tap ✓ when mounted and ready for SEE ME reel shoot.",
    ],
    done: false,
  },
  {
    id: "wr-pegboard",
    name: "Pegboard (24×48) + hooks",
    purpose: "Ops wall mount · bodywork + gear staging",
    tier: "wk2", urgency: "AMBER", cost: 40,
    howTo: [
      "Standard pegboard, stained or painted navy if time allows.",
      "Mount on the Ops/Floor wall at eye height.",
      "Hooks for: yoga mat, foam roller, resistance bands, mic cables.",
      "This replaces the floor-dump for recovery gear.",
      "Tap ✓ when mounted with 3+ items actually hanging on it.",
    ],
    done: false,
  },
  {
    id: "wr-plant",
    name: "Tall floor plant (Ficus or snake)",
    purpose: "Wood element · dead corner between Produce & Capture",
    tier: "wk2", urgency: "AMBER", cost: 45,
    howTo: [
      "Snake plant (low light) or ficus (medium light).",
      "Minimum 3 ft tall — this is visual weight, not a tabletop plant.",
      "Place in the corner closest to the window, out of camera frame.",
      "Water schedule added to weekly routine when you buy it.",
      "Tap ✓ when placed and watered.",
    ],
    done: false,
  },
  {
    id: "wr-whiteboard-cover",
    name: "Rolling whiteboard cover / curtain",
    purpose: "Hide to-do list from bed sight-line · cortisol-on-waking fix",
    tier: "wk3", urgency: "GREEN", cost: 25,
    howTo: [
      "Fabric curtain on a tension rod or a rolling cover.",
      "Covers the whiteboard fully when closed.",
      "Open after 2nd coffee, not before.",
      "Optional: move whiteboard to the Ops wall instead — same outcome.",
      "Tap ✓ when the board is invisible from the pillow.",
    ],
    done: false,
  },
  {
    id: "wr-cable",
    name: "Cable management channel + clips",
    purpose: "One trough down desk leg · kill cable snakes",
    tier: "wk3", urgency: "GREEN", cost: 20,
    howTo: [
      "J-channel raceway along desk leg, down to power strip.",
      "Velcro cable wraps in sets of 3.",
      "One trough serves all cables — no splitters, no chaos.",
      "Label ends with masking tape if you want to be extra.",
      "Tap ✓ when no cable is loose on the floor.",
    ],
    done: false,
  },
  {
    id: "wr-bodywork-kit",
    name: "Foam roller + cork block + strap",
    purpose: "Bodywork kit · Ops zone floor use",
    tier: "wk3", urgency: "GREEN", cost: 35,
    howTo: [
      "Standard 36-inch foam roller (medium density).",
      "Cork yoga block + 8ft cotton strap.",
      "Store on pegboard hooks — not on floor.",
      "Use during morning interoceptive check or post-DoorDash decompression.",
      "Tap ✓ when kit is mounted and used at least once.",
    ],
    done: false,
  },
];

// ── Store access ─────────────────────────────────────────────────────

export async function getWarRoomItems(): Promise<WarRoomItem[]> {
  const stored = await getStoreValue<WarRoomItem[]>(STORE_KEY);
  if (!stored) {
    await setStoreValue(STORE_KEY, SEED);
    return SEED;
  }
  // Merge — if seed has new items not in stored, add them
  const storedIds = new Set(stored.map(i => i.id));
  const merged = [...stored, ...SEED.filter(s => !storedIds.has(s.id))];
  if (merged.length !== stored.length) {
    await setStoreValue(STORE_KEY, merged);
  }
  return merged;
}

export async function markWarRoomItemDone(id: string): Promise<void> {
  const items = await getWarRoomItems();
  const updated = items.map(i => i.id === id ? { ...i, done: true } : i);
  await setStoreValue(STORE_KEY, updated);
}

export async function getWarRoomSummary(): Promise<{ open: number; done: number; totalCost: number; spent: number }> {
  const items = await getWarRoomItems();
  return {
    open: items.filter(i => !i.done).length,
    done: items.filter(i => i.done).length,
    totalCost: items.reduce((a, i) => a + i.cost, 0),
    spent: items.filter(i => i.done).reduce((a, i) => a + i.cost, 0),
  };
}
