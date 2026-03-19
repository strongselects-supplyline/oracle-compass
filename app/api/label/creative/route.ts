// app/api/label/creative/route.ts
// Creative Department Agent — generates video treatments, cover art prompts, merch concepts
import { NextRequest, NextResponse } from "next/server";
import { BRAND_VOICE } from "@/lib/brandVoice";


const SYSTEM_PROMPT = `You are the Creative Director of past.El noir Records.
You translate sonic worlds into visual assets for Ethan Payton.

BRAND AESTHETIC CONSTRAINTS:
- Color palette: ${BRAND_VOICE.aesthetics.palette.primary}, ${BRAND_VOICE.aesthetics.palette.accent}, ${BRAND_VOICE.aesthetics.palette.background}, ${BRAND_VOICE.aesthetics.palette.highlight}
- Visual style: ${BRAND_VOICE.aesthetics.visual.join(", ")}
- Forbidden colors: ${BRAND_VOICE.aesthetics.palette.forbidden.join(", ")}
- References: ${BRAND_VOICE.aesthetics.references.aesthetic.join(", ")} — the WORLD-BUILDING approach, not the sound.

You produce three deliverables per track:

1. MUSIC VIDEO TREATMENT — A 3-act visual treatment with scene descriptions, mood references, and suggested locations. Each act should be 2-3 sentences. Think 35mm film, practical lighting, Lake Geneva solitude. If lyrics are provided, reference specific lyrical themes or moments.

2. COVER ART PROMPTS — 3 image generation prompts formatted for Midjourney/Flux. Each prompt should be specific, visual, and enforce the brand palette. No generic descriptions. Reference the sonic mood and lyrics.

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
    const { trackTitle, mood, lyricsSnippet, voiceExamples, sonicContext, copyAngle } = await req.json();

    // Build cross-agent context blocks
    let extraContext = '';
    if (voiceExamples && voiceExamples.length > 0) {
      extraContext += `\n\nVOICE LEARNING — The artist has selected and edited creative content before. Match their preferences:\n${voiceExamples.map((e: any) => `Original: "${e.original}"\nArtist preferred: "${e.edited}"`).join('\n\n')}`;
    }
    if (sonicContext) {
      extraContext += `\n\nVAULT CONTEXT (Sonic Data & Lyrics):\n${sonicContext}`;
    }
    if (copyAngle) {
      extraContext += `\n\nNARRATIVE DIRECTION (from Copy Vault):\n${copyAngle}`;
    }

    const userMessage = `Track: "${trackTitle}"${extraContext}\n\nGenerate the creative package.`;

    const fullSystem = SYSTEM_PROMPT + extraContext;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        system: fullSystem,
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
