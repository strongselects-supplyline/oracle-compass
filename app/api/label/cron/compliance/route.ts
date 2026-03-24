// app/api/label/cron/compliance/route.ts
// Vercel Cron: runs daily at 8am CT to check compliance registry
import { NextResponse } from "next/server";
import { getDynamicReleases } from "@/lib/releases";

export async function GET() {
    const now = new Date();
    const escalations: { track: string; issue: string; severity: "AMBER" | "RED" }[] = [];
    const releases = await getDynamicReleases();

    // Iterate over upcoming releases
    for (const track of releases.filter(r => r.status !== "live")) {
        const releaseDate = new Date(track.releaseDate);
        const daysUntil = Math.ceil((releaseDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntil < 0) continue;

        const d = track.contentDeliverables;

        // RED: Any not_started item within 3 days
        if (daysUntil <= 3) {
            const notStarted: string[] = [];
            if (!d.ascapRegistered) notStarted.push("ASCAP");
            if (!d.mlcRegistered) notStarted.push("MLC");
            if (!d.songtrustRegistered) notStarted.push("Songtrust");
            if (!d.isrcPulled) notStarted.push("ISRC");
            if (!d.instrumentalRendered) notStarted.push("Instrumental");

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
            if (!d.ascapRegistered) incomplete.push("ASCAP");
            if (!d.mlcRegistered) incomplete.push("MLC");
            if (!d.songtrustRegistered) incomplete.push("Songtrust");

            if (incomplete.length > 0) {
                escalations.push({
                    track: track.title,
                    issue: `${daysUntil} days to release. Incomplete: ${incomplete.join(", ")}.`,
                    severity: "AMBER"
                });
            }
        }

        // AMBER: Instrumental not rendered within 14 days
        if (daysUntil <= 14 && !d.instrumentalRendered) {
            escalations.push({
                track: track.title,
                issue: `Instrumental not rendered. Sync licensing at risk. ${daysUntil} days to release.`,
                severity: "AMBER"
            });
        }

        // PITCH DEADLINE ALERTS
        if (track.pitchDeadline) {
            const pitchDate = new Date(track.pitchDeadline);
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
