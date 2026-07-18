'use client';
import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

type OrderStatus = 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    avatar: string;
    phone: string;
    email: string;
    location: string;
    company: string;
    verified: boolean;
  };
  product: {
    name: string;
    category: string;
    quantity: string;
    unitPrice: number;
    total: number;
    image: string;
  };
  status: OrderStatus;
  note: string;
}

const orders: Order[] = [
  {
    id: 'CMD-2024-001',
    date: '18 Juil 2024, 10:32',
    customer: {
      name: 'Jean Mutombo',
      avatar: 'JM',
      phone: '+243 812 345 678',
      email: 'jean.mutombo@email.com',
      location: 'Kinshasa, DRC',
      company: 'Mutombo Trading',
      verified: true,
    },
    product: {
      name: 'Café Robusta Premium',
      category: 'Agriculture',
      quantity: '50 kg',
      unitPrice: 4500,
      total: 225000,
      image: '',
    },
    status: 'en_attente',
    note: 'Livraison souhaitée avant le 25 juillet.',
  },
  {
    id: 'CMD-2024-002',
    date: '17 Juil 2024, 09:15',
    customer: {
      name: 'Marie Lukusa',
      avatar: 'ML',
      phone: '+243 897 654 321',
      email: 'marie.lukusa@email.com',
      location: 'Lubumbashi, DRC',
      company: 'Lukusa Agro',
      verified: true,
    },
    product: {
      name: 'Manioc Séché',
      category: 'Agriculture',
      quantity: '100 kg',
      unitPrice: 1200,
      total: 120000,
      image: '',
    },
    status: 'livree',
    note: 'Commande livrée avec succès.',
  },
  {
    id: 'CMD-2024-003',
    date: '16 Juil 2024, 14:00',
    customer: {
      name: 'Paul Nkosi',
      avatar: 'PN',
      phone: '+243 821 987 654',
      email: 'paul.nkosi@email.com',
      location: 'Goma, DRC',
      company: 'Nkosi Constructions',
      verified: false,
    },
    product: {
      name: 'Ciment Portland 42.5',
      category: 'BTP',
      quantity: '200 sacs',
      unitPrice: 18000,
      total: 3600000,
      image: '',
    },
    status: 'confirmee',
    note: 'Paiement reçu. En attente de préparation.',
  },
  {
    id: 'CMD-2024-004',
    date: '15 Juil 2024, 11:00',
    customer: {
      name: 'Ange Kabila',
      avatar: 'AK',
      phone: '+243 845 123 456',
      email: 'ange.kabila@email.com',
      location: 'Matadi, DRC',
      company: 'Kabila Mode',
      verified: true,
    },
    product: {
      name: 'Tissu Wax Africain',
      category: 'Mode',
      quantity: '30 mètres',
      unitPrice: 3500,
      total: 105000,
      image: '',
    },
    status: 'en_livraison',
    note: 'Colis en transit vers Matadi.',
  },
  {
    id: 'CMD-2024-005',
    date: '14 Juil 2024, 08:45',
    customer: {
      name: 'Christelle Banza',
      avatar: 'CB',
      phone: '+243 876 543 210',
      email: 'christelle.banza@email.com',
      location: 'Mbuji-Mayi, DRC',
      company: 'Banza Tech',
      verified: true,
    },
    product: {
      name: 'Panneau Solaire 300W',
      category: 'Énergie',
      quantity: '5 unités',
      unitPrice: 85000,
      total: 425000,
      image: '',
    },
    status: 'annulee',
    note: 'Client a annulé la commande.',
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  en_attente: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: ClockIcon },
  confirmee: { label: 'Confirmée', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircleIcon },
  en_livraison: { label: 'En livraison', color: 'text-primary', bg: 'bg-primary/10', icon: TruckIcon },
  livree: { label: 'Livrée', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircleSolid },
  annulee: { label: 'Annulée', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircleIcon },
};

function formatCDF(amount: number) {
  return new Intl.NumberFormat('fr-CD').format(amount) + ' CDF';
}

export default function CommandesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      o.product.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    en_attente: orders.filter((o) => o.status === 'en_attente').length,
    confirmee: orders.filter((o) => o.status === 'confirmee').length,
    livree: orders.filter((o) => o.status === 'livree').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Mes commandes</h1>
        <p className="text-sm text-muted-foreground">Toutes les commandes reçues de vos clients.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Total commandes</p>
          <p className="text-2xl font-extrabold text-foreground">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">En attente</p>
          <p className="text-2xl font-extrabold text-yellow-400">{stats.en_attente}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Confirmées</p>
          <p className="text-2xl font-extrabold text-blue-400">{stats.confirmee}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Livrées</p>
          <p className="text-2xl font-extrabold text-green-400">{stats.livree}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par client, produit ou N° commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="en_attente">En attente</option>
            <option value="confirmee">Confirmée</option>
            <option value="en_livraison">En livraison</option>
            <option value="livree">Livrée</option>
            <option value="annulee">Annulée</option>
          </select>
        </div>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-10 text-center">
            <p className="text-muted-foreground text-sm">Aucune commande trouvée.</p>
          </div>
        )}
        {filtered.map((order) => {
          const sc = statusConfig[order.status];
          const StatusIcon = sc.icon;
          return (
            <div key={order.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Order ID + date */}
                <div className="shrink-0 lg:w-36">
                  <p className="text-xs font-bold text-primary">{order.id}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{order.date}</p>
                </div>

                {/* Customer info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">{order.customer.avatar}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-foreground truncate">{order.customer.name}</p>
                      {order.customer.verified && (
                        <CheckCircleSolid className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{order.customer.company}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <PhoneIcon className="w-3 h-3" />
                        {order.customer.phone}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground hidden sm:flex">
                        <MapPinIcon className="w-3 h-3" />
                        {order.customer.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0 lg:border-l lg:border-border lg:pl-4">
                  <p className="text-sm font-semibold text-foreground truncate">{order.product.name}</p>
                  <p className="text-xs text-muted-foreground">{order.product.category} · {order.product.quantity}</p>
                  <p className="text-sm font-bold text-primary mt-1">{formatCDF(order.product.total)}</p>
                </div>

                {/* Status + action */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${sc.bg}`}>
                    <StatusIcon className={`w-3.5 h-3.5 ${sc.color}`} />
                    <span className={`text-xs font-semibold ${sc.color}`}>{sc.label}</span>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                    title="Voir les détails"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note */}
              {order.note && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground italic">📝 {order.note}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground text-sm">{selectedOrder.id}</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.date}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${statusConfig[selectedOrder.status].bg}`}>
                <span className={`text-xs font-semibold ${statusConfig[selectedOrder.status].color}`}>
                  {statusConfig[selectedOrder.status].label}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer section */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Informations du client
                </p>
                <div className="bg-secondary rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">{selectedOrder.customer.avatar}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-foreground text-sm">{selectedOrder.customer.name}</p>
                        {selectedOrder.customer.verified && (
                          <CheckCircleSolid className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedOrder.customer.company}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <PhoneIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <EnvelopeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPinIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm text-foreground">{selectedOrder.customer.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product section */}
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Produit commandé
                </p>
                <div className="bg-secondary rounded-xl p-4">
                  <p className="font-bold text-foreground text-sm mb-1">{selectedOrder.product.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{selectedOrder.product.category}</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Quantité</p>
                      <p className="text-sm font-semibold text-foreground">{selectedOrder.product.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Prix unitaire</p>
                      <p className="text-sm font-semibold text-foreground">{formatCDF(selectedOrder.product.unitPrice)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-0.5">Total</p>
                      <p className="text-sm font-bold text-primary">{formatCDF(selectedOrder.product.total)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              {selectedOrder.note && (
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note</p>
                  <p className="text-sm text-muted-foreground italic bg-secondary rounded-xl p-3">{selectedOrder.note}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  Fermer
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-colors">
                  Contacter le client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
