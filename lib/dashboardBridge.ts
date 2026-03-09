// lib/dashboardBridge.ts
// Native bridge to /api/income. Replaces deprecated Vercel fetch.

import type { IncomeSnapshot } from "@/lib/oracle";

const FETCH_TIMEOUT_MS = 5000;

type DashboardDoordashEntry = {
    date: string;
    hours: number;
    revenue: number;
    tips: number;
    gas: number;
    miles: number;
    gross: number;
    profit: number;
    notes: string;
};

type DashboardSalesEntry = {
    saleId: string;
    date: string;
    client: string;
    product: string;
    lbs: number;
    productCost: number;
    shippingCost: number;
    revenue: number;
    profit: number;
    notes: string;
};

type DashboardResponse = {
    doordash: DashboardDoordashEntry[];
    sales: DashboardSalesEntry[];
};

/** Get ISO week key like "2026-W10" for a given date */
function isoWeekKey(d: Date): string {
    const copy = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    );
    copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay() || 7));
    const year = copy.getUTCFullYear();
    const week = Math.ceil(
        ((copy.getTime() - Date.UTC(year, 0, 1)) / 86400000 + 1) / 7
    );
    return `${year}-W${String(week).padStart(2, "0")}`;
}

/** Get the set of ISO week keys for the current + previous N weeks */
function weekKeysWindow(weeksBack: number): Set<string> {
    const keys = new Set<string>();
    for (let i = 0; i <= weeksBack; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i * 7);
        keys.add(isoWeekKey(d));
    }
    return keys;
}

/**
 * Fetch live income data securely from the native API endpoint.
 * Returns IncomeSnapshot if successful, null on any error.
 */
export async function fetchDashboardIncome(): Promise<IncomeSnapshot | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        const res = await fetch(`/api/income`, {
            signal: controller.signal,
            headers: { Accept: "application/json" },
        });
        clearTimeout(timeout);

        if (!res.ok) return null;

        const data: DashboardResponse = await res.json();

        const currentWeek = isoWeekKey(new Date());
        const monthKeys = weekKeysWindow(3); // current + 3 previous = 4-week window

        // ── DoorDash aggregation ───────────────────────────────
        let shiftsThisWeek = 0;
        let earningsThisWeek = 0;
        let earningsThisMonth = 0;

        for (const entry of data.doordash || []) {
            const entryDate = new Date(entry.date);
            if (isNaN(entryDate.getTime())) continue;

            const entryWeek = isoWeekKey(entryDate);

            if (entryWeek === currentWeek) {
                shiftsThisWeek++;
                earningsThisWeek += entry.profit || 0;
            }

            if (monthKeys.has(entryWeek)) {
                earningsThisMonth += entry.profit || 0;
            }
        }

        // ── SS Sales aggregation ───────────────────────────────
        let ssRevenueThisWeek = 0;

        for (const entry of data.sales || []) {
            const entryDate = new Date(entry.date);
            if (isNaN(entryDate.getTime())) continue;

            if (isoWeekKey(entryDate) === currentWeek) {
                ssRevenueThisWeek += entry.revenue || 0;
            }
        }

        return {
            doordashShiftsThisWeek: shiftsThisWeek,
            doordashEarningsThisWeek: earningsThisWeek,
            doordashEarningsThisMonth: earningsThisMonth,
            ssRevenueThisWeek,
        };
    } catch {
        // Network error, timeout, parse error — silent fallback
        return null;
    }
}
