import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  searchParams: Promise<{ code?: string; next?: string; error?: string }>;
}

export default async function AuthCallbackPage({ searchParams }: Props) {
  const params = await searchParams;

  if (params.error) {
    redirect(`/login?error=${encodeURIComponent(params.error)}`);
  }

  if (params.code) {
    const qs = new URLSearchParams();
    qs.set('code', params.code);
    if (params.next) qs.set('next', params.next);
    redirect(`/api/auth/callback?${qs.toString()}`);
  }

  redirect('/login');
}
