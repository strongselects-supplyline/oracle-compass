import Link from "next/link";

const SECTIONS = [
  { cat: "The Plan", items: [
    { slug: "90-day-roadmap", icon: "📅", title: "90-Day Roadmap", desc: "April 18 → July 17, 2026. Three releases. One catalog." },
    { slug: "wartime-rhythm", icon: "⚡", title: "Wartime Rhythm", desc: "Full 90-day sovereign action schematic." },
  ]},
  { cat: "Sovereignty", items: [
    { slug: "the-protocol", icon: "🛡️", title: "The Protocol", desc: "The commitment architecture — 90 days to identity shift." },
    { slug: "sovereignty-stack", icon: "🧘", title: "Sovereignty Stack", desc: "10 practices: breathwork, somatic check-ins, movement, metabolic rules." },
    { slug: "body-codex", icon: "🦾", title: "Body Codex", desc: "Full kinetic chain diagnostic. Bilateral knee history, pelvic floor, progressions." },
    { slug: "rank-scroll", icon: "🥷", title: "Rank Scroll", desc: "Jonin → God of Shinobi. Six tiers of mastery." },
  ]},
  { cat: "Mind + Body", items: [
    { slug: "mudra-system", icon: "🙏", title: "Mudra System", desc: "State-diagnosis → hand seal → breathwork → body position." },
    { slug: "frequency-key", icon: "〜", title: "Frequency × Key", desc: "Brainwave entrainment × solfeggio × DAW production techniques." },
    { slug: "waking-mind", icon: "🧠", title: "Waking Mind Protocol", desc: "Metacognition, the 3-System Model, S3 activation interrupts." },
  ]},
  { cat: "Studio", items: [
    { slug: "mixing-codex", icon: "🎛️", title: "Sovereign Mixing Codex", desc: "9-stage protocol from textured sample production through final master." },
    { slug: "vocal-codex", icon: "🎙️", title: "S-Rank Vocal Codex", desc: "Pre-Flight Somatic Matrix, warmup sequences, recording protocols." },
  ]},
  { cat: "Business", items: [
    { slug: "spotify-ads", icon: "📈", title: "Spotify Ads Mastery", desc: "Comprehensive ad strategy with real CPMs, targeting, and scripts." },
  ]},
];

export default function DoctrinePage() {
  return (
    <>
      <div className="scroll-page-header">
        <div className="scroll-page-tag">Sovereign Scroll · Reference Library</div>
        <h1 className="scroll-page-title">📚 Doctrine</h1>
        <p className="scroll-page-sub">
          The complete sovereignty, studio, and strategy reference — ported from the Sovereign Scroll into Oracle Compass for unified, offline-capable access.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.cat} style={{ marginBottom: "24px" }}>
          <h2 className="scroll-h3">{section.cat}</h2>
          <div className="scroll-grid-2">
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={`/doctrine/${item.slug}`}
                className="scroll-grid-card"
                style={{ textDecoration: "none", transition: "all 0.15s", cursor: "pointer" }}
              >
                <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
                <div className="scroll-gc-title">{item.title}</div>
                <div className="scroll-gc-desc">{item.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
