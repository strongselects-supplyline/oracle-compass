// app/api/label/image/route.ts
// Generates cover art using DALL-E 3 via OpenAI API based on vault context.
import { NextRequest, NextResponse } from "next/server";
import { BRAND_VOICE } from "@/lib/brandVoice";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "OPENAI_API_KEY not set" }, { status: 500 });

  try {
    const { trackTitle, sonicContext, direction } = await req.json();

    // Enforce strict brand rules in the prompt
    const prompt = `Album cover art for the track "${trackTitle}".
Direction: ${direction || "A cinematic, intimate, late-night scene."}
Sonic Profile: ${sonicContext || "dark R&B"}

CRITICAL BRAND AESTHETICS:
- Palette MUST heavily feature: Deep Emerald / Dark Green (#1a4a2e), Warm Gold / Amber (#d4a853), Midnight Navy / Black (#0a0a1a).
- Style: 35mm film photograph, heavy grain, analog warmth, low light, cinematic lighting.
- Mood: Intimate, solitary, Midwestern dusk. The vibe of driving alone at 3AM.
- FORBIDDEN: Do not use neon colors, hot pink, primary red, or clean/vector art. Do not use pure white backgrounds.
- Do NOT include text or typography on the image. Just the scene.

Make it look like a still from an indie film shot on Kodak Portra 800.`;

    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt.slice(0, 4000), // OpenAI limits
        n: 1,
        size: "1024x1024",
        style: "natural", // More photorealistic, less "AI" glossy
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("DALL-E Error:", err);
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
