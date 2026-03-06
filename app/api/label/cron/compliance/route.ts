// app/api/label/cron/compliance/route.ts
// Vercel Cron: runs daily at 8am CT to check compliance registry
import { NextResponse } from "next/server";
import { REGISTRY } from "@/lib/registry";
import { getDynamicReleases } from "@/lib/releases";

export async function GET() {
    const now = new Date();
    const escalations: { track: string; issue: string; severity: "AMBER" | "RED" }[] = [];
    const releases = await getDynamicReleases();

    for (const track of REGISTRY) {
        const releaseDate = new Date(track.releaseDate);
        const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Skip tracks already released
        if (daysUntil < 0) continue;

        // RED: Any not_started item within 3 days
        if (daysUntil <= 3) {
            const notStarted: string[] = [];
            if (track.ascap === "not_started") notStarted.push("ASCAP");
            if (track.mlc === "not_started") notStarted.push("MLC");
            if (track.songtrust === "not_started") notStarted.push("Songtrust");
            if (!track.isrc) notStarted.push("ISRC");
            if (!track.instrumentalRendered) notStarted.push("Instrumental");

            if (notStarted.length > 0) {
                escalations.push({
                    track: track.title,
                    issue: `${daysUntil} days to release. Missing: ${notStarted.join(", ")}. Revenue at risk.`,
                    severity: "RED"
                });
            }
        }

        // AMBER: PRO registrations not complete within 7 days
        if (daysUntil <= 7 && daysUntil > 3) {
            const incomplete: string[] = [];
            if (track.ascap !== "complete") incomplete.push("ASCAP");
            if (track.mlc !== "complete") incomplete.push("MLC");
            if (track.songtrust !== "complete") incomplete.push("Songtrust");

            if (incomplete.length > 0) {
                escalations.push({
                    track: track.title,
                    issue: `${daysUntil} days to release. Incomplete: ${incomplete.join(", ")}.`,
                    severity: "AMBER"
                });
            }
        }

        // AMBER: Instrumental not rendered within 14 days
        if (daysUntil <= 14 && !track.instrumentalRendered) {
            escalations.push({
                track: track.title,
                issue: `Instrumental not rendered. Sync licensing at risk. ${daysUntil} days to release.`,
                severity: "AMBER"
            });
        }

        // PITCH DEADLINE ALERTS (from studioData)
        const releaseData = releases.find(r => r.title === track.title);
        if (releaseData && releaseData.pitchDeadline) {
            const pitchDate = new Date(releaseData.pitchDeadline);
            const daysUntilPitch = Math.ceil((pitchDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

            if (daysUntilPitch === 7) {
                escalations.push({
                    track: track.title,
                    issue: `Pitch deadline is in exactly 7 days. Time to draft copy.`,
                    severity: "AMBER"
                });
            } else if (daysUntilPitch === 3) {
                escalations.push({
                    track: track.title,
                    issue: `Pitch deadline is in exactly 3 days. Submit today.`,
                    severity: "RED"
                });
            } else if (daysUntilPitch > 0 && daysUntilPitch < 3) {
                escalations.push({
                    track: track.title,
                    issue: `Pitch deadline is imminent (${daysUntilPitch} days).`,
                    severity: "RED"
                });
            }
        }
    }

    return NextResponse.json({
        timestamp: now.toISOString(),
        escalations,
        clear: escalations.length === 0
    });
}
