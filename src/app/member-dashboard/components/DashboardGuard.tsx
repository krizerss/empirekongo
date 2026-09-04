'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname || '/member-dashboard')}`;
      router.replace(loginUrl);
    }
  }, [isLoggedIn, loading, pathname, router]);

  if (loading || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
