// app/api/label/vision/route.ts
// Uses Claude 3.5 Sonnet's vision capabilities to extract a physical description of the artist from baseline photos.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    try {
        const { photos } = await req.json(); // Array of base64 data URLs

        if (!photos || photos.length === 0) {
            return NextResponse.json({ error: "No photos provided" }, { status: 400 });
        }

        // Claude format requires parsing out the MIME type and base64 content
        const imageContents = photos.map((dataUrl: string) => {
            const [metadata, base64] = dataUrl.split(",");
            const media_type = metadata.split(":")[1].split(";")[0];
            return {
                type: "image",
                source: {
                    type: "base64",
                    media_type,
                    data: base64
                }
            };
        });

        const prompt = `You are a master casting director and physical profiler. Provided are photos of a music artist.
Write an exceptionally detailed, purely physical description of this person. 

This description will be injected into DALL-E image generation prompts as the "Artist Appearance" constraint, so it needs to be highly descriptive of their immutable traits.

Include:
- Gender, approximate age, and assumed racial/ethnic background (for accurate skin tone & hair texture rendering).
- Facial structure (jawline, nose, cheekbones, eye shape).
- Facial hair exact style (e.g., "short dark faded beard" or "clean shaven").
- Hair length, style, and color (e.g., "tight dark buzzcut with a high skin fade").
- Build/physique (e.g., "broad shoulders, athletic build").

Do NOT include clothing, lighting, expression, or mood, as those will change per generated scene. 
Return ONLY the description text, 1-2 paragraphs max. No preamble.`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-6",
                max_tokens: 300,
                messages: [{
                    role: "user",
                    content: [
                        ...imageContents,
                        { type: "text", text: prompt }
                    ]
                }],
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("Vision Error:", err);
            return NextResponse.json({ error: "Vision extraction failed" }, { status: 500 });
        }

        const data = await res.json();
        const description = data.content[0]?.text ?? "";

        return NextResponse.json({ description });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
