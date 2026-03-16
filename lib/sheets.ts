/**
 * lib/sheets.ts
 * Google Sheets connector — ported from 2026-release-dashboard/api/_sheets.js
 * READ-ONLY reference from Dashboard; all new code lives in oracle-compass.
 */

import { google } from 'googleapis';

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1ggM4jjZdvnkEEQJO0YAJMhVYPGLmS61QCGvuNfiswdE';

function getSheets() {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error('GOOGLE_CREDENTIALS environment variable not set');
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    // Fallback: handle escaped newlines or slightly malformed JSON
    try {
      credentials = JSON.parse(credentialsJson.replace(/\\n/g, '\n'));
    } catch {
      throw new Error('Failed to parse GOOGLE_CREDENTIALS — check Vercel env vars');
    }
  }

  if (credentials.private_key && typeof credentials.private_key === 'string') {
    credentials.private_key = (credentials.private_key as string).replace(/\\n/g, '\n');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

const SHEETS = {
  JOURNAL: { name: 'JOURNAL', headers: ['EntryID', 'Date', 'Win_Process', 'Win_Persona', 'Win_Music', 'Win_Story', 'Win_Rest', 'Win_Growth', 'Mood', 'Energy', 'Highlights', 'Challenges', 'Gratitude', 'Notes', 'WinCount', 'CreatedAt', 'UpdatedAt'] },
  HEALTH: { name: 'HEALTH', headers: ['Date', 'Weight', 'SleepHours', 'Workout', 'Mobility', 'Vocal', 'Protein', 'Steps', 'Pushups', 'Squats', 'FuelPre', 'FuelMid', 'FuelPost', 'Hydration', 'DairyFlag', 'Score', 'Notes'] },
  DOORDASH: { name: 'DOORDASH', headers: ['Date', 'Hours', 'Revenue', 'Tips', 'Gas', 'Miles', 'Gross', 'Profit', 'Notes'] },
  SALES: { name: 'SALES', headers: ['SaleID', 'Date', 'Client', 'Product', 'Lbs', 'ProductCost', 'ShippingCost', 'Revenue', 'Profit', 'Notes', 'CreatedAt', 'UpdatedAt'] },
  PRACTICE: { name: 'PRACTICE', headers: ['Date', 'Trataka', 'Breathwork', 'Meditation', 'Notes', 'UpdatedAt'] },
  FUEL: { name: 'FUEL', headers: ['Date', 'Fuel', 'Notes', 'UpdatedAt'] },
  STUDIO_SESSIONS: { name: 'STUDIO_SESSIONS', headers: ['Date', 'Track', 'Hours', 'SessionType', 'PhaseBefore', 'PhaseAfter', 'Quality', 'Notes', 'CreatedAt'] },
} as const;

type SheetKey = keyof typeof SHEETS;
type Row = Record<string, string | number | boolean>;

function rowToObject(headers: string[], row: (string | undefined)[]): Row {
  const obj: Row = {};
  headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
  return obj;
}

function objectToRow(headers: string[], obj: Row): (string | number | boolean)[] {
  return headers.map(h => obj[h] ?? '');
}

export async function getSheetData(sheetName: SheetKey): Promise<Row[]> {
  const sheets = getSheets();
  const config = SHEETS[sheetName];
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A:Z`,
    });
    const rows = response.data.values || [];
    if (rows.length <= 1) return [];
    const headers = rows[0] as string[];
    return rows.slice(1).map(row => rowToObject(headers, row as string[]));
  } catch {
    return [];
  }
}

export async function appendRow(sheetName: SheetKey, data: Row): Promise<{ ok: boolean }> {
  const sheets = getSheets();
  const config = SHEETS[sheetName];
  const headers = config.headers as unknown as string[];
  const row = objectToRow(headers, data);
  
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A:Z`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    });
  } catch (error: any) {
    if (error.message && error.message.includes('Unable to parse range')) {
      // Create the missing tab
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{ addSheet: { properties: { title: config.name } } }],
        },
      });
      // Set the headers
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${config.name}!A1:Z1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [headers] },
      });
      // Retry pending append
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${config.name}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      });
    } else {
      throw error;
    }
  }
  return { ok: true };
}

export async function upsertRow(sheetName: SheetKey, keyColumn: string, keyValue: string | number, data: Row): Promise<{ ok: boolean; updated?: boolean }> {
  const sheets = getSheets();
  const config = SHEETS[sheetName];

  let response;
  try {
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A:Z`,
    });
  } catch {
    return appendRow(sheetName, data);
  }

  const rows = (response.data.values || []) as (string | undefined)[][];

  if (rows.length === 0) {
    const configHeaders = config.headers as unknown as string[];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${config.name}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [configHeaders] },
    });
    return appendRow(sheetName, data);
  }

  const headers = rows[0] as string[];
  const keyIdx = headers.indexOf(keyColumn);
  if (keyIdx === -1) return appendRow(sheetName, data);

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][keyIdx] || '') === String(keyValue)) {
      const existingObj = rowToObject(headers, rows[i]);
      const newRow = objectToRow(headers, { ...existingObj, ...data });
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${config.name}!A${i + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [newRow] },
      });
      return { ok: true, updated: true };
    }
  }

  return appendRow(sheetName, data);
}

export { SHEETS };
