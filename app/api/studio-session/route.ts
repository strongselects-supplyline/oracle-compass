// app/api/studio-session/route.ts
// Persists studio session logs to Google Sheets.

import { NextResponse } from 'next/server';
import { appendRow } from '@/lib/sheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, trackName, hours, sessionType, phaseBefore, phaseAfter, quality, notes } = body;

    if (!date || !trackName || hours === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await appendRow('STUDIO_SESSIONS', {
      Date: date,
      Track: trackName,
      Hours: hours,
      SessionType: sessionType || '',
      PhaseBefore: phaseBefore || '',
      PhaseAfter: phaseAfter || '',
      Quality: quality || '',
      Notes: notes || '',
      CreatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Studio session API error:', error);
    return NextResponse.json({ error: 'Failed to log session' }, { status: 500 });
  }
}
