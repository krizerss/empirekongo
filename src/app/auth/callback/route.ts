import { redirect } from 'next/navigation';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, request.url));
  }

  if (code) {
    const qs = new URLSearchParams();
    qs.set('code', code);
    if (next) qs.set('next', next);
    return NextResponse.redirect(new URL(`/api/auth/callback?${qs.toString()}`, request.url));
  }

  return NextResponse.redirect(new URL('/login', request.url));
}
