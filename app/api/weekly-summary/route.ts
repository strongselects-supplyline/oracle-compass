import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

function getLast7Days(): string[] {
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
}

export async function GET() {
    try {
        const days = getLast7Days();
        const daySet = new Set(days);

        const [ddRows, journalRows] = await Promise.all([
            getSheetData('DOORDASH'),
            getSheetData('JOURNAL'),
        ]);

        // --- DoorDash: sum hours per day ---
        const ddByDay: Record<string, number> = {};
        for (const row of ddRows) {
            const date = String(row['Date'] || '').split('T')[0];
            if (daySet.has(date)) {
                ddByDay[date] = (ddByDay[date] || 0) + (parseFloat(String(row['Hours'])) || 0);
            }
        }

        // --- Journal: track win streak and counts ---
        const journalByDay: Record<string, { winCount: number; hasSovereignty: boolean }> = {};
        for (const row of journalRows) {
            const date = String(row['Date'] || '').split('T')[0];
            if (daySet.has(date)) {
                journalByDay[date] = {
                    winCount: parseInt(String(row['WinCount'])) || 0,
                    // Win_Process maps to "did the morning process / sovereignty stack"
                    hasSovereignty: row['Win_Process'] === 'Yes',
                };
            }
        }

        // Build day-by-day summary
        const summary = days.map(date => ({
            date,
            ddHours: ddByDay[date] ?? null,
            winCount: journalByDay[date]?.winCount ?? null,
            hasSovereignty: journalByDay[date]?.hasSovereignty ?? null,
            logged: !!journalByDay[date],
        }));

        // Aggregates
        const totalDDHours = Object.values(ddByDay).reduce((a, b) => a + b, 0);
        const sovereignDays = Object.values(journalByDay).filter(j => j.hasSovereignty).length;
        const loggedDays = summary.filter(s => s.logged).length;

        return NextResponse.json({
            days: summary,
            totalDDHours: Math.round(totalDDHours * 10) / 10,
            sovereignDays,
            loggedDays,
            sovereignRate: loggedDays > 0 ? Math.round((sovereignDays / loggedDays) * 100) : null,
        });
    } catch (error) {
        console.error('weekly-summary error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
