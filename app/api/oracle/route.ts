// app/api/oracle/route.ts
// The Oracle Engine — full empire intelligence. Music + Business + Income + Label.
// Receives complete context, reasons across all pillars, issues decree + realignments.
//
// 🛡️ BUDGET GUARD: Rate limited to 1 decree per 4 hours via cookie.

import { NextRequest, NextResponse } from "next/server";
import type { OracleContext, OracleDecree } from "@/lib/oracle";
import type { DailyLog } from "@/lib/db";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the Oracle — the sovereign intelligence running EP's entire empire.

EP (Ethan Payton) operates three simultaneous tracks:
1. MUSIC — past.El noir Records. Alt-R&B artist. 5 singles before Apr 10 album (ALL LOVE).
2. BUSINESS — Strong Selects LLC. B2B hemp/THCa wholesale. Wisconsin + Chicago markets.
3. INCOME BRIDGE — DoorDash shifts funding operations while the music builds.

You receive a complete daily snapshot across every pillar. Your job is to assess reality honestly, issue a decree, and automatically execute realignments that keep all three tracks aligned with the north star.

CORE RULES:
- Be direct. EP responds to truth, not comfort. No fluff, no cheerleading.
- Severity: GREEN = on track across all pillars | AMBER = one pillar behind | RED = urgent intervention needed
- oracle_message: 1-2 sentences max. Punchy and real. No empty motivation.
- Only realign when genuinely warranted. "no_change" is correct more often than not.
- Reason across ALL THREE TRACKS simultaneously. They are not separate — they compound.

CROSS-PILLAR LOGIC:
- Heavy DoorDash week (4+ shifts) + low studio sessions → consider shifting a release, flag the imbalance
- Strong Selects pipeline dry for 2+ weeks → flag action, raise touch target on next Biz Day
- Compliance gap within 3 days of release → RED severity, flag_action immediately regardless of anything else
- DoorDash monthly earnings + SS revenue together signal financial runway — if both are low, flag it
- Sobriety streak is non-negotiable context. If stack or movement is missed repeatedly, acknowledge it.
- Studio session count below 3/week by midweek on a music-heavy week → flag or shift

MUSIC RULES:
- Shift releases only if session count is genuinely behind schedule. Don't penalize one bad day.
- Compliance gaps (ISRC, ASCAP, MLC) within 3 days = RED + flag_action, nothing else matters
- Album Apr 10 is the fixed north star. Singles must land before it.
- Cycle tracks at DONE status should prompt update_cycle_status to "released"

BUSINESS RULES:
- Default touch target: 15/week. Reduce to 8-10 on heavy music weeks. Raise to 20 if pipeline is dry.
- Account stale >14 days → flag_action AMBER. >21 days → flag_action RED.
- Engine daily move being "(not set)" on a Biz Day = AMBER signal.

INCOME RULES:
- DoorDash is the bridge, not the destination. More than 4 shifts in a studio week = flag it.
- Monthly DoorDash + SS revenue below $500 combined → flag financial runway concern.
- If SS revenue is $0 for 2+ weeks, that needs to be in the assessment.

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
  "assessment": "honest cross-pillar assessment of where everything stands",
  "severity": "GREEN|AMBER|RED",
  "oracle_message": "1-2 sentence decree for EP",
  "realignments": [...]
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  // 🛡️ Rate limit: 1 Claude call per 4 hours
  const RATE_LIMIT_MS = 4 * 60 * 60 * 1000;
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

    const response = NextResponse.json(decree);
    response.cookies.set("oracle_last_ts", String(Date.now()), {
      maxAge: 4 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: `Oracle engine failed: ${String(err)}` }, { status: 500 });
  }
}

function logSummary(l: DailyLog): string {
  return [
    `  One Thing: ${l.oneThing || "(not set)"}`,
    `  Stack: ${l.sovereigntyStack ? "✓" : "✗"}  Movement: ${l.movement ? "✓" : "✗"}  Sauna: ${l.sauna ? "✓" : "✗"}`,
    `  Sleep: ${l.sleep ?? "unknown"}h  Pushups: ${l.pushups ?? 0}`,
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
    ? ctx.label.complianceGaps.map(g => `  ⚠️ ${g}`).join("\n")
    : "  ✓ all clear";

  return `DATE: ${ctx.date}
DECLARED PRIORITY: ${ctx.declaredPriority || "none set"}
MAKE MODE: Week ${ctx.makeModeWeek} of 5
DAYS UNTIL ALBUM (Apr 10): ${ctx.daysUntilAlbum}
SOBRIETY STREAK: ${ctx.sobrietyStreak} days

── GRIND ───────────────────────────────────────
TODAY:
${logSummary(ctx.dailyLog)}

YESTERDAY:
${ctx.previousLog ? logSummary(ctx.previousLog) : "  (no log)"}

── MUSIC ───────────────────────────────────────
STUDIO SESSIONS THIS WEEK: ${ctx.weeklyStudioSessions} / 4 target

CYCLE TRACKS:
${tracks}

RELEASE SCHEDULE:
${releases}

LABEL COMPLIANCE — ${ctx.label.nextReleaseTitle} in ${ctx.label.daysUntilNextRelease} days:
${complianceLines}

── BUSINESS ────────────────────────────────────
TODAY'S MOVE: ${ctx.engine.dailyMove}
OUTREACH: ${ctx.engine.weeklyTouches} / ${ctx.engine.touchTarget} touches this week

TOP ACCOUNTS:
${accounts}

── INCOME ──────────────────────────────────────
DOORDASH THIS WEEK: ${ctx.income.doordashShiftsThisWeek} shifts · $${ctx.income.doordashEarningsThisWeek}
DOORDASH THIS MONTH (rolling 4wk): $${ctx.income.doordashEarningsThisMonth}
STRONG SELECTS REVENUE THIS WEEK: $${ctx.income.ssRevenueThisWeek}

── META ────────────────────────────────────────
LAST DECREE: ${ctx.lastDecree?.severity ?? "none"} — "${ctx.lastDecree?.oracle_message ?? "none"}"

Assess the full empire and decree.`;
}
