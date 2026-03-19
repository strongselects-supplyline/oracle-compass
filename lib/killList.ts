// lib/killList.ts
// Dynamic Kill List — derives actionable tasks from current system state.
// Nothing is stored. Everything is computed. When you clear a task,
// it mutates the underlying data and the list re-derives.
//
// This is the action surface the Oracle has been missing.
// Built March 18, 2026.

import { getDailyLog, saveDailyLog, getStoreValue, setStoreValue, getTodayISO, DailyLog } from "@/lib/db";
import { getDynamicReleases, Release, updateContentDeliverables } from "@/lib/releases";
import { REGISTRY, TrackRegistry } from "@/lib/registry";
import { getDayType, isStudioDay, isBizDay } from "@/lib/dayType";
import { getWeekKey, OracleFlag } from "@/lib/oracle";

// ── Types ────────────────────────────────────────────────────────────

export type KillTask = {
  id: string;
  title: string;
  subtitle: string;
  urgency: "RED" | "AMBER" | "GREEN";
  pillar: "creative" | "business" | "body" | "ops";
  timeBlock: "any" | "studio" | "biz" | "content" | "evening";
  // What happens when tapped — returns a function that writes to IndexedDB
  action: () => Promise<void>;
};

// ── Derivation Engine ────────────────────────────────────────────────

export async function deriveKillList(): Promise<KillTask[]> {
  const tasks: KillTask[] = [];
  const today = getTodayISO();
  const dayType = getDayType();
  const hour = new Date().getHours();
  const weekKey = getWeekKey();

  // Parallel data fetch
  const [dailyLog, releases, flags, sessions] = await Promise.all([
    getDailyLog(today),
    getDynamicReleases(),
    getStoreValue<OracleFlag[]>(`oracle_flags:${today}`),
    getStoreValue<number>(`weekly_sessions:${weekKey}`),
  ]);

  // ── 1. ORACLE FLAGS → Tasks ──────────────────────────────────────
  // These are the Oracle's own directives. Highest priority.
  if (flags && flags.length > 0) {
    for (const flag of flags) {
      tasks.push({
        id: `flag-${hashStr(flag.action)}`,
        title: flag.action,
        subtitle: flag.reason,
        urgency: flag.urgency,
        pillar: "ops",
        timeBlock: "any",
        action: async () => {
          // Clearing a flag removes it from today's list
          const current = await getStoreValue<OracleFlag[]>(`oracle_flags:${today}`);
          if (current) {
            const updated = current.filter(f => f.action !== flag.action);
            await setStoreValue(`oracle_flags:${today}`, updated);
          }
        },
      });
    }
  }

  // ── 2. FUEL → Tasks ──────────────────────────────────────────────
  if (isStudioDay(dayType as any)) {
    if (!dailyLog.fuelPreSession && hour < 16) {
      tasks.push({
        id: "fuel-pre",
        title: "Fuel: Pre-session meal",
        subtitle: hour >= 10
          ? "You're in studio with no fuel — blood sugar crash is coming"
          : "Eat before the session starts at 10AM",
        urgency: hour >= 11 ? "RED" : "AMBER",
        pillar: "body",
        timeBlock: "any",
        action: async () => {
          const log = await getDailyLog(today);
          log.fuelPreSession = true;
          await saveDailyLog(log);
        },
      });
    }
    if (!dailyLog.fuelMidSession && hour >= 12 && hour < 16) {
      tasks.push({
        id: "fuel-mid",
        title: "Fuel: Mid-session meal",
        subtitle: "Refuel to sustain output through hour 4-6",
        urgency: "AMBER",
        pillar: "body",
        timeBlock: "studio",
        action: async () => {
          const log = await getDailyLog(today);
          log.fuelMidSession = true;
          await saveDailyLog(log);
        },
      });
    }
    if (!dailyLog.fuelPostSession && hour >= 16) {
      tasks.push({
        id: "fuel-post",
        title: "Fuel: Post-session meal",
        subtitle: "Recovery nutrition — replenish after 6hr creative block",
        urgency: "AMBER",
        pillar: "body",
        timeBlock: "evening",
        action: async () => {
          const log = await getDailyLog(today);
          log.fuelPostSession = true;
          await saveDailyLog(log);
        },
      });
    }
    if (dailyLog.fuelHydration === null || dailyLog.fuelHydration < 3) {
      tasks.push({
        id: "fuel-hydration",
        title: "Hydrate — water intake is low",
        subtitle: dailyLog.sessionType === "recording"
          ? "Dehydrated cords lose elasticity — affects every take"
          : "Hydration affects focus and stamina",
        urgency: dailyLog.sessionType === "recording" ? "RED" : "AMBER",
        pillar: "body",
        timeBlock: "any",
        action: async () => {
          const log = await getDailyLog(today);
          log.fuelHydration = 3;
          await saveDailyLog(log);
        },
      });
    }
  }

  // ── 3. GRIND → Tasks ─────────────────────────────────────────────
  if (!dailyLog.sovereigntyStack) {
    tasks.push({
      id: "grind-stack",
      title: "Complete Sovereignty Stack",
      subtitle: "Foundation of the empire. Non-negotiable.",
      urgency: hour >= 12 ? "AMBER" : "GREEN",
      pillar: "body",
      timeBlock: "any",
      action: async () => {
      const log = await getDailyLog(today);
      log.sovereigntyStack = true;
      await saveDailyLog(log);
      },
    });
  }
  if (!dailyLog.movement && hour < 16) {
    tasks.push({
      id: "grind-movement",
      title: "Movement (before DAW)",
      subtitle: "Physical activation before creative work",
      urgency: "GREEN",
      pillar: "body",
      timeBlock: "any",
      action: async () => {
      const log = await getDailyLog(today);
      log.movement = true;
      await saveDailyLog(log);
      },
    });
  }

  // ── 4. COMPLIANCE → Tasks ────────────────────────────────────────
  // Check each upcoming release against its registry entry
  const now = new Date();
  for (const release of releases) {
    if (release.status === "live") continue;
    const releaseDate = new Date(release.releaseDate + "T00:00:00");
    const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / 86400000);
    if (daysUntil > 14) continue; // Only show compliance for releases within 2 weeks

    const reg = REGISTRY.find(r => r.title === release.title);
    if (!reg) continue;

    const urgency = daysUntil <= 3 ? "RED" : daysUntil <= 7 ? "AMBER" : "GREEN";

    if (!reg.isrc) {
      tasks.push({
        id: `compliance-isrc-${release.title}`,
        title: `Pull ISRC for ${release.title}`,
        subtitle: `Check Amuse confirmation email — needed for all registrations`,
        urgency,
        pillar: "ops",
        timeBlock: "any",
        action: async () => {
          // Can't auto-complete — this requires manual data entry
          // Mark as acknowledged in flags
          const flags = await getStoreValue<OracleFlag[]>(`oracle_flags:${today}`) || [];
          flags.push({ action: `ISRC pulled for ${release.title}`, urgency: "AMBER", reason: "Manual confirmation" });
          await setStoreValue(`oracle_flags:${today}`, flags);
        },
      });
    }
    if (reg.ascap !== "complete") {
      tasks.push({
        id: `compliance-ascap-${release.title}`,
        title: `Register ${release.title} on ASCAP`,
        subtitle: `ascap.com → Register Works${!reg.isrc ? " (needs ISRC first)" : ""}`,
        urgency: !reg.isrc ? "AMBER" : urgency,
        pillar: "ops",
        timeBlock: "biz",
        action: async () => {
          // Clearing marks as acknowledged — actual registration is manual
          const current = await getStoreValue<string[]>(`compliance_cleared:${today}`) || [];
          current.push(`ascap-${release.title}`);
          await setStoreValue(`compliance_cleared:${today}`, current);
        },
      });
    }
    if (reg.mlc !== "complete") {
      tasks.push({
        id: `compliance-mlc-${release.title}`,
        title: `Register ${release.title} on MLC`,
        subtitle: `themlc.com${!reg.isrc ? " (needs ISRC first)" : ""}`,
        urgency: !reg.isrc ? "AMBER" : urgency,
        pillar: "ops",
        timeBlock: "biz",
        action: async () => {
          const current = await getStoreValue<string[]>(`compliance_cleared:${today}`) || [];
          current.push(`mlc-${release.title}`);
          await setStoreValue(`compliance_cleared:${today}`, current);
        },
      });
    }
    if (reg.songtrust !== "complete") {
      tasks.push({
        id: `compliance-songtrust-${release.title}`,
        title: `Register ${release.title} on Songtrust`,
        subtitle: `Verify login post-UMG acquisition first${!reg.isrc ? " (needs ISRC)" : ""}`,
        urgency: !reg.isrc ? "AMBER" : urgency,
        pillar: "ops",
        timeBlock: "biz",
        action: async () => {
          const current = await getStoreValue<string[]>(`compliance_cleared:${today}`) || [];
          current.push(`songtrust-${release.title}`);
          await setStoreValue(`compliance_cleared:${today}`, current);
        },
      });
    }
  }

  // ── 5. CONTENT DELIVERABLES → Tasks ──────────────────────────────
  for (const release of releases) {
    if (release.status === "live") continue;
    const releaseDate = new Date(release.releaseDate + "T00:00:00");
    const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / 86400000);
    if (daysUntil > 10 || daysUntil < -3) continue;

    const d = release.contentDeliverables;

    if (!d.visualIdea || d.visualIdea.trim().length === 0) {
      tasks.push({
        id: `content-visual-${release.title}`,
        title: `Lock visual idea for ${release.title}`,
        subtitle: "Creative direction needs to be set before any assets are built",
        urgency: daysUntil <= 7 ? "RED" : "AMBER",
        pillar: "creative",
        timeBlock: "content",
        action: async () => {
          await updateContentDeliverables(release.title, { visualIdea: "(locked — set in session)" });
        },
      });
    }
    if (d.primaryVideo === "none" || d.primaryVideo === "planned") {
      tasks.push({
        id: `content-video-${release.title}`,
        title: `${d.primaryVideo === "none" ? "Start" : "Shoot"} primary video for ${release.title}`,
        subtitle: `Primary video is the highest-impact asset (25% of readiness score)`,
        urgency: daysUntil <= 5 ? "RED" : "AMBER",
        pillar: "creative",
        timeBlock: "content",
        action: async () => {
          const next = d.primaryVideo === "none" ? "planned" : "shot";
          await updateContentDeliverables(release.title, { primaryVideo: next });
        },
      });
    }
    if (d.reelsPosted < Math.ceil(d.reelsGoal * 0.3)) {
      const needed = Math.ceil(d.reelsGoal * 0.3) - d.reelsPosted;
      tasks.push({
        id: `content-reels-${release.title}`,
        title: `Post ${needed}+ reels for ${release.title}`,
        subtitle: `${d.reelsPosted}/${d.reelsGoal} posted — run CF4 --multi if footage exists`,
        urgency: daysUntil <= 5 ? "RED" : "AMBER",
        pillar: "creative",
        timeBlock: "content",
        action: async () => {
          await updateContentDeliverables(release.title, { reelsPosted: d.reelsPosted + 1 });
        },
      });
    }
    if (d.brollClips === 0) {
      tasks.push({
        id: `content-broll-${release.title}`,
        title: `Capture B-roll for ${release.title}`,
        subtitle: "Zero B-roll clips — feeds into reels and video assets",
        urgency: daysUntil <= 7 ? "AMBER" : "GREEN",
        pillar: "creative",
        timeBlock: "content",
        action: async () => {
          await updateContentDeliverables(release.title, { brollClips: 1 });
        },
      });
    }
  }

  // ── 6. SESSION → Tasks ───────────────────────────────────────────
  if (isStudioDay(dayType as any) && dailyLog.sessionQuality === null && hour >= 16) {
    tasks.push({
      id: "session-quality",
      title: "Log session quality",
      subtitle: "Oracle needs session data to assess creative output trends",
      urgency: "AMBER",
      pillar: "creative",
      timeBlock: "evening",
      action: async () => {
      const log = await getDailyLog(today);
      log.sessionQuality = 3; // Default to solid — user should update in Quick-Log
      await saveDailyLog(log);
      },
    });
  }

  // ── 7. BUSINESS → Tasks (biz days) ──────────────────────────────
  if (isBizDay(dayType)) {
    const move = await getStoreValue<string>("engine_daily_move");
    if (!move || move.trim().length === 0) {
      tasks.push({
        id: "biz-move",
        title: "Set today's business move",
        subtitle: "Biz day with no declared move — open Engine and commit",
        urgency: hour >= 12 ? "AMBER" : "GREEN",
        pillar: "business",
        timeBlock: "biz",
        action: async () => {
          // Can't set from here — direct to Engine page
          await setStoreValue("engine_daily_move", "(set in Engine)");
        },
      });
    }
    const touches = await getStoreValue<number>(`engine_touches:${weekKey}`);
    const target = await getStoreValue<number>("engine_touch_target") || 15;
    if ((touches || 0) < Math.floor(target * 0.5) && new Date().getDay() >= 3) {
      tasks.push({
        id: "biz-touches",
        title: `Outreach: ${touches || 0}/${target} touches this week`,
        subtitle: "Below 50% by midweek — pipeline will dry up",
        urgency: "AMBER",
        pillar: "business",
        timeBlock: "biz",
        action: async () => {
          const current = (await getStoreValue<number>(`engine_touches:${weekKey}`)) || 0;
          await setStoreValue(`engine_touches:${weekKey}`, current + 1);
        },
      });
    }
  }

  // ── 8. AMUSE UPLOAD DEADLINES ────────────────────────────────────
  for (const release of releases) {
    if (release.status === "live") continue;
    const uploadDate = new Date(release.uploadDate + "T00:00:00");
    const daysUntilUpload = Math.ceil((uploadDate.getTime() - now.getTime()) / 86400000);
    if (daysUntilUpload >= 0 && daysUntilUpload <= 3) {
      tasks.push({
        id: `upload-${release.title}`,
        title: `Upload ${release.title} to Amuse`,
        subtitle: `Upload by ${release.uploadDate} — ${daysUntilUpload === 0 ? "TODAY" : `${daysUntilUpload} day${daysUntilUpload > 1 ? "s" : ""} left`}`,
        urgency: daysUntilUpload <= 1 ? "RED" : "AMBER",
        pillar: "ops",
        timeBlock: "any",
        action: async () => {
          const current = await getStoreValue<string[]>(`uploads_confirmed:${today}`) || [];
          current.push(release.title);
          await setStoreValue(`uploads_confirmed:${today}`, current);
        },
      });
    }
  }

  // ── Filter by cleared ────────────────────────────────────────────
  // Check which tasks were already cleared today
  const cleared = await getStoreValue<string[]>(`kill_cleared:${today}`) || [];
  const filtered = tasks.filter(t => !cleared.includes(t.id));

  // ── Sort: RED first, then AMBER, then GREEN ──────────────────────
  const urgencyOrder: Record<string, number> = { RED: 0, AMBER: 1, GREEN: 2 };
  filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return filtered;
}

// ── Task Completion ──────────────────────────────────────────────────
// Executes the action AND marks the task as cleared for today

export async function completeTask(task: KillTask): Promise<void> {
  // Execute the underlying data mutation
  await task.action();

  // Mark as cleared (prevents re-showing after re-derive)
  const today = getTodayISO();
  const cleared = await getStoreValue<string[]>(`kill_cleared:${today}`) || [];
  if (!cleared.includes(task.id)) {
    cleared.push(task.id);
    await setStoreValue(`kill_cleared:${today}`, cleared);
  }
}

// ── Stats ────────────────────────────────────────────────────────────

export async function getKillStats(): Promise<{
  total: number;
  cleared: number;
  redRemaining: number;
}> {
  const today = getTodayISO();
  const cleared = await getStoreValue<string[]>(`kill_cleared:${today}`) || [];
  const all = await deriveKillList(); // Already filtered by cleared
  const redRemaining = all.filter(t => t.urgency === "RED").length;
  return {
    total: all.length + cleared.length,
    cleared: cleared.length,
    redRemaining,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────

function hashStr(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}
