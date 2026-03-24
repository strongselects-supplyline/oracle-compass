import { NextResponse } from 'next/server';

// NOTE: Not using edge runtime — edge can return 405 on some Vercel deployments
// for simple GET routes. Node runtime is fine for a diagnostic endpoint.

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
