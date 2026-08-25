'use client';
import React, { useState } from 'react';
import { CreditCardIcon, MagnifyingGlassIcon, ArrowDownTrayIcon, CheckCircleIcon, XMarkIcon, UserCircleIcon, SparklesIcon, BuildingStorefrontIcon,  } from '@heroicons/react/24/outline';

type SubStatus = 'actif' | 'expiré' | 'annulé' | 'en_attente';
type SubPlan = 'gratuit' | 'premium' | 'business' | 'enterprise';

interface Subscription {
  id: string;
  utilisateur: string;
  email: string;
  plan: SubPlan;
  statut: SubStatus;
  debut: string;
  fin: string;
  montant: number;
  renouvellement: boolean;
}

const mockSubscriptions: Subscription[] = [
  { id: 'SUB-001', utilisateur: 'Marie Lukusa', email: 'marie.lukusa@empirekongo.cd', plan: 'premium', statut: 'actif', debut: '2024-01-01', fin: '2025-01-01', montant: 25000, renouvellement: true },
  { id: 'SUB-002', utilisateur: 'Patrick Kabila', email: 'p.kabila@gmail.com', plan: 'business', statut: 'actif', debut: '2024-03-15', fin: '2025-03-15', montant: 75000, renouvellement: true },
  { id: 'SUB-003', utilisateur: 'Jean Mutombo', email: 'jean.mutombo@gmail.com', plan: 'premium', statut: 'expiré', debut: '2023-06-01', fin: '2024-06-01', montant: 25000, renouvellement: false },
  { id: 'SUB-004', utilisateur: 'Amina Diallo', email: 'amina.diallo@gmail.com', plan: 'enterprise', statut: 'actif', debut: '2024-02-01', fin: '2025-02-01', montant: 150000, renouvellement: true },
  { id: 'SUB-005', utilisateur: 'Didier Nkosi', email: 'didier.nkosi@gmail.com', plan: 'premium', statut: 'annulé', debut: '2024-04-01', fin: '2024-07-01', montant: 25000, renouvellement: false },
  { id: 'SUB-006', utilisateur: 'Fatou Konaté', email: 'fatou.konate@gmail.com', plan: 'business', statut: 'actif', debut: '2024-05-10', fin: '2025-05-10', montant: 75000, renouvellement: true },
  { id: 'SUB-007', utilisateur: 'Robert Mbuyi', email: 'r.mbuyi@techcongo.cd', plan: 'premium', statut: 'en_attente', debut: '2024-07-20', fin: '2025-07-20', montant: 25000, renouvellement: false },
  { id: 'SUB-008', utilisateur: 'Sylvie Ntumba', email: 's.ntumba@gmail.com', plan: 'gratuit', statut: 'actif', debut: '2024-01-15', fin: '—', montant: 0, renouvellement: false },
];

const STATUS_CONFIG: Record<SubStatus, { label: string; cls: string }> = {
  actif:      { label: 'Actif',       cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  expiré:     { label: 'Expiré',      cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
  annulé:     { label: 'Annulé',      cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  en_attente: { label: 'En attente',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
};

const PLAN_CONFIG: Record<SubPlan, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  gratuit:    { label: 'Gratuit',    cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25',     icon: UserCircleIcon },
  premium:    { label: 'Premium',    cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25',  icon: SparklesIcon },
  business:   { label: 'Business',   cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25',     icon: BuildingStorefrontIcon },
  enterprise: { label: 'Enterprise', cls: 'bg-purple-500/15 text-purple-400 border-purple-500/25', icon: CreditCardIcon },
};

export default function AdminSubscriptionsPage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState<SubPlan | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<SubStatus | 'all'>('all');

  const filtered = subscriptions.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.utilisateur.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
    const matchPlan = planFilter === 'all' || s.plan === planFilter;
    const matchStatus = statusFilter === 'all' || s.statut === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const totalRevenu = subscriptions.filter(s => s.statut === 'actif').reduce((acc, s) => acc + s.montant, 0);
  const actifs = subscriptions.filter(s => s.statut === 'actif').length;
  const premium = subscriptions.filter(s => s.plan === 'premium' && s.statut === 'actif').length;
  const enterprise = subscriptions.filter(s => s.plan === 'enterprise' && s.statut === 'actif').length;

  const stats = [
    { label: 'Abonnements actifs', value: actifs, color: 'text-green-400' },
    { label: 'Premium actifs', value: premium, color: 'text-amber-400' },
    { label: 'Enterprise actifs', value: enterprise, color: 'text-purple-400' },
    { label: 'Revenu mensuel', value: `${(totalRevenu / 1000).toFixed(0)}k CDF`, color: 'text-primary' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Abonnements</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gérer les plans d'abonnement et les renouvellements</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          Exporter CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(PLAN_CONFIG) as SubPlan[]).map(plan => {
          const cfg = PLAN_CONFIG[plan];
          const PlanIcon = cfg.icon;
          const count = subscriptions.filter(s => s.plan === plan).length;
          const actifCount = subscriptions.filter(s => s.plan === plan && s.statut === 'actif').length;
          return (
            <div key={plan} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.cls.split(' ')[0]}`}>
                  <PlanIcon className={`w-4 h-4 ${cfg.cls.split(' ')[1]}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.cls}`}>{cfg.label}</span>
              </div>
              <p className="text-xl font-extrabold text-foreground">{count}</p>
              <p className="text-xs text-muted-foreground">{actifCount} actifs</p>
            </div>
          );
        })}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Rechercher par utilisateur ou email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={planFilter}
            onChange={e => setPlanFilter(e.target.value as SubPlan | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les plans</option>
            {(Object.keys(PLAN_CONFIG) as SubPlan[]).map(p => (
              <option key={p} value={p}>{PLAN_CONFIG[p].label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as SubStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="expiré">Expiré</option>
            <option value="annulé">Annulé</option>
            <option value="en_attente">En attente</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} abonnement{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Montant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Début</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Fin</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Renouvellement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <CreditCardIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucun abonnement trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const status = STATUS_CONFIG[s.statut];
                  const plan = PLAN_CONFIG[s.plan];
                  const PlanIcon = plan.icon;
                  return (
                    <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary">{s.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-foreground text-sm">{s.utilisateur}</p>
                          <p className="text-xs text-muted-foreground">{s.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${plan.cls}`}>
                          <PlanIcon className="w-3 h-3" />
                          {plan.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-bold text-foreground text-sm">
                          {s.montant > 0 ? `${s.montant.toLocaleString()} CDF` : 'Gratuit'}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{s.debut}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{s.fin}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {s.renouvellement ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-400">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Auto
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/40">
                            <XMarkIcon className="w-3.5 h-3.5" />
                            Manuel
                          </span>
                        )}
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
