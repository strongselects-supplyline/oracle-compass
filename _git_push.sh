#!/bin/bash
# oracle-compass git push unblock + UX audit commit
# Run from repo root: bash ~/.gemini/antigravity/scratch/oracle-compass/_git_push.sh

set -e
cd "$(dirname "$0")"

echo "==> Step 1: Remove tracked secret file from index"
git rm --cached "Ethan Payton Label OS/SONNET_VIDEO_ENGINE_FIXES.md" 2>/dev/null || echo "(already untracked — skipping)"

echo "==> Step 2: Stage all changes"
git add -A

echo "==> Step 3: Commit P0 — git push unblock"
git commit -m "fix(sec): untrack SONNET_VIDEO_ENGINE_FIXES.md — remove from git index

File was already in .gitignore but tracked in the index.
Running git rm --cached to purge it from history going forward.
GitHub Push Protection was blocking all pushes due to API keys in this file." 2>/dev/null || echo "(nothing to commit for P0)"

echo "==> Step 4: Commit UX audit changes"
git add -A
git diff --staged --quiet && echo "(no UX changes staged)" || git commit -m "fix: UX audit — P0/P1/P2 fixes across Today, Execute, Studio, Nav

P0:
- TodayPlan.tsx: remove duplicate Kill List RED block
- grind/page.tsx: fix sobriety date Mar 11 → Apr 2
- kill/page.tsx: remove duplicate DoorDash Quick-Add section

P1:
- studio/page.tsx: extend timeline window to Aug 1 (was May 1 — expired)
- kill/page.tsx: replace hardcoded SF/LID telemetry with dynamic EP track sort
- page.tsx: suppress content steps in Phase 1 protocol (isPhase1 gate)

P2:
- TodayPlan.tsx: replace redundant Arc stat with weekName/Week
- BottomNav.tsx: rename LOG→BODY, swap 📓→💪
- TrackCards.tsx: dynamic filter (ep/vault_single/loosie excluded)
- grind/page.tsx: theme token migration (hardcoded hex → semantic tokens)
- page.tsx: theme token migration
- kill/page.tsx: theme token migration"

echo "==> Step 5: Pull rebase then push"
git pull --rebase origin main
git push origin main

echo ""
echo "✓ Done. oracle-compass is live on origin/main."
