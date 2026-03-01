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
    ateBefore: boolean;
    sauna: boolean; // only relevant Mon/Wed/Fri
    sleep: number | null;
    pushups: number | null;
    oneThing: string;
    journalLine: string;
    completedAt: string | null;
};

export type StreakData = {
    sobrietyStart: '2026-02-28'; // HARDCODED — never changes
    movementStreak: number;
    saunaStreak: number;
    lastMovementDate: string;
    lastSaunaDate: string;
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

// Helpers
export function getTodayISO(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getDailyLog(date: string = getTodayISO()): Promise<DailyLog> {
    const log = await getStoreValue<DailyLog>(`daily_log:${date}`);
    if (log) return log;
    return {
        date,
        sovereigntyStack: false,
        movement: false,
        eucalyptusStream: false,
        ateBefore: false,
        sauna: false,
        sleep: null,
        pushups: null,
        oneThing: '',
        journalLine: '',
        completedAt: null
    };
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
    await setStoreValue(`daily_log:${log.date}`, log);
}

export async function getStreakData(): Promise<StreakData> {
    const data = await getStoreValue<StreakData>('streaks');
    if (data) return data;
    return {
        sobrietyStart: '2026-02-28',
        movementStreak: 0,
        saunaStreak: 0,
        lastMovementDate: '',
        lastSaunaDate: ''
    };
}

export async function saveStreakData(data: StreakData): Promise<void> {
    await setStoreValue('streaks', data);
}
