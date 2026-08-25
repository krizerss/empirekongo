'use client';
import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  EyeSlashIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

type ProductStatus = 'actif' | 'en_attente' | 'refuse' | 'archive' | 'signale';

interface Product {
  id: number;
  nom: string;
  fournisseur: string;
  categorie: string;
  prix: number;
  devise: string;
  statut: ProductStatus;
  stock: number | null;
  nb_ventes: number;
  created_at: string;
  image: string;
}

const mockProducts: Product[] = [
  { id: 1, nom: 'Café Robusta Premium 1kg', fournisseur: 'Ferme Kivu Bio', categorie: 'Alimentation', prix: 4500, devise: 'CDF', statut: 'actif', stock: 120, nb_ventes: 342, created_at: '2024-01-10', image: 'CF' },
  { id: 2, nom: 'Tissu Wax Authentique 6m', fournisseur: 'Textiles Kinshasa', categorie: 'Mode & Textile', prix: 12000, devise: 'CDF', statut: 'actif', stock: 45, nb_ventes: 218, created_at: '2024-01-15', image: 'TW' },
  { id: 3, nom: 'Huile de Palme Rouge 5L', fournisseur: 'Agro Bandundu', categorie: 'Alimentation', prix: 3200, devise: 'CDF', statut: 'en_attente', stock: 200, nb_ventes: 0, created_at: '2024-03-20', image: 'HP' },
  { id: 4, nom: 'Artisanat Kasaï – Panier', fournisseur: 'Artisans du Kasaï', categorie: 'Artisanat', prix: 7800, devise: 'CDF', statut: 'actif', stock: null, nb_ventes: 167, created_at: '2023-12-05', image: 'AK' },
  { id: 5, nom: 'Manioc Séché 10kg', fournisseur: 'Coopérative Kwilu', categorie: 'Alimentation', prix: 2100, devise: 'CDF', statut: 'actif', stock: 500, nb_ventes: 143, created_at: '2023-11-18', image: 'MS' },
  { id: 6, nom: 'Savon Artisanal Karité', fournisseur: 'Beauté Naturelle RDC', categorie: 'Beauté & Soins', prix: 850, devise: 'CDF', statut: 'en_attente', stock: 300, nb_ventes: 0, created_at: '2024-04-01', image: 'SA' },
  { id: 7, nom: 'Bois de Teck Brut 1m³', fournisseur: 'Forêts Équatoriales', categorie: 'Matériaux', prix: 85000, devise: 'CDF', statut: 'refuse', stock: 10, nb_ventes: 0, created_at: '2024-02-28', image: 'BT' },
  { id: 8, nom: 'Téléphone Contrefait X', fournisseur: 'Vendeur Inconnu', categorie: 'Électronique', prix: 15000, devise: 'CDF', statut: 'signale', stock: 50, nb_ventes: 12, created_at: '2024-03-10', image: 'TC' },
];

const STATUS_CONFIG: Record<ProductStatus, { label: string; cls: string }> = {
  actif:      { label: 'Actif',       cls: 'bg-green-500/15 text-green-400 border-green-500/25' },
  en_attente: { label: 'En attente',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  refuse:     { label: 'Refusé',      cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
  archive:    { label: 'Archivé',     cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25' },
  signale:    { label: 'Signalé',     cls: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleApprove(id: number) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, statut: 'actif' } : p));
    showToast('Produit approuvé avec succès.');
  }

  function handleReject(id: number) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, statut: 'refuse' } : p));
    showToast('Produit refusé.');
  }

  function handleHide(id: number) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, statut: 'archive' } : p));
    showToast('Produit masqué.');
  }

  function handleDelete(id: number) {
    setProducts(prev => prev.filter(p => p.id !== id));
    setConfirmDelete(null);
    showToast('Produit supprimé.');
  }

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.nom.toLowerCase().includes(q) || p.fournisseur.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total', value: products.length, color: 'text-foreground' },
    { label: 'Actifs', value: products.filter(p => p.statut === 'actif').length, color: 'text-green-400' },
    { label: 'En attente', value: products.filter(p => p.statut === 'en_attente').length, color: 'text-amber-400' },
    { label: 'Signalés', value: products.filter(p => p.statut === 'signale').length, color: 'text-orange-400' },
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

      {/* Confirm Delete Modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="font-bold text-foreground mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-muted-foreground mb-6">Cette action est irréversible. Le produit sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Gestion des produits</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Valider, modérer et gérer tous les produits du marketplace</p>
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
              placeholder="Rechercher par nom ou fournisseur…"
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
              onChange={e => setStatusFilter(e.target.value as ProductStatus | 'all')}
              className="pl-7 pr-8 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              {(Object.keys(STATUS_CONFIG) as ProductStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} produit{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Produit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Fournisseur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Catégorie</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Prix</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Ventes</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">
                    <MagnifyingGlassIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucun produit trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const status = STATUS_CONFIG[p.statut];
                  return (
                    <tr key={p.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-[10px] font-bold text-muted-foreground border border-border">
                            {p.image}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate max-w-[140px]">{p.nom}</p>
                            <p className="text-[10px] text-muted-foreground">{p.created_at}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-muted-foreground">{p.fournisseur}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{p.categorie}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs font-bold text-primary">{p.prix.toLocaleString()} {p.devise}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{p.nb_ventes}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Voir">
                            <EyeIcon className="w-3.5 h-3.5" />
                          </button>
                          <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Modifier">
                            <PencilSquareIcon className="w-3.5 h-3.5" />
                          </button>
                          {p.statut === 'en_attente' && (
                            <>
                              <button onClick={() => handleApprove(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors" title="Approuver">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleReject(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Refuser">
                                <XCircleIcon className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                          {p.statut === 'actif' && (
                            <button onClick={() => handleHide(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors" title="Masquer">
                              <EyeSlashIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {p.statut === 'signale' && (
                            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors" title="Signalement">
                              <FlagIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => setConfirmDelete(p.id)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Supprimer">
                            <TrashIcon className="w-3.5 h-3.5" />
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
