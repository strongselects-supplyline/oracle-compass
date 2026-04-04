"use client";

import { useEffect, useState } from "react";
import { getDynamicReleases } from "@/lib/releases";
import { getMakeModeWeek } from "@/lib/oracle";
import { PROJECTS } from "@/lib/studioData";


function getPhasePercent(): number {
  const makeStart = Date.UTC(2026, 2, 1);
  const pushEnd = Date.UTC(2026, 3, 24);
  const now = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const total = pushEnd - makeStart;
  const elapsed = Math.max(0, Math.min(now - makeStart, total));
  return Math.round((elapsed / total) * 100);
}

export default function BrainPage() {
  const [uploadedSingles, setUploadedSingles] = useState(0);
  const [albumTracksReady, setAlbumTracksReady] = useState(0);
  const week = getMakeModeWeek();
  const phasePercent = getPhasePercent();
  const apr3Done = Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) >= Date.UTC(2026, 3, 3);

  const currentPhase =
    phasePercent < 45 ? "MAKE" :
      phasePercent < 75 ? "SHIP" : "PUSH";

  useEffect(() => {
    // Dynamic — reflects Oracle status updates
    getDynamicReleases().then(releases => {
      setUploadedSingles(releases.filter(s => s.status === "live").length);
    });
    // Count ALL LOVE album tracks that are mixed or mastered
    const allLove = PROJECTS.find(p => p.id === "all-love");
    if (allLove) {
      const ready = allLove.tracks.filter(t => ["mastered", "on_album", "album_live"].includes(t.status)).length;
      setAlbumTracksReady(ready);
    }
  }, []);

  return (
    <main className="page animate-fade-in">
      <div className="page-inner">

        {/* ── Mode Declaration ── */}
        <div className="mb-10">
          <h1 className="text-5xl font-black tracking-tight mb-2 leading-none">MAKE MODE</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-medium">
            Studio is primary. Everything else is Track 2.<br />
            Mar 1 → Apr 24
          </p>
        </div>

        {/* ── Phase Bar ── */}
        <div className="mb-12">
          <div className="waterfall-bar mb-3" style={{ height: "8px", borderRadius: "4px" }}>
            <div className="waterfall-fill bg-amber-500" style={{ width: `${phasePercent}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-black tracking-[0.15em] text-[#555] uppercase">
            <span className={currentPhase === "MAKE" ? "text-amber-400" : ""}>MAKE</span>
            <span className={currentPhase === "SHIP" ? "text-amber-400" : ""}>SHIP</span>
            <span className={currentPhase === "PUSH" ? "text-amber-400" : ""}>PUSH</span>
          </div>
          <p className="text-[10px] text-amber-500 mt-2 font-black tracking-widest uppercase text-center">
            ↑ Week {week} of 5
          </p>
        </div>

        {/* ── Exit Criteria ── */}
        <div className="card mb-14">
          <p className="text-[10px] font-black text-[#555] mb-4 uppercase tracking-widest">
            MAKE MODE closes when:
          </p>
          <ExitLine
            done={uploadedSingles >= 4}
            label={`4 singles uploaded (${uploadedSingles}/4)`}
          />
          <ExitLine done={albumTracksReady >= 4} label={`4 EP tracks uploaded (${albumTracksReady}/4)`} />
          <ExitLine done={apr3Done} label={`Apr 3 — pre-release milestone`} />
        </div>

        {/* ── Philosophical Anchors ── */}
        <div className="space-y-8 mb-12">
          <Anchor text="Done is the tribute." />
          <Anchor text="Every move must compound." />
          <Anchor text="The anesthesia phase is over." />
          <div>
            <Anchor text="You are the Jinchuriki." />
            <p className="text-[#888] text-base font-medium leading-relaxed mt-3 ml-1">
              Master the seal.<br />
              Channel the power.<br />
              <span className="text-[#666] mt-1 block">ALL LOVE is the output.</span>
            </p>
          </div>
          <div>
            <Anchor text="The mind is an organ. Not an identity." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Observe it. Don&apos;t become it.<br />
              <span className="text-[11px] text-[#555] italic">When stuck: &ldquo;What is my mind doing right now?&rdquo;</span>
            </p>
          </div>
          <div>
            <Anchor text="Design for the worst case. Be surprised by the rest." />
            <p className="text-[#888] text-sm font-medium leading-relaxed mt-3 ml-1">
              Strategy based on 90% chance of success is a fragile strategy.<br />
              <span className="text-[11px] text-[#555] italic">Worst-case first. Then act.</span>
            </p>
          </div>
        </div>

        {/* ── NSDR Recovery Protocol ── */}
        <div className="card mb-10">
          <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-4">Recovery Protocol</p>
          <div className="space-y-0">
            {[
              { step: "Morning: Delay first meal", note: "IF window = repair state" },
              { step: "10-20min NSDR / Yoga Nidra", note: "After depleted sessions — replenishes dopamine faster than caffeine" },
              { step: "Observer mode interrupt", note: "\"What is my mind doing?\" — not \"Why am I like this?\"" },
              { step: "Creatine 5g daily", note: "20-25g when sleep-deprived (cognitive rescue protocol)" },
              { step: "No social media during reset window", note: "Retriggers the drain. Open after, not during." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
                <span className="text-amber-500 font-black text-[10px] flex-shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <div className="text-xs font-bold text-white">{item.step}</div>
                  <div className="text-[10px] text-[#444] mt-0.5">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── BLITZKRIEG PROTOCOL ── */}
        <BlitzkriegProtocol />

        {/* ── TEXTURED PRODUCTION ── */}
        <TexturedProduction />

        {/* ── Mission Statement ── */}
        <div className="border-t border-[#1e1e1e] pt-8 pb-4">
          <p className="text-[10px] font-black tracking-[0.15em] text-[#666] uppercase leading-relaxed">
            Sovereign Creator. Zero Dependency.<br />
            Zero-Cost Stack. S-Tier standard.<br />
            Every move compounds relentlessly into the next.
          </p>
        </div>

      </div>
    </main>
  );
}

function Anchor({ text }: { text: string }) {
  return (
    <p className="text-2xl font-black tracking-tight leading-tight text-white">{text}</p>
  );
}

function ExitLine({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#1e1e1e] last:border-0">
      <span className={`text-base font-black flex-shrink-0 ${done ? "text-green-500" : "text-[#333]"}`}>
        {done ? "✓" : "□"}
      </span>
      <span className={`text-sm font-semibold ${done ? "text-[#555] line-through" : "text-white"}`}>
        {label}
      </span>
    </div>
  );
}

function ScrollSection({ title, icon, accent, children }: { title: string; icon: string; accent: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(!open)}
        className="w-full card flex items-center justify-between p-4 transition-all active:scale-[0.98]"
        style={{ borderColor: open ? accent + "44" : "transparent" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <div className="text-left">
            <p style={{ color: accent }} className="text-xs font-black tracking-wider uppercase">{title}</p>
            <p className="text-[10px] text-[#555] mt-0.5">Tap to {open ? "collapse" : "expand"}</p>
          </div>
        </div>
        <span className="text-[#555] text-sm transition-transform" style={{ transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </button>
      {open && <div className="mt-2 space-y-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function BlitzkriegProtocol() {
  return (
    <ScrollSection title="Blitzkrieg Protocol" icon="⚡" accent="#ef4444">
      {/* Core Quote */}
      <div className="card" style={{ borderColor: "#ef444422" }}>
        <p className="text-sm font-black text-red-400 leading-snug italic">
          &quot;You can do more in 30 days with that tenacity blitzkrieg mindset than somebody might do in 3 years.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">— Manager who broke Young Dolph &amp; Travis Porter</p>
      </div>

      {/* Framework */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Framework</p>
        {[
          { num: "1", text: "Set a 30-day container", sub: "Hard start and stop date. Lightning war." },
          { num: "2", text: "Fill with touchpoints", sub: "Not one big thing — many stacked small things." },
          { num: "3", text: "Stack the perception", sub: "Make activity look bigger than it is. Promo run → looks like a tour." },
          { num: "4", text: "Numbers game", sub: "If 10% of 4,000 showed up, we'd have 400. That's easy." },
          { num: "5", text: "Present big, not small", sub: "Small asks get \"no.\" Big vision with revenue attached gets \"I'm in.\"" },
        ].map((item) => (
          <div key={item.num} className="flex items-start gap-3 py-2.5 border-b border-[#1a1a1a] last:border-0">
            <span className="text-red-500 font-black text-[10px] flex-shrink-0 mt-0.5">{item.num}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.text}</div>
              <div className="text-[10px] text-[#444] mt-0.5">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* The Dolph Blitz */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Young Dolph Blitz (30 Days)</p>
        {[
          "Media run across mix show DJs — Jackson MS → Charlotte NC",
          "Meet & greets in each city (even if 5 people show)",
          "Turn promo run into a \"tour\" flyer — perception amplification",
          "Hit biggest LOCAL artists in each city for features + collabs",
          "Music videos for each collab — content drops every Friday",
          "Press CDs, pass out at every club in every market",
          "DJ listening party — themed release event",
          "Custom merch for DJs (hoodies) — relationship capital",
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5">
            <span className="text-red-500/50 text-[10px] mt-0.5">→</span>
            <span className="text-[11px] text-[#aaa] font-medium">{item}</span>
          </div>
        ))}
        <div className="mt-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
          <p className="text-[11px] text-red-400 font-bold italic">&quot;Who is this guy? I&apos;m starting to see him everywhere.&quot;</p>
        </div>
      </div>

      {/* Travis Porter Origin */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">The Origin — No Budget Version</p>
        <div className="space-y-2">
          <p className="text-[11px] text-[#888] font-medium">$100 in the bank. First show: 5 people.</p>
          <p className="text-[11px] text-[#888] font-medium">Strategy: Comment on every single follower of the local DJ (4,000 people), from the artist page.</p>
          <p className="text-[11px] text-[#888] font-medium">Simple messages: &quot;Appreciate the follow. Wanted to show some love to your page.&quot;</p>
          <p className="text-[11px] text-white font-bold mt-3">Result: #1 unsigned artist on all of MySpace.</p>
        </div>
      </div>

      {/* Meta Principle */}
      <div className="card" style={{ borderColor: "#ef444422" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Meta Principle</p>
        <p className="text-sm font-black text-white leading-snug">
          Stack small, invisible moves until the cumulative effect feels inevitable.
        </p>
        <p className="text-[10px] text-[#555] mt-2">
          In promotion: 15 touchpoints in 30 days → &quot;I&apos;m seeing him everywhere.&quot;<br />
          In production: 8 subtle layers → &quot;This sounds like a record.&quot;
        </p>
      </div>

      {/* Anti-Hustle */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">Anti-Hustle Principle</p>
        <p className="text-[11px] text-[#888] font-medium italic">
          &quot;I slept till 8 this morning. Why? Because I needed sleep. If my stress levels are high, my creativity won&apos;t turn on. Somebody who feels good will run circles around me.&quot;
        </p>
        <p className="text-[11px] text-[#666] mt-2">
          If you blitz every play, you lose the game. Blitz strategically → break through.
        </p>
      </div>
    </ScrollSection>
  );
}

function TexturedProduction() {
  return (
    <ScrollSection title="Textured Sample Production" icon="🎛️" accent="#a855f7">
      {/* Core Quote */}
      <div className="card" style={{ borderColor: "#a855f722" }}>
        <p className="text-sm font-black text-purple-400 leading-snug italic">
          &quot;You almost don&apos;t hear them, you just feel them.&quot;
        </p>
        <p className="text-[10px] text-[#555] mt-2">Brent Faiyaz / SZA — Textured R&amp;B Sample Style</p>
      </div>

      {/* Signal Chain */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">FL Studio Signal Chain</p>
        {[
          { step: "1", title: "Foundation — Unique Preset", desc: "Analog Lab / FLEX. 64-82 BPM. Leave SPACE between notes — you're filling gaps with layers.", color: "#6ee7b7" },
          { step: "2", title: "Texture Layer", desc: "Bounce to audio → duplicate → pitch +12 semitones → stretch algorithm → add stereo width. Blend behind original.", color: "#60a5fa" },
          { step: "3", title: "Bass Layer", desc: "Separate channel. Let intro breathe WITHOUT bass, then drop it. Use glide/portamento for movement.", color: "#f472b6" },
          { step: "4", title: "Secondary Synth", desc: "Different plugin, different character. EQ cut below ~300Hz. Reverb → push to back. Auto-pan with slow LFO.", color: "#fbbf24" },
          { step: "5", title: "Foley & Natural Sounds", desc: "Cityscape, keys/bells (tuned to key), reversed foley for anticipation, cassette noise. Phaser for otherworldly feel.", color: "#c084fc" },
          { step: "6", title: "Vocal Texture (Optional)", desc: "Ambient chop — NOT consistent. Saturate (CamelCrusher), EQ back harshness. Delay throws → 100% wet → reverse the tail.", color: "#f97316" },
          { step: "7", title: "Master Processing", desc: "Compression (Fruity Limiter) → RC-20/Vinyl warmth → pitch shift ±2-5 cents → stereo width.", color: "#ef4444" },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-3 py-3 border-b border-[#1a1a1a] last:border-0">
            <span style={{ color: item.color }} className="font-black text-xs flex-shrink-0 mt-0.5">{item.step}</span>
            <div>
              <div className="text-xs font-bold text-white">{item.title}</div>
              <div className="text-[10px] text-[#555] mt-1 leading-relaxed">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Foley Deep Dive */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">Foley — The Secret Sauce</p>
        {[
          { type: "Cityscape / ambient", how: "Layer under everything at very low volume" },
          { type: "Keys / bells / metal", how: "Tune to track key, place on downbeats" },
          { type: "Reversed foley", how: "Creates anticipation — reverse and place before a hit" },
          { type: "Cassette / vinyl noise", how: "Constant low-level texture throughout" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-purple-500/60 text-[10px] mt-0.5 flex-shrink-0">◆</span>
            <div>
              <span className="text-[11px] font-bold text-[#ccc]">{item.type}</span>
              <span className="text-[10px] text-[#555] ml-1">— {item.how}</span>
            </div>
          </div>
        ))}
      </div>

      {/* The Final Move */}
      <div className="card" style={{ borderColor: "#a855f722" }}>
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-2">The Final Move</p>
        <p className="text-[11px] text-[#888] font-medium">
          After everything is bounced, shift the entire sample by a few <span className="text-purple-400 font-bold">cents</span> (not semitones).
        </p>
        <p className="text-[11px] text-[#666] mt-2">
          Makes it slightly detuned/warm — impossible to recreate exactly. The difference between &quot;sounds like a beat&quot; and &quot;sounds like a record.&quot;
        </p>
      </div>

      {/* FL Studio Equivalents */}
      <div className="card">
        <p className="text-[10px] font-black tracking-[0.18em] text-[#555] uppercase mb-3">FL Studio Plugin Map</p>
        {[
          { effect: "Compression", fl: "Fruity Limiter (compressor mode)" },
          { effect: "RC-20 style warmth", fl: "iZotope Vinyl (free) or RC-20" },
          { effect: "Saturation", fl: "CamelCrusher or Fruity Fast Dist" },
          { effect: "Pitch shift (cents)", fl: "Pitcher or Edison pitch shift" },
          { effect: "Stereo width", fl: "Fruity Stereo Shaper / Enhancer" },
          { effect: "Auto-pan", fl: "Fruity Panomatic (slow LFO)" },
          { effect: "Phaser", fl: "Fruity Phaser" },
          { effect: "Delay throws", fl: "Fruity Delay 3 (100% wet send)" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-[#1a1a1a] last:border-0">
            <span className="text-[11px] font-bold text-[#ccc]">{item.effect}</span>
            <span className="text-[10px] text-purple-400/70 font-medium">{item.fl}</span>
          </div>
        ))}
      </div>
    </ScrollSection>
  );
}
