"use client";

// app/analytics/page.tsx — S4A Monthly Analytics Intake
// Open → fill in Spotify for Artists numbers track by track → Save.
// Writes directly to catalog_intelligence_matrix.json. Zero tokens.

import { useEffect, useState } from "react";

type LiveTrack = {
  track_id: string;
  title: string;
  release_date: string;
  current_popularity: number | null;
  current_streams_cumulative: number | null;
  current_saves: number | null;
  current_save_rate: number | null;
  current_top_cities: string[];
  current_playlist_adds: number | null;
  current_discover_weekly: boolean;
  last_s4a_date: string | null;
};

type TrackForm = {
  streams_7day: string;
  streams_cumulative: string;
  saves: string;
  save_rate_percent: string;
  city_1: string;
  city_2: string;
  city_3: string;
  playlist_adds: string;
  discover_weekly: boolean;
  notes: string;
};

const emptyForm = (): TrackForm => ({
  streams_7day: "",
  streams_cumulative: "",
  saves: "",
  save_rate_percent: "",
  city_1: "",
  city_2: "",
  city_3: "",
  playlist_adds: "",
  discover_weekly: false,
  notes: "",
});

type SaveResult = {
  success: boolean;
  updated: number;
  flags: { strong: string[]; weak: string[]; dw: string[] };
  top_city: string | null;
  message: string;
};

function today() {
  return new Date().toISOString().split("T")[0];
}

function hasData(f: TrackForm) {
  return (
    f.streams_7day !== "" ||
    f.streams_cumulative !== "" ||
    f.saves !== "" ||
    f.save_rate_percent !== "" ||
    f.city_1 !== "" ||
    f.playlist_adds !== "" ||
    f.discover_weekly
  );
}

export default function AnalyticsPage() {
  const [tracks, setTracks] = useState<LiveTrack[]>([]);
  const [forms, setForms] = useState<Record<string, TrackForm>>({});
  const [date, setDate] = useState(today());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/catalog-tracks")
      .then(r => r.json())
      .then(data => {
        setTracks(data.tracks || []);
        const initial: Record<string, TrackForm> = {};
        (data.tracks || []).forEach((t: LiveTrack) => {
          initial[t.track_id] = emptyForm();
        });
        setForms(initial);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  function setField(trackId: string, field: keyof TrackForm, value: string | boolean) {
    setForms(prev => ({
      ...prev,
      [trackId]: { ...prev[trackId], [field]: value },
    }));
  }

  const filledCount = Object.values(forms).filter(hasData).length;
  const canSave = filledCount > 0 && !saving;

  async function handleSave() {
    setSaving(true);
    setResult(null);
    setError(null);

    const payload = {
      date,
      tracks: Object.fromEntries(
        Object.entries(forms).map(([id, f]) => [
          id,
          {
            streams_7day: f.streams_7day !== "" ? Number(f.streams_7day) : null,
            streams_cumulative: f.streams_cumulative !== "" ? Number(f.streams_cumulative) : null,
            saves: f.saves !== "" ? Number(f.saves) : null,
            save_rate_percent: f.save_rate_percent !== "" ? Number(f.save_rate_percent) : null,
            city_1: f.city_1,
            city_2: f.city_2,
            city_3: f.city_3,
            playlist_adds: f.playlist_adds !== "" ? Number(f.playlist_adds) : null,
            discover_weekly: f.discover_weekly,
            notes: f.notes,
          },
        ])
      ),
    };

    try {
      const res = await fetch("/api/analytics/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setResult(data);
      // Reset forms on success
      const reset: Record<string, TrackForm> = {};
      tracks.forEach(t => { reset[t.track_id] = emptyForm(); });
      setForms(reset);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--text-primary)",
    padding: "10px 12px",
    fontSize: 15,
    width: "100%",
    outline: "none",
    fontFamily: "inherit",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
    marginBottom: 4,
    display: "block",
  };

  if (loading) {
    return (
      <div className="page animate-fade-in pb-20">
        <div className="page-inner" style={{ textAlign: "center", paddingTop: 80 }}>
          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading catalog...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in pb-28">
      <div className="page-inner">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
            📊 S4A INTAKE
          </h1>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: "0.2em", color: "var(--text-muted)", marginTop: 4 }}>
            Spotify for Artists · Monthly Pull
          </div>
        </div>

        {/* Date + progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Pull Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "10px 16px",
            textAlign: "center",
            minWidth: 72,
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: "var(--accent)" }}>
              {filledCount}/{tracks.length}
            </div>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Tracks
            </div>
          </div>
        </div>

        {/* Success banner */}
        {result && (
          <div style={{
            background: "rgba(62,207,142,0.1)",
            border: "1px solid var(--green)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 20,
          }}>
            <div style={{ fontWeight: 900, color: "var(--green)", marginBottom: 6 }}>
              ✅ {result.message}
            </div>
            {result.flags.strong.length > 0 && (
              <div style={{ fontSize: 12, color: "var(--green)", marginBottom: 2 }}>
                🔥 Strong save rate (&gt;4%): {result.flags.strong.join(", ")}
              </div>
            )}
            {result.flags.weak.length > 0 && (
              <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 2 }}>
                ⚠️ Weak save rate (&lt;2%): {result.flags.weak.join(", ")}
              </div>
            )}
            {result.flags.dw.length > 0 && (
              <div style={{ fontSize: 12, color: "var(--amber)", marginBottom: 2 }}>
                🌀 Discover Weekly: {result.flags.dw.join(", ")}
              </div>
            )}
            {result.top_city && (
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                📍 Top city: {result.top_city}
              </div>
            )}
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid var(--red)",
            borderRadius: 12,
            padding: "14px 16px",
            marginBottom: 20,
            color: "var(--red)",
            fontSize: 13,
            fontWeight: 700,
          }}>
            ❌ {error}
          </div>
        )}

        {/* Track cards */}
        {tracks.length === 0 && (
          <div style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: 40, fontSize: 13 }}>
            No live tracks found in catalog.
          </div>
        )}

        {tracks.map((track, i) => {
          const f = forms[track.track_id] || emptyForm();
          const filled = hasData(f);

          return (
            <div
              key={track.track_id}
              style={{
                background: "var(--surface)",
                border: `1px solid ${filled ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 14,
                padding: "18px 16px",
                marginBottom: 16,
                transition: "border-color 0.2s",
              }}
            >
              {/* Track header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, letterSpacing: "0.05em" }}>
                    {track.title}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
                    Live {track.release_date}
                    {track.last_s4a_date && ` · Last pull: ${track.last_s4a_date}`}
                  </div>
                </div>
                {track.current_popularity !== null && (
                  <div style={{
                    background: "var(--surface-2)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 900,
                    color: "var(--text-muted)",
                  }}>
                    pop {track.current_popularity}
                  </div>
                )}
              </div>

              {/* Streams row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={labelStyle}>Streams (7-day)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={track.current_streams_cumulative ? "e.g. 1200" : "—"}
                    value={f.streams_7day}
                    onChange={e => setField(track.track_id, "streams_7day", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Streams (All-time)</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={track.current_streams_cumulative ? String(track.current_streams_cumulative) : "—"}
                    value={f.streams_cumulative}
                    onChange={e => setField(track.track_id, "streams_cumulative", e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Saves + Save Rate */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={labelStyle}>Saves</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder={track.current_saves ? String(track.current_saves) : "—"}
                    value={f.saves}
                    onChange={e => setField(track.track_id, "saves", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Save Rate %
                    <span style={{ color: "var(--green)", marginLeft: 4 }}>▲4% · </span>
                    <span style={{ color: "var(--red)" }}>▼2%</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder={track.current_save_rate ? String(track.current_save_rate) : "e.g. 3.2"}
                    value={f.save_rate_percent}
                    onChange={e => setField(track.track_id, "save_rate_percent", e.target.value)}
                    style={{
                      ...inputStyle,
                      borderColor: f.save_rate_percent !== "" && Number(f.save_rate_percent) > 4
                        ? "var(--green)"
                        : f.save_rate_percent !== "" && Number(f.save_rate_percent) < 2
                        ? "var(--red)"
                        : "var(--border)",
                    }}
                  />
                </div>
              </div>

              {/* Top cities */}
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Top 3 Cities</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {(["city_1", "city_2", "city_3"] as const).map((key, ci) => (
                    <input
                      key={key}
                      type="text"
                      placeholder={track.current_top_cities[ci] || `City ${ci + 1}`}
                      value={f[key]}
                      onChange={e => setField(track.track_id, key, e.target.value)}
                      style={inputStyle}
                    />
                  ))}
                </div>
              </div>

              {/* Playlist adds + DW */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={labelStyle}>Playlist Adds</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={f.playlist_adds}
                    onChange={e => setField(track.track_id, "playlist_adds", e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Discover Weekly</label>
                  <button
                    onClick={() => setField(track.track_id, "discover_weekly", !f.discover_weekly)}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      textAlign: "left",
                      background: f.discover_weekly ? "rgba(62,207,142,0.15)" : "var(--surface-2)",
                      borderColor: f.discover_weekly ? "var(--green)" : "var(--border)",
                      color: f.discover_weekly ? "var(--green)" : "var(--text-muted)",
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    {f.discover_weekly ? "✅ YES" : "No"}
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Anything notable this pull..."
                  value={f.notes}
                  onChange={e => setField(track.track_id, "notes", e.target.value)}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
                />
              </div>
            </div>
          );
        })}

        {/* Save button — fixed bottom */}
        <div style={{
          position: "fixed",
          bottom: "calc(var(--nav-height) + env(safe-area-inset-bottom))",
          left: 0,
          right: 0,
          padding: "12px 16px",
          background: "var(--bg)",
          borderTop: "1px solid var(--border)",
          zIndex: 20,
        }}>
          <button
            onClick={handleSave}
            disabled={!canSave}
            style={{
              width: "100%",
              padding: "14px 0",
              borderRadius: 12,
              border: "none",
              background: canSave ? "var(--accent)" : "var(--surface-3)",
              color: canSave ? "#000" : "var(--text-muted)",
              fontWeight: 900,
              fontSize: 14,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: canSave ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {saving
              ? "Saving..."
              : canSave
              ? `Save ${filledCount} Track${filledCount !== 1 ? "s" : ""} to Catalog`
              : "Fill in at least 1 track"}
          </button>
        </div>

      </div>
    </div>
  );
}
