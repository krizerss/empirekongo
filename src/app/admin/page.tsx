'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { UsersIcon, ShoppingBagIcon, CurrencyDollarIcon, ShoppingCartIcon, TruckIcon, CreditCardIcon, PercentBadgeIcon, ClockIcon, CheckCircleIcon, UserPlusIcon, FlagIcon, ShieldCheckIcon, ChevronRightIcon,  } from '@heroicons/react/24/outline';

// ─── Revenue Chart ─────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', value: 12400 },
  { month: 'Fév', value: 18900 },
  { month: 'Mar', value: 15200 },
  { month: 'Avr', value: 24700 },
  { month: 'Mai', value: 21300 },
  { month: 'Juin', value: 31800 },
  { month: 'Juil', value: 28500 },
];

function RevenueChart() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      pathRef.current?.classList.add('animated');
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const w = 560;
  const h = 180;
  const padX = 44;
  const padY = 16;
  const chartW = w - padX * 2;
  const chartH = h - padY * 2 - 20;
  const maxVal = Math.max(...revenueData.map((d) => d.value));

  const points = revenueData.map((d, i) => ({
    x: padX + (i / (revenueData.length - 1)) * chartW,
    y: padY + chartH - (d.value / maxVal) * chartH,
  }));

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + p.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;
  const yLabels = [0, 8000, 16000, 24000, 32000];

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minWidth: 300 }}>
        <defs>
          <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A623" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yLabels.map((v) => {
          const y = padY + chartH - (v / maxVal) * chartH;
          return (
            <g key={v}>
              <line x1={padX} y1={y} x2={w - padX} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={padX - 6} y={y + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.3)">
                {v >= 1000 ? `${v / 1000}k` : v}
              </text>
            </g>
          );
        })}
        <path d={areaD} fill="url(#adminChartGrad)" />
        <path ref={pathRef} d={pathD} fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" className="chart-line-path" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#F5A623" stroke="#1A1A1A" strokeWidth="2" />
        ))}
        {revenueData.map((d, i) => (
          <text key={d.month} x={points[i].x} y={h - 2} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">
            {d.month}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── Activity Item ─────────────────────────────────────────────────────────────

interface ActivityItem {
  id: number;
  type: 'new_user' | 'new_supplier' | 'new_product' | 'new_transaction' | 'premium' | 'suspended' | 'reported';
  message: string;
  time: string;
}

const recentActivity: ActivityItem[] = [
  { id: 1, type: 'new_user',        message: 'Nouvel utilisateur : Jean Mutombo',          time: 'Il y a 5 min' },
  { id: 2, type: 'new_transaction', message: 'Transaction TXN-001 — 45 000 CDF',           time: 'Il y a 12 min' },
  { id: 3, type: 'new_product',     message: 'Produit en attente : Café Robusta Premium',  time: 'Il y a 28 min' },
  { id: 4, type: 'premium',         message: 'Abonnement Premium : Marie Lukusa',          time: 'Il y a 1h' },
  { id: 5, type: 'new_supplier',    message: 'Nouveau fournisseur : Ferme Kivu Bio',       time: 'Il y a 2h' },
  { id: 6, type: 'reported',        message: 'Produit signalé : Téléphone Contrefait X',   time: 'Il y a 3h' },
  { id: 7, type: 'suspended',       message: 'Compte suspendu : Christophe Lunda',         time: 'Il y a 5h' },
];

const ACTIVITY_CONFIG: Record<ActivityItem['type'], { color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  new_user:        { color: 'text-blue-400',   bg: 'bg-blue-500/10',   icon: UserPlusIcon },
  new_supplier:    { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: TruckIcon },
  new_product:     { color: 'text-amber-400',  bg: 'bg-amber-500/10',  icon: ShoppingBagIcon },
  new_transaction: { color: 'text-primary',    bg: 'bg-primary/10',    icon: CurrencyDollarIcon },
  premium:         { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: CreditCardIcon },
  suspended:       { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: ShieldCheckIcon },
  reported:        { color: 'text-orange-400', bg: 'bg-orange-500/10', icon: FlagIcon },
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const kpis = [
    { label: 'Utilisateurs totaux',   value: '—',  sub: 'Données en direct',    icon: UsersIcon,         color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   href: '/admin/users' },
    { label: 'Fournisseurs actifs',   value: '—',  sub: 'Données en direct',    icon: TruckIcon,         color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  href: '/admin/suppliers' },
    { label: 'Produits publiés',      value: '—',  sub: 'Données en direct',    icon: ShoppingBagIcon,   color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  href: '/admin/products' },
    { label: 'Commandes actives',     value: '—',  sub: 'Données en direct',    icon: ShoppingCartIcon,  color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', href: '/admin/orders' },
    { label: 'Revenus (ce mois)',     value: '—',  sub: 'Connecter la base',     icon: CurrencyDollarIcon,color: 'text-primary',    bg: 'bg-primary/10',    border: 'border-primary/20',    href: '/admin/transactions' },
    { label: 'Commissions (2%)',      value: '—',  sub: 'Connecter la base',     icon: PercentBadgeIcon,  color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   href: '/admin/commissions' },
    { label: 'Abonnements Premium',   value: '—',  sub: 'Connecter la base',     icon: CreditCardIcon,    color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20',   href: '/admin/subscriptions' },
    { label: 'Signalements ouverts',  value: '3',  sub: 'À traiter',             icon: FlagIcon,          color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', href: '/admin/reports' },
  ];

  const quickLinks = [
    { label: 'Utilisateurs',       href: '/admin/users',         icon: UsersIcon },
    { label: 'Produits',           href: '/admin/products',      icon: ShoppingBagIcon },
    { label: 'Transactions',       href: '/admin/transactions',  icon: CurrencyDollarIcon },
    { label: 'Rôles',              href: '/admin/roles',         icon: ShieldCheckIcon },
    { label: 'Paramètres',         href: '/admin/settings',      icon: CheckCircleIcon },
    { label: 'Logs',               href: '/admin/logs',          icon: ClockIcon },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">
            Tableau de bord <span className="gold-text">Admin</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vue d'ensemble du marketplace EmpireKongo</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2">
          <ClockIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-400 font-semibold">KPIs en attente de connexion à la base Empire</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className={`bg-card border ${kpi.border} rounded-xl p-4 flex flex-col gap-3 hover:border-primary/40 transition-all group`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <ChevronRightIcon className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </div>
            <div>
              <p className={`text-xl font-extrabold ${kpi.value === '—' ? 'text-muted-foreground/40' : 'text-foreground'} leading-none mb-1`}>
                {kpi.value}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium">{kpi.label}</p>
            </div>
            <p className="text-[10px] text-muted-foreground/60">{kpi.sub}</p>
          </Link>
        ))}
      </div>

      {/* Revenue Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-sm text-foreground">Évolution des revenus</h2>
              <p className="text-xs text-muted-foreground">Données de démonstration — à connecter à la base Empire</p>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/25">
              Demo
            </span>
          </div>
          <RevenueChart />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-foreground">Activité récente</h2>
            <Link href="/admin/logs" className="text-[10px] text-primary hover:underline">Voir tout</Link>
          </div>
          <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto">
            {recentActivity.map((item) => {
              const cfg = ACTIVITY_CONFIG[item.type];
              const ItemIcon = cfg.icon;
              return (
                <div key={item.id} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <ItemIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-snug">{item.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h2 className="font-bold text-sm text-foreground mb-4">Accès rapide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/30 border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <link.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors text-center">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* DB Connection Notice */}
      <div className="bg-card border border-primary/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheckIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground mb-1">Architecture prête pour la base de données Empire</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le panneau admin est structuré pour se connecter à la base MySQL <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">Empire</code>. 
              Les KPIs affichent <strong>—</strong> jusqu'à la connexion des API routes. 
              Les tables utilisées : <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">utilisateurs</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">produits</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">commandes</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">transactions</code>, <code className="text-primary bg-primary/10 px-1 py-0.5 rounded text-[10px]">abonnements</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
