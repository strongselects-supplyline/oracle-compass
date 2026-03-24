// app/api/label/ops/route.ts
// Operations & Distribution Director — compliance audit using live contentDeliverables data
import { NextRequest, NextResponse } from "next/server";
import { getDynamicReleases } from "@/lib/releases";

const SYSTEM_PROMPT = `You are the Operations & Distribution Director of past.El noir Records.
Your ONLY job is to ensure every release is properly coded and registered on time so Ethan gets paid.

You receive the Release Schedule with embedded compliance status from contentDeliverables.

Your logic:
- Check each upcoming release against the compliance target deadlines.
- Deadlines: Code (ISRC) at Day -30, Distro (Amuse) at Day -21, PROs (ASCAP/Songtrust) at Day -14.
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
  "clear": true
}
No preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const releases = await getDynamicReleases();
        const upcoming = releases.filter(r => r.status !== 'live');

        // Build compliance snapshot from contentDeliverables (single source of truth)
        const complianceData = upcoming.map(r => {
            const d = r.contentDeliverables;
            return {
                title: r.title,
                releaseDate: r.releaseDate,
                uploadDate: r.uploadDate,
                compliance: {
                    isrcPulled: d.isrcPulled,
                    ascapRegistered: d.ascapRegistered,
                    mlcRegistered: d.mlcRegistered,
                    songtrustRegistered: d.songtrustRegistered,
                    musixmatchSubmitted: d.musixmatchSubmitted,
                    instrumentalRendered: d.instrumentalRendered,
                    amuseUploaded: d.amuseUploaded,
                    spotifyPitchSubmitted: d.spotifyPitchSubmitted,
                }
            };
        });

        const userMessage = JSON.stringify({ upcomingReleases: complianceData }, null, 2);

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
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

        let result;
        try {
            result = JSON.parse(cleaned);
        } catch {
            console.error("[Ops Agent] Failed to parse JSON:", cleaned.slice(0, 300));
            return NextResponse.json(
                { error: `Ops agent returned malformed JSON. Raw: ${cleaned.slice(0, 200)}` },
                { status: 502 }
            );
        }

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: `Ops agent failed: ${String(err)}` }, { status: 500 });
    }
}
