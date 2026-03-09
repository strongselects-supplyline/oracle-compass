import { NextResponse } from "next/server";
import { Resend } from "resend";
import { fetchDailyLogs, fetchFuelStats } from "@/lib/db";
import { getDynamicReleases } from "@/lib/releases";

// Initialize Resend
// Note: Requires RESEND_API_KEY in environment
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: Request) {
  // 1. Verify cron secret to prevent unauthorized execution
  const authHeader = req.headers.get('authorization');
  if (authHeader !== \`Bearer \${process.env.CRON_SECRET}\` && process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split("T")[0];

    // 2. Gather context for the Oracle (similar to what the frontend does, but server-side)
    const [logs, fuelStats, releases] = await Promise.all([
      fetchDailyLogs(today),
      fetchFuelStats(today),
      getDynamicReleases()
    ]);

    // Format the date for the context
    const dateFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

    // Mocking some data here that would normally come from the client state or DB
    // In a fully integrated system, these would be fetched from their respective DB tables
    const context = {
      date: dateFormatted,
      makeModeWeek: 2, // Would typically be computed based on start date
      daysUntilAlbum: Math.ceil((new Date("2026-04-10").getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      sobrietyStreak: 124, // Example, should come from DB
      declaredPriority: "MUSIC",
      dailyLog: logs.today || {
          date: today,
          oneThing: "Release prep",
          sovereigntyStack: true,
          movement: false,
          sauna: false,
          sleep: 7,
          pushups: 0,
          fuelPreSession: true,
          fuelMidSession: true,
          fuelPostSession: true,
          fuelHydration: 4,
          fuelDairyFlag: false
      },
      recentLogs: logs.recent || [],
      fuel: fuelStats || { todayScore: 3, todayHydration: 4, todayDairyFlag: false, recentAvgScore: 2.8, missedPreCount: 0 },
      weeklyStudioSessions: 3, // Would come from DB
      cycleTracks: [], // Would come from DB
      releases: releases || [],
      label: {
          nextReleaseTitle: "Example Track",
          daysUntilNextRelease: 14,
          complianceGaps: []
      },
      engine: {
          dailyMove: "Reached out to 5 accounts",
          weeklyTouches: 12,
          touchTarget: 15,
          accounts: []
      },
      income: {
          doordashShiftsThisWeek: 2,
          doordashEarningsThisWeek: 150,
          doordashEarningsThisMonth: 600,
          ssRevenueThisWeek: 850
      },
      lastDecree: { severity: "GREEN", oracle_message: "Stay the course. The build requires focus." }
    };

    // 3. Call the Oracle API locally since we are on the server
    // We construct the request to the Oracle route
    const oracleHost = process.env.VERCEL_URL ? \`https://\${process.env.VERCEL_URL}\` : "http://localhost:3000";
    const oracleResponse = await fetch(\`\${oracleHost}/api/oracle\`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(context)
    });

    if (!oracleResponse.ok) {
        throw new Error(\`Oracle failed: \${await oracleResponse.text()}\`);
    }

    const decree = await oracleResponse.json();

    // 4. Send the decree via email
    if (process.env.RESEND_API_KEY && process.env.ETHAN_EMAIL) {
      await resend.emails.send({
        from: 'Oracle Compass <oracle@strongselects.com>', // Requires verified domain
        to: [process.env.ETHAN_EMAIL],
        subject: \`[\${decree.severity}] The Dawn Decree - \${dateFormatted}\`,
        html: \`
          <div style="font-family: monospace; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px;">
            <h1 style="border-bottom: 1px solid #333; padding-bottom: 10px;">THE DAWN ORACLE</h1>
            
            <div style="margin: 20px 0; padding: 15px; border-left: 4px solid \${
                decree.severity === 'RED' ? '#ef4444' : 
                decree.severity === 'AMBER' ? '#f59e0b' : 
                '#10b981'
            }; background: #111;">
                <p style="font-size: 18px; margin: 0;"><strong>STATUS: \${decree.severity}</strong></p>
                <p style="font-size: 16px; line-height: 1.5;">\${decree.oracle_message}</p>
            </div>
            
            <h3>ASSESSMENT</h3>
            <p style="white-space: pre-wrap; color: #ccc;">\${decree.assessment}</p>
            
            \${decree.realignments && decree.realignments.length > 0 && decree.realignments[0].type !== 'no_change' ? \`
            <h3>REQUIRED REALIGNMENTS</h3>
            <ul style="color: #ccc;">
                \${decree.realignments.map((r: any) => \`<li><strong>\${r.type}</strong>: \${r.reason}</li>\`).join('')}
            </ul>
            \` : '<p style="color: #666;">No realignments required today.</p>'}
            
            <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 10px; font-size: 12px; color: #666;">
                <p>Run via Oracle Compass Autonomous AI.</p>
            </div>
          </div>
        \`
      });
    }

    return NextResponse.json({ 
        success: true, 
        message: "Dawn Oracle executed and dispatched.",
        decree 
    });

  } catch (error) {
    console.error("Dawn Oracle Cron failed:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
