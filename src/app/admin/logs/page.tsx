'use client';
import React, { useState } from 'react';
import {
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type LogType = 'login' | 'logout' | 'user_update' | 'user_suspend' | 'user_delete' | 'permission_change' | 'settings_change' | 'financial';

interface SecurityLog {
  id: number;
  utilisateur: string;
  action: string;
  detail: string;
  ip: string;
  date: string;
  resultat: 'success' | 'failure';
  type: LogType;
}

const LOG_CONFIG: Record<LogType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  login:             { label: 'Connexion',          icon: ShieldCheckIcon,           color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  logout:            { label: 'Déconnexion',         icon: ArrowRightOnRectangleIcon, color: 'text-gray-400',   bg: 'bg-gray-500/10' },
  user_update:       { label: 'Modif. utilisateur',  icon: PencilSquareIcon,          color: 'text-amber-400',  bg: 'bg-amber-500/10' },
  user_suspend:      { label: 'Suspension',          icon: NoSymbolIcon,              color: 'text-red-400',    bg: 'bg-red-500/10' },
  user_delete:       { label: 'Suppression',         icon: UserIcon,                  color: 'text-red-600',    bg: 'bg-red-600/10' },
  permission_change: { label: 'Modif. permissions',  icon: ShieldCheckIcon,           color: 'text-purple-400', bg: 'bg-purple-500/10' },
  settings_change:   { label: 'Modif. paramètres',   icon: Cog6ToothIcon,             color: 'text-cyan-400',   bg: 'bg-cyan-500/10' },
  financial:         { label: 'Action financière',   icon: CurrencyDollarIcon,        color: 'text-green-400',  bg: 'bg-green-500/10' },
};

const mockLogs: SecurityLog[] = [
  { id: 1,  utilisateur: 'Super Admin',        action: 'Connexion admin',              detail: 'Connexion réussie depuis Kinshasa, RDC',                   ip: '41.243.12.45',  date: '2024-04-15 14:32:01', resultat: 'success', type: 'login' },
  { id: 2,  utilisateur: 'Admin Principal',    action: 'Suspension utilisateur',       detail: 'Compte Christophe Lunda (ID: 7) suspendu — CGU',           ip: '41.243.12.45',  date: '2024-04-15 13:15:22', resultat: 'success', type: 'user_suspend' },
  { id: 3,  utilisateur: 'Admin Principal',    action: 'Modification rôle',            detail: 'Rôle de Jean Mutombo : membre → vendeur',                  ip: '41.243.12.45',  date: '2024-04-15 12:00:10', resultat: 'success', type: 'user_update' },
  { id: 4,  utilisateur: 'Modérateur',         action: 'Connexion admin',              detail: 'Connexion réussie depuis Lubumbashi, RDC',                 ip: '197.239.5.12',  date: '2024-04-15 11:45:33', resultat: 'success', type: 'login' },
  { id: 5,  utilisateur: 'Admin Principal',    action: 'Modification paramètres',      detail: 'Taux de commission modifié : 2% → 2.5%',                   ip: '41.243.12.45',  date: '2024-04-14 18:20:05', resultat: 'success', type: 'settings_change' },
  { id: 6,  utilisateur: 'Inconnu',            action: 'Tentative de connexion',       detail: 'Échec — mot de passe incorrect (5 tentatives)',            ip: '102.88.34.201', date: '2024-04-14 17:55:12', resultat: 'failure', type: 'login' },
  { id: 7,  utilisateur: 'Super Admin',        action: 'Modification permissions',     detail: 'Permissions du rôle Modérateur mises à jour',              ip: '41.243.12.45',  date: '2024-04-14 16:30:44', resultat: 'success', type: 'permission_change' },
  { id: 8,  utilisateur: 'Admin Principal',    action: 'Action financière',            detail: 'Remboursement TXN-006 — 55 000 CDF',                       ip: '41.243.12.45',  date: '2024-04-14 15:10:08', resultat: 'success', type: 'financial' },
  { id: 9,  utilisateur: 'Support Client',     action: 'Connexion admin',              detail: 'Connexion réussie depuis Goma, RDC',                       ip: '41.243.88.77',  date: '2024-04-14 10:05:55', resultat: 'success', type: 'login' },
  { id: 10, utilisateur: 'Admin Principal',    action: 'Déconnexion',                  detail: 'Session terminée normalement',                             ip: '41.243.12.45',  date: '2024-04-13 19:00:00', resultat: 'success', type: 'logout' },
];

export default function AdminLogsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<LogType | 'all'>('all');
  const [resultFilter, setResultFilter] = useState<'all' | 'success' | 'failure'>('all');

  const filtered = mockLogs.filter(log => {
    const q = search.toLowerCase();
    const matchSearch = !q || log.utilisateur.toLowerCase().includes(q) || log.action.toLowerCase().includes(q) || log.detail.toLowerCase().includes(q);
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    const matchResult = resultFilter === 'all' || log.resultat === resultFilter;
    return matchSearch && matchType && matchResult;
  });

  const stats = [
    { label: 'Total logs', value: mockLogs.length, color: 'text-foreground' },
    { label: 'Succès', value: mockLogs.filter(l => l.resultat === 'success').length, color: 'text-green-400' },
    { label: 'Échecs', value: mockLogs.filter(l => l.resultat === 'failure').length, color: 'text-red-400' },
    { label: 'Connexions', value: mockLogs.filter(l => l.type === 'login').length, color: 'text-blue-400' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Logs de sécurité</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Historique des actions administratives — lecture seule</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/50 border border-border rounded-lg px-3 py-2">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-primary" />
          <span>Logs non modifiables</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
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
              placeholder="Rechercher par utilisateur, action ou détail…"
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
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as LogType | 'all')}
              className="pl-7 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Tous les types</option>
              {(Object.keys(LOG_CONFIG) as LogType[]).map(t => (
                <option key={t} value={t}>{LOG_CONFIG[t].label}</option>
              ))}
            </select>
          </div>
          <select
            value={resultFilter}
            onChange={e => setResultFilter(e.target.value as 'all' | 'success' | 'failure')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les résultats</option>
            <option value="success">Succès</option>
            <option value="failure">Échec</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} entrée{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Logs List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border/40">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              <ClipboardDocumentListIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Aucun log trouvé.
            </div>
          ) : (
            filtered.map(log => {
              const cfg = LOG_CONFIG[log.type];
              const LogIcon = cfg.icon;
              return (
                <div key={log.id} className="flex items-start gap-3 p-4 hover:bg-secondary/20 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <LogIcon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-foreground">{log.action}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        log.resultat === 'success' ?'bg-green-500/15 text-green-400' :'bg-red-500/15 text-red-400'
                      }`}>
                        {log.resultat === 'success' ? '✓ Succès' : '✗ Échec'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.detail}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-muted-foreground/60">
                        <span className="font-semibold text-muted-foreground">{log.utilisateur}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">IP: {log.ip}</span>
                      <span className="text-[10px] text-muted-foreground/60">{log.date}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
