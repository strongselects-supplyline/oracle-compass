// lib/derived-intelligence.ts
// Dynamic Reasoning Chain — pre-computes intelligence signals before Oracle fires.
// Every threshold here is auditable and deterministic. No vibes.
//
// This is the S-Tier upgrade: the Oracle reasons from DERIVED FACTS,
// not raw data. Arithmetic happens in code. Synthesis happens in Sonnet.
//
// Built March 18, 2026.

// ── Types ────────────────────────────────────────────────────────────

export interface DerivedIntelligence {
  severityPreScore: {
    score: number;
    classification: "GREEN" | "AMBER" | "RED";
    drivers: string[];
  };
  convergenceWindows: {
    active: boolean;
    events: string[];
    riskLevel: "NONE" | "ELEVATED" | "CRITICAL";
    advisory: string;
  };
  causalChains: string[];
  contentReadiness: {
    track: string;
    daysUntil: number;
    score: number;
    missingCritical: string[];
    status: "GREEN" | "AMBER" | "RED";
  } | null;
  sprintPace: {
    weekTarget: string;
    onPace: boolean;
    tracksCompleted: number;
    tracksTarget: number;
    velocity: "ahead" | "on_pace" | "behind" | "stalled";
  };
  compoundRisk: {
    score: number;
    factors: string[];
    burnoutRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  };
  financialRunway: {
    weeklyBurn: number;
    weeklyIncome: number;
    status: "HEALTHY" | "TIGHT" | "CRITICAL";
    advisory: string | null;
  };
  timeDirective: {
    currentBlock: string;
    hoursRemaining: number;
    directive: string;
  };
}

// ── Severity Decision Tree ───────────────────────────────────────────

interface SeverityInput {
  fuelAvg3Day: number;
  fuelToday: number;
  missedPreSession: number;
  dairyOnVocalDay: boolean;
  hydration: number | null;
  sessionAvg3Day: number;
  studioSessionsThisWeek: number;
  weekday: number;
  daysUntilNextRelease: number;
  complianceGaps: string[];
  ddShiftsThisWeek: number;
  personalTimeDays: number;
  consecutiveNoPersonal: number;
  sovereigntyStackStreak: number;
  contentReadinessScore: number;
  sleepLast: number | null;
  batchPrepDone: boolean;
  sundayIsCurrent: boolean;
  currentHour: number;
}

export function computeSeverity(ctx: SeverityInput): {
  score: number;
  classification: "GREEN" | "AMBER" | "RED";
  drivers: string[];
} {
  let score = 0;
  const drivers: string[] = [];

  // ── BODY PILLAR (max ~30 pts) ──
  if (ctx.fuelToday === 0 && ctx.currentHour >= 12) {
    score += 12;
    drivers.push("Zero fuel by noon — body is running on fumes");
  } else if (ctx.fuelAvg3Day < 2.0) {
    score += 8;
    drivers.push(`Fuel avg ${ctx.fuelAvg3Day.toFixed(1)}/3 over 3 days — chronic under-fueling`);
  }

  if (ctx.missedPreSession >= 2) {
    score += 8;
    drivers.push(
      `Pre-session fuel missed ${ctx.missedPreSession}/3 recent days — blood sugar crashes incoming`
    );
  }

  if (ctx.dairyOnVocalDay) {
    score += 15;
    drivers.push("DAIRY FLAGGED on vocal day — mucus on cords, session quality will suffer");
  }

  if (ctx.hydration !== null && ctx.hydration <= 2) {
    score += 5;
    drivers.push(`Hydration at ${ctx.hydration}/5 — dehydrated cords affect every take`);
  }

  if (ctx.sleepLast !== null && ctx.sleepLast < 6) {
    score += 8;
    drivers.push(`${ctx.sleepLast}h sleep — capacity is reduced today, adjust expectations`);
  }

  if (!ctx.batchPrepDone && ctx.weekday >= 1 && ctx.weekday <= 3) {
    score += 3;
    drivers.push("Sunday batch prep missed — mid-week fuel quality will degrade");
  }

  // ── CREATIVE PILLAR (max ~35 pts) ──
  if (ctx.complianceGaps.length > 0 && ctx.daysUntilNextRelease <= 3) {
    score += 25;
    drivers.push(
      `COMPLIANCE GAP ${ctx.daysUntilNextRelease} days from release — ${ctx.complianceGaps.join(", ")}`
    );
  } else if (ctx.complianceGaps.length > 0 && ctx.daysUntilNextRelease <= 7) {
    score += 12;
    drivers.push(`Compliance incomplete, release in ${ctx.daysUntilNextRelease} days`);
  }

  if (ctx.studioSessionsThisWeek < 2 && ctx.weekday >= 3) {
    score += 10;
    drivers.push(
      `Only ${ctx.studioSessionsThisWeek} studio sessions by midweek — behind pace`
    );
  }

  if (ctx.sessionAvg3Day > 0 && ctx.sessionAvg3Day < 2.5) {
    score += 8;
    drivers.push(
      `Session quality avg ${ctx.sessionAvg3Day.toFixed(1)}/5 over 3 days — output is degrading`
    );
  }

  if (ctx.contentReadinessScore < 50 && ctx.daysUntilNextRelease <= 3) {
    score += 20;
    drivers.push(
      `Content ${ctx.contentReadinessScore}% ready, release in ${ctx.daysUntilNextRelease} days — RED content emergency`
    );
  } else if (ctx.contentReadinessScore < 30 && ctx.daysUntilNextRelease <= 5) {
    score += 15;
    drivers.push(
      `Content readiness at ${ctx.contentReadinessScore}% with ${ctx.daysUntilNextRelease} days to release — silent drop incoming`
    );
  } else if (ctx.contentReadinessScore < 40 && ctx.daysUntilNextRelease <= 7) {
    score += 8;
    drivers.push(
      `Content at ${ctx.contentReadinessScore}% with ${ctx.daysUntilNextRelease} days out — needs attention`
    );
  }

  if (ctx.ddShiftsThisWeek > 4) {
    score += 8;
    drivers.push(`${ctx.ddShiftsThisWeek} DD shifts this week — eating into studio capacity`);
  }

  // ── SUSTAINABILITY (max ~15 pts) ──
  if (ctx.consecutiveNoPersonal >= 7) {
    score += 15;
    drivers.push(
      `${ctx.consecutiveNoPersonal} consecutive days without personal time — burnout is imminent`
    );
  } else if (ctx.consecutiveNoPersonal >= 5) {
    score += 8;
    drivers.push(
      `${ctx.consecutiveNoPersonal} days without personal time — schedule recovery`
    );
  }

  if (ctx.sovereigntyStackStreak === 0) {
    score += 3;
    drivers.push("Sovereignty stack not completed today");
  }

  const clamped = Math.min(score, 100);
  const classification =
    clamped >= 70 ? "RED" : clamped >= 40 ? "AMBER" : "GREEN";
  return { score: clamped, classification, drivers };
}

// ── Content Readiness (Weighted) ──────────────────────────────────────

const CONTENT_WEIGHTS = {
  visualIdea: 5,
  primaryVideo: 25,
  lyricVideo: 10,
  reels: 30,
  tiktoks: 20,
  brollClips: 10,
};

interface ContentDeliverables {
  visualIdea: string;
  primaryVideo: string;
  lyricVideo: string;
  reelsPosted: number;
  reelsGoal: number;
  tiktoksPosted: number;
  tiktoksGoal: number;
  brollClips: number;
}

export function computeContentReadiness(d: ContentDeliverables): {
  score: number;
  missingCritical: string[];
} {
  let earned = 0;
  const missing: string[] = [];

  if (d.visualIdea && d.visualIdea.trim().length > 0) {
    earned += CONTENT_WEIGHTS.visualIdea;
  } else {
    missing.push("Visual idea not locked");
  }

  const pvMap: Record<string, number> = {
    none: 0, planned: 0.2, shot: 0.5, edited: 0.8, done: 1,
  };
  const pvPct = pvMap[d.primaryVideo] ?? 0;
  earned += CONTENT_WEIGHTS.primaryVideo * pvPct;
  if (pvPct < 0.5) missing.push(`Primary video: ${d.primaryVideo}`);

  const lvMap: Record<string, number> = {
    none: 0, planned: 0.2, edited: 0.6, done: 1,
  };
  earned += CONTENT_WEIGHTS.lyricVideo * (lvMap[d.lyricVideo] ?? 0);

  const reelPct =
    d.reelsGoal > 0 ? Math.min(d.reelsPosted / d.reelsGoal, 1) : 0;
  earned += CONTENT_WEIGHTS.reels * reelPct;
  if (reelPct < 0.3) missing.push(`Reels: ${d.reelsPosted}/${d.reelsGoal}`);

  const ttPct =
    d.tiktoksGoal > 0 ? Math.min(d.tiktoksPosted / d.tiktoksGoal, 1) : 0;
  earned += CONTENT_WEIGHTS.tiktoks * ttPct;
  if (ttPct < 0.3) missing.push(`TikToks: ${d.tiktoksPosted}/${d.tiktoksGoal}`);

  const brollPct = Math.min(d.brollClips / 5, 1);
  earned += CONTENT_WEIGHTS.brollClips * brollPct;
  if (d.brollClips === 0) missing.push("Zero B-roll clips captured");

  return { score: Math.round(earned), missingCritical: missing };
}

// ── Convergence Detection ────────────────────────────────────────────

export function detectConvergence(ctx: {
  daysUntilAlbum: number;
  daysUntilNextRelease: number;
  daysUntil414Day: number;
  today: string;
}): {
  active: boolean;
  events: string[];
  riskLevel: "NONE" | "ELEVATED" | "CRITICAL";
  advisory: string;
} {
  const events: string[] = [];

  if (
    ctx.daysUntil414Day >= 0 &&
    ctx.daysUntil414Day <= 7 &&
    ctx.daysUntilAlbum >= 0 &&
    ctx.daysUntilAlbum <= 10
  ) {
    events.push(
      `414 Day in ${ctx.daysUntil414Day}d + EP in ${ctx.daysUntilAlbum}d — performance prep and release prep collide`
    );
  }

  if (ctx.daysUntilNextRelease >= 0 && ctx.daysUntilNextRelease <= 5) {
    events.push(
      `Single dropping in ${ctx.daysUntilNextRelease}d — T-minus content sprint active`
    );
  }

  if (ctx.daysUntilAlbum >= 7 && ctx.daysUntilAlbum <= 14) {
    events.push(
      `EP upload window active — Amuse submission must happen within ${ctx.daysUntilAlbum - 10} days`
    );
  }

  const riskLevel =
    events.length >= 2 ? "CRITICAL" : events.length === 1 ? "ELEVATED" : "NONE";

  const advisory =
    riskLevel === "CRITICAL"
      ? "Multiple high-stakes events converging. Triage ruthlessly — some things will slip and that's strategic, not failure."
      : riskLevel === "ELEVATED"
      ? "Convergence window active. Protect studio block and front-load non-music tasks."
      : "No convergence detected.";

  return { active: events.length > 0, events, riskLevel, advisory };
}

// ── Causal Chain Detection ───────────────────────────────────────────

export function detectCausalChains(ctx: {
  fuelAvg: number;
  sessionAvg: number;
  sleepLast: number | null;
  dairyFlag: boolean;
  sessionType: string;
  hydration: number | null;
  personalTimeDays: number;
  consecutiveNoPersonal: number;
  contentReadiness: number;
  daysUntilRelease: number;
}): string[] {
  const chains: string[] = [];

  if (ctx.fuelAvg < 2.0 && ctx.sessionAvg < 3.0) {
    chains.push(
      "FUEL→SESSION: Low fuel average is directly degrading session quality. Fix nutrition first, studio output follows."
    );
  }
  if (ctx.sleepLast !== null && ctx.sleepLast < 6 && ctx.sessionAvg < 3.0) {
    chains.push(
      `SLEEP→SESSION: ${ctx.sleepLast}h sleep is capping session quality. Today's ceiling is lower — work accordingly.`
    );
  }
  if (ctx.dairyFlag && ctx.sessionType === "recording") {
    chains.push(
      "DAIRY→VOCALS: Dairy before a recording session thickens mucus on vocal cords. More takes, less clean."
    );
  }
  if (
    ctx.hydration !== null &&
    ctx.hydration <= 2 &&
    ctx.sessionType === "recording"
  ) {
    chains.push(
      "HYDRATION→VOCALS: Dehydrated cords lose elasticity. Higher risk of strain, thinner tone, pitch inconsistency."
    );
  }
  if (ctx.consecutiveNoPersonal >= 5 && ctx.sessionAvg < 3.0) {
    chains.push(
      `BURNOUT→SESSION: ${ctx.consecutiveNoPersonal} days without rest is degrading creative output. Diminishing returns are active.`
    );
  }
  if (ctx.contentReadiness < 30 && ctx.daysUntilRelease <= 7) {
    chains.push(
      `CONTENT→RELEASE: ${ctx.contentReadiness}% content readiness with ${ctx.daysUntilRelease} days to release. A great song with no content is a silent drop.`
    );
  }
  if (
    ctx.sleepLast !== null &&
    ctx.sleepLast < 6 &&
    ctx.fuelAvg < 2.0
  ) {
    chains.push(
      "SLEEP+FUEL→COMPOUND: Both sleep and fuel are compromised. Today is a recovery day whether you planned it or not."
    );
  }

  return chains;
}

// ── Compound Risk Score ──────────────────────────────────────────────

export function computeCompoundRisk(ctx: {
  severityScore: number;
  consecutiveNoPersonal: number;
  fuelAvg: number;
  sleepLast: number | null;
  sessionAvg: number;
  ddShifts: number;
  convergenceActive: boolean;
}): {
  score: number;
  factors: string[];
  burnoutRisk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
} {
  let risk = 0;
  const factors: string[] = [];

  risk += ctx.severityScore * 0.3;

  if (ctx.consecutiveNoPersonal >= 7) {
    risk += 25;
    factors.push("7+ days no personal time");
  } else if (ctx.consecutiveNoPersonal >= 5) {
    risk += 15;
    factors.push("5+ days no personal time");
  }

  if (ctx.fuelAvg < 1.5) {
    risk += 15;
    factors.push("Severe under-fueling");
  }
  if (ctx.sleepLast !== null && ctx.sleepLast < 5) {
    risk += 15;
    factors.push("Critical sleep deficit");
  }

  if (ctx.sessionAvg > 0 && ctx.sessionAvg < 2.0) {
    risk += 10;
    factors.push("Session quality in decline");
  }

  if (ctx.ddShifts >= 5) {
    risk += 10;
    factors.push("Heavy DD schedule eating into capacity");
  }

  if (ctx.convergenceActive) {
    risk = Math.min(risk * 1.3, 100);
    factors.push("Convergence window amplifying pressure");
  }

  const clamped = Math.round(Math.min(risk, 100));
  const burnoutRisk =
    clamped >= 75
      ? "CRITICAL"
      : clamped >= 50
      ? "HIGH"
      : clamped >= 30
      ? "MODERATE"
      : "LOW";
  return { score: clamped, factors, burnoutRisk };
}

// ── Sprint Pace ──────────────────────────────────────────────────────

export function computeSprintPace(ctx: {
  weekNumber: number;
  weekTarget: string;
  totalDone: number;
  totalTarget: number;
  inProgress: number;
}): {
  weekTarget: string;
  onPace: boolean;
  tracksCompleted: number;
  tracksTarget: number;
  velocity: "ahead" | "on_pace" | "behind" | "stalled";
} {
  const diff = ctx.totalDone - ctx.totalTarget;
  let velocity: "ahead" | "on_pace" | "behind" | "stalled";
  if (diff >= 2) velocity = "ahead";
  else if (diff >= -1) velocity = "on_pace";
  else if (ctx.inProgress > 0) velocity = "behind";
  else velocity = "stalled";

  return {
    weekTarget: ctx.weekTarget,
    onPace: diff >= -1,
    tracksCompleted: ctx.totalDone,
    tracksTarget: ctx.totalTarget,
    velocity,
  };
}

// ── Financial Runway ─────────────────────────────────────────────────

export function computeFinancialRunway(
  ddShifts: number
): {
  weeklyBurn: number;
  weeklyIncome: number;
  status: "HEALTHY" | "TIGHT" | "CRITICAL";
  advisory: string | null;
} {
  const estimatedDDPerShift = 45;
  const weeklyDD = ddShifts * estimatedDDPerShift;
  const weeklyIncome = weeklyDD;
  const weeklyBurn = 300;

  const status =
    weeklyIncome >= weeklyBurn
      ? "HEALTHY"
      : weeklyIncome >= weeklyBurn * 0.6
      ? "TIGHT"
      : "CRITICAL";

  const advisory =
    status === "CRITICAL"
      ? "Income below burn rate. Front-load DD shifts immediately."
      : status === "TIGHT"
      ? "Income is tight. One extra DD shift this week stabilizes."
      : null;

  return { weeklyBurn, weeklyIncome, status, advisory };
}

// ── Time Directive ───────────────────────────────────────────────────

export function generateTimeDirective(
  block: string,
  hours: number,
  weekday: number
): string {
  if (weekday === 0)
    return "Sunday is sacred. Rest, batch prep, plan the week.";
  if (block === "pre-session")
    return "Pre-studio window. Fuel, stack, movement. Protect the session.";
  if (block === "studio" && hours > 3)
    return `${hours}h of studio remaining. Deep work. No interruptions.`;
  if (block === "studio" && hours <= 3)
    return `${hours}h left in studio. Wrap current task, don't start new tracks.`;
  if (block === "post-studio")
    return "Studio done. Content window or recovery — no new creative.";
  if (block === "dd-morning")
    return "Morning DoorDash block. Prioritize high-tip routes.";
  if (block === "dd-evening")
    return "Evening DoorDash block. Peak dinner rush. Lock in.";
  if (block === "evening")
    return "Day is done. Recovery, personal time, or light admin only.";
  return "Assess what block you're in and act accordingly.";
}

// ── Master Assembly ──────────────────────────────────────────────────

export interface DerivedIntelligenceInput {
  fuelToday: number;
  fuelAvg3Day: number;
  missedPreSession: number;
  dairyOnVocalDay: boolean;
  hydration: number | null;
  sleepLast: number | null;
  sessionAvg3Day: number;
  studioSessionsThisWeek: number;
  weekday: number;
  currentHour: number;
  daysUntilNextRelease: number;
  daysUntilAlbum: number;
  daysUntil414Day: number;
  complianceGaps: string[];
  ddShiftsThisWeek: number;
  personalTimeDays: number;
  consecutiveNoPersonal: number;
  sovereigntyStackStreak: number;
  batchPrepDone: boolean;
  sessionType: string;
  contentDeliverables: ContentDeliverables | null;
  weekNumber: number;
  weekTarget: string;
  totalDone: number;
  totalTarget: number;
  inProgress: number;
  currentBlock: string;
  hoursRemaining: number;
  today: string;
  nextReleaseTitle: string;
}

export function assembleDerivedIntelligence(
  raw: DerivedIntelligenceInput
): DerivedIntelligence {
  const contentResult = raw.contentDeliverables
    ? computeContentReadiness(raw.contentDeliverables)
    : { score: 0, missingCritical: ["No deliverables data"] };

  const contentStatus: "GREEN" | "AMBER" | "RED" =
    raw.daysUntilNextRelease <= 3 && contentResult.score < 50
      ? "RED"
      : raw.daysUntilNextRelease <= 5 && contentResult.score < 30
      ? "RED"
      : raw.daysUntilNextRelease <= 7 && contentResult.score < 40
      ? "AMBER"
      : "GREEN";

  const severity = computeSeverity({
    ...raw,
    contentReadinessScore: contentResult.score,
    sundayIsCurrent: raw.weekday === 0,
  });

  const convergence = detectConvergence({
    daysUntilAlbum: raw.daysUntilAlbum,
    daysUntilNextRelease: raw.daysUntilNextRelease,
    daysUntil414Day: raw.daysUntil414Day,
    today: raw.today,
  });

  const causalChains = detectCausalChains({
    fuelAvg: raw.fuelAvg3Day,
    sessionAvg: raw.sessionAvg3Day,
    sleepLast: raw.sleepLast,
    dairyFlag: raw.dairyOnVocalDay,
    sessionType: raw.sessionType,
    hydration: raw.hydration,
    personalTimeDays: raw.personalTimeDays,
    consecutiveNoPersonal: raw.consecutiveNoPersonal,
    contentReadiness: contentResult.score,
    daysUntilRelease: raw.daysUntilNextRelease,
  });

  const sprintPace = computeSprintPace({
    weekNumber: raw.weekNumber,
    weekTarget: raw.weekTarget,
    totalDone: raw.totalDone,
    totalTarget: raw.totalTarget,
    inProgress: raw.inProgress,
  });

  const compoundRisk = computeCompoundRisk({
    severityScore: severity.score,
    consecutiveNoPersonal: raw.consecutiveNoPersonal,
    fuelAvg: raw.fuelAvg3Day,
    sleepLast: raw.sleepLast,
    sessionAvg: raw.sessionAvg3Day,
    ddShifts: raw.ddShiftsThisWeek,
    convergenceActive: convergence.active,
  });

  const financialRunway = computeFinancialRunway(
    raw.ddShiftsThisWeek
  );

  const timeDirective = {
    currentBlock: raw.currentBlock,
    hoursRemaining: raw.hoursRemaining,
    directive: generateTimeDirective(
      raw.currentBlock,
      raw.hoursRemaining,
      raw.weekday
    ),
  };

  return {
    severityPreScore: severity,
    convergenceWindows: convergence,
    causalChains,
    contentReadiness: raw.contentDeliverables
      ? {
          track: raw.nextReleaseTitle,
          daysUntil: raw.daysUntilNextRelease,
          score: contentResult.score,
          missingCritical: contentResult.missingCritical,
          status: contentStatus,
        }
      : null,
    sprintPace,
    compoundRisk,
    financialRunway,
    timeDirective,
  };
}

// ── Format for Context Injection ─────────────────────────────────────

export function formatDerivedIntelligence(d: DerivedIntelligence): string {
  const lines: string[] = [
    "-- DERIVED INTELLIGENCE (pre-computed — treat as ground truth) --",
    `SEVERITY PRE-SCORE: ${d.severityPreScore.score}/100 → ${d.severityPreScore.classification}`,
    "DRIVERS:",
    ...d.severityPreScore.drivers.map((x) => `  ! ${x}`),
    "",
    `CONVERGENCE: ${d.convergenceWindows.riskLevel}`,
    ...(d.convergenceWindows.events.length > 0
      ? d.convergenceWindows.events.map((e) => `  → ${e}`)
      : ["  (none)"]),
    `ADVISORY: ${d.convergenceWindows.advisory}`,
    "",
    "CAUSAL CHAINS DETECTED:",
    ...(d.causalChains.length > 0
      ? d.causalChains.map((c) => `  ⚡ ${c}`)
      : ["  (none active)"]),
    "",
    `CONTENT READINESS: ${
      d.contentReadiness
        ? `${d.contentReadiness.track} — ${d.contentReadiness.score}% → ${d.contentReadiness.status} (${d.contentReadiness.daysUntil}d to release)`
        : "N/A"
    }`,
    ...(d.contentReadiness?.missingCritical.map((m) => `  ✗ ${m}`) ?? []),
    "",
    `SPRINT PACE: ${d.sprintPace.velocity.toUpperCase()} (${d.sprintPace.tracksCompleted}/${d.sprintPace.tracksTarget})`,
    "",
    `COMPOUND RISK: ${d.compoundRisk.score}/100 → BURNOUT: ${d.compoundRisk.burnoutRisk}`,
    ...(d.compoundRisk.factors.length > 0
      ? d.compoundRisk.factors.map((f) => `  ▲ ${f}`)
      : ["  (none)"]),
    "",
    `FINANCIAL RUNWAY: ${d.financialRunway.status}`,
    d.financialRunway.advisory ? `  ${d.financialRunway.advisory}` : "  On track.",
    "",
    `TIME DIRECTIVE: ${d.timeDirective.directive}`,
  ];

  return lines.join("\n");
}
