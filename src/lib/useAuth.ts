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
  coverUrl?: string;
  isVerified?: boolean;
}

async function getRoleForUser(user: User): Promise<UserRole> {
  const supabase = createClient();
  const metadata = user.user_metadata ?? {};
  const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true }).eq('vendor_id', user.id);
  if (!error && (count ?? 0) > 0) return 'fournisseur';
  if (metadata.account_type === 'enterprise') return 'entreprise';
  return 'client';
}

function mapUser(user: User, role: UserRole, profile?: { avatar_url?: string | null; cover_url?: string | null }): AuthUser {
  const metadata = user.user_metadata ?? {};
  const name = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || 'Utilisateur';
  return {
    id: user.id,
    name,
    email: user.email ?? '',
    role,
    avatarUrl: profile?.avatar_url ?? metadata.avatar_url ?? undefined,
    coverUrl: profile?.cover_url ?? metadata.cover_url ?? undefined,
    isVerified: Boolean(user.email_confirmed_at),
  };
}

async function ensureProfile(user: User) {
  const supabase = createClient();
  const metadata = user.user_metadata ?? {};
  const fullName = [metadata.first_name, metadata.last_name].filter(Boolean).join(' ').trim() || user.email?.split('@')[0] || 'Utilisateur';
  const accountType = metadata.account_type === 'enterprise' ? 'enterprise' : 'individual';
  const { data, error } = await supabase.from('profiles').upsert({ id: user.id, email: user.email ?? '', full_name: fullName, phone: metadata.phone ?? '', account_type: accountType }, { onConflict: 'id' }).select('avatar_url,cover_url').single();
  if (error) {
    console.warn('Impossible de synchroniser le profil:', error.message);
    return null;
  }
  return data;
}

function updateNotificationBadges(count: number) {
  if (typeof document === 'undefined') return;
  document.querySelectorAll<HTMLElement>('.notification-badge').forEach((el) => {
    el.textContent = String(count);
    el.style.display = count > 0 ? '' : 'none';
  });
  const topBarBadge = document.querySelector<HTMLElement>('button[aria-label="Notifications"] span.absolute');
  if (topBarBadge) {
    topBarBadge.textContent = String(count);
    topBarBadge.style.display = count > 0 ? '' : 'none';
  }
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visiteur');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    let notificationChannel: ReturnType<typeof supabase.channel> | null = null;

    const syncNotificationCount = async (userId: string) => {
      const { count, error } = await supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false);
      if (!mounted) return;
      const nextCount = error ? 0 : count ?? 0;
      setUnreadNotifications(nextCount);
      updateNotificationBadges(nextCount);
    };

    const subscribeNotifications = (userId: string) => {
      notificationChannel?.unsubscribe();
      notificationChannel = supabase.channel(`notifications:${userId}`).on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, () => {
        void syncNotificationCount(userId);
      }).subscribe();
      void syncNotificationCount(userId);
    };

    const applyUser = async (authUser: User) => {
      const profile = await ensureProfile(authUser);
      const role = await getRoleForUser(authUser);
      if (!mounted) return;
      const mapped = mapUser(authUser, role, profile ?? undefined);
      setIsLoggedIn(true);
      setUserRole(mapped.role);
      setUser(mapped);
      setLoading(false);
      subscribeNotifications(authUser.id);
    };

    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) { setLoading(false); updateNotificationBadges(0); return; }
      if (data.user) await applyUser(data.user);
      else { setLoading(false); updateNotificationBadges(0); }
    }).catch(() => mounted && setLoading(false));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) void applyUser(session.user);
      else {
        notificationChannel?.unsubscribe();
        notificationChannel = null;
        setIsLoggedIn(false);
        setUserRole('visiteur');
        setUser(null);
        setUnreadNotifications(0);
        setLoading(false);
        updateNotificationBadges(0);
      }
    });

    return () => {
      mounted = false;
      notificationChannel?.unsubscribe();
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((userData: AuthUser) => { setIsLoggedIn(true); setUserRole(userData.role); setUser(userData); }, []);
  const logout = useCallback(async () => { const supabase = createClient(); await supabase.auth.signOut(); setIsLoggedIn(false); setUserRole('visiteur'); setUser(null); setUnreadNotifications(0); updateNotificationBadges(0); }, []);
  const hasRole = useCallback((...roles: UserRole[]) => roles.includes(userRole), [userRole]);

  return { isLoggedIn, userRole, user, loading, unreadNotifications, login, logout, hasRole };
}
