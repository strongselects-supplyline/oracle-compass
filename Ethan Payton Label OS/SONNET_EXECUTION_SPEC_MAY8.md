# SONNET EXECUTION SPEC — May 8, 2026
**Author:** Opus (Cowork session, full conversation context)
**For:** Sonnet via Claude Code at `~/.gemini/antigravity/scratch/oracle-compass/`
**Priority:** Execute in order. Do not skip steps. Commit after each section.

---

## CONTEXT

This spec merges:
1. Valid findings from an Opus 4.7 full-sweep audit (run from Claude Code `~/`)
2. Completed work from the May 6–8 Cowork session that the audit missed
3. Remaining blockers the audit correctly identified

The audit was ~70% accurate. It missed all date-shift patches (releases.ts v37, dayType.ts, killList.ts, phaseMap.ts, CLAUDE.md, Sovereign Action Plan, Master Release Calendar), the Sonnet UI cleanup, the MASTER_DASHBOARD_2026.html build, and the Canada Goose Cyanite intake. It also conflated two separate memory systems (`.claude/memory/` in repo vs Cowork memory store).

**What is already done (DO NOT redo):**
- releases.ts bumped to v37 with all correct dates (ESL May 9, upload May 11, EP May 15)
- dayType.ts EP_SPRINT_END = May 12
- killList.ts all date refs updated
- phaseMap.ts rewritten for new timeline
- CLAUDE.md fully updated (May 6 verified)
- brain/SOVEREIGN_ACTION_PLAN_FINAL.md date-shift amendment added
- brain/2026_MASTER_RELEASE_CALENDAR.md rewritten
- MASTER_DASHBOARD_2026.html built and audited (version number dropped, LYRC removed, SEE ME status fixed)
- SONNET_VIDEO_ENGINE_FIXES.md added to .gitignore
- Oracle Compass rework deployed at commit a914d29 (5 departments, Kill List derivation, dead routes pruned)
- Canada Goose Cyanite analysis filed to Label OS folder (CREAM vault)

---

## SECTION 1 — GIT PUSH UNBLOCK [P0]

The local repo has uncommitted or unpushed changes. GitHub Push Protection previously blocked a push because `brain/SONNET_VIDEO_ENGINE_FIXES.md` contained API keys (OpenAI + Anthropic). The file is now in `.gitignore` but may still be tracked.

```bash
cd ~/.gemini/antigravity/scratch/oracle-compass

# 1. Remove the file from git tracking (keeps local copy)
git rm --cached "Ethan Payton Label OS/SONNET_VIDEO_ENGINE_FIXES.md" 2>/dev/null || true

# 2. Verify .gitignore has the entry
grep -q "SONNET_VIDEO_ENGINE_FIXES" .gitignore || echo "Ethan Payton Label OS/SONNET_VIDEO_ENGINE_FIXES.md" >> .gitignore

# 3. Stage everything
git add -A

# 4. Check status
git status

# 5. Commit
git commit -m "chore: scrub tracked secrets file, stage all pending changes"

# 6. Rebase on remote (remote may be ahead)
git pull --rebase origin main

# 7. Push
git push origin main
```

If push still fails on Push Protection, run:
```bash
git log --all --full-history -- "Ethan Payton Label OS/SONNET_VIDEO_ENGINE_FIXES.md"
```
Then use `git filter-branch` or `git rebase -i` to scrub the file from history entirely. The keys in that file should be considered compromised — Ethan will rotate them manually when ready.

**Success criteria:** `git push origin main` succeeds. Vercel auto-deploys.

---

## SECTION 2 — DECREE CORRUPTION FIX [P0]

**Problem:** Every file in `content/decrees/` (9 files, Apr 21 – May 6) contains Claude rate-limit error messages instead of valid JSON. The scheduled task that generates decrees was hitting usage caps and dumping the raw error string to disk.

**Files affected (ALL corrupted):**
- 2026-04-21.json → "You're out of extra usage · resets Apr 25 at 6am"
- 2026-04-22.json → "You're out of extra usage · resets Apr 25 at 6am"
- 2026-04-23.json → "Your organization does not have access to Claude..."
- 2026-04-24.json → "You're out of extra usage · resets 6am"
- 2026-04-28.json → "You're out of extra usage · resets May 1 at 10am"
- 2026-04-29.json → "You're out of extra usage · resets May 1 at 10am"
- 2026-04-30.json → "You're out of extra usage · resets May 1 at 10am"
- 2026-05-01.json → "You're out of extra usage · resets 10am"
- 2026-05-06.json → "You're out of extra usage · resets May 8 at 10am"

**Fix:**
1. Delete all 9 corrupted decree files:
```bash
rm content/decrees/2026-04-2*.json content/decrees/2026-04-3*.json content/decrees/2026-05-0*.json
```

2. Find the decree generation code. Search for:
```bash
grep -r "decrees" lib/ components/ app/ --include="*.ts" --include="*.tsx" -l
```

3. The generation function needs error handling. Wherever the decree content is written to disk, wrap it:
```typescript
// Before writing, validate the response is actual JSON
if (typeof content === 'string' && (content.includes('out of extra usage') || content.includes('does not have access'))) {
  console.error('[Decree] Skipped — received rate-limit or auth error instead of decree content');
  return; // Do NOT write garbage to disk
}
```

4. If the decree generator calls an LLM API, add a try/catch that checks the response status before writing.

5. Commit: `fix: purge corrupted decrees, add error guard to decree generator`

**Success criteria:** `ls content/decrees/` shows no files (or only valid JSON files). Decree generator has error handling that prevents future corruption.

---

## SECTION 3 — .claude/memory CLEANUP [P1]

The Opus 4.7 audit flagged `.claude/memory/` as 19 days stale. **This directory does not exist** in the oracle-compass repo. The audit confused it with the Cowork memory store (which IS current as of May 8).

**Action:** Verify and skip.
```bash
ls -la .claude/memory/ 2>/dev/null || echo "Directory does not exist — no action needed"
```

If the directory DOES exist (created after this spec was written), check contents. If files are from Apr 19 or earlier, they're migrated Cowork memories that are now redundant — the canonical memory lives in the Cowork session store. Safe to delete the directory.

---

## SECTION 4 — BLOB TOKEN CHECK [P2]

The audit flagged a Vercel BLOB_READ_WRITE_TOKEN leak. Grep confirmed this does NOT exist in the current codebase.

**Action:** Verify and skip.
```bash
grep -r "BLOB_READ_WRITE_TOKEN" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*" --include="*.md" | head -5
```

If nothing found, move on. If found in `.env.local` or similar, add to `.gitignore` and remove from tracking.

---

## SECTION 5 — VERIFICATION SWEEP [P2]

Final pass to confirm system coherence after all changes:

```bash
# 1. No stale May 7 or May 8 (as ESL release) dates in behavior-driving files
grep -rn "May 7\|May 8" lib/ --include="*.ts" | grep -v "node_modules" | grep -v ".next"

# 2. releases.ts version is 37
grep "RELEASE_DATA_VERSION" lib/releases.ts

# 3. EP_SPRINT_END is May 12
grep "EP_SPRINT_END" lib/dayType.ts

# 4. ESL date constants
grep "ESL_SINGLE_RELEASE_DATE\|EP_UPLOAD_DATE" lib/releases.ts

# 5. No corrupted decree files remain
for f in content/decrees/*.json; do
  python3 -c "import json; json.load(open('$f'))" 2>/dev/null || echo "INVALID: $f"
done

# 6. Git is clean
git status
```

**Expected results:**
- No "May 7" in lib/ except comments about historical context
- RELEASE_DATA_VERSION = 37
- EP_SPRINT_END = "2026-05-12T00:00:00"
- ESL_SINGLE_RELEASE_DATE = "2026-05-09"
- EP_UPLOAD_DATE = "2026-05-11"
- No invalid JSON in decrees/
- Clean git status, up to date with origin/main

---

## WHAT NOT TO TOUCH

- **releases.ts** — already at v37 with correct dates. Do not bump version or change dates.
- **dayType.ts** — already correct. Do not change EP_SPRINT_END.
- **killList.ts** — already patched. Do not change date references.
- **phaseMap.ts** — already rewritten. Do not alter timeline entries.
- **CLAUDE.md** — already updated May 6. Do not rewrite.
- **MASTER_DASHBOARD_2026.html** — already audited and patched. Do not modify.
- **brain/SOVEREIGN_ACTION_PLAN_FINAL.md** — already has date-shift amendment.
- **brain/2026_MASTER_RELEASE_CALENDAR.md** — already rewritten.
- **Oracle Compass deployed state** — a914d29 is live and correct. Do not redeploy unless git push includes new changes.

---

## SUMMARY

| # | Task | Priority | Status Before This Spec |
|---|------|----------|------------------------|
| 1 | Git push unblock | P0 | BLOCKED — Push Protection |
| 2 | Decree corruption fix | P0 | 9/9 files corrupted since Apr 21 |
| 3 | .claude/memory cleanup | P1 | Dir doesn't exist — likely skip |
| 4 | Blob token check | P2 | Not found — likely skip |
| 5 | Verification sweep | P2 | Pending |

Total estimated work: ~15 minutes for Sonnet. Sections 3–4 are likely no-ops.
