'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

export type UserRole = 'visiteur' | 'client' | 'vendeur' | 'entreprise' | 'fournisseur' | 'affilie' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean;
}

function mapUser(user: User): AuthUser {
  const metadata = user.user_metadata ?? {};
  const accountType = metadata.account_type === 'enterprise' ? 'entreprise' : 'client';
  const name = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'Utilisateur';

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role: accountType,
    avatarUrl: metadata.avatar_url,
    isVerified: Boolean(user.email_confirmed_at),
  };
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visiteur');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      if (data.user) {
        const mapped = mapUser(data.user);
        setIsLoggedIn(true);
        setUserRole(mapped.role);
        setUser(mapped);
      }
      setLoading(false);
    }).catch(() => mounted && setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const mapped = mapUser(session.user);
        setIsLoggedIn(true);
        setUserRole(mapped.role);
        setUser(mapped);
      } else {
        setIsLoggedIn(false);
        setUserRole('visiteur');
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((userData: AuthUser) => {
    // Kept for backwards compatibility with existing components.
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserRole('visiteur');
    setUser(null);
  }, []);

  const hasRole = useCallback((...roles: UserRole[]) => roles.includes(userRole), [userRole]);

  return { isLoggedIn, userRole, user, loading, login, logout, hasRole };
}
