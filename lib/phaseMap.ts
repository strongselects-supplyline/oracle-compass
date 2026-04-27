// ═══════════════════════════════════════════════════════════════
// lib/phaseMap.ts — Sovereign Scroll × Oracle Compass
// Full 91-day PHASE_MAP ported verbatim from sovereign_scroll.html
// Source of truth for TodayPlan component
//
// APR 23 PIVOT (partial):
//   Phase 1 (arc "1") = Apr 23 → May 8   (lead single → EP release)
//   Phase 2 (arc "2") = May 9 → May 31   (Compound: EP campaign + CREAM pre-prod)
//   Phase 3 (arc "3") = Jun 15 → Jul 17  (CREAM launch prep)
// Arc boundary tags were shifted to match. Day-of-release entries (Apr 23, 24, May 1, May 8)
// were rewritten. Every other day-level `deliverable` / `sub` string below is PRE-PIVOT copy
// (Apr 24 EP drop, May 20 album drop, Jun 19 deluxe) and must be rewritten in a follow-up pass
// before TodayPlan is trusted for Apr 24 – May 8.
// ═══════════════════════════════════════════════════════════════

export interface PhaseDay {
  arc: string;
  phase: string;
  weekName: string;
  dayLabel: string;
  badge: string;
  badgeClass: string;
  cardClass: string;
  deliverable: string;
  sub: string;
  nn: string[];
  dropLabel?: string;
  dropDate?: string;
  warning?: {
    type: string;
    icon: string;
    text: string;
  };
}

// ═══ NON-NEGOTIABLE TEMPLATES ═══
const ARC1_NN = [
  "DoorDash 6:30–9 AM ($60 target)",
  "Calisthenics + mudras (30 min)",
  "Tomorrow's first task on paper before bed",
];
const FLATLINE_NN = [
  "Calisthenics — even if pointless",
  "Meditation / mudras — keep the slot",
  "One content piece max (ceiling, not floor)",
];
const ARC2_NN = [
  "DoorDash block",
  "Calisthenics + meditation",
  "One primary creative deliverable",
];
const ARC3_NN = [
  "DoorDash + calisthenics",
  "One creative + one business deliverable",
  "Phone away after 10 PM",
];

export const PHASE_MAP: Record<string, PhaseDay> = {
  // ═══ ARC 1 — WEEK 1: SHIP THE EP ═══
  "2026-04-18": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "COMP DAY", badge: "Comp", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Comp all 4 tracks · ESL → SF → WU2 → RV", sub: "9:30 AM – 6 PM · 2 hrs/track + 30 min tuning buffer · Reference SEE ME", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-04-24" },
  "2026-04-19": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "MIX DAY", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix all 4 tracks · 9-stage Sovereign Protocol", sub: "10 AM – 1 AM · 3 hrs/track · QC pass + phone/car listen", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-04-24" },
  "2026-04-20": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "MASTER + UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master 4 tracks · Upload to Amuse 8–10 PM", sub: "Ozone 12 · 24/44.1/-1 dBFS · Screenshot confirmation + ISRC page", warning: { type: "important", icon: "📋", text: "Open <strong>AMUSE_UPLOAD_CHECKLIST_APR20.md</strong>. Top to bottom. Screenshot every gate." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-04-24" },
  "2026-04-21": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "COMPLIANCE + CONTENT BATCH", badge: "Batch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "ASCAP/BMI register all 4 + SEE ME · Batch-film 7 posts", sub: "7 AM: Amuse rejection check · One filming session, edit all week", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-04-24" },
  "2026-04-22": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "EDITORIAL PITCHES", badge: "Pitch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Spotify for Artists pitches (backup) · Edit + schedule Posts 1–3", sub: "Draft WU2 + RV pitches · Denver-heavy geo context", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-04-24" },
  "2026-04-23": { arc: "1", phase: "Sprint — ESL Upload Night", weekName: "Wk 1 — ESL Single → EP", dayLabel: "ESL MASTER + AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Lock ESL master · Cover art · Amuse upload tonight", sub: "72-hr Amuse ingestion → pre-save live Apr 26 → ESL drops May 1", warning: { type: "important", icon: "📋", text: "<strong>ESL is the single.</strong> Ship clean > miss. Screenshot ISRC page. Verify Amuse preserves ESL ISRC when it becomes track 1 of EP May 8 (waterfall)." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-24": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 1 — ESL Single → EP", dayLabel: "EP TRACKS — RECORD/MIX", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Push SF / Green Light / WANT U 2 — record + mix toward Apr 30 upload", sub: "Masters must lock Apr 30 for May 8 EP release. 6 days, 3 tracks.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },

  // ═══ ARC 1 — WEEK 2: ESL LIVE + EP SPRINT ═══
  "2026-04-25": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 2", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Push toward Apr 30 lock", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-26": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 3", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Sunday — keep pushing", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-27": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "CHECK AMUSE + MASTER GL", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Check Amuse for ESL pre-save link · Master Green Light", sub: "ESL uploaded Apr 24 → 72hr ingestion → link should be live today. Copy link, replace [LINK] in all drafts. Then FL Studio: Green Light master.", warning: { type: "important", icon: "🔗", text: "<strong>Get the ESL Spotify link TODAY.</strong> Every DM and caption has a [LINK] placeholder. Cannot start May 1 blitz without it." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-28": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "MASTER SF + WU2", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master Sweet Frustration + Want U 2 · Export all stems", sub: "Two tracks today. 4 hrs each max. Bounce → QC → stems. Do NOT close FL Studio before exporting stems.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-29": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "LOCK ALL MASTERS", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Final QC pass on all 3 masters · Lock stems · Prep EP artwork", sub: "Tomorrow is Amuse upload day. Every master must be locked. Cover art must be ready.", warning: { type: "important", icon: "⚠️", text: "<strong>Tomorrow is upload day.</strong> If a track isn't passing QC, ship as 4-track EP. Better to ship clean than miss the window." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-30": { arc: "1", phase: "Sprint — EP Upload", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload 5-track ALL LOVE EP to Amuse by 10 PM", sub: "Enter ESL ISRC from Apr 24 single on Track 1 slot (waterfall). Screenshot every gate.", warning: { type: "important", icon: "📋", text: "<strong>ISRC WATERFALL:</strong> Manually enter ESL's ISRC from the single upload on the EP's Track 1 slot. This preserves streaming continuity." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-05-01": { arc: "1", phase: "Sprint — ESL Release Day", weekName: "Wk 2 — Lead Single Live", dayLabel: "EAST SIDE LOVE DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "ESL live everywhere · Post #1 9:15 AM · DM Blitz 10 AM + 2 PM · Post #2 12 PM", sub: "50 DMs total. Wheels down 8 PM. Open MAY1_LAUNCH_CHECKLIST.md and follow it line by line.", warning: { type: "important", icon: "🎉", text: "<strong>Execute the checklist.</strong> Don't improvise. DoorDash 6:30 AM → Post 9:15 → DMs 10 AM → Post 12 PM → DMs 2 PM → Story 5 PM → DONE 8 PM." }, nn: ["DoorDash 6:30–9 AM", "50 DMs sent (10 AM + 2 PM)", "Do NOT check stats after 8 PM"], dropLabel: "Days to EP", dropDate: "2026-05-08" },

  // ═══ ARC 1 — WEEK 3: BRIDGE CONTENT + EP PREP ═══
  "2026-05-02": { arc: "1", phase: "Bridge — Talk to Em", weekName: "Wk 3 — EP Week", dayLabel: "BRIDGE DAY 1", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Talk to 'Em: Face-to-camera story behind ESL", sub: "Caption in may1_to_may8.md → May 2 section. End with ALL LOVE EP — May 8.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-03": { arc: "1", phase: "Bridge — Cinematic", weekName: "Wk 3 — EP Week", dayLabel: "BRIDGE DAY 2", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Cinematic Visual: Canvas loop or Hyperframes render", sub: "Caption in may1_to_may8.md → May 3 section. Visualizer or aesthetic B-roll.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-04": { arc: "1", phase: "Bridge — World-Building", weekName: "Wk 3 — EP Week", dayLabel: "BRIDGE DAY 3", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-Building: Milwaukee east side imagery / B-roll", sub: "Caption in may1_to_may8.md → May 4 section.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-05": { arc: "1", phase: "Bridge — Community + Compliance", weekName: "Wk 3 — EP Week", dayLabel: "COMPLIANCE MONDAY", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Community Trace post + ASCAP/MLC/Songtrust/Musixmatch/SoundExchange for ESL", sub: "Morning: post fan reaction reposts. Afternoon: compliance registrations (see Kill List).", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-06": { arc: "1", phase: "Bridge — EP Teaser", weekName: "Wk 3 — EP Week", dayLabel: "EP TEASER DAY", badge: "Teaser", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "EP Teaser: '5 tracks. May 8.' Tracklist reveal.", sub: "Caption in may1_to_may8.md → May 6 section. This is the hype pivot to the full EP.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-07": { arc: "1", phase: "Bridge — Final Talk to Em", weekName: "Wk 3 — EP Week", dayLabel: "EVE OF EP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Talk to 'Em: What ALL LOVE means to you", sub: "Caption in may1_to_may8.md → May 7 section. Last post before the full drop.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-08" },
  "2026-05-08": { arc: "1", phase: "EP Release Day", weekName: "Wk 3 — EP Week", dayLabel: "ALL LOVE EP DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "ALL LOVE EP live everywhere · Repeat May 1 playbook · Second DM blitz", sub: "Use may1_to_may8.md → May 8 section. Build DM list from May 1 response data — who engaged?", warning: { type: "important", icon: "🎉", text: "<strong>The EP is live.</strong> Release Radar hit #2. Second DM blitz. Check if ESL save rate qualifies for Discovery Mode opt-in." }, nn: ["DoorDash AM block", "Second DM blitz (build from May 1 responders)", "Check Discovery Mode eligibility"], dropLabel: "Discovery Mode", dropDate: "2026-05-31" },

// ═══ ARC 1 — WEEK 4: FLATLINE ENDS + DELUXE MIX ═══
  "2026-05-09": { arc: "2", phase: "Flatline Day 1 / Compound Begins", weekName: "Wk 4 — Compound", dayLabel: "FIRST POST-FLATLINE SESSION", badge: "Diagnostic", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "First mix/record session since Flatline began · Treat as diagnostic", sub: "How much better does your instinct feel?", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-10": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "MIX DELUXE TRACKS", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix album-only tracks · 9-stage protocol · 3 hrs/track", sub: "Sunday — grief journal still active", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-11": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "MIX DELUXE TRACKS", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Continue mixing album-only tracks", sub: "9-stage protocol · reference SEE ME tonally", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-12": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "MIX DELUXE TRACKS", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Finish all album mixes", sub: "QC pass by end of day", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-13": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "MASTER ALBUM", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master all new album tracks · Ozone 12", sub: "1 hr/track + 2 hr QC", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-14": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "FULL ALBUM QC", badge: "QC", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Full album QC start-to-finish · Sequence · Crossfades", sub: "Listen to the whole thing as an album, not tracks", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-15": { arc: "2", phase: "Compound", weekName: "Wk 4 — Compound", dayLabel: "ARTWORK + METADATA LOCK", badge: "Lock", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Album artwork (3000×3000, no logos) · Metadata finalized", sub: "Content shift: EP-teaser → album-teaser", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },

  // ═══ ARC 2 — WEEK 5: DELUXE PREP ═══
  "2026-05-16": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Album Upload", dayLabel: "DELUXE PREP DAY 1", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Build 11-track album on Amuse · Reuse 5 EP ISRCs via catalog-pick", sub: "6 new ISRCs for new tracks · Same export gates as EP", warning: { type: "important", icon: "📋", text: "Open Amuse checklist again. Same gates. <strong>ISRC preservation is the whole game.</strong>" }, nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-17": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Album Upload", dayLabel: "DELUXE PREP", badge: "Submit", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Submit album to Amuse · Release date May 20", sub: "Sunday night latest · Screenshot confirmation + all ISRCs", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-18": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Album Upload", dayLabel: "PRE-RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Content campaign locked and queued · Ad creative uploaded", sub: "Marquee + Spotify Ads + Meta — all staged", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-05-20" },
  "2026-05-19": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Deluxe Prep", dayLabel: "DELUXE PREP", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Spotify Ads $250 across 10 cities · Marquee $100-150 · Meta $50-100", sub: "Denver, MPLS, DAL, CHI, Calgary, Toronto, Charlotte, PHX, NYC, LA", warning: { type: "important", icon: "🎉", text: "Taurus season ends. Full campaign live. <strong>Ask Amuse to remove EP once album confirms on all DSPs.</strong>" }, nn: ["Marquee live by 9 AM", "All 3 ad platforms running", "Do NOT scroll stats after 8 PM"], dropLabel: "Album LIVE", dropDate: "2026-05-20" },
  "2026-05-20": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Deluxe Prep", dayLabel: "DELUXE PREP DAY", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Spotify Ads running · Content every 3 hours · 50 DMs", sub: "Push for pop score 30+ — unlocks Discover Weekly (~9K stream/28d bump)", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-21": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Deluxe Prep", dayLabel: "72-HR DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Top 2 album tracks by save rate · Content funnel locks", sub: "Pop score check — target 30", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-22": { arc: "2", phase: "Emotions Return", weekName: "Wk 5 — Deluxe Prep", dayLabel: "PLAYLIST CHECK", badge: "Check", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Editorial adds? · Screenshot wins · Amplify in content", sub: "Week 2 check-ins begin", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },

  // ═══ ARC 2 — WEEK 6: ALBUM WEEK 2 ═══
  "2026-05-23": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "SUSTAIN", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Daily posting · External CTA only (\"Save\", not \"stream\")", sub: "Momentum maintenance · no new production", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-24": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "SUNDAY REVIEW", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Oracle grief journal · Week ahead key task on paper", sub: "Protocol check-in", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-25": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "SYNC PITCHING BEGINS", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Start sync pitching · Clean rights + instrumentals + stems", sub: "Year-long play · prep now for full 22-track catalog later", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-26": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "DELUXE TRACK PREP", badge: "Plan", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Prep deluxe track list (11 additional) · Back-catalog + new", sub: "What's already recorded vs. needs production?", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-27": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "WEEK CHECK-IN", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Album week 2 data · Sustain or adjust?", sub: "Daily non-negotiables continue", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-28": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "SYNC OUTREACH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Sync agencies contacted · 5-track playlist sent", sub: "Position as Alt-R&B · Danceable/Low Energy", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-29": { arc: "2", phase: "Post-Flatline", weekName: "Wk 6 — Deluxe Prep +1", dayLabel: "CONTENT + RECOVERY", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "One content piece · One recovery day element", sub: "Protect the rhythm before Week 7 sprint", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },

  // ═══ ARC 2 — WEEK 7: DELUXE PREP ═══
  "2026-05-30": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "DELUXE PRODUCTION", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Record/produce any missing deluxe tracks", sub: "Use full instinct — this is your best-feeling week", nn: ARC2_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-05-31": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "D2C STORE LIVE", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Shopify or BigCartel store live · Print-on-demand merch live", sub: "First revenue infrastructure", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-01": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "EMAIL LIST + LIVE BOOKING", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Email list: first 100+ from Auto-Save · Live booking begins", sub: "Denver (372) · Minneapolis (323) · Dallas (241)", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-02": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "DELUXE PRODUCTION", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Continue deluxe track production", sub: "11 tracks needed — track your progress", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-03": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "DELUXE PRODUCTION", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Deluxe tracks toward completion", sub: "Merch designs finalized · First live venue contact", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-04": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "LIVE BOOKING", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Denver venue outreach · 3 venues minimum", sub: "Position around deluxe release week", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-05": { arc: "2", phase: "Emotions Full", weekName: "Wk 7 — Deluxe Prep", dayLabel: "WEEK REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Protocol check · Deluxe track progress · Sync traction check", sub: "Numbers, not feelings", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },

  // ═══ ARC 2 — WEEK 8: DELUXE MIX ═══
  "2026-06-06": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "MIX DELUXE", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix deluxe-only tracks · 9-stage protocol", sub: "3 hrs/track · reference album mixes", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-07": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "MIX DELUXE", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Continue deluxe mixing", sub: "Sunday — grief journal continues", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-08": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "MIX DELUXE", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Finish all deluxe mixes", sub: "QC pass by end of day", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-09": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "MASTER DELUXE", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master all deluxe-only tracks", sub: "Ozone 12 · 1 hr/track + QC", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-10": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "FULL DELUXE QC", badge: "QC", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "22-track deluxe QC start-to-finish · Sequence · Crossfades", sub: "The full catalog · listen like a fan", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-11": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "DELUXE ARTWORK", badge: "Lock", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Deluxe artwork final · Metadata finalized", sub: "Evolve album cover — same universe, deeper", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-12": { arc: "2", phase: "Compounding", weekName: "Wk 8 — Deluxe Mix", dayLabel: "DELUXE PRE-UPLOAD PREP", badge: "Prep", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "All assets staged for upload · Split sheets · Explicit flags", sub: "Content campaign queued", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },

  // ═══ ARC 3 — WEEK 9: DELUXE UPLOAD ═══
  "2026-06-13": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE UPLOAD DAY 1", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload 22-track deluxe · Reuse all 11 album ISRCs", sub: "11 new ISRCs for deluxe-only · Release date ~Jun 19", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-14": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE SUBMIT", badge: "Submit", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Submit deluxe to Amuse · Editorial re-pitch", sub: "6 weeks after album — the SZA play", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-15": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE CONTENT CAMPAIGN", badge: "Launch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Content campaign for deluxe begins · 4 days of runway", sub: "Announce deluxe · tease the new tracks", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-16": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE CONTENT + ADS PREP", badge: "Prep", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Spotify Ads staged · Marquee staged · Meta staged", sub: "Run deluxe day as album day v2", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-17": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE PRE-RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Pre-save links live · Final metadata QC", sub: "2 days out", nn: ARC3_NN, dropLabel: "Days to Deluxe", dropDate: "2026-06-19" },
  "2026-06-18": { arc: "3", phase: "Compounding", weekName: "Wk 9 — Deluxe Upload", dayLabel: "DELUXE EVE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Tomorrow's launch plan on paper · 50 DMs queued", sub: "Final confirmation call with all DSPs", nn: ARC3_NN, dropLabel: "Deluxe tomorrow", dropDate: "2026-06-19" },
  "2026-06-19": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "DELUXE DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "22 tracks live · Full ad campaign · Physical 2-disc CD drops", sub: "Full catalog active · sync agency pitching goes live", warning: { type: "important", icon: "🎉", text: "<strong>The SZA play lands.</strong> 6 weeks after album. Full catalog (22 tracks) working for you. This is the compounding moment." }, nn: ["All 3 ad platforms running", "50 DMs + release post", "Physical CD listing live"], dropLabel: "Deluxe LIVE", dropDate: "2026-06-19" },

  // ═══ ARC 3 — WEEK 10: DELUXE LIVE ═══
  "2026-06-20": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "DELUXE DAY 2", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Content every 3 hours · Ads running · Data pull", sub: "Sunday grief journal · Week 10 of protocol", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-21": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "72-HR DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Top 2 deluxe tracks · Content funnel locks", sub: "Merch sales check · D2C momentum", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-22": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "SYNC AGENCY PITCHING", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Full 22-track catalog to sync agencies", sub: "Clean rights · instrumentals · stems · pitch deck", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-23": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "LIVE BOOKING FOLLOW-UP", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Confirm Denver / MPLS / Dallas venues", sub: "Summer dates · 1 city locked minimum", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-24": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "MERCH PUSH", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "D2C merch promo · Content around physical CD", sub: "Exclusive is the hook", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-25": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "CONTENT + REST", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Content sustain · rest day", sub: "Protect the rhythm", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-06-26": { arc: "3", phase: "Compounding", weekName: "Wk 10 — Deluxe Live", dayLabel: "WEEK 10 REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Deluxe week 1 data · Pop score · Follower delta", sub: "Numbers drive Week 11 decisions", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },

  // ═══ ARC 3 — WEEK 11–12: SUMMER PUSH ═══
  "2026-06-27": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "SUMMER ARC BEGINS", badge: "Summer", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Summer content arc · travel · sessions · visuals", sub: "Behind-the-scenes becomes a pillar", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-06-28": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "SUNDAY REVIEW", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal · Week 11 protocol check", sub: "Compounding phase full", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-06-29": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "LIVE DATE PREP", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "First live date prep · setlist · promo", sub: "Rehearse with monitors · not studio", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-06-30": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "MONTH END REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "June numbers · revenue (DoorDash + merch + streaming)", sub: "Spotify + Amuse + Shopify reports", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-01": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "JULY BEGINS", badge: "Month", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Q3 strategy · CREAM pre-production decision ramp", sub: "Begin July content arc", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-02": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "CONTENT SURGE", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Summer visual content · travel photography session", sub: "New visual language for Q3", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-03": { arc: "3", phase: "Compounding", weekName: "Wk 11 — Summer", dayLabel: "LIVE REHEARSAL", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "First full setlist rehearsal · arrangement for live band", sub: "Adapt production for stage", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-04": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "INDEPENDENCE DAY", badge: "Rest", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Rest + family · one post only · partner time", sub: "Recovery is production", nn: ["Rest", "Partner time", "No scroll"], dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-05": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "SUNDAY REVIEW", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal · Week 12 check", sub: "2 weeks to 90-day review", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-06": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "CREAM DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Pull deluxe 3-week data · save rate · momentum curve", sub: "Inputs for CREAM decision", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-07": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "LIVE BOOKING CONFIRMED", badge: "Business", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "First summer live date confirmed · promo in motion", sub: "Announce within 24 hrs of venue confirmation", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-08": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "CONTENT SUSTAIN", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Daily content · summer visual arc", sub: "Deluxe still compounding", nn: ARC3_NN, dropLabel: "Days to CREAM decision", dropDate: "2026-07-10" },
  "2026-07-09": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "CREAM EVE", badge: "Decision", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "All CREAM inputs aggregated · go/no-go framework ready", sub: "Tomorrow is the call", nn: ARC3_NN, dropLabel: "CREAM call tomorrow", dropDate: "2026-07-10" },
  "2026-07-10": { arc: "3", phase: "Compounding", weekName: "Wk 12 — Summer", dayLabel: "CREAM DECISION", badge: "Decision", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Ship CREAM Q3 or push to Q4? · Data-driven call", sub: "Momentum data + bandwidth + emotional state", warning: { type: "important", icon: "⚡", text: "<strong>No vibes on this one.</strong> Use the numbers. Deluxe pop delta + save rate + live traction = signal." }, nn: ["Data pulled", "Decision documented", "Decision shared with partner"], dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },

  // ═══ ARC 3 — WEEK 13: IDENTITY LOCK-IN ═══
  "2026-07-11": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "POST-CREAM PIVOT", badge: "Execute", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Execute whichever CREAM call was made yesterday", sub: "Q3 plan solidifies", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-12": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "SUNDAY + REVIEW PREP", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal · begin 90-day review data aggregation", sub: "Followers · monthly · pop · revenue · email · merch", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-13": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "NORTH STAR CHECK", badge: "Check", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compare 90-day numbers vs. SOVEREIGN_ACTION_PLAN_FINAL targets", sub: "Hit · miss · surprise", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-14": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "SYNC / LIVE / MERCH REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Three infra tracks audited · What's real? What stalled?", sub: "Decide Q3 priorities from the honest state", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-15": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "SOVEREIGNTY PROTOCOL AUDIT", badge: "Audit", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "90-day protocol audit: porn, release, cannabis, sleep, food", sub: "Honest · structural", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-16": { arc: "3", phase: "Compounding", weekName: "Wk 13 — Identity Lock", dayLabel: "REVIEW DOC DRAFT", badge: "Draft", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Draft 90-day review doc · all data + all protocol in one place", sub: "Foundation for next 90 days", nn: ARC3_NN, dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-17": { arc: "3", phase: "Identity Locked", weekName: "Wk 13 — 90-Day Review", dayLabel: "90-DAY REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Full review · identity shift documented · next 90 planned", sub: "The protocol held · the engine is real · the system is yours", warning: { type: "tip", icon: "🏁", text: "<strong>Arc complete.</strong> If the protocol held, the identity shift from \"musician\" to \"full creative director\" locks in today. Document the state before designing the next 90." }, nn: ["Review doc complete", "Next 90 sketched", "Celebration — dinner with partner"], dropLabel: "90-day review", dropDate: "2026-07-17" },
};

export const VOCAL_PRINCIPLES: string[] = [
  '<strong>"You can\'t edit emotion."</strong> If the take has the story, take it even if pitch isn\'t perfect. Over-tuning strips the natural inflections that make a vocal human.',
  '<strong>Environment before artist.</strong> Lighting, temp, headphone mix, line checks — all done before entering. Zero technical friction.',
  '<strong>Don\'t record first.</strong> Full run to assess before a single take. The first run shows range, sticky spots, preparedness.',
  '<strong>Start at the verse, not the chorus.</strong> Voice settles. Chorus on take 15 will be better.',
  '<strong>Click as reference, not ruler.</strong> Human feel is the point. Don\'t grid-lock.',
  '<strong>Writing session vocals are often the best takes.</strong> Caught in the moment — genuine, no self-consciousness. If you catch something real, that IS the vocal.',
  '<strong>For emotion: visceral memory.</strong> "What did it smell like? What did the room look like?" Unlocks genuine delivery.',
  '<strong>Don\'t take too much away.</strong> Whether tuning, comping, or layering — if it sounds better natural, leave it. The artist\'s voice IS the art. Everything else serves that.',
];

// ═══ HELPER FUNCTIONS ═══

/** Get today's ISO date string in local time */
export function todayIsoDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Get today's phase data from the PHASE_MAP, or null if outside the 91-day window */
export function getTodayPlan(): PhaseDay | null {
  return PHASE_MAP[todayIsoDate()] ?? null;
}

/** Calculate sovereignty days since April 17, 2026 */
export function getSovereigntyDays(): number {
  const sovStart = new Date("2026-04-17T00:00:00");
  const now = new Date();
  return Math.max(1, Math.floor((now.getTime() - sovStart.getTime()) / (1000 * 60 * 60 * 24)));
}

/** Calculate days to a target date */
export function daysTo(targetDate: string): number {
  const target = new Date(targetDate + "T00:00:00");
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
