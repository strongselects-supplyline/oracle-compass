// ═══════════════════════════════════════════════════════════════
// lib/phaseMap.ts — Sovereign Scroll × Oracle Compass
// Full PHASE_MAP — source of truth for TodayPlan component
//
// APR 29 EP BOMB PIVOT:
//   Phase 1a: Recording Marathon (Apr 30 → May 6)
//   Phase 1b: EP Upload + Pre-Release (May 7 → May 14)
//   Phase 1c: EP Release Day + Post-Release (May 15 → May 29)
//   Phase 2: Vault Singles Waterfall (May 30 → Sep 26)
//     LID May 30, ILG Jun 13, WI Jun 27, JSS Jul 11, RCN Jul 25
//   Phase 3: Compound + CREAM Decision (Jul 10)
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
  "2026-04-20": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "MASTER + UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master 4 tracks · Upload to Amuse 8–10 PM", sub: "Ozone 12 · 24/44.1/-1 dBFS · Screenshot confirmation + ISRC page", warning: { type: "important", icon: "📋", text: "Open <strong>AMUSE_UPLOAD_CHECKLIST_APR20.md</strong>. Top to bottom. Screenshot every gate." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-09" },
  "2026-04-21": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "COMPLIANCE + CONTENT BATCH", badge: "Batch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "ASCAP/BMI register all 4 + SEE ME · Batch-film 7 posts", sub: "7 AM: Amuse rejection check · One filming session, edit all week", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-09" },
  "2026-04-22": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "EDITORIAL PITCHES", badge: "Pitch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Spotify for Artists pitches (backup) · Edit + schedule Posts 1–3", sub: "Draft WU2 + RV pitches · Denver-heavy geo context", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-09" },
  "2026-04-23": { arc: "1", phase: "Sprint — ESL Upload Night", weekName: "Wk 1 — ESL Single → EP", dayLabel: "ESL MASTER + AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Lock ESL master · Cover art · Amuse upload tonight", sub: "72-hr Amuse ingestion → pre-save live Apr 26 → ESL drops May 1", warning: { type: "important", icon: "📋", text: "<strong>ESL is the single.</strong> Ship clean > miss. Screenshot ISRC page. Verify Amuse preserves ESL ISRC when it becomes track 1 of EP May 8 (waterfall)." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-24": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 1 — ESL Single → EP", dayLabel: "EP TRACKS — RECORD/MIX", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Push SF / Green Light / WANT U 2 — record + mix toward Apr 30 upload", sub: "Masters must lock Apr 30 for May 8 EP release. 6 days, 3 tracks.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },

  // ═══ ARC 1 — WEEK 2: ESL LIVE + EP SPRINT ═══
  "2026-04-25": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 2", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Push toward Apr 30 lock", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-26": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 3", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Sunday — keep pushing", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-27": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "CHECK AMUSE + MASTER GL", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Check Amuse for ESL pre-save link · Master Green Light", sub: "ESL uploaded → 72hr ingestion → link should be live today. Copy link, replace [LINK] in all drafts. Then FL Studio: Green Light master.", warning: { type: "important", icon: "🔗", text: "<strong>Get the ESL Spotify link TODAY.</strong> Every DM and caption has a [LINK] placeholder. Cannot start May 1 blitz without it." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },

  // ═══ PRODUCTION SPRINT (Apr 28 – May 1) ═══
  "2026-04-28": { arc: "1", phase: "Production Sprint", weekName: "Wk 2 — Record + Mix", dayLabel: "RECORD ALL VOCALS", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "4-hour vocal batch: GL + SF + WU2 toplines + extras", sub: "Batch recording — all vocals across all 3 tracks in one session. Performer mode, not engineer mode.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-09" },

  // ═══ PHASE 1a: RECORDING MARATHON (Apr 29 – May 6) ═══
  "2026-04-29": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 1", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Record GL + SF vocals. Marathon begins.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-04-30": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 2", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Record WU2 vocals. ESL MSTR 2 already uploaded to Amuse — it's done.", sub: "Batch mode. ESL is DONE. 3 tracks left: GL, SF, WU2.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-01": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 3", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Overflow takes + rough comps.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-02": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MIX DAY 1", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix GL + SF. 9-stage protocol. ESL already mastered.", sub: "Batch mode. ESL done — GL + SF only today.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-03": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MIX DAY 2", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix WU2. Sunday — push through.", sub: "Batch mode. One track left.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-04": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MASTER DAY", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master GL + SF + WU2 (1 hr each). 3 tracks — ESL is DONE.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-05": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "QC + COVER ART", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Final QC listens (phone/car/speaker). Lock EP cover art — HARD DEADLINE.", sub: "No art = no EP upload May 7. This is non-negotiable.", warning: { type: "important", icon: "🎨", text: "<strong>COVER ART HARD DEADLINE.</strong> No art = no EP on May 7. Do not let anything push this." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-06": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "BUFFER", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Overflow mastering. Prep Amuse metadata. Back to LG tonight.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },

  // ═══ PHASE 1b: EP UPLOAD + PRE-RELEASE (May 7 – May 14) ═══
  "2026-05-07": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — EP Upload", dayLabel: "EP AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload all 5 tracks + EP entity to Amuse tonight. Genre: R&B / Alt-R&B. Set release May 15.", sub: "Screenshot ISRC page.", warning: { type: "important", icon: "📋", text: "<strong>ISRC CARRY:</strong> Enter SEE ME's ISRC from Mar 13 onto EP track 1. All other tracks get new ISRCs." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-08": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — ESL Live + EP Upload", dayLabel: "ESL DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "East Side Love advance single live. Release Radar trigger #1. Let it breathe — don't mention EP today.", sub: "ESL-only content day. Follow CTA on every post.", warning: { type: "important", icon: "🎵", text: "<strong>ESL IS LIVE.</strong> Let it breathe 48 hrs before announcing EP. Every post ends with Follow on Spotify CTA." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-09": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — ESL Live + EP Upload", dayLabel: "EP EDITORIAL PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: pitch Sweet Frustration as EP focus track. Genre outlier = editorial differentiation.", sub: "Saturday. KAYTRANADA lane — pitch that angle.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-10": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — ESL Live + EP Upload", dayLabel: "EP ANNOUNCE", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Tracklist reveal. Use ESL early reception as proof. 'If you liked ESL, the full project drops Thursday.'", sub: "Sunday. ESL 72-hr data check. Build DM list from ESL engagers.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-11": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — ESL Live + EP Upload", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. ESL 72-hr data review. DM list finalize. Check Amuse ingestion status.", sub: "Sunday.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-12": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — EP Upload", dayLabel: "CONTENT PUSH", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Post #2: World-building. 'The world of ALL LOVE.' Cinematic visual.", sub: "T-3.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-13": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — EP Upload", dayLabel: "WU2 SNIPPET", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Post #3: WU2 snippet/teaser. 'Only on the EP.'", sub: "Hook for EP-exclusive content.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-14": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — EP Upload", dayLabel: "EVE OF EP", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Post #4: Talk to 'Em: what ALL LOVE means. Final DM blitz list. Ads staged.", sub: "Tomorrow.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-15" },

  // ═══ PHASE 1c: EP RELEASE + POST-RELEASE (May 15 – May 29) ═══
  "2026-05-15": { arc: "1", phase: "EP Campaign — Release", weekName: "Wk 4 — EP Drops", dayLabel: "ALL LOVE EP DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "EP live everywhere. ICEMAN day. Release post 9 AM. DM Blitz 10 AM + 2 PM. Spotify Ads live.", sub: "The EP Bomb.", warning: { type: "important", icon: "🎉", text: "<strong>ALL LOVE EP is live.</strong> 5 tracks. ICEMAN momentum. Don't check stats after 8 PM." }, nn: ["DM Blitz", "No stats after 8PM"], dropLabel: "Days to EP", dropDate: "2026-05-15" },
  "2026-05-16": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "EP DAY 2", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Respond to DM engagement. Saturday.", sub: "Saturday.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-17": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "SUNDAY REVIEW", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. EP 48-hr data. S4A screenshots.", sub: "Sunday.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-18": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "EP DATA + COMPLIANCE", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Begin SEE ME overdue compliance.", sub: "Post release.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-19": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "CONTENT SUSTAIN", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "EP compound content. Meme account: seed 5 pure memes.", sub: "Post release.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-20": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "EP 5-DAY DATA + LID PROD", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Full data pull. Save rates per track. Record Like I Did.", sub: "Post release.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-21": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "CONTENT + SYNC + LID PROD", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "EP compound. Begin sync pitching. Mix/Master Like I Did.", sub: "Post release.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-22": { arc: "1", phase: "EP Campaign — Post-Release", weekName: "Wk 4 — EP Drops", dayLabel: "EP COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Thursday: ESL + GL + SF + WU2 registrations (ASCAP, MLC, Songtrust, Musixmatch, SoundExchange).", sub: "Post release.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-23": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "UPLOAD LIKE I DID", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload LID to Amuse. Set release May 30. 7-day ingestion.", sub: "Vault Single 1.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-24": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "LID CONTENT PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Write captions. Schedule pre-save push. Saturday.", sub: "Pre release.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-25": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. EP 10-day data. LID pre-save push.", sub: "Pre release.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-26": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "LID EDITORIAL PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: LID pitch. 4 days before release.", sub: "Pre release.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-27": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "LID CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post. Meme account: 2-3 LYRC edits with LID audio.", sub: "Pre release.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-28": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "LID CONTENT + DM", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Talk to 'Em: story behind LID. DM list refresh from EP responders.", sub: "Pre release.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },
  "2026-05-29": { arc: "2", phase: "LID Campaign — Pre-Release", weekName: "Wk 5 — LID Pre-Save", dayLabel: "EVE OF LID", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz list finalized. Ads staged.", sub: "Tomorrow.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-05-30" },

  // ═══ LIKE I DID LIFECYCLE ═══
  "2026-05-30": { arc: "2", phase: "Like I Did Drops", weekName: "Vault Single", dayLabel: "LIKE I DID DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Like I Did drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-05-31": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-01": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-02": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-03": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record I Like Girls", sub: "Day 4.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-04": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix I Like Girls", sub: "Day 5.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-05": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master I Like Girls", sub: "Day 6.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-06": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "SYNC", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. Upload I Like Girls", sub: "Day 7.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-07": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Overlap with next single pre-release.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-08": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Content schedule.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-09": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Editorial pitch for next single.", sub: "Day 10.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-10": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-11": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep.", sub: "Day 12.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },
  "2026-06-12": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Eve of release push.", sub: "Day 13.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-13" },

  // ═══ I LIKE GIRLS LIFECYCLE ═══
  "2026-06-13": { arc: "2", phase: "I Like Girls Drops", weekName: "Vault Single", dayLabel: "I LIKE GIRLS DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "I Like Girls drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-14": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-15": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-16": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-17": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Worth It", sub: "Day 4.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-18": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Worth It", sub: "Day 5.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-19": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Worth It", sub: "Day 6.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-20": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "SYNC", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. Upload Worth It", sub: "Day 7.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-21": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Overlap with next single pre-release.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-22": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Content schedule.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-23": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Editorial pitch for next single.", sub: "Day 10.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-24": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-25": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep.", sub: "Day 12.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },
  "2026-06-26": { arc: "2", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Eve of release push.", sub: "Day 13.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-06-27" },

  // ═══ WORTH IT LIFECYCLE ═══
  "2026-06-27": { arc: "3", phase: "Worth It Drops", weekName: "Vault Single", dayLabel: "WORTH IT DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Worth It drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-06-28": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-06-29": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-06-30": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-01": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Just Say So", sub: "Day 4.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-02": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Just Say So", sub: "Day 5.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-03": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Just Say So", sub: "Day 6.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-04": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "SYNC", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. Upload Just Say So", sub: "Day 7.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-05": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Overlap with next single pre-release.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-06": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Content schedule.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-07": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Editorial pitch for next single.", sub: "Day 10.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-08": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-09": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep.", sub: "Day 12.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },
  "2026-07-10": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Eve of release push.", sub: "Day 13.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-11" },

  // ═══ JUST SAY SO LIFECYCLE ═══
  "2026-07-11": { arc: "3", phase: "Just Say So Drops", weekName: "Vault Single", dayLabel: "JUST SAY SO DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Just Say So drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-12": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-13": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-14": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-15": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Reconnect", sub: "Day 4.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-16": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Reconnect", sub: "Day 5.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-17": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Reconnect", sub: "Day 6.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-18": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "SYNC", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. Upload Reconnect", sub: "Day 7.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-19": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Overlap with next single pre-release.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-20": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Content schedule.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-21": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Editorial pitch for next single.", sub: "Day 10.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-22": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-23": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep.", sub: "Day 12.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },
  "2026-07-24": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Eve of release push.", sub: "Day 13.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-07-25" },

  // ═══ RECONNECT LIFECYCLE ═══
  "2026-07-25": { arc: "3", phase: "Reconnect Drops", weekName: "Vault Single", dayLabel: "RECONNECT DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Reconnect drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-26": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-27": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-28": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-29": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). ", sub: "Day 4.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-30": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. ", sub: "Day 5.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-07-31": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. ", sub: "Day 6.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-01": { arc: "3", phase: "Reconnect Live", weekName: "Vault Single", dayLabel: "SYNC", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. ", sub: "Day 7.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-02": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Overlap with next single pre-release.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-03": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Content schedule.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-04": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Editorial pitch for next single.", sub: "Day 10.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-05": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-06": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep.", sub: "Day 12.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },
  "2026-08-07": { arc: "3", phase: "Next Single Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RELEASE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Eve of release push.", sub: "Day 13.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },

  // ═══ CREAM DECISION (Jul 10) ═══
  "2026-07-10": { arc: "3", phase: "Compound", weekName: "Wk 12 — Summer", dayLabel: "CREAM DECISION", badge: "Decision", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Ship CREAM Q3 or push to Q4? · Data-driven call", sub: "Waterfall data + save rates + live traction + bandwidth = signal.", warning: { type: "important", icon: "⚡", text: "<strong>No vibes on this one.</strong> Use the numbers. EP pop delta + save rate + live traction = signal." }, nn: ["Data pulled", "Decision documented", "Decision shared with partner"], dropLabel: "Days to 90-day review", dropDate: "2026-07-17" },
  "2026-07-17": { arc: "3", phase: "Identity Locked", weekName: "Wk 13 — 90-Day Review", dayLabel: "90-DAY REVIEW", badge: "Review", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Full review · next 90 planned", sub: "The waterfall held.", warning: { type: "tip", icon: "🏁", text: "<strong>Arc complete.</strong>" }, nn: ["Review doc complete"], dropLabel: "90-day review", dropDate: "2026-07-17" },
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
