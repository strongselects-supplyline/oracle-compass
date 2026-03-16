import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let key = match[1];
        let value = match[2].trim();
        // Remove surrounding quotes if any
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        
        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
  }
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '1ggM4jjZdvnkEEQJO0YAJMhVYPGLmS61QCGvuNfiswdE';

async function main() {
  const credentialsJson = process.env.GOOGLE_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error('GOOGLE_CREDENTIALS environment variable not set');
  }

  let credentials: Record<string, unknown>;
  try {
    credentials = JSON.parse(credentialsJson);
  } catch {
    try {
      credentials = JSON.parse(credentialsJson.replace(/\\n/g, '\n'));
    } catch {
      throw new Error('Failed to parse GOOGLE_CREDENTIALS');
    }
  }
  
  if (credentials.private_key && typeof credentials.private_key === 'string') {
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Adding STUDIO_SESSIONS sheet to spreadsheet', SPREADSHEET_ID);

  try {
    // 1. Add Sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: 'STUDIO_SESSIONS',
              },
            },
          },
        ],
      },
    });
    console.log('Sheet added successfully.');
  } catch (error: any) {
    console.log('Error adding sheet (might already exist):', error.message);
  }

  try {
    // 2. Set headers
    const headers = ['Date', 'Track', 'Hours', 'SessionType', 'PhaseBefore', 'PhaseAfter', 'Quality', 'Notes', 'CreatedAt'];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'STUDIO_SESSIONS!A1:I1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });
    console.log('Headers set successfully.');
  } catch (error: any) {
    console.log('Error setting headers:', error.message);
  }
}

main().catch(console.error);
