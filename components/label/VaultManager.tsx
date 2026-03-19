"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  getTrackAssets, saveTrackLyrics, saveTrackCoverArt,
  addVisualReference, removeVisualReference,
  getArtistAssets, addArtistPhoto, removeArtistPhoto, saveArtistBio,
  type TrackAssets, type ArtistAssets,
} from "@/lib/assetVault";

// ── Field Status Dot ─────────────────────────────────────────────────

function StatusDot({ filled }: { filled: boolean }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full mr-2 flex-shrink-0 ${filled ? "bg-green-500" : "bg-[#333]"}`} />
  );
}

// ── File → Data URL helper ────────────────────────────────────────────

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Track Vault Panel ─────────────────────────────────────────────────

function TrackVaultPanel({ trackTitle }: { trackTitle: string }) {
  const [assets, setAssets] = useState<TrackAssets | null>(null);
  const [lyricsEdit, setLyricsEdit] = useState("");
  const [lyricsSaving, setLyricsSaving] = useState(false);
  const [lyricsSaved, setLyricsSaved] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const refImgRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const a = await getTrackAssets(trackTitle);
    
    // Auto-seed SEE ME lyrics if empty (one-time initialization)
    if (trackTitle === "SEE ME" && !a.lyrics) {
      const seeMeLyrics = `HOOK:
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out, ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out! ugh
cuz you ain’t what I want, you what I need, yeah

Verse:
Whatchu doing come see me?  
You ain’t ever needed reason? 
Stressing through the weekend,
Settling for decent  
Problem is love, your heart don’t push start easily, but
I’ll bet my love, you’ve been thinking on recently, how you

pre:
walked in with no coverage fee
instinct said you coming with me
tryna make it pop off, whats another top off?
lockjaw liable fucking with me lets
seal the deal, going for keeps,
feel the real, you know that its me i'm
ear to ear, how you throw it to me
4k on playback stuck on repeat, so

hook:
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out, ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out! ugh
cuz you ain’t what I want, you what I need, 
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out, ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out! ugh
cuz you ain’t what I want, you what I need, yeah

post:
walked in with no coverage fee
instinct said you coming with me
tryna make it pop off, whats another top off?
lockjaw liable fucking with me lets
seal the deal, going for keeps,
feel the real, you know that its me

OUTRO FLIP
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out, ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out! ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out, ugh
cuz you ain’t what I want, you what I need, yeah
baby what you doin come and see me, yeah
keep me on your mind when you uneasy, yeah
connection, ugh I’m stretching out! ugh
cuz you ain’t what I want, you what I need, yeah`;
      await saveTrackLyrics(trackTitle, seeMeLyrics);
      const updated = await getTrackAssets(trackTitle);
      setAssets(updated);
      setLyricsEdit(updated.lyrics ?? "");
      return;
    }

    setAssets(a);
    setLyricsEdit(a.lyrics ?? "");
  }, [trackTitle]);

  useEffect(() => { load(); }, [load]);

  const saveLyrics = async () => {
    setLyricsSaving(true);
    await saveTrackLyrics(trackTitle, lyricsEdit);
    await load();
    setLyricsSaving(false);
    setLyricsSaved(true);
    setTimeout(() => setLyricsSaved(false), 2000);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    await saveTrackCoverArt(trackTitle, dataUrl);
    await load();
  };

  const handleRefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      await addVisualReference(trackTitle, dataUrl);
    }
    await load();
  };

  const removeRef = async (i: number) => {
    await removeVisualReference(trackTitle, i);
    await load();
  };

  if (!assets) return <div className="text-[#555] text-sm py-4">Loading vault…</div>;

  const { sonic } = assets;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Sonic — always auto-populated */}
      <div className="card">
        <div className="flex items-center mb-2">
          <StatusDot filled={!!sonic.bpm} />
          <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">Sonic Profile (Cyanite)</span>
        </div>
        {sonic.bpm ? (
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-amber">{sonic.bpm} BPM</span>
            {sonic.key && <span className="badge badge-green">{sonic.key}</span>}
            {sonic.rbConfidence != null && (
              <span className="badge badge-muted">{Math.round(sonic.rbConfidence * 100)}% R&B</span>
            )}
            {Object.entries(sonic.moodScores)
              .filter(([, v]) => v != null && v > 0.4)
              .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
              .slice(0, 3)
              .map(([k, v]) => (
                <span key={k} className="badge badge-muted">{k} {Math.round((v ?? 0) * 100)}%</span>
              ))}
          </div>
        ) : (
          <p className="text-[#555] text-xs">Track not found in Cyanite data. Check spelling.</p>
        )}
        {sonic.project && (
          <p className="text-[10px] text-[#444] mt-2">{sonic.project} — {sonic.projectRole}</p>
        )}
      </div>

      {/* Lyrics */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <StatusDot filled={!!assets.lyrics} />
            <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">Lyrics</span>
          </div>
          {assets.lyrics && (
            <span className="text-[9px] text-[#555]">
              {assets.lyrics.split("\n").filter(l => l.trim()).length} lines
            </span>
          )}
        </div>
        <textarea
          value={lyricsEdit}
          onChange={e => setLyricsEdit(e.target.value)}
          placeholder={"Paste the full lyrics here...\nAll agents will reference these."}
          className="w-full h-32 bg-[#0a0a0a] text-[13px] text-[#ccc] p-3 rounded-lg border border-[#1a1a1a] outline-none resize-none placeholder:text-[#333]"
        />
        <button
          onClick={saveLyrics}
          disabled={lyricsSaving || lyricsEdit === (assets.lyrics ?? "")}
          className={`mt-2 text-[10px] font-black tracking-widest px-4 py-2 rounded-lg transition-all disabled:opacity-30 ${
            lyricsSaved ? "bg-green-500/20 text-green-500" : "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20 active:scale-95"
          }`}
        >
          {lyricsSaving ? "SAVING…" : lyricsSaved ? "✓ SAVED" : "SAVE LYRICS"}
        </button>
      </div>

      {/* Cover Art */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <StatusDot filled={!!assets.coverArtUrl} />
            <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">Cover Art</span>
          </div>
          <button
            onClick={() => coverRef.current?.click()}
            className="text-[9px] font-black tracking-widest text-[#555] hover:text-white uppercase transition-colors"
          >
            {assets.coverArtUrl ? "[REPLACE]" : "[UPLOAD]"}
          </button>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        </div>
        {assets.coverArtUrl ? (
          <img
            src={assets.coverArtUrl}
            alt="Cover art"
            className="w-24 h-24 object-cover rounded-lg border border-[#1a1a1a]"
          />
        ) : (
          <button
            onClick={() => coverRef.current?.click()}
            className="w-full h-16 rounded-lg border border-dashed border-[#222] text-[#444] text-[11px] font-bold hover:border-[#444] transition-colors"
          >
            + Upload cover art
          </button>
        )}
      </div>

      {/* Visual References */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <StatusDot filled={assets.visualReferences.length > 0} />
            <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">
              Visual References ({assets.visualReferences.length})
            </span>
          </div>
          <button
            onClick={() => refImgRef.current?.click()}
            className="text-[9px] font-black tracking-widest text-[#555] hover:text-white uppercase transition-colors"
          >
            [+ ADD]
          </button>
          <input ref={refImgRef} type="file" accept="image/*" multiple className="hidden" onChange={handleRefUpload} />
        </div>
        {assets.visualReferences.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {assets.visualReferences.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`ref ${i}`} className="w-16 h-16 object-cover rounded-lg border border-[#1a1a1a]" />
                <button
                  onClick={() => removeRef(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#111] border border-[#333] rounded-full text-[10px] flex items-center justify-center text-[#666] hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={() => refImgRef.current?.click()}
            className="w-full h-12 rounded-lg border border-dashed border-[#222] text-[#444] text-[11px] font-bold hover:border-[#444] transition-colors"
          >
            + Mood board photos, reference images
          </button>
        )}
      </div>
    </div>
  );
}

// ── Artist Vault Panel ────────────────────────────────────────────────

function ArtistVaultPanel() {
  const [artist, setArtist] = useState<ArtistAssets | null>(null);
  const [bioEdit, setBioEdit] = useState("");
  const [oneLinerEdit, setOneLinerEdit] = useState("");
  const [bioSaved, setBioSaved] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const a = await getArtistAssets();
    setArtist(a);
    setBioEdit(a.pressKitBio ?? "");
    setOneLinerEdit(a.oneLiner ?? "");
  }, []);

  useEffect(() => { load(); }, [load]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      await addArtistPhoto(dataUrl);
    }
    await load();
  };

  const removePhoto = async (i: number) => {
    await removeArtistPhoto(i);
    await load();
  };

  const saveBio = async () => {
    await saveArtistBio(bioEdit, oneLinerEdit);
    await load();
    setBioSaved(true);
    setTimeout(() => setBioSaved(false), 2000);
  };

  if (!artist) return <div className="text-[#555] text-sm py-4">Loading…</div>;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Baseline Photos */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <StatusDot filled={artist.baselinePhotos.length > 0} />
            <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">
              Reference Photos ({artist.baselinePhotos.length})
            </span>
          </div>
          <button
            onClick={() => photoRef.current?.click()}
            className="text-[9px] font-black tracking-widest text-[#555] hover:text-white uppercase transition-colors"
          >
            [+ ADD]
          </button>
          <input ref={photoRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
        </div>
        <p className="text-[11px] text-[#444] mb-3">Artist baseline photos for AI image generation. Upload 3-5 clear photos.</p>
        {artist.baselinePhotos.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {artist.baselinePhotos.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`photo ${i}`} className="w-16 h-16 object-cover rounded-lg border border-[#1a1a1a]" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#111] border border-[#333] rounded-full text-[10px] flex items-center justify-center text-[#666] hover:text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={() => photoRef.current?.click()}
            className="w-full h-12 rounded-lg border border-dashed border-[#222] text-[#444] text-[11px] font-bold hover:border-[#444] transition-colors"
          >
            + Upload artist reference photos
          </button>
        )}
      </div>

      {/* Bio */}
      <div className="card">
        <div className="flex items-center mb-3">
          <StatusDot filled={!!artist.oneLiner} />
          <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">Press Kit Bio</span>
        </div>
        <label className="text-[9px] font-black text-[#555] uppercase mb-1 block">One-liner pitch</label>
        <input
          value={oneLinerEdit}
          onChange={e => setOneLinerEdit(e.target.value)}
          placeholder="Late-night R&B from Lake Geneva, WI."
          className="w-full bg-[#0a0a0a] text-[13px] text-[#ccc] p-3 rounded-lg border border-[#1a1a1a] outline-none mb-3 placeholder:text-[#333]"
        />
        <label className="text-[9px] font-black text-[#555] uppercase mb-1 block">Full press bio</label>
        <textarea
          value={bioEdit}
          onChange={e => setBioEdit(e.target.value)}
          placeholder={"Write or paste your press bio here.\nAll copy agents pull from this."}
          className="w-full h-32 bg-[#0a0a0a] text-[13px] text-[#ccc] p-3 rounded-lg border border-[#1a1a1a] outline-none resize-none placeholder:text-[#333]"
        />
        <button
          onClick={saveBio}
          disabled={!bioEdit && !oneLinerEdit}
          className={`mt-2 text-[10px] font-black tracking-widest px-4 py-2 rounded-lg transition-all disabled:opacity-30 ${
            bioSaved ? "bg-green-500/20 text-green-500" : "bg-[#d4a853]/10 text-[#d4a853] border border-[#d4a853]/20 active:scale-95"
          }`}
        >
          {bioSaved ? "✓ SAVED" : "SAVE BIO"}
        </button>
      </div>

      {/* Brand Voice — read-only display */}
      <div className="card">
        <div className="flex items-center mb-2">
          <StatusDot filled={true} />
          <span className="text-[10px] font-black tracking-widest text-[#777] uppercase">Brand Voice (Auto)</span>
        </div>
        <p className="text-[11px] text-[#555] mb-2">Rules injected into every agent automatically.</p>
        <div className="flex flex-wrap gap-1.5">
          {["lowercase always", "no exclamation marks", "no hype words", "1-3 line captions", "restraint"].map(rule => (
            <span key={rule} className="text-[9px] font-bold text-green-500/70 bg-green-500/5 border border-green-500/10 px-2 py-0.5 rounded-full">
              {rule}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export default function VaultManager({ trackTitle }: { trackTitle: string }) {
  const [view, setView] = useState<"track" | "artist">("track");

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-black tracking-widest uppercase">📦 Asset Vault</h3>
        <div className="flex gap-1 bg-[#0a0a0a] p-1 rounded-lg border border-[#1a1a1a]">
          {[["track", "Track"], ["artist", "Artist"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id as "track" | "artist")}
              className={`text-[10px] font-black tracking-widest px-3 py-1.5 rounded-md transition-all ${
                view === id ? "bg-[#d4a853] text-black" : "text-[#555]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#444] mb-4">
        Fill the vault once. Every agent (A&R, Copy, Creative) reads from here.
      </p>

      {view === "track" ? (
        <TrackVaultPanel trackTitle={trackTitle} />
      ) : (
        <ArtistVaultPanel />
      )}
    </div>
  );
}
