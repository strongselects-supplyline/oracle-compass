# ANTIGRAVITY EXECUTION BRIEF — MAY 2, 2026
## Sonnet-Executable Cleanup & Consolidation Sprint
### Owner: Antigravity (Gemini) | Model: Sonnet | Verified by: Claude (Opus)

---

## PRIME DIRECTIVE

**DO NOT BREAK ANY FUNCTIONALITY.** Every move below has been verified safe. No live config file, no running system, no `.claude/` setting references any of the targets being moved. If you encounter ANY ambiguity during execution, STOP and ask — do not guess.

**Execution model:** Run each section as a batch. Verify after each section before moving to the next. Use `ls` to confirm moves landed. Do not combine sections.

---

## SECTION 1: ARCHIVE — CLEAR KILLS

These repos have zero Label OS relevance and no live system depends on them. Move to `scratch/_archive/`.

```bash
cd /Users/ethanpayton/.gemini/antigravity/scratch

# Already exists: _archive/

# Torrent player v1 — superseded by michael-player (which is KEPT)
mv torrent-player _archive/

# One-shot Google Sheet setup script — already ran, sheet exists
mv createsheet _archive/

# GAS EP Command Center — superseded by Oracle Compass
mv gas_project_upgrade _archive/

# Vite EP Command Center — superseded by Oracle Compass
mv epcc _archive/

# Feb 2026 orchestration workspace — stale, sovereignty_engine never built
mv projects _archive/

# MCP workflow research docs — stale strategy output
mv workflow_context _archive/
```

**VERIFY after running:**
```bash
ls _archive/ | sort
# Expected additions: createsheet, epcc, gas_project_upgrade, projects, torrent-player, workflow_context
# Pre-existing: 2026-daily-ops, 2026-release-dashboard, catalog-tracker, core-drive-engine, ep-command-center
```

---

## SECTION 2: ARCHIVE — THCA VENTURE (GROUPED)

Ethan's decision: greenbook + midwest-wholesale archived together as a defunct venture. No longer viable moving into 2027.

```bash
cd /Users/ethanpayton/.gemini/antigravity/scratch

# Create a grouped archive for the THCA venture
mkdir -p _archive/thca-venture-2026

mv greenbook _archive/thca-venture-2026/
mv midwest-wholesale _archive/thca-venture-2026/
```

**VERIFY:**
```bash
ls _archive/thca-venture-2026/
# Expected: greenbook, midwest-wholesale
```

---

## SECTION 3: KEEP — DO NOT TOUCH

These are explicitly kept by Ethan. Confirm they exist and leave them alone.

| Repo | Reason |
|------|--------|
| `michael-player/` | Kept. Naruto player. Personal tool Ethan wants. |
| `notecard/` | Kept. Studio session PWA for recording marathon. |
| `canvas_anim/` | Kept. Working Spotify Canvas loop generator. |
| `2026_Album_Art_Finals/` | Kept. Active EP cover art assets. |
| `album_art_project/` | Kept. Stolen Stereo concept art. |
| `all-love-mission/` | Kept. Sprint brief template / time capsule. |
| `frequency-healing/` | Kept — but MOVED in Section 4. |
| `3772-alder-drive-report/` | Kept — but MOVED in Section 4. |

**VERIFY these still exist after Sections 1-2:**
```bash
ls -d michael-player notecard canvas_anim 2026_Album_Art_Finals album_art_project all-love-mission frequency-healing 3772-alder-drive-report
# All 8 should resolve. If any are missing, STOP.
```

---

## SECTION 4: RELOCATE — PERSONAL DOCS

These are important personal files that don't belong in scratch/ but shouldn't be archived either.

```bash
# Move to ~/Documents/ (permanent personal reference)
mkdir -p ~/Documents/personal-reference

# Alzheimer's frequency healing research — family/caregiver resource
cp -r /Users/ethanpayton/.gemini/antigravity/scratch/frequency-healing ~/Documents/personal-reference/frequency-healing
# Verify copy landed before removing original
ls ~/Documents/personal-reference/frequency-healing/index.html && \
  mv /Users/ethanpayton/.gemini/antigravity/scratch/frequency-healing _archive/frequency-healing-MOVED-TO-DOCS

# Home inspection report
cp -r /Users/ethanpayton/.gemini/antigravity/scratch/3772-alder-drive-report ~/Documents/personal-reference/3772-alder-drive-report
# Verify copy landed before removing original
ls ~/Documents/personal-reference/3772-alder-drive-report/ && \
  mv /Users/ethanpayton/.gemini/antigravity/scratch/3772-alder-drive-report _archive/3772-alder-drive-report-MOVED-TO-DOCS
```

**WHY cp then mv instead of just mv:** Safety net. The `_archive/` tombstone with `-MOVED-TO-DOCS` suffix tells future scans where the files went. If the copy fails, the original stays in scratch/ untouched.

**VERIFY:**
```bash
ls ~/Documents/personal-reference/
# Expected: frequency-healing, 3772-alder-drive-report

ls _archive/ | grep MOVED
# Expected: frequency-healing-MOVED-TO-DOCS, 3772-alder-drive-report-MOVED-TO-DOCS
```

---

## SECTION 5: CONSOLIDATE — CLAUDE SKILLS

**CRITICAL SAFETY CHECK:** Neither `scratch/skills/` nor `scratch/claude-skills/` is referenced by ANY config file. The live Claude Code config is at `.claude/` (agents/, commands/, memory/, settings.json). These scratch skill dirs are standalone definition files, NOT actively loaded by any system.

The `.claude/` directory is **OFF LIMITS**. Do not touch `.claude/agents/`, `.claude/commands/`, `.claude/memory/`, or `.claude/settings.json`. Those are live.

**Action:** Merge both skill dirs into one reference location, then archive the originals.

```bash
cd /Users/ethanpayton/.gemini/antigravity/scratch

# Create consolidated reference
mkdir -p label_os_automation/docs/claude-skill-definitions

# Copy skill definitions (not moving — preserving originals until verified)
cp -r skills/brand_design label_os_automation/docs/claude-skill-definitions/
cp -r skills/remotion_video_creator label_os_automation/docs/claude-skill-definitions/
cp -r skills/skills_creator label_os_automation/docs/claude-skill-definitions/
cp -r claude-skills/label-os/* label_os_automation/docs/claude-skill-definitions/
cp -r claude-skills/strong-selects label_os_automation/docs/claude-skill-definitions/
```

**VERIFY consolidation:**
```bash
ls label_os_automation/docs/claude-skill-definitions/
# Expected: brand_design, catalog-refresh, content-sprint, curator-pitch,
#           handoff-generator, release-checklist, remotion_video_creator,
#           skills_creator, strong-selects
# = 9 total dirs
```

**ONLY after verification passes:**
```bash
mv skills _archive/skills-CONSOLIDATED
mv claude-skills _archive/claude-skills-CONSOLIDATED
```

**FUNCTIONALITY CHECK after this section:**
```bash
# Verify .claude/ is untouched
ls /Users/ethanpayton/.gemini/antigravity/.claude/
# Expected: agents, commands, memory, settings.json — unchanged

cat /Users/ethanpayton/.gemini/antigravity/.claude/settings.json
# Expected: same permissions block, no references to scratch/skills
```

---

## SECTION 6: BRAIN CLEANUP — UUID DIRECTORIES

The brain/ directory has 40+ UUID-named directories that are old Gemini session artifacts. They bloat the directory and make it impossible to scan.

**IMPORTANT:** Some UUID dirs may contain the triage doc AG just wrote (231bfa02-...). Check before archiving.

```bash
cd /Users/ethanpayton/.gemini/antigravity/brain

# Create brain archive
mkdir -p _archive/uuid-sessions-pre-may2

# Move all UUID-pattern directories to archive
# Pattern: 8-4-4-4-12 hex chars
for dir in [0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]-*/; do
  if [ -d "$dir" ]; then
    echo "Archiving: $dir"
    mv "$dir" _archive/uuid-sessions-pre-may2/
  fi
done
```

**VERIFY:**
```bash
# Count UUID dirs remaining in brain/ (should be 0)
ls -d brain/[0-9a-f]*-[0-9a-f]*-[0-9a-f]*-[0-9a-f]*-[0-9a-f]*/ 2>/dev/null | wc -l
# Expected: 0

# Count moved to archive
ls _archive/uuid-sessions-pre-may2/ | wc -l
# Expected: ~40

# Verify AG's triage doc is still accessible
find _archive/uuid-sessions-pre-may2/ -name "UNLISTED_REPOS_TRIAGE*" -type f
# Should find the file — it moved to archive but is still readable
```

---

## SECTION 7: BRAIN CLEANUP — STALE PLAN FILES

These files in brain/ are superseded by `SOVEREIGN_ACTION_PLAN_FINAL.md`. They create confusion because a reader can't tell which plan is current.

```bash
cd /Users/ethanpayton/.gemini/antigravity/brain

mkdir -p _archive/superseded-plans

# Superseded planning docs (all predate or are replaced by SOVEREIGN_ACTION_PLAN_FINAL.md)
mv 60_day_plan_mar21.md _archive/superseded-plans/ 2>/dev/null
mv 90_DAY_PLAN_APR18.md _archive/superseded-plans/ 2>/dev/null
mv 90_day_sovereign_roadmap_apr6.md _archive/superseded-plans/ 2>/dev/null

# Superseded system audits (replaced by LABEL_OS_FULL_AUDIT_MAY2.md)
mv CLAUDE_SYSTEMS_AUDIT_APR6.md _archive/superseded-plans/ 2>/dev/null
mv CLAUDE_SYSTEMS_AUDIT_APR6_v2.md _archive/superseded-plans/ 2>/dev/null
mv COWORK_CAPABILITIES_AUDIT_APR12.md _archive/superseded-plans/ 2>/dev/null
mv AUDIT_APR11.md _archive/superseded-plans/ 2>/dev/null
mv FINAL_BUILD_AUDIT_DESTRUCTIVE.md _archive/superseded-plans/ 2>/dev/null
```

**DO NOT MOVE these — they are CURRENT:**
- `SOVEREIGN_ACTION_PLAN_FINAL.md` — active 90-day plan
- `LABEL_OS_FULL_AUDIT_MAY2.md` — today's audit (just written)
- `SONNET_EP_BOMB_SPEC.md` — active EP spec
- `SONNET_STAGGER_AMENDMENT.md` — active stagger amendment
- `catalog_intelligence_matrix.json` — single source of truth
- `JARVIS_ARCHITECTURE.md` — reference even if shelved
- `2026_MACRO_INDUSTRY_THESIS.md` — strategic reference
- `2026_MASTER_RELEASE_CALENDAR.md` — active calendar

**VERIFY:**
```bash
ls brain/SOVEREIGN_ACTION_PLAN_FINAL.md brain/catalog_intelligence_matrix.json brain/SONNET_EP_BOMB_SPEC.md brain/LABEL_OS_FULL_AUDIT_MAY2.md
# All 4 must still exist. If any are missing, STOP.
```

---

## SECTION 8: FINAL VERIFICATION CHECKLIST

Run this entire block after all sections complete. Every line must pass.

```bash
echo "=== FINAL VERIFICATION ==="

# 1. Kept repos exist
echo "--- KEPT REPOS ---"
for repo in michael-player notecard canvas_anim 2026_Album_Art_Finals album_art_project all-love-mission; do
  [ -d "/Users/ethanpayton/.gemini/antigravity/scratch/$repo" ] && echo "✓ $repo" || echo "✗ MISSING: $repo"
done

# 2. Active repos untouched
echo "--- ACTIVE REPOS (must be untouched) ---"
for repo in oracle-compass gorilla-geo core-drive-builder content-factory-v4 kill-list jarvis synesthesia-visualizer label_os_automation; do
  [ -d "/Users/ethanpayton/.gemini/antigravity/scratch/$repo" ] && echo "✓ $repo" || echo "✗ MISSING: $repo"
done

# 3. .claude/ untouched
echo "--- CLAUDE CONFIG ---"
for item in agents commands memory settings.json; do
  [ -e "/Users/ethanpayton/.gemini/antigravity/.claude/$item" ] && echo "✓ .claude/$item" || echo "✗ MISSING: .claude/$item"
done

# 4. Brain essentials intact
echo "--- BRAIN ESSENTIALS ---"
for file in SOVEREIGN_ACTION_PLAN_FINAL.md catalog_intelligence_matrix.json SONNET_EP_BOMB_SPEC.md SONNET_STAGGER_AMENDMENT.md LABEL_OS_FULL_AUDIT_MAY2.md 2026_MASTER_RELEASE_CALENDAR.md; do
  [ -f "/Users/ethanpayton/.gemini/antigravity/brain/$file" ] && echo "✓ $file" || echo "✗ MISSING: $file"
done

# 5. Personal docs relocated
echo "--- PERSONAL DOCS ---"
[ -d "$HOME/Documents/personal-reference/frequency-healing" ] && echo "✓ frequency-healing in ~/Documents" || echo "✗ frequency-healing NOT relocated"
[ -d "$HOME/Documents/personal-reference/3772-alder-drive-report" ] && echo "✓ alder-drive-report in ~/Documents" || echo "✗ alder-drive-report NOT relocated"

# 6. Skills consolidated
echo "--- SKILLS ---"
[ -d "/Users/ethanpayton/.gemini/antigravity/scratch/label_os_automation/docs/claude-skill-definitions" ] && echo "✓ consolidated skill defs exist" || echo "✗ consolidation FAILED"

# 7. Nothing referencing moved dirs in live configs
echo "--- CONFIG SAFETY ---"
grep -r "scratch/skills\|scratch/claude-skills\|scratch/torrent-player\|scratch/createsheet\|scratch/greenbook\|scratch/midwest-wholesale" /Users/ethanpayton/.gemini/antigravity/.claude/ /Users/ethanpayton/.gemini/antigravity/.mcp.json /Users/ethanpayton/.gemini/antigravity/mcp_config.json 2>/dev/null && echo "✗ DANGER: live config references archived paths" || echo "✓ no live config references archived paths"

echo "=== END VERIFICATION ==="
```

**IF ANY LINE SHOWS ✗:** Stop. Do not proceed. Report the failure to Ethan or Claude.

---

## WHAT IS NOT IN THIS BRIEF (AND WHY)

| Not Included | Reason |
|-------------|--------|
| Oracle Compass changes | Live production app. No changes during sprint. |
| .claude/ anything | Live Claude Code config. OFF LIMITS. |
| Gorilla Geo cron setup | Post-sprint task (May 8+). |
| MCP connector installs | Post-sprint task (May 8+). |
| Content Factory V4 kill | Decision made in audit but not urgent. Post-EP. |
| JARVIS kill | Same — post-EP decision. |
| brain/ handoff file cleanup | Lower priority. Do UUID dirs first, handoffs later. |
| Any new code | Recording marathon is May 2-7. No code. |

---

## EXECUTION SUMMARY

| Section | Action | Items |
|---------|--------|-------|
| 1 | Archive clear kills | 6 repos → `_archive/` |
| 2 | Archive THCA venture | 2 repos → `_archive/thca-venture-2026/` |
| 3 | Verify keeps | 8 repos confirmed untouched |
| 4 | Relocate personal docs | 2 dirs → `~/Documents/personal-reference/` |
| 5 | Consolidate skills | 2 dirs → 1 consolidated + archive originals |
| 6 | Brain UUID cleanup | ~40 dirs → `brain/_archive/uuid-sessions-pre-may2/` |
| 7 | Brain stale plans | 8 files → `brain/_archive/superseded-plans/` |
| 8 | Final verification | Full checklist — must all pass |

**Total moves: ~58 items. Total risk: LOW (all verified safe). Total new code: ZERO.**

---

*Brief authored by Claude (Opus). All paths verified against live filesystem May 2, 2026. Ready for Sonnet execution via Antigravity.*
