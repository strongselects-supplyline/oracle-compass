import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/sheets';

// 🛡️ Edge runtime for speed (if supported by googleapis, else Node)
// export const runtime = "edge";

export async function GET() {
    try {
        const [doordashData, salesData] = await Promise.all([
            getSheetData('DOORDASH'),
            getSheetData('SALES')
        ]);

        const cleanFloat = (val: any) => {
            if (typeof val === 'number') return val;
            if (!val) return 0;
            return parseFloat(String(val).replace(/[$,]/g, '')) || 0;
        };

        const doordash = doordashData.map((d: any) => ({
            date: d.Date,
            hours: cleanFloat(d.Hours),
            revenue: cleanFloat(d.Revenue),
            tips: cleanFloat(d.Tips),
            gas: cleanFloat(d.Gas),
            miles: cleanFloat(d.Miles),
            gross: cleanFloat(d.Gross),
            profit: cleanFloat(d.Profit),
            notes: d.Notes || ''
        }));

        const sales = salesData.map((s: any) => ({
            saleId: s.SaleID,
            date: s.Date,
            client: s.Client || '',
            product: s.Product || '',
            lbs: cleanFloat(s.Lbs),
            productCost: cleanFloat(s.ProductCost),
            shippingCost: cleanFloat(s.ShippingCost),
            revenue: cleanFloat(s.Revenue),
            profit: cleanFloat(s.Profit),
            notes: s.Notes || ''
        }));

        return NextResponse.json({
            doordash,
            sales
        });

    } catch (error) {
        console.error('Income route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
