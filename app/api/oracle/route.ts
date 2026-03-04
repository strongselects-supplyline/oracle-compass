// app/api/oracle/route.ts
// The Oracle Engine — receives assembled context, calls Claude, returns a decree.
// Called once per day by OracleTrigger (client component in layout).
//
// 🛡️ BUDGET GUARD: Rate limited to 1 decree per 4 hours.
// The last decree timestamp is stored in the 'oracle_last_ts' cookie.
// If a request arrives within 4 hours of the last decree, the cached
// last decree is returned from the request body without calling Claude.
// This prevents surprise charges from multi-device refreshes or hot-reload loops.

import { NextRequest, NextResponse } from "next/server";
import type { OracleContext, OracleDecree } from "@/lib/oracle";
import type { DailyLog } from "@/lib/db";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the Oracle — a sovereign creative intelligence tracking EP's music empire.
You receive daily context about his progress: release schedule, sobriety streak, studio sessions, cycle track status, and yesterday's daily log.
You ALSO receive label operations data: compliance gaps, next release urgency, and agent status.
Your job: assess the situation honestly and return a precise decree.

Rules:
- Be direct, no fluff. EP responds to truth, not comfort.
- Only shift release dates if genuinely warranted by missed sessions or lack of progress. Don't shift for small setbacks.
- severity GREEN = on track | AMBER = behind but recoverable | RED = needs urgent intervention
- oracle_message should be 1-2 sentences max — punchy, direct, motivational without being corny.
- Only include realignments that are actually necessary. "no_change" is a valid and often correct response.
- If label compliance gaps exist (missing ASCAP, MLC, ISRC, etc.), mention them in your assessment. These are revenue-critical.
- If a release is within 3 days and has compliance gaps, severity should be RED regardless of other factors.

Respond ONLY with valid JSON matching this exact schema:
{
  "assessment": "brief honest assessment of current trajectory",
  "severity": "GREEN" | "AMBER" | "RED",
  "oracle_message": "1-2 sentence message for EP",
  "realignments": [
    { "type": "shift_release", "target": "<track title>", "days": <number>, "reason": "<why>" },
    { "type": "update_cycle_status", "track": "<track name>", "new_status": "<recording|mixing|mastered|released>", "reason": "<why>" },
    { "type": "set_focus_requirement", "hours": <number>, "reason": "<why>" },
    { "type": "no_change" }
  ]
}`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    // 🛡️ Rate limit: only allow 1 Claude call per 4 hours.
    const RATE_LIMIT_MS = 4 * 60 * 60 * 1000; // 4 hours
    const lastTsCookie = req.cookies.get('oracle_last_ts')?.value;
    if (lastTsCookie) {
        const lastTs = parseInt(lastTsCookie, 10);
        const elapsed = Date.now() - lastTs;
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

    const userMessage = buildContextMessage(context);

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
                max_tokens: 800,
                system: SYSTEM_PROMPT,
                messages: [{ role: "user", content: userMessage }],
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            return NextResponse.json({ error: `Anthropic error: ${err}` }, { status: 502 });
        }

        const data = await res.json();
        const raw = data.content[0]?.text ?? "";

        // Strip markdown code fences if present
        const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
        const decree: OracleDecree = JSON.parse(cleaned);

        // 🛡️ Set rate-limit cookie: blocks repeat Claude calls for 4 hours
        const response = NextResponse.json(decree);
        response.cookies.set('oracle_last_ts', String(Date.now()), {
            maxAge: 4 * 60 * 60, // 4 hours in seconds
            path: '/',
            sameSite: 'lax',
        });
        return response;
    } catch (err) {
        return NextResponse.json({ error: `Oracle engine failed: ${String(err)}` }, { status: 500 });
    }
}

function logSummary(l: DailyLog): string {
    return [
        `    One Thing: ${l.oneThing || "(not set)"}`,
        `    Sovereignty Stack: ${l.sovereigntyStack ? "✓" : "✗"}`,
        `    Movement: ${l.movement ? "✓" : "✗"}`,
        `    Sauna: ${l.sauna ? "✓" : "✗"}`,
        `    Sleep: ${l.sleep ?? "unknown"}h`,
        `    Pushups: ${l.pushups ?? 0}`,
    ].join("\n");
}

function buildContextMessage(ctx: OracleContext): string {
    const tracks = ctx.cycleTracks.map(t => `  - ${t.name}: ${t.status}`).join("\n");
    const releases = ctx.releases.map(r =>
        `  - ${r.title} | upload: ${r.uploadDate} | release: ${r.releaseDate} | status: ${r.status}`
    ).join("\n");

    // Label compliance integration
    const labelSection = (ctx as any).labelCompliance
        ? `\nLABEL OPS COMPLIANCE:\n${(ctx as any).labelCompliance}`
        : "";

    return `DATE: ${ctx.date}
MAKE MODE: Week ${ctx.makeModeWeek} of 5
DAYS UNTIL ALBUM: ${ctx.daysUntilAlbum}
SOBRIETY STREAK: ${ctx.sobrietyStreak} days

TODAY'S LOG:
${logSummary(ctx.dailyLog)}

YESTERDAY'S LOG:
${ctx.previousLog ? logSummary(ctx.previousLog) : "  (none)"}

WEEKLY STUDIO SESSIONS: ${ctx.weeklyStudioSessions}

CYCLE TRACKS:
${tracks}

RELEASE SCHEDULE:
${releases}
${labelSection}

LAST DECREE SEVERITY: ${ctx.lastDecree?.severity ?? "none"}
LAST ORACLE MESSAGE: ${ctx.lastDecree?.oracle_message ?? "none"}

Assess and decree.`;
}
