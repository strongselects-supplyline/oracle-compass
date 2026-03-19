// app/api/label/pr/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PROJECTS, LOOSIES } from "@/lib/studioData";

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

function buildVoiceBlock(voiceExamples: { original: string; edited: string }[]): string {
    if (!voiceExamples || voiceExamples.length === 0) return '';
    return `\n\nVOICE LEARNING — The artist has edited past generated copy. The delta between original and edited IS their voice. Match it exactly:\n${voiceExamples.map(e => `Original: "${e.original}"\nArtist preferred: "${e.edited}"`).join('\n\n')}`;
}

function buildCrossAgentBlock(sonicContext: any, visualDirection: string | null): string {
    const parts: string[] = [];
    if (sonicContext) {
        parts.push(`SONIC CONTEXT: ${sonicContext.bpm || '?'} BPM, mood: ${(sonicContext.moodTags || []).join(', ')}`);
    }
    if (visualDirection) {
        parts.push(`VISUAL DIRECTION: ${visualDirection}`);
    }
    return parts.length > 0 ? `\n\nCROSS-AGENT CONTEXT:\n${parts.join('\n')}` : '';
}

/** Build a human-readable sonic fingerprint from Cyanite data for AI context. */
function buildTrackContext(trackTitle: string): string {
    // Search across all projects
    for (const project of PROJECTS) {
        const track = project.tracks.find(
            t => t.title.toLowerCase() === trackTitle.toLowerCase()
        );
        if (track) {
            const moods: string[] = [];
            if (track.sexy !== null && track.sexy > 0.5) moods.push(`sexy (${Math.round(track.sexy * 100)}%)`);
            if (track.chill !== null && track.chill > 0.5) moods.push(`chill (${Math.round(track.chill * 100)}%)`);
            if (track.romantic !== null && track.romantic > 0.5) moods.push(`romantic (${Math.round(track.romantic * 100)}%)`);
            if (track.happy !== null && track.happy > 0.5) moods.push(`happy (${Math.round(track.happy * 100)}%)`);
            if (track.energetic !== null && track.energetic > 0.3) moods.push(`energetic (${Math.round(track.energetic * 100)}%)`);

            const lines: string[] = [
                `TRACK: "${track.title}" — from the project "${project.name}"`,
                track.bpm ? `TEMPO: ${track.bpm} BPM` : '',
                track.key ? `KEY: ${track.key}` : '',
                moods.length > 0 ? `MOOD PROFILE (Cyanite): ${moods.join(', ')}` : '',
                track.releaseDate ? `RELEASE DATE: ${track.releaseDate}` : '',
                `PROJECT ROLE: ${project.role}`,
            ].filter(Boolean);

            return lines.join('\n');
        }
    }
    // Fallback: no match found
    return `TRACK: "${trackTitle}" — artist: Ethan Payton`;
}

export async function POST(req: NextRequest) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { trackTitle, assetType, voiceExamples, sonicContext, visualDirection } = body;

        if (!trackTitle || !assetType) {
            return NextResponse.json({ error: "Missing trackTitle or assetType" }, { status: 400 });
        }

        const trackContext = buildTrackContext(trackTitle);
        const voiceBlock = buildVoiceBlock(voiceExamples || []);
        const crossAgentBlock = buildCrossAgentBlock(sonicContext, visualDirection);

        const userMessage = `Generate copy for the following track. Asset type requested: ${assetType}.

${trackContext}

Write copy that reflects the actual sonic identity above — the tempo, mood profile, and project role should inform the emotional register of the copy. Remember all brand voice rules.`;

        const fullSystem = SYSTEM_PROMPT + voiceBlock + crossAgentBlock;

        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 600,
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
        return NextResponse.json({ error: `PR agent failed: ${String(err)}` }, { status: 500 });
    }
}
