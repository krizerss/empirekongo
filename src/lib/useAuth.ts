'use client';
import { useState, useEffect, useCallback } from 'react';

export type UserRole = 'visiteur' | 'client' | 'vendeur' | 'entreprise' | 'fournisseur' | 'affilie' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean;
}

const SESSION_KEY = 'ek_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function isSessionExpired(session: { createdAt?: number }): boolean {
  if (!session?.createdAt) return true;
  return Date.now() - session.createdAt > SESSION_TIMEOUT_MS;
}

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('visiteur');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!isSessionExpired(parsed)) {
          setIsLoggedIn(true);
          setUserRole(parsed?.role ?? 'client');
          setUser(parsed?.user ?? null);
        } else {
          // Expired — clear
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((userData: AuthUser) => {
    const session = {
      role: userData.role,
      user: userData,
      createdAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
    setUserRole('visiteur');
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles: UserRole[]) => roles.includes(userRole),
    [userRole]
  );

  return { isLoggedIn, userRole, user, loading, login, logout, hasRole };
}
