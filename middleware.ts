import { NextRequest, NextResponse } from 'next/server';

const KAMI_COOKIE = 'kami_session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only gate /kami routes — not /api/kami/auth (login endpoint must be public)
  if (!pathname.startsWith('/kami')) return NextResponse.next();
  if (pathname === '/kami/login') return NextResponse.next();

  const session = req.cookies.get(KAMI_COOKIE)?.value;
  const expected = process.env.KAMI_PASSWORD;

  if (!expected || session !== expected) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/kami/login';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/kami/:path*'],
};
