// app/api/label/cron/briefing/route.ts
// Vercel Cron: daily morning briefing that synthesizes all agent data
// Runs at 7am CT, produces a digest the Oracle can consume
import { NextResponse } from "next/server";
import { getDynamicReleases } from "@/lib/releases";


export async function GET() {
    const now = new Date();
    const releases = await getDynamicReleases();

    // Find the next upcoming release
    const upcoming = releases
        .filter(r => r.status !== "live")
        .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());

    const nextRelease = upcoming[0];
    const daysUntilNext = nextRelease
        ? Math.ceil((new Date(nextRelease.releaseDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null;

    // Check compliance status for next release
    const d = nextRelease?.contentDeliverables;

    const complianceGaps: string[] = [];
    if (d) {
        if (!d.ascapRegistered) complianceGaps.push("ASCAP");
        if (!d.mlcRegistered) complianceGaps.push("MLC");
        if (!d.songtrustRegistered) complianceGaps.push("Songtrust");
        if (!d.isrcPulled) complianceGaps.push("ISRC");
        if (!d.instrumentalRendered) complianceGaps.push("Instrumental render");
        if (!d.splitSheetSigned) complianceGaps.push("Split sheet");
    }

    // Build the briefing
    const briefing = {
        date: now.toISOString().split("T")[0],
        timestamp: now.toISOString(),
        nextRelease: nextRelease ? {
            title: nextRelease.title,
            releaseDate: nextRelease.releaseDate,
            daysUntil: daysUntilNext,
            status: nextRelease.status,
        } : null,
        compliance: {
            clear: complianceGaps.length === 0,
            gaps: complianceGaps,
            message: complianceGaps.length === 0
                ? "All registrations current."
                : `Missing: ${complianceGaps.join(", ")}. Handle before release.`
        },
        queueDepth: upcoming.length,
        upcomingTitles: upcoming.map(r => r.title),
    };

    return NextResponse.json(briefing);
}
