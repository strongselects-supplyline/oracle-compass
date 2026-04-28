'use client';

import { useEffect, useState, useCallback } from 'react';
import { EP_RELEASE_DATE } from '@/lib/releases';
import { deriveKillList, KillTask } from '@/lib/killList';
import { getStoreValue, setStoreValue } from '@/lib/db';

// ─── Types ───────────────────────────────────────────────────────────────────

type CatalogTrack = {
  track_id: string;
  title: string;
  status: string;
  release_date: string;
  project: string;
  metadata: { isrc: string | null; upc: string | null };
  audio: { bpm: number | null; key: string | null };
  streaming: { spotify_12mo: number | null; spotify_alltime: number | null; spotify_popularity?: number | null };
};

type CatalogData = {
  _meta: { updated: string };
  artist: { spotify_monthly_listeners: number; spotify_followers: number };
  catalog: CatalogTrack[];
};

type ToolHealth = {
  name: string;
  link: string | null;
  mtime: string | null;
  ageDays: number | null;
  color: 'green' | 'amber' | 'red' | 'unknown';
};

type AudienceSnapshot = {
  current: {
    snapshot_date: string;
    spotify_monthly_listeners: number | null;
    spotify_followers: number | null;
    instagram_followers: number | null;
    youtube_subscribers: number | null;
    email_subscribers: number | null;
    tiktok_followers: number | null;
  };
  previous: {
    spotify_monthly_listeners: number | null;
    spotify_followers: number | null;
    instagram_followers: number | null;
    youtube_subscribers: number | null;
    email_subscribers: number | null;
    tiktok_followers: number | null;
  };
};

type RightsState = 'unknown' | 'confirmed' | 'pending' | 'missing';
type RightsRow = { id: string; title: string; distance_over_time: RightsState; ascap: RightsState; songtrust: RightsState; soundexchange: RightsState };
type RightsMatrix = { tracks: RightsRow[] };

type RevenueMonth = { month: string; doordash: number | null; streaming: number | null; total: number | null };
type RevenueData = { bridge_target_monthly: number; months: RevenueMonth[] };

// ─── Helpers ────────────────────────────────────────────────────────────────

function countdown(targetDate: string): string {
  const target = new Date(targetDate + 'T00:00:00');
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return 'LIVE';
  const days = Math.floor(diff / 86400000);
  const hrs = Math.floor((diff % 86400000) / 3600000);
  return `${days}d ${hrs}h`;
}

function fmt(n: number | null): string {
  if (n === null) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

function delta(curr: number | null, prev: number | null): string {
  if (curr === null || prev === null) return '';
  const d = curr - prev;
  return d >= 0 ? `+${fmt(d)}` : fmt(d);
}

function statusColor(status: string): string {
  if (status === 'live') return '#4ade80';
  if (status === 'in_sprint' || status === 'unreleased') return '#facc15';
  return '#6b7280';
}

function statusLabel(status: string): string {
  if (status === 'live') return 'LIVE';
  if (status === 'in_sprint') return 'IN SPRINT';
  if (status === 'unreleased') return 'UNRELEASED';
  return status.toUpperCase();
}

const RIGHTS_CYCLE: RightsState[] = ['unknown', 'confirmed', 'pending', 'missing'];
const RIGHTS_COLORS: Record<RightsState, string> = {
  unknown: '#4b5563',
  confirmed: '#4ade80',
  pending: '#facc15',
  missing: '#ef4444',
};

function healthColor(color: string): string {
  if (color === 'green') return '#4ade80';
  if (color === 'amber') return '#facc15';
  if (color === 'red') return '#ef4444';
  return '#4b5563';
}

// ─── Panel Component ─────────────────────────────────────────────────────────

function Panel({ title, children, fullWidth }: { title: string; children: React.ReactNode; fullWidth?: boolean }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 10,
      padding: '20px 20px 16px',
      gridColumn: fullWidth ? '1 / -1' : undefined,
      minWidth: 0,
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 14 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function KamiPage() {
  const [time, setTime] = useState(new Date());
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [tools, setTools] = useState<ToolHealth[]>([]);
  const [audience, setAudience] = useState<AudienceSnapshot | null>(null);
  const [killTasks, setKillTasks] = useState<KillTask[]>([]);
  const [rights, setRights] = useState<RightsRow[]>([]);
  const [revenue, setRevenue] = useState<RevenueData | null>(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Fetch server data
  useEffect(() => {
    fetch('/api/kami/catalog').then(r => r.json()).then(setCatalog).catch(() => null);
    fetch('/api/kami/tools-health').then(r => r.json()).then(setTools).catch(() => []);
    fetch('/api/kami/audience').then(r => r.json()).then(setAudience).catch(() => null);
    fetch('/api/kami/revenue').then(r => r.json()).then(setRevenue).catch(() => null);
  }, []);

  // Kill List from IndexedDB
  useEffect(() => {
    deriveKillList().then(tasks => setKillTasks(tasks.filter(t => t.urgency === 'RED').slice(0, 5))).catch(() => null);
  }, []);

  // Rights matrix: IndexedDB first, fallback to JSON seed
  useEffect(() => {
    async function loadRights() {
      const stored = await getStoreValue<RightsRow[]>('kami_rights_matrix');
      if (stored && stored.length > 0) {
        setRights(stored);
        return;
      }
      try {
        const seedRes = await fetch('/api/kami/rights');
        const seed: RightsMatrix = await seedRes.json();
        setRights(seed.tracks);
        await setStoreValue('kami_rights_matrix', seed.tracks);
      } catch {
        // silently fail
      }
    }
    loadRights();
  }, []);

  const cycleRightsState = useCallback(async (trackId: string, col: keyof Omit<RightsRow, 'id' | 'title'>) => {
    setRights(prev => {
      const updated = prev.map(row => {
        if (row.id !== trackId) return row;
        const current = row[col] as RightsState;
        const next = RIGHTS_CYCLE[(RIGHTS_CYCLE.indexOf(current) + 1) % RIGHTS_CYCLE.length];
        return { ...row, [col]: next };
      });
      setStoreValue('kami_rights_matrix', updated);
      return updated;
    });
  }, []);

  const epCountdown = countdown(EP_RELEASE_DATE);
  const allLoveTracks = catalog?.catalog.filter(t => t.project === 'all_love_ep') || [];
  const liveTracks = catalog?.catalog.filter(t => t.status === 'live') || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c14',
      color: '#fff',
      fontFamily: 'var(--font-geist-mono, monospace)',
    }}>
      {/* ─── Sticky Header ─── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(8,12,20,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-1px' }}>KAMI</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            past.El noir Records
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>NEXT DROP</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: epCountdown === 'LIVE' ? '#4ade80' : '#facc15' }}>
              {epCountdown === 'LIVE' ? '🟢 LIVE' : `⏱ ${epCountdown}`}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>LOCAL</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Grid ─── */}
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '24px 20px 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 16,
      }}>

        {/* ── 1. CATALOG ── */}
        <Panel title="Catalog" fullWidth>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'left' }}>
                  <th style={{ padding: '4px 8px 8px 0', fontWeight: 600 }}>Title</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600, textAlign: 'right' }}>12mo</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600 }}>Key</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600 }}>BPM</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600 }}>Released</th>
                  <th style={{ padding: '4px 8px 8px', fontWeight: 600 }}>ISRC</th>
                </tr>
              </thead>
              <tbody>
                {(catalog?.catalog || []).map(track => (
                  <tr key={track.track_id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '7px 8px 7px 0', color: '#fff', fontWeight: 500 }}>{track.title}</td>
                    <td style={{ padding: '7px 8px' }}>
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '1px',
                        color: statusColor(track.status),
                        background: `${statusColor(track.status)}18`,
                        border: `1px solid ${statusColor(track.status)}40`,
                        borderRadius: 4,
                        padding: '2px 6px',
                      }}>
                        {statusLabel(track.status)}
                      </span>
                    </td>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.65)', textAlign: 'right' }}>
                      {fmt(track.streaming?.spotify_12mo ?? null)}
                    </td>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.5)' }}>{track.audio?.key ?? '—'}</td>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.5)' }}>{track.audio?.bpm ?? '—'}</td>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.4)' }}>{track.release_date}</td>
                    <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', fontSize: 10 }}>
                      {track.metadata?.isrc ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!catalog && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, padding: '12px 0' }}>Loading catalog…</div>}
          </div>
        </Panel>

        {/* ── 2. RELEASE PIPELINE ── */}
        <Panel title="Release Pipeline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'rgba(250,204,21,0.08)',
              border: '1px solid rgba(250,204,21,0.25)',
              borderRadius: 8,
              padding: '14px 16px',
            }}>
              <div style={{ fontSize: 11, color: '#facc15', fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>ALL LOVE EP</div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-1px', marginBottom: 2 }}>
                {epCountdown === 'LIVE' ? '🟢 OUT NOW' : epCountdown}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>June 20, 2026 · Amuse Pro · Waterfall</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'SEE ME', date: 'Mar 13, 2026', status: 'live' },
                { label: 'East Side Love', date: 'May 9, 2026', status: 'unreleased' },
                { label: 'Green Light', date: 'May 23, 2026', status: 'unreleased' },
                { label: 'Sweet Frustration', date: 'Jun 6, 2026', status: 'unreleased' },
                { label: 'ALL LOVE EP', date: 'Jun 20, 2026', status: 'unreleased' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: '#fff' }}>{r.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{r.date}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: statusColor(r.status), letterSpacing: '0.5px' }}>
                      {statusLabel(r.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>WATERFALL SPRINT: Apr 28 → Jun 20</div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: '#facc15',
                  width: `${Math.min(100, Math.max(0, ((new Date().getTime() - new Date('2026-04-28').getTime()) / (new Date('2026-06-20').getTime() - new Date('2026-04-28').getTime())) * 100))}%`,
                  borderRadius: 2,
                  transition: 'width 1s',
                }} />
              </div>
            </div>
          </div>
        </Panel>

        {/* ── 3. TOOLS HEALTH ── */}
        <Panel title="Tools Health">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tools.length === 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>}
            {tools.map(tool => (
              <div key={tool.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#fff' }}>
                    {tool.link ? <a href={tool.link} target="_blank" rel="noreferrer" style={{ color: '#fff', textDecoration: 'none' }}>{tool.name} ↗</a> : tool.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {tool.mtime ? new Date(tool.mtime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'not found'}
                    {tool.ageDays !== null && ` · ${tool.ageDays}d ago`}
                  </div>
                </div>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: healthColor(tool.color),
                  flexShrink: 0,
                }} />
              </div>
            ))}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
              🟢 &lt;7d · 🟡 &lt;30d · 🔴 older
            </div>
          </div>
        </Panel>

        {/* ── 4. KILL LIST ── */}
        <Panel title="Kill List — Top RED">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {killTasks.length === 0 && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>No RED tasks right now.</div>
            )}
            {killTasks.map(task => (
              <div key={task.id} style={{
                padding: '10px 12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 6,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 2 }}>{task.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{task.subtitle}</div>
              </div>
            ))}
            <a href="/kill" style={{ display: 'inline-block', marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              → Full Kill List
            </a>
          </div>
        </Panel>

        {/* ── 5. AUDIENCE SNAPSHOT ── */}
        <Panel title="Audience Snapshot">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { label: 'Spotify Monthly', curr: audience?.current?.spotify_monthly_listeners ?? null, prev: audience?.previous?.spotify_monthly_listeners ?? null },
              { label: 'Spotify Followers', curr: audience?.current?.spotify_followers ?? null, prev: audience?.previous?.spotify_followers ?? null },
              { label: 'Instagram', curr: audience?.current?.instagram_followers ?? null, prev: audience?.previous?.instagram_followers ?? null },
              { label: 'YouTube Subs', curr: audience?.current?.youtube_subscribers ?? null, prev: audience?.previous?.youtube_subscribers ?? null },
              { label: 'Email List', curr: audience?.current?.email_subscribers ?? null, prev: audience?.previous?.email_subscribers ?? null },
              { label: 'TikTok', curr: audience?.current?.tiktok_followers ?? null, prev: audience?.previous?.tiktok_followers ?? null },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: row.curr ? '#fff' : 'rgba(255,255,255,0.25)' }}>
                    {fmt(row.curr)}
                  </span>
                  {delta(row.curr, row.prev) && (
                    <span style={{ fontSize: 10, color: (row.curr ?? 0) >= (row.prev ?? 0) ? '#4ade80' : '#ef4444' }}>
                      {delta(row.curr, row.prev)}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {audience && (
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
                Snapshot: {audience.current.snapshot_date}
              </div>
            )}
          </div>
        </Panel>

        {/* ── 6. RIGHTS MATRIX ── */}
        <Panel title="Rights Matrix — Click to cycle state" fullWidth>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <th style={{ padding: '4px 8px 10px 0', fontWeight: 600, textAlign: 'left' }}>Track</th>
                  {(['distance_over_time', 'ascap', 'songtrust', 'soundexchange'] as const).map(col => (
                    <th key={col} style={{ padding: '4px 8px 10px', fontWeight: 600, textAlign: 'center', fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {col.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rights.map(row => (
                  <tr key={row.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '8px 8px 8px 0', color: '#fff', fontWeight: 500 }}>{row.title}</td>
                    {(['distance_over_time', 'ascap', 'songtrust', 'soundexchange'] as const).map(col => (
                      <td key={col} style={{ padding: '8px', textAlign: 'center' }}>
                        <button
                          onClick={() => cycleRightsState(row.id, col)}
                          style={{
                            background: `${RIGHTS_COLORS[row[col]]}18`,
                            border: `1px solid ${RIGHTS_COLORS[row[col]]}50`,
                            borderRadius: 4,
                            color: RIGHTS_COLORS[row[col]],
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: '0.5px',
                            padding: '3px 8px',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontFamily: 'inherit',
                          }}
                        >
                          {row[col]}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {rights.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, padding: '12px 0' }}>Loading rights data…</div>}
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 10 }}>
              States cycle: unknown → confirmed → pending → missing. Persists in browser IndexedDB.
            </div>
          </div>
        </Panel>

        {/* ── 7. REVENUE ── */}
        <Panel title="Revenue — DoorDash Bridge">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {revenue ? (
              <>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Bridge target</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>${revenue.bridge_target_monthly}/mo</span>
                  </div>
                </div>

                {/* Bar chart */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {revenue.months.map(m => {
                    const total = m.total ?? (m.doordash ?? 0) + (m.streaming ?? 0);
                    const pct = total ? Math.min(100, (total / revenue.bridge_target_monthly) * 100) : 0;
                    const monthLabel = new Date(m.month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    return (
                      <div key={m.month} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', width: 42, flexShrink: 0 }}>{monthLabel}</span>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: pct >= 100 ? '#4ade80' : pct > 50 ? '#facc15' : '#6b7280', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 10, color: total ? '#fff' : 'rgba(255,255,255,0.25)', width: 44, textAlign: 'right', flexShrink: 0 }}>
                          {total ? `$${total}` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                  Fill real numbers in data/revenue_monthly.json
                </div>
              </>
            ) : (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Loading…</div>
            )}
          </div>
        </Panel>

      </div>
    </div>
  );
}
