import { NextRequest, NextResponse } from 'next/server';
import { upsertRow } from '@/lib/sheets';

export async function POST(req: NextRequest) {
    try {
        const {
            date,
            winProcess, winPersona, winMusic, winStory, winRest, winGrowth,
            mood, energy, highlights, challenges, gratitude, notes
        } = await req.json();
        if (!date) return NextResponse.json({ error: 'Date required' }, { status: 400 });

        const winCount = [winProcess, winPersona, winMusic, winStory, winRest, winGrowth].filter(Boolean).length;
        const entryId = `J${Date.now()}`;

        await upsertRow('JOURNAL', 'Date', date, {
            EntryID: entryId,
            Date: date,
            Win_Process: winProcess ? 'Yes' : '',
            Win_Persona: winPersona ? 'Yes' : '',
            Win_Music: winMusic ? 'Yes' : '',
            Win_Story: winStory ? 'Yes' : '',
            Win_Rest: winRest ? 'Yes' : '',
            Win_Growth: winGrowth ? 'Yes' : '',
            Mood: mood || 3,
            Energy: energy || 3,
            Highlights: highlights || '',
            Challenges: challenges || '',
            Gratitude: gratitude || '',
            Notes: notes || '',
            WinCount: winCount,
            UpdatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ ok: true, winCount, date });
    } catch (error) {
        console.error('Journal route error:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
