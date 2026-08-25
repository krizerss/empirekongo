'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/confirm');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">Redirection en cours…</p>
    </div>
  );
}
