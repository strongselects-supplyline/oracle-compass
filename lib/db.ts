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
    // Session intelligence
    sessionQuality: number | null; // 1-5 (1=struggled, 3=solid, 5=flow state)
    sessionType: string; // 'recording' | 'mixing' | 'mastering' | 'writing' | ''
    // Life balance
    personalTime: boolean; // did you take real personal/social/recovery time today?
    batchPrepDone: boolean; // Sunday batch prep completed (only relevant on Sundays)
    // Performance Conditioning (414 Day prep)
    conditioningType: string; // 'zone2' | 'vo2max' | 'anaerobic' | 'dance_walkthrough' | 'dance_fullout' | ''
    conditioningMinutes: number | null;
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
        sessionQuality: null,
        sessionType: '',
        personalTime: false,
        batchPrepDone: false,
        conditioningType: '',
        conditioningMinutes: null,
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
    if (data) return data;
    return {
        doordash_earned: 0
    };
}

export async function saveDailyTelemetry(data: DailyTelemetry): Promise<void> {
    await setStoreValue('daily_telemetry', data);
}
