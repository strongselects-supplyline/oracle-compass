"use client";

// app/practice/page.tsx — Mudras, Breathing, Vocal Warmup, Grounding
// Static reference page. No API calls. Expandable cards + inline timers.

import { useState, useEffect, useRef } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────

interface Card {
  id: string;
  emoji: string;
  name: string;
  sub: string;
  tags: string;
  timerSeconds?: number;
  timerLabel?: string;
  warning?: string;
  content: React.ReactNode;
}

function Steps({ items }: { items: { num: string | number; text: React.ReactNode }[] }) {
  return (
    <div style={{ marginTop: 12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
          <div style={{
            flexShrink: 0, width: 22, height: 22,
            background: "rgba(27,67,50,0.8)", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "var(--accent)", marginTop: 2, fontWeight: 700,
          }}>
            {item.num}
          </div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.65 }}>
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-block",
      background: "rgba(212,168,67,0.12)",
      color: "var(--accent)",
      border: "1px solid rgba(212,168,67,0.25)",
      fontSize: 10, letterSpacing: "0.08em",
      padding: "2px 8px", borderRadius: 20,
      marginTop: 10, marginRight: 4,
    }}>{label}</span>
  );
}

function Warning({ text }: { text: string }) {
  return (
    <div style={{
      background: "rgba(192,57,43,0.1)",
      border: "1px solid rgba(192,57,43,0.25)",
      borderRadius: 6, padding: "8px 12px",
      marginTop: 12, fontSize: 12,
      color: "#e87070", lineHeight: 1.6,
    }}>{text}</div>
  );
}

function CheckRow({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      display: "flex", gap: 12, padding: "10px 0",
      borderBottom: "1px solid var(--border)",
      fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%",
        background: "var(--accent)", flexShrink: 0, marginTop: 5,
      }} />
      <div><strong style={{ color: "var(--text-primary)" }}>{title}</strong> — {body}</div>
    </div>
  );
}

// ─── TIMER HOOK ────────────────────────────────────────────────────────────

function useTimer() {
  const [active, setActive] = useState<{ label: string; total: number; remaining: number; sub: string } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start(label: string, seconds: number, sub: string) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive({ label, total: seconds, remaining: seconds, sub });
    intervalRef.current = setInterval(() => {
      setActive(prev => {
        if (!prev) return null;
        if (prev.remaining <= 1) {
          clearInterval(intervalRef.current!);
          if ("vibrate" in navigator) navigator.vibrate([200, 100, 200]);
          return { ...prev, remaining: 0 };
        }
        return { ...prev, remaining: prev.remaining - 1 };
      });
    }, 1000);
  }

  function stop() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActive(null);
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return { active, start, stop };
}

function fmt(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

// ─── TIMER BUTTON ──────────────────────────────────────────────────────────

function TimerBtn({ label, seconds, sub, onStart }: { label: string; seconds: number; sub: string; onStart: (l: string, s: number, sub: string) => void }) {
  return (
    <button
      onClick={() => onStart(label, seconds, sub)}
      style={{
        display: "inline-block",
        background: "rgba(27,67,50,0.8)",
        color: "var(--accent)",
        border: "1px solid rgba(27,67,50,0.6)",
        padding: "8px 18px",
        fontSize: 13, borderRadius: 6,
        cursor: "pointer", marginTop: 12,
        letterSpacing: "0.06em",
        fontFamily: "inherit",
      }}
    >
      Start {label.toLowerCase()} timer
    </button>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────

export default function PracticePage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const timer = useTimer();

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id);

  const sections: { label: string; cards: Card[] }[] = [
    {
      label: "Body Check — run first",
      cards: [
        {
          id: "body-scan",
          emoji: "🔍",
          name: "Pre-Session Scan",
          sub: "60 seconds — before anything else",
          tags: "body check grounding awareness",
          content: (
            <div>
              <CheckRow title="Pelvic floor" body="Is it gripped? Let it soften. Don't force — just notice and invite release." />
              <CheckRow title="Jaw" body="Clenched? Teeth touching? Let lips stay closed but teeth separate slightly. Tongue off roof of mouth." />
              <CheckRow title="Shoulders" body="Elevated toward ears? Roll back and down once. Don't hold the correction." />
              <CheckRow title="Neck" body="Head forward? Gently retract chin. Imagine the back of your skull lifting toward the ceiling." />
              <CheckRow title="Breath" body="Chest or belly? Take one slow belly breath. Feel ribs expand sideways." />
              <CheckRow title="Eyes" body="Strained? Soft gaze. Peripheral vision on. You're safe." />
            </div>
          ),
        },
      ],
    },
    {
      label: "Breathing",
      cards: [
        {
          id: "box",
          emoji: "🟦",
          name: "Box Breathing",
          sub: "4-4-4-4 — calm, focus, reset",
          tags: "breathing box calm focus nervous system",
          timerSeconds: 4 * 60,
          timerLabel: "Box Breathing",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Regulates the nervous system. Use before recording, before performing, after a rough day.
              </p>
              <Steps items={[
                { num: 1, text: "Inhale through nose — 4 counts" },
                { num: 2, text: "Hold — 4 counts" },
                { num: 3, text: "Exhale through mouth — 4 counts" },
                { num: 4, text: "Hold — 4 counts" },
                { num: "↺", text: "Repeat 4–8 rounds (2–4 min)" },
              ]} />
              <Tag label="nervous system" /><Tag label="pre-session" />
            </>
          ),
        },
        {
          id: "478",
          emoji: "🌙",
          name: "4-7-8 Breathing",
          sub: "Sleep, anxiety, deep calm",
          tags: "breathing 478 sleep anxiety parasympathetic",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Activates parasympathetic fast. Good for before sleep or when anxiety is running.
              </p>
              <Steps items={[
                { num: 1, text: "Inhale through nose — 4 counts" },
                { num: 2, text: "Hold — 7 counts" },
                { num: 3, text: <span>Exhale through mouth <em>(audible whoosh)</em> — 8 counts</span> },
                { num: "↺", text: "4 cycles max to start. Work up to 8." },
              ]} />
              <Tag label="sleep" /><Tag label="anxiety" /><Tag label="parasympathetic" />
            </>
          ),
        },
        {
          id: "wimhof",
          emoji: "⚡",
          name: "Wim Hof (Simplified)",
          sub: "Energy, activation, cold prep",
          tags: "breathing wim hof energy activation",
          timerSeconds: 5 * 60,
          timerLabel: "Wim Hof Round",
          warning: "⚠️ Seated or lying down only. Never while driving. Tingling/lightheadedness is normal.",
          content: (
            <>
              <Steps items={[
                { num: 1, text: "30 deep, powerful breaths — inhale fully, exhale without forcing. Fast pace (~1/sec)." },
                { num: 2, text: "After 30th exhale: hold breath as long as comfortable (1–2+ min)." },
                { num: 3, text: "Inhale fully and hold 15 seconds. Release." },
                { num: "↺", text: "Repeat 3–4 rounds." },
              ]} />
              <Tag label="energy" /><Tag label="activation" />
            </>
          ),
        },
      ],
    },
    {
      label: "Mudras — hand gestures",
      cards: [
        {
          id: "gyan",
          emoji: "☝️",
          name: "Gyan Mudra",
          sub: "Knowledge, focus, clarity",
          tags: "mudra gyan knowledge focus clarity meditation",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Index fingertip touches thumb tip. Other three fingers extended and relaxed. Palms face up, resting on knees.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Use during meditation, writing sessions, or any creative work requiring mental clarity. Most common mudra in practice.
              </p>
              <Tag label="focus" /><Tag label="clarity" /><Tag label="meditation" />
            </>
          ),
        },
        {
          id: "chin",
          emoji: "🤏",
          name: "Chin Mudra",
          sub: "Consciousness, receptivity",
          tags: "mudra chin consciousness awareness receptive grounding",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Same as Gyan but palms face <em>down</em>. Grounding quality. Receptive rather than projecting.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Use when you need to receive — listening, absorbing input, integrating feedback.
              </p>
              <Tag label="grounding" /><Tag label="receptive" />
            </>
          ),
        },
        {
          id: "prana",
          emoji: "🖐️",
          name: "Prana Mudra",
          sub: "Energy, vitality, life force",
          tags: "mudra prana energy vitality life force",
          timerSeconds: 15 * 60,
          timerLabel: "Prana Mudra",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Ring finger and pinky touch thumb tip together. Index and middle fingers extended straight.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Activates energy. Good for low-energy states, lethargy, before a DoorDash block when motivation is low.
              </p>
              <Tag label="energy" /><Tag label="vitality" />
            </>
          ),
        },
        {
          id: "apana",
          emoji: "🌱",
          name: "Apana Mudra",
          sub: "Release, grounding, cleansing",
          tags: "mudra apana grounding release lower body pelvic",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Middle finger and ring finger touch thumb tip. Index and pinky extended.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Downward-moving energy. Releasing what doesn&apos;t serve. Pelvic floor tension, emotional holding, stuck energy.
              </p>
              <Tag label="release" /><Tag label="grounding" /><Tag label="pelvic" />
            </>
          ),
        },
        {
          id: "dhyana",
          emoji: "🙏",
          name: "Dhyana Mudra",
          sub: "Deep meditation, stillness",
          tags: "mudra dhyana meditation deep calm stillness",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Right hand rests in left, both palms up, thumbs lightly touching to form an oval. Held in the lap.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Full meditation posture. Use for longer sits (10+ minutes). Promotes complete stillness.
              </p>
              <Tag label="meditation" /><Tag label="stillness" />
            </>
          ),
        },
        {
          id: "surya",
          emoji: "☀️",
          name: "Surya Mudra",
          sub: "Confidence, fire, transformation",
          tags: "mudra surya sun fire confidence performance transformation",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Ring finger folds down to touch base of thumb. Thumb gently presses on top. Others extended.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
                Fire element. Use before performing, recording vocals, or any moment requiring presence and power.
              </p>
              <Tag label="confidence" /><Tag label="fire" /><Tag label="performance" />
            </>
          ),
        },
      ],
    },
    {
      label: "Vocal Warmup — 5 min",
      cards: [
        {
          id: "vocal",
          emoji: "🎤",
          name: "5-Minute Vocal Routine",
          sub: "Before any recording session",
          tags: "vocal warmup singing recording session",
          timerSeconds: 5 * 60,
          timerLabel: "Vocal Warmup",
          warning: "Neck tension = jaw/tongue clamp = back off. Warm up until you feel forward resonance, not throat effort.",
          content: (
            <>
              <Steps items={[
                { num: 1, text: <span><strong>Jaw release</strong> (30s) — Open wide, massage masseter muscles. Yawn exaggeratedly 3×.</span> },
                { num: 2, text: <span><strong>Lip trills</strong> (30s) — Blow air through closed lips (motorboat). Slide up/down your range while trilling.</span> },
                { num: 3, text: <span><strong>Humming</strong> (60s) — Closed lips, feel vibration in chest then nose. "Mmm" on comfortable note. Slide up gently.</span> },
                { num: 4, text: <span><strong>Sirens</strong> (60s) — "WeeEEEooo" — sweep low to high and back. Falsetto is fine. No pushing.</span> },
                { num: 5, text: <span><strong>Staccato scales</strong> (60s) — "Ha ha ha ha ha" up a 5-note scale. Light. Bright. Like laughing.</span> },
                { num: 6, text: <span><strong>Resonance check</strong> (30s) — Sing a phrase from one of your songs. Notice tension. Soften it.</span> },
              ]} />
              <Tag label="vocals" /><Tag label="recording" />
            </>
          ),
        },
      ],
    },
    {
      label: "Grounding Ritual",
      cards: [
        {
          id: "grounding",
          emoji: "🌿",
          name: "Pre-Session Grounding",
          sub: "3 min — creates the container",
          tags: "grounding ritual ceremony pre-session presence",
          timerSeconds: 3 * 60,
          timerLabel: "Grounding",
          content: (
            <>
              <Steps items={[
                { num: 1, text: "Sit. Feet flat. Spine tall without rigid. Close eyes." },
                { num: 2, text: "Body scan top-down (30s): scalp → face → throat → chest → belly → pelvis → legs → feet." },
                { num: 3, text: "Three slow breaths. On each exhale, imagine roots from the base of your spine into the floor." },
                { num: 4, text: <span>State intention aloud or in mind: <em>&ldquo;I&apos;m here to create. The system handles the rest.&rdquo;</em></span> },
                { num: 5, text: "Open eyes. You're in the session." },
              ]} />
              <Tag label="ritual" /><Tag label="presence" />
            </>
          ),
        },
        {
          id: "54321",
          emoji: "👁️",
          name: "5-4-3-2-1 Senses",
          sub: "Acute anxiety or dissociation reset",
          tags: "54321 anxiety grounding senses emergency reset",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Name out loud (or mentally) — forces present-moment focus:
              </p>
              <Steps items={[
                { num: 5, text: <span>Things you can <strong>see</strong></span> },
                { num: 4, text: <span>Things you can <strong>touch / feel</strong></span> },
                { num: 3, text: <span>Things you can <strong>hear</strong></span> },
                { num: 2, text: <span>Things you can <strong>smell</strong></span> },
                { num: 1, text: <span>Thing you can <strong>taste</strong></span> },
              ]} />
              <Tag label="anxiety" /><Tag label="reset" /><Tag label="emergency" />
            </>
          ),
        },
      ],
    },
    {
      label: "Qigong & Movement",
      cards: [
        {
          id: "zhanzhuang",
          emoji: "🌳",
          name: "Zhan Zhuang (Standing Tree)",
          sub: "2–5 min — structural reset",
          tags: "qigong standing tree posture root grounding",
          timerSeconds: 3 * 60,
          timerLabel: "Standing Tree",
          warning: "Left knee — avoid full lock-out under load. Soft knee is protective, not a limitation.",
          content: (
            <>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginTop: 12 }}>
                Foundational Qigong standing posture. Builds body awareness, releases tension patterns, establishes root.
              </p>
              <Steps items={[
                { num: 1, text: "Stand feet shoulder-width. Knees slightly soft (not locked). Weight even." },
                { num: 2, text: "Arms: raise to chest height as if hugging a large ball. Elbows slightly below wrists. Hands relaxed." },
                { num: 3, text: "Relax face, jaw, throat. Tongue tip touches roof of mouth lightly." },
                { num: 4, text: "Breathe naturally into belly. Feel weight through feet. Don't force stillness — just notice." },
                { num: 5, text: "Hold for 2–5 min. Body will shake — that's normal. Energy moving." },
              ]} />
              <Tag label="posture" /><Tag label="qigong" /><Tag label="root" />
            </>
          ),
        },
        {
          id: "silkreeling",
          emoji: "🌀",
          name: "Silk Reeling (Simple)",
          sub: "Spinal mobility, flow state entry",
          tags: "silk reeling qigong movement flow spine mobility",
          content: (
            <>
              <Steps items={[
                { num: 1, text: "Stand, feet shoulder-width. Shift weight to one side as one arm circles out, other circles in. Slow and continuous." },
                { num: 2, text: "Movement initiates from the waist — arms follow the torso, not the other way." },
                { num: 3, text: "Imagine unwinding a silk thread from your arm — continuous, no breaks in movement." },
                { num: 4, text: "1–2 minutes each direction. No forcing. If it feels mechanical, slow down more." },
              ]} />
              <Tag label="flow" /><Tag label="spine" /><Tag label="mobility" />
            </>
          ),
        },
      ],
    },
  ];

  // ── FILTER ──────────────────────────────────────────────────────────────
  const q = query.toLowerCase().trim();
  const filtered = sections.map(s => ({
    ...s,
    cards: s.cards.filter(c =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.sub.toLowerCase().includes(q) ||
      c.tags.toLowerCase().includes(q)
    ),
  })).filter(s => s.cards.length > 0);

  return (
    <div className="page">
      <div className="page-inner" style={{ paddingBottom: 24 }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.2em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6 }}>
            PRACTICE
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
            Mudras & Techniques
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Body check → breathe → ground → create.
          </p>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search techniques..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontSize: 14,
            padding: "10px 14px",
            borderRadius: 10,
            outline: "none",
            marginBottom: 24,
            fontFamily: "inherit",
          }}
        />

        {/* Sections */}
        {filtered.map(section => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <p style={{
              fontSize: 9, fontWeight: 800,
              letterSpacing: "0.2em", color: "var(--text-muted)",
              textTransform: "uppercase", marginBottom: 8, marginTop: 20,
            }}>
              {section.label}
            </p>

            {section.cards.map(card => {
              const isOpen = openId === card.id;
              return (
                <div
                  key={card.id}
                  className="card"
                  style={{
                    padding: 0, marginBottom: 8, overflow: "hidden",
                    borderColor: isOpen ? "var(--accent)" : "var(--border)",
                    transition: "border-color 0.15s",
                  }}
                >
                  {/* Card header */}
                  <button
                    onClick={() => toggle(card.id)}
                    style={{
                      width: "100%", background: "none", border: "none",
                      padding: "14px 16px",
                      display: "flex", alignItems: "center",
                      justifyContent: "space-between", cursor: "pointer",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
                      <span style={{ fontSize: 22 }}>{card.emoji}</span>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>
                          {card.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, fontStyle: "italic" }}>
                          {card.sub}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      color: "var(--text-muted)", fontSize: 13, flexShrink: 0, marginLeft: 12,
                      transform: isOpen ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s",
                    }}>▾</span>
                  </button>

                  {/* Card body */}
                  {isOpen && (
                    <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border)" }}>
                      {card.warning && <Warning text={card.warning} />}
                      {card.content}
                      {card.timerSeconds && (
                        <button
                          onClick={() => timer.start(card.timerLabel!, card.timerSeconds!, card.sub)}
                          style={{
                            display: "inline-block",
                            background: "rgba(27,67,50,0.8)",
                            color: "var(--accent)",
                            border: "1px solid rgba(27,67,50,0.6)",
                            padding: "8px 18px", fontSize: 13,
                            borderRadius: 6, cursor: "pointer",
                            marginTop: 12, letterSpacing: "0.06em",
                            fontFamily: "inherit",
                          }}
                        >
                          Start {fmt(card.timerSeconds)} timer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginTop: 40 }}>
            No results for &ldquo;{query}&rdquo;
          </p>
        )}

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 32, letterSpacing: "0.1em" }}>
          past.El — Create till 30.
        </p>
      </div>

      {/* Timer overlay */}
      {timer.active && (
        <>
          <div
            onClick={timer.stop}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.92)", zIndex: 200,
            }}
          />
          <div style={{
            position: "fixed", inset: 0, zIndex: 201,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: 24,
          }}>
            <p style={{
              fontSize: 11, letterSpacing: "0.18em",
              color: "var(--accent)", textTransform: "uppercase", marginBottom: 12,
            }}>
              {timer.active.label}
            </p>
            <p style={{
              fontSize: timer.active.remaining === 0 ? 64 : 72,
              letterSpacing: "0.04em",
              color: timer.active.remaining === 0 ? "var(--accent)" : "var(--text-primary)",
              lineHeight: 1, fontWeight: 300,
            }}>
              {timer.active.remaining === 0 ? "✓" : fmt(timer.active.remaining)}
            </p>
            {timer.active.sub && (
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 10, fontStyle: "italic" }}>
                {timer.active.sub}
              </p>
            )}
            <button
              onClick={timer.stop}
              style={{
                marginTop: 36, background: "none",
                border: "1px solid var(--border)",
                color: "var(--text-muted)", fontFamily: "inherit",
                fontSize: 13, padding: "10px 28px",
                borderRadius: 6, cursor: "pointer",
                letterSpacing: "0.06em",
              }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  );
}
