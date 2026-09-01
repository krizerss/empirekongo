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

async function getRoleForUser(user: User): Promise<UserRole> {
  const supabase = createClient();
  const metadata = user.user_metadata ?? {};

  // A user who has published at least one product is treated as a supplier.
  // Otherwise an authenticated individual remains a client. Enterprise
  // accounts keep their enterprise role until they have products, at which
  // point the supplier status takes precedence for the dashboard label.
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('vendor_id', user.id);

  if (!error && (count ?? 0) > 0) return 'fournisseur';
  if (metadata.account_type === 'enterprise') return 'entreprise';
  return 'client';
}

function mapUser(user: User, role: UserRole): AuthUser {
  const metadata = user.user_metadata ?? {};
  const name = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'Utilisateur';

  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role,
    avatarUrl: metadata.avatar_url,
    isVerified: Boolean(user.email_confirmed_at),
  };
}

async function ensureProfile(user: User) {
  const supabase = createClient();
  const metadata = user.user_metadata ?? {};
  const fullName = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ').trim() || user.email?.split('@')[0] || 'Utilisateur';
  const accountType = metadata.account_type === 'enterprise' ? 'enterprise' : 'individual';

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? '',
    full_name: fullName,
    phone: metadata.phone ?? '',
    account_type: accountType,
  }, { onConflict: 'id' });

  if (error) {
    console.warn('Impossible de synchroniser le profil:', error.message);
  }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visiteur');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const applyUser = async (authUser: User) => {
      await ensureProfile(authUser);
      const role = await getRoleForUser(authUser);
      if (!mounted) return;
      const mapped = mapUser(authUser, role);
      setIsLoggedIn(true);
      setUserRole(mapped.role);
      setUser(mapped);
      setLoading(false);
    };

    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setLoading(false);
        return;
      }
      if (data.user) {
        await applyUser(data.user);
      } else {
        setLoading(false);
      }
    }).catch(() => mounted && setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        void applyUser(session.user);
      } else {
        setIsLoggedIn(false);
        setUserRole('visiteur');
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((userData: AuthUser) => {
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