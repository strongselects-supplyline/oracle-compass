// scripts/generate-vault-phasemap.js
// Generates phaseMap entries for Jul 18 → Sep 25 (vault singles arc)
// Run with: node scripts/generate-vault-phasemap.js

const singles = [
  { title: "Like I Did",   abbr: "LID",  upload: "2026-07-18", release: "2026-07-25", bpm: "110 BPM, D major" },
  { title: "I Like Girls", abbr: "ILG",  upload: "2026-08-01", release: "2026-08-08", bpm: "107 BPM, F# minor" },
  { title: "Worth It",     abbr: "WI",   upload: "2026-08-15", release: "2026-08-22", bpm: "97 BPM, F minor" },
  { title: "Just Say So",  abbr: "JSS",  upload: "2026-08-29", release: "2026-09-05", bpm: "122 BPM, Bb minor" },
  { title: "Reconnect",    abbr: "RCN",  upload: "2026-09-12", release: "2026-09-19", bpm: "82 BPM, D major" },
];

const VAULT_NN = `["DoorDash + calisthenics", "One creative + one business deliverable", "2hr focus / 20min walk rhythm"]`;
const FLATLINE_NN = `["Calisthenics — even if pointless", "Meditation / mudras — keep the slot", "One content piece max (ceiling, not floor)"]`;

function fmt(d) { return d.toISOString().split("T")[0]; }
function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return fmt(d);
}
function dayOfWeek(dateStr) {
  return new Date(dateStr + "T12:00:00Z").getUTCDay(); // 0=Sun
}

let out = "";

// ── TOPLINE + RECORDING BATCH (Jul 18–24) ──
const batchEntries = [
  ["2026-07-18", "TOPLINE DAY 1", "Record", "badge-blue", "Toplines — Like I Did + I Like Girls", "Performer mode only. Don't engineer. Capture ideas raw.", false],
  ["2026-07-19", "TOPLINE DAY 2", "Record", "badge-blue", "Toplines — Worth It + Just Say So", "Keep the flow. No polish today.", false],
  ["2026-07-20", "TOPLINE DAY 3", "Record", "badge-blue", "Toplines — Reconnect + overflow review", "Final topline day. Review all 5-6 ideas.", false],
  ["2026-07-21", "RECORDING DAY 1", "Record", "badge-blue", "Full vocals — Like I Did + I Like Girls", "Comp → de-breath → comp2. Batch mode.", false],
  ["2026-07-22", "RECORDING DAY 2", "Record", "badge-blue", "Full vocals — Worth It + Just Say So", "Same batch workflow.", false],
  ["2026-07-23", "RECORDING DAY 3", "Record", "badge-blue", "Full vocals — Reconnect + finishing takes", "All 5 tracks recorded by end of today.", false],
  ["2026-07-24", "RECORDING OVERFLOW + ROUGH MIX", "Mix", "badge-blue", "Overflow takes + start rough mix on Like I Did", "Buffer day. If recording complete, start mixing.", false],
];

out += "\n  // ═══ ARC 3 — VAULT PRODUCTION BATCH (Jul 18–24) ═══\n";
for (const [date, label, badge, cls, deliv, sub, isSun] of batchEntries) {
  out += `  "${date}": { arc: "3", phase: "Vault Production Batch", weekName: "Wk 14 — Batch Recording", dayLabel: "${label}", badge: "${badge}", badgeClass: "${cls}", cardClass: "card-left blue", deliverable: "${deliv}", sub: "${sub}", nn: ${VAULT_NN}, dropLabel: "Days to LID", dropDate: "2026-07-25" },\n`;
}

// ── PER-SINGLE LIFECYCLES ──
for (let i = 0; i < singles.length; i++) {
  const s = singles[i];
  const next = singles[i + 1];
  const nextLabel = next ? `Days to ${next.abbr}` : "Days to CREAM";
  const nextDate  = next ? next.release : "2026-10-23";
  const wkNum = 15 + i * 2;
  const sIdx = i + 1;

  out += `\n  // ═══ ${s.title.toUpperCase()} LIFECYCLE (${s.upload} → +14) ═══\n`;

  // Upload day (T-7)
  out += `  "${s.upload}": { arc: "3", phase: "${s.title} Campaign", weekName: "Wk ${wkNum} — ${s.title} Pre-Release", dayLabel: "UPLOAD ${s.title.toUpperCase()}", badge: "Upload", badgeClass: "badge-green", cardClass: "card-left green", deliverable: "Upload ${s.title} to Amuse · Set release ${s.release}", sub: "${s.bpm}. LYRC session: generate 30-50 content variations today.", warning: { type: "important", icon: "📋", text: "<strong>Vault single ${sIdx} upload.</strong> Screenshot ISRC. LYRC batch today. Content sprint starts." }, nn: ${VAULT_NN}, dropLabel: "${nextLabel}", dropDate: "${nextDate}" },\n`;

  // T-6 to T-1
  const preLabels    = ["LYRC BATCH + SCHEDULE",   "CONTENT SPRINT",                              "CONTENT + DM PREP",                        "EDITORIAL PITCH",               "EVE OF RELEASE"];
  const preBadges    = ["Content",                  "Content",                                     "Content",                                  "Pitch",                         "Eve"];
  const preBadgeCls  = ["badge-gold",               "badge-gold",                                  "badge-gold",                               "badge-blue",                    "badge-orange"];
  const preDelivs    = [
    `Schedule LYRC outputs for ${s.title} release week · Pure meme account posts`,
    `${s.title} world-building content · Meme account posting`,
    `Surgical DM prep (sync sups + curators only) · ${s.title} story content`,
    `Spotify for Artists editorial pitch for ${s.title} · Teaser post`,
    `Final pre-save push · DM list finalized · Everything staged for tomorrow`,
  ];

  for (let d = 1; d <= 5; d++) {
    const date = addDays(s.upload, d);
    const nn = dayOfWeek(date) === 0 ? FLATLINE_NN : VAULT_NN;
    const badge = dayOfWeek(date) === 0 ? "Sunday" : preBadges[d-1];
    const badgeCls = dayOfWeek(date) === 0 ? "badge-purple" : preBadgeCls[d-1];
    const deliv = dayOfWeek(date) === 0 ? `Grief journal · ${s.title} pre-release data check · Rest` : preDelivs[d-1];
    const lbl   = dayOfWeek(date) === 0 ? "SUNDAY — PRE-RELEASE REST" : preLabels[d-1];
    out += `  "${date}": { arc: "3", phase: "${s.title} Campaign", weekName: "Wk ${wkNum} — ${s.title} Pre-Release", dayLabel: "${lbl}", badge: "${badge}", badgeClass: "${badgeCls}", cardClass: "card-left", deliverable: "${deliv}", sub: "T-${7-d} to release.", nn: ${nn}, dropLabel: "${nextLabel}", dropDate: "${nextDate}" },\n`;
  }

  // Release day (T+0)
  out += `  "${s.release}": { arc: "3", phase: "${s.title} Release Day", weekName: "Wk ${wkNum+1} — ${s.title} Drops", dayLabel: "${s.title.toUpperCase()} DROPS", badge: "Release", badgeClass: "badge-red", cardClass: "card-left red", deliverable: "${s.title} live everywhere · Meme account drops 3-5 LYRC edits · Surgical DMs", sub: "Vault single ${sIdx} of 5. Release Radar trigger. Post everywhere.", warning: { type: "important", icon: "🎉", text: "<strong>${s.title} is live.</strong> Vault single ${sIdx}. Check streams in 24hrs." }, nn: ["Surgical DMs only (sync sups + curators)", "Meme account: 3-5 LYRC edits", "Do NOT check stats after 8 PM"], dropLabel: "${nextLabel}", dropDate: "${nextDate}" },\n`;

  // Post-release (T+1 through T+7, find compliance Thursday)
  const postLabels   = ["POST-RELEASE CONTENT", "DM FOLLOW-UP + DATA", "DATA PULL", "COMPOUND + MEME", "COMPLIANCE", "COMPOUND", "SUNDAY REVIEW"];
  const postBadges   = ["Momentum", "Data", "Data", "Sustain", "Compliance", "Sustain", "Sunday"];
  const postBadgeCls = ["badge-red", "badge-blue", "badge-blue", "badge-gold", "badge-purple", "badge-gold", "badge-purple"];
  const postDelivs   = [
    `${s.title} post-release content wave 2 · Respond to engagement`,
    `${s.title} 48-hr data · DM follow-up with responders`,
    `${s.title} 3-day save rate check · Note for catalog matrix`,
    `Meme account compound posts · Sync pitch outreach`,
    `${s.title} compliance: ASCAP, MLC, Songtrust, Musixmatch`,
    `Compound week: playlist outreach · Sync pitching · Next batch prep`,
    `Grief journal · ${s.title} week-1 data · Rest`,
  ];

  for (let d = 1; d <= 7; d++) {
    const date = addDays(s.release, d);
    const dow  = dayOfWeek(date);
    const isSunday = dow === 0;
    const idx  = isSunday ? 6 : Math.min(d-1, 5);
    const nn   = isSunday ? FLATLINE_NN : VAULT_NN;
    out += `  "${date}": { arc: "3", phase: "${s.title} Post-Release", weekName: "Wk ${wkNum+1} — ${s.title} Live", dayLabel: "${postLabels[idx]}", badge: "${postBadges[idx]}", badgeClass: "${postBadgeCls[idx]}", cardClass: "card-left", deliverable: "${postDelivs[idx]}", sub: "Day ${d+7} of 14-day lifecycle.", nn: ${nn}, dropLabel: "${nextLabel}", dropDate: "${nextDate}" },\n`;
  }
}

// ── POST-VAULT COMPOUND (Sep 20-25) ──
out += `\n  // ═══ POST-VAULT COMPOUND + CREAM PREP (Sep 20-25) ═══\n`;
const compound = [
  ["2026-09-20", "VAULT ARC REVIEW",       "Review",   "badge-gold",   `All 5 vault singles data audit · Save rates · Meme account 60-day audit`,    "Which singles stuck? What content format won?",            VAULT_NN],
  ["2026-09-21", "SUNDAY — GRIEF JOURNAL", "Sunday",   "badge-purple", `Grief journal · Full catalog data · Partner time`,                            "Rest day.",                                                FLATLINE_NN],
  ["2026-09-22", "CREAM PRE-PRODUCTION",   "Produce",  "badge-blue",   `CREAM pre-prod (if GO): sequence 10 tracks + Cyanite all demos`,              "If NO-GO: plan Oct-Dec vault continuation from remaining catalog.", VAULT_NN],
  ["2026-09-23", "SYNC PITCHING",          "Pitch",    "badge-blue",   `Full catalog sync outreach · 11+ live tracks + instrumentals`,                "Use Cyanite data for mood descriptions.",                   VAULT_NN],
  ["2026-09-24", "LIVE SHOW PREP",         "Business", "badge-green",  `Book Oct-Nov shows · Rehearse setlist with all vault singles`,                 "11-track catalog = full set now.",                         VAULT_NN],
  ["2026-09-25", "180-DAY HORIZON CHECK",  "Review",   "badge-gold",   `Mid-year audit · Full catalog + revenue review · Plan Oct-Dec`,               "CREAM GO → album Oct 23. NO-GO → vault continues.",       VAULT_NN],
];

for (const [date, label, badge, cls, deliv, sub, nn] of compound) {
  out += `  "${date}": { arc: "3", phase: "Post-Vault Compound", weekName: "Wk 23 — Vault Review + CREAM Prep", dayLabel: "${label}", badge: "${badge}", badgeClass: "${cls}", cardClass: "card-left", deliverable: "${deliv}", sub: "${sub}", nn: ${nn}, dropLabel: "Days to CREAM", dropDate: "2026-10-23" },\n`;
}

console.log(out);
