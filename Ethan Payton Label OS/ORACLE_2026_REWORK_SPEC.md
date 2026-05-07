# ORACLE COMPASS 2026 REWORK SPEC
## Sonnet Execution Brief — 3-Session Implementation Plan

*Authored by: Claude (Opus, Lead Architect)*
*For: Sonnet execution OR Antigravity filesystem writes*
*Date: May 6, 2026*
*Repo: github.com/strongselects-supplyline/oracle-compass (main branch)*
*Deploy: oracle-compass-ni8g.vercel.app*

---

## EXECUTIVE SUMMARY

**Goal:** Wire the 5 department protocols (Health, Content, Social, Marketing, Revenue) into Oracle Compass so Ethan opens the app and receives today's exact actions — zero reading, zero deciding, pure execution.

**Decision:** REWORK existing app. Do NOT rebuild. The Kill List derivation engine, PhaseMap, morning flow, IndexedDB architecture, and Vercel pipeline are all sound. What's broken is:
1. The **intelligence layer** doesn't know about the 2026 protocols
2. The **morning stack** references a generic "Sovereignty Stack" instead of the Health Protocol's precise daily routine
3. The **content sprint** fires on release dates but doesn't know the 2026 algorithm playbook (sends > saves > likes)
4. The **social/marketing/revenue tasks** don't exist in the Kill List at all
5. Several **dead routes** add cognitive load

**Architecture principle:** Department protocols live as `.ts` config files in `lib/departments/`. The Kill List reads them. The PhaseMap references them. The user never reads a markdown file.

---

## SESSION 1: HEALTH + CONTENT PROTOCOLS → ORACLE

### 1.1 Create `lib/departments/health.ts`

**Purpose:** Encode HEALTH_FOUNDATION_PROTOCOL.md into a structured config that the Kill List and morning flow consume.

```typescript
// lib/departments/health.ts
// Source: HEALTH_FOUNDATION_PROTOCOL.md (May 6, 2026)
// Encodes the Galpin 3-to-5 framework + ADHD-native morning stack

export type TrainingDay = {
  id: string;
  title: string;
  subtitle: string;
  howTo: string[];
  dayOfWeek: number[]; // 0=Sun, 1=Mon...
  duration: string;
};

export type MorningProtocol = {
  id: string;
  title: string;
  subtitle: string;
  howTo: string[];
  triggerHour: number; // fires if not done by this hour
  urgencyEscalation: number; // hour at which it goes RED
};

export const MORNING_STACK: MorningProtocol[] = [
  {
    id: "health-hydration-wake",
    title: "16oz water + electrolytes",
    subtitle: "Rehydrate before anything. Non-negotiable.",
    howTo: [
      "Fill 16oz glass immediately on waking.",
      "Add pinch of salt OR electrolyte packet (LMNT, Liquid IV).",
      "Drink before coffee, before phone, before anything.",
      "This is the single highest-ROI health habit.",
    ],
    triggerHour: 7,
    urgencyEscalation: 9,
  },
  {
    id: "health-sunlight",
    title: "2-10 min morning sunlight",
    subtitle: "Cortisol pulse + circadian anchor. Huberman protocol.",
    howTo: [
      "Step outside within 30 min of waking.",
      "No sunglasses. Face toward sun (don't stare at it).",
      "Overcast = 10 min. Clear sky = 2-5 min.",
      "This sets your circadian clock for the next 16 hours.",
      "Do this BEFORE coffee if possible.",
    ],
    triggerHour: 8,
    urgencyEscalation: 10,
  },
  {
    id: "health-breathwork",
    title: "Breathwork — Nadi Shodhana or Box (5 min)",
    subtitle: "Nervous system regulation. Activates parasympathetic.",
    howTo: [
      "Sit spine tall. Close eyes.",
      "Option A: Nadi Shodhana (alternate nostril) — 5 rounds.",
      "Option B: Box breathing — 4 in, 4 hold, 4 out, 4 hold — 5 rounds.",
      "This replaces the old 'Sovereignty Stack' — same intent, cleaner protocol.",
      "Tap ✓ when done.",
    ],
    triggerHour: 9,
    urgencyEscalation: 11,
  },
  {
    id: "health-pelvic-release",
    title: "Pelvic floor release (3 min)",
    subtitle: "Reverse the sitting clamp. Daily maintenance.",
    howTo: [
      "90/90 hip position OR deep squat hold.",
      "Focus on RELEASING, not squeezing.",
      "Breathe into lower belly — feel pelvic floor drop on inhale.",
      "3 minutes minimum. Can combine with breathwork.",
      "This addresses the documented pelvic floor lock.",
    ],
    triggerHour: 9,
    urgencyEscalation: 12,
  },
];

export const TRAINING_PROGRAM: TrainingDay[] = [
  {
    id: "health-push-core",
    title: "Push/Core Calisthenics (25 min)",
    subtitle: "Upper body + core. 2:1 pull:push ratio respected via weekly balance.",
    dayOfWeek: [1], // Monday
    duration: "25 min",
    howTo: [
      "Warm-up (3 min): arm circles, shoulder dislocates, cat-cow, high knees.",
      "3 rounds, 45 sec rest between exercises:",
      "  Push-ups: 12–15 reps",
      "  Pike push-ups: 8–10 reps (shoulder focus)",
      "  Dips (chair/counter): 8–12 reps",
      "  Hollow body hold: 30 sec",
      "  Plank to push-up: 8 each arm",
      "  Mountain climbers: 20 total",
      "Finisher: max push-ups in 60 sec.",
      "NOTE: Left knee — NO locked-out full extension under load.",
    ],
  },
  {
    id: "health-run",
    title: "Zone 2 Run (30 min)",
    subtitle: "Conversational pace. Build aerobic base. Galpin protocol.",
    dayOfWeek: [2, 4], // Tue, Thu
    duration: "30 min",
    howTo: [
      "Pre-run: banana or toast + PB, 20 min before.",
      "Pace: 11:30–12:30/mi. If you can't talk in full sentences, slow down.",
      "Week 1–2: run 3 / walk 2, ×6 rounds.",
      "Week 3–4: run 5 / walk 1, ×5 rounds.",
      "Week 5+: 30 min continuous.",
      "Post-run: +16 oz water. Don't record vocals for 30+ min.",
      "Zone 2 = nose-breathable. This is NOT intensity training.",
    ],
  },
  {
    id: "health-dance-floor",
    title: "Dance — Floor Work (20 min)",
    subtitle: "Movement vocabulary on your own tracks. Stage development.",
    dayOfWeek: [3], // Wednesday
    duration: "20 min",
    howTo: [
      "Pick one track. Play it 4 times:",
      "  Listen 1: Stand still. Feel where body wants to move.",
      "  Listen 2: Move freely. Eyes closed. Find natural movements.",
      "  Listen 3: Mirror/camera. Repeat what felt good. Add intention.",
      "  Listen 4: Film it. Full run. Reference + content.",
      "Focus: isolations, weight transfer, hand vocabulary.",
      "This is stage rehearsal AND Content Factory material.",
    ],
  },
  {
    id: "health-pull-legs",
    title: "Pull/Legs Calisthenics (25 min)",
    subtitle: "Posterior chain + lower body. Stage movement power.",
    dayOfWeek: [5], // Friday
    duration: "25 min",
    howTo: [
      "Warm-up (3 min): squats, hip circles, lunge with twist, jumping jacks.",
      "3 rounds, 45 sec rest:",
      "  Bodyweight squats: 15–20 reps",
      "  Lunges: 10 each leg (CAUTION: left knee, no lock-out)",
      "  Glute bridges: 15 reps",
      "  Inverted rows (table edge): 8–12 reps",
      "  Pull-ups if bar available: 5–8 (or negatives)",
      "  Calf raises: 20 reps",
      "Core: L-sit 3×15sec, side plank 30 sec each, flutter kicks 30 sec.",
    ],
  },
  {
    id: "health-dance-performance",
    title: "Dance — Performance Run (20–30 min)",
    subtitle: "Full songs with half-voice vocals + movement. Film everything.",
    dayOfWeek: [6], // Saturday
    duration: "20-30 min",
    howTo: [
      "Pick 2–3 songs from setlist.",
      "Full performance: half-voice vocals + movement + transitions.",
      "Film everything — stage rehearsal AND content.",
      "Watch playback. Note: one thing to KEEP, one to CHANGE.",
    ],
  },
  // Sunday (0) = REST. No training task generated.
];

// Nutrition guardrails (fires conditionally)
export const NUTRITION_TRIGGERS = {
  caffeineHour: 13, // No caffeine after 1 PM
  proteinReminder: 12, // Check protein by noon
  vocalDairyWindow: 2, // No dairy within 2 hrs of recording
  hydrationTarget: 4, // Liters per day (minimum 3)
  preMealMinutes: 30, // Eat 30 min before singing
};

// Evening wind-down (fires after 9 PM)
export const EVENING_PROTOCOL = {
  blueBlockHour: 21, // Blue light reduction at 9 PM
  tratakaHour: 21, // Candle gazing available after 9 PM
  sleepTargetHour: 23, // Target asleep by 11 PM
};
```

### 1.2 Create `lib/departments/content.ts`

**Purpose:** Encode CONTENT_VISUAL_PLAYBOOK.md into the 2026 algorithm-aware content engine.

```typescript
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
```

### 1.3 Refactor `lib/killList.ts` — Replace hardcoded workouts with `health.ts` import

**File:** `lib/killList.ts` lines 486–601
**Action:** Delete the entire `workoutByDay` object and replace with:

```typescript
import { TRAINING_PROGRAM, MORNING_STACK, NUTRITION_TRIGGERS } from "@/lib/departments/health";

// ── HEALTH DEPARTMENT: Training ──
if (!dailyLog.movement && hour < 16) {
  const dow = new Date().getDay();
  const todaysWorkout = TRAINING_PROGRAM.find(t => t.dayOfWeek.includes(dow));
  if (todaysWorkout) {
    tasks.push({
      id: todaysWorkout.id,
      title: todaysWorkout.title,
      subtitle: todaysWorkout.subtitle,
      howTo: todaysWorkout.howTo,
      urgency: "GREEN" as const,
      pillar: "body" as const,
      timeBlock: "any" as const,
      action: async () => {
        const log = await getDailyLog(today);
        log.movement = true;
        await saveDailyLog(log);
      },
    });
  }
}

// ── HEALTH DEPARTMENT: Morning Stack ──
for (const step of MORNING_STACK) {
  const stepKey = `health_morning_${step.id}:${today}`;
  const stepDone = await getStoreValue<boolean>(stepKey);
  if (!stepDone && hour < 14) {
    tasks.push({
      id: step.id,
      title: step.title,
      subtitle: step.subtitle,
      howTo: step.howTo,
      urgency: hour >= step.urgencyEscalation ? "RED" : hour >= step.triggerHour ? "AMBER" : "GREEN",
      pillar: "body" as const,
      timeBlock: "any" as const,
      action: async () => { await setStoreValue(stepKey, true); },
      needle: hour >= step.triggerHour,
    });
  }
}
```

### 1.4 Refactor `app/page.tsx` — Morning flow uses Health Protocol

**File:** `app/page.tsx` lines 30–68 (getProtocolSteps function)
**Action:** Replace the hardcoded steps with dynamic generation from `health.ts`:

```typescript
import { MORNING_STACK, TRAINING_PROGRAM } from "@/lib/departments/health";

function getProtocolSteps(dayType: string): { tagline: string; steps: ProtocolStep[] } {
  const dow = new Date().getDay();
  const workout = TRAINING_PROGRAM.find(t => t.dayOfWeek.includes(dow));
  
  const base: ProtocolStep[] = [
    { icon: "🚗", action: "6:30 AM → DD Morning Sprint (90 min target)" },
    { icon: "💧", action: "Wake: 16oz water + electrolytes" },
    { icon: "☀️", action: "2-10 min morning sunlight (no sunglasses)" },
    { icon: "🫁", action: "Breathwork: Nadi Shodhana or Box (5 min)" },
  ];

  if (workout) {
    base.push({ icon: "🏋️", action: `${workout.title} (${workout.duration})` });
  }

  if (isStudioDay(dayType as any)) {
    return {
      tagline: "Hydrate → Sunlight → Breathe → Move → Create.",
      steps: [
        ...base,
        { icon: "🎹", action: "10 AM → Studio Block 1" },
        { icon: "🚗", action: "12 PM → DD Midday Sprint (2hrs)" },
        { icon: "🎤", action: "2 PM → Studio Block 2" },
        { icon: "📱", action: "Post content from STUDIO queue", tab: "studio" },
      ],
    };
  }
  if (isBizDay(dayType as any)) {
    return {
      tagline: "Hydrate → Sunlight → Breathe → Move → Execute.",
      steps: [
        ...base,
        { icon: "⚙️", action: "9 AM → ENGINE: pipeline tasks", tab: "engine" },
        { icon: "📱", action: "9:30 AM → Community Trace (15 min)" },
        { icon: "🚗", action: "12 PM → DD Midday Sprint (2hrs)" },
        { icon: "📤", action: "3 PM → Content push (IG → TikTok → Shorts)" },
        { icon: "🚗", action: "5:30 PM → DD Evening Sprint" },
      ],
    };
  }
  return { tagline: "Rest + recovery.", steps: base };
}
```

### 1.5 Wire Content Sprint into Kill List

**File:** `lib/killList.ts` — ADD new section after the existing content sprint (line ~393)
**Action:** Import `SPRINT_TEMPLATE` from content.ts and generate tasks dynamically:

```typescript
import { SPRINT_TEMPLATE, CONTENT_PILLARS, SIGNAL_HIERARCHY } from "@/lib/departments/content";

// ── CONTENT DEPARTMENT: Daily pillar task (non-sprint days) ──
const isSprintDay = contentSprintDates.some(d => {
  const releaseDate = new Date(d.date);
  const daysDiff = Math.ceil((now.getTime() - releaseDate.getTime()) / 86400000);
  return daysDiff >= -7 && daysDiff <= 7;
});

if (!isSprintDay && isBizDay(dayType)) {
  const contentDailyKey = `content_daily:${today}`;
  const contentDone = await getStoreValue<boolean>(contentDailyKey);
  if (!contentDone) {
    // Rotate through pillars: Talk to 'Em (Mon/Wed/Fri), Studio Sauce (Tue/Thu), World Building (Sat)
    const dow = new Date().getDay();
    const pillarToday = dow % 2 === 0 ? CONTENT_PILLARS[1] : CONTENT_PILLARS[0]; // Studio Sauce on even days, Talk to 'Em on odd
    tasks.push({
      id: `content-daily-${today}`,
      title: `Post: ${pillarToday.name} content`,
      subtitle: `${pillarToday.description.slice(0, 80)}...`,
      howTo: [
        `Format options: ${pillarToday.format.join(", ")}`,
        "Create NATIVE on Instagram first (no watermarks).",
        "Cross-post to TikTok (2 min: re-upload, adjust caption).",
        "Cross-post to YouTube Shorts (2 min: re-upload).",
        "IG caption: 1-2 sentences + 3 niche hashtags for search only.",
        "Hook in first 1.5 seconds. Sends-per-reach is the metric.",
        "End with: 'Follow on Spotify — link in bio.'",
      ],
      urgency: "AMBER" as const,
      pillar: "creative" as const,
      timeBlock: "content" as const,
      action: async () => { await setStoreValue(contentDailyKey, true); },
      needle: true,
    });
  }
}

// ── CONTENT DEPARTMENT: Cross-post reminder (if IG posted but not TikTok/Shorts) ──
const crossPostKey = `cross_post:${today}`;
const crossPostDone = await getStoreValue<boolean>(crossPostKey);
if (!crossPostDone && hour >= 14) {
  tasks.push({
    id: `cross-post-${today}`,
    title: "Cross-post today's content → TikTok + Shorts",
    subtitle: "2 min each. Same video, no watermark. TikTok = discovery. Shorts = long-tail.",
    howTo: [
      "Open today's IG Reel in your camera roll.",
      "TikTok: Upload → adjust caption → add 2-3 tags → post.",
      "YouTube Shorts: Upload → title (searchable) → post.",
      "Total time: 4 minutes. Do not skip — TikTok drives 84% of Billboard virality.",
    ],
    urgency: "AMBER" as const,
    pillar: "creative" as const,
    timeBlock: "content" as const,
    action: async () => { await setStoreValue(crossPostKey, true); },
  });
}
```

---

## SESSION 2: SOCIAL + MARKETING + REVENUE → KILL LIST

### 2.1 Create `lib/departments/social.ts`

```typescript
// lib/departments/social.ts
// Source: SOCIAL_COMMUNITY_PLAN.md (May 6, 2026)

export type CommunityTraceConfig = {
  dailyMinutes: number;
  frequency: string;
  dayTypes: string[]; // which day types trigger this
  actions: string[];
};

export const COMMUNITY_TRACE: CommunityTraceConfig = {
  dailyMinutes: 15,
  frequency: "Daily on BIZ days, optional on STUDIO days",
  dayTypes: ["BIZ DAY", "STUDIO + SAUNA DAY"],
  actions: [
    "Reply to 3-5 comments on your latest post (genuine, not emoji-only).",
    "DM 2-3 people who shared/saved your content (thank + personal note).",
    "Comment on 3-5 peer artist posts (substantive — 8+ words).",
    "Check story viewers → DM 1-2 new faces who watched multiple stories.",
    "15 min MAX. Set timer. Do not spiral into scrolling.",
  ],
};

// Unfollow program (Sunday ritual)
export const UNFOLLOW_PROGRAM = {
  currentRatio: "2200/2001", // as of May 6
  targetRatio: "4000/800",
  weeklyUnfollows: 50, // declining over 24 weeks
  dayOfWeek: 0, // Sunday
  instructions: [
    "Open IG → Following → Sort by 'Least Interacted With'.",
    "Unfollow 50 accounts (brands, dead accounts, non-engagers).",
    "NEVER unfollow: peer artists, superfans, real community members.",
    "Target: ratio flips visible in 4-6 weeks.",
    "Sunday ritual only. Do not do this other days.",
  ],
};

// DM Blitz protocol (release-adjacent)
export const DM_BLITZ = {
  triggerCondition: "Release within 3 days OR release within past 24 hours",
  tiers: [
    { name: "Core 50", description: "Top engagers — people who comment/save/share regularly", count: 50, message: "Personal + direct. 'Hey [name], just dropped [track]. You've been rocking with me — wanted you to hear it first. [link]'" },
    { name: "Warm 100", description: "Story viewers, likers, occasional commenters", count: 100, message: "Slightly less personal. 'New track just dropped — [track]. Think you'll love this one. [link]'" },
    { name: "Cold 50", description: "Mutual followers who haven't engaged yet", count: 50, message: "Introduction framing. 'Hey, been seeing you around. Just put out something new — [track]. Would love your thoughts. [link]'" },
  ],
};

// Superfan identification
export const SUPERFAN_CRITERIA = {
  identifiers: [
    "Saves 3+ posts in 30 days",
    "DM shares your content to others",
    "Comments on 50%+ of posts",
    "Stories mentions/tags you",
    "Attends live (when applicable)",
  ],
  reward: "Close Friends access (exclusive snippets, polls, early listens)",
  trackingMethod: "Manual — note top 50 in Notes app, update monthly",
};
```

### 2.2 Create `lib/departments/marketing.ts`

```typescript
// lib/departments/marketing.ts
// Source: MARKETING_PAID_STRATEGY.md (May 6, 2026)

export type SpendTrigger = {
  id: string;
  channel: "meta" | "spotify_marquee" | "spotify_showcase" | "discovery_mode";
  condition: string;
  metric: string;
  threshold: number;
  budget: number;
  instructions: string[];
};

export const BUDGET_RULES = {
  monthlyCap: 250, // $250 hard ceiling
  incomePercentage: 0.15, // 15% of income MAXIMUM
  testBudget: 50, // $50 per test
  killThreshold: { costPerStream: 0.10 }, // Kill ad if CPS > $0.10
  neverSpendWithout: "Organic signal confirmation (sends/reach ≥ 3% OR velocity 100+/day)",
};

export const SPEND_TRIGGERS: SpendTrigger[] = [
  {
    id: "meta-reel-ad",
    channel: "meta",
    condition: "Reel achieves sends-per-reach ≥ 3% organically",
    metric: "sends_per_reach",
    threshold: 0.03,
    budget: 50,
    instructions: [
      "ONLY boost reels that already have organic proof (3%+ sends/reach).",
      "Meta Ads Manager → Create → Traffic campaign.",
      "Audience: Lookalike 1% (from IG engagers) + Interest-based split.",
      "Budget: $50 test, 3 days, $16.67/day.",
      "Destination: Smart Link (NOT direct Spotify link). Pixel on smart link.",
      "Kill criteria: Cost per stream > $0.10 after 48 hrs → kill immediately.",
      "Scale criteria: CPS < $0.05 → double budget for 3 more days.",
    ],
  },
  {
    id: "spotify-marquee",
    channel: "spotify_marquee",
    condition: "Release week only. Minimum $100 budget.",
    metric: "release_week",
    threshold: 1, // binary: is it release week?
    budget: 100,
    instructions: [
      "Spotify for Artists → Campaign Kit → Marquee.",
      "Audience: 'Previously Engaged' (people who've listened before).",
      "Budget: $100 minimum (Spotify's floor).",
      "Expected: $0.30-$0.70 per click, ~15% stream-through rate.",
      "Only use on EP release (May 15) and first vault single (May 30).",
      "Do NOT use on every single — reserve for highest-conviction drops.",
    ],
  },
  {
    id: "spotify-showcase",
    channel: "spotify_showcase",
    condition: "Track has 7-day save rate > 3% AND is past release week",
    metric: "save_rate_7day",
    threshold: 0.03,
    budget: 50,
    instructions: [
      "Spotify for Artists → Campaign Kit → Showcase.",
      "Use for catalog tracks that prove momentum post-release.",
      "Budget: $50 per burst (3-7 days).",
      "Expected: $0.15-$0.50 per click.",
      "Monitors 'intent rate' (how many click → play → save).",
    ],
  },
  {
    id: "discovery-mode",
    channel: "discovery_mode",
    condition: "Track save rate > 3% for 7+ days",
    metric: "save_rate_sustained",
    threshold: 0.03,
    budget: 0, // $0 upfront — 30% royalty trade
    instructions: [
      "Spotify for Artists → Campaign Kit → Discovery Mode.",
      "Toggle ON for tracks with sustained save rate > 3%.",
      "Cost: 30% royalty reduction on Discovery Mode plays.",
      "Benefit: +50% saves, +44% playlist adds (Spotify's claimed stats).",
      "This is FREE in cash terms. Use aggressively on proven tracks.",
      "Turn OFF if save rate drops below 2% for 14 days.",
    ],
  },
];

// Campaign calendar (hardcoded for current release cycle)
export const CAMPAIGN_CALENDAR = [
  { date: "2026-05-15", track: "ALL LOVE EP", actions: ["Marquee ($100)", "Meta Reel Ad if sends/reach ≥ 3%"] },
  { date: "2026-05-22", track: "ALL LOVE EP", actions: ["Check 7-day save rates per track", "Activate Discovery Mode on 3%+ tracks", "Showcase on best-performing EP track"] },
  { date: "2026-05-30", track: "Like I Did", actions: ["Marquee ($100)", "Meta Reel Ad if organic proof exists"] },
  { date: "2026-06-06", track: "Like I Did", actions: ["Discovery Mode if save rate holds", "Showcase if warranted"] },
  // Subsequent vault singles: Meta test only. Marquee reserved for EP + LID.
  { date: "2026-06-13", track: "I Like Girls", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-06-27", track: "Worth It", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-07-11", track: "Just Say So", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
  { date: "2026-07-25", track: "Reconnect", actions: ["Meta Reel Ad ($50 test ONLY if organic proof)"] },
];
```

### 2.3 Create `lib/departments/revenue.ts`

```typescript
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
  currentNonDD: 0, // Update as sync/streaming/live revenue materializes
};
```

### 2.4 Wire Social into Kill List

**File:** `lib/killList.ts` — ADD after IG Community Sprint section (~line 122)

```typescript
import { COMMUNITY_TRACE, UNFOLLOW_PROGRAM, DM_BLITZ } from "@/lib/departments/social";

// ── SOCIAL DEPARTMENT: Community Trace (daily 15 min) ──
if (isBizDay(dayType) || isStudioDay(dayType as any)) {
  const traceKey = `community_trace:${today}`;
  const traceDone = await getStoreValue<boolean>(traceKey);
  if (!traceDone && hour >= 9 && hour < 20) {
    tasks.push({
      id: `community-trace-${today}`,
      title: "Community Trace — 15 min (timer)",
      subtitle: "Reply to comments, DM sharers, engage peers. SET TIMER.",
      howTo: COMMUNITY_TRACE.actions,
      urgency: hour >= 14 ? "AMBER" : "GREEN",
      pillar: "business" as const,
      timeBlock: "biz" as const,
      action: async () => { await setStoreValue(traceKey, true); },
    });
  }
}

// ── SOCIAL DEPARTMENT: Sunday Unfollow Batch ──
if (new Date().getDay() === 0) { // Sunday only
  const unfollowKey = `unfollow_batch:${today}`;
  const unfollowDone = await getStoreValue<boolean>(unfollowKey);
  if (!unfollowDone) {
    tasks.push({
      id: `unfollow-${today}`,
      title: "Sunday Unfollow Batch (50 accounts)",
      subtitle: `Ratio fix: ${UNFOLLOW_PROGRAM.currentRatio} → ${UNFOLLOW_PROGRAM.targetRatio}`,
      howTo: UNFOLLOW_PROGRAM.instructions,
      urgency: "GREEN" as const,
      pillar: "business" as const,
      timeBlock: "any" as const,
      action: async () => { await setStoreValue(unfollowKey, true); },
    });
  }
}
```

### 2.5 Wire Marketing Triggers into Kill List

**File:** `lib/killList.ts` — ADD new section

```typescript
import { SPEND_TRIGGERS, BUDGET_RULES, CAMPAIGN_CALENDAR } from "@/lib/departments/marketing";

// ── MARKETING DEPARTMENT: Campaign calendar check ──
const todayCampaign = CAMPAIGN_CALENDAR.find(c => c.date === today);
if (todayCampaign) {
  const campaignKey = `campaign_action:${today}`;
  const campaignDone = await getStoreValue<boolean>(campaignKey);
  if (!campaignDone) {
    tasks.push({
      id: `campaign-${today}`,
      title: `MARKETING: ${todayCampaign.track} campaign actions`,
      subtitle: todayCampaign.actions.join(" · "),
      howTo: [
        `Track: ${todayCampaign.track}`,
        ...todayCampaign.actions.map(a => `→ ${a}`),
        `Budget ceiling: $${BUDGET_RULES.monthlyCap}/month. Kill at $${BUDGET_RULES.killThreshold.costPerStream} CPS.`,
        "NEVER spend without organic proof. Check sends/reach first.",
      ],
      urgency: "RED" as const,
      pillar: "business" as const,
      timeBlock: "biz" as const,
      action: async () => { await setStoreValue(campaignKey, true); },
      needle: true,
    });
  }
}
```

### 2.6 Wire Revenue Milestones (monthly check)

**File:** `lib/killList.ts` — ADD new section

```typescript
import { SYNC_PIPELINE, REVENUE_LADDER } from "@/lib/departments/revenue";

// ── REVENUE DEPARTMENT: Sync pipeline (fires after EP release, once per week on BIZ days) ──
const epReleased = new Date() >= new Date('2026-05-15');
const isMonday = new Date().getDay() === 1;
if (epReleased && isMonday && isBizDay(dayType)) {
  const syncKey = `sync_check:${weekKey}`;
  const syncChecked = await getStoreValue<boolean>(syncKey);
  if (!syncChecked) {
    const nextStep = SYNC_PIPELINE.checklist.find(c => !c.done);
    if (nextStep) {
      tasks.push({
        id: `sync-${nextStep.id}`,
        title: `SYNC: ${nextStep.task}`,
        subtitle: "Sync licensing is #1 revenue priority post-EP. One placement = 100K streams.",
        howTo: [
          `This week's sync task: ${nextStep.task}`,
          "Refer to REVENUE_BUSINESS_ROADMAP.md for full context.",
          "Single TV placement ($500-$5,000) = 100K-1M stream equivalent.",
          "Do ONE task per week. Consistency > intensity.",
          "Tap ✓ when done.",
        ],
        urgency: "AMBER" as const,
        pillar: "business" as const,
        timeBlock: "biz" as const,
        action: async () => { await setStoreValue(syncKey, true); },
      });
    }
  }
}
```

---

## SESSION 3: PRUNE + POLISH + DEPLOY

### 3.1 Delete Dead Routes

**Action:** Remove these files entirely:

| Route | Reason |
|-------|--------|
| `app/geo/page.tsx` + `app/geo/sprint/page.tsx` | Gorilla Geo not running. No triggering architecture. |
| `app/sonic/page.tsx` | No active use. Core Drive Builder is CLI-only. |
| `app/velocity/page.tsx` | Unclear purpose. No references from other files. |
| `app/kami/page.tsx` + `app/kami/login/page.tsx` | JARVIS/Kami never became operational. |
| `app/engine/page.tsx` | Redundant with Kill List's pipeline derivation. |

**Keep:**
- `/` (Today — morning ignition)
- `/kill` (Execute — unified priority stream)
- `/label` (War Room — 8-tab reference)
- `/doctrine` (Philosophy pages — 15 entries)
- `/studio` (Session logging)
- `/brain` (Brain page)
- `/planner` (Sunday planning)
- `/settings`
- `/grind` (Streak/logging — feeds Kill List derivation)
- `/analytics` (Data reference)
- `/log` (Historical logs)

### 3.2 Update `releases.ts` — Correct any stale data

**File:** `lib/releases.ts`
**Action:** Verify RELEASE_DEFAULTS matches current reality:

```
SEE ME — releaseDate: "2026-03-13", status: "live"
East Side Love — releaseDate: "2026-05-08", status: "uploaded" (uploaded Apr 30)
Green Light — releaseDate: "2026-05-15", status: "pending"
Sweet Frustration — releaseDate: "2026-05-15", status: "pending"
Want U 2 — releaseDate: "2026-05-15", status: "pending"
ALL LOVE EP — releaseDate: "2026-05-15", status: "pending"
Like I Did — releaseDate: "2026-05-30", status: "vault"
I Like Girls — releaseDate: "2026-06-13", status: "vault"
Worth It — releaseDate: "2026-06-27", status: "vault"
Just Say So — releaseDate: "2026-07-11", status: "vault"
Reconnect — releaseDate: "2026-07-25", status: "vault"
```

**CRITICAL:** Grep for "DistroKid" and replace with "Amuse" anywhere it appears. The Apr 4 schematic incorrectly stated a migration. Distributor is and always has been Amuse.

### 3.3 Fix the UPGRADE_SCHEMATIC_APR4.md DistroKid error

**File:** `Ethan Payton Label OS/UPGRADE_SCHEMATIC_APR4.md` line 26
**Action:** This file told Sonnet to "Grep all files for 'Amuse' and update to 'DistroKid'". This is WRONG. Either delete the file (it's in the ARCHIVE tier) or add a header:

```
> ⚠️ DEPRECATED — DO NOT EXECUTE. This schematic contains a critical error 
> (DistroKid migration that never happened). Distributor remains Amuse.
```

### 3.4 Add Department Badge to Kill List UI

**File:** `app/kill/page.tsx`
**Action:** Add a small department indicator to each task card. The `pillar` field already exists but maps to generic labels. Extend:

```typescript
const DEPT_LABELS: Record<string, { label: string; color: string }> = {
  creative: { label: "CONTENT", color: "#FFB800" },
  business: { label: "SOCIAL/BIZ", color: "#3B82F6" },
  body: { label: "HEALTH", color: "#22c55e" },
  ops: { label: "OPS", color: "#A855F7" },
};
```

### 3.5 Navigation Simplification

**File:** Root layout or nav component
**Action:** Reduce visible nav to 4 items:

```
TODAY (/) | EXECUTE (/kill) | WAR ROOM (/label) | LOG (/grind)
```

Everything else accessible via a "More" menu or settings. The user sees 4 buttons. That's it.

### 3.6 Remove Follow Blitz (expired)

**File:** `lib/killList.ts` lines 395-419
**Action:** The Follow CTA Blitz is hardcoded May 1-15. After May 15, this code is dead. Either:
- Delete it entirely, OR
- Make it configurable: `const FOLLOW_BLITZ = { start: '...', end: '...' }` in `content.ts` so it can be reactivated for future campaigns.

---

## FILE CREATION SUMMARY

| New File | Purpose |
|----------|---------|
| `lib/departments/health.ts` | Morning stack, training program, nutrition triggers |
| `lib/departments/content.ts` | Content pillars, platform specs, sprint template, CF4 config |
| `lib/departments/social.ts` | Community Trace, unfollow program, DM blitz, superfans |
| `lib/departments/marketing.ts` | Budget rules, spend triggers, campaign calendar |
| `lib/departments/revenue.ts` | Sync pipeline, revenue ladder, DoorDash exit |

## FILES MODIFIED

| File | Changes |
|------|---------|
| `lib/killList.ts` | Import departments, replace hardcoded workouts, add social/marketing/revenue sections |
| `app/page.tsx` | Replace morning protocol with Health department import |
| `app/kill/page.tsx` | Add department badge to task cards |
| `lib/releases.ts` | Update release dates + verify no DistroKid references |
| Root nav | Simplify to 4 visible routes |

## FILES DELETED

| File | Reason |
|------|--------|
| `app/geo/page.tsx` | Dead (Gorilla Geo not running) |
| `app/geo/sprint/page.tsx` | Dead |
| `app/sonic/page.tsx` | Dead |
| `app/velocity/page.tsx` | Dead |
| `app/kami/page.tsx` | Dead (JARVIS shelved) |
| `app/kami/login/page.tsx` | Dead |
| `app/engine/page.tsx` | Redundant with Kill List |

---

## VERIFICATION CHECKLIST (Post-Implementation)

- [ ] `npm run build` passes with no TypeScript errors
- [ ] Morning flow shows Health Protocol steps (sunlight, hydration, breathwork, pelvic release)
- [ ] Kill List generates workout task matching today's day-of-week
- [ ] Kill List generates Community Trace task on BIZ days
- [ ] Kill List generates content pillar task on non-sprint days
- [ ] Kill List generates cross-post reminder after 2 PM
- [ ] Sunday shows Unfollow Batch + Grief Journal tasks
- [ ] Campaign calendar fires on release dates (May 15, May 30, etc.)
- [ ] Sync pipeline task fires weekly on Mondays after May 15
- [ ] No references to "DistroKid" anywhere in codebase
- [ ] Dead routes return 404 (files deleted)
- [ ] Nav shows only 4 items
- [ ] Deploy succeeds on Vercel

---

## EXECUTION ORDER

**Session 1** (highest value, do first):
1. Create `lib/departments/health.ts`
2. Create `lib/departments/content.ts`
3. Refactor killList.ts workout section
4. Refactor app/page.tsx morning flow
5. Add content daily task + cross-post task to killList.ts
6. `npm run build` → verify → commit → push

**Session 2** (business intelligence layer):
1. Create `lib/departments/social.ts`
2. Create `lib/departments/marketing.ts`
3. Create `lib/departments/revenue.ts`
4. Wire all three into killList.ts
5. `npm run build` → verify → commit → push

**Session 3** (cleanup + polish):
1. Delete dead routes
2. Verify releases.ts
3. Grep + kill DistroKid references
4. Simplify nav
5. Add department badges to Kill List UI
6. Remove expired Follow Blitz code
7. Full build → deploy → verify on Vercel

---

## WHY THIS WORKS FOR ETHAN

1. **No reading.** The 5 department protocols become code that generates tasks. Ethan never opens a markdown file.
2. **Time-of-day awareness.** Health morning stack fires if not done by 9 AM. Content task fires on BIZ days. Marketing fires on release dates. Everything is contextual.
3. **ADHD-native.** Each task has howTo steps. Checkboxes. Urgency colors. 90-second engagement ceiling.
4. **Budget guardrails.** Marketing spend is BLOCKED unless organic proof exists. No emotional spending.
5. **One surface.** Open Oracle → see TODAY → see EXECUTE. Two taps to know exactly what to do.
6. **Algorithm-current.** The content engine knows sends > saves > likes. Every content task ends with cross-post instructions. TikTok is baked in, not optional.
