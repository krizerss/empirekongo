'use client';
import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  EyeIcon,
  CheckCircleIcon,
  XMarkIcon,
  TruckIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

type OrderStatus = 'en_attente' | 'confirmée' | 'expédiée' | 'livrée' | 'annulée' | 'remboursée';

interface Order {
  id: string;
  client: string;
  fournisseur: string;
  produit: string;
  montant: number;
  statut: OrderStatus;
  date: string;
  ville: string;
  quantite: number;
}

const mockOrders: Order[] = [
  { id: 'CMD-001', client: 'Jean Mutombo', fournisseur: 'Ferme Kivu Bio', produit: 'Café Robusta Premium 1kg', montant: 45000, statut: 'livrée', date: '2024-07-15', ville: 'Kinshasa', quantite: 2 },
  { id: 'CMD-002', client: 'Marie Lukusa', fournisseur: 'Textiles Kinshasa', produit: 'Tissu Wax 6 yards', montant: 28000, statut: 'expédiée', date: '2024-07-18', ville: 'Goma', quantite: 1 },
  { id: 'CMD-003', client: 'Solange Mwamba', fournisseur: 'Tech Congo SARL', produit: 'Chargeur USB-C 65W', montant: 15000, statut: 'confirmée', date: '2024-07-20', ville: 'Lubumbashi', quantite: 3 },
  { id: 'CMD-004', client: 'Didier Nkosi', fournisseur: 'Artisanat Kasaï', produit: 'Sculpture en bois', montant: 75000, statut: 'en_attente', date: '2024-07-21', ville: 'Kinshasa', quantite: 1 },
  { id: 'CMD-005', client: 'Amina Diallo', fournisseur: 'Beauté Africaine', produit: 'Huile de palme rouge 5L', montant: 22000, statut: 'annulée', date: '2024-07-10', ville: 'Bukavu', quantite: 2 },
  { id: 'CMD-006', client: 'Patrick Kabila', fournisseur: 'Ferme Kivu Bio', produit: 'Miel naturel 500g', montant: 18000, statut: 'livrée', date: '2024-07-08', ville: 'Goma', quantite: 4 },
  { id: 'CMD-007', client: 'Fatou Konaté', fournisseur: 'Nkosi Imports', produit: 'Téléphone Android 4G', montant: 120000, statut: 'remboursée', date: '2024-07-05', ville: 'Kinshasa', quantite: 1 },
  { id: 'CMD-008', client: 'Robert Mbuyi', fournisseur: 'Textiles Kinshasa', produit: 'Chemise batik homme', montant: 12000, statut: 'expédiée', date: '2024-07-22', ville: 'Mbuji-Mayi', quantite: 2 },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  en_attente: { label: 'En attente',  cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25',   icon: ClockIcon },
  confirmée:  { label: 'Confirmée',   cls: 'bg-blue-500/15 text-blue-400 border-blue-500/25',      icon: CheckCircleIcon },
  expédiée:   { label: 'Expédiée',    cls: 'bg-purple-500/15 text-purple-400 border-purple-500/25', icon: TruckIcon },
  livrée:     { label: 'Livrée',      cls: 'bg-green-500/15 text-green-400 border-green-500/25',   icon: CheckCircleIcon },
  annulée:    { label: 'Annulée',     cls: 'bg-red-500/15 text-red-400 border-red-500/25',         icon: XMarkIcon },
  remboursée: { label: 'Remboursée',  cls: 'bg-gray-500/15 text-gray-400 border-gray-500/25',      icon: ArrowDownTrayIcon },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleStatusChange(id: string, newStatus: OrderStatus) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, statut: newStatus } : o));
    showToast(`Commande ${id} mise à jour.`);
  }

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.client.toLowerCase().includes(q) || o.produit.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || o.statut === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenu = orders.filter(o => o.statut === 'livrée').reduce((acc, o) => acc + o.montant, 0);

  const stats = [
    { label: 'Total commandes', value: orders.length, color: 'text-foreground' },
    { label: 'En attente', value: orders.filter(o => o.statut === 'en_attente').length, color: 'text-amber-400' },
    { label: 'Livrées', value: orders.filter(o => o.statut === 'livrée').length, color: 'text-green-400' },
    { label: 'Revenu livré', value: `${(totalRevenu / 1000).toFixed(0)}k`, color: 'text-primary' },
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
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Commandes</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Suivre et gérer toutes les commandes de la plateforme</p>
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
              placeholder="Rechercher par ID, client ou produit…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} commande{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Produit</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Fournisseur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Montant</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-muted-foreground text-sm">
                    <ShoppingCartIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    Aucune commande trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map(o => {
                  const status = STATUS_CONFIG[o.statut];
                  const StatusIcon = status.icon;
                  return (
                    <tr key={o.id} className="border-b border-border/40 last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary">{o.id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-foreground text-sm">{o.client}</p>
                          <p className="text-xs text-muted-foreground">{o.ville}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div>
                          <p className="text-sm text-foreground truncate max-w-[180px]">{o.produit}</p>
                          <p className="text-xs text-muted-foreground">Qté: {o.quantite}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-muted-foreground">{o.fournisseur}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-foreground text-sm">{o.montant.toLocaleString()} CDF</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold border ${status.cls}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">{o.date}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <div className="relative group">
                            <button className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-border hover:border-primary/40 bg-secondary/50 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors">
                              Statut <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[130px] hidden group-hover:block">
                              {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map(s => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusChange(o.id, s)}
                                  className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary/60 transition-colors ${s === o.statut ? 'text-primary font-bold' : 'text-foreground'}`}
                                >
                                  {STATUS_CONFIG[s].label}
                                </button>
                              ))}
                            </div>
                          </div>
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
