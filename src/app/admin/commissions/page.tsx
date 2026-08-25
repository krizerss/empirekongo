'use client';
import React, { useState } from 'react';
import { PercentBadgeIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, CheckCircleIcon, CurrencyDollarIcon, ChartBarIcon, ClockIcon,  } from '@heroicons/react/24/outline';
import Icon from '@/components/ui/AppIcon';


type CommissionStatus = 'payée' | 'en_attente' | 'annulée';

interface Commission {
  id: string;
  fournisseur: string;
  commande: string;
  montant_vente: number;
  taux: number;
  montant_commission: number;
  statut: CommissionStatus;
  date: string;
  periode: string;
}

const mockCommissions: Commission[] = [
  { id: 'COM-001', fournisseur: 'Ferme Kivu Bio', commande: 'CMD-001', montant_vente: 45000, taux: 2, montant_commission: 900, statut: 'payée', date: '2024-07-15', periode: 'Juillet 2024' },
  { id: 'COM-002', fournisseur: 'Textiles Kinshasa', commande: 'CMD-002', montant_vente: 28000, taux: 2, montant_commission: 560, statut: 'en_attente', date: '2024-07-18', periode: 'Juillet 2024' },
  { id: 'COM-003', fournisseur: 'Artisanat Kasaï', commande: 'CMD-004', montant_vente: 75000, taux: 2, montant_commission: 1500, statut: 'en_attente', date: '2024-07-21', periode: 'Juillet 2024' },
  { id: 'COM-004', fournisseur: 'Beauté Africaine', commande: 'CMD-005', montant_vente: 22000, taux: 2, montant_commission: 440, statut: 'annulée', date: '2024-07-10', periode: 'Juillet 2024' },
  { id: 'COM-005', fournisseur: 'Ferme Kivu Bio', commande: 'CMD-006', montant_vente: 72000, taux: 2, montant_commission: 1440, statut: 'payée', date: '2024-07-08', periode: 'Juillet 2024' },
  { id: 'COM-006', fournisseur: 'Textiles Kinshasa', commande: 'CMD-008', montant_vente: 24000, taux: 2, montant_commission: 480, statut: 'en_attente', date: '2024-07-22', periode: 'Juillet 2024' },
  { id: 'COM-007', fournisseur: 'Nkosi Imports', commande: 'CMD-007', montant_vente: 120000, taux: 2, montant_commission: 2400, statut: 'annulée', date: '2024-07-05', periode: 'Juillet 2024' },
];

const STATUS_CONFIG: Record<CommissionStatus, { label: string; cls: string }> = {
  payée:      { label: 'Payée',       cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  en_attente: { label: 'En attente',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  annulée:    { label: 'Annulée',     cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
};

const periodeData = [
  { mois: 'Avr', total: 18400 },
  { mois: 'Mai', total: 22100 },
  { mois: 'Juin', total: 31600 },
  { mois: 'Juil', total: 7720 },
];

export default function AdminCommissionsPage() {
  const [commissions] = useState<Commission[]>(mockCommissions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string } | null>(null);

  function showToast(msg: string) {
    setToast({ msg });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = commissions.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.id.toLowerCase().includes(q) || c.fournisseur.toLowerCase().includes(q) || c.commande.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || c.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPayé = commissions.filter(c => c.statut === 'payée').reduce((acc, c) => acc + c.montant_commission, 0);
  const totalEnAttente = commissions.filter(c => c.statut === 'en_attente').reduce((acc, c) => acc + c.montant_commission, 0);
  const totalVentes = commissions.reduce((acc, c) => acc + c.montant_vente, 0);

  const stats = [
    { label: 'Commissions payées', value: `${totalPayé.toLocaleString()} CDF`, color: 'text-green-400', icon: CheckCircleIcon },
    { label: 'En attente', value: `${totalEnAttente.toLocaleString()} CDF`, color: 'text-amber-400', icon: ClockIcon },
    { label: 'Volume total ventes', value: `${(totalVentes / 1000).toFixed(0)}k CDF`, color: 'text-primary', icon: CurrencyDollarIcon },
    { label: 'Taux moyen', value: '2%', color: 'text-cyan-400', icon: PercentBadgeIcon },
  ];

  const maxBar = Math.max(...periodeData.map(p => p.total));

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold bg-green-500/15 border-green-500/30 text-green-400">
          <CheckCircleIcon className="w-4 h-4" />
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Commissions</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Suivi des commissions (2%) sur les ventes de la plateforme</p>
        </div>
        <button
          onClick={() => showToast('Export CSV en cours de préparation…')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
        >
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
              <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Monthly chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="w-4 h-4 text-primary" />
          <h2 className="font-bold text-sm text-foreground">Commissions par mois (CDF)</h2>
        </div>
        <div className="flex items-end gap-4 h-24">
          {periodeData.map(p => (
            <div key={p.mois} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-muted-foreground font-semibold">{(p.total / 1000).toFixed(1)}k</span>
              <div
                className="w-full rounded-t-lg bg-primary/30 border-t-2 border-primary transition-all"
                style={{ height: `${(p.total / maxBar) * 72}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{p.mois}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Rechercher par ID, fournisseur ou commande…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as CommissionStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="payée">Payée</option>
            <option value="en_attente">En attente</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fournisseur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Commande</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Vente</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Commission (2%)</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Période</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <PercentBadgeIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucune commission trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map(c => {
                  const status = STATUS_CONFIG[c.statut];
                  return (
                    <tr key={c.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary">{c.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground text-sm">{c.fournisseur}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">{c.commande}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-foreground">{c.montant_vente.toLocaleString()} CDF</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-primary text-sm">{c.montant_commission.toLocaleString()} CDF</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{c.date}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-muted-foreground">{c.periode}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
