'use client';
import React, { useState } from 'react';
import { MagnifyingGlassIcon, TruckIcon, CheckCircleIcon, XMarkIcon, EyeIcon, NoSymbolIcon, PlayCircleIcon, ArrowDownTrayIcon, BuildingStorefrontIcon, MapPinIcon, StarIcon,  } from '@heroicons/react/24/outline';

type SupplierStatus = 'actif' | 'suspendu' | 'en_attente' | 'rejeté';

interface Supplier {
  id: number;
  nom: string;
  entreprise: string;
  email: string;
  telephone: string;
  ville: string;
  categorie: string;
  statut: SupplierStatus;
  produits: number;
  note: number;
  inscription: string;
  revenu_total: number;
}

const mockSuppliers: Supplier[] = [
  { id: 1, nom: 'Patrick Kabila', entreprise: 'Ferme Kivu Bio', email: 'p.kabila@gmail.com', telephone: '+243 82 345 6789', ville: 'Goma', categorie: 'Agriculture', statut: 'actif', produits: 24, note: 4.8, inscription: '2023-09-22', revenu_total: 1250000 },
  { id: 2, nom: 'Amina Diallo', entreprise: 'Textiles Kinshasa', email: 'amina.diallo@gmail.com', telephone: '+243 99 333 4444', ville: 'Kinshasa', categorie: 'Textile', statut: 'actif', produits: 56, note: 4.5, inscription: '2023-06-10', revenu_total: 3400000 },
  { id: 3, nom: 'Robert Mbuyi', entreprise: 'Tech Congo SARL', email: 'r.mbuyi@techcongo.cd', telephone: '+243 81 222 3333', ville: 'Lubumbashi', categorie: 'Électronique', statut: 'en_attente', produits: 0, note: 0, inscription: '2024-07-01', revenu_total: 0 },
  { id: 4, nom: 'Sylvie Ntumba', entreprise: 'Artisanat Kasaï', email: 's.ntumba@gmail.com', telephone: '+243 97 444 5555', ville: 'Mbuji-Mayi', categorie: 'Artisanat', statut: 'actif', produits: 18, note: 4.2, inscription: '2023-11-15', revenu_total: 780000 },
  { id: 5, nom: 'Didier Nkosi', entreprise: 'Nkosi Imports', email: 'didier.nkosi@gmail.com', telephone: '+243 81 111 2222', ville: 'Kinshasa', categorie: 'Import/Export', statut: 'suspendu', produits: 12, note: 3.1, inscription: '2023-07-30', revenu_total: 450000 },
  { id: 6, nom: 'Fatou Konaté', entreprise: 'Beauté Africaine', email: 'fatou.konate@gmail.com', telephone: '+243 97 777 8888', ville: 'Bukavu', categorie: 'Beauté', statut: 'actif', produits: 31, note: 4.7, inscription: '2024-01-20', revenu_total: 920000 },
  { id: 7, nom: 'Jean-Pierre Lelo', entreprise: 'Lelo Construction', email: 'jp.lelo@gmail.com', telephone: '+243 82 666 7777', ville: 'Kisangani', categorie: 'Construction', statut: 'rejeté', produits: 0, note: 0, inscription: '2024-06-15', revenu_total: 0 },
];

const STATUS_CONFIG: Record<SupplierStatus, { label: string; cls: string; dot: string }> = {
  actif:      { label: 'Actif',       cls: 'bg-green-500/15 text-green-400 border-green-500/25',   dot: 'bg-green-400' },
  suspendu:   { label: 'Suspendu',    cls: 'bg-red-500/15 text-red-400 border-red-500/25',         dot: 'bg-red-400' },
  en_attente: { label: 'En attente',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25',   dot: 'bg-amber-400' },
  rejeté:     { label: 'Rejeté',      cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25',      dot: 'bg-gray-400' },
};

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleApprove(id: number) {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, statut: 'actif' } : s));
    showToast('Fournisseur approuvé avec succès.');
  }

  function handleToggle(id: number) {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, statut: s.statut === 'suspendu' ? 'actif' : 'suspendu' } : s));
    showToast('Statut mis à jour.');
  }

  const filtered = suppliers.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.nom.toLowerCase().includes(q) || s.entreprise.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || s.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total', value: suppliers.length, color: 'text-foreground' },
    { label: 'Actifs', value: suppliers.filter(s => s.statut === 'actif').length, color: 'text-green-400' },
    { label: 'En attente', value: suppliers.filter(s => s.statut === 'en_attente').length, color: 'text-amber-400' },
    { label: 'Suspendus', value: suppliers.filter(s => s.statut === 'suspendu').length, color: 'text-red-400' },
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
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Fournisseurs</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Valider, surveiller et gérer les fournisseurs de la plateforme</p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          Exporter CSV
        </button>
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
              placeholder="Rechercher par nom, entreprise ou email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as SupplierStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="en_attente">En attente</option>
            <option value="suspendu">Suspendu</option>
            <option value="rejeté">Rejeté</option>
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} fournisseur{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fournisseur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Localisation</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Produits</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Note</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Revenu total</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <TruckIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucun fournisseur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map(s => {
                  const status = STATUS_CONFIG[s.statut];
                  return (
                    <tr key={s.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20 flex items-center justify-center shrink-0">
                            <BuildingStorefrontIcon className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-sm">{s.entreprise}</p>
                            <p className="text-xs text-muted-foreground">{s.nom}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {s.ville}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-1 rounded-lg">{s.categorie}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm font-semibold text-foreground">{s.produits}</span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {s.note > 0 ? (
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold text-foreground">{s.note}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className="text-sm font-semibold text-foreground">
                          {s.revenu_total > 0 ? `${(s.revenu_total / 1000).toFixed(0)}k CDF` : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {s.statut === 'en_attente' && (
                            <button
                              onClick={() => handleApprove(s.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/15 border border-green-500/25 text-green-400 text-[10px] font-semibold hover:bg-green-500/25 transition-colors"
                            >
                              <CheckCircleIcon className="w-3 h-3" />
                              Approuver
                            </button>
                          )}
                          {(s.statut === 'actif' || s.statut === 'suspendu') && (
                            <button
                              onClick={() => handleToggle(s.id)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
                                s.statut === 'suspendu' ?'bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/25' :'bg-red-500/15 border border-red-500/25 text-red-400 hover:bg-red-500/25'
                              }`}
                            >
                              {s.statut === 'suspendu' ? <PlayCircleIcon className="w-3 h-3" /> : <NoSymbolIcon className="w-3 h-3" />}
                              {s.statut === 'suspendu' ? 'Réactiver' : 'Suspendre'}
                            </button>
                          )}
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
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
    </div>
  );
}
