import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const {
            date, pushups, squats, steps, sleepHours,
            weight, protein, workout, mobility, vocal, notes
        } = await req.json();
        if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

        let score = 0;
        if (workout) score++;
        if (mobility) score++;
        if (vocal) score++;
        if (Number(sleepHours) >= 7) score++;
        if (Number(steps) >= 8000) score++;
        if (protein) score++;

        await upsertRow('HEALTH', 'Date', date, {
            Date: date,
            Weight: weight || '',
            SleepHours: sleepHours || '',
            Workout: workout ? 'Yes' : '',
            Mobility: mobility ? 'Yes' : '',
            Vocal: vocal ? 'Yes' : '',
            Protein: protein ? 'Yes' : '',
            Steps: steps || 0,
            Pushups: pushups || 0,
            Squats: squats || 0,
            Score: score,
            Notes: notes || '',
        });

        return NextResponse.json({ ok: true, score, date });
    } catch (error) {
        console.error('Health route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
