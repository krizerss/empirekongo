'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase?.auth?.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router?.replace('/member-dashboard');
      } else if (event === 'PASSWORD_RECOVERY') {
        router?.replace('/auth/reset-password');
      }
    });

    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
      if (session) {
        router?.replace('/member-dashboard');
      }
    });

    return () => subscription?.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Connexion en cours...</p>
      </div>
    </div>
  );
}
