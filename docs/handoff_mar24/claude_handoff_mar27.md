# 🥷 GOD SHINOBI // CLAUDE HANDOFF (MARCH 27)

## 🚨 IMMEDIATE AUDIT: THE "GUTTED CALCULUS" FAILURE
The user has correctly identified that the technical "calculus" of Gorilla Geo V2.5 was degraded during the transition to the standalone dashboard. 

**Root Cause Found**: 
1. **Silent Fallback**: In `gorilla-geo/generate-dashboard-data.js`, the `enrichArtist` function silently defaults artists to `popularity: 0` if the Spotify API rate-limits or fails to match. This misclassified major "Permanent Anchors" (e.g., Don Toliver) into Tier 4.
2. **Schema Flattening**: The generator script forces EP tracks into a "flat" list, stripping away the tiered nuance (Core/Extended/Peripheral) originally computed by the `core-drive-engine`.
3. **UI Oversimplification**: The "God Shinobi" HUD prioritized visual aesthetics and recovery speed over the deep mathematical fidelity of the "Sonic Analyzer" logic found in `identity-sync.mjs`.

---

## 🛠️ SESSION ACTIONS (TODAY)

### 1. Emergency Recovery (COMPLETED)
- **Problem**: Root `/` was suppressed by a static `index.html` (Nuclear Sync error).
- **Fix**: Deleted `public/index.html` and reverted `vercel.json` redirects.
- **Status**: Oracle Compass (Brain, Label OS, etc.) is **fully restored** at the root domain.

### 2. Native UI Integration (COMPLETED)
- **Action**: Added a native "GEO" tab 🦧 to the `BottomNav.tsx` component.
- **Result**: Gorilla Geo is now officially part of the app navigation, linking to `/geo/` without risking root-level disruption.

### 3. Dashboard Refinement (PARTIAL SUCCESS / LOGIC FAILURE)
- **Action**: Restored the dashboard at `/geo/index.html` as a standalone, zero-failure HTML file.
- **Regressions**: Resolved "undefined" labels and zeroed summary metrics, but caused the aforementioned data-integrity degradation in artist tiering.

---

## 📥 INSTRUCTIONS FOR CLAUDE (NEXT PHASE)

### A. Data Restoration
- **Re-run the Generator**: Refactor `gorilla-geo/generate-dashboard-data.js` to:
    - Use a persistent, pre-validated cache for Priority/Anchor artists (Drake, Don Toliver, SZA).
    - Stop flattening EP tracks; preserve the `coreDrive` vs `extendedDrive` distinction.
    - Implement a higher-visibility error for rate-limited enrichment so we don't ship "0 popularity" data.

### B. Calculus Alignment
- **Sonic DNA**: Bridge the `laneIndicators` logic from `identity-sync.mjs` (Moody ◄─► Kinetic) back into the `/geo/` dashboard.
- **Tier Accuracy**: Ensure the "Strike Engine" sorts by `overlapCount` *multiplied* by `popularity`, giving weight to the true anchors the user trusts.

### C. Aesthetic Preservation
- Maintain the Zinc-950 / glassmorphism / pulsing HUD aesthetics while re-injecting the high-fidelity math.

**Final Status**: Root App safe. Navigation integrated. Dashboard data requires surgical restoration of the original "Core Drive" logic. ⛩️
