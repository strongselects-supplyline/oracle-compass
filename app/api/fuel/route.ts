import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const { date, fuel, notes = '' } = await req.json();
        if (!date || !fuel) return NextResponse.json({ error: 'Date and fuel required' }, { status: 400 });

        // fuel: 'flow' | 'discipline' | 'toxic'
        await upsertRow('FUEL', 'Date', date, {
            Date: date,
            Fuel: fuel,
            Notes: notes,
            UpdatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ ok: true, date });
    } catch (error) {
        console.error('Fuel route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
