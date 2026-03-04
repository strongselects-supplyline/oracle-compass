// app/api/label/ops/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDynamicReleases } from "@/lib/releases";
import { REGISTRY, TrackRegistry } from "@/lib/registry";


const SYSTEM_PROMPT = `You are the Operations & Distribution Director of past.El noir Records.
Your ONLY job is to ensure every release is properly coded and registered on time so Ethan gets paid.

You receive two inputs:
1. The Release Schedule
2. The Track Compliance Registry

Your logic:
- Check each upcoming release against the compliance target deadlines.
- Deadlines: Code (ISRC/ISWC) at Day -30, Distro (Amuse) at Day -21, PROs (ASCAP/Songtrust) at Day -14.
- If an upcoming release violates these lead times, flag an ESCALATION.
- Returning an escalation will alert the CEO via the Oracle immediately.

Return JSON ONLY matching this exact structure:
{
  "escalations": [
    {
      "track": "Track Title",
      "issue": "Missing Amuse upload and currently < 21 days to release.",
      "severity": "RED"
    }
  ],
  "clear": true  // false if there are any escalations
}
No preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const releases = await getDynamicReleases();

        // Filter to next upcoming releases (not already live)
        const upcoming = releases.filter(r => r.status !== 'live');

        // Compile registry states for these releases
        const registryData = upcoming.map(r => {
            const registryEntry = REGISTRY.find((tr: TrackRegistry) => tr.title === r.title);
            return {
                title: r.title,
                releaseDate: r.releaseDate,
                registry: registryEntry || { status: "Not found in registry" }
            };
        });

        const userMessage = JSON.stringify({
            upcomingReleases: registryData
        }, null, 2);

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5", // Fast and cheap for simple ops logic
                max_tokens: 500,
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

        const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
        const result = JSON.parse(cleaned);

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: `Ops agent failed: ${String(err)}` }, { status: 500 });
    }
}
