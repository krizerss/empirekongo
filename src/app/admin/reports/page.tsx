'use client';
import React, { useState } from 'react';
import {
  FlagIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';

type ReportStatus = 'ouvert' | 'en_cours' | 'résolu' | 'rejeté';
type ReportType = 'produit' | 'utilisateur' | 'commentaire' | 'fournisseur';
type ReportReason = 'contenu_inapproprié' | 'arnaque' | 'contrefaçon' | 'spam' | 'harcèlement' | 'autre';

interface Report {
  id: string;
  type: ReportType;
  cible: string;
  signalé_par: string;
  raison: ReportReason;
  description: string;
  statut: ReportStatus;
  date: string;
  priorité: 'haute' | 'moyenne' | 'basse';
}

const mockReports: Report[] = [
  { id: 'SIG-001', type: 'produit', cible: 'Téléphone iPhone 15 Pro (Contrefait)', signalé_par: 'Jean Mutombo', raison: 'contrefaçon', description: 'Ce produit est clairement une contrefaçon. Les photos sont volées d\'un autre site.', statut: 'ouvert', date: '2024-07-22', priorité: 'haute' },
  { id: 'SIG-002', type: 'utilisateur', cible: 'Christophe Lunda', signalé_par: 'Marie Lukusa', raison: 'arnaque', description: 'Cet utilisateur m\'a demandé de payer en dehors de la plateforme et a disparu.', statut: 'en_cours', date: '2024-07-20', priorité: 'haute' },
  { id: 'SIG-003', type: 'commentaire', cible: 'Commentaire sur Café Robusta', signalé_par: 'Patrick Kabila', raison: 'spam', description: 'Ce commentaire contient des liens vers des sites externes suspects.', statut: 'ouvert', date: '2024-07-21', priorité: 'moyenne' },
  { id: 'SIG-004', type: 'produit', cible: 'Médicaments non homologués', signalé_par: 'Amina Diallo', raison: 'contenu_inapproprié', description: 'Vente de médicaments sans ordonnance, potentiellement dangereux.', statut: 'résolu', date: '2024-07-15', priorité: 'haute' },
  { id: 'SIG-005', type: 'fournisseur', cible: 'Nkosi Imports', signalé_par: 'Fatou Konaté', raison: 'arnaque', description: 'Commande jamais livrée, aucune réponse du fournisseur depuis 3 semaines.', statut: 'en_cours', date: '2024-07-18', priorité: 'haute' },
  { id: 'SIG-006', type: 'utilisateur', cible: 'Compte anonyme_xyz', signalé_par: 'Didier Nkosi', raison: 'harcèlement', description: 'Cet utilisateur envoie des messages harcelants à plusieurs membres.', statut: 'rejeté', date: '2024-07-10', priorité: 'basse' },
  { id: 'SIG-007', type: 'produit', cible: 'Huile de palme périmée', signalé_par: 'Solange Mwamba', raison: 'contenu_inapproprié', description: 'Le produit livré était périmé depuis 6 mois.', statut: 'ouvert', date: '2024-07-23', priorité: 'moyenne' },
];

const STATUS_CONFIG: Record<ReportStatus, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  ouvert:    { label: 'Ouvert',    cls: 'bg-red-500/15 text-red-400 border-red-500/25',       icon: FlagIcon },
  en_cours:  { label: 'En cours',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: ClockIcon },
  résolu:    { label: 'Résolu',    cls: 'bg-green-500/15 text-green-400 border-green-500/25', icon: CheckCircleIcon },
  rejeté:    { label: 'Rejeté',    cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25',    icon: XMarkIcon },
};

const TYPE_CONFIG: Record<ReportType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  produit:     { label: 'Produit',     icon: ShoppingBagIcon,    color: 'text-amber-400' },
  utilisateur: { label: 'Utilisateur', icon: UserCircleIcon,     color: 'text-blue-400' },
  commentaire: { label: 'Commentaire', icon: ChatBubbleLeftIcon, color: 'text-purple-400' },
  fournisseur: { label: 'Fournisseur', icon: ShieldCheckIcon,    color: 'text-green-400' },
};

const REASON_LABELS: Record<ReportReason, string> = {
  contenu_inapproprié: 'Contenu inapproprié',
  arnaque: 'Arnaque',
  contrefaçon: 'Contrefaçon',
  spam: 'Spam',
  harcèlement: 'Harcèlement',
  autre: 'Autre',
};

const PRIORITY_CONFIG = {
  haute:   { label: 'Haute',   cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  moyenne: { label: 'Moyenne', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  basse:   { label: 'Basse',   cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleStatusChange(id: string, newStatus: ReportStatus) {
    setReports(prev => prev.map(r => r.id === id ? { ...r, statut: newStatus } : r));
    showToast(`Signalement ${id} mis à jour.`);
  }

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.cible.toLowerCase().includes(q) || r.signalé_par.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.statut === statusFilter;
    const matchType = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = [
    { label: 'Total', value: reports.length, color: 'text-foreground' },
    { label: 'Ouverts', value: reports.filter(r => r.statut === 'ouvert').length, color: 'text-red-400' },
    { label: 'En cours', value: reports.filter(r => r.statut === 'en_cours').length, color: 'text-amber-400' },
    { label: 'Résolus', value: reports.filter(r => r.statut === 'résolu').length, color: 'text-green-400' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold ${
          toast.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Signalements</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Traiter les signalements des utilisateurs de la plateforme</p>
        </div>
        {reports.filter(r => r.statut === 'ouvert').length > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold">
            <ExclamationTriangleIcon className="w-3.5 h-3.5" />
            {reports.filter(r => r.statut === 'ouvert').length} signalement{reports.filter(r => r.statut === 'ouvert').length > 1 ? 's' : ''} à traiter
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <input
              type="text"
              placeholder="Rechercher par ID, cible ou signalant…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ReportType | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les types</option>
            {(Object.keys(TYPE_CONFIG) as ReportType[]).map(t => (
              <option key={t} value={t}>{TYPE_CONFIG[t].label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ReportStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="résolu">Résolu</option>
            <option value="rejeté">Rejeté</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} signalement{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-card border border-border rounded-xl py-16 text-center text-muted-foreground text-sm">
            <FlagIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
            Aucun signalement trouvé.
          </div>
        ) : (
          filtered.map(r => {
            const status = STATUS_CONFIG[r.statut];
            const type = TYPE_CONFIG[r.type];
            const priority = PRIORITY_CONFIG[r.priorité];
            const TypeIcon = type.icon;
            const StatusIcon = status.icon;
            const isExpanded = expanded === r.id;

            return (
              <div key={r.id} className={`bg-card border rounded-xl overflow-hidden transition-all ${r.statut === 'ouvert' ? 'border-red-500/30' : 'border-border'}`}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.statut === 'ouvert' ? 'bg-red-500/15' : 'bg-secondary/60'}`}>
                      <TypeIcon className={`w-4 h-4 ${type.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-primary">{r.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priority.cls}`}>
                          {priority.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">{type.label}</span>
                      </div>
                      <p className="font-semibold text-sm text-foreground truncate">{r.cible}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>Signalé par <strong className="text-foreground">{r.signalé_par}</strong></span>
                        <span>•</span>
                        <span>{REASON_LABELS[r.raison]}</span>
                        <span>•</span>
                        <span>{r.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setExpanded(isExpanded ? null : r.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed bg-secondary/30 rounded-lg p-3">{r.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {r.statut !== 'en_cours' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'en_cours')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 text-xs font-semibold hover:bg-amber-500/25 transition-colors"
                          >
                            <ClockIcon className="w-3.5 h-3.5" />
                            Prendre en charge
                          </button>
                        )}
                        {r.statut !== 'résolu' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'résolu')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-colors"
                          >
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Marquer résolu
                          </button>
                        )}
                        {r.statut !== 'rejeté' && (
                          <button
                            onClick={() => handleStatusChange(r.id, 'rejeté')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-500/15 border border-gray-500/25 text-gray-400 text-xs font-semibold hover:bg-gray-500/25 transition-colors"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                            Rejeter
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
