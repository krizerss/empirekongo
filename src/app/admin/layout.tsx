'use client';
import React, { useState, useEffect } from 'react';



import { HomeIcon, UsersIcon, TruckIcon, ShoppingBagIcon, ShoppingCartIcon, CurrencyDollarIcon, CreditCardIcon, PercentBadgeIcon, TagIcon, FlagIcon, BellIcon, ChartBarIcon, ShieldCheckIcon, Cog6ToothIcon, ClipboardDocumentListIcon,  } from '@heroicons/react/24/outline';


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
  return <>{children}</>;
}
