'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  ALL_TRACKS,
  getTrackStatuses,
  updateTrackPhase,
  TrackProductionStatus,
  TrackPhase,
  PHASE_ORDER,
  nextPhase,
  Phase,
  SprintWeek,
  SPRINT_WEEKS,
  SPRINT_RULES,
  PHASE_CONFIG,
  TOTAL_TRACKS
} from '@/lib/planner';

// For the UI rendering, we still need the generic marathon phase styles
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

export default function PlannerPage() {
  const [statuses, setStatuses]         = useState<TrackProductionStatus[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [showMatrix, setShowMatrix]     = useState(false);
  const [showRules, setShowRules]       = useState(false);

  useEffect(() => {
    getTrackStatuses().then(s => { setStatuses(s); setLoaded(true); });
  }, []);

  const cycleStatus = useCallback((trackName: string) => {
    setStatuses(prev => {
      const t = prev.find(p => p.name === trackName);
      if (!t) return prev;
      
      const updatedPhase = nextPhase(t.phase);
      const nextArr = prev.map(p => p.name === trackName ? { ...p, phase: updatedPhase } : p);
      
      // Fire and forget IO
      updateTrackPhase(trackName, updatedPhase);
      
      return nextArr;
    });
  }, []);

  // ── Derived stats ──
  const doneCount = statuses.filter(s => s.phase === 'done').length;
  const inProgCount = statuses.filter(s => s.phase !== 'not_started' && s.phase !== 'done').length;
  const totalCount = statuses.length;
  const pct = Math.round((doneCount / (totalCount || 1)) * 100);

  const currentWkIdx = getCurrentWeekIndex();
  const currentWeek = currentWkIdx >= 0 ? SPRINT_WEEKS[currentWkIdx] : null;

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#333] text-[10px] tracking-[0.3em]">LOADING SPRINT DATA...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-32">

      {/* ── HEADER + OVERALL PROGRESS ── */}
      <div className="px-5 pt-8 pb-5 border-b border-[#161616]">
        <p className="text-[8px] font-black tracking-[0.3em] text-[#C8952A] mb-1">ALL LOVE SPRINT TRACKER</p>
        <h1 className="text-[22px] font-black tracking-tight text-white mb-5">STUDIO SPRINT</h1>

        {/* Overall bar */}
        <div className="mb-1.5 flex justify-between">
          <span className="text-[9px] font-black tracking-widest text-[#444]">OVERALL</span>
          <span className="text-[9px] font-black text-[#C8952A]">{doneCount} / {totalCount} TRACKS</span>
        </div>
        <div className="h-[3px] bg-[#1A1A1A] rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-[#C8952A] rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex gap-4">
          <span className="text-[8px] text-[#C8952A]">● {doneCount} done</span>
          <span className="text-[8px] text-[#666]">◐ {inProgCount} in progress</span>
          <span className="text-[8px] text-[#333]">○ {TOTAL_TRACKS - doneCount - inProgCount} remaining</span>
        </div>

        {/* Phase bars */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {PHASE_ORDER.map((phase) => {
            const cfg = PHASE_CONFIG[phase as Phase];
            if (!cfg) return null;
            
            const total = 1; // Assuming 1 target for EP phases, to simplify for now, since we only have 4 active tracks.
            const done = statuses.filter(s => s.phase === 'done').length;
            const p = Math.round((done / 4) * 100);
            return (
              <div key={phase}>
                <p className="text-[7px] font-black tracking-widest mb-1.5" style={{ color: cfg.color }}>
                  {cfg.badge}
                </p>
                <div className="h-[3px] bg-[#1A1A1A] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p}%`, backgroundColor: cfg.color }}
                  />
                </div>
                <p className="text-[8px] mt-1" style={{ color: cfg.color }}>{done}/4</p>
              </div>
            );
          })}
        </div>
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
            <div className="text-right">
              <p className="text-[8px] text-[#555] tracking-widest mb-0.5">MARATHON PACE</p>
              <p className="text-[12px] font-black text-[#C8952A]">{currentWeek.total} / 43</p>
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

      {/* ── TRACK INVENTORY ── */}
      <div className="px-4 mt-7">
        <p className="text-[9px] font-black tracking-widest text-[#444] mb-1">TRACK INVENTORY</p>
        <p className="text-[9px] text-[#333] mb-4">Tap any track to cycle phase: TRK → MIX → MAS → INST → DONE</p>

        <div className="mb-2.5 rounded-2xl border border-[#161616] overflow-hidden">
          <div className="divide-y divide-[#0F0F0F]">
            {statuses.map(track => {
              const isDone = track.phase === 'done';
              const isNotStarted = track.phase === 'not_started';
              const isActive = !isDone && !isNotStarted;

              return (
                <button
                  key={track.name}
                  onClick={() => cycleStatus(track.name)}
                  className="w-full flex items-center justify-between px-4 py-4 hover:bg-[#111] active:bg-[#151515] transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-[16px] flex-shrink-0 leading-none"
                      style={{ color: isDone ? '#C8952A' : isActive ? '#C8952A' : '#2A2A2A' }}
                    >
                      {isDone ? '●' : isActive ? '◐' : '○'}
                    </span>
                    <span
                      className={`text-[12px] ${
                        isDone ? 'text-[#3A3A3A] line-through' : 'text-white'
                      }`}
                    >
                      {track.name}
                    </span>
                  </div>
                  
                  {/* Phase Badge */}
                  <span className={`text-[8px] font-black tracking-widest px-2 py-1 rounded 
                    ${isNotStarted ? 'bg-[#111] text-[#333]' : 
                      isDone ? 'bg-[#1A1A1A] text-[#C8952A]' : 
                      'bg-[#2A1E08] text-[#C8952A] border border-[#C8952A55]'}`}
                  >
                    {track.phase.toUpperCase().replace('_', ' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

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
                    isCurrent
                      ? 'border-[#C8952A] bg-[#0D0B06]'
                      : isPast
                      ? 'border-[#111] bg-[#080808]'
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
                    <div className="flex items-center gap-2">
                      <span className={`text-[7px] font-black px-1.5 py-0.5 rounded ${badgeClass(week.phaseBadge)}`}>
                        {week.phaseBadge}
                      </span>
                      <span className={`text-[9px] font-black ${isCurrent ? 'text-[#C8952A]' : isPast ? 'text-[#333]' : 'text-[#555]'}`}>
                        {week.total}/43
                      </span>
                    </div>
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
  );
}
