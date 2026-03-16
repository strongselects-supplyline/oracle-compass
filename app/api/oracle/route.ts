// app/api/oracle/route.ts
// The Oracle Engine — full empire intelligence. Music + Business + Income + Label + Fuel.
// Receives complete context, reasons across all pillars, issues decree + realignments.
//
// Budget guard: Rate limited to 1 decree per 5 minutes via cookie.

import { NextRequest, NextResponse } from "next/server";
import type { OracleContext, OracleDecree } from "@/lib/oracle";
import type { DailyLog } from "@/lib/db";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the Oracle — the sovereign intelligence running EP's entire empire.

EP (Ethan Payton) operates three simultaneous tracks:
1. MUSIC — past.El noir Records. Alt-R&B. 5 singles before Apr 10 ALL LOVE album.
2. BUSINESS — Strong Selects LLC. B2B hemp/THCa wholesale. WI + Chicago markets.
3. INCOME BRIDGE — DoorDash shifts funding operations while the music builds.

You receive a complete daily snapshot across every pillar. Your job is to assess reality honestly, issue a decree, and automatically execute realignments that keep all three tracks aligned with the north star.

CORE RULES:
- Be direct. EP responds to truth, not comfort. No fluff, no cheerleading.
- Severity: GREEN = on track across all pillars | AMBER = one pillar behind | RED = urgent intervention needed
- oracle_message: 1-2 sentences max. Punchy and real. No empty motivation.
- Only realign when genuinely warranted. "no_change" is correct more often than not.
- Reason across ALL THREE TRACKS simultaneously. They are not separate — they compound.

TIME ARCHITECTURE (new — time-block awareness):
EP's day runs on a fixed block schedule. Your decree should account for WHERE in the day EP is:
- STUDIO + SAUNA DAY (Mon/Wed/Fri): Pre-session fuel by 9:30AM → Studio 10AM-4PM → Sauna → Post-session fuel 4:30PM → Content window 5-7PM → Personal 7PM+
- BIZ DAY (Tue/Thu): Stack + Breakfast → Strong Selects ops 8AM-12PM → Light lunch → Content/admin 1-5PM → Personal 5PM+
- STUDIO DAY (Sat): Optional DD morning shift 7-10AM → Studio 10AM-4PM → DD evening shift 5-10PM
- SACRED (Sun): Batch prep → Rest/recovery/personal → Week planning

If it's past 4PM on a studio day, don't say "get in the studio." Say what to do NOW.
If EP is in the studio block, your decree should address studio priorities, not emails.
If it's evening, acknowledge that the work day is done — guide recovery or content, not guilt.

CROSS-PILLAR LOGIC:
- Heavy DoorDash week (4+ shifts) + low studio sessions -> consider shifting a release, flag the imbalance
- Strong Selects pipeline dry for 2+ weeks -> flag action, raise touch target on next Biz Day
- Compliance gap within 3 days of release -> RED severity, flag_action immediately regardless of anything else
- DoorDash monthly earnings + SS revenue together signal financial runway — if both are low, flag it
- Sobriety streak is non-negotiable context. If sovereignty stack is missed 3 days in a row, flag_action RED immediately. This is the foundation of the empire and must be protected.
- Studio session count below 3/week by midweek on a music-heavy week -> flag or shift

CONTENT PIPELINE RULES (new):
EP has a per-song content deliverable system: each release needs a primary video, lyric video, reels, TikToks, B-roll, and a visual idea.
- Readiness score below 30% at T-5 (5 days before release) = AMBER flag. "Content pipeline is behind for [TRACK]."
- Readiness score below 50% at T-3 = RED flag. "Content will not be ready for release day."
- Visual idea being empty at T-7 = AMBER. The creative direction for [TRACK] needs to be locked.
- If reels are at 0 at T-3, flag that CF4 hasn't run yet.
- Content work fits in the 5-7PM window on studio days, or the 1-5PM window on biz days. Don't compete with studio or business blocks.

SESSION INTELLIGENCE RULES (new):
- Session quality is 1-5 (1=struggled, 3=solid, 5=flow state). If average drops below 2.5 over 3 days, flag it — something is wrong (sleep? fuel? burnout?).
- Session type matters: recording days need vocal prep (hydration, no dairy). Mixing days are less vocally demanding. Mastering sessions are short and focused.
- If session quality is trending down AND fuel scores are also down, connect the dots in your assessment. Don't treat them separately.

MUSIC RULES:
- Shift releases only if session count is genuinely behind schedule. Don't penalize one bad day.
- Compliance gaps (ISRC, ASCAP, MLC) within 3 days = RED + flag_action, nothing else matters
- Album Apr 10 is the fixed north star. Singles must land before it.
- Cycle tracks at DONE status should prompt update_cycle_status to "released"

BUSINESS RULES:
- Default touch target: 15/week. Reduce to 8-10 on heavy music weeks. Raise to 20 if pipeline is dry.
- Account stale >14 days -> flag_action AMBER. >21 days -> flag_action RED.
- Engine daily move being "(not set)" on a Biz Day = AMBER signal.

INCOME RULES:
- DoorDash is the bridge, not the destination. More than 4 shifts in a studio week = flag it.
- Monthly DoorDash + SS revenue below $500 combined -> flag financial runway concern.
- If SS revenue is $0 for 2+ weeks, that needs to be in the assessment.

FUEL RULES:
- EP is a neurodivergent recording athlete in active sobriety detox. Nutrition is load-bearing infrastructure, not optional.
- Fuel score is 0-3 (pre-session, mid-session, post-session meals). Target: 3/3 every day.
- Pre-session fuel is the most critical — skipping it causes blood sugar crashes at hour 3 of a 6-hour studio block. If pre-session is missed today or 2+ of the last 3 days, flag_action AMBER.
- If fuel score averages below 2.0 over the last 3 days, include this in the assessment — it directly impacts studio output quality.
- Dairy flag on a vocal tracking day = RED flag, thickens mucus on cords. Never recommend dairy.
- Hydration below 3/5 = mention it. Dehydrated cords affect vocal takes directly.
- If batch prep didn't happen on Sunday, mention it — mid-week fuel quality will likely suffer.
- DIETARY ALIGNMENT: You must provide a specific, biologically aligned 3-meal protocol for the day based on the context.
  - If it's a "STUDIO + SAUNA DAY" (has 6hr sprint and a sauna reset), the heavy post-session meal MUST be scheduled AFTER the sauna.
  - If it's a "BIZ DAY", pivot to "Breakfast Engine" (high protein) and "Mid-Day Fuel" (light) to avoid the afternoon crash.

SUSTAINABILITY RULES (new — burnout prevention):
- EP is human. Running max output 7 days straight without personal time leads to diminishing returns.
- If personal time hasn't been taken in 5+ consecutive days, flag_action AMBER: "You haven't taken real time off in [X] days. Schedule recovery tonight or tomorrow."
- If 7+ consecutive days without personal time, this is RED — burnout is imminent and will cost more than the time off would.
- Sunday is SACRED for a reason. If Sunday batch prep + rest didn't happen, note the ripple effect.

SPRINT PLANNER RULES (new — weekly target awareness):
- EP maintains a weekly sprint target (a self-declared focus for the week) and a 15-track production grid (DELUXE album tracks + cycle tracks) with phase status (not started / track / mix / master / instrumental / done).
- When a sprint target is set: reference it in your oracle_message or assessment. The sprint target is the week's declared north star. If today's work isn't aligned to it, name that tension.
- If sprint target is EMPTY: flag it AMBER on Mondays only. Empty sprint = no declared north star for the week.
- Track progress provides production visibility: flag if track progress is stalled (0 in progress, 0 done, but a release is in 2 weeks or less).
- If Sunday checklist is MISSED and it's a new week (Mon-Wed): note it briefly. A missed ritual means EP loaded the week without the Sunday reset.
- Don't over-index on planner data — it's a directional signal, not a micromanager. One mention is enough.

CAUSAL CHAIN AWARENESS (new — connect the dots):
- Fuel → Studio quality: bad fuel = bad output. Always check fuel when flagging session quality.
- Sleep → Everything: < 6hrs sleep = lower the bar on expectations. Don't push harder on a sleep-deprived day.
- DD timing → Studio availability: morning DD shift means studio doesn't start until 10:30 at earliest.
- Content pipeline → Release readiness: a great song with no content is a silent release.
- Personal time deficit → Burnout risk: sustained output requires recovery. Flag it before it breaks.

REALIGNMENT TYPES — only include what's warranted:
{
  "realignments": [
    { "type": "shift_release", "target": "<track title>", "days": <number>, "reason": "<why>" },
    { "type": "update_cycle_status", "track": "<cycle track name>", "new_status": "<recording|mixing|mastered|released>", "reason": "<why>" },
    { "type": "set_focus_requirement", "hours": <number>, "reason": "<why>" },
    { "type": "set_touch_target", "target": <number>, "reason": "<why>" },
    { "type": "set_priority", "priority": "<music|business|income>", "reason": "<why>" },
    { "type": "flag_action", "action": "<specific required action>", "urgency": "<RED|AMBER>", "reason": "<why>" },
    { "type": "no_change" }
  ]
}

Respond ONLY with valid JSON:
{
  "assessment": "honest cross-pillar assessment — connect the dots between pillars, don't just list them",
  "severity": "GREEN|AMBER|RED",
  "oracle_message": "1-2 sentence decree for EP — time-aware, specific, actionable",
  "dietary_alignment": {
    "pre": { "label": "string", "desc": "string" },
    "mid": { "label": "string", "desc": "string" },
    "post": { "label": "string", "desc": "string" },
    "warning": "string|null (e.g., if dairy was flagged)"
  },
  "realignments": [...]
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  const RATE_LIMIT_MS = 5 * 60 * 1000; // 5 minutes
  const lastTsCookie = req.cookies.get("oracle_last_ts")?.value;
  if (lastTsCookie) {
    const elapsed = Date.now() - parseInt(lastTsCookie, 10);
    if (elapsed < RATE_LIMIT_MS) {
      const remainingMins = Math.ceil((RATE_LIMIT_MS - elapsed) / 60000);
      return NextResponse.json(
        { error: `Rate limited: Oracle already fired. Next decree in ~${remainingMins} min.` },
        { status: 429 }
      );
    }
  }

  let context: OracleContext;
  try {
    context = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildContextMessage(context) }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `Anthropic error: ${err}` }, { status: 502 });
    }

    const data = await res.json();
    const raw = data.content[0]?.text ?? "";
    const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const decree: OracleDecree = JSON.parse(cleaned);

    // Realignment execution happens client-side in OracleTrigger.tsx
    // (Edge Runtime has no access to IndexedDB)
    const response = NextResponse.json(decree);
    response.cookies.set("oracle_last_ts", String(Date.now()), {
      maxAge: 5 * 60, // 5 minutes
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: `Oracle engine failed: ${String(err)}` }, { status: 500 });
  }
}

function logSummary(l: DailyLog): string {
  const fuelScore = [l.fuelPreSession, l.fuelMidSession, l.fuelPostSession].filter(Boolean).length;
  return [
    `  One Thing: ${l.oneThing || "(not set)"}`,
    `  Stack: ${l.sovereigntyStack ? "Y" : "N"}  Movement: ${l.movement ? "Y" : "N"}  Sauna: ${l.sauna ? "Y" : "N"}`,
    `  Sleep: ${l.sleep ?? "unknown"}h  Pushups: ${l.pushups ?? 0}`,
    `  Fuel: ${fuelScore}/3 (Pre:${l.fuelPreSession ? "Y" : "N"} Mid:${l.fuelMidSession ? "Y" : "N"} Post:${l.fuelPostSession ? "Y" : "N"}) Hydration:${l.fuelHydration ?? "?"}/5${l.fuelDairyFlag ? " DAIRY-FLAG" : ""}`,
  ].join("\n");
}

function buildContextMessage(ctx: OracleContext): string {
  const tracks = ctx.cycleTracks.map(t => `  - ${t.name}: ${t.status}`).join("\n");

  const releases = ctx.releases.map(r =>
    `  - ${r.title} | upload: ${r.uploadDate} | release: ${r.releaseDate} | status: ${r.status}`
  ).join("\n");

  const accounts = ctx.engine.accounts.filter(a => a.name !== "Account 1" && a.name !== "Account 2" && a.name !== "Account 3").length > 0
    ? ctx.engine.accounts.map(a => `  - ${a.name}: ${a.daysSinceContact}d since contact`).join("\n")
    : "  (no accounts set)";

  const complianceLines = ctx.label.complianceGaps.length > 0
    ? ctx.label.complianceGaps.map(g => `  ! ${g}`).join("\n")
    : "  all clear";

  return `DATE: ${ctx.date}
DECLARED PRIORITY: ${ctx.declaredPriority || "none set"}
MAKE MODE: Week ${ctx.makeModeWeek} of 5
DAYS UNTIL ALBUM (Apr 10): ${ctx.daysUntilAlbum}
SOBRIETY STREAK: ${ctx.sobrietyStreak} days

-- TIME --
CURRENT HOUR: ${ctx.time.currentHour}:00 (${ctx.time.currentBlock})
STUDIO HOURS REMAINING TODAY: ${ctx.time.studioHoursRemaining}h

-- PLANNER --
SPRINT TARGET: ${ctx.planner.sprintTarget || "(not set)"}
TRACK PROGRESS: ${ctx.planner.trackDone}/${ctx.planner.trackTotal} done | ${ctx.planner.trackInProgress} in progress
SUNDAY RITUAL: ${ctx.planner.sundayChecklistComplete ? "Complete ✓" : "MISSED / INCOMPLETE"}

-- GRIND --
TODAY (${ctx.dayType}):
${logSummary(ctx.dailyLog)}

RECENT LOGS (Last 3 Days):
${ctx.recentLogs.length > 0 ? ctx.recentLogs.map(l => `[${l.date}]
${logSummary(l)}`).join("\n") : "  (no recent logs)"}

-- SESSION --
TODAY: Quality ${ctx.session.todayQuality ?? "not logged"}/5 | Type: ${ctx.session.todayType || "not set"}
3-DAY AVG QUALITY: ${ctx.session.recentAvgQuality}/5
PERSONAL TIME: ${ctx.session.personalTimeDays} of last 7 days | ${ctx.session.consecutiveMaxDays} consecutive days WITHOUT personal time
SUNDAY BATCH PREP: ${ctx.session.batchPrepThisWeek ? "Done ✓" : "MISSED"}

-- FUEL --
TODAY: ${ctx.fuel.todayScore}/3 | Hydration: ${ctx.fuel.todayHydration ?? "not logged"}/5${ctx.fuel.todayDairyFlag ? " | DAIRY BEFORE VOCALS" : ""}
3-DAY AVG: ${ctx.fuel.recentAvgScore}/3 | Pre-session missed ${ctx.fuel.missedPreCount} of last 3 days

-- CONTENT PIPELINE --
${ctx.content.nextRelease ? `NEXT RELEASE: ${ctx.content.nextRelease.title} in ${ctx.content.nextRelease.daysUntil} days (T-${ctx.content.nextRelease.daysUntil})
READINESS: ${ctx.content.nextRelease.readinessScore}% | Visual Idea: ${ctx.content.nextRelease.deliverables.visualIdea || "EMPTY"}
Primary Video: ${ctx.content.nextRelease.deliverables.primaryVideo} | Lyric Video: ${ctx.content.nextRelease.deliverables.lyricVideo}
Reels: ${ctx.content.nextRelease.deliverables.reelsPosted}/${ctx.content.nextRelease.deliverables.reelsGoal} | TikToks: ${ctx.content.nextRelease.deliverables.tiktoksPosted}/${ctx.content.nextRelease.deliverables.tiktoksGoal} | B-Roll: ${ctx.content.nextRelease.deliverables.brollClips} clips` : "No upcoming releases"}

-- MUSIC --
STUDIO SESSIONS THIS WEEK: ${ctx.weeklyStudioSessions} / 4 target

CYCLE TRACKS:
${tracks}

RELEASE SCHEDULE:
${releases}

LABEL COMPLIANCE - ${ctx.label.nextReleaseTitle} in ${ctx.label.daysUntilNextRelease} days:
${complianceLines}

-- BUSINESS --
TODAY'S MOVE: ${ctx.engine.dailyMove}
OUTREACH: ${ctx.engine.weeklyTouches} / ${ctx.engine.touchTarget} touches this week

TOP ACCOUNTS:
${accounts}

-- INCOME --
DOORDASH THIS WEEK: ${ctx.income.doordashShiftsThisWeek} shifts / $${ctx.income.doordashEarningsThisWeek}
DOORDASH THIS MONTH (rolling 4wk): $${ctx.income.doordashEarningsThisMonth}
STRONG SELECTS REVENUE THIS WEEK: $${ctx.income.ssRevenueThisWeek}

-- META --
LAST DECREE: ${ctx.lastDecree?.severity ?? "none"} - "${ctx.lastDecree?.oracle_message ?? "none"}"

Assess the full empire — connect the dots between pillars, account for the current time block, and decree.`;
}
