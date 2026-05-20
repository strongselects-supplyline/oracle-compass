// ═══════════════════════════════════════════════════════════════
// lib/phaseMap.ts — Sovereign Scroll × Oracle Compass
// Full PHASE_MAP — source of truth for TodayPlan component
//
// MAY 29 EP + VAULT WATERFALL:
//   Phase 1: EP Sprint (Apr 6 → May 29) — recording, upload May 22 (Thu), EP drops May 29
//   Phase 2: Vault Waterfall (May 30 → Aug 7)
//     ILG Jun 12, LID Jun 26, WI Jul 10, JSS Jul 24, RCN Aug 7
//   Phase 3: CREAM (Aug 8+) — tracklist locked Jul 24, pre-production August
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
  "2026-04-20": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "MASTER + UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master 4 tracks · Upload to Amuse 8–10 PM", sub: "Ozone 12 · 24/44.1/-1 dBFS · Screenshot confirmation + ISRC page", warning: { type: "important", icon: "📋", text: "Open <strong>AMUSE_UPLOAD_CHECKLIST_APR20.md</strong>. Top to bottom. Screenshot every gate." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-08" },
  "2026-04-21": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "COMPLIANCE + CONTENT BATCH", badge: "Batch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "ASCAP/BMI register all 4 + SEE ME · Batch-film 7 posts", sub: "7 AM: Amuse rejection check · One filming session, edit all week", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-08" },
  "2026-04-22": { arc: "1", phase: "Honeymoon", weekName: "Wk 1 — Ship the EP", dayLabel: "EDITORIAL PITCHES", badge: "Pitch", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Spotify for Artists pitches (backup) · Edit + schedule Posts 1–3", sub: "Draft WU2 + RV pitches · Denver-heavy geo context", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-08" },
  "2026-04-23": { arc: "1", phase: "Sprint — ESL Upload Night", weekName: "Wk 1 — ESL Single → EP", dayLabel: "ESL MASTER + AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Lock ESL master · Cover art · Amuse upload tonight", sub: "72-hr Amuse ingestion → pre-save live Apr 26 → ESL drops May 1", warning: { type: "important", icon: "📋", text: "<strong>ESL is the single.</strong> Ship clean > miss. Screenshot ISRC page. Verify Amuse preserves ESL ISRC when it becomes track 1 of EP May 8 (waterfall)." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-24": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 1 — ESL Single → EP", dayLabel: "EP TRACKS — RECORD/MIX", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Push SF / Green Light / WANT U 2 — record + mix toward Apr 30 upload", sub: "Masters must lock Apr 30 for May 8 EP release. 6 days, 3 tracks.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },

  // ═══ ARC 1 — WEEK 2: ESL LIVE + EP SPRINT ═══
  "2026-04-25": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 2", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Push toward Apr 30 lock", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-26": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "EP SPRINT DAY 3", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Produce/Mix SF + Green Light + WU2", sub: "Sunday — keep pushing", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },
  "2026-04-27": { arc: "1", phase: "Sprint — EP Production", weekName: "Wk 2 — ESL Live + EP Sprint", dayLabel: "CHECK AMUSE + MASTER GL", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Check Amuse for ESL pre-save link · Master Green Light", sub: "ESL uploaded → 72hr ingestion → link should be live today. Copy link, replace [LINK] in all drafts. Then FL Studio: Green Light master.", warning: { type: "important", icon: "🔗", text: "<strong>Get the ESL Spotify link TODAY.</strong> Every DM and caption has a [LINK] placeholder. Cannot start May 1 blitz without it." }, nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-01" },

  // ═══ PRODUCTION SPRINT (Apr 28 – May 1) ═══
  "2026-04-28": { arc: "1", phase: "Production Sprint", weekName: "Wk 2 — Record + Mix", dayLabel: "RECORD ALL VOCALS", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "4-hour vocal batch: GL + SF + WU2 toplines + extras", sub: "Batch recording — all vocals across all 3 tracks in one session. Performer mode, not engineer mode.", nn: ARC1_NN, dropLabel: "Days to ESL", dropDate: "2026-05-08" },

  // ═══ PHASE 1a: RECORDING MARATHON (Apr 29 – May 6) ═══
  "2026-04-29": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 1", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Record GL + SF vocals. Marathon begins.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-04-30": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 2", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Record WU2 vocals. ESL MSTR 2 already uploaded to Amuse — it's done.", sub: "Batch mode. ESL is DONE. 3 tracks left: GL, SF, WU2.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-01": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "RECORD DAY 3", badge: "Record", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Overflow takes + rough comps.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-02": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MIX DAY 1", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix GL + SF. 9-stage protocol. ESL already mastered.", sub: "Batch mode. ESL done — GL + SF only today.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-03": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MIX DAY 2", badge: "Mix", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Mix WU2. Sunday — push through.", sub: "Batch mode. One track left.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-04": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "MASTER DAY", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Master GL + SF + WU2 (1 hr each). 3 tracks — ESL is DONE.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-05": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "QC + COVER ART", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Final QC listens (phone/car/speaker). Lock EP cover art — HARD DEADLINE.", sub: "No art = no EP upload May 7. This is non-negotiable.", warning: { type: "important", icon: "🎨", text: "<strong>COVER ART HARD DEADLINE.</strong> No art = no EP on May 7. Do not let anything push this." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-06": { arc: "1", phase: "Recording Marathon", weekName: "Wk 2 — Record + Mix + Master", dayLabel: "BUFFER", badge: "Master", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Overflow mastering. Prep Amuse metadata. Back to LG tonight.", sub: "Batch mode.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },

  // ═══ PHASE 1b: EP UPLOAD + PRE-RELEASE (May 12 – May 28) ═══
  "2026-05-12": { arc: "1", phase: "S4A Data Ingestion", weekName: "Wk 3 — Strategy Pivot", dayLabel: "STRATEGY SYNC", badge: "Sync", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Ingest S4A Data + EP Date Shift to May 29. Align Oracle docs.", sub: "Tuesday. Aligning for algorithmic training peak.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-13": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — Asset Prep", dayLabel: "DISCOVERY MODE SEED", badge: "Seed", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Activate Discovery Mode for catalog engines: HF + OTM. Seed algorithmic feed.", sub: "Wednesday. DM context is key for catalog velocity.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-14": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — Asset Prep", dayLabel: "ASSET FINALIZATION", badge: "Assets", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Finalize GL/SF/WU2 video assets + lyric videos.", sub: "Thursday. T-5 to Upload.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-15": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — Asset Prep", dayLabel: "METADATA LOCK", badge: "Lock", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Verify all ISRCs + track order for EP. Lock Amuse metadata draft.", sub: "Friday. T-4 to Upload.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-16": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — Asset Prep", dayLabel: "WEEKEND BUFFER", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Final QC pass on all EP track masters.", sub: "Saturday.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-17": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 3 — Asset Prep", dayLabel: "SUNDAY RESET", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Mental reset. Plan the upload blitz.", sub: "Sunday.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-18": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — Upload Eve", dayLabel: "UPLOAD EVE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Verify EP cover art + UPC. Final metadata check.", sub: "Monday. Tomorrow is the drop.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-19": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — EP Upload", dayLabel: "MIX/MASTER FINALIZE", badge: "Produce", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Final mix/master pass on GL + SF + WU2. Prep Amuse metadata.", sub: "Monday. Upload Thursday.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-20": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — EP Upload", dayLabel: "METADATA LOCK", badge: "Lock", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Lock all ISRCs + track order. Verify EP cover art + UPC.", sub: "Tuesday. Upload in 2 days.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-21": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — EP Upload", dayLabel: "UPLOAD EVE", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final QC. Tracklist reveal content. Announce 'ALL LOVE'.", sub: "Wednesday. Tomorrow is the upload.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-22": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — EP Upload", dayLabel: "EP AMUSE UPLOAD", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload GL + SF + WU2 + ALL LOVE EP entity to Amuse. Set release May 29.", sub: "Thursday night. Screenshot ISRC page.", warning: { type: "important", icon: "📋", text: "<strong>ISRC CARRY:</strong> Enter SEE ME's ISRC from Mar 13 onto EP track 3. Enter ESL's ISRC from May 8 onto EP track 4. GL/SF/WU2 get new ISRCs." }, nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-23": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — Content Blitz", dayLabel: "VERIFY INGESTION", badge: "Sync", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Verify Amuse ingestion. Check Spotify 'Upcoming' tab. EP editorial pitch.", sub: "Friday. Pitch Sweet Frustration — KAYTRANADA lane.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-24": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 4 — Content Blitz", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. Final asset pass.", sub: "Sunday.", nn: FLATLINE_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-25": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 5 — Release Week", dayLabel: "EP EVE - 4", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Post Sweet Frustration teaser. DM blitz start.", sub: "Monday. T-4.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-26": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 5 — Release Week", dayLabel: "EP EVE - 3", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Post WANT U 2 teaser. EP-exclusive angle.", sub: "Tuesday. T-3.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-27": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 5 — Release Week", dayLabel: "EP EVE - 2", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Talk to 'em: What ALL LOVE means. Ads staged.", sub: "Wednesday. T-2.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },
  "2026-05-28": { arc: "1", phase: "EP Campaign — Pre-Release", weekName: "Wk 5 — Release Week", dayLabel: "EVE OF EP", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final DM blitz. Check Spotify for Artists live stats prep.", sub: "Thursday night. Midnight drop.", nn: ARC1_NN, dropLabel: "Days to EP", dropDate: "2026-05-29" },

  // ═══ PHASE 1c: EP RELEASE + POST-RELEASE (May 29 – Jun 12) ═══
  "2026-05-29": { arc: "1", phase: "Honeymoon Phase", weekName: "Wk 5 — EP DROPS", dayLabel: "EP RELEASE DAY", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "ALL LOVE (EP) live on all platforms. Multi-platform content bomb.", sub: "Friday. Let's go.", nn: ARC1_NN, dropLabel: "EP LIVE", dropDate: "2026-05-29" },
  "2026-05-30": { arc: "1", phase: "Honeymoon Phase", weekName: "Wk 5 — EP Post-Release", dayLabel: "EP DAY 2", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Respond to DM engagement. Saturday.", sub: "Saturday.", nn: ARC1_NN, dropLabel: "Days to LID", dropDate: "2026-06-13" },

  // ═══ EP COMPOUND + ILG PRE-RELEASE (May 31 – Jun 11) ═══
  "2026-05-31": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "EP DAY 3", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "EP compound content. DM follow-up from release day.", sub: "Day 2 post-release.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-01": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. EP 3-day save rate check (target 3%+).", sub: "Day 3 post-release.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-02": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data. Record I Like Girls.", sub: "Day 4.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-03": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "COMPOUND + PRODUCE", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "EP compound content. Mix I Like Girls.", sub: "Day 5.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-04": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ESL + GL + SF + WU2 registrations (ASCAP, MLC, Songtrust, SoundExchange). Master I Like Girls.", sub: "Day 6.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-05": { arc: "2", phase: "EP Compound", weekName: "EP Post-Release", dayLabel: "SYNC + UPLOAD ILG", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Sync pitching. Upload I Like Girls to Amuse. Set release Jun 12.", sub: "Day 7.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-06": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "ILG pre-save push begins. World-building post.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-07": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. EP 10-day data. ILG pre-save push.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-08": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: I Like Girls editorial pitch.", sub: "Day 10.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-09": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post. Talk to 'Em: ILG story.", sub: "Day 11.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-10": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep. Meme account: 2-3 LYRC edits with ILG audio.", sub: "Day 12.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },
  "2026-06-11": { arc: "2", phase: "ILG Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF ILG", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz finalized. Ads staged.", sub: "Tomorrow ILG drops.", nn: ARC2_NN, dropLabel: "Days to ILG", dropDate: "2026-06-12" },

  // ═══ I LIKE GIRLS LIFECYCLE (Jun 12 – Jun 25) ═══
  "2026-06-12": { arc: "2", phase: "I Like Girls Drops", weekName: "Vault Single", dayLabel: "I LIKE GIRLS DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "I Like Girls drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-13": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-14": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-15": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-16": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Like I Did.", sub: "Day 4.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-17": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Like I Did.", sub: "Day 5.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-18": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Like I Did.", sub: "Day 6.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-19": { arc: "2", phase: "I Like Girls Live", weekName: "Vault Single", dayLabel: "SYNC + UPLOAD LID", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + sync pitching. Upload Like I Did to Amuse. Set release Jun 26.", sub: "Day 7.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-20": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "LID pre-save push. World-building post.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-21": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. ILG 10-day data. LID pre-save push.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-22": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: Like I Did editorial pitch.", sub: "Day 10.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-23": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post. Talk to 'Em: LID story.", sub: "Day 11.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-24": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep. Meme account: 2-3 LYRC edits with LID audio.", sub: "Day 12.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },
  "2026-06-25": { arc: "2", phase: "LID Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF LID", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz finalized. Ads staged.", sub: "Tomorrow LID drops.", nn: ARC2_NN, dropLabel: "Days to LID", dropDate: "2026-06-26" },

  // ═══ LIKE I DID LIFECYCLE (Jun 26 – Jul 9) ═══
  "2026-06-26": { arc: "2", phase: "Like I Did Drops", weekName: "Vault Single", dayLabel: "LIKE I DID DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Like I Did drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },

  // ═══ LIKE I DID LIVE (Jun 27 – Jul 9) ═══
  "2026-06-27": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-06-28": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-06-29": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-06-30": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Worth It.", sub: "Day 4.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-01": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Worth It.", sub: "Day 5.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-02": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Worth It.", sub: "Day 6.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-03": { arc: "2", phase: "Like I Did Live", weekName: "Vault Single", dayLabel: "SYNC + UPLOAD WI", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Sync pitching. Upload Worth It to Amuse. Set release Jul 10.", sub: "Day 7.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-04": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "WI pre-save push. World-building post.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-05": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. LID 10-day data. WI pre-save push.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-06": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: Worth It editorial pitch.", sub: "Day 10.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-07": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-08": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep. Meme account: 2-3 LYRC edits with WI audio.", sub: "Day 12.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  "2026-07-09": { arc: "2", phase: "WI Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF WORTH IT", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz finalized. Ads staged.", sub: "Tomorrow WI drops.", nn: ARC2_NN, dropLabel: "Days to WI", dropDate: "2026-07-10" },
  // 2026-07-10 = CREAM DECISION (see below — overrides WI release day; data call takes priority)

  // ═══ WORTH IT LIVE (Jul 11 – Jul 23) → JSS DROPS (Jul 24) ═══
  "2026-07-11": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-12": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-13": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-14": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Just Say So.", sub: "Day 4.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-15": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Just Say So.", sub: "Day 5.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-16": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Just Say So.", sub: "Day 6.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  // 2026-07-17 = 90-DAY REVIEW (see below — overrides WI sync/upload day on this date)
  "2026-07-18": { arc: "3", phase: "Worth It Live", weekName: "Vault Single", dayLabel: "SYNC + UPLOAD JSS", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Sync pitching. Upload Just Say So to Amuse. Set release Jul 24.", sub: "Day 7.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-19": { arc: "3", phase: "JSS Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "JSS pre-save push. World-building post.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-20": { arc: "3", phase: "JSS Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. WI 10-day data. JSS pre-save push.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-21": { arc: "3", phase: "JSS Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: Just Say So editorial pitch.", sub: "Day 10.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-22": { arc: "3", phase: "JSS Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-23": { arc: "3", phase: "JSS Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF JUST SAY SO", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz finalized. Ads staged.", sub: "Tomorrow JSS drops.", nn: ARC3_NN, dropLabel: "Days to JSS", dropDate: "2026-07-24" },
  "2026-07-24": { arc: "3", phase: "Just Say So Drops", weekName: "Vault Single", dayLabel: "JUST SAY SO DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Just Say So drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },


  // ═══ JUST SAY SO LIVE (Jul 25 – Aug 6) → RCN DROPS (Aug 7) ═══
  "2026-07-25": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "POST-RELEASE", badge: "Momentum", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Post-release content. Let it breathe.", sub: "Day 1.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-26": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "SUNDAY DATA", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Grief journal. 48-hr data.", sub: "Day 2.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-27": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "DM FOLLOW-UP", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "DM follow-up + data.", sub: "Day 3.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-28": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "DATA PULL", badge: "Data", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "3-day save rate check (target 3%+). Record Reconnect.", sub: "Day 4.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-29": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "COMPOUND", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Compound + meme content. Mix Reconnect.", sub: "Day 5.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-30": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "COMPLIANCE", badge: "Compliance", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Compliance Thursday: ASCAP, MLC, Songtrust. Master Reconnect.", sub: "Day 6.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-07-31": { arc: "3", phase: "Just Say So Live", weekName: "Vault Single", dayLabel: "SYNC + UPLOAD RCN", badge: "Sustain", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "Sync pitching. Upload Reconnect to Amuse. Set release Aug 7.", sub: "Day 7.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-01": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "PRE-SAVE PREP", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "RCN pre-save push. World-building post.", sub: "Day 8.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-02": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "SUNDAY", badge: "Sunday", badgeClass: "badge-purple", cardClass: "card-left purple", deliverable: "Grief journal. JSS 10-day data. RCN pre-save push.", sub: "Day 9.", nn: FLATLINE_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-03": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "PITCH", badge: "Pitch", badgeClass: "badge-blue", cardClass: "card-left blue", deliverable: "Spotify for Artists: Reconnect editorial pitch.", sub: "Day 10.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-04": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "WORLD-BUILDING", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "World-building post.", sub: "Day 11.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-05": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "CONTENT", badge: "Content", badgeClass: "badge-gold", cardClass: "card-left", deliverable: "DM prep. Meme account: 2-3 LYRC edits with RCN audio.", sub: "Day 12.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-06": { arc: "3", phase: "RCN Pre-Release", weekName: "Vault Single", dayLabel: "EVE OF RECONNECT", badge: "Eve", badgeClass: "badge-orange", cardClass: "card-left orange", deliverable: "Final pre-save push. DM blitz finalized. Ads staged.", sub: "Tomorrow RCN drops.", nn: ARC3_NN, dropLabel: "Days to RCN", dropDate: "2026-08-07" },
  "2026-08-07": { arc: "3", phase: "Reconnect Drops", weekName: "Vault Single", dayLabel: "RECONNECT DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "Reconnect drops. Meme account: 3-5 LYRC edits. Surgical DMs.", sub: "Release day.", nn: ARC3_NN, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },

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
