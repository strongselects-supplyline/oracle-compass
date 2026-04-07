// lib/killList.ts
// Dynamic Kill List — derives actionable tasks from current system state.
// Nothing is stored. Everything is computed. When you clear a task,
// it mutates the underlying data and the list re-derives.
//
// ADHD-first design: every task has plain language + step-by-step howTo.
// Built March 18, 2026. Rewritten March 19, 2026.

import { getDailyLog, saveDailyLog, getStoreValue, setStoreValue, getTodayISO, DailyLog, getDailyTelemetry, logTaskCompletion } from "@/lib/db";
import { getDynamicReleases, Release, updateContentDeliverables } from "@/lib/releases";
import { getDayType, isStudioDay, isBizDay } from "@/lib/dayType";
import { getWeekKey, OracleFlag } from "@/lib/oracle";
import { openApp, amusePartnerNote } from "@/lib/toolchain";
import { getTrackHoursSummaries } from "@/lib/studioLog";
import { getLedgerStats, getUntouched } from "@/lib/audienceLedger";

// ── Types ────────────────────────────────────────────────────────────

export type KillTask = {
  id: string;
  title: string;
  subtitle: string;
  howTo: string[];  // Step-by-step instructions — plain English, ADHD-friendly
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

  const [dailyLog, releases, flags, telemetry] = await Promise.all([
    getDailyLog(today),
    getDynamicReleases(),
    getStoreValue<OracleFlag[]>(`oracle_flags:${today}`),
    getDailyTelemetry()
  ]);

  // ── 1. ORACLE FLAGS → Tasks ──────────────────────────────────────
  if (flags && flags.length > 0) {
    for (const flag of flags) {
      tasks.push({
        id: `flag-${hashStr(flag.action)}`,
        title: flag.action,
        subtitle: flag.reason,
        howTo: ["This is a direct order from the Oracle based on your current state.", "Read the action above and do exactly what it says.", "Tap ✓ when done."],
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

  // ── 1.5 IG COMMUNITY SPRINT (BIZ DAY only — Phase 2, Apr 25+) ──────────
  if (isBizDay(dayType)) {
    try {
      const igSprintKey = `ig_sprint_clear:${today}`;
      const igSprintDone = await getStoreValue<boolean>(igSprintKey);
      if (!igSprintDone) {
        const [ledgerStats, untouched] = await Promise.all([
          getLedgerStats(),
          getUntouched('T4'),
        ]);
        const nextArtist = untouched[0];
        const hasData = ledgerStats.totalFans > 0 || ledgerStats.verifiedArtists > 0;
        tasks.push({
          id: 'ig-community-sprint',
          title: 'IG Community Sprint — 20 min',
          subtitle: hasData
            ? `${ledgerStats.verifiedArtists} artists · ${ledgerStats.totalFans} fans · ${ledgerStats.citiesReached} cities · ${ledgerStats.totalCommunities} community nodes`
            : 'Audience ledger is empty. Start building it — Sprint Terminal at /geo/sprint.',
          howTo: [
            nextArtist
              ? `Start with: ${nextArtist.name} (${nextArtist.tier} — ${nextArtist.tracks.join(', ')})`
              : 'Open /geo/sprint — Sprint Queue shows your next targets.',
            'Search each artist on IG. Verify handle + city from their bio. Log in Sprint Terminal.',
            'Scroll their posts. Comment genuinely. Like 2-3. Be present in the community.',
            'Open active commenters → public profiles. Note: handle, name, city, snap/contact if visible.',
            'Check their reposts and engagement → note community pages they interact with.',
            'Check tagged posts → adjacent friend networks → add high-signal profiles.',
            'Work T4 first, then T3. T1/T2 pages are for finding watering holes — not for DMs.',
            'Target depth over breadth — 2-3 artist pages fully traversed beats 15 surface hits.',
            'Log everything in the Sprint Terminal at /geo/sprint after the block.',
            'Tap ✓ when done. One block per BIZ DAY. 20 min hard cap.',
          ],
          urgency: !hasData ? 'RED' : 'AMBER',
          pillar: 'business',
          timeBlock: 'biz',
          action: async () => { await setStoreValue(igSprintKey, true); },
        });
      }
    } catch (_e) {
      // Silence if ledger unavailable
    }
  }

  // ── 2. FUEL → Tasks ──────────────────────────────────────────────
  if (isStudioDay(dayType as any)) {
    if (!dailyLog.fuelPreSession && hour < 16) {
      tasks.push({
        id: "fuel-pre",
        title: "Eat before your session",
        subtitle: hour >= 10
          ? "You're working with no food — energy crash is coming"
          : "Eat something real before you start at 10AM",
        howTo: [
          "Make or order a meal with protein + carbs (eggs, oatmeal, rice, etc.)",
          "Avoid dairy if you're recording vocals today",
          "Eat at least 30 min before singing",
          "Tap ✓ after you've eaten",
        ],
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
        title: "Eat your mid-session meal",
        subtitle: "You need fuel to sustain output through hour 4-6",
        howTo: [
          "Take a 15-20 min break from the DAW",
          "Eat something substantial — not just a snack",
          "Hydrate while you're at it",
          "Tap ✓ after you've eaten",
        ],
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
        title: "Eat your recovery meal",
        subtitle: "Post-session nutrition — replenish after the creative block",
        howTo: [
          "Session's over — your body needs fuel to recover",
          "High protein meal (chicken, fish, eggs, etc.)",
          "This prevents the crash that kills your evening productivity",
          "Tap ✓ after you've eaten",
        ],
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
        title: "Drink more water",
        subtitle: dailyLog.sessionType === "recording"
          ? "Dry vocal cords = bad takes. Hydrate now."
          : "Low water intake kills focus and energy",
        howTo: [
          "Fill a water bottle right now",
          "Goal: at least 3 bottles today (about 1 gallon)",
          "Rate your hydration on the Log tab when you're caught up",
          "Tap ✓ once you've had a full bottle",
        ],
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

  // ── 2.5 DAY ONE GUARDRAILS & MUDRA SYSTEM ────────────────────────
  if (!dailyLog.proteinAtMeals && hour >= 12 && hour < 20) {
    tasks.push({
      id: "dayone-protein",
      title: "Check your protein intake today",
      subtitle: "Tyrosine is the dopamine precursor. Building blocks.",
      howTo: [
        "Protein at every meal is a Day One protocol rule.",
        "Eat a high protein source with your next meal.",
        "Tap ✓ if you've hit your protein goals so far today.",
      ],
      urgency: hour >= 14 ? "AMBER" : "GREEN",
      pillar: "body",
      timeBlock: "any",
      action: async () => {
        const log = await getDailyLog(today);
        log.proteinAtMeals = true;
        await saveDailyLog(log);
      },
    });
  }

  if (!dailyLog.caffeineCutoff && hour >= 13) {
    tasks.push({
      id: "dayone-caffeine",
      title: "Cut caffeine for the day",
      subtitle: "Protect sleep architecture. No caffeine past 1 PM.",
      howTo: [
        "Switch to water, herbal tea, or decaf only.",
        "Caffeine half-life is 5-6 hours.",
        "Tap ✓ to confirm you are done with caffeine today.",
      ],
      urgency: hour >= 14 ? "RED" : "AMBER",
      pillar: "body",
      timeBlock: "any",
      action: async () => {
        const log = await getDailyLog(today);
        log.caffeineCutoff = true;
        await saveDailyLog(log);
      },
    });
  }

  if (!dailyLog.trataka && hour >= 21) {
    tasks.push({
      id: "dayone-trataka",
      title: "Trataka (Candle Gazing)",
      subtitle: "Downregulate your nervous system before sleep.",
      howTo: [
        "Light a candle. Turn off all other lights.",
        "Stare at the flame without blinking until eyes water slightly.",
        "Close eyes and focus on the after-image at your third eye.",
        "Do this for 5-10 minutes.",
      ],
      urgency: hour >= 22 ? "RED" : "AMBER",
      pillar: "body",
      timeBlock: "evening",
      action: async () => {
        const log = await getDailyLog(today);
        log.trataka = true;
        await saveDailyLog(log);
      },
    });
  }

  const viceCheckKey = `vice_clear:${today}`;
  const viceCleared = await getStoreValue(viceCheckKey);
  if (!viceCleared) {
      tasks.push({
        id: "dayone-vice",
        title: "Vice Management: Boredom / Cravings Check",
        subtitle: "Permanent guardrail: Is the builder vice or craving spiking?",
        howTo: [
            "If you are feeling a craving (weed, porn) or a spike in boredom:",
            "Go to the sauna immediately — forced stillness.",
            "OR sit in the living room for 10 minutes doing absolutely nothing.",
            "Do not engineer a dashboard to avoid the feeling.",
            "Tap ✓ only if you successfully sat through the spike."
        ],
        urgency: "AMBER",
        pillar: "body",
        timeBlock: "any",
        action: async () => { await setStoreValue(viceCheckKey, true); },
      });
  }

  if (isStudioDay(dayType as any) && hour < 10) {
    const mudraFlowKey = `mudra_flow_clear:${today}`;
    const mudraFlowCleared = await getStoreValue(mudraFlowKey);
    if (!mudraFlowCleared) {
        tasks.push({
            id: "mudra-flow",
            title: "Pre-Session Flow Trigger (Jnana Mudra)",
            subtitle: "Clear mental weather before opening the DAW.",
            howTo: [
                "Sit with spine tall. Touch index to thumb (Jnana Mudra).",
                "Palms up on knees.",
                "Run Nadi Shodhana (Alternate Nostril Breathing) for 5 rounds.",
                "Activate right hemisphere. Do not open DAW until shifted.",
                "Tap ✓ when clear and ready."
            ],
            urgency: hour >= 9 ? "RED" : "AMBER",
            pillar: "creative",
            timeBlock: "studio",
            action: async () => { await setStoreValue(mudraFlowKey, true); },
        });
    }
  }

  // ── 2.7 "ITS ALL LOVE" CONTENT SPRINT (22-Day Protocol) ──────────
  // Dynamic phase task based on days until Apr 24 EP drop.
  const epDropDate = new Date("2026-04-24T00:00:00");
  const daysToEpDrop = Math.ceil((epDropDate.getTime() - new Date().getTime()) / 86400000);
  const contentSprKey = `content_sprint_clear:${today}`;
  const contentSprintCleared = await getStoreValue(contentSprKey);

  if (!contentSprintCleared && daysToEpDrop >= 0 && daysToEpDrop <= 22) {
    if (daysToEpDrop > 10) {
      // Phase 1: Ambient Awareness (Apr 2-13)
      tasks.push({
        id: "content-sprint-phase1",
        title: "Post \"Its All Love\" sip video",
        subtitle: `Phase 1: Ambient Awareness. ${daysToEpDrop} days to EP. Own the phrase.`,
        howTo: [
          "White tee, glasses, mug of tea.",
          "Setup → drop a 4K observation → sip → \"But it's all love.\"",
          "Embed sub-frequency audio layer underneath softly.",
          "EP snippet playing underneath softly.",
          "Point. Shoot. Sip. Post. No editing required.",
        ],
        urgency: "RED" as const,
        pillar: "creative" as const,
        timeBlock: "content" as const,
        action: async () => { await setStoreValue(contentSprKey, true); },
      });
    } else if (daysToEpDrop === 10) {
      // Phase 2: 414 Day (Apr 14)
      tasks.push({
        id: "content-sprint-phase2",
        title: "414 Day content shift — ESL + Milwaukee",
        subtitle: "Phase 2: ESL drops today. Content pivots to the city.",
        howTo: [
          "Post BTS of ESL creation + Milwaukee-specific content.",
          "\"Its All Love\" video that references the city.",
          "One post: \"Happy 414. This one's for the city.\" + link.",
          "3-4 pieces of content today. This is the hometown statement.",
        ],
        urgency: "RED" as const,
        pillar: "creative" as const,
        timeBlock: "content" as const,
        action: async () => { await setStoreValue(contentSprKey, true); },
      });
    } else if (daysToEpDrop > 0) {
      // Phase 3: EP Countdown (Apr 15-23)
      tasks.push({
        id: "content-sprint-phase3",
        title: `EP Countdown content (${daysToEpDrop}d left)`,
        subtitle: "Phase 3: Accelerate. 2 videos + 15s mix preview from DAW.",
        howTo: [
          "1-2 \"Its All Love\" sip videos today.",
          "Record a 15-second mix preview from a different EP track.",
          "Short studio session clip — just you in the booth, music playing.",
          "The frequency of posts teaches the algorithm you're about to drop.",
        ],
        urgency: "RED" as const,
        pillar: "creative" as const,
        timeBlock: "content" as const,
        action: async () => { await setStoreValue(contentSprKey, true); },
      });
    } else {
      // Phase 4: Drop Day (Apr 24)
      tasks.push({
        id: "content-sprint-phase4",
        title: "DROP DAY — ALL LOVE EP is here.",
        subtitle: "Phase 4: Morning resolution, midday announce, evening live.",
        howTo: [
          "MORNING: Final \"Its All Love\" video — \"...but it's ALL LOVE. Out now.\"",
          "MIDDAY: Full EP announcement post.",
          "EVENING: Go live or post a longer-form reaction/listen-along.",
          "This is the day. Execute the 3-post stack.",
        ],
        urgency: "RED" as const,
        pillar: "creative" as const,
        timeBlock: "content" as const,
        action: async () => { await setStoreValue(contentSprKey, true); },
      });
    }
  }

  // ── 3. GRIND → Tasks ─────────────────────────────────────────────
  if (!dailyLog.sovereigntyStack) {
    tasks.push({
      id: "grind-stack",
      title: "Complete your Sovereignty Stack",
      subtitle: "Foundation of the day. Non-negotiable.",
      howTo: [
        "Trataka (candle gazing) — 3-5 minutes",
        "Breathwork — Nadi Shodhana or box breathing",
        "Mullein tea — brew and drink",
        "Cold shower — finish your shower cold for 30+ seconds",
        "Go to the Log tab and check the box when done",
      ],
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
      title: "Move your body before working",
      subtitle: "Physical activation before creative work",
      howTo: [
        "Choose one: lift, run, bodyweight circuit, or deep stretch",
        "Minimum 20 minutes — you need to sweat",
        "Do this BEFORE opening the DAW or laptop",
        "Log pushups on the Log tab if applicable",
      ],
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

  // ── 4 & 5. PER-RELEASE CHECKLIST ─────────────────────────────────
  const now = new Date();
  for (const release of releases) {
    if (release.status === "live") continue;
    const releaseDate = new Date(release.releaseDate + "T00:00:00");
    const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / 86400000);
    if (daysUntil > 21 || daysUntil < -14) continue;

    const d = release.contentDeliverables;
    const t = release.title;
    const urg = (threshold: number): "RED" | "AMBER" | "GREEN" =>
      daysUntil <= threshold ? "RED" : daysUntil <= threshold + 4 ? "AMBER" : "GREEN";

    // Helper to create a toggle task with howTo instructions
    const toggle = (
      id: string, field: keyof typeof d, title: string, subtitle: string,
      howTo: string[],
      urgThreshold: number, pillar: "creative" | "ops" | "business", block: "any" | "content" | "biz" | "studio"
    ) => {
      if (d[field] === false) {
        tasks.push({
          id: `${id}-${t}`, title: `${title} — ${t}`, subtitle, howTo,
          urgency: urg(urgThreshold), pillar, timeBlock: block,
          action: async () => { await updateContentDeliverables(t, { [field]: true } as any); },
        });
      }
    };

    // ── PRODUCTION PREP (T-7) ──
    toggle("prep-swap", "variableSwapSheet", "Create promo kit", "Gather all the info you need to promote this song", [
      "Open a note (Notes app, Google Doc, or paper)",
      "Write: song title, release date, and 3-5 hashtags",
      "Write a 1-sentence pitch for the song (what's it about?)",
      "Pick 2-3 photos from your camera roll to use in posts",
      "Screenshot the album art and note the main colors",
      "Save this note — you'll reference it for every post and caption",
    ], 7, "creative", "content");

    toggle("prep-photo", "sourcePhotoLocked", "Pick your hero photo", "Choose the main photo for all posts, Canvas, and video", [
      "Open your camera roll or recent photo shoots",
      "Pick ONE strong photo that matches the song's vibe",
      "This photo will be used on: Spotify Canvas, IG posts, YouTube thumbnail",
      "Save/star it so you can find it easily later",
    ], 7, "creative", "content");

    toggle("prep-palette", "paletteExtracted", "Choose color palette from cover art", "Pull 3-5 colors from the album art to use in all visual assets", [
      "Open the album/single cover art on your phone",
      "Screenshot it",
      "Open Canva or any color picker tool",
      "Use the eyedropper to grab 3-5 colors from the art",
      "Note the hex codes (e.g., #FF5500) or just save swatches",
      "These colors go on EVERYTHING: Canvas, posts, stories, visualizer",
    ], 6, "creative", "content");

    // ── CREATIVE ASSETS (T-6 to T-2) ──
    if (!d.visualIdea || d.visualIdea.trim().length === 0) {
      tasks.push({
        id: `content-visual-${t}`, title: `Decide the visual direction — ${t}`,
        subtitle: "What should the content look and feel like?",
        howTo: [
          "Think: what's the mood of this song? Dark? Energetic? Emotional?",
          "Pick a visual style: cinematic, gritty, colorful, minimal, etc.",
          "Write 1-2 sentences describing the look (e.g., 'moody blue lighting, close-up shots, slow motion')",
          "This guides every asset you build — Canvas, reels, video, posts",
        ],
        urgency: urg(7), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { visualIdea: "(locked)" }); },
      });
    }

    toggle("asset-canvas", "spotifyCanvas", "Make Spotify Canvas (looping video)", "The short video that plays on the Spotify Now Playing screen", [
      openApp("afterEffects") + " or CapCut",
      "Size: 720 wide × 1280 tall (vertical/portrait)",
      "Make a 3-8 second seamless loop — use your hero photo or a clip",
      "Add subtle motion: slow zoom, color shift, particles, etc.",
      "Export as MP4, keep it under 8MB",
      "Upload: Spotify for Artists → Music → select track → Canvas → Upload",
    ], 5, "creative", "content");

    toggle("asset-teaser", "prereleaseTeaser", "Make 15-second teaser clip", "Short hype clip for IG Reels and TikTok before release day", [
      openApp("capcut") + " or After Effects",
      "Size: 1080 × 1920 (vertical)",
      "Max 15 seconds — use the catchiest part of the song",
      "Add text: song title + release date",
      "Use your color palette from earlier",
      "Post to IG Reels and TikTok with 'drops [date]' caption",
    ], 5, "creative", "content");

    toggle("asset-story", "instagramStory", "Make Instagram Story announcement", "Animated story for release day or pre-release hype", [
      openApp("afterEffects") + " or Instagram directly",
      "Size: 1080 × 1920 (full screen vertical)",
      "Add: album art, song title, 'OUT NOW' or 'drops [date]'",
      "Add motion — even a simple fade or slide works",
      "Save to camera roll and post to IG Stories",
    ], 4, "creative", "content");

    toggle("asset-visualizer", "youtubeVisualizer", "Make YouTube visualizer", "Full-length audio visualizer video for YouTube", [
      openApp("afterEffects") + " (or use the Synesthesia Visualizer tool)",
      "Size: 1920 × 1080 (landscape)",
      "Duration: full track length",
      "Add: waveform/spectrum animation + album art + song info",
      "Export as MP4, upload to YouTube with proper title and description",
    ], 4, "creative", "content");

    toggle("asset-announce", "announcementPost", "Make announcement post", "The main feed post announcing the release", [
      openApp("godaddy") + " or " + openApp("photoshop"),
      "Size: 1080 × 1080 (square) for IG feed",
      "Use your hero photo + color palette",
      "Add: song title, release date, 'PRE-SAVE LINK IN BIO'",
      "Keep it clean — this is the first impression",
    ], 4, "creative", "content");

    toggle("asset-thumb", "youtubeThumbnail", "Make YouTube thumbnail", "The clickable thumbnail image for the YouTube upload", [
      openApp("photoshop"),
      "Size: 1280 × 720 (landscape)",
      "Use your hero photo, make the text BIG and readable",
      "Include song title — keep it to 3-4 words max on screen",
      "Export as PNG (not JPG — crisper quality)",
    ], 3, "creative", "content");

    if (d.primaryVideo === "none" || d.primaryVideo === "planned") {
      tasks.push({
        id: `asset-video-${t}`,
        title: `${d.primaryVideo === "none" ? "Plan" : "Shoot"} the music video — ${t}`,
        subtitle: "Highest-impact visual asset",
        howTo: d.primaryVideo === "none" ? [
          "Decide: full music video, performance video, or lyric video?",
          "Pick locations — where will you shoot?",
          "Plan outfits and any props",
          "Set a shoot date on your calendar",
          "Tap ✓ when you have a plan locked in",
        ] : [
          "Execute your video plan — grab your phone or camera",
          "Shoot at least 2-3 different locations or setups",
          "Get more footage than you think you need",
          "Transfer files to your editing computer when done",
          "Tap ✓ when footage is captured",
        ],
        urgency: urg(5), pillar: "creative", timeBlock: "content",
        action: async () => {
          const next = d.primaryVideo === "none" ? "planned" : "shot";
          await updateContentDeliverables(t, { primaryVideo: next as any });
        },
      });
    }

    if (d.brollClips === 0) {
      tasks.push({
        id: `asset-broll-${t}`, title: `Film B-roll clips — ${t}`,
        subtitle: "Behind-the-scenes footage for reels and video",
        howTo: [
          "Use your phone — quality doesn't need to be perfect",
          "Film: studio setup, mixing, headphones on, vibing to the beat",
          "Get 5-10 clips, 5-15 seconds each",
          "Variety: close-ups, wide shots, hands on keyboard, screen recordings",
          "These feed into reels, TikToks, and the music video",
        ],
        urgency: urg(7), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { brollClips: 1 }); },
      });
    }

    if (d.reelsPosted < Math.ceil(d.reelsGoal * 0.3)) {
      const needed = Math.ceil(d.reelsGoal * 0.3) - d.reelsPosted;
      tasks.push({
        id: `asset-reels-${t}`, title: `Post ${needed}+ reels — ${t}`,
        subtitle: `${d.reelsPosted}/${d.reelsGoal} posted so far`,
        howTo: [
          openApp("capcut") + " or IG Reels editor",
          "If using a long video, " + openApp("opusclip") + " to auto-extract hooks",
          "Use your B-roll clips or screen recordings",
          "Add a snippet of the song as audio",
          "Keep it 7-15 seconds, hook in the first 2 seconds",
          "Post to IG Reels AND TikTok (cross-post saves time)",
          `You need ${needed} more to stay on pace`,
        ],
        urgency: urg(3), pillar: "creative", timeBlock: "content",
        action: async () => { await updateContentDeliverables(t, { reelsPosted: d.reelsPosted + 1 }); },
      });
    }

    // ── CAPTIONS & SCHEDULING (T-2) ──
    toggle("post-captions", "captionsWritten", "Write all your captions", "Write the text for every post you'll make for this release", [
      "Open Notes or a Google Doc",
      "Write captions for: teaser post, announcement post, release day post, follow-up post",
      "Include your pitch line from the promo kit",
      "Add hashtags (from your promo kit) to each caption",
      "Save — you'll copy-paste these when you schedule posts",
    ], 2, "creative", "content");

    toggle("post-schedule", "postsScheduled", "Schedule all posts", "Load everything into Later, Buffer, or post manually on a schedule", [
      "Open your scheduling tool (Later, Buffer, or calendar reminders)",
      "Schedule: BTS reel (T-3), teaser (T-2), announcement (T-1), release day post (T-0)",
      "Add your pre-written captions to each",
      "Double-check dates and times (post between 11AM-1PM or 6PM-9PM)",
      "If no scheduling tool: set phone alarms for each post time",
    ], 2, "creative", "content");

    // ── DISTRIBUTION (T-2 to T-0) ──
    toggle("dist-amuse", "amuseUploaded", "Upload song to Amuse", `Must be uploaded by ${release.uploadDate} (8-day review window)`, [
      "Open the Amuse app on your phone",
      "Tap '+' to start a new release",
      "Upload the final master WAV/MP3 + album art",
      "Fill in: title, artist, genre, release date",
      "Submit — you'll get your ISRC from the distribution confirmation",
    ], 3, "ops", "any");

    toggle("dist-presave", "preSaveLive", "Put pre-save link in your bio", "Fans can save the song before it drops", [
      "Get your pre-save link from Amuse or Linkfire",
      "If you don't have one: use linktr.ee or a Linkin.bio page",
      "Open Instagram → Edit Profile → Website → paste the link",
      "Open TikTok → Edit Profile → Website → paste the link",
      "Mention 'link in bio' in your next post/story",
    ], 5, "ops", "any");

    toggle("dist-pitch", "spotifyPitchSubmitted", "Pitch song to Spotify editors", "Submit for editorial playlist consideration", [
      "Open Spotify for Artists (app or website)",
      "Go to Music → select the upcoming release",
      "Tap 'Pitch a song'",
      "Fill in: genre, mood, instruments, culture, song description",
      "Write 2-3 sentences about why this song matters",
      "Must submit at least 7 days before release to lock Release Radar",
    ], 10, "ops", "biz");

    if (daysUntil <= 0) {
      toggle("dist-verify", "streamingLinksVerified", "Check that the song is actually live", "Verify it's on Spotify and Apple Music", [
        "Open Spotify and search for the song by title",
        "Open Apple Music and search for it there too",
        "Click play — make sure the audio is correct",
        "If it's not showing up, check your Amuse app or amuse.io for distribution errors",
        "Share the links to your socials once confirmed",
      ], 0, "ops", "any");
    }

    // ── GROWTH & PROM0 (MULTIPLIER ENGINE) ──
    toggle("growth-groover", "grooverPitchesSent", "Pitch to curators on Groover", "Guaranteed feedback and playlist consideration", [
      openApp("groover"),
      amusePartnerNote("groover"),
      "Use the Copy Vault in Label OS to generate your 1-liner pitch",
      "Blast to 20 carefully selected curators",
    ], 7, "business", "biz");

    toggle("growth-songtools", "songtoolsCampaignLive", "Launch SongTools ad campaign", "Drive immediate traffic for algorithmic priming", [
      openApp("songtools"),
      amusePartnerNote("songtools"),
      "Deploy $50-$100 on release day to run IG/TikTok promos",
      "This forces Spotify's Release Radar to trigger locally",
    ], 0, "business", "biz");

    if (daysUntil <= -7) {
      toggle("growth-unhurd", "unhurdDataLogged", "Log audience intel from un:hurd", "Track demographics for the Z-to-A flywheel", [
        openApp("unhurd"),
        "Load the performance data from the first week of release",
        "Note strictly *who* is saving the track (age/geo)",
        "Feed this data back into the Label OS for future PR copy",
      ], -7, "business", "biz");
    }

    // get-isrc + all registrations: surface AFTER release only — a live ISRC is required
    if (daysUntil <= 0) {
      toggle("reg-isrc", "isrcPulled", "Get your ISRC code", "Unique tracking code — needed for ASCAP, MLC, Songtrust registration", [
        "Open Amuse app → Library → select the release",
        "The ISRC code looks like: US-XX1-23-45678",
        "Copy this code — paste it into ASCAP, MLC, and Songtrust",
        "Registration opens only after the song is live",
      ], -1, "ops", "biz");

      toggle("reg-ascap", "ascapRegistered", "Register song on ASCAP", `Collects your performance royalties${!d.isrcPulled ? " (get ISRC code first ↑)" : ""}`, [
        "Go to ascap.com and log in",
        "Click 'Register a Work' or 'Add Work'",
        "Enter: song title, your name as writer/publisher, ISRC code",
        "Set ownership split (100% if you're the only writer)",
        "Submit — ASCAP will confirm via email",
      ], -4, "ops", "biz");

      toggle("reg-mlc", "mlcRegistered", "Register song on MLC", `Collects mechanical royalties from streaming${!d.isrcPulled ? " (get ISRC code first ↑)" : ""}`, [
        "Go to themlc.com and log in",
        "Click 'Register Works' or 'Add a Work'",
        "Enter: song title, ISRC code, your info",
        "This captures royalties ASCAP doesn't cover",
        "Submit and confirm",
      ], -4, "ops", "biz");

      toggle("reg-songtrust", "songtrustRegistered", "Register song on Songtrust", `International royalty collection${!d.isrcPulled ? " (get ISRC code first ↑)" : ""}`, [
        "Go to songtrust.com and log in",
        "If you can't log in: check if account transferred during UMG changes",
        "Add the new song with title and ISRC",
        "Songtrust handles royalty collection in 60+ countries",
      ], -4, "ops", "biz");
    }

    toggle("reg-musixmatch", "musixmatchSubmitted", "Submit lyrics to Musixmatch", "Gets your lyrics to show on Spotify, Apple Music, etc.", [
      "Search for your song (may take 1-2 days after release to appear)",
      "Click the song and 'Submit Lyrics'",
      "Paste your full lyrics — double-check timing if doing synced lyrics",
      "Submit for review",
    ], 3, "ops", "biz");

    // ── CORE DRIVE PIPELINE (per single — 3-encode algorithmic exploit) ──
    if (daysUntil <= 14 && daysUntil >= -7) {
      // Task 0: New Age Mastering Quality Control (Transcript Protocol)
      if (!d.masteringVerified) {
        tasks.push({
          id: `mastering-qc-${t}`,
          title: `New Age Mastering QC — ${t}`,
          subtitle: `Verify protocol: -18dBFS peaks, +3.5dB side boost, and "Depth Cut".`,
          howTo: [
            "PEAK: Ensure master hits analog gear at -18dBFS peak for the sweet spot.",
            "SIDES: Apply +3.5dB shelf/boost on sides @ 120-140Hz for 3D width.",
            "SIGNATURE: Apply 'Depth Cut' (creative saturation/dirt) if the vibe needs it.",
            "LOUDNESS: Target -14 LUFS (Spotify optimized) — don't over-smash.",
            "Tap ✓ once audio is locked and exported for distribution.",
          ],
          urgency: daysUntil <= 8 ? "RED" : "AMBER",
          pillar: "creative",
          timeBlock: "studio",
          action: async () => {
            await updateContentDeliverables(t, { masteringVerified: true } as any);
          },
        });
      }

      // Task 1: Run Core Drive Matrix
      if (!d.coreDriveComplete) {
        tasks.push({
          id: `coredrive-${t}`,
          title: `Run Core Drive — ${t}`,
          subtitle: `3 encodes × 20 playlists + 10 direct matches = your targeting blueprint.`,
          howTo: [
            "ENCODE: Export your final master as .wav (already have it)",
            "CYANITE: Upload the master to cyanite.ai → run Playlist Similarity Search → copy all ~20 playlist links",
            "Repeat with a YouTube-compressed encode (128k AAC) and paste those ~20 links",
            "Grab the 10 direct track matches from Cyanite's Spotify search (artist - track format)",
            "ANTIGRAVITY: Paste everything into core-drive-builder/input/[track].txt under # MASTER, # YOUTUBE, # SPOTIFY headers",
            "RUN: node index.mjs --input input/[track].txt --track \"" + t + "\"",
            "Output lands in core-drive-builder/output/ — JSON + Markdown in 6 seconds",
          ],
          urgency: daysUntil <= 3 ? "RED" : "AMBER",
          pillar: "business",
          timeBlock: "content",
          action: async () => {
            await updateContentDeliverables(t, { coreDriveComplete: true });
          },
        });
      }

      // Task 1.5: Execute Gorilla Geo Pipeline
      if (d.coreDriveComplete && !d.gorillaGeoComplete) {
        tasks.push({
          id: `gorillageo-${t}`,
          title: `Execute Gorilla Geo — ${t}`,
          subtitle: `Tier classification and geographic arbitrage for ${t}.`,
          howTo: [
            "Open Gorilla Geo terminal/tab.",
            "Input the Core Drive playlist links curated for this release.",
            "Run tier classification to identify 'Void' vs 'Groove' targets.",
            "This identifies the high-ROI locations for your campaign launch.",
            "Tap ✓ once geographic targets are saved to the campaign doc.",
          ],
          urgency: daysUntil <= 5 ? "RED" : "AMBER",
          pillar: "business",
          timeBlock: "biz",
          action: async () => {
             await updateContentDeliverables(t, { gorillaGeoComplete: true } as any);
          },
        });
      }

      // Task 2: Generate Campaign Kit (only after Core Drive is complete)
      if (d.coreDriveComplete && !d.campaignKitGenerated) {
        tasks.push({
          id: `campaign-kit-${t}`,
          title: `Generate campaign kit — ${t}`,
          subtitle: `Run the 4-agent refinement pipeline on your Core Drive output.`,
          howTo: [
            "Hand the Core Drive markdown to Antigravity or Claude",
            "Run 4-agent pipeline: Data Analyst → Brand Strategist → Cultural Critic → ECD",
            "Output: 3 Meta Ad clusters, TikTok hooks, YouTube SEO, curator pitches",
            "Deploy ads using the 3-cluster targeting (Void / Groove / Surge)",
            "See .agents/workflows/campaign-refinement.md for the full protocol",
          ],
          urgency: daysUntil <= 0 ? "RED" : "AMBER",
          pillar: "business",
          timeBlock: "biz",
          action: async () => {
            await updateContentDeliverables(t, { campaignKitGenerated: true });
          },
        });
      }
    }

    // Instrumental rendering handled separately in section 10 (all tracks, no timeline gate)
  }

  // ── 6. SESSION → Tasks ───────────────────────────────────────────
  if (isStudioDay(dayType as any) && dailyLog.sessionQuality === null && hour >= 16) {
    tasks.push({
      id: "session-quality",
      title: "Rate today's session quality",
      subtitle: "The Oracle needs this data to track your creative output",
      howTo: [
        "Think: how productive was today's session? 1-5 scale",
        "Go to the Log tab",
        "Rate your session quality honestly",
        "This feeds into the Oracle's severity calculation",
      ],
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

  // ── 7. BUSINESS → Tasks (biz days only) ───────────────────────
  if (isBizDay(dayType)) {
    const move = await getStoreValue<string>("engine_daily_move");
    if (!move || move.trim().length === 0) {
      tasks.push({
        id: "biz-move",
        title: "Decide your one business move today",
        subtitle: "It's a biz day — pick one concrete pipeline action",
        howTo: [
          "Open the Engine tab",
          "Pick ONE thing: outreach email, follow-up, content pitch, etc.",
          "Write it down and commit to it",
          "Do it before end of day",
        ],
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
        title: `Do outreach: ${touches || 0}/${target} touches this week`,
        subtitle: "Below 50% by midweek — you'll fall behind",
        howTo: [
          "Open your outreach list (DMs, emails, contacts)",
          "Send 3-5 messages: introduce yourself, pitch a collab, follow up",
          "Each message = 1 touch. Log them in the Engine tab",
          "Quality over quantity — personalize each message",
        ],
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

  // ── 8. FAN CAPTURE INFRASTRUCTURE ────────────────────────────────
  const linktreeSetup = await getStoreValue<boolean>("fan_capture_linktree");
  const mailchimpSetup = await getStoreValue<boolean>("fan_capture_mailchimp");

  if (!linktreeSetup) {
    tasks.push({
      id: "fan-linktree",
      title: "Set up Linktree",
      subtitle: "20 minutes. You have zero owned audience right now.",
      howTo: [
        "Go to linktr.ee and sign up (free tier)",
        "Add links: Spotify, Apple Music, YouTube, Pre-save for next single",
        "Add an email signup link (connect to Mailchimp after that's set up)",
        "Copy your Linktree URL",
        "Paste into Instagram bio and TikTok bio",
        "This is your single hub — every CTA in every post points here",
      ],
      urgency: "RED",
      pillar: "business",
      timeBlock: "any",
      action: async () => { await setStoreValue("fan_capture_linktree", true); },
    });
  }

  if (!mailchimpSetup) {
    tasks.push({
      id: "fan-mailchimp",
      title: "Set up Mailchimp email list",
      subtitle: "Free tier. Start capturing fans you OWN.",
      howTo: [
        "Go to mailchimp.com and create a free account",
        "Create an audience/list called 'past.El Fans'",
        "Create a simple signup form (Mailchimp generates one automatically)",
        "Copy the signup form link",
        "Add it to your Linktree as 'Join the list'",
        "Every post, every story — mention the list. Own your audience.",
      ],
      urgency: "RED",
      pillar: "business",
      timeBlock: "any",
      action: async () => { await setStoreValue("fan_capture_mailchimp", true); },
    });
  }

  // ── 9. 414 DAY PREP (Apr 14, 2026) ──────────────────────────────
  const fourteenDayDate = new Date("2026-04-14T00:00:00");
  const daysUntil414 = Math.ceil((fourteenDayDate.getTime() - now.getTime()) / 86400000);

  if (daysUntil414 >= 0 && daysUntil414 <= 30) {
    const live414Urg = (threshold: number): "RED" | "AMBER" | "GREEN" =>
      daysUntil414 <= threshold ? "RED" : daysUntil414 <= threshold + 7 ? "AMBER" : "GREEN";

    const setlistLocked = await getStoreValue<boolean>("414day_setlist_locked");
    const rehearsal1 = await getStoreValue<boolean>("414day_rehearsal_1");
    const rehearsal2 = await getStoreValue<boolean>("414day_rehearsal_2");
    const gearChecked = await getStoreValue<boolean>("414day_gear_checked");
    const contentCapturePlan = await getStoreValue<boolean>("414day_content_capture_plan");
    const synesthesiaTested = await getStoreValue<boolean>("414day_synesthesia_tested");

    if (!setlistLocked) {
      tasks.push({
        id: "414-setlist",
        title: "Lock 414 Day setlist",
        subtitle: `${daysUntil414} days until performance. 20-minute set.`,
        howTo: [
          "Pick 5-6 songs from ALL LOVE that flow well live",
          "Order them: opener (energy), 2-3 mid songs, closer (biggest hit)",
          "Time it — must fit in 20 minutes including transitions",
          "Write it down. No changes after this is locked.",
          "Consider: this is 3 days BEFORE album drop — tease unreleased tracks?",
        ],
        urgency: live414Urg(14),
        pillar: "creative",
        timeBlock: "any",
        action: async () => { await setStoreValue("414day_setlist_locked", true); },
      });
    }

    if (setlistLocked && !rehearsal1) {
      tasks.push({
        id: "414-rehearsal1",
        title: "414 Day rehearsal #1",
        subtitle: "Full run-through of the 20-minute set",
        howTo: [
          "Run the full setlist start to finish, no stops",
          "Time it — are you under 20 minutes?",
          "Note which transitions feel rough",
          "Record yourself on your phone for review",
        ],
        urgency: live414Urg(10),
        pillar: "creative",
        timeBlock: "studio",
        action: async () => { await setStoreValue("414day_rehearsal_1", true); },
      });
    }

    if (rehearsal1 && !rehearsal2) {
      tasks.push({
        id: "414-rehearsal2",
        title: "414 Day rehearsal #2 (final)",
        subtitle: "Polish run — fix everything from rehearsal 1",
        howTo: [
          "Run the full set again with fixes from last time",
          "Focus on transitions, energy management, stage movement",
          "This is your final dress rehearsal",
          "If it feels tight, you're ready",
        ],
        urgency: live414Urg(5),
        pillar: "creative",
        timeBlock: "studio",
        action: async () => { await setStoreValue("414day_rehearsal_2", true); },
      });
    }

    if (!gearChecked && daysUntil414 <= 7) {
      tasks.push({
        id: "414-gear",
        title: "414 Day gear check",
        subtitle: "Don't show up with dead batteries",
        howTo: [
          "Check in-ear monitors — batteries charged, working",
          "Check cables — bring backups",
          "Check microphone — is it yours or venue-provided?",
          "Pack a bag the night before: cables, in-ears, phone charger, water",
        ],
        urgency: live414Urg(3),
        pillar: "ops",
        timeBlock: "any",
        action: async () => { await setStoreValue("414day_gear_checked", true); },
      });
    }

    if (!contentCapturePlan && daysUntil414 <= 14) {
      tasks.push({
        id: "414-content",
        title: "Plan 414 Day content capture",
        subtitle: "This is your biggest content day of the year",
        howTo: [
          "Who's filming? You need at least one person dedicated to camera",
          "Minimum: phone on tripod for full set + handheld for BTS",
          "Ideal: 2 angles (front of stage + crowd/side)",
          "Plan: BTS arrival, soundcheck, crowd energy, performance clips, post-show",
          "This footage feeds reels for 2-3 weeks of content",
        ],
        urgency: live414Urg(7),
        pillar: "creative",
        timeBlock: "any",
        action: async () => { await setStoreValue("414day_content_capture_plan", true); },
      });
    }

    if (!synesthesiaTested && daysUntil414 <= 14) {
      tasks.push({
        id: "414-synesthesia",
        title: "Test Synesthesia Visualizer event mode",
        subtitle: "Live visuals for the set — needs testing before the show",
        howTo: [
          "Open https://strongselects-supplyline.github.io/synesthesia-visualizer/?mode=event",
          "Load the audio files for your setlist tracks",
          "Run through the full set in event mode",
          "Check transitions between tracks",
          "Note any bugs or visual glitches to fix before April 14",
        ],
        urgency: live414Urg(10),
        pillar: "creative",
        timeBlock: "content",
        action: async () => { await setStoreValue("414day_synesthesia_tested", true); },
      });
    }
  }

  // ── 10. INSTRUMENTALS (EP tracks only — skip parked tracks) ──────
  // Sync licensing requires instrumentals. Don't gate on release date.
  // Parked tracks are excluded — they're stretch goals, not critical path.
  for (const release of releases) {
    // Skip if already rendered
    if (release.contentDeliverables.instrumentalRendered) continue;
    // Skip if this is a parked track (not on EP)
    const EP_TRACKS = ['SEE ME', 'East Side Love', 'Sweet Frustration', 'Like I Did', 'ALL LOVE (EP)'];
    if (!EP_TRACKS.includes(release.title)) continue;
    const t = release.title;
    tasks.push({
      id: `instrumental-${t}`,
      title: `Render instrumental — ${t}`,
      subtitle: "Without this, sync placements (TV/film/ads) are impossible",
      howTo: [
        "Open FL Studio and load the project file for this song",
        "Mute all vocal tracks (lead + harmonies + ad-libs)",
        "Solo check: make sure NO vocals are bleeding through",
        "Export/bounce as WAV (same sample rate and bit depth as the master)",
        "Save as: '" + t + " - Instrumental.wav'",
        "Store in your masters folder alongside the vocal version",
      ],
      urgency: "AMBER",
      pillar: "ops",
      timeBlock: "studio",
      action: async () => { await updateContentDeliverables(t, { instrumentalRendered: true }); },
    });
  }

  // ── 11. SS MENU MAINTENANCE (Saturday only, existing clients) ────
  const isSaturday = new Date().getDay() === 6;
  if (isSaturday) {
    const ssMenuKey = `ss_menu_maintenance:${weekKey}`;
    const ssMenuDone = await getStoreValue<boolean>(ssMenuKey);
    if (!ssMenuDone) {
      tasks.push({
        id: "ss-menu-maintenance",
        title: "Update Strong Selects menu",
        subtitle: "30 min. Existing client maintenance only — no new ops.",
        howTo: [
          "Check if any existing clients have reached out this week",
          "Update product availability / pricing if anything changed",
          "Respond to any pending client messages",
          "This should take 30 minutes max. Do NOT expand scope.",
        ],
        urgency: "GREEN",
        pillar: "business",
        timeBlock: "any",
        action: async () => { await setStoreValue(ssMenuKey, true); },
      });
    }
  }

  // ── 12. ANTI-DRIFT TELEMETRY ESCALATIONS ─────────────────────────
  // Hard deadlines — EP upload by Apr 14, EP release Apr 24
  const epUploadDeadline = new Date("2026-04-14T00:00:00");
  const epReleaseDeadline = new Date("2026-04-24T00:00:00");
  const daysToUpload = Math.max(1, Math.ceil((epUploadDeadline.getTime() - now.getTime()) / 86400000));
  const daysToRelease = Math.max(1, Math.ceil((epReleaseDeadline.getTime() - now.getTime()) / 86400000));

  const trackSummaries = await getTrackHoursSummaries();
  const sfSummary = trackSummaries.find(t => t.trackName.toUpperCase() === 'SWEET FRUSTRATION');
  const lidSummary = trackSummaries.find(t => t.trackName.toUpperCase() === 'LIKE I DID');
  const sfHours = sfSummary?.totalHours || 0;
  const lidHours = lidSummary?.totalHours || 0;

  // DoorDash — $1,800/month rolling target
  // Dynamic sprint windows: 6-7AM (morning), 12-2PM (midday), 5:30-8:30PM+ (evening)
  // Min ~3.5 hrs/day across 2-3 sprints. Sundays off.
  const DD_MONTHLY_TARGET = 1800;
  const monthNow = new Date();
  const daysInMonth = new Date(monthNow.getFullYear(), monthNow.getMonth() + 1, 0).getDate();
  const currentDay = monthNow.getDate();
  // Count remaining working days (exclude Sundays)
  let ddWorkingDaysLeft = 0;
  for (let d = currentDay; d <= daysInMonth; d++) {
    const check = new Date(monthNow.getFullYear(), monthNow.getMonth(), d);
    if (check.getDay() !== 0) ddWorkingDaysLeft++;
  }
  ddWorkingDaysLeft = Math.max(ddWorkingDaysLeft, 1);
  const ddRemaining = Math.max(DD_MONTHLY_TARGET - telemetry.doordash_earned, 0);
  const ddDailyTarget = Math.ceil(ddRemaining / ddWorkingDaysLeft);
  const ddPct = Math.round((telemetry.doordash_earned / DD_MONTHLY_TARGET) * 100);
  const isSunday = new Date().getDay() === 0;

  if (ddRemaining > 0 && !isSunday) {
    const ddUrgency = ddDailyTarget > 120 ? "RED" : ddDailyTarget > 80 ? "AMBER" : "GREEN";

    // Morning sprint: 6-7 AM (~$20, 1hr)
    const ddMornKey = `dd_morning:${today}`;
    const ddMornDone = await getStoreValue(ddMornKey);
    if (!ddMornDone && hour >= 5 && hour < 8) {
      tasks.push({
        id: "dd-morning",
        title: `DD Morning Sprint — 6-7 AM`,
        subtitle: `$${telemetry.doordash_earned}/$${DD_MONTHLY_TARGET} (${ddPct}%) · ~$${Math.round(ddDailyTarget * 0.2)} target · ${ddWorkingDaysLeft}d left`,
        howTo: [
          "Quick 1-hour burst before your stack. ~$25 net.",
          "Breakfast rush = high tips. Stay in a tight radius.",
          "You only need 2 of 3 sprints to hit daily pace.",
          "Tap ✓ when this sprint is done.",
        ],
        urgency: ddUrgency,
        pillar: "business",
        timeBlock: "any",
        action: async () => { await setStoreValue(ddMornKey, true); },
      });
    }

    // Midday sprint: 12-2 PM (~$35, 2hrs)
    const ddMidKey = `dd_midday:${today}`;
    const ddMidDone = await getStoreValue(ddMidKey);
    if (!ddMidDone && hour >= 11 && hour < 15) {
      tasks.push({
        id: "dd-midday",
        title: `DD Midday Sprint — 12-2 PM`,
        subtitle: `$${telemetry.doordash_earned}/$${DD_MONTHLY_TARGET} (${ddPct}%) · ~$${Math.round(ddDailyTarget * 0.35)} target · ${ddWorkingDaysLeft}d left`,
        howTo: [
          "2-hour window between studio blocks. ~$50 net.",
          "Lunch rush = consistent volume.",
          "Stay efficient — decline orders under $6.",
          "Back to Studio Block 2 at 2 PM.",
        ],
        urgency: ddUrgency,
        pillar: "business",
        timeBlock: "any",
        action: async () => { await setStoreValue(ddMidKey, true); },
      });
    }

    // Evening sprint: 5:30-8:30+ PM (~$50, 2-3hrs)
    const ddEveKey = `dd_evening:${today}`;
    const ddEveDone = await getStoreValue(ddEveKey);
    if (!ddEveDone && hour >= 17) {
      tasks.push({
        id: "dd-evening",
        title: `DD Evening Sprint — 5:30-8:30 PM`,
        subtitle: `$${telemetry.doordash_earned}/$${DD_MONTHLY_TARGET} (${ddPct}%) · ~$${Math.round(ddDailyTarget * 0.45)} target · ${ddWorkingDaysLeft}d left`,
        howTo: [
          "Biggest window — dinner rush. 2-3hrs = ~$50-75 net.",
          "Flexible end time. Go until you hit daily target.",
          "This is where the bulk of today's DD income lands.",
          "Log earnings with the + button when done.",
        ],
        urgency: ddUrgency,
        pillar: "business",
        timeBlock: "evening",
        action: async () => { await setStoreValue(ddEveKey, true); },
      });
    }
  }

  // SF Mixdown (11 hr target by EP upload Apr 14)
  if (sfHours < 11 && now < epUploadDeadline) {
    const dailyTargetSF = ((11 - sfHours) / daysToUpload).toFixed(1);
    const sfUrgency = parseFloat(dailyTargetSF) > 3 ? "RED" : parseFloat(dailyTargetSF) > 1.5 ? "AMBER" : "GREEN";
    tasks.push({
      id: "telemetry-sf",
      title: `Mix/Master SF: ${dailyTargetSF} hr pace`,
      subtitle: `Sweet Frustration: ${sfHours} / 11 hrs logged. ${daysToUpload} days to upload.`,
      howTo: [
        "10-12 AM = Studio Block 1. 2-4 PM = Studio Block 2 (DD midday fills the gap).",
        "Your only job is closing this track.",
        "Sessions logged on the Log tab automatically update this pace."
      ],
      urgency: sfUrgency,
      pillar: "creative",
      timeBlock: "studio",
      action: async () => {}, // Display only task
    });
  }

  // LID Mixdown (11 hr target by EP upload Apr 14)
  if (lidHours < 11 && now < epUploadDeadline) {
    const dailyTargetLID = ((11 - lidHours) / daysToUpload).toFixed(1);
    const lidUrgency = parseFloat(dailyTargetLID) > 3 ? "RED" : parseFloat(dailyTargetLID) > 1.5 ? "AMBER" : "GREEN";
    tasks.push({
      id: "telemetry-lid",
      title: `Mix/Master LID: ${dailyTargetLID} hr pace`,
      subtitle: `Like I Did: ${lidHours} / 11 hrs logged. ${daysToUpload} days to upload.`,
      howTo: [
        "10-12 AM = Studio Block 1. 2-4 PM = Studio Block 2 (DD midday fills the gap).",
        "If SF is done, all your time goes here.",
        "Sessions logged on the Log tab automatically update this pace."
      ],
      urgency: lidUrgency,
      pillar: "creative",
      timeBlock: "studio",
      action: async () => {}, // Display only task
    });
  }

  // ── 13. ESL EDITORIAL PITCH — 414 DAY (APR 14) ───────────────────
  // ESL drops 414 Day (Apr 14). Upload by Apr 7. Pitch window opens after upload.
  // Standard 7-day pitch window = submit by Apr 7 for guaranteed Release Radar.
  const eslRelease = releases.find(r => r.title === "East Side Love");
  if (eslRelease && eslRelease.status !== "live" && !eslRelease.contentDeliverables.spotifyPitchSubmitted) {
    const eslUploadDate = new Date("2026-04-07T00:00:00");
    const daysToEslUpload = Math.ceil((eslUploadDate.getTime() - now.getTime()) / 86400000);

    if (now >= eslUploadDate) {
      // Post-upload: pitch immediately
      tasks.push({
        id: "esl-pitch-same-day",
        title: "Submit ESL editorial pitch NOW",
        subtitle: "ESL is uploaded. Pitch immediately for 414 Day Release Radar.",
        howTo: [
          "Open Spotify for Artists (app or web).",
          "Go to Music → East Side Love → tap 'Pitch a song'.",
          "Genre: R&B / Soul. Mood: Romantic, Melancholic. Instruments: 808, Piano, Synth.",
          "Culture: TrapSoul. Song description: 'Cinematic OVO-pocket R&B in the Bryson Tiller / Drake lane. Milwaukee anthem for 414 Day. Built for late-night editorial playlists and Release Radar discovery.'",
          "Release date: April 14. Check all fields are filled. Submit.",
          "Tap ✓ when submitted.",
        ],
        urgency: "RED",
        pillar: "ops",
        timeBlock: "biz",
        action: async () => {
          await updateContentDeliverables("East Side Love", { spotifyPitchSubmitted: true });
        },
      });
    } else if (daysToEslUpload <= 7) {
      // Pre-upload: prep the pitch copy
      tasks.push({
        id: "esl-pitch-prep",
        title: `Prep ESL editorial pitch — upload in ${daysToEslUpload}d`,
        subtitle: "Upload ESL to Amuse by Apr 7. Have pitch copy ready to paste.",
        howTo: [
          "Write your pitch copy NOW so you're ready on upload day.",
          "Genre: R&B / Soul. Mood: Romantic, Melancholic.",
          "Description: 'Cinematic OVO-pocket R&B in the Bryson Tiller / Drake lane. Milwaukee anthem dropping 414 Day. Late-night, emotional, built for editorial discovery.'",
          "Save it in Notes — paste into Spotify for Artists right after Amuse confirms.",
        ],
        urgency: daysToEslUpload <= 3 ? "RED" : "AMBER",
        pillar: "ops",
        timeBlock: "biz",
        action: async () => {
          await setStoreValue("esl_pitch_prep_done", true);
        },
      });
    }
  }

  // ── 14. SPOTIFY AD STUDIO — GEO TARGETS ──────────────────────────
  // Fire when a release is 0-3 days from release date.
  // Sources city allocation from Gorilla Geo + routing playbook.
  for (const release of releases) {
    if (release.status === "live") continue;
    const rDate = new Date(release.releaseDate + "T00:00:00");
    const rDays = Math.ceil((rDate.getTime() - now.getTime()) / 86400000);
    if (rDays > 3 || rDays < -5) continue;

    const adKey = `ad_studio_deployed:${release.title}`;
    const adDeployed = await getStoreValue<boolean>(adKey);
    if (!adDeployed) {
      const isReleaseDay = rDays <= 0;
      tasks.push({
        id: `ad-studio-${hashStr(release.title)}`,
        title: `Launch Spotify Ad Studio — ${release.title}`,
        subtitle: isReleaseDay
          ? `${release.title} is out. Deploy ads now to prime the algorithm.`
          : `${release.title} drops in ${rDays} day${rDays === 1 ? "" : "s"}. Set up the campaign.`,
        howTo: [
          "Go to ads.spotify.com → Create Ad → Audio Ad.",
          "Select: Spotify for Artists (use your track audio).",
          `Budget: $50 total. Geo split: Denver $20, Minneapolis $15, Dallas $15.`,
          "Target: Fans of R&B/Soul. Ages 18-34. All genders.",
          `CTA copy: 'Save ${release.title} on Spotify — out now.'`,
          "Run dates: Release day + 5 days after.",
          "Denver = your #1 market (372 Spotify users). Non-negotiable.",
          "Minneapolis = #2 metro (323 combined). Midwest corridor — drivable for shows.",
          "Tap ✓ when campaign is live.",
        ],
        urgency: isReleaseDay ? "RED" : "AMBER",
        pillar: "business",
        timeBlock: "biz",
        action: async () => {
          await setStoreValue(adKey, true);
        },
      });
    }
  }

  // ── 15. STREAMING VELOCITY — LOG DAILY STREAMS ───────────────────
  // Fires in the evening (8PM+) for live tracks with no entry today.
  // Reminds to pull numbers from Spotify for Artists and log to /velocity.
  if (hour >= 20) {
    for (const release of releases) {
      if (release.status !== "live") continue;
      const velAckKey = `velocity_ack:${today}:${hashStr(release.title)}`;
      const velAcked = await getStoreValue<boolean>(velAckKey);
      // Check if today entry exists via the known key pattern
      const streamEntryKey = `stream:${release.title.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}:${today}`;
      const hasEntry = await getStoreValue(streamEntryKey);
      if (!hasEntry && !velAcked) {
        tasks.push({
          id: `velocity-log-${hashStr(release.title)}`,
          title: `Log streams — ${release.title}`,
          subtitle: "Open Spotify for Artists and record today's numbers. Feeds the 28-day model.",
          howTo: [
            "Open Spotify for Artists app.",
            `Tap Music → ${release.title} → Stats.`,
            "Note: streams today + saves (if visible).",
            "Open Oracle Compass → Velocity tab → tap '+ Log Today's Streams'.",
            "Enter the numbers. 30 seconds. Keeps your momentum model accurate.",
          ],
          urgency: "GREEN",
          pillar: "ops",
          timeBlock: "evening",
          action: async () => {
            await setStoreValue(velAckKey, true);
          },
        });
      }
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
  // Silent audit trail — append-only log for pattern analysis
  await logTaskCompletion({
    taskId: task.id,
    title: task.title,
    pillar: task.pillar,
    urgency: task.urgency,
    clearedAt: new Date().toISOString(),
    dayOfWeek: new Date().getDay(),
  });
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
