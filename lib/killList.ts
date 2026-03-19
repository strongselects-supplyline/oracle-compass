// lib/killList.ts
// Dynamic Kill List — derives actionable tasks from current system state.
// Nothing is stored. Everything is computed. When you clear a task,
// it mutates the underlying data and the list re-derives.
//
// This is the action surface the Oracle has been missing.
// Built March 18, 2026.

import { getDailyLog, saveDailyLog, getStoreValue, setStoreValue, getTodayISO, DailyLog } from "@/lib/db";
import { getDynamicReleases, Release, updateContentDeliverables } from "@/lib/releases";
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
  action: () => Promise<void>;
};

// ── Derivation Engine ────────────────────────────────────────────────

export async function deriveKillList(): Promise<KillTask[]> {
  const tasks: KillTask[] = [];
  const today = getTodayISO();
  const dayType = getDayType();
  const hour = new Date().getHours();
  const weekKey = getWeekKey();

  const [dailyLog, releases, flags, sessions] = await Promise.all([
    getDailyLog(today),
    getDynamicReleases(),
    getStoreValue<OracleFlag[]>(`oracle_flags:${today}`),
    getStoreValue<number>(`weekly_sessions:${weekKey}`),
  ]);

  // ── 1. ORACLE FLAGS → Tasks ──────────────────────────────────────
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

  // ── 4 & 5. PER-RELEASE CHECKLIST (content + registrations + distribution) ──
  // Everything a song needs post-master, derived from the expanded ContentDeliverables.
  const now = new Date();
  for (const release of releases) {
    if (release.status === "live") continue;
    const releaseDate = new Date(release.releaseDate + "T00:00:00");
    const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / 86400000);
    if (daysUntil > 21 || daysUntil < -3) continue;

    const d = release.contentDeliverables;
    const t = release.title;
    const urg = (threshold: number): "RED" | "AMBER" | "GREEN" =>
      daysUntil <= threshold ? "RED" : daysUntil <= threshold + 4 ? "AMBER" : "GREEN";

    // Helper to create a simple toggle task
    const toggle = (
      id: string, field: keyof typeof d, title: string, subtitle: string,
      urgThreshold: number, pillar: "creative" | "ops" | "business", block: "any" | "content" | "biz" | "studio"
    ) => {
      if (d[field] === false) {
        tasks.push({
          id: `${id}-${t}`, title: `${title} — ${t}`, subtitle,
          urgency: urg(urgThreshold), pillar, timeBlock: block,
          action: async () => { await updateContentDeliverables(t, { [field]: true } as any); },
        });
      }
    };

    // ── PRODUCTION PREP (T-7) ──
    toggle("prep-swap", "variableSwapSheet", "Fill variable swap sheet", "Palette, photos, copy angle, hashtags", 7, "creative", "content");
    toggle("prep-photo", "sourcePhotoLocked", "Lock source photography", "Hero shot needed for Canvas, posts, and visualizer", 7, "creative", "content");
    toggle("prep-palette", "paletteExtracted", "Run palette extraction", "Open Sonnet session → extract from cover art", 6, "creative", "content");

    // ── CREATIVE ASSETS (T-6 to T-2) ──
    if (!d.visualIdea || d.visualIdea.trim().length === 0) {
      tasks.push({
        id: `content-visual-${t}`, title: `Lock visual idea — ${t}`,
        subtitle: "Creative direction must be set before any assets are built",
        urgency: urg(7), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { visualIdea: "(locked)" }); },
      });
    }
    toggle("asset-canvas", "spotifyCanvas", "Build Spotify Canvas", "720×1280 · 3–8s loop · After Effects (T-6)", 5, "creative", "content");
    toggle("asset-teaser", "prereleaseTeaser", "Build pre-release teaser", "1080×1920 ≤15s · IG/TikTok (T-5)", 5, "creative", "content");
    toggle("asset-story", "instagramStory", "Build Instagram Story", "1080×1920 · motion · After Effects (T-5)", 4, "creative", "content");
    toggle("asset-visualizer", "youtubeVisualizer", "Build YouTube visualizer", "1920×1080 · full track length · AE (T-5)", 4, "creative", "content");
    toggle("asset-announce", "announcementPost", "Build announcement post", "1080×1080 · Canva (T-4)", 4, "creative", "content");
    toggle("asset-thumb", "youtubeThumbnail", "Build YouTube thumbnail", "1280×720 PNG · Canva (T-4)", 3, "creative", "content");

    if (d.primaryVideo === "none" || d.primaryVideo === "planned") {
      tasks.push({
        id: `asset-video-${t}`, title: `${d.primaryVideo === "none" ? "Start" : "Shoot"} primary video — ${t}`,
        subtitle: "Highest-impact asset (25% of readiness score)",
        urgency: urg(5), pillar: "creative", timeBlock: "content",
        action: async () => {
          const next = d.primaryVideo === "none" ? "planned" : "shot";
          await updateContentDeliverables(t, { primaryVideo: next as any });
        },
      });
    }

    if (d.brollClips === 0) {
      tasks.push({
        id: `asset-broll-${t}`, title: `Capture B-roll — ${t}`,
        subtitle: "Zero clips — feeds reels and video",
        urgency: urg(7), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { brollClips: 1 }); },
      });
    }

    if (d.reelsPosted < Math.ceil(d.reelsGoal * 0.3)) {
      const needed = Math.ceil(d.reelsGoal * 0.3) - d.reelsPosted;
      tasks.push({
        id: `asset-reels-${t}`, title: `Post ${needed}+ reels — ${t}`,
        subtitle: `${d.reelsPosted}/${d.reelsGoal} posted — run CF4 --multi (T-3)`,
        urgency: urg(3), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { reelsPosted: d.reelsPosted + 1 }); },
      });
    }

    // ── CAPTIONS & SCHEDULING (T-2) ──
    toggle("post-captions", "captionsWritten", "Write all captions", "Use templates from Per-Song Playbook (T-2)", 2, "creative", "content");
    toggle("post-schedule", "postsScheduled", "Schedule all posts", "BTS → teaser → release day → reaction (T-2)", 2, "creative", "content");

    // ── DISTRIBUTION (T-2 to T-0) ──
    toggle("dist-amuse", "amuseUploaded", "Upload to Amuse", `48hr window — upload by ${release.uploadDate}`, 3, "ops", "any");
    toggle("dist-presave", "preSaveLive", "Pre-save link live in bio", "IG + TikTok bio → pre-save URL", 5, "ops", "any");
    toggle("dist-pitch", "spotifyPitchSubmitted", "Submit Spotify editorial pitch", "Spotify for Artists → Upcoming → Pitch", 7, "ops", "biz");
    if (daysUntil <= 0) {
      toggle("dist-verify", "streamingLinksVerified", "Verify streaming links", "Confirm live on Spotify + Apple Music", 0, "ops", "any");
    }

    // ── REGISTRATIONS ──
    toggle("reg-isrc", "isrcPulled", "Pull ISRC from Amuse", "Check confirmation email — needed for all registrations", 7, "ops", "biz");
    toggle("reg-ascap", "ascapRegistered", "Register on ASCAP", `ascap.com → Register Works${!d.isrcPulled ? " (needs ISRC first)" : ""}`, 5, "ops", "biz");
    toggle("reg-mlc", "mlcRegistered", "Register on MLC", `themlc.com${!d.isrcPulled ? " (needs ISRC first)" : ""}`, 5, "ops", "biz");
    toggle("reg-songtrust", "songtrustRegistered", "Register on Songtrust", `Verify login post-UMG${!d.isrcPulled ? " (needs ISRC)" : ""}`, 5, "ops", "biz");
    toggle("reg-musixmatch", "musixmatchSubmitted", "Submit lyrics to Musixmatch", "pro.musixmatch.com → submit lyrics", 3, "ops", "biz");
    toggle("reg-instrumental", "instrumentalRendered", "Render instrumental", "Required for sync licensing", 7, "ops", "studio");
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
        log.sessionQuality = 3;
        await saveDailyLog(log);
      },
    });
  }

  // ── 7. BUSINESS → Tasks (biz days, only after SS restart) ───────
  const ssRestart = new Date("2026-03-27T00:00:00");
  if (isBizDay(dayType) && now >= ssRestart) {
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

  // ── Filter by cleared ────────────────────────────────────────────
  const cleared = await getStoreValue<string[]>(`kill_cleared:${today}`) || [];
  const filtered = tasks.filter(t => !cleared.includes(t.id));

  // ── Sort: RED first, then AMBER, then GREEN ──────────────────────
  const urgencyOrder: Record<string, number> = { RED: 0, AMBER: 1, GREEN: 2 };
  filtered.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);

  return filtered;
}

// ── Task Completion ──────────────────────────────────────────────────

export async function completeTask(task: KillTask): Promise<void> {
  await task.action();
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
  const all = await deriveKillList();
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
