'use client';
import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

type TxStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'orange_money' | 'mpesa' | 'airtel_money' | 'visa' | 'cash' | 'virement';

interface Transaction {
  id: string;
  utilisateur: string;
  montant: number;
  devise: string;
  methode: PaymentMethod;
  commission: number;
  statut: TxStatus;
  date: string;
  reference: string;
}

const COMMISSION_RATE = 0.02; // 2% — taux centralisé

const mockTransactions: Transaction[] = [
  { id: 'TXN-001', utilisateur: 'Jean Mutombo', montant: 45000, devise: 'CDF', methode: 'orange_money', commission: 45000 * COMMISSION_RATE, statut: 'completed', date: '2024-04-15 14:32', reference: 'OM-8821-KIN' },
  { id: 'TXN-002', utilisateur: 'Marie Lukusa', montant: 120000, devise: 'CDF', methode: 'mpesa', commission: 120000 * COMMISSION_RATE, statut: 'completed', date: '2024-04-15 13:15', reference: 'MP-8820-KIN' },
  { id: 'TXN-003', utilisateur: 'Patrick Kabila', montant: 32000, devise: 'CDF', methode: 'airtel_money', commission: 32000 * COMMISSION_RATE, statut: 'pending', date: '2024-04-15 12:00', reference: 'AM-8819-KIN' },
  { id: 'TXN-004', utilisateur: 'Solange Mwamba', montant: 78000, devise: 'CDF', methode: 'visa', commission: 78000 * COMMISSION_RATE, statut: 'completed', date: '2024-04-14 18:45', reference: 'VS-8818-KIN' },
  { id: 'TXN-005', utilisateur: 'Didier Nkosi', montant: 21000, devise: 'CDF', methode: 'cash', commission: 21000 * COMMISSION_RATE, statut: 'failed', date: '2024-04-14 16:20', reference: 'CS-8817-KIN' },
  { id: 'TXN-006', utilisateur: 'Amina Diallo', montant: 55000, devise: 'CDF', methode: 'orange_money', commission: 55000 * COMMISSION_RATE, statut: 'refunded', date: '2024-04-14 10:05', reference: 'OM-8816-KIN' },
  { id: 'TXN-007', utilisateur: 'Christophe Lunda', montant: 18500, devise: 'CDF', methode: 'mpesa', commission: 18500 * COMMISSION_RATE, statut: 'completed', date: '2024-04-13 09:30', reference: 'MP-8815-KIN' },
  { id: 'TXN-008', utilisateur: 'Fatou Konaté', montant: 95000, devise: 'CDF', methode: 'virement', commission: 95000 * COMMISSION_RATE, statut: 'pending', date: '2024-04-13 08:15', reference: 'VR-8814-KIN' },
];

const STATUS_CONFIG: Record<TxStatus, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  completed: { label: 'Complété',   cls: 'bg-green-500/15 text-green-400 border-green-500/25',  icon: CheckCircleIcon },
  pending:   { label: 'En attente', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25',  icon: ClockIcon },
  failed:    { label: 'Échoué',     cls: 'bg-red-500/15 text-red-400 border-red-500/25',        icon: XCircleIcon },
  refunded:  { label: 'Remboursé',  cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25',     icon: ExclamationTriangleIcon },
};

const METHOD_CONFIG: Record<PaymentMethod, { label: string; color: string }> = {
  orange_money: { label: 'Orange Money', color: 'text-orange-400' },
  mpesa:        { label: 'M-Pesa',       color: 'text-green-400' },
  airtel_money: { label: 'Airtel Money', color: 'text-red-400' },
  visa:         { label: 'Visa',         color: 'text-blue-400' },
  cash:         { label: 'Cash',         color: 'text-muted-foreground' },
  virement:     { label: 'Virement',     color: 'text-purple-400' },
};

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');

  const filtered = mockTransactions.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.utilisateur.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.reference.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || t.statut === statusFilter;
    const matchMethod = methodFilter === 'all' || t.methode === methodFilter;
    return matchSearch && matchStatus && matchMethod;
  });

  const totalRevenu = mockTransactions.filter(t => t.statut === 'completed').reduce((s, t) => s + t.montant, 0);
  const totalCommissions = mockTransactions.filter(t => t.statut === 'completed').reduce((s, t) => s + t.commission, 0);
  const totalPending = mockTransactions.filter(t => t.statut === 'pending').length;

  const stats = [
    { label: 'Volume total', value: `${totalRevenu.toLocaleString()} CDF`, icon: CurrencyDollarIcon, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Commissions (2%)', value: `${totalCommissions.toLocaleString()} CDF`, icon: ArrowTrendingUpIcon, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'En attente', value: String(totalPending), icon: ClockIcon, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Transactions', value: String(mockTransactions.length), icon: CheckCircleIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Suivi de toutes les transactions financières — Commission : {(COMMISSION_RATE * 100).toFixed(0)}%</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors self-start">
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          Exporter CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-extrabold ${s.color} truncate`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur, ID ou référence…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground">
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="relative">
            <FunnelIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as TxStatus | 'all')}
              className="pl-7 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              {(Object.keys(STATUS_CONFIG) as TxStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value as PaymentMethod | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Toutes les méthodes</option>
            {(Object.keys(METHOD_CONFIG) as PaymentMethod[]).map(m => (
              <option key={m} value={m}>{METHOD_CONFIG[m].label}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ID / Référence</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Utilisateur</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Montant</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Commission (2%)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Méthode</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <CurrencyDollarIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map(t => {
                  const status = STATUS_CONFIG[t.statut];
                  const method = METHOD_CONFIG[t.methode];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={t.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-foreground">{t.id}</p>
                        <p className="text-[10px] text-muted-foreground">{t.reference}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-foreground">{t.utilisateur}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-bold text-primary">{t.montant.toLocaleString()} {t.devise}</span>
                      </td>
                      <td className="px-4 py-3 text-right hidden sm:table-cell">
                        <span className="text-xs font-semibold text-green-400">{t.commission.toLocaleString()} {t.devise}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-semibold ${method.color}`}>{method.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{t.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Voir détail">
                            <EyeIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
        <p className="text-xs text-primary font-semibold">
          ℹ️ Taux de commission actuel : <strong>2%</strong> sur chaque transaction complétée. 
          Ce taux est configurable dans <a href="/admin/settings" className="underline">Paramètres → Marketplace</a>.
        </p>
      </div>
    </div>
  );
}
