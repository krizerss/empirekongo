'use client';
import React, { useState } from 'react';
import { ShieldCheckIcon, CheckCircleIcon, LockClosedIcon, PencilSquareIcon,  } from '@heroicons/react/24/outline';

type RoleName = 'super_admin' | 'admin' | 'moderator' | 'support';

interface Permission {
  key: string;
  label: string;
  group: string;
}

interface Role {
  name: RoleName;
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
  userCount: number;
  permissions: Set<string>;
  locked: boolean;
}

const ALL_PERMISSIONS: Permission[] = [
  { key: 'users.view',            label: 'Voir les utilisateurs',         group: 'Utilisateurs' },
  { key: 'users.create',          label: 'Créer des utilisateurs',        group: 'Utilisateurs' },
  { key: 'users.update',          label: 'Modifier les utilisateurs',     group: 'Utilisateurs' },
  { key: 'users.delete',          label: 'Supprimer des utilisateurs',    group: 'Utilisateurs' },
  { key: 'users.suspend',         label: 'Suspendre des utilisateurs',    group: 'Utilisateurs' },
  { key: 'products.view',         label: 'Voir les produits',             group: 'Produits' },
  { key: 'products.create',       label: 'Créer des produits',            group: 'Produits' },
  { key: 'products.update',       label: 'Modifier les produits',         group: 'Produits' },
  { key: 'products.delete',       label: 'Supprimer des produits',        group: 'Produits' },
  { key: 'products.approve',      label: 'Approuver des produits',        group: 'Produits' },
  { key: 'transactions.view',     label: 'Voir les transactions',         group: 'Transactions' },
  { key: 'transactions.manage',   label: 'Gérer les transactions',        group: 'Transactions' },
  { key: 'subscriptions.view',    label: 'Voir les abonnements',          group: 'Abonnements' },
  { key: 'subscriptions.manage',  label: 'Gérer les abonnements',         group: 'Abonnements' },
  { key: 'reports.view',          label: 'Voir les signalements',         group: 'Signalements' },
  { key: 'reports.manage',        label: 'Traiter les signalements',      group: 'Signalements' },
  { key: 'settings.view',         label: 'Voir les paramètres',           group: 'Paramètres' },
  { key: 'settings.manage',       label: 'Modifier les paramètres',       group: 'Paramètres' },
  { key: 'roles.view',            label: 'Voir les rôles',                group: 'Rôles' },
  { key: 'roles.manage',          label: 'Gérer les rôles',               group: 'Rôles' },
];

const ALL_PERM_KEYS = new Set(ALL_PERMISSIONS.map(p => p.key));

const initialRoles: Role[] = [
  {
    name: 'super_admin',
    label: 'Super Admin',
    description: 'Accès total à toutes les fonctionnalités. Ne peut pas être modifié.',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    userCount: 1,
    permissions: new Set(ALL_PERM_KEYS),
    locked: true,
  },
  {
    name: 'admin',
    label: 'Admin',
    description: 'Gestion complète sauf modification des rôles et paramètres critiques.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/25',
    userCount: 3,
    permissions: new Set([
      'users.view', 'users.create', 'users.update', 'users.suspend',
      'products.view', 'products.create', 'products.update', 'products.delete', 'products.approve',
      'transactions.view', 'transactions.manage',
      'subscriptions.view', 'subscriptions.manage',
      'reports.view', 'reports.manage',
      'settings.view',
      'roles.view',
    ]),
    locked: false,
  },
  {
    name: 'moderator',
    label: 'Modérateur',
    description: 'Modération du contenu : produits, signalements, utilisateurs.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    userCount: 5,
    permissions: new Set([
      'users.view', 'users.suspend',
      'products.view', 'products.approve',
      'reports.view', 'reports.manage',
    ]),
    locked: false,
  },
  {
    name: 'support',
    label: 'Support',
    description: 'Assistance client : consultation des commandes et transactions.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/25',
    userCount: 8,
    permissions: new Set([
      'users.view',
      'products.view',
      'transactions.view',
      'subscriptions.view',
      'reports.view',
    ]),
    locked: false,
  },
];

const GROUPS = [...new Set(ALL_PERMISSIONS.map(p => p.group))];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<RoleName>('admin');
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const currentRole = roles.find(r => r.name === selectedRole)!;

  function togglePermission(permKey: string) {
    if (currentRole.locked) return;
    setRoles(prev => prev.map(r => {
      if (r.name !== selectedRole) return r;
      const newPerms = new Set(r.permissions);
      if (newPerms.has(permKey)) {
        newPerms.delete(permKey);
      } else {
        newPerms.add(permKey);
      }
      return { ...r, permissions: newPerms };
    }));
    showToast('Permission mise à jour.');
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold animate-in bg-green-500/15 border-green-500/30 text-green-400">
          <CheckCircleIcon className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Rôles & Permissions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gérer les accès et permissions par rôle</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">Rôles disponibles</h2>
          {roles.map(role => (
            <button
              key={role.name}
              onClick={() => setSelectedRole(role.name)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedRole === role.name
                  ? `${role.bg} ${role.border} border`
                  : 'bg-card border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className={`w-4 h-4 ${role.color}`} />
                  <span className={`text-sm font-bold ${role.color}`}>{role.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {role.locked && <LockClosedIcon className="w-3.5 h-3.5 text-muted-foreground/50" />}
                  <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {role.userCount} utilisateur{role.userCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{role.description}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                {role.permissions.size} / {ALL_PERMISSIONS.length} permissions
              </p>
            </button>
          ))}
        </div>

        {/* Permissions Editor */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className={`w-5 h-5 ${currentRole.color}`} />
              <div>
                <h3 className="font-bold text-sm text-foreground">{currentRole.label}</h3>
                <p className="text-[11px] text-muted-foreground">{currentRole.permissions.size} permissions actives</p>
              </div>
            </div>
            {currentRole.locked ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                <LockClosedIcon className="w-3.5 h-3.5" />
                Verrouillé
              </div>
            ) : (
              <button
                onClick={() => showToast('Permissions sauvegardées.')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <PencilSquareIcon className="w-3.5 h-3.5" />
                Sauvegarder
              </button>
            )}
          </div>

          <div className="p-5 space-y-6 overflow-y-auto max-h-[600px]">
            {currentRole.locked && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-xs text-amber-400">
                <LockClosedIcon className="w-4 h-4 shrink-0" />
                Le Super Admin possède toutes les permissions et ne peut pas être modifié.
              </div>
            )}

            {GROUPS.map(group => {
              const groupPerms = ALL_PERMISSIONS.filter(p => p.group === group);
              return (
                <div key={group}>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{group}</h4>
                  <div className="space-y-2">
                    {groupPerms.map(perm => {
                      const active = currentRole.permissions.has(perm.key);
                      return (
                        <div
                          key={perm.key}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                            active ? 'bg-primary/5 border-primary/20' : 'bg-secondary/20 border-border/50'
                          } ${!currentRole.locked ? 'cursor-pointer hover:border-primary/30' : 'cursor-not-allowed opacity-70'}`}
                          onClick={() => togglePermission(perm.key)}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              active ? 'bg-primary border-primary' : 'border-border'
                            }`}>
                              {active && <CheckCircleIcon className="w-3 h-3 text-primary-foreground" />}
                            </div>
                            <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {perm.label}
                            </span>
                          </div>
                          <code className="text-[10px] text-muted-foreground/50 font-mono">{perm.key}</code>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
