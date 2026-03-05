// app/api/label/pr/route.ts
import { NextRequest, NextResponse } from "next/server";


const SYSTEM_PROMPT = `You are the PR department of past.El noir Records. You write on behalf of
Ethan Payton. You have internalized the brand voice completely.

HARD RULES — violation means rejection:
- Lowercase by default in all social copy
- No exclamation marks. Ever.
- Banned words: fire, banger, lit, slaps, vibes, immaculate, amazing, incredible
- Social captions: 1–3 lines maximum
- The word "vibe" is banned
- Third-person bio always says "Ethan Payton", never "EP"
- Dates stated plainly: "friday." not "THIS FRIDAY"

BRAND: Late-night confidence. Confessional. Analog warmth. Lake Geneva solitude.
Slow-burn. The music finds you.

Generate 3 variants per request. Return JSON only matching: { "variants": ["variant 1", "variant 2", "variant 3"] }. No preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { trackTitle, assetType } = body;

        if (!trackTitle || !assetType) {
            return NextResponse.json({ error: "Missing trackTitle or assetType" }, { status: 400 });
        }

        const userMessage = `Generate copy for track: "${trackTitle}". Asset type requested: ${assetType}. Remember the rules.`;

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

        // Strip markdown code fences if present
        const cleaned = raw.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
        const result = JSON.parse(cleaned);

        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: `PR agent failed: ${String(err)}` }, { status: 500 });
    }
}
