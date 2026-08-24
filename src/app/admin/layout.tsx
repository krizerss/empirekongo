'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  PercentBadgeIcon,
  TagIcon,
  FlagIcon,
  BellIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/useAuth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: HomeIcon },
  { label: 'Utilisateurs', href: '/admin/users', icon: UsersIcon },
  { label: 'Fournisseurs', href: '/admin/suppliers', icon: TruckIcon },
  { label: 'Produits', href: '/admin/products', icon: ShoppingBagIcon },
  { label: 'Commandes', href: '/admin/orders', icon: ShoppingCartIcon },
  { label: 'Transactions', href: '/admin/transactions', icon: CurrencyDollarIcon },
  { label: 'Abonnements', href: '/admin/subscriptions', icon: CreditCardIcon },
  { label: 'Commissions', href: '/admin/commissions', icon: PercentBadgeIcon },
  { label: 'Catégories', href: '/admin/categories', icon: TagIcon },
  { label: 'Signalements', href: '/admin/reports', icon: FlagIcon, badge: 3 },
  { label: 'Notifications', href: '/admin/notifications', icon: BellIcon },
  { label: 'Statistiques', href: '/admin/analytics', icon: ChartBarIcon },
  { label: 'Rôles & Permissions', href: '/admin/roles', icon: ShieldCheckIcon },
  { label: 'Paramètres', href: '/admin/settings', icon: Cog6ToothIcon },
  { label: 'Logs de sécurité', href: '/admin/logs', icon: ClipboardDocumentListIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userRole, user, logout, loading } = useAuth();

  // Admin access guard
  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.replace('/login?redirect=/admin');
        return;
      }
      if (userRole !== 'admin') {
        router.replace('/member-dashboard');
      }
    }
  }, [isLoggedIn, userRole, loading, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Vérification des accès…</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || userRole !== 'admin') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <AppImage
              src="/assets/empirekongo-logo.svg"
              alt="EmpireKongo Admin"
              width={32}
              height={32}
              className="w-8 h-8 drop-shadow-[0_0_6px_rgba(245,166,35,0.5)]"
              unoptimized={true}
            />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-sm tracking-tight text-foreground">EMPIREKONGO</span>
              <span className="text-[9px] text-primary font-semibold tracking-widest uppercase">Administration</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  active
                    ? 'bg-primary/15 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRightIcon className="w-3 h-3 text-primary shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Profile + Logout */}
        <div className="border-t border-border p-3 space-y-2 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/40">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <UserCircleIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user?.name ?? 'Administrateur'}</p>
              <p className="text-[10px] text-primary font-medium">Super Admin</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              ← Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-3.5 h-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 glass-dark border-b border-border h-16 flex items-center px-4 sm:px-6 gap-4 shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm hidden sm:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Rechercher…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="flex-1 lg:hidden" />

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Notifications bell */}
            <Link
              href="/admin/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </Link>

            {/* Admin badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              Admin
            </span>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
