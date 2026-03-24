import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasGoogleSheetId = !!process.env.GOOGLE_SHEET_ID;
  const hasGoogleCredentials = !!process.env.GOOGLE_CREDENTIALS;

  return NextResponse.json({
    status: 'ok',
    environment: {
      anthropicKeySet: hasAnthropic,
      googleSheetIdSet: hasGoogleSheetId,
      googleCredentialsSet: hasGoogleCredentials,
    },
    message: 'Health check completed. Use this to verify Vercel environment variables without leaking secrets.'
  }, { status: 200 });
}
