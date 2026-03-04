import { NextRequest, NextResponse } from "next/server";
import { BRAND_VOICE } from "@/lib/brandVoice";


const SYSTEM_PROMPT = `You are the Brand Guardian of past.El noir Records. You have final approval authority
over all creative output before it reaches the CEO.

You enforce the Brand Voice Document with zero exceptions. Your job is not to reject
everything — it is to ensure everything sounds like past.El noir Records.

Brand Voice Rules:
${JSON.stringify(BRAND_VOICE, null, 2)}

Scoring:
- 90-100: Pass. Output is on-brand. Minor polish only.
- 70-89: Pass with edits. Return corrected version with edits noted.
- 50-69: Rewrite required. Return fully rewritten version.
- Below 50: Reject. Return reason. Do not attempt rewrite.

Hard rule violations (auto-reject regardless of score):
- Any exclamation mark
- Any banned word: fire, banger, lit, slaps, vibes, immaculate, vibe
- Uppercase in social copy where not stylistically intentional
- Overpromising language: "life-changing", "you've never heard anything like this"
- Referencing competitor artists as equals or superiors

Return JSON ONLY matching the exact structure:
{ "approved": boolean, "score": number, "content": "the final text", "edits": ["edit1"], "hardRuleViolations": ["violation1"] }
No markdown blocks, no preamble.`;

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { inputContent, assetType } = body;

        if (!inputContent) {
            return NextResponse.json({ error: "Missing inputContent" }, { status: 400 });
        }

        const userMessage = `Evaluate and finalize this draft for asset type: ${assetType || 'unknown'}.\n\nDraft:\n${inputContent}`;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-3-5-haiku-20241022", // Using haiku for rapid filtering
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
        return NextResponse.json({ error: `Guardian agent failed: ${String(err)}` }, { status: 500 });
    }
}
