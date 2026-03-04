// app/api/label/marketing/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the Marketing Director of past.El noir Records. You build release rollout
schedules that eliminate post-paralysis. Every schedule must be specific, day-by-day,
platform-specific, and reference which empire tool produces the asset.

Empire tools available:
- Content Factory V3: produces Reels, Chop Mode clips, longform (flag as: cf_reel, cf_chop, cf_longform)
- Sovereign Studio: produces cover art, visualizers, AI video (flag as: ss_art, ss_visualizer, ss_video)
- Manual: anything Ethan must do himself (flag as: manual)

Prioritize TikTok + IG Reels as primary discovery platforms.
YouTube Shorts as secondary.
Spotify pre-save + Apple Music link for days -10 to -3.

Return a 21-day schedule as JSON array (14 pre-release, release day, 6 post-release).
Return JSON ONLY matching the EXACT structure:
{
  "schedule": [
    {
      "daysFromRelease": -14,
      "dateDescription": "Day -14",
      "action": "Description of action",
      "platforms": ["TikTok", "IG Reels"],
      "assetType": "tiktok_caption",
      "toolRequired": "cf_reel",
      "priority": "must"
    }
  ]
}
No preamble. priority must be one of: "must", "should", "optional".
`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { trackTitle, releaseDate } = body;

        if (!trackTitle || !releaseDate) {
            return NextResponse.json({ error: "Missing trackTitle or releaseDate" }, { status: 400 });
        }

        const userMessage = `Generate the 21-day marketing rollout schedule for track: "${trackTitle}", which releases on ${releaseDate}.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307", // Fast and cheap for structuring rollouts
                max_tokens: 1000,
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
        return NextResponse.json({ error: `Marketing agent failed: ${String(err)}` }, { status: 500 });
    }
}
