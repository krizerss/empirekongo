'use client';
import React, { useState } from 'react';
import { CreditCardIcon, ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon, PlusIcon, BanknotesIcon, DevicePhoneMobileIcon, ArrowPathIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon, EyeSlashIcon,  } from '@heroicons/react/24/outline';

type TxType = 'credit' | 'debit';
type TxStatus = 'success' | 'pending' | 'failed';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  method: string;
  reference: string;
}

const transactions: Transaction[] = [
  { id: 'TXN-001', date: '18 Juil 2024, 10:32', description: 'Paiement commande CMD-2024-001', amount: 225000, type: 'credit', status: 'success', method: 'M-Pesa', reference: 'MP-78452631' },
  { id: 'TXN-002', date: '17 Juil 2024, 09:15', description: 'Retrait gains affiliation', amount: 45750, type: 'debit', status: 'success', method: 'Airtel Money', reference: 'AM-12365478' },
  { id: 'TXN-003', date: '16 Juil 2024, 14:00', description: 'Paiement commande CMD-2024-003', amount: 3600000, type: 'credit', status: 'pending', method: 'Virement bancaire', reference: 'VB-98745632' },
  { id: 'TXN-004', date: '15 Juil 2024, 11:00', description: 'Abonnement Premium mensuel', amount: 15000, type: 'debit', status: 'success', method: 'M-Pesa', reference: 'MP-45632178' },
  { id: 'TXN-005', date: '14 Juil 2024, 08:45', description: 'Paiement commande CMD-2024-005', amount: 425000, type: 'credit', status: 'failed', method: 'Orange Money', reference: 'OM-32165478' },
  { id: 'TXN-006', date: '13 Juil 2024, 16:20', description: 'Commission vente produit', amount: 12500, type: 'credit', status: 'success', method: 'Portefeuille EmpireKongo', reference: 'EK-65478932' },
  { id: 'TXN-007', date: '12 Juil 2024, 13:10', description: 'Frais de publication annonce', amount: 5000, type: 'debit', status: 'success', method: 'M-Pesa', reference: 'MP-78965412' },
];

const statusConfig: Record<TxStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  success: { label: 'Réussi', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: CheckCircleIcon },
  pending: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: ClockIcon },
  failed: { label: 'Échoué', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', icon: XCircleIcon },
};

const paymentMethods = [
  { name: 'M-Pesa', number: '+243 81X XXX XXX', icon: DevicePhoneMobileIcon, color: 'bg-red-500/10 text-red-400', primary: true },
  { name: 'Airtel Money', number: '+243 99X XXX XXX', icon: DevicePhoneMobileIcon, color: 'bg-orange-500/10 text-orange-400', primary: false },
];

function formatCDF(amount: number) {
  return new Intl.NumberFormat('fr-CD').format(amount) + ' CDF';
}

export default function PaiementsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TxType | 'all'>('all');
  const [balanceVisible, setBalanceVisible] = useState(true);

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalCredits = transactions.filter((t) => t.type === 'credit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const totalDebits = transactions.filter((t) => t.type === 'debit' && t.status === 'success').reduce((s, t) => s + t.amount, 0);
  const balance = totalCredits - totalDebits;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-foreground mb-1">Paiements</h1>
          <p className="text-sm text-muted-foreground">Gérez vos transactions et méthodes de paiement.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
          <PlusIcon className="w-4 h-4" />
          Ajouter un moyen de paiement
        </button>
      </div>

      {/* Balance card + stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Balance */}
        <div className="lg:col-span-1 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Solde disponible</p>
            <button
              onClick={() => setBalanceVisible((v) => !v)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              {balanceVisible ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-3xl font-extrabold text-foreground mb-4">
            {balanceVisible ? formatCDF(balance) : '••••••• CDF'}
          </p>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground py-2 rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
              <ArrowUpIcon className="w-3.5 h-3.5" />
              Retirer
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-secondary border border-border text-foreground py-2 rounded-lg text-xs font-bold hover:border-primary/40 transition-colors">
              <ArrowDownIcon className="w-3.5 h-3.5" />
              Recharger
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-green-400/10 flex items-center justify-center">
                <ArrowDownIcon className="w-3.5 h-3.5 text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground">Entrées</p>
            </div>
            <p className="text-xl font-extrabold text-green-400">{formatCDF(totalCredits)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Ce mois</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-red-400/10 flex items-center justify-center">
                <ArrowUpIcon className="w-3.5 h-3.5 text-red-400" />
              </div>
              <p className="text-xs text-muted-foreground">Sorties</p>
            </div>
            <p className="text-xl font-extrabold text-red-400">{formatCDF(totalDebits)}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Ce mois</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-2">Transactions</p>
            <p className="text-xl font-extrabold text-foreground">{transactions.length}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Ce mois</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-muted-foreground mb-2">En attente</p>
            <p className="text-xl font-extrabold text-yellow-400">
              {transactions.filter((t) => t.status === 'pending').length}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Transactions</p>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="bg-card border border-border rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Méthodes de paiement</h3>
          </div>
          <button className="text-xs text-primary hover:underline">+ Ajouter</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {paymentMethods.map((method) => (
            <div key={method.name} className="flex items-center gap-3 p-3 rounded-lg bg-secondary border border-border">
              <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center shrink-0`}>
                <method.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{method.name}</p>
                  {method.primary && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
                      Principal
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{method.number}</p>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Modifier
              </button>
            </div>
          ))}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary/40 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <BanknotesIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Virement bancaire</p>
              <p className="text-xs text-muted-foreground/60">Ajouter un compte</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TxStatus | 'all')}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="all">Tous statuts</option>
                <option value="success">Réussi</option>
                <option value="pending">En attente</option>
                <option value="failed">Échoué</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as TxType | 'all')}
                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="all">Tous types</option>
                <option value="credit">Entrées</option>
                <option value="debit">Sorties</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Transaction</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Méthode</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-right px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Montant</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => {
                const sc = statusConfig[tx.status];
                const StatusIcon = sc.icon;
                return (
                  <tr key={tx.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.type === 'credit' ? 'bg-green-400/10' : 'bg-red-400/10'
                        }`}>
                          {tx.type === 'credit'
                            ? <ArrowDownIcon className="w-4 h-4 text-green-400" />
                            : <ArrowUpIcon className="w-4 h-4 text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{tx.description}</p>
                          <p className="text-[10px] text-muted-foreground">{tx.id} · {tx.reference}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground hidden sm:table-cell">{tx.method}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground hidden md:table-cell">{tx.date}</td>
                    <td className="px-5 py-3">
                      <span className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit ${sc.bg} ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>
                    <td className={`px-5 py-3 text-right text-xs font-bold ${
                      tx.type === 'credit' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}{formatCDF(tx.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <ArrowPathIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucune transaction trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
