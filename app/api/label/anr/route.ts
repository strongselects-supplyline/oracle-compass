// app/api/label/anr/route.ts
// A&R / Sonic Analyst Agent — provides sonic positioning and reference track analysis
import { NextRequest, NextResponse } from "next/server";


const SYSTEM_PROMPT = `You are the A&R Director of past.El noir Records.
You are the objective ear that the artist cannot be for himself.
Your job is to analyze a track's sonic position relative to what's currently working in underground R&B, alternative soul, and adjacent lanes.

IMPORTANT: The user message contains ACTUAL Cyanite analysis data (real BPM, key, mood scores) and may contain the full lyrics. These are GROUND TRUTH — do not guess or contradict them. Build your entire analysis FROM this data.

HOW TO USE THE DATA:
- SONIC DATA (BPM, key, mood scores) → drives your positioning, reference picks, and energy assessment.
- LYRICS (if provided) → mine them for emotional themes, recurring imagery, writing quality, and quotable lines. Connect lyrical themes to visual and marketing angles. If the lyrics are sexually charged, say so. If they're vulnerable, say so. Be specific — cite lines.
- MOOD SCORES → use the percentage breakdown to find the dominant emotional register. A track that's 69% sexy and 45% chill is NOT the same as one that's 87% sexy and 12% energetic. Be precise.

You provide:
1. SONIC POSITIONING — Where does this track sit? Use the actual BPM, key, and mood scores. Compare to what's currently charting in the lane. Name specific playlists where this fits.
2. REFERENCE TRACKS — 3 specific songs by other artists that occupy similar sonic territory. For each: what makes them similar, what the artist can learn from their rollout, and how this track differentiates.
3. LYRIC ANALYSIS — If lyrics are provided: dominant themes, strongest bars (quote them), emotional arc, and any marketable hooks or caption-worthy lines. If no lyrics provided, say so and skip.
4. SEQUENCING ADVICE — If this is part of an album (ALL LOVE, 10 tracks), where should it sit in the tracklist? Is it an opener, closer, transition, or centerpiece? Why?
5. HONEST ASSESSMENT — Is this track ready? Strengths, weaknesses, mix notes, arrangement suggestions. Be brutally honest — the artist responds to truth, not comfort.

Return JSON ONLY:
{
  "sonicPosition": "precise positioning using the real data...",
  "energyLevel": "low/mid/high",
  "referenceTracks": [
    { "artist": "...", "title": "...", "similarity": "...", "rolloutLesson": "..." }
  ],
  "lyricAnalysis": { "themes": "...", "strongestBars": ["..."], "marketableHooks": ["..."] },
  "sequencingAdvice": "Where it should sit and why...",
  "honestAssessment": { "strengths": "...", "weaknesses": "...", "actionItems": "..." }
}
No preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const { trackTitle, genre, mood, notes, sonicContext, lyricsContext } = await req.json();

        const userMessage = [
            sonicContext || `Track: "${trackTitle}"\nGenre/Lane: ${genre || "underground R&B / alternative soul"}\nMood: ${mood || "dark, intimate, confessional"}\nArtist notes: ${notes || "(none)"}`,
            lyricsContext || "",
            "\nAnalyze and position this track based on the data above.",
        ].filter(Boolean).join("\n");

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 1500,
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
            console.error("[A&R Agent] Failed to parse JSON:", cleaned.slice(0, 300));
            return NextResponse.json({ error: `A&R agent returned malformed JSON. Raw: ${cleaned.slice(0, 200)}` }, { status: 502 });
        }

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: `A&R agent failed: ${String(err)}` }, { status: 500 });
    }
}
