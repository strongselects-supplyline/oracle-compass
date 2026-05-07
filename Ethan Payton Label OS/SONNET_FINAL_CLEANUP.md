# SONNET FINAL CLEANUP: Stale Date Purge + Content Studio .env

*Copy-paste this entire file into a Claude Code session (Sonnet). One task, ~10 min.*

---

## CONTEXT

Oracle Compass v35 deployed the EP Bomb Pivot to `releases.ts`, `phaseMap.ts`, and `killList.ts`. But 4 other files still reference the OLD Apr 27 waterfall dates (ESL May 9, GL May 23, SF Jun 6, EP Jun 20). These are WRONG. The correct dates are:

- **ALL LOVE EP (all 5 tracks):** May 15
- **Like I Did:** May 30
- **I Like Girls:** Jun 13
- **Worth It:** Jun 27
- **Just Say So:** Jul 11
- **Reconnect:** Jul 25

---

## TASK 1: Fix Oracle Compass stale dates

Working directory: `scratch/oracle-compass/`

### File: `lib/studioData.ts`

**Line 73** — Replace:
```
role: 'EP — 5-track waterfall. ESL May 9 → GL May 23 → SF Jun 6 → EP Jun 20. WU2 EP-exclusive.', trackCount: 5, targetDate: '2026-06-20',
```
With:
```
role: 'EP — 5-track bomb May 15. Post-EP vault waterfall: LID May 30 → ILG Jun 13 → WI Jun 27 → JSS Jul 11 → RCN Jul 25.', trackCount: 5, targetDate: '2026-05-15',
```

**Line 122** — Replace:
```
// WATERFALL PIVOT (Apr 28): Singles drip every 2 weeks → EP compilation at end.
```
With:
```
// EP BOMB PIVOT (Apr 29): Full EP drops May 15. Vault singles waterfall starts May 30.
```

### File: `lib/doctrineContent.tsx`

**Line 82** — Replace:
```
<tr><td style={{color:"#e05545",fontWeight:700}}>Fri May 9</td><td><strong>East Side Love drops</strong> (Waterfall Single 1)</td></tr>
```
With:
```
<tr><td style={{color:"#e05545",fontWeight:700}}>Thu May 15</td><td><strong>ALL LOVE EP drops</strong> (5 tracks — ICEMAN day)</td></tr>
```

**Line 149** — Replace:
```
<div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · THE WATERFALL</div><div className="scroll-gc-desc">May 9–Jun 20 (43 days). Singles drip biweekly. Content sprint per release. Rhythm IS the system.</div></div>
```
With:
```
<div className="scroll-grid-card" style={{borderTop:"3px solid #3ecf71"}}><div className="scroll-gc-title" style={{color:"#3ecf71"}}>Phase 2 · VAULT WATERFALL</div><div className="scroll-gc-desc">May 30–Jul 25 (57 days). Vault singles biweekly. Content sprint per release. Rhythm IS the system.</div></div>
```

**Line 247** — Replace:
```
<li className="scroll-p"><strong>Phase 2 rhythm is protected.</strong> May 9 is a hard boundary. Do not let Phase 1 sprint energy bleed into the waterfall.</li>
```
With:
```
<li className="scroll-p"><strong>Phase 2 rhythm is protected.</strong> May 30 is a hard boundary. EP compound phase (May 15-29) transitions cleanly into vault waterfall.</li>
```

### File: `lib/dayType.ts`

**Line 10** — Replace:
```
// PHASE 2 — THE WATERFALL (May 9 onward):
```
With:
```
// PHASE 2 — VAULT WATERFALL (May 30 onward):
```

**Line 25** — Replace:
```
// PHASE 2 DAILY BLOCK MAP (May 9+):
```
With:
```
// PHASE 2 DAILY BLOCK MAP (May 30+):
```

**Line 31** — Replace:
```
// Production sprint ends May 8. Phase 2 (WATERFALL) begins May 9 with ESL drop.
```
With:
```
// EP drops May 15. Phase 2 (VAULT WATERFALL) begins May 30 with Like I Did.
```

### File: `lib/marathon-data.ts`

**Line 4** — Replace:
```
// sprint weeks updated to waterfall cadence (ESL May 9 → GL May 23 → SF Jun 6 → EP Jun 20).
```
With:
```
// EP BOMB May 15. Vault waterfall: LID May 30 → ILG Jun 13 → WI Jun 27 → JSS Jul 11 → RCN Jul 25.
```

**Line 127** — Replace:
```
keyEvents: ['WATERFALL PIVOT: singles drip every 2 weeks', 'East Side Love drops May 9 🔥', 'Green Light drops May 23', 'Sweet Frustration drops Jun 6', 'ALL LOVE EP (5 tracks) drops Jun 20'],
```
With:
```
keyEvents: ['EP BOMB: ALL LOVE drops May 15 (ICEMAN day)', 'Like I Did May 30', 'I Like Girls Jun 13', 'Worth It Jun 27', 'Just Say So Jul 11', 'Reconnect Jul 25'],
```

---

## TASK 2: Content Studio .env.local

Check if `scratch/content-studio/.env.local` exists. If NOT, create it:

```env
SESSIONS_ROOT=/Volumes/LaCie/Content_Studio/sessions
PHONE_ROOT=/Volumes/LaCie/Content_Studio/phone
BROLL_ROOT=/Volumes/LaCie/Content_Studio/b-roll
EXPORTS_ROOT=/Volumes/LaCie/Content_Studio/exports
CACHE_ROOT=/Volumes/LaCie/Content_Studio/cache
CALIBRATION_ROOT=/Volumes/LaCie/Content_Studio/calibration
TEMPLATES_ROOT=/Volumes/LaCie/Content_Studio/templates
```

If it already exists, skip this task.

---

## TASK 3: Verify

```bash
cd scratch/oracle-compass && npx tsc --noEmit
```

Must compile clean. Then:

```bash
grep -rn "May 9\|May 23\|Jun 6\|Jun 20" lib/studioData.ts lib/doctrineContent.tsx lib/dayType.ts lib/marathon-data.ts
```

Should return ZERO hits.

---

## COMMIT MESSAGE

```
fix(oracle): purge stale waterfall dates from 4 remaining files

- studioData.ts: EP target May 15, vault waterfall dates corrected
- doctrineContent.tsx: Phase 2 dates + labels updated
- dayType.ts: Phase 2 start → May 30
- marathon-data.ts: keyEvents reflect EP bomb + vault order

All files now aligned with v35 EP Bomb Pivot (Apr 29).
```

## RULES
- Distributor is Amuse. Do not change.
- Do NOT touch releases.ts, phaseMap.ts, or killList.ts — those are already correct.
- Do NOT restructure anything. Exact string replacements only.
