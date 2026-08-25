'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// NOTE: This file is intentionally renamed to _page.tsx (private, not scanned by Next.js router).
// The /auth/callback route is handled by route.ts in this same directory.
export default function AuthCallbackPage() {
  const router = useRouter();
  useEffect(() => {
    router?.replace('/auth/confirm');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">Redirection en cours…</p>
    </div>
  );
}
