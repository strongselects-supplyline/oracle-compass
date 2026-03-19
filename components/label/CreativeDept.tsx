"use client";

import { useState, useEffect, useCallback } from "react";
import { setStoreValue, getStoreValue, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";
import {
  getTrackLabelData, saveTrackLabelData, selectCanonicalCreative,
  getVoiceExamples, getSonicProfile, getCanonicalCopy,
  type CreativeAsset, type TrackLabelData
} from "@/lib/labelStore";
import { getTrackAssets, buildFullTrackContext, buildCreativeContext, saveTrackCoverArt, getArtistAssets } from "@/lib/assetVault";

// ── Inline Editable Text ─────────────────────────────────────────────

function EditableText({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (!editing) {
    return (
      <div onClick={() => { setDraft(value); setEditing(true); }} className="cursor-text group">
        <p className="text-[13px] text-[#ccc] leading-relaxed">{value}</p>
        <p className="text-[9px] text-[#333] mt-1 group-hover:text-[#555] transition-colors">tap to edit</p>
      </div>
    );
  }

  return (
    <div>
      <textarea
        autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        className="w-full bg-[#111] text-sm text-white p-3 rounded-lg border border-amber-500/30 outline-none resize-none"
        rows={4}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={() => { onSave(draft); setEditing(false); }}
          className="text-[10px] font-black text-amber-500 px-3 py-1.5 border border-amber-500/30 rounded-lg active:scale-95">SAVE</button>
        <button onClick={() => { setDraft(value); setEditing(false); }}
          className="text-[10px] font-black text-[#555] px-3 py-1.5 border border-[#222] rounded-lg">CANCEL</button>
      </div>
    </div>
  );
}

// ── Asset Card ───────────────────────────────────────────────────────

function AssetCard({
  asset, label, trackTitle, copyFormat, copyLabel, onSelect, onGenerateImage
}: {
  asset: CreativeAsset; label: string; trackTitle: string;
  copyFormat?: (text: string) => string; copyLabel?: string;
  onSelect: (id: string, editedContent?: string) => void;
  onGenerateImage?: (promptText: string) => void;
}) {
  const text = asset.editedContent || asset.content;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const formatted = copyFormat ? copyFormat(text) : text;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If content is an image URL, render it
  const isImage = text.startsWith("http") || text.startsWith("data:image");

  return (
    <div className="rounded-xl p-4 mb-3 transition-all" style={{
      background: asset.isCanonical ? "rgba(0,230,118,0.04)" : "rgba(255,255,255,0.02)",
      border: asset.isCanonical ? "1px solid rgba(0,230,118,0.2)" : "1px solid rgba(255,255,255,0.06)",
    }}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black tracking-widest text-[#555]">{label}</span>
        {asset.isCanonical && (
          <span className="text-[9px] font-black text-green-500 tracking-widest">SELECTED ✓</span>
        )}
      </div>
      
      {isImage ? (
        <img src={text} alt="Generated cover" className="w-full h-auto aspect-square object-cover rounded-lg mb-3 border border-[#1a1a1a]" />
      ) : (
        <EditableText value={text} onSave={(newText) => onSelect(asset.id, newText)} />
      )}

      <div className="flex gap-2 mt-3">
        {!asset.isCanonical && (
          <button onClick={() => onSelect(asset.id)}
            className="text-[10px] font-black text-amber-500 px-3 py-1.5 border border-amber-500/30 rounded-lg active:scale-95">
            SELECT AS FINAL
          </button>
        )}
        <button onClick={handleCopy}
          className="text-[10px] font-black text-[#555] px-3 py-1.5 border border-[#222] rounded-lg hover:text-white transition-colors">
          {copied ? "✓ COPIED" : (copyLabel || "COPY")}
        </button>
        {onGenerateImage && !isImage && asset.type === "cover_art_prompt" && (
          <button onClick={() => onGenerateImage(text)}
            className="text-[10px] font-black text-[#d4a853] px-3 py-1.5 border border-[#d4a853]/50 bg-[#d4a853]/10 rounded-lg hover:text-white transition-colors">
            GEN IMAGE
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

type CreativePackage = {
  videoTreatment: { act1: string; act2: string; act3: string };
  coverArtPrompts: string[];
  merchConcept: { item: string; description: string };
};

export default function CreativeDept({ trackTitle }: { trackTitle: string }) {
  const [labelData, setLabelData] = useState<TrackLabelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const data = await getTrackLabelData(trackTitle);
    setLabelData(data);
  }, [trackTitle]);

  useEffect(() => { loadData(); }, [loadData]);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Pull vault data + cross-agent context
      const [voiceExamples, sonicProfile, canonicalCopy, vaultAssets] = await Promise.all([
        getVoiceExamples("video_treatment", 5),
        getSonicProfile(trackTitle),
        getCanonicalCopy(trackTitle, "spotify_pitch"),
        getTrackAssets(trackTitle),
      ]);

      // Collect past canonical creative selections for the feedback loop
      const pastCanonicals = (labelData?.creativeAssets || [])
        .filter(a => a.isCanonical)
        .map(a => a.editedContent || a.content);

      const res = await fetch("/api/label/creative", {
        method: "POST",
        body: JSON.stringify({
          trackTitle,
          voiceExamples,
          // Full vault context with past selections baked in
          sonicContext: buildCreativeContext(vaultAssets, pastCanonicals),
          copyAngle: canonicalCopy,
        })
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "Server error");
        throw new Error(`Creative agent error (${res.status}): ${errText.slice(0, 120)}`);
      }
      const pkgRaw = await res.json();
      if (pkgRaw.error) throw new Error(pkgRaw.error);
      const pkg: CreativePackage = pkgRaw;

      // Save raw to old key for compatibility
      await setStoreValue(`label_creative:${trackTitle}`, pkg);
      await logLabelCost(LABEL_COST_ESTIMATES.creative_brief);

      // Save to labelStore as CreativeAssets
      const data = await getTrackLabelData(trackTitle);
      const now = new Date().toISOString();
      const newAssets: CreativeAsset[] = [];

      // Video treatment as single asset (3 acts combined)
      const treatmentText = [pkg.videoTreatment?.act1, pkg.videoTreatment?.act2, pkg.videoTreatment?.act3]
        .filter(Boolean).map((a, i) => `ACT ${i + 1}: ${a}`).join("\n\n");
      if (treatmentText) {
        newAssets.push({ id: `video_treatment-${now}`, type: "video_treatment", content: treatmentText, isCanonical: false, editedContent: null, generatedAt: now });
      }

      // Cover art prompts
      for (let i = 0; i < (pkg.coverArtPrompts || []).length; i++) {
        newAssets.push({ id: `cover_art_prompt-${now}-${i}`, type: "cover_art_prompt", content: pkg.coverArtPrompts[i], isCanonical: false, editedContent: null, generatedAt: now });
      }

      // Merch concept
      if (pkg.merchConcept?.description) {
        newAssets.push({
          id: `merch_concept-${now}`, type: "merch_concept",
          content: `${pkg.merchConcept.item}: ${pkg.merchConcept.description}`,
          isCanonical: false, editedContent: null, generatedAt: now,
        });
      }

      // Replace non-canonical assets of same types, keep canonical
      const canonicalIds = new Set(data.creativeAssets.filter(a => a.isCanonical).map(a => a.id));
      data.creativeAssets = [
        ...data.creativeAssets.filter(a => canonicalIds.has(a.id)),
        ...newAssets,
      ];
      await saveTrackLabelData(data);
      await loadData();
    } catch (e: any) {
      console.error("Creative agent failed:", e);
      setError(e?.message || "Creative agent failed");
    }
    setLoading(false);
  };

  const generateCoverArt = async (specificPrompt?: string) => {
    setLoading(true);
    setError(null);
    try {
      const vaultAssets = await getTrackAssets(trackTitle);
      const direction = specificPrompt || await getCanonicalCopy(trackTitle, "spotify_pitch");
      const artistAssets = await getArtistAssets();

      // Feedback loop: pull past canonical cover art prompts
      const coverArtLabelData = await getTrackLabelData(trackTitle);
      const pastCanonicalPrompts = (coverArtLabelData.creativeAssets || [])
        .filter(a => a.type === "cover_art_prompt" && a.isCanonical)
        .map(a => a.editedContent || a.content);

      const res = await fetch("/api/label/image", {
        method: "POST",
        body: JSON.stringify({
          trackTitle,
          sonicContext: buildFullTrackContext(vaultAssets),
          direction,
          pastCanonicalPrompts,
          artistAppearance: artistAssets.physicalDescription,
        }),
      });
      
      if (!res.ok) {
        const errText = await res.text().catch(() => "Server error");
        throw new Error(`DALL-E error (${res.status}): ${errText.slice(0, 120)}`);
      }
      
      const { url } = await res.json();
      if (!url) throw new Error("No image URL returned");

      // Save to Vault
      await saveTrackCoverArt(trackTitle, url);

      // Save as creative asset so it shows in the UI
      const data = await getTrackLabelData(trackTitle);
      const newAsset: CreativeAsset = {
        id: `cover_art-${Date.now()}`,
        type: "cover_art_prompt",
        content: url, // Storing URL as content
        generatedAt: new Date().toISOString(),
        isCanonical: true,
        editedContent: null, // Added to match CreativeAsset type
      };
      
      const updated = {
        ...data,
        creativeAssets: [newAsset, ...(data.creativeAssets || []).map(a => 
          a.type === "cover_art_prompt" ? { ...a, isCanonical: false } : a
        )]
      };
      
      await saveTrackLabelData(updated);
      await loadData();
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to generate cover art");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id: string, editedContent?: string) => {
    await selectCanonicalCreative(trackTitle, id, editedContent);
    await loadData();
  };

  // Group assets by type
  const assetsByType = (labelData?.creativeAssets || []).reduce<Record<string, CreativeAsset[]>>((acc, a) => {
    if (!acc[a.type]) acc[a.type] = [];
    acc[a.type].push(a);
    return acc;
  }, {});

  const TYPE_LABELS: Record<string, { title: string; icon: string; copyLabel?: string; copyFormat?: (t: string) => string }> = {
    video_treatment: { title: "Video Treatment", icon: "🎬", copyLabel: "COPY FOR PRODUCTION" },
    cover_art_prompt: {
      title: "Cover Art Prompts", icon: "🎨",
      copyLabel: "COPY FOR MIDJOURNEY",
      copyFormat: (t) => `/imagine prompt: ${t} --ar 1:1 --style raw --v 6.1`,
    },
    merch_concept: { title: "Merch Concept", icon: "👕", copyLabel: "COPY FOR PRINTIFY" },
    spotify_canvas_concept: { title: "Spotify Canvas", icon: "📱" },
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-5 gap-2">
        <h3 className="text-sm font-black tracking-widest uppercase">🎨 Creative Dept</h3>
        <div className="flex gap-2">
          <button onClick={() => generateCoverArt()} disabled={loading}
            className="text-[10px] font-black tracking-widest text-[#d4a853] hover:text-white uppercase disabled:opacity-30 transition-colors">
            {loading ? "..." : "[RANDOM COVER]"}
          </button>
          {(labelData?.creativeAssets?.length ?? 0) > 0 ? (
            <button onClick={generate} disabled={loading}
              className="text-[10px] font-black tracking-widest text-[#555] hover:text-white uppercase disabled:opacity-30 transition-colors">
              {loading ? "..." : "[REGEN ALL]"}
            </button>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
          <span>⚠️</span>
          <div className="flex-1 text-xs">{error}</div>
          <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {(labelData?.creativeAssets?.length ?? 0) === 0 && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-[#555] text-sm mb-5 font-medium">No creative package yet.</p>
          <button onClick={generate} className="agent-btn agent-btn-primary w-full">
            🎨 GENERATE CREATIVE PACKAGE
          </button>
        </div>
      )}

      {loading && (labelData?.creativeAssets?.length ?? 0) === 0 && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card" style={{ opacity: 1 - i * 0.2 }}>
              <div className="skeleton h-3 w-28 mb-3 rounded" />
              <div className="skeleton h-12 w-full rounded" />
            </div>
          ))}
          <p className="text-[10px] font-black tracking-widest text-[#555] uppercase text-center mt-4">
            Creative Director is generating…
          </p>
        </div>
      )}

      {Object.entries(assetsByType).length > 0 && (
        <div className="space-y-6">
          {Object.entries(assetsByType).map(([type, assets]) => {
            const meta = TYPE_LABELS[type] || { title: type, icon: "📄" };
            return (
              <div key={type}>
                <h4 className="text-[10px] font-black tracking-widest text-[#d4a853] uppercase mb-3">
                  {meta.icon} {meta.title}
                </h4>
                {assets.map((asset, i) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    label={assets.length > 1 ? `V${i + 1}` : ""}
                    trackTitle={trackTitle}
                    copyFormat={meta.copyFormat}
                    copyLabel={meta.copyLabel}
                    onSelect={handleSelect}
                    onGenerateImage={type === "cover_art_prompt" ? generateCoverArt : undefined}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
