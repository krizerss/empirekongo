'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CurrencyDollarIcon, ShoppingCartIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, EllipsisHorizontalIcon, ShieldCheckIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon, FunnelIcon, PencilSquareIcon, NoSymbolIcon, PlayCircleIcon, ClipboardDocumentListIcon, XMarkIcon, ChevronDownIcon,  } from '@heroicons/react/24/outline';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';


// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'admin' | 'vendor' | 'member' | 'moderator' | 'support' | 'analyst';
type UserStatus = 'active' | 'suspended' | 'inactive';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastSeen: string;
  joined: string;
  avatar: string;
}

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  detail: string;
  time: string;
  type: 'role_change' | 'suspend' | 'activate' | 'login' | 'order' | 'product';
}

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
  { id: 'CMD-8821', buyer: 'Jean Mutombo', product: 'Café Robusta Premium 1kg', amount: 4500, status: 'completed', time: 'Il y a 12 min', avatar: 'JM' },
  { id: 'CMD-8820', buyer: 'Marie Lukusa', product: 'Tissu Wax Authentique', amount: 12000, status: 'processing', time: 'Il y a 28 min', avatar: 'ML' },
  { id: 'CMD-8819', buyer: 'Patrick Kabila', product: 'Huile de Palme Rouge 5L', amount: 3200, status: 'completed', time: 'Il y a 1h', avatar: 'PK' },
  { id: 'CMD-8818', buyer: 'Solange Mwamba', product: 'Artisanat Kasaï – Panier', amount: 7800, status: 'pending', time: 'Il y a 2h', avatar: 'SM' },
  { id: 'CMD-8817', buyer: 'Didier Nkosi', product: 'Manioc Séché 10kg', amount: 2100, status: 'cancelled', time: 'Il y a 3h', avatar: 'DN' },
];

const topProducts = [
  { rank: 1, name: 'Café Robusta Premium', category: 'Alimentation', sales: 342, revenue: 1539000, trend: 'up' },
  { rank: 2, name: 'Tissu Wax Authentique', category: 'Mode & Textile', sales: 218, revenue: 2616000, trend: 'up' },
  { rank: 3, name: 'Huile de Palme Rouge', category: 'Alimentation', sales: 195, revenue: 624000, trend: 'down' },
  { rank: 4, name: 'Artisanat Kasaï', category: 'Artisanat', sales: 167, revenue: 1302600, trend: 'up' },
  { rank: 5, name: 'Manioc Séché 10kg', category: 'Alimentation', sales: 143, revenue: 300300, trend: 'down' },
];

const initialUsers: AdminUser[] = [
  { id: 1, name: 'Administrateur Principal', email: 'admin@empirekongo.cd', role: 'admin', status: 'active', lastSeen: 'En ligne', joined: '2023-01-15', avatar: 'AP' },
  { id: 2, name: 'Modérateur Contenu', email: 'moderateur@empirekongo.cd', role: 'moderator', status: 'active', lastSeen: 'Il y a 5 min', joined: '2023-03-22', avatar: 'MC' },
  { id: 3, name: 'Support Client', email: 'support@empirekongo.cd', role: 'support', status: 'active', lastSeen: 'Il y a 22 min', joined: '2023-05-10', avatar: 'SC' },
  { id: 4, name: 'Analyste Données', email: 'analytics@empirekongo.cd', role: 'analyst', status: 'inactive', lastSeen: 'Il y a 2 jours', joined: '2023-07-01', avatar: 'AD' },
  { id: 5, name: 'Jean-Pierre Mbeki', email: 'jp.mbeki@empirekongo.cd', role: 'vendor', status: 'active', lastSeen: 'Il y a 1h', joined: '2023-09-14', avatar: 'JM' },
  { id: 6, name: 'Amina Diallo', email: 'amina.d@empirekongo.cd', role: 'member', status: 'active', lastSeen: 'Il y a 3h', joined: '2024-01-08', avatar: 'AD' },
  { id: 7, name: 'Christophe Lunda', email: 'c.lunda@empirekongo.cd', role: 'vendor', status: 'suspended', lastSeen: 'Il y a 5 jours', joined: '2023-11-20', avatar: 'CL' },
  { id: 8, name: 'Fatou Konaté', email: 'f.konate@empirekongo.cd', role: 'member', status: 'active', lastSeen: 'Il y a 30 min', joined: '2024-02-17', avatar: 'FK' },
];

const initialLogs: ActivityLog[] = [
  { id: 1, userId: 1, action: 'Connexion admin', detail: 'Connexion depuis Kinshasa, DRC', time: 'Il y a 2 min', type: 'login' },
  { id: 2, userId: 7, action: 'Compte suspendu', detail: 'Violation des CGU – produits contrefaits', time: 'Il y a 1h', type: 'suspend' },
  { id: 3, userId: 5, action: 'Rôle modifié', detail: 'member → vendor', time: 'Il y a 3h', type: 'role_change' },
  { id: 4, userId: 6, action: 'Nouveau membre', detail: 'Inscription validée', time: 'Il y a 5h', type: 'activate' },
  { id: 5, userId: 2, action: 'Produit approuvé', detail: 'Café Robusta Premium – validé', time: 'Il y a 6h', type: 'product' },
  { id: 6, userId: 3, action: 'Commande traitée', detail: 'CMD-8819 – résolu', time: 'Il y a 8h', type: 'order' },
  { id: 7, userId: 4, action: 'Compte réactivé', detail: 'Réactivation manuelle par admin', time: 'Hier', type: 'activate' },
  { id: 8, userId: 8, action: 'Rôle modifié', detail: 'member → vendor', time: 'Hier', type: 'role_change' },
];

// ─── Revenue Chart ─────────────────────────────────────────────────────────────

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

// ─── Role Badge ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: UserRole }) {
  const map: Record<UserRole, { label: string; cls: string }> = {
    admin:     { label: 'Admin',      cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
    vendor:    { label: 'Vendeur',    cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    member:    { label: 'Membre',     cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    moderator: { label: 'Modérateur', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
    support:   { label: 'Support',    cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
    analyst:   { label: 'Analyste',   cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  };
  const r = map[role];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${r.cls}`}>
      {r.label}
    </span>
  );
}

// ─── User Status Pill ──────────────────────────────────────────────────────────

function UserStatusPill({ status }: { status: UserStatus }) {
  if (status === 'active')    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-400"><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />Actif</span>;
  if (status === 'suspended') return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />Suspendu</span>;
  return <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 inline-block" />Inactif</span>;
}

// ─── Log Type Icon ─────────────────────────────────────────────────────────────

function LogTypeIcon({ type }: { type: ActivityLog['type'] }) {
  const map: Record<ActivityLog['type'], { icon: React.ComponentType<{ className?: string }>; cls: string }> = {
    role_change: { icon: PencilSquareIcon,         cls: 'text-amber-400 bg-amber-500/10' },
    suspend:     { icon: NoSymbolIcon,              cls: 'text-red-400 bg-red-500/10' },
    activate:    { icon: PlayCircleIcon,            cls: 'text-green-400 bg-green-500/10' },
    login:       { icon: ShieldCheckIcon,           cls: 'text-blue-400 bg-blue-500/10' },
    order:       { icon: ShoppingCartIcon,          cls: 'text-purple-400 bg-purple-500/10' },
    product:     { icon: ClipboardDocumentListIcon, cls: 'text-cyan-400 bg-cyan-500/10' },
  };
  const { icon: Icon, cls } = map[type];
  return (
    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${cls}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
  );
}

// ─── Role Dropdown ─────────────────────────────────────────────────────────────

const ASSIGNABLE_ROLES: { value: UserRole; label: string }[] = [
  { value: 'admin',     label: 'Admin' },
  { value: 'vendor',    label: 'Vendeur' },
  { value: 'member',    label: 'Membre' },
  { value: 'moderator', label: 'Modérateur' },
  { value: 'support',   label: 'Support' },
  { value: 'analyst',   label: 'Analyste' },
];

function RoleDropdown({ userId, currentRole, onAssign }: { userId: number; currentRole: UserRole; onAssign: (id: number, role: UserRole) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary transition-colors text-[10px] font-semibold text-muted-foreground hover:text-foreground"
        title="Changer le rôle"
      >
        <PencilSquareIcon className="w-3 h-3" />
        Rôle
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[130px]">
          {ASSIGNABLE_ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => { onAssign(userId, r.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/60 transition-colors flex items-center justify-between ${r.value === currentRole ? 'text-primary font-bold' : 'text-foreground'}`}
            >
              {r.label}
              {r.value === currentRole && <CheckCircleIcon className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const [activeOrders] = useState(47);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [logs, setLogs] = useState<ActivityLog[]>(initialLogs);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [showLogs, setShowLogs] = useState(false);
  const [logUserId, setLogUserId] = useState<number | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const displayedLogs = logUserId ? logs.filter((l) => l.userId === logUserId) : logs;
  const logUser = logUserId ? users.find((u) => u.id === logUserId) : null;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleRoleAssign(userId: number, newRole: UserRole) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const oldRole = user.role;
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    setLogs((prev) => [
      {
        id: Date.now(),
        userId,
        action: 'Rôle modifié',
        detail: `${oldRole} → ${newRole}`,
        time: 'À l\'instant',
        type: 'role_change',
      },
      ...prev,
    ]);
  }

  function handleToggleStatus(userId: number) {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const newStatus: UserStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status: newStatus } : u));
    setLogs((prev) => [
      {
        id: Date.now(),
        userId,
        action: newStatus === 'suspended' ? 'Compte suspendu' : 'Compte réactivé',
        detail: newStatus === 'suspended' ? 'Suspension manuelle par admin' : 'Réactivation manuelle par admin',
        time: 'À l\'instant',
        type: newStatus === 'suspended' ? 'suspend' : 'activate',
      },
      ...prev,
    ]);
  }

  function openLogs(userId?: number) {
    setLogUserId(userId ?? null);
    setShowLogs(true);
  }

  const stats = [
    { label: 'Revenu Total', value: '152 800 $', sub: '+23.4% ce mois', trend: 'up', icon: CurrencyDollarIcon, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
    { label: 'Commandes Actives', value: String(activeOrders), sub: '12 en attente', trend: 'up', icon: ShoppingCartIcon, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Ventes ce mois', value: '1 284', sub: '+8.1% vs mois dernier', trend: 'up', icon: ArrowTrendingUpIcon, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Utilisateurs', value: String(users.length), sub: `${users.filter((u) => u.status === 'active').length} actifs`, trend: 'neutral', icon: ShieldCheckIcon, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-dark border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0 flex items-center gap-2">
              <AppImage src="/assets/empirekongo-logo.svg" alt="EmpireKongo Logo" width={32} height={32} className="w-8 h-8" unoptimized={true} />
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
            <Link href="/" className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
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
          <p className="text-sm text-muted-foreground">Vue d'ensemble du marketplace EmpireKongo — supervision complète</p>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-card border ${s.border} rounded-xl p-5 flex flex-col gap-3 card-hover`}>
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
              <p className={`text-[11px] font-semibold flex items-center gap-1 ${s.trend === 'up' ? 'text-green-400' : s.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'}`}>
                {s.trend === 'up' && <ArrowTrendingUpIcon className="w-3.5 h-3.5" />}
                {s.trend === 'down' && <ArrowTrendingDownIcon className="w-3.5 h-3.5" />}
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Recent Sales */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-foreground">Évolution des revenus</h2>
                <p className="text-xs text-muted-foreground">7 derniers mois (en USD)</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">+23.4%</span>
            </div>
            <RevenueChart />
          </div>

          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-foreground">Ventes récentes</h2>
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">Aujourd'hui</span>
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
                  <p className="text-xs font-bold text-primary shrink-0">{sale.amount.toLocaleString()} FC</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card border border-border rounded-xl p-5">
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
                    <td className="py-3 text-right font-semibold text-primary">{p.revenue.toLocaleString()} FC</td>
                    <td className="py-3 text-right">
                      {p.trend === 'up' ? (
                        <span className="inline-flex items-center gap-0.5 text-green-400 font-semibold"><ArrowTrendingUpIcon className="w-3.5 h-3.5" /> Hausse</span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-red-400 font-semibold"><ArrowTrendingDownIcon className="w-3.5 h-3.5" /> Baisse</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── User Management ─────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-xl p-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-bold text-sm text-foreground">Gestion des utilisateurs</h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} affiché{filteredUsers.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => openLogs()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:border-primary/40 bg-secondary/50 hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ClipboardDocumentListIcon className="w-3.5 h-3.5" />
                Journaux d'activité
              </button>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
                className="pl-7 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Tous les rôles</option>
                {ASSIGNABLE_ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as UserStatus | 'all')}
                className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspended">Suspendu</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 text-muted-foreground font-semibold">Utilisateur</th>
                  <th className="text-left pb-3 text-muted-foreground font-semibold hidden sm:table-cell">Email</th>
                  <th className="text-left pb-3 text-muted-foreground font-semibold">Rôle</th>
                  <th className="text-left pb-3 text-muted-foreground font-semibold">Statut</th>
                  <th className="text-left pb-3 text-muted-foreground font-semibold hidden md:table-cell">Dernière activité</th>
                  <th className="text-right pb-3 text-muted-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted-foreground text-xs">
                      Aucun utilisateur trouvé pour cette recherche.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      {/* User */}
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                            {u.avatar}
                          </div>
                          <span className="font-semibold text-foreground truncate max-w-[120px]">{u.name}</span>
                        </div>
                      </td>
                      {/* Email */}
                      <td className="py-3 pr-3 hidden sm:table-cell text-muted-foreground truncate max-w-[160px]">{u.email}</td>
                      {/* Role */}
                      <td className="py-3 pr-3"><RoleBadge role={u.role} /></td>
                      {/* Status */}
                      <td className="py-3 pr-3"><UserStatusPill status={u.status} /></td>
                      {/* Last seen */}
                      <td className="py-3 pr-3 hidden md:table-cell text-muted-foreground/70">{u.lastSeen}</td>
                      {/* Actions */}
                      <td className="py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Role assignment */}
                          <RoleDropdown userId={u.id} currentRole={u.role} onAssign={handleRoleAssign} />
                          {/* Suspend / Activate */}
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            title={u.status === 'suspended' ? 'Réactiver le compte' : 'Suspendre le compte'}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold transition-colors ${
                              u.status === 'suspended' ?'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20' :'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {u.status === 'suspended' ? (
                              <><PlayCircleIcon className="w-3 h-3" />Activer</>
                            ) : (
                              <><NoSymbolIcon className="w-3 h-3" />Suspendre</>
                            )}
                          </button>
                          {/* Activity logs */}
                          <button
                            onClick={() => openLogs(u.id)}
                            title="Voir les journaux"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ClipboardDocumentListIcon className="w-3 h-3" />
                            Logs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ── Activity Logs Drawer ──────────────────────────────────────────────── */}
      {showLogs && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogs(false)} />
          {/* Panel */}
          <div className="relative ml-auto w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {logUser ? `Logs — ${logUser.name}` : 'Journaux d\'activité'}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{displayedLogs.length} entrée{displayedLogs.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                {logUserId && (
                  <button
                    onClick={() => setLogUserId(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground border border-border px-2 py-1 rounded-lg transition-colors"
                  >
                    Tous les logs
                  </button>
                )}
                <button onClick={() => setShowLogs(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Log list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {displayedLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-xs gap-2">
                  <ClipboardDocumentListIcon className="w-8 h-8 opacity-30" />
                  Aucune activité enregistrée.
                </div>
              ) : (
                displayedLogs.map((log) => {
                  const logOwner = users.find((u) => u.id === log.userId);
                  return (
                    <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                      <LogTypeIcon type={log.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-foreground truncate">{log.action}</p>
                          <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap shrink-0">{log.time}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">{log.detail}</p>
                        {!logUserId && logOwner && (
                          <p className="text-[10px] text-muted-foreground/50 mt-1">par {logOwner.name}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
