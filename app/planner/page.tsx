'use client';

import { useState, useEffect } from 'react';
import { getWeeklyLaneHeatmap, WeeklyHeatmap } from '@/lib/completionAnalytics';
import { getLaneStatus, Lane } from '@/lib/lanes';
import WeeklyMirror from '@/components/WeeklyMirror';
import Link from 'next/link';
import {
  SPRINT_WEEKS,
  SPRINT_RULES,
  PHASE_CONFIG,
} from '@/lib/marathon-data';

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_CYCLE: any[] = ['not_started', 'in_progress', 'done'];
const PHASES: any[] = ['ALL_LOVE', 'CREAM', 'FREAKSHOW']; // DELUXE retired May 2026

const PHASE_BADGE_STYLE: Record<string, string> = {
  'ALL LOVE':      'bg-[#C8952A] text-black',
  'DELUXE':        'bg-[#2A1E08] text-[#C8952A] border border-[#C8952A55]',
  'CREAM':         'bg-[#1E1E1E] text-[#9A9A9A] border border-[#9A9A9A55]',
  'FREAKSHOW':     'bg-[#1A1028] text-[#9A70C0] border border-[#9A70C055]',
  'DELUXE / CREAM':'bg-[#1A1A1A] text-[#C8952A] border border-[#C8952A44]',
  'BUFFER':        'bg-[#111] text-[#444] border border-[#222]',
};

function badgeClass(badge: string): string {
  return PHASE_BADGE_STYLE[badge] ?? 'bg-[#1A1A1A] text-[#555]';
}

function getCurrentWeekIndex(): number {
  const today = new Date().toISOString().split('T')[0];
  return SPRINT_WEEKS.findIndex(w => today >= w.startDate && today <= w.endDate);
}

// ── Component ────────────────────────────────────────────────────────────────

export default function PlannerPage() {
  const [loaded, setLoaded]             = useState(false);
  const [showMatrix, setShowMatrix]     = useState(false);
  const [showRules, setShowRules]       = useState(false);
  const [heatmap, setHeatmap]           = useState<WeeklyHeatmap | null>(null);
  const [lanes, setLanes]               = useState<Lane[]>([]);

  useEffect(() => {
    setLoaded(true);
    getWeeklyLaneHeatmap().then(setHeatmap);
    getLaneStatus().then(setLanes);
  }, []);

  const currentWkIdx = getCurrentWeekIndex();
  const currentWeek = currentWkIdx >= 0 ? SPRINT_WEEKS[currentWkIdx] : null;

  if (!loaded) {
    return (
      <div className="page flex items-center justify-center">
        <p className="text-[#333] text-[10px] tracking-[0.3em]">LOADING MARATHON...</p>
      </div>
    );
  }

  return (
    <div className="page animate-fade-in">
      <div className="page-inner !pt-0 pb-16">

        {/* ── BREADCRUMB ── */}
        <div className="px-5 pt-5 pb-1">
          <Link href="/" className="text-[9px] font-black tracking-[0.2em] text-[#333] uppercase hover:text-[#555] transition-colors">
            WAR ROOM
          </Link>
          <span className="text-[9px] text-[#222] mx-2">/</span>
          <span className="text-[9px] font-black tracking-[0.2em] text-[#555] uppercase">PLANNER</span>
        </div>

        {/* ── HEADER + OVERALL PROGRESS ── */}
        <div className="px-5 pt-8 pb-5 border-b border-[#161616]">
          <p className="text-[8px] font-black tracking-[0.3em] text-[#C8952A] mb-1">14-WEEK MARATHON TRACKER</p>
          <h1 className="text-[22px] font-black tracking-tight text-white mb-5">PAST.EL NOIR SPRINT</h1>

          <Link href="/release" className="block mb-4 p-3 rounded-xl border active:scale-[0.98] transition-all" style={{ borderColor: 'rgba(200,149,42,0.3)', background: 'rgba(200,149,42,0.03)' }}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[9px] font-black tracking-widest text-[#C8952A]">EP CYCLE BOARD</span>
              <span className="text-[9px] font-black text-[#C8952A]">Track status → STUDIO ›</span>
            </div>
            <p className="text-[10px] text-[#444]">Waterfall · Cycle phases · Per-track status. Open Studio for the full board.</p>
          </Link>

        </div>

        {/* ── CURRENT WEEK CARD ── */}
        {currentWeek ? (
          <div className="mx-4 mt-5 p-4 rounded-2xl border border-[#C8952A] bg-[#0D0B06]">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[8px] font-black tracking-widest text-[#C8952A] mb-0.5">YOU ARE HERE</p>
                <p className="text-[20px] font-black text-white leading-none">
                  WK {currentWeek.wk}
                  <span className="text-[#555] text-[13px] font-normal ml-2">{currentWeek.dates}</span>
                </p>
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-lg ${badgeClass(currentWeek.phaseBadge)}`}>
                {currentWeek.phaseBadge}
              </span>
            </div>

            <div className="flex justify-between border-t border-[#1E1A0E] pt-3">
              <div>
                <p className="text-[8px] text-[#555] tracking-widest mb-0.5">WEEK TARGET</p>
                <p className="text-[12px] font-black text-white">{currentWeek.target}</p>
              </div>
            </div>

            {currentWeek.keyEvents.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-[#1E1A0E] pt-3">
                {currentWeek.keyEvents.map((evt, i) => (
                  <p key={i} className="text-[10px] text-[#C8952A] flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#C8952A] flex-shrink-0" />
                    {evt}
                  </p>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-4 mt-5 p-4 rounded-2xl border border-[#1A1A1A] bg-[#0D0D0D]">
            <p className="text-[10px] text-[#444] text-center">No active sprint week — check sprint dates</p>
          </div>
        )}

        {/* ── LANES TODAY — moved from Home ── */}
        {lanes.length > 0 && (
          <div className="px-4 mt-6">
            <p className="text-[9px] font-black tracking-widest text-[#444] mb-3">LANES TOUCHED TODAY</p>
            <div className="card !p-4">
              <div className="grid grid-cols-6 gap-3">
                {lanes.map(lane => {
                  const ringColors: Record<string, string> = {
                    money: 'ring-green-400', body: 'ring-orange-400', music: 'ring-blue-400',
                    content: 'ring-pink-400', life: 'ring-yellow-400', inner: 'ring-purple-400',
                  };
                  return (
                    <div key={lane.id} className="flex flex-col items-center gap-1.5">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-base transition-all duration-500 ${
                        lane.touched
                          ? `${lane.bgColor} ring-2 ${ringColors[lane.id]} ${lane.color} scale-105`
                          : 'bg-[#111] ring-1 ring-[#222] opacity-40'
                      }`}>
                        {lane.icon}
                      </div>
                      <span className={`text-[7px] font-black tracking-wider uppercase ${lane.touched ? lane.color : 'text-[#333]'}`}>
                        {lane.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-[9px] text-[#444] font-bold mt-3">
                {lanes.filter(l => l.touched).length}/6 lanes active today
              </p>
            </div>
          </div>
        )}

        {/* ── WEEKLY MIRROR — moved from Home ── */}
        <div className="px-4 mt-6">
          <p className="text-[9px] font-black tracking-widest text-[#444] mb-3">WEEKLY MIRROR</p>
          <WeeklyMirror />
        </div>

        {/* ── TRACK INVENTORY → RELEASE ── */}
        <div className="px-4 mt-7">
          <Link href="/release"
            className="flex items-center justify-between p-4 rounded-2xl border active:scale-[0.98] transition-all"
            style={{ borderColor: 'rgba(200,149,42,0.2)', background: 'rgba(200,149,42,0.02)' }}
          >
            <div>
              <p className="text-[9px] font-black tracking-widest text-[#C8952A] mb-1">TRACK INVENTORY</p>
              <p className="text-[10px] text-[#444]">EP Cycle Board · Waterfall · Per-track phases</p>
            </div>
            <span className="text-[#555] text-lg">›</span>
          </Link>
        </div>

        {/* ── LANE HEATMAP ── */}
        {heatmap && (
          <div className="px-4 mt-6">
            <p className="text-[9px] font-black tracking-widest text-[#444] mb-3">WEEKLY LANE HEATMAP</p>
            <div className="card !p-3">
              {/* Day headers */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="text-[7px] text-[#333] font-bold text-right pr-1 flex items-center justify-end"></div>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} className="text-[8px] text-[#445] font-black text-center">{d}</div>
                ))}
              </div>
              {/* Lane rows */}
              {[{id:'money',icon:'💰',color:'#22c55e'},{id:'body',icon:'🏋️',color:'#f97316'},{id:'music',icon:'🎹',color:'#60a5fa'},{id:'content',icon:'📱',color:'#f472b6'},{id:'life',icon:'🏠',color:'#facc15'},{id:'inner',icon:'🧘',color:'#a78bfa'}].map(lane => (
                <div key={lane.id} className="grid grid-cols-8 gap-1 mb-1.5">
                  <div className="text-[9px] flex items-center justify-end pr-1">{lane.icon}</div>
                  {heatmap.days.map(dateISO => {
                    const cell = heatmap.cells.find(c => c.laneId === lane.id && c.dateISO === dateISO);
                    const t = cell?.touches || 0;
                    const opacity = t === 0 ? 0 : t === 1 ? 0.25 : t <= 3 ? 0.55 : 0.9;
                    return (
                      <div
                        key={dateISO}
                        className="w-full aspect-square rounded"
                        style={{
                          backgroundColor: t === 0 ? '#111' : lane.color,
                          opacity,
                          border: '1px solid #1a1a1a',
                        }}
                        title={`${lane.id}: ${t} touches on ${dateISO}`}
                      />
                    );
                  })}
                </div>
              ))}
              <p className="text-[7px] text-[#333] mt-2 text-right">dim = 1 touch · bright = 4+ touches</p>
            </div>
          </div>
        )}

        {/* ── FULL SPRINT PLAN MATRIX ── */}
        <div className="px-4 mt-6">
          <button
            onClick={() => setShowMatrix(v => !v)}
            className="w-full flex items-center justify-between py-2"
          >
            <p className="text-[9px] font-black tracking-widest text-[#444]">FULL SPRINT PLAN</p>
            <span className="text-[10px] text-[#333]">{showMatrix ? '▲ COLLAPSE' : '▼ VIEW ALL 14 WEEKS'}</span>
          </button>

          {showMatrix && (
            <div className="space-y-2 mt-3">
              {SPRINT_WEEKS.map((week, idx) => {
                const isCurrent = idx === currentWkIdx;
                const isPast = currentWkIdx >= 0 && idx < currentWkIdx;
                return (
                  <div
                    key={week.wk}
                    className={`p-3 rounded-xl border transition-all ${
                      isCurrent ? 'border-[#C8952A] bg-[#0D0B06]'
                      : isPast ? 'border-[#111] bg-[#080808]'
                      : 'border-[#141414] bg-[#0A0A0A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#C8952A]" />}
                        <span className={`text-[11px] font-black ${isCurrent ? 'text-white' : isPast ? 'text-[#333]' : 'text-[#555]'}`}>
                          WK {week.wk}
                        </span>
                        <span className={`text-[10px] ${isPast ? 'text-[#2A2A2A]' : 'text-[#444]'}`}>{week.dates}</span>
                      </div>
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded ${badgeClass(week.phaseBadge)}`}>
                        {week.phaseBadge}
                      </span>
                    </div>

                    <p className={`text-[10px] mt-1 pl-3.5 ${isPast ? 'text-[#2A2A2A]' : 'text-[#444]'}`}>
                      {week.target}
                    </p>

                    {week.keyEvents.map((evt, i) => (
                      <p key={i} className={`text-[9px] mt-0.5 pl-3.5 ${isPast ? 'text-[#2A2A2A]' : 'text-[#C8952A]'}`}>
                        ↳ {evt}
                      </p>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── SPRINT RULES ── */}
        <div className="px-4 mt-6 mb-8">
          <button
            onClick={() => setShowRules(v => !v)}
            className="w-full flex items-center justify-between py-2"
          >
            <p className="text-[9px] font-black tracking-widest text-[#444]">SPRINT RULES</p>
            <span className="text-[10px] text-[#333]">{showRules ? '▲' : '▼'}</span>
          </button>

          {showRules && (
            <div className="border border-[#161616] rounded-2xl overflow-hidden mt-2">
              {SPRINT_RULES.map((rule, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center px-4 py-2.5 ${
                    i < SPRINT_RULES.length - 1 ? 'border-b border-[#0F0F0F]' : ''
                  }`}
                >
                  <span className="text-[10px] text-[#444]">{rule.label}</span>
                  <span className="text-[10px] text-white font-medium text-right ml-4">{rule.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
