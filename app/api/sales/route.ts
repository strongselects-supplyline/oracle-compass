import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const { saleId, date, client, product, lbs, productCost, shippingCost, revenue, notes } = await req.json();
        if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

        const rev = parseFloat(revenue) || 0;
        const cost = (parseFloat(productCost) || 0) + (parseFloat(shippingCost) || 0);
        const profit = rev - cost;
        const id = saleId || `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        await upsertRow('SALES', 'SaleID', id, {
            SaleID: id,
            Date: date,
            Client: client || '',
            Product: product || '',
            Lbs: lbs || 0,
            ProductCost: productCost || 0,
            ShippingCost: shippingCost || 0,
            Revenue: rev,
            Profit: profit,
            Notes: notes || '',
            UpdatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ ok: true, id, profit });
    } catch (error) {
        console.error('Sales route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
