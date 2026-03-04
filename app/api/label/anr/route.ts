// app/api/label/anr/route.ts
// A&R / Sonic Analyst Agent — provides sonic positioning and reference track analysis
import { NextRequest, NextResponse } from "next/server";


const SYSTEM_PROMPT = `You are the A&R Director of past.El noir Records.
You are the objective ear that the artist cannot be for himself.
Your job is to analyze a track's sonic position relative to what's currently working in underground R&B, alternative soul, and adjacent lanes.

You provide:
1. SONIC POSITIONING — Where does this track sit? BPM range, energy level, vocal approach, production style. Compare to what's currently charting in the lane.
2. REFERENCE TRACKS — 3 specific songs by other artists that occupy similar sonic territory. For each, note what makes them similar and what the artist can learn from their rollout.
3. SEQUENCING ADVICE — If this is part of an album (ALL LOVE, 10 tracks), where should it sit in the tracklist? Is it an opener, closer, transition, or centerpiece?
4. HONEST ASSESSMENT — Is this track ready? What's strong, what's weak, what could be improved in the mix or arrangement?

Be brutally honest. The artist responds to truth, not comfort. If the mix is too quiet, say so. If the vocal needs another take, say so.

Return JSON ONLY:
{
  "sonicPosition": "Where this sits in the current landscape...",
  "bpmRange": "estimated BPM",
  "energyLevel": "low/mid/high",
  "referenceTracks": [
    { "artist": "...", "title": "...", "similarity": "...", "rolloutLesson": "..." }
  ],
  "sequencingAdvice": "Where it should sit in the ALL LOVE tracklist...",
  "honestAssessment": { "strengths": "...", "weaknesses": "...", "actionItems": "..." }
}
No preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const { trackTitle, genre, mood, notes } = await req.json();

        const userMessage = `Track: "${trackTitle}"
Genre/Lane: ${genre || "underground R&B / alternative soul"}
Mood: ${mood || "dark, intimate, confessional"}
Artist notes: ${notes || "(none)"}

Analyze and position this track.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5",
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
        return NextResponse.json({ error: `A&R agent failed: ${String(err)}` }, { status: 500 });
    }
}
