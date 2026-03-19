"use client";

import { useState, useEffect, useCallback } from "react";
import { getStoreValue, setStoreValue, getAllWithPrefix, logLabelCost } from "@/lib/db";
import { LABEL_COST_ESTIMATES } from "@/lib/budget";
import {
  getTrackLabelData, saveTrackLabelData, selectCanonicalCopy,
  getVoiceExamples, getSonicProfile, getCanonicalCreative,
  type CopyVariant, type TrackLabelData
} from "@/lib/labelStore";
import { getTrackAssets, buildCompactTrackContext } from "@/lib/assetVault";

// ── Inline Editable Text ─────────────────────────────────────────────

function EditableText({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (!editing) {
    return (
      <div onClick={() => { setDraft(value); setEditing(true); }} className="cursor-text group">
        <p className="text-[13px] text-[#ccc] leading-relaxed">&ldquo;{value}&rdquo;</p>
        <p className="text-[9px] text-[#333] mt-1 group-hover:text-[#555] transition-colors">tap to edit</p>
      </div>
    );
  }

  return (
    <div>
      <textarea
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        className="w-full bg-[#111] text-sm text-white p-3 rounded-lg border border-amber-500/30 outline-none resize-none"
        rows={4}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={() => { onSave(draft); setEditing(false); }}
          className="text-[10px] font-black text-amber-500 px-3 py-1.5 border border-amber-500/30 rounded-lg active:scale-95 transition-transform">
          SAVE
        </button>
        <button onClick={() => { setDraft(value); setEditing(false); }}
          className="text-[10px] font-black text-[#555] px-3 py-1.5 border border-[#222] rounded-lg">
          CANCEL
        </button>
      </div>
    </div>
  );
}

// ── Variant Card ─────────────────────────────────────────────────────

function VariantCard({
  variant, label, trackTitle, onSelect, onRefresh
}: {
  variant: CopyVariant; label: string; trackTitle: string;
  onSelect: (id: string, editedText?: string) => void;
  onRefresh: () => void;
}) {
  const text = variant.editedText || variant.text;

  return (
    <div
      className="rounded-xl p-4 mb-3 transition-all duration-200"
      style={{
        background: variant.isCanonical ? "rgba(0,230,118,0.04)" : "rgba(255,255,255,0.02)",
        border: variant.isCanonical ? "1px solid rgba(0,230,118,0.2)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black tracking-widest text-[#555]">{label}</span>
        {variant.isCanonical && (
          <span className="text-[9px] font-black text-green-500 tracking-widest">SELECTED ✓</span>
        )}
        {variant.score > 0 && (
          <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
            variant.score >= 90 ? "text-green-500 bg-green-500/10" :
            variant.score >= 70 ? "text-amber-500 bg-amber-500/10" :
            "text-red-500 bg-red-500/10"
          }`}>{variant.score}</span>
        )}
      </div>

      <EditableText
        value={text}
        onSave={(newText) => {
          onSelect(variant.id, newText);
        }}
      />

      <div className="flex gap-2 mt-3">
        {!variant.isCanonical && (
          <button
            onClick={() => onSelect(variant.id)}
            className="text-[10px] font-black text-amber-500 px-3 py-1.5 border border-amber-500/30 rounded-lg active:scale-95 transition-transform"
          >
            SELECT AS FINAL
          </button>
        )}
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className="text-[10px] font-black text-[#555] px-3 py-1.5 border border-[#222] rounded-lg hover:text-white transition-colors"
        >
          COPY
        </button>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────

export default function CopyVault({ trackTitle }: { trackTitle: string }) {
  const [labelData, setLabelData] = useState<TrackLabelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const data = await getTrackLabelData(trackTitle);
    setLabelData(data);
  }, [trackTitle]);

  useEffect(() => { loadData(); }, [loadData]);

  const requestVariants = async (assetType: string) => {
    setLoading(true);
    setActiveRequest(assetType);
    setError(null);
    try {
      // Pull vault data + cross-agent context
      const [voiceExamples, sonicProfile, visualDirection, vaultAssets] = await Promise.all([
        getVoiceExamples(assetType, 5),
        getSonicProfile(trackTitle),
        getCanonicalCreative(trackTitle, "video_treatment"),
        getTrackAssets(trackTitle),
      ]);

      const prRes = await fetch("/api/label/pr", {
        method: "POST",
        body: JSON.stringify({
          trackTitle,
          assetType,
          voiceExamples,
          // Vault sonic context (real Cyanite data — overrides labelStore placeholder)
          sonicContext: buildCompactTrackContext(vaultAssets),
          visualDirection,
        })
      });
      if (!prRes.ok) {
        const errText = await prRes.text().catch(() => "Unknown server error");
        throw new Error(`PR agent error (${prRes.status}): ${errText.slice(0, 120)}`);
      }
      const prData = await prRes.json();
      if (!prData.variants || !Array.isArray(prData.variants) || prData.variants.length === 0) {
        throw new Error("PR agent returned no variants — try again");
      }

      // Guardian scoring (optional — degrade gracefully)
      let guardianScore = 0;
      try {
        const gRes = await fetch("/api/label/guardian", {
          method: "POST",
          body: JSON.stringify({ inputContent: prData.variants[0], assetType })
        });
        if (gRes.ok) {
          const gData = await gRes.json();
          guardianScore = gData.score || 0;
        }
      } catch { /* Guardian is optional */ }

      // Save to labelStore
      const data = await getTrackLabelData(trackTitle);
      const now = new Date().toISOString();
      const newVariants: CopyVariant[] = prData.variants.map((text: string, i: number) => ({
        id: `${assetType}-${now}-${i}`,
        type: assetType as CopyVariant["type"],
        text: typeof text === "string" ? text : (text as any).copy || (text as any).text || JSON.stringify(text),
        score: i === 0 ? guardianScore : 0,
        isCanonical: false,
        editedText: null,
        generatedAt: now,
      }));

      // Replace old variants of same type, keep canonical from others
      data.copyVariants = [
        ...data.copyVariants.filter(v => v.type !== assetType || v.isCanonical),
        ...newVariants,
      ];
      await saveTrackLabelData(data);
      await logLabelCost(LABEL_COST_ESTIMATES.pr_request + LABEL_COST_ESTIMATES.guardian_filter);
      await loadData();
    } catch (e: any) {
      console.error("Copy generation failed:", e);
      setError(e?.message || "Failed to generate copy");
    }
    setLoading(false);
    setActiveRequest(null);
  };

  const handleSelect = async (variantId: string, editedText?: string) => {
    await selectCanonicalCopy(trackTitle, variantId, editedText);
    await loadData();
  };

  // Group variants by type
  const variantsByType = (labelData?.copyVariants || []).reduce<Record<string, CopyVariant[]>>((acc, v) => {
    if (!acc[v.type]) acc[v.type] = [];
    acc[v.type].push(v);
    return acc;
  }, {});

  const hasCanonical = (labelData?.copyVariants || []).some(v => v.isCanonical);
  const voiceCount = (labelData?.voiceExamples || []).length;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black tracking-widest uppercase">✍️ Copy Vault</h3>
        {voiceCount > 0 && (
          <span className="text-[9px] font-black tracking-widest text-green-500/60">
            {voiceCount} VOICE EXAMPLE{voiceCount > 1 ? "S" : ""}
          </span>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="alert-banner alert-banner-red mb-4 animate-slide-up">
          <span>⚠️</span>
          <div className="flex-1 text-xs">{error}</div>
          <button onClick={() => setError(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Variants grouped by type */}
      {Object.entries(variantsByType).length === 0 && !loading && (
        <p className="text-[#555] text-sm mb-6 font-medium">No copy generated yet. Choose a type below.</p>
      )}

      <div className="space-y-6">
        {Object.entries(variantsByType).map(([type, variants]) => (
          <div key={type}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">
                {type.replace(/_/g, " ")}
              </span>
              <button
                onClick={() => requestVariants(type)}
                disabled={loading}
                className="text-[9px] font-black tracking-widest text-[#555] hover:text-white uppercase transition-colors disabled:opacity-30"
              >
                [REGENERATE]
              </button>
            </div>
            {variants.map((v, i) => (
              <VariantCard
                key={v.id}
                variant={v}
                label={["A", "B", "C", "D"][i] || `${i + 1}`}
                trackTitle={trackTitle}
                onSelect={handleSelect}
                onRefresh={loadData}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Request New Copy */}
      <div className="mt-6 border-t border-[#1a1a1a] pt-5">
        <div className="text-[10px] font-black tracking-widest text-[#555] uppercase mb-3">Request New Copy</div>
        <div className="flex gap-2 flex-wrap">
          {["tiktok_caption", "ig_feed", "spotify_pitch", "curator_dm", "press_bio_short"].map(type => (
            <button
              key={type}
              onClick={() => requestVariants(type)}
              disabled={loading}
              className={`text-[10px] font-bold tracking-wider uppercase px-3 py-2.5 rounded-xl transition-all min-h-[44px] ${activeRequest === type
                ? "bg-[#d4a853] text-black"
                : "bg-[#1a1a1a] text-[#777] border border-[#252525] active:scale-95"
              } disabled:opacity-40`}
            >
              {activeRequest === type ? (
                <span className="flex items-center gap-1.5"><span className="spinner" style={{ width: 10, height: 10, borderWidth: 1.5 }} /> GEN…</span>
              ) : (
                `+ ${type.replace(/_/g, " ")}`
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
