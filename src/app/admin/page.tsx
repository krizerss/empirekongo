'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CurrencyDollarIcon, ShoppingCartIcon, UsersIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon, ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,  } from '@heroicons/react/24/outline';
import AppImage from '@/components/ui/AppImage';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Jan', value: 12400 },
  { month: 'Fév', value: 18900 },
  { month: 'Mar', value: 15200 },
  { month: 'Avr', value: 24700 },
  { month: 'Mai', value: 21300 },
  { month: 'Juin', value: 31800 },
  { month: 'Juil', value: 28500 },
];

const recentSales = [
  {
    id: 'CMD-8821',
    buyer: 'Jean Mutombo',
    product: 'Café Robusta Premium 1kg',
    amount: 4500,
    status: 'completed',
    time: 'Il y a 12 min',
    avatar: 'JM',
  },
  {
    id: 'CMD-8820',
    buyer: 'Marie Lukusa',
    product: 'Tissu Wax Authentique',
    amount: 12000,
    status: 'processing',
    time: 'Il y a 28 min',
    avatar: 'ML',
  },
  {
    id: 'CMD-8819',
    buyer: 'Patrick Kabila',
    product: 'Huile de Palme Rouge 5L',
    amount: 3200,
    status: 'completed',
    time: 'Il y a 1h',
    avatar: 'PK',
  },
  {
    id: 'CMD-8818',
    buyer: 'Solange Mwamba',
    product: 'Artisanat Kasaï – Panier',
    amount: 7800,
    status: 'pending',
    time: 'Il y a 2h',
    avatar: 'SM',
  },
  {
    id: 'CMD-8817',
    buyer: 'Didier Nkosi',
    product: 'Manioc Séché 10kg',
    amount: 2100,
    status: 'cancelled',
    time: 'Il y a 3h',
    avatar: 'DN',
  },
];

const topProducts = [
  { rank: 1, name: 'Café Robusta Premium', category: 'Alimentation', sales: 342, revenue: 1539000, trend: 'up' },
  { rank: 2, name: 'Tissu Wax Authentique', category: 'Mode & Textile', sales: 218, revenue: 2616000, trend: 'up' },
  { rank: 3, name: 'Huile de Palme Rouge', category: 'Alimentation', sales: 195, revenue: 624000, trend: 'down' },
  { rank: 4, name: 'Artisanat Kasaï', category: 'Artisanat', sales: 167, revenue: 1302600, trend: 'up' },
  { rank: 5, name: 'Manioc Séché 10kg', category: 'Alimentation', sales: 143, revenue: 300300, trend: 'down' },
];

const adminUsers = [
  { name: 'Administrateur Principal', email: 'admin@empirekongo.cd', role: 'Super Admin', status: 'active', lastSeen: 'En ligne' },
  { name: 'Modérateur Contenu', email: 'moderateur@empirekongo.cd', role: 'Modérateur', status: 'active', lastSeen: 'Il y a 5 min' },
  { name: 'Support Client', email: 'support@empirekongo.cd', role: 'Support', status: 'active', lastSeen: 'Il y a 22 min' },
  { name: 'Analyste Données', email: 'analytics@empirekongo.cd', role: 'Analyste', status: 'inactive', lastSeen: 'Il y a 2 jours' },
];

// ─── Revenue Chart ─────────────────────────────────────────────────────────────

function RevenueChart() {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);

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
        {yLabels.map((v, i) => {
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
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="#F5A623"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="chart-line-path"
        />
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

// ─── Status Badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
    completed: { label: 'Complété', cls: 'bg-green-500/15 text-green-400 border-green-500/25', icon: CheckCircleIcon },
    processing: { label: 'En cours', cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25', icon: ClockIcon },
    pending: { label: 'En attente', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: ExclamationTriangleIcon },
    cancelled: { label: 'Annulé', cls: 'bg-red-500/15 text-red-400 border-red-500/25', icon: XCircleIcon },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.cls}`}>
      <s.icon className="w-3 h-3" />
      {s.label}
    </span>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeOrders] = useState(47);

  const stats = [
    {
      label: 'Revenu Total',
      value: '152 800 $',
      sub: '+23.4% ce mois',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    {
      label: 'Commandes Actives',
      value: String(activeOrders),
      sub: '12 en attente',
      trend: 'up',
      icon: ShoppingCartIcon,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
    },
    {
      label: 'Ventes ce mois',
      value: '1 284',
      sub: '+8.1% vs mois dernier',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
    },
    {
      label: 'Utilisateurs Admin',
      value: String(adminUsers.length),
      sub: `${adminUsers.filter((u) => u.status === 'active').length} actifs`,
      trend: 'neutral',
      icon: ShieldCheckIcon,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <AppImage
                src="/assets/empirekongo-logo.svg"
                alt="EmpireKongo Logo"
                width={32}
                height={32}
                className="w-8 h-8"
                unoptimized={true}
              />
              <span className="hidden sm:inline font-extrabold text-base tracking-tight text-foreground">EMPIREKONGO</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-muted-foreground/40 text-sm">/</span>
              <span className="text-sm font-semibold text-foreground">Administration</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25 text-red-400 text-xs font-semibold">
              <ShieldCheckIcon className="w-3.5 h-3.5" />
              Super Admin
            </span>
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              ← Retour au site
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-foreground mb-1">
            Tableau de bord <span className="gold-text">Administrateur</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble du marketplace EmpireKongo — supervision complète
          </p>
        </div>

        {/* KPI Stats — Bento asymmetric */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`bg-card border ${s.border} rounded-xl p-5 flex flex-col gap-3 card-hover`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <EllipsisHorizontalIcon className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground leading-none mb-1">{s.value}</p>
                <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
              </div>
              <p
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  s.trend === 'up' ?'text-green-400'
                    : s.trend === 'down' ?'text-red-400' :'text-muted-foreground'
                }`}
              >
                {s.trend === 'up' && <ArrowTrendingUpIcon className="w-3.5 h-3.5" />}
                {s.trend === 'down' && <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart — spans 3 cols */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-foreground">Évolution des revenus</h2>
                <p className="text-xs text-muted-foreground">7 derniers mois (en USD)</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                +23.4%
              </span>
            </div>
            <RevenueChart />
          </div>

          {/* Recent Sales — spans 2 cols */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-foreground">Ventes récentes</h2>
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                Aujourd'hui
              </span>
            </div>
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground">
                    {sale.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{sale.buyer}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{sale.product}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={sale.status} />
                      <span className="text-[10px] text-muted-foreground/60">{sale.time}</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-primary shrink-0">
                    {sale.amount.toLocaleString()} FC
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products + Admin Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Products — spans 2 cols */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-foreground">Meilleurs produits</h2>
              <span className="text-[10px] text-muted-foreground">Ce mois</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-muted-foreground font-semibold w-8">#</th>
                    <th className="text-left pb-3 text-muted-foreground font-semibold">Produit</th>
                    <th className="text-right pb-3 text-muted-foreground font-semibold">Ventes</th>
                    <th className="text-right pb-3 text-muted-foreground font-semibold">Revenu</th>
                    <th className="text-right pb-3 text-muted-foreground font-semibold">Tendance</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p) => (
                    <tr key={p.rank} className="border-b border-border/40 last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="py-3 text-muted-foreground/60 font-bold">{p.rank}</td>
                      <td className="py-3">
                        <p className="font-semibold text-foreground">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{p.category}</p>
                      </td>
                      <td className="py-3 text-right font-semibold text-foreground">{p.sales}</td>
                      <td className="py-3 text-right font-semibold text-primary">
                        {p.revenue.toLocaleString()} FC
                      </td>
                      <td className="py-3 text-right">
                        {p.trend === 'up' ? (
                          <span className="inline-flex items-center gap-0.5 text-green-400 font-semibold">
                            <ArrowTrendingUpIcon className="w-3.5 h-3.5" /> Hausse
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-red-400 font-semibold">
                            <ArrowTrendingDownIcon className="w-3.5 h-3.5" /> Baisse
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Users — spans 1 col */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-foreground">Utilisateurs Admin</h2>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {adminUsers.length} total
              </span>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {adminUsers.map((u, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <UsersIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{u.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span className="text-[9px] text-muted-foreground/60 whitespace-nowrap">{u.lastSeen}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {adminUsers.filter((u) => u.status === 'active').length} actifs sur {adminUsers.length}
              </span>
              <div className="flex gap-1">
                {adminUsers.map((u, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
