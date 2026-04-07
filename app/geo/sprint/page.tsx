"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  getLedger,
  getLedgerStats,
  getUntouched,
  addArtist,
  updateArtist,
  addFan,
  addCommunityToFan,
  addQuickCommunity,
  addFriendToFan,
  markArtistSprinted,
  removeArtistFan,
  LedgerArtist,
  LedgerFan,
  LedgerCommunity,
  LedgerStats,
  ArtistTier,
  CommunityType,
  TRACK_LABELS,
  TIER_COLORS,
  TIER_BG,
} from "@/lib/audienceLedger";

type View = "queue" | "entry" | "intel";

const COMMUNITY_TYPES: CommunityType[] = ["meme", "curator", "subthread", "brand", "event", "location", "other"];

export default function SprintTerminalPage() {
  const [view, setView] = useState<View>("queue");
  const [stats, setStats] = useState<LedgerStats | null>(null);
  const [queue, setQueue] = useState<LedgerArtist[]>([]);
  const [allArtists, setAllArtists] = useState<LedgerArtist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<LedgerArtist | null>(null);
  const [loading, setLoading] = useState(true);

  // Entry form state
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("");

  // Fan add form
  const [showFanForm, setShowFanForm] = useState(false);
  const [fanHandle, setFanHandle] = useState("");
  const [fanName, setFanName] = useState("");
  const [fanCity, setFanCity] = useState("");
  const [fanContact, setFanContact] = useState("");

  // Community add form
  const [showComForm, setShowComForm] = useState(false);
  const [comHandle, setComHandle] = useState("");
  const [comType, setComType] = useState<CommunityType>("meme");
  const [comReach, setComReach] = useState("");
  const [comFan, setComFan] = useState(""); // attach to specific fan handle or leave blank for quick-add

  // Quick add (floating)
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaHandle, setQaHandle] = useState("");
  const [qaType, setQaType] = useState<CommunityType>("meme");
  const [qaReach, setQaReach] = useState("");
  const [qaArtist, setQaArtist] = useState("");

  // Filter
  const [tierFilter, setTierFilter] = useState<ArtistTier | "ALL">("T4");
  const [search, setSearch] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    const [s, q, ledger] = await Promise.all([
      getLedgerStats(),
      getUntouched("T4"),
      getLedger(),
    ]);
    setStats(s);
    setQueue(q);
    setAllArtists(ledger.artists);
    // Refresh selected artist if in entry view
    if (selectedArtist) {
      const refreshed = ledger.artists.find(a => a.name === selectedArtist.name);
      if (refreshed) setSelectedArtist(refreshed);
    }
    setLoading(false);
  }, [selectedArtist?.name]);

  useEffect(() => { reload(); }, []);

  // ── Filtered list for queue view ──────────────────────────────────
  const filtered = allArtists.filter(a => {
    const matchTier = tierFilter === "ALL" || a.tier === tierFilter;
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchSearch;
  }).sort((a, b) => {
    const rank = { T4: 0, T3: 1, T2: 2, T1: 3 };
    if (rank[a.tier] !== rank[b.tier]) return rank[a.tier] - rank[b.tier];
    if (!!a.lastSprinted !== !!b.lastSprinted) return a.lastSprinted ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  // ── Actions ───────────────────────────────────────────────────────

  const handleSaveArtist = async () => {
    if (!selectedArtist) return;
    await updateArtist(selectedArtist.name, {
      igHandle: handle || undefined,
      city: city || undefined,
    });
    await markArtistSprinted(selectedArtist.name);
    await reload();
  };

  const handleAddFan = async () => {
    if (!selectedArtist || !fanHandle) return;
    await addFan(selectedArtist.name, {
      handle: fanHandle,
      name: fanName || undefined,
      city: fanCity || undefined,
      contact: fanContact || undefined,
      sourceArtist: selectedArtist.name,
    });
    setFanHandle(""); setFanName(""); setFanCity(""); setFanContact("");
    setShowFanForm(false);
    await reload();
  };

  const handleAddCommunity = async () => {
    if (!selectedArtist || !comHandle) return;
    const community: LedgerCommunity = {
      handle: comHandle.startsWith("@") ? comHandle : `@${comHandle}`,
      type: comType,
      reach: comReach ? parseInt(comReach.replace(/[^0-9]/g, "")) : undefined,
    };
    if (comFan) {
      await addCommunityToFan(selectedArtist.name, comFan, community);
    } else {
      await addQuickCommunity({ ...community, sourceArtist: selectedArtist.name });
    }
    setComHandle(""); setComReach(""); setComFan("");
    setShowComForm(false);
    await reload();
  };

  const handleQuickAdd = async () => {
    if (!qaHandle || !qaArtist) return;
    const community: LedgerCommunity = {
      handle: qaHandle.startsWith("@") ? qaHandle : `@${qaHandle}`,
      type: qaType,
      reach: qaReach ? parseInt(qaReach.replace(/[^0-9]/g, "")) : undefined,
    };
    await addQuickCommunity({ ...community, sourceArtist: qaArtist });
    setQaHandle(""); setQaReach(""); setQaArtist("");
    setShowQuickAdd(false);
    await reload();
  };

  const openEntry = (artist: LedgerArtist) => {
    setSelectedArtist(artist);
    setHandle(artist.igHandle || "");
    setCity(artist.city || "");
    setView("entry");
  };

  // ── Render helpers ────────────────────────────────────────────────

  const TierBadge = ({ tier }: { tier: ArtistTier }) => (
    <span className={`text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded border ${TIER_BG[tier]} ${TIER_COLORS[tier]}`}>
      {tier}
    </span>
  );

  const StatBar = () => (
    <div className="sticky top-0 z-10 bg-[#09090b]/95 backdrop-blur border-b border-[#1a1a1a] px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <div className="text-center">
            <p className="text-sm font-black text-white">{stats?.verifiedArtists ?? "—"}</p>
            <p className="text-[7px] text-[#444] font-black uppercase tracking-wider">Artists</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-white">{stats?.totalFans ?? "—"}</p>
            <p className="text-[7px] text-[#444] font-black uppercase tracking-wider">Fans</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-white">{stats?.citiesReached ?? "—"}</p>
            <p className="text-[7px] text-[#444] font-black uppercase tracking-wider">Cities</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-black text-purple-400">{stats?.totalCommunities ?? "—"}</p>
            <p className="text-[7px] text-[#444] font-black uppercase tracking-wider">Nodes</p>
          </div>
        </div>
        <div className="flex gap-1">
          {(["queue", "intel"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-[8px] font-black tracking-widest uppercase px-2 py-1 rounded transition-all ${
                view === v ? "bg-amber-500/20 text-amber-400" : "text-[#555]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── QUEUE VIEW ────────────────────────────────────────────────────
  const QueueView = () => (
    <div className="pb-24">
      {/* Tier filter */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto">
        {(["T4", "T3", "T2", "T1", "ALL"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTierFilter(t)}
            className={`flex-shrink-0 text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all ${
              tierFilter === t
                ? t === "ALL" ? "bg-white/10 border-white/20 text-white" : `${TIER_BG[t as ArtistTier]} ${TIER_COLORS[t as ArtistTier]}`
                : "border-[#222] text-[#444]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search artists..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-[#222] rounded-xl px-3 py-2 text-sm font-semibold text-white placeholder-[#333] outline-none focus:border-[#444] transition-colors"
        />
      </div>

      {/* Artist list */}
      <div className="divide-y divide-[#111]">
        {filtered.map(artist => {
          const realFans = artist.fans.filter(f => f.handle !== "__community_node__");
          const communities = artist.fans.flatMap(f => f.communities);
          return (
            <button
              key={artist.name}
              onClick={() => openEntry(artist)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[#111] transition-colors"
            >
              {/* Tier badge */}
              <TierBadge tier={artist.tier} />

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${artist.igHandle ? "text-white" : "text-[#888]"}`}>
                  {artist.name}
                </p>
                <p className="text-[9px] text-[#444] mt-0.5 truncate">
                  {artist.igHandle ? `@${artist.igHandle}` : "—"}
                  {artist.city ? ` · ${artist.city}` : ""}
                  {artist.tracks.map(t => TRACK_LABELS[t] || t).join(", ") && (
                    <span className="ml-1 text-[#333]">
                      · {artist.tracks.map(t => TRACK_LABELS[t] || t).join(", ")}
                    </span>
                  )}
                </p>
              </div>

              {/* Stats pills */}
              <div className="flex gap-1.5 flex-shrink-0">
                {realFans.length > 0 && (
                  <span className="text-[8px] font-black text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                    {realFans.length}f
                  </span>
                )}
                {communities.length > 0 && (
                  <span className="text-[8px] font-black text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded">
                    {communities.length}c
                  </span>
                )}
                {artist.lastSprinted && (
                  <span className="text-[8px] font-black text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">✓</span>
                )}
              </div>

              <span className="text-[#333] text-sm flex-shrink-0">›</span>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#444] text-sm">No artists match this filter.</div>
        )}
      </div>
    </div>
  );

  // ── ENTRY VIEW ────────────────────────────────────────────────────
  const EntryView = () => {
    if (!selectedArtist) return null;
    const realFans = selectedArtist.fans.filter(f => f.handle !== "__community_node__");
    const quickComs = (selectedArtist.fans.find(f => f.handle === "__community_node__")?.communities) || [];
    const allComs = [...realFans.flatMap(f => f.communities), ...quickComs];

    return (
      <div className="pb-32">
        {/* Back */}
        <button
          onClick={() => { setView("queue"); setSelectedArtist(null); }}
          className="flex items-center gap-2 px-4 py-3 text-[10px] font-black tracking-widest text-[#555] uppercase"
        >
          ← Queue
        </button>

        {/* Artist header */}
        <div className="px-4 pb-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-1">
            <TierBadge tier={selectedArtist.tier} />
            <p className="text-xs text-[#444]">{selectedArtist.tracks.map(t => TRACK_LABELS[t] || t).join(" · ")}</p>
          </div>
          <h2 className="text-xl font-black text-white">{selectedArtist.name}</h2>
          {selectedArtist.lastSprinted && (
            <p className="text-[9px] text-green-400 mt-0.5">Last sprinted: {selectedArtist.lastSprinted}</p>
          )}
        </div>

        {/* Handle + City */}
        <div className="px-4 py-4 border-b border-[#1a1a1a]">
          <p className="text-[9px] font-black tracking-widest text-[#444] uppercase mb-3">Artist Info</p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-xl px-3 py-2.5">
              <span className="text-[#444] text-sm font-black">@</span>
              <input
                type="text"
                placeholder="ighandle"
                value={handle}
                onChange={e => setHandle(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder-[#333]"
              />
            </div>
            <div className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-xl px-3 py-2.5">
              <span className="text-[#444] text-sm">📍</span>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder-[#333]"
              />
            </div>
            <button
              onClick={handleSaveArtist}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all"
            >
              Save + Mark Sprinted ✓
            </button>
          </div>
        </div>

        {/* Fans */}
        <div className="px-4 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black tracking-widest text-[#444] uppercase">
              Fans ({realFans.length})
            </p>
            <button
              onClick={() => setShowFanForm(!showFanForm)}
              className="text-[9px] font-black tracking-widest text-amber-400 uppercase"
            >
              + Add Fan
            </button>
          </div>

          {showFanForm && (
            <div className="bg-[#111] border border-[#222] rounded-xl p-3 mb-3 flex flex-col gap-2">
              <input type="text" placeholder="@handle" value={fanHandle} onChange={e => setFanHandle(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <input type="text" placeholder="Name (optional)" value={fanName} onChange={e => setFanName(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <input type="text" placeholder="City (optional)" value={fanCity} onChange={e => setFanCity(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <input type="text" placeholder="Snap / phone (optional)" value={fanContact} onChange={e => setFanContact(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <div className="flex gap-2">
                <button onClick={handleAddFan}
                  className="flex-1 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-black tracking-widest uppercase active:scale-95 transition-all">
                  Add
                </button>
                <button onClick={() => setShowFanForm(false)}
                  className="flex-1 py-2 rounded-lg bg-[#1a1a1a] border border-[#222] text-[#555] text-[9px] font-black tracking-widest uppercase active:scale-95 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {realFans.map(fan => (
              <div key={fan.handle} className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">@{fan.handle}</p>
                  <p className="text-[9px] text-[#444]">
                    {[fan.name, fan.city, fan.contact].filter(Boolean).join(" · ") || "—"}
                  </p>
                  {fan.communities.length > 0 && (
                    <p className="text-[8px] text-purple-400 mt-0.5">
                      {fan.communities.map(c => c.handle).join(", ")}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Nodes */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-black tracking-widest text-[#444] uppercase">
              Community Nodes ({allComs.length})
            </p>
            <button
              onClick={() => setShowComForm(!showComForm)}
              className="text-[9px] font-black tracking-widest text-purple-400 uppercase"
            >
              + Add Node
            </button>
          </div>

          {showComForm && (
            <div className="bg-[#111] border border-[#222] rounded-xl p-3 mb-3 flex flex-col gap-2">
              <input type="text" placeholder="@handle" value={comHandle} onChange={e => setComHandle(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <div className="flex gap-1 flex-wrap">
                {COMMUNITY_TYPES.map(t => (
                  <button key={t} onClick={() => setComType(t)}
                    className={`text-[8px] font-black tracking-widest uppercase px-2 py-1 rounded border transition-all ${
                      comType === t ? "bg-purple-400/20 border-purple-400/30 text-purple-400" : "border-[#222] text-[#444]"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Reach (e.g. 438K)" value={comReach} onChange={e => setComReach(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <select value={comFan} onChange={e => setComFan(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none">
                <option value="">Attach to artist (quick-add)</option>
                {realFans.map(f => (
                  <option key={f.handle} value={f.handle}>Attach to @{f.handle}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={handleAddCommunity}
                  className="flex-1 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[9px] font-black tracking-widest uppercase active:scale-95 transition-all">
                  Add
                </button>
                <button onClick={() => setShowComForm(false)}
                  className="flex-1 py-2 rounded-lg bg-[#1a1a1a] border border-[#222] text-[#555] text-[9px] font-black tracking-widest uppercase active:scale-95 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {allComs.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-purple-300 truncate">{c.handle}</p>
                  <p className="text-[9px] text-[#444]">
                    {c.type}{c.reach ? ` · ${c.reach.toLocaleString()}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── INTEL VIEW ────────────────────────────────────────────────────
  const IntelView = () => (
    <div className="px-4 pb-24 pt-3">
      {/* Cross-track fans */}
      {stats && stats.crossTrackFans.length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] font-black tracking-widest text-amber-400 uppercase mb-2">
            🔥 Cross-Track Fans ({stats.crossTrackFans.length})
          </p>
          <p className="text-[9px] text-[#444] mb-3">Appeared across 2+ track communities — highest-signal converts.</p>
          <div className="flex flex-col gap-1.5">
            {stats.crossTrackFans.slice(0, 10).map(fan => (
              <div key={fan.handle} className="bg-[#0a0a0a] border border-amber-500/20 rounded-lg px-3 py-2">
                <p className="text-xs font-bold text-white">@{fan.handle}</p>
                <p className="text-[9px] text-[#444]">{fan.appearsIn.map(t => TRACK_LABELS[t] || t).join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Communities */}
      {stats && stats.topCommunities.length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] font-black tracking-widest text-purple-400 uppercase mb-2">
            Top Watering Holes
          </p>
          <p className="text-[9px] text-[#444] mb-3">Communities your target fans engage with most. One comment here = network reach.</p>
          <div className="flex flex-col gap-1.5">
            {stats.topCommunities.slice(0, 15).map(com => (
              <div key={com.handle} className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-purple-300 truncate">{com.handle}</p>
                  <p className="text-[9px] text-[#444]">
                    {com.type}
                    {com.reach ? ` · ${com.reach.toLocaleString()}` : ""}
                    {com.connectedTracks.length > 0 && ` · via ${com.connectedTracks.map(t => TRACK_LABELS[t] || t).join(", ")}`}
                  </p>
                </div>
                <span className="text-[10px] font-black text-purple-400 bg-purple-400/10 px-1.5 py-0.5 rounded flex-shrink-0">
                  ×{com.frequency}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* City Heat Map */}
      {stats && stats.topCities.length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] font-black tracking-widest text-blue-400 uppercase mb-2">City Heat Map</p>
          <p className="text-[9px] text-[#444] mb-3">Geographic clusters — ad targeting, tour routing, playlist pitch cities.</p>
          <div className="flex flex-col gap-1.5">
            {stats.topCities.map(city => (
              <div key={city.city} className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-white capitalize">{city.city}</p>
                  <p className="text-[9px] text-[#444]">
                    {city.artistCount > 0 && `${city.artistCount} artists`}
                    {city.artistCount > 0 && city.fanCount > 0 && " · "}
                    {city.fanCount > 0 && `${city.fanCount} fans`}
                  </p>
                </div>
                <span className="text-[10px] font-black text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
                  {city.total}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier breakdown */}
      {stats && (
        <div className="mb-6">
          <p className="text-[9px] font-black tracking-widest text-[#444] uppercase mb-2">By Tier</p>
          <div className="grid grid-cols-4 gap-2">
            {(["T4", "T3", "T2", "T1"] as ArtistTier[]).map(tier => (
              <div key={tier} className={`text-center p-3 rounded-xl border ${TIER_BG[tier]}`}>
                <p className={`text-xl font-black ${TIER_COLORS[tier]}`}>{stats.byTier[tier]}</p>
                <p className={`text-[8px] font-black ${TIER_COLORS[tier]}`}>{tier}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats && Object.keys(stats.byTrack).length > 0 && (
        <div className="mb-6">
          <p className="text-[9px] font-black tracking-widest text-[#444] uppercase mb-2">By Track</p>
          <div className="flex flex-col gap-1.5">
            {Object.entries(stats.byTrack).map(([trackId, data]) => (
              <div key={trackId} className="flex items-center justify-between bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2">
                <p className="text-xs font-bold text-white">{TRACK_LABELS[trackId] || trackId}</p>
                <p className="text-[9px] text-[#444]">
                  {data.artists} artists · {data.fans} fans · {data.communities} nodes
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!stats || (stats.totalFans === 0 && stats.totalCommunities === 0)) && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📱</p>
          <p className="text-sm font-black text-white mb-2">Ledger is empty.</p>
          <p className="text-[11px] text-[#444]">Run your first sprint block and log what you find.</p>
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#09090b] text-white" style={{ fontFamily: "var(--font-sans, system-ui)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-2 border-b border-[#1a1a1a]">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-[#444] uppercase">past.El</p>
          <p className="text-sm font-black text-white">📱 Sprint Terminal</p>
        </div>
        <Link href="/geo" className="text-[8px] font-black tracking-widest text-[#555] uppercase bg-[#111] px-2.5 py-1 rounded-lg border border-[#222]">
          Geo Map
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <p className="text-[9px] font-black tracking-widest text-[#444] uppercase">Loading ledger...</p>
          </div>
        </div>
      ) : (
        <>
          <StatBar />
          {view === "queue" && <QueueView />}
          {view === "entry" && <EntryView />}
          {view === "intel" && <IntelView />}
        </>
      )}

      {/* Floating Quick Add */}
      {view !== "entry" && (
        <div className="fixed bottom-20 right-4 z-20">
          {showQuickAdd && (
            <div className="mb-2 bg-[#111] border border-[#333] rounded-2xl p-3 w-64 flex flex-col gap-2 shadow-xl">
              <p className="text-[9px] font-black tracking-widest text-purple-400 uppercase">Quick Community Add</p>
              <input type="text" placeholder="@community_handle" value={qaHandle} onChange={e => setQaHandle(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <div className="flex gap-1 flex-wrap">
                {(["meme", "curator", "subthread", "other"] as CommunityType[]).map(t => (
                  <button key={t} onClick={() => setQaType(t)}
                    className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border transition-all ${
                      qaType === t ? "bg-purple-400/20 border-purple-400/30 text-purple-400" : "border-[#222] text-[#444]"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="Reach (e.g. 50K)" value={qaReach} onChange={e => setQaReach(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none placeholder-[#333]" />
              <select value={qaArtist} onChange={e => setQaArtist(e.target.value)}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white outline-none">
                <option value="">Select artist context...</option>
                {allArtists.filter(a => a.igHandle).map(a => (
                  <option key={a.name} value={a.name}>{a.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button onClick={handleQuickAdd}
                  className="flex-1 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[9px] font-black uppercase active:scale-95 transition-all">
                  Add
                </button>
                <button onClick={() => setShowQuickAdd(false)}
                  className="flex-1 py-2 rounded-lg bg-[#1a1a1a] border border-[#222] text-[#555] text-[9px] font-black uppercase active:scale-95 transition-all">
                  ×
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="w-12 h-12 rounded-full bg-purple-500 text-white text-xl font-black flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            {showQuickAdd ? "×" : "+"}
          </button>
        </div>
      )}
    </main>
  );
}
