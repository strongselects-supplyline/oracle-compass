// lib/doctrineLinks.ts
// Maps today's phaseMap day to relevant doctrine pages.
// Used by ContextualDoctrineLinks component on the Kill page.

import type { PhaseDay } from "./phaseMap";

export interface DoctrineLink {
  slug: string;
  icon: string;
  title: string;
  reason: string;
}

/**
 * Given today's phase, return 2-4 most relevant doctrine pages.
 * Logic is keyword-based on phase.dayLabel, phase.badge, and phase.phase.
 */
export function getContextualDoctrineLinks(phase: PhaseDay): DoctrineLink[] {
  const links: DoctrineLink[] = [];
  const label = phase.dayLabel.toUpperCase();
  const badge = phase.badge.toUpperCase();
  const phaseName = phase.phase.toUpperCase();

  // ── Recording days ──
  if (label.includes("RECORD") || label.includes("VOCAL") || badge === "RECORD") {
    links.push({
      slug: "vocal-codex",
      icon: "🎙️",
      title: "S-Rank Vocal Codex",
      reason: "Run Pre-Flight Somatic Matrix before opening the mic",
    });
    links.push({
      slug: "sovereignty-stack",
      icon: "🧘",
      title: "Sovereignty Stack",
      reason: "Breathwork + somatic check-in before session",
    });
    links.push({
      slug: "body-codex",
      icon: "🦾",
      title: "Body Codex",
      reason: "Posture check — protect your back during long sessions",
    });
    links.push({
      slug: "waking-mind",
      icon: "🧠",
      title: "Waking Mind Protocol",
      reason: "S3 activation for sprint focus",
    });
  }

  // ── Mix or Master days ──
  if (label.includes("MIX") || label.includes("MASTER") || badge === "MIX" || badge === "MASTER" || badge === "PRODUCE") {
    links.push({
      slug: "mixing-codex",
      icon: "🎛️",
      title: "Sovereign Mixing Codex",
      reason: "9-stage protocol — follow the chain",
    });
    links.push({
      slug: "frequency-key",
      icon: "〜",
      title: "Frequency × Key Matrix",
      reason: "Brainwave entrainment for deep focus mixing",
    });
    links.push({
      slug: "body-codex",
      icon: "🦾",
      title: "Body Codex",
      reason: "Posture check — protect your back during long sessions",
    });
  }

  // ── Content / Upload / Pre-release days ──
  if (
    label.includes("CONTENT") || label.includes("UPLOAD") || label.includes("PRE-SAVE") ||
    badge === "CONTENT" || badge === "UPLOAD" || badge === "PITCH"
  ) {
    links.push({
      slug: "spotify-ads",
      icon: "📈",
      title: "Spotify Ads Mastery",
      reason: "Ad strategy reference for this release cycle",
    });
    links.push({
      slug: "wartime-rhythm",
      icon: "⚡",
      title: "Wartime Rhythm",
      reason: "Pre-release execution protocol",
    });
  }

  // ── Release days ──
  if (badge === "RELEASE" || label.includes("DROPS")) {
    links.push({
      slug: "wartime-rhythm",
      icon: "⚡",
      title: "Wartime Rhythm",
      reason: "Release day execution protocol",
    });
    links.push({
      slug: "spotify-ads",
      icon: "📈",
      title: "Spotify Ads Mastery",
      reason: "Activate ads alongside release",
    });
  }

  // ── Compliance / Data / Review days ──
  if (
    label.includes("COMPLIANCE") || label.includes("DATA") || label.includes("REVIEW") ||
    badge === "COMPLIANCE" || badge === "DATA" || badge === "REVIEW" || badge === "AUDIT"
  ) {
    links.push({
      slug: "90-day-roadmap",
      icon: "📅",
      title: "90-Day Roadmap",
      reason: "Check progress against targets",
    });
    links.push({
      slug: "wartime-rhythm",
      icon: "⚡",
      title: "Wartime Rhythm",
      reason: "Full 90-day sovereign action schematic",
    });
  }

  // ── Sunday / Rest / Grief journal days ──
  if (badge === "SUNDAY" || badge === "REST" || label.includes("SUNDAY") || label.includes("REST")) {
    links.push({
      slug: "sovereignty-stack",
      icon: "🧘",
      title: "Sovereignty Stack",
      reason: "Recovery protocol — breathwork, somatic, movement",
    });
    links.push({
      slug: "mudra-system",
      icon: "🙏",
      title: "Mudra System",
      reason: "State-reset for rest day",
    });
    links.push({
      slug: "waking-mind",
      icon: "🧠",
      title: "Waking Mind Protocol",
      reason: "Metacognition check-in",
    });
  }

  // ── Compound / Decision / Strategy days ──
  if (phaseName.includes("COMPOUND") || label.includes("CREAM") || label.includes("DECISION") || badge === "DECISION") {
    links.push({
      slug: "wartime-rhythm",
      icon: "⚡",
      title: "Wartime Rhythm",
      reason: "Strategic planning framework",
    });
    links.push({
      slug: "90-day-roadmap",
      icon: "📅",
      title: "90-Day Roadmap",
      reason: "Targets and decision criteria",
    });
  }

  // ── Live / Business days ──
  if (badge === "BUSINESS" || label.includes("LIVE") || label.includes("BOOKING")) {
    links.push({
      slug: "rank-scroll",
      icon: "🥷",
      title: "Rank Scroll",
      reason: "Mastery tier reference — know your level",
    });
    links.push({
      slug: "spotify-ads",
      icon: "📈",
      title: "Spotify Ads Mastery",
      reason: "Amplify around live shows",
    });
  }

  // ── Eve days ──
  if (badge === "EVE") {
    links.push({
      slug: "wartime-rhythm",
      icon: "⚡",
      title: "Wartime Rhythm",
      reason: "Tomorrow is a release — review the protocol",
    });
    links.push({
      slug: "vocal-codex",
      icon: "🎙️",
      title: "S-Rank Vocal Codex",
      reason: "Review your catalog before the drop",
    });
  }

  // ── Deduplicate by slug, keep first occurrence, cap at 4 ──
  const seen = new Set<string>();
  const deduped: DoctrineLink[] = [];
  for (const link of links) {
    if (!seen.has(link.slug)) {
      seen.add(link.slug);
      deduped.push(link);
    }
    if (deduped.length >= 4) break;
  }

  // ── Fallback: if nothing matched ──
  if (deduped.length === 0) {
    deduped.push({
      slug: "waking-mind",
      icon: "🧠",
      title: "Waking Mind Protocol",
      reason: "Metacognition check-in",
    });
    deduped.push({
      slug: "sovereignty-stack",
      icon: "🧘",
      title: "Sovereignty Stack",
      reason: "Daily practices",
    });
  }

  return deduped;
}
