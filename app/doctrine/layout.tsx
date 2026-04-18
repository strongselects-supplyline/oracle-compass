"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const DOCTRINE_NAV = [
  { cat: "The Plan" },
  { slug: "90-day-roadmap", icon: "📅", label: "90-Day Roadmap" },
  { slug: "wartime-rhythm", icon: "⚡", label: "Wartime Rhythm" },
  { divider: true },
  { cat: "Sovereignty" },
  { slug: "the-protocol", icon: "🛡️", label: "The Protocol" },
  { slug: "sovereignty-stack", icon: "🧘", label: "Sovereignty Stack" },
  { slug: "body-codex", icon: "🦾", label: "Body Codex" },
  { slug: "rank-scroll", icon: "🥷", label: "Rank Scroll" },
  { divider: true },
  { cat: "Mind + Body" },
  { slug: "mudra-system", icon: "🙏", label: "Mudra System" },
  { slug: "frequency-key", icon: "〜", label: "Frequency × Key" },
  { slug: "waking-mind", icon: "🧠", label: "Waking Mind" },
  { divider: true },
  { cat: "Studio" },
  { slug: "mixing-codex", icon: "🎛️", label: "Mixing Codex" },
  { slug: "vocal-codex", icon: "🎙️", label: "Vocal Codex" },
  { divider: true },
  { cat: "Business" },
  { slug: "spotify-ads", icon: "📈", label: "Spotify Ads" },
];

export default function DoctrineLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="doctrine-layout">
      {/* Sidebar */}
      <nav className="doctrine-sidebar">
        {DOCTRINE_NAV.map((item, i) => {
          if ("divider" in item) return <div key={`d-${i}`} className="doc-nav-divider" />;
          if ("cat" in item && !("slug" in item))
            return (
              <div key={`c-${i}`} className="doc-nav-cat">
                {item.cat}
              </div>
            );
          if ("slug" in item) {
            const active = pathname === `/doctrine/${item.slug}`;
            return (
              <Link
                key={item.slug}
                href={`/doctrine/${item.slug}`}
                className={`doc-nav-item ${active ? "active" : ""}`}
              >
                <span className="doc-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          }
          return null;
        })}
      </nav>

      {/* Content */}
      <main className="doctrine-content">{children}</main>
    </div>
  );
}
