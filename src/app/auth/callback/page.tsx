import { redirect } from 'next/navigation';

interface Props {
  searchParams: Promise<{ code?: string; next?: string; error?: string }>;
}

export default async function AuthCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params.code) qs.set('code', params.code);
  if (params.next) qs.set('next', params.next);
  if (params.error) qs.set('error', params.error);
  const query = qs.toString();
  redirect(`/api/auth/callback${query ? `?${query}` : ''}`);
}
