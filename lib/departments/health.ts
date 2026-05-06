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
    id: "health-run-tue",
    title: "Zone 2 Run (30 min)",
    subtitle: "Conversational pace. Build aerobic base. Galpin protocol.",
    dayOfWeek: [2], // Tuesday
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
    id: "health-run-thu",
    title: "Zone 2 Run (30 min)",
    subtitle: "Cardio base. Same progression as Tuesday.",
    dayOfWeek: [4], // Thursday
    duration: "30 min",
    howTo: [
      "Pre-run: banana or toast + PB, 20 min before. Don't run fasted.",
      "Pace target: 11:30–12:30/mi. Conversational — full sentences.",
      "Follow the same week progression as Tuesday.",
      "Post-run: +16 oz water. Add carbs to breakfast.",
      "Tap ✓ when done.",
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
