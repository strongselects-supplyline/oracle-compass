// lib/db.ts
// IndexedDB wrapper for Oracle Compass data persistence

const DB_NAME = 'OracleCompassDB';
const DB_VERSION = 1;
const STORE_NAME = 'compass_store';

export type DailyLog = {
    date: string; // YYYY-MM-DD
    sovereigntyStack: boolean;
    movement: boolean;
    eucalyptusStream: boolean;

    sauna: boolean; // only relevant Mon/Wed/Fri
    sleep: number | null;
    pushups: number | null;
    oneThing: string;
    journalLine: string;
    completedAt: string | null;
    // Fuel tracking
    fuelPreSession: boolean;
    fuelMidSession: boolean;
    fuelPostSession: boolean;
    fuelHydration: number | null; // 1-5
    fuelDairyFlag: boolean; // true = dairy within 2hrs of vocals (anti-pattern)
    caffeineCutoff: boolean; // check if caffeine stopped by 1PM
    trataka: boolean; // 5-10m candle gazing before bed
    proteinAtMeals: boolean; // ensures tyrosine for dopamine processing
    // Session intelligence
    sessionQuality: number | null; // 1-5 (1=struggled, 3=solid, 5=flow state)
    sessionType: string; // 'recording' | 'mixing' | 'mastering' | 'writing' | ''
    // Life balance
    personalTime: boolean; // did you take real personal/social/recovery time today?
    personalTimeQuality: number | null; // 1-3: 1=passive scroll, 2=light activity, 3=restorative (walk/GF/nature)
    batchPrepDone: boolean; // Sunday batch prep completed (only relevant on Sundays)
    // Performance Conditioning (414 Day prep)
    conditioningType: string; // 'zone2' | 'vo2max' | 'anaerobic' | 'dance_walkthrough' | 'dance_fullout' | ''
    conditioningMinutes: number | null;
    // Fuel quality signal (Day One protocol)
    proteinQuality: number | null; // 1-3: 1=minimal/skip, 2=adequate, 3=high (full protein meals)
};

export type StreakData = {
    sobrietyStart: '2026-04-02'; // HARDCODED — real day one
    movementStreak: number;
    saunaStreak: number;
    lastMovementDate: string;
    lastSaunaDate: string;
};

export type DailyTelemetry = {
    doordash_earned: number;
    doordash_month: string; // YYYY-MM — auto-resets on month boundary
};

// Singleton DB promise
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
    if (typeof window === 'undefined') return Promise.reject('SSR: IndexedDB missing');

    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, Math.max(DB_VERSION, 1));
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                const db = request.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
        });
    }
    return dbPromise;
}

export async function getStoreValue<T>(key: string): Promise<T | null> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result ? request.result : null);
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error('getStoreValue error', e);
        return null;
    }
}

export async function getAllWithPrefix<T>(prefix: string): Promise<Record<string, T>> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.openCursor();
            const results: Record<string, T> = {};

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
                if (cursor) {
                    if (cursor.key.toString().startsWith(prefix)) {
                        results[cursor.key.toString()] = cursor.value;
                    }
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error('getAllWithPrefix error', e);
        return {};
    }
}

export async function setStoreValue<T>(key: string, value: T): Promise<void> {
    try {
        const db = await getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error('setStoreValue error', e);
    }
}

export async function logLabelCost(amount: number): Promise<void> {
    const current = (await getStoreValue<number>('label_total_cost')) || 0;
    await setStoreValue('label_total_cost', current + amount);
}

// Helpers
export function getTodayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getCurrentMonth(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export async function getDailyLog(date: string = getTodayISO()): Promise<DailyLog> {
    const log = await getStoreValue<DailyLog>(`daily_log:${date}`);
    if (log) return { ...getDefaultLog(date), ...log };
    return getDefaultLog(date);
}

function getDefaultLog(date: string): DailyLog {
    return {
        date,
        sovereigntyStack: false,
        movement: false,
        eucalyptusStream: false,

        sauna: false,
        sleep: null,
        pushups: null,
        oneThing: '',
        journalLine: '',
        completedAt: null,
        fuelPreSession: false,
        fuelMidSession: false,
        fuelPostSession: false,
        fuelHydration: null,
        fuelDairyFlag: false,
        caffeineCutoff: false,
        trataka: false,
        proteinAtMeals: false,
        sessionQuality: null,
        sessionType: '',
        personalTime: false,
        personalTimeQuality: null,
        batchPrepDone: false,
        conditioningType: '',
        conditioningMinutes: null,
        proteinQuality: null,
    };
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
    await setStoreValue(`daily_log:${log.date}`, log);
}

export async function getStreakData(): Promise<StreakData> {
    const data = await getStoreValue<StreakData>('streaks');
    if (data) return data;
    return {
        sobrietyStart: '2026-04-02',
        movementStreak: 0,
        saunaStreak: 0,
        lastMovementDate: '',
        lastSaunaDate: ''
    };
}

export async function saveStreakData(data: StreakData): Promise<void> {
    await setStoreValue('streaks', data);
}

export async function getDailyTelemetry(): Promise<DailyTelemetry> {
    const data = await getStoreValue<DailyTelemetry>('daily_telemetry');
    const currentMonth = getCurrentMonth();

    if (data) {
        // Month boundary auto-reset
        if (data.doordash_month && data.doordash_month !== currentMonth) {
            // Archive previous month
            const historyKey = `dd_history:${data.doordash_month}`;
            await setStoreValue(historyKey, data.doordash_earned);
            // Reset for new month
            const fresh: DailyTelemetry = { doordash_earned: 0, doordash_month: currentMonth };
            await setStoreValue('daily_telemetry', fresh);
            return fresh;
        }
        // Backfill month field for existing data
        if (!data.doordash_month) {
            data.doordash_month = currentMonth;
            await setStoreValue('daily_telemetry', data);
        }
        return data;
    }
    return { doordash_earned: 0, doordash_month: currentMonth };
}

export async function saveDailyTelemetry(data: DailyTelemetry): Promise<void> {
    await setStoreValue('daily_telemetry', data);
}

// ── Task Completion Log (silent audit trail) ────────────────────────

export type TaskCompletionEntry = {
    taskId: string;
    title: string;
    pillar: string;
    urgency: string;
    clearedAt: string;  // ISO timestamp
    dayOfWeek: number;  // 0-6 (Sun-Sat)
};

export async function logTaskCompletion(entry: TaskCompletionEntry): Promise<void> {
    const key = 'task_completion_log';
    const log = (await getStoreValue<TaskCompletionEntry[]>(key)) || [];
    log.push(entry);
    await setStoreValue(key, log);
}

export async function getCompletionLog(): Promise<TaskCompletionEntry[]> {
    return (await getStoreValue<TaskCompletionEntry[]>('task_completion_log')) || [];
}

// ── Realignment Audit Trail (append-only) ──────────────────────────
// Every Oracle realignment is logged with full context so we can debug
// "why did this release shift?" or "what was triggering RED severity?"

export type RealignmentAuditEntry = {
    type: string;             // realignment type (shift_release, flag_action, etc.)
    reason: string;           // Oracle's stated reason
    decree_severity: string;  // GREEN / AMBER / RED
    oracle_message: string;   // the 1-2 sentence decree message
    executedAt: string;       // ISO timestamp
};

export async function logRealignmentAudit(entry: RealignmentAuditEntry): Promise<void> {
    const key = 'realignment_audit_log';
    const log = (await getStoreValue<RealignmentAuditEntry[]>(key)) || [];
    log.push(entry);
    await setStoreValue(key, log);
}

export async function getRealignmentAuditLog(): Promise<RealignmentAuditEntry[]> {
    return (await getStoreValue<RealignmentAuditEntry[]>('realignment_audit_log')) || [];
}
