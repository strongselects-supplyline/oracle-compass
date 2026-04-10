// app/api/brain-dump/route.ts
// Cognitive Dump Agent — parses unstructured brain dumps into structured Label OS operations.
// Follows the same Anthropic API pattern as Guardian and Creative agents.

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Cognitive Intake Processor for Label OS (Oracle Compass).

Your job is to receive raw, unstructured brain dumps — stream of consciousness, scattered thoughts, stress venting, creative ideas, logistics, anything — and parse them into a structured JSON payload that the system can act on.

You are NOT a therapist. You are NOT a chatbot. You are a parser. Extract signal from noise.

RULES:
1. Every brain dump contains at least ONE of: an action item, a body budget signal, a protocol adjustment, or catharsis.
2. If the user sounds exhausted, manic, or mentions sleep deprivation, flag body_budget_status as "redlining".
3. If the user mentions specific tasks (mix this, upload that, call someone), extract them as tasks.
4. If the user mentions changing a routine or protocol, extract as a protocol update.
5. The raw_log_summary should be 1-2 sentences capturing the emotional/operational state.
6. Be conservative with urgency. Only mark "high" if the user explicitly signals urgency or deadline pressure.

BODY BUDGET STATES:
- "nominal" — operating within normal parameters
- "elevated" — high energy, potentially productive but watch for burnout
- "redlining" — burnout signals detected (sleep loss, manic work, emotional flooding)
- "recovery" — user is deliberately resting or mentions needing to recover

Return JSON ONLY matching this exact structure:
{
  "body_budget_status": {
    "detected_state": "nominal",
    "confidence": 0.85,
    "signals": ["signal1"],
    "recommended_action": "short recommendation"
  },
  "extracted_tasks": [
    {
      "title": "task title",
      "priority": "high|medium|low",
      "pillar": "creative|business|body|ops",
      "context": "why this was extracted"
    }
  ],
  "protocol_updates": [
    {
      "target_system": "system name",
      "modification": "what to change",
      "reason": "why"
    }
  ],
  "raw_log_summary": "1-2 sentence summary of the dump's core state"
}
No markdown blocks, no preamble. JSON only.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { dumpText } = body;

    if (!dumpText || typeof dumpText !== "string" || dumpText.trim().length === 0) {
      return NextResponse.json({ error: "Missing or empty dumpText" }, { status: 400 });
    }

    // Truncate to prevent context window overflow (max ~4000 chars)
    const truncated = dumpText.slice(0, 4000);

    const userMessage = `Parse this brain dump into structured Label OS operations:\n\n---\n${truncated}\n---`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 800,
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

    let result;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("[Brain Dump Agent] Failed to parse JSON:", cleaned.slice(0, 300));
      return NextResponse.json(
        { error: `Brain Dump agent returned malformed JSON. Raw: ${cleaned.slice(0, 200)}` },
        { status: 502 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: `Brain Dump agent failed: ${String(err)}` }, { status: 500 });
  }
}
