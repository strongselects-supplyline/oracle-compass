import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const { date, trataka = 0, breathwork = 0, meditation = 0, notes = '' } = await req.json();
        if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

        await upsertRow('PRACTICE', 'Date', date, {
            Date: date,
            Trataka: parseInt(trataka) || 0,
            Breathwork: parseInt(breathwork) || 0,
            Meditation: parseInt(meditation) || 0,
            Notes: notes,
            UpdatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ ok: true, date });
    } catch (error) {
        console.error('Practice route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
