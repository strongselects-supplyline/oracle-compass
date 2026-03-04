// app/api/label/creative/route.ts
// Creative Department Agent — generates video treatments, cover art prompts, merch concepts
import { NextRequest, NextResponse } from "next/server";
import { BRAND_VOICE } from "@/lib/brandVoice";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the Creative Director of past.El noir Records.
You translate sonic worlds into visual assets for Ethan Payton.

BRAND AESTHETIC CONSTRAINTS:
- Color palette: ${BRAND_VOICE.aesthetics.palette.primary}, ${BRAND_VOICE.aesthetics.palette.accent}, ${BRAND_VOICE.aesthetics.palette.background}, ${BRAND_VOICE.aesthetics.palette.highlight}
- Visual style: ${BRAND_VOICE.aesthetics.visual.join(", ")}
- Forbidden colors: ${BRAND_VOICE.aesthetics.palette.forbidden.join(", ")}
- References: ${BRAND_VOICE.aesthetics.references.aesthetic.join(", ")} — the WORLD-BUILDING approach, not the sound.

You produce three deliverables per track:

1. MUSIC VIDEO TREATMENT — A 3-act visual treatment with scene descriptions, mood references, and suggested locations. Each act should be 2-3 sentences. Think 35mm film, practical lighting, Lake Geneva solitude.

2. COVER ART PROMPTS — 3 image generation prompts formatted for Midjourney/Flux. Each prompt should be specific, visual, and enforce the brand palette. No generic descriptions.

3. MERCH CONCEPT — One premium merch item concept. Minimal. The coordinates of Lake Geneva (42.5917° N, 88.4334° W) are a recurring motif. No loud graphics.

Return JSON ONLY matching this exact structure:
{
  "videoTreatment": {
    "act1": "scene description...",
    "act2": "scene description...",
    "act3": "scene description..."
  },
  "coverArtPrompts": [
    "prompt 1...",
    "prompt 2...",
    "prompt 3..."
  ],
  "merchConcept": {
    "item": "Heavyweight hoodie",
    "description": "Design description..."
  }
}
No preamble. JSON only.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const { trackTitle, mood, lyricsSnippet } = await req.json();

        const userMessage = `Track: "${trackTitle}"
Mood/Vibe: ${mood || "dark, intimate, late-night R&B"}
Lyrics snippet: ${lyricsSnippet || "(not provided)"}

Generate the full creative package.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-3-haiku-20240307",
                max_tokens: 1200,
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
        return NextResponse.json({ error: `Creative agent failed: ${String(err)}` }, { status: 500 });
    }
}
