'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  PlayCircleIcon,
  EyeIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserPlusIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

type UserRole = 'super_admin' | 'admin' | 'moderator' | 'support' | 'vendeur' | 'membre' | 'fournisseur';
type UserStatus = 'actif' | 'suspendu' | 'inactif' | 'banni';

interface User {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: UserRole;
  statut: UserStatus;
  inscription: string;
  derniere_connexion: string;
  avatar: string;
  email_verifie: boolean;
}

const mockUsers: User[] = [
  { id: 1, nom: 'Jean Mutombo', email: 'jean.mutombo@gmail.com', telephone: '+243 81 234 5678', role: 'membre', statut: 'actif', inscription: '2024-01-15', derniere_connexion: 'Il y a 2h', avatar: 'JM', email_verifie: true },
  { id: 2, nom: 'Marie Lukusa', email: 'marie.lukusa@empirekongo.cd', telephone: '+243 99 876 5432', role: 'vendeur', statut: 'actif', inscription: '2023-11-08', derniere_connexion: 'Il y a 30 min', avatar: 'ML', email_verifie: true },
  { id: 3, nom: 'Patrick Kabila', email: 'p.kabila@gmail.com', telephone: '+243 82 345 6789', role: 'fournisseur', statut: 'actif', inscription: '2023-09-22', derniere_connexion: 'Hier', avatar: 'PK', email_verifie: true },
  { id: 4, nom: 'Solange Mwamba', email: 'solange.m@yahoo.fr', telephone: '+243 97 654 3210', role: 'membre', statut: 'suspendu', inscription: '2024-02-10', derniere_connexion: 'Il y a 5 jours', avatar: 'SM', email_verifie: false },
  { id: 5, nom: 'Didier Nkosi', email: 'didier.nkosi@gmail.com', telephone: '+243 81 111 2222', role: 'vendeur', statut: 'actif', inscription: '2023-07-30', derniere_connexion: 'Il y a 1h', avatar: 'DN', email_verifie: true },
  { id: 6, nom: 'Amina Diallo', email: 'amina.diallo@gmail.com', telephone: '+243 99 333 4444', role: 'membre', statut: 'actif', inscription: '2024-03-05', derniere_connexion: 'Il y a 3h', avatar: 'AD', email_verifie: true },
  { id: 7, nom: 'Christophe Lunda', email: 'c.lunda@gmail.com', telephone: '+243 82 555 6666', role: 'vendeur', statut: 'banni', inscription: '2023-05-14', derniere_connexion: 'Il y a 2 semaines', avatar: 'CL', email_verifie: true },
  { id: 8, nom: 'Fatou Konaté', email: 'fatou.konate@gmail.com', telephone: '+243 97 777 8888', role: 'membre', statut: 'inactif', inscription: '2024-04-20', derniere_connexion: 'Il y a 1 mois', avatar: 'FK', email_verifie: false },
  { id: 9, nom: 'Modérateur Contenu', email: 'moderateur@empirekongo.cd', telephone: '+243 81 999 0000', role: 'moderator', statut: 'actif', inscription: '2023-03-01', derniere_connexion: 'En ligne', avatar: 'MC', email_verifie: true },
  { id: 10, nom: 'Support Client', email: 'support@empirekongo.cd', telephone: '+243 99 000 1111', role: 'support', statut: 'actif', inscription: '2023-04-15', derniere_connexion: 'Il y a 10 min', avatar: 'SC', email_verifie: true },
];

const ROLE_CONFIG: Record<UserRole, { label: string; cls: string }> = {
  super_admin: { label: 'Super Admin', cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  admin:       { label: 'Admin',       cls: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
  moderator:   { label: 'Modérateur',  cls: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
  support:     { label: 'Support',     cls: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
  vendeur:     { label: 'Vendeur',     cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  membre:      { label: 'Membre',      cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
  fournisseur: { label: 'Fournisseur', cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; dot: string; text: string }> = {
  actif:    { label: 'Actif',    dot: 'bg-green-400', text: 'text-green-400' },
  suspendu: { label: 'Suspendu', dot: 'bg-red-400',   text: 'text-red-400' },
  inactif:  { label: 'Inactif',  dot: 'bg-gray-400',  text: 'text-gray-400' },
  banni:    { label: 'Banni',    dot: 'bg-red-600',   text: 'text-red-600' },
};

function RoleDropdown({ userId, currentRole, onAssign }: { userId: number; currentRole: UserRole; onAssign: (id: number, role: UserRole) => void }) {
  const [open, setOpen] = useState(false);
  const roles: UserRole[] = ['membre', 'vendeur', 'fournisseur', 'support', 'moderator', 'admin'];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border hover:border-primary/40 bg-secondary/50 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <PencilSquareIcon className="w-3 h-3" />
        Rôle
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[130px]">
          {roles.map(r => (
            <button
              key={r}
              onClick={() => { onAssign(userId, r); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/60 transition-colors flex items-center justify-between ${r === currentRole ? 'text-primary font-bold' : 'text-foreground'}`}
            >
              {ROLE_CONFIG[r].label}
              {r === currentRole && <CheckCircleIcon className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleRoleAssign(userId: number, newRole: UserRole) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Rôle mis à jour avec succès.`);
  }

  function handleToggleStatus(userId: number) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newStatus: UserStatus = user.statut === 'suspendu' ? 'actif' : 'suspendu';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut: newStatus } : u));
    showToast(newStatus === 'suspendu' ? 'Utilisateur suspendu avec succès.' : 'Utilisateur réactivé avec succès.');
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.nom.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.statut === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = [
    { label: 'Total', value: users.length, color: 'text-foreground' },
    { label: 'Actifs', value: users.filter(u => u.statut === 'actif').length, color: 'text-green-400' },
    { label: 'Suspendus', value: users.filter(u => u.statut === 'suspendu').length, color: 'text-red-400' },
    { label: 'Non vérifiés', value: users.filter(u => !u.email_verifie).length, color: 'text-amber-400' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold animate-in ${
          toast.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Gestion des utilisateurs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Administrer tous les comptes de la plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
            Exporter
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
            <UserPlusIcon className="w-3.5 h-3.5" />
            Ajouter
          </button>
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
              placeholder="Rechercher par nom ou email…"
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
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as UserRole | 'all')}
              className="pl-7 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Tous les rôles</option>
              {(Object.keys(ROLE_CONFIG) as UserRole[]).map(r => (
                <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>
              ))}
            </select>
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as UserStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
            <option value="inactif">Inactif</option>
            <option value="banni">Banni</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} utilisateur{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Téléphone</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Rôle</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Inscription</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Dernière connexion</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map(u => {
                  const role = ROLE_CONFIG[u.role];
                  const status = STATUS_CONFIG[u.statut];
                  return (
                    <tr key={u.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                            {u.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">{u.nom}</p>
                            {u.email_verifie ? (
                              <p className="text-[10px] text-green-400">✓ Vérifié</p>
                            ) : (
                              <p className="text-[10px] text-amber-400">⚠ Non vérifié</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground truncate max-w-[160px] block">{u.email}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{u.telephone}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${role.cls}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} inline-block`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{u.inscription}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-xs text-muted-foreground">{u.derniere_connexion}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/users/${u.id}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <EyeIcon className="w-3 h-3" />
                            Voir
                          </Link>
                          <RoleDropdown userId={u.id} currentRole={u.role} onAssign={handleRoleAssign} />
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-semibold transition-colors ${
                              u.statut === 'suspendu' ?'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20' :'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                            }`}
                          >
                            {u.statut === 'suspendu' ? (
                              <><PlayCircleIcon className="w-3 h-3" />Activer</>
                            ) : (
                              <><NoSymbolIcon className="w-3 h-3" />Suspendre</>
                            )}
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
    </div>
  );
}
