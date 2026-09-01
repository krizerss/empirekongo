import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const protectedPath = pathname.startsWith('/member-dashboard') || pathname.startsWith('/dashboard');

  if (protectedPath && (authError || !user)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.search = '';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (protectedPath && user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id,is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile || profile.is_active !== true) {
      await supabase.auth.signOut();
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/login';
      loginUrl.search = '';
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'session_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  if ((pathname === '/login' || pathname === '/register') && user) {
    const profileResult = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (!profileResult.error && profileResult.data?.is_active === true) {
      const redirect = request.nextUrl.searchParams.get('redirect');
      const destination = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/member-dashboard';
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return response;
}
