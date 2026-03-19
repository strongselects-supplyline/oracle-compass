"use client";

import { useEffect, useState } from "react";
import { getTrackLabelData } from "@/lib/labelStore";
import { getDynamicReleases } from "@/lib/releases";

type AgentHealth = {
  copy: { count: number; canonical: number; status: "GREEN" | "AMBER" | "RED" };
  creative: { count: number; canonical: number; status: "GREEN" | "AMBER" | "RED" };
  anr: { has: boolean; status: "GREEN" | "AMBER" | "RED" };
  ops: { complete: number; total: number; status: "GREEN" | "AMBER" | "RED" };
};

export default function AgentStatus({ trackTitle }: { trackTitle: string }) {
  const [health, setHealth] = useState<AgentHealth | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTrackLabelData(trackTitle);
      const releases = await getDynamicReleases();
      const release = releases.find(r => r.title === trackTitle);

      const copyCount = data.copyVariants.length;
      const copyCanonical = data.copyVariants.filter(v => v.isCanonical).length;
      const creativeCount = data.creativeAssets.length;
      const creativeCanonical = data.creativeAssets.filter(a => a.isCanonical).length;
      const hasAnR = !!data.sonicProfile;

      // Ops: count registration completions
      let opsComplete = 0;
      const opsTotal = 6;
      if (release) {
        const d = release.contentDeliverables;
        if (d.isrcPulled) opsComplete++;
        if (d.ascapRegistered) opsComplete++;
        if (d.mlcRegistered) opsComplete++;
        if (d.songtrustRegistered) opsComplete++;
        if (d.musixmatchSubmitted) opsComplete++;
        if (d.instrumentalRendered) opsComplete++;
      }

      setHealth({
        copy: {
          count: copyCount,
          canonical: copyCanonical,
          status: copyCanonical > 0 ? "GREEN" : copyCount > 0 ? "AMBER" : "RED",
        },
        creative: {
          count: creativeCount,
          canonical: creativeCanonical,
          status: creativeCanonical > 0 ? "GREEN" : creativeCount > 0 ? "AMBER" : "RED",
        },
        anr: {
          has: hasAnR,
          status: hasAnR ? "GREEN" : "RED",
        },
        ops: {
          complete: opsComplete,
          total: opsTotal,
          status: opsComplete >= opsTotal ? "GREEN" : opsComplete > 0 ? "AMBER" : "RED",
        },
      });
    };
    load();
  }, [trackTitle]);

  if (!health) return null;

  const DOT_COLORS = { GREEN: "bg-green-500", AMBER: "bg-amber-500", RED: "bg-[#333]" };

  const agents = [
    { label: "Copy", detail: health.copy.canonical > 0 ? `${health.copy.canonical} selected` : health.copy.count > 0 ? `${health.copy.count} variants` : "Not generated", status: health.copy.status },
    { label: "Creative", detail: health.creative.canonical > 0 ? `${health.creative.canonical} selected` : health.creative.count > 0 ? `${health.creative.count} assets` : "Not generated", status: health.creative.status },
    { label: "A&R", detail: health.anr.has ? "Profile ready" : "Not run", status: health.anr.status },
    { label: "Ops", detail: `${health.ops.complete}/${health.ops.total} regs`, status: health.ops.status },
  ];

  return (
    <div className="flex gap-3 mb-6 text-xs font-bold tracking-widest text-[#888] uppercase bg-[#0a0a0a] p-3 rounded overflow-x-auto hide-scrollbar">
      {agents.map(a => (
        <div key={a.label} className="flex items-center gap-1.5 whitespace-nowrap">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${DOT_COLORS[a.status]}`} />
          <span>{a.label}: {a.detail}</span>
        </div>
      ))}
    </div>
  );
}
