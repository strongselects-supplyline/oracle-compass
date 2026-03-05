import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const { date, hours, revenue, tips, gas, miles, notes } = await req.json();
        if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

        const gross = (parseFloat(revenue) || 0) + (parseFloat(tips) || 0);
        const profit = gross - (parseFloat(gas) || 0);

        await upsertRow('DOORDASH', 'Date', date, {
            Date: date,
            Hours: hours || 0,
            Revenue: revenue || 0,
            Tips: tips || 0,
            Gas: gas || 0,
            Miles: miles || 0,
            Gross: gross,
            Profit: profit,
            Notes: notes || '',
        });

        return NextResponse.json({ ok: true, profit, date });
    } catch (error) {
        console.error('DoorDash route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
