'use client';
import React, { useState } from 'react';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShoppingCartIcon,
  BuildingOfficeIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  MapPinIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';


type FavType = 'produit' | 'entreprise' | 'fournisseur' | 'service';

interface FavoriteItem {
  id: number;
  type: FavType;
  name: string;
  subtitle: string;
  location?: string;
  price?: string;
  rating: number;
  reviews: number;
  category: string;
  addedDate: string;
  initials: string;
}

const favorites: FavoriteItem[] = [
  { id: 1, type: 'produit', name: 'Café Robusta Premium 50kg', subtitle: 'Congo Agro Export', location: 'Kinshasa', price: '225 000 CDF', rating: 4.8, reviews: 124, category: 'Agriculture', addedDate: '15 Juil 2024', initials: 'CA' },
  { id: 2, type: 'entreprise', name: 'TechKongo SARL', subtitle: 'Solutions informatiques', location: 'Kinshasa', rating: 4.6, reviews: 89, category: 'Technologie', addedDate: '12 Juil 2024', initials: 'TK' },
  { id: 3, type: 'produit', name: 'Panneau Solaire 300W Monocristallin', subtitle: 'SolarCongo', location: 'Lubumbashi', price: '85 000 CDF', rating: 4.9, reviews: 56, category: 'Énergie', addedDate: '10 Juil 2024', initials: 'SC' },
  { id: 4, type: 'fournisseur', name: 'Groupe Mutombo Trading', subtitle: 'Grossiste multi-secteurs', location: 'Kinshasa', rating: 4.5, reviews: 203, category: 'Commerce', addedDate: '08 Juil 2024', initials: 'GM' },
  { id: 5, type: 'service', name: 'Design & Branding Pro', subtitle: 'Ange Kabila Studio', location: 'Remote', price: '150 000 CDF/projet', rating: 4.7, reviews: 41, category: 'Design', addedDate: '05 Juil 2024', initials: 'AK' },
  { id: 6, type: 'produit', name: 'Tissu Wax Africain Premium', subtitle: 'Mode Congo', location: 'Matadi', price: '3 500 CDF/m', rating: 4.4, reviews: 78, category: 'Mode', addedDate: '01 Juil 2024', initials: 'MC' },
  { id: 7, type: 'entreprise', name: 'BTP Solutions Congo', subtitle: 'Construction & Rénovation', location: 'Goma', rating: 4.3, reviews: 167, category: 'BTP', addedDate: '28 Juin 2024', initials: 'BS' },
];

const typeConfig: Record<FavType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  produit: { label: 'Produit', icon: TagIcon, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  entreprise: { label: 'Entreprise', icon: BuildingOfficeIcon, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  fournisseur: { label: 'Fournisseur', icon: TruckIcon, color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  service: { label: 'Service', icon: WrenchScrewdriverIcon, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
};

const tabs: { key: FavType | 'tous'; label: string }[] = [
  { key: 'tous', label: 'Tous' },
  { key: 'produit', label: 'Produits' },
  { key: 'entreprise', label: 'Entreprises' },
  { key: 'fournisseur', label: 'Fournisseurs' },
  { key: 'service', label: 'Services' },
];

export default function FavorisPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FavType | 'tous'>('tous');
  const [items, setItems] = useState<FavoriteItem[]>(favorites);

  const filtered = items.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'tous' || item.type === activeTab;
    return matchSearch && matchTab;
  });

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const counts: Record<FavType | 'tous', number> = {
    tous: items.length,
    produit: items.filter((i) => i.type === 'produit').length,
    entreprise: items.filter((i) => i.type === 'entreprise').length,
    fournisseur: items.filter((i) => i.type === 'fournisseur').length,
    service: items.filter((i) => i.type === 'service').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Mes favoris</h1>
        <p className="text-sm text-muted-foreground">Retrouvez tous vos produits, entreprises et services sauvegardés.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Total favoris</p>
          <p className="text-2xl font-extrabold text-foreground">{items.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Produits</p>
          <p className="text-2xl font-extrabold text-blue-400">{counts.produit}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Entreprises</p>
          <p className="text-2xl font-extrabold text-purple-400">{counts.entreprise}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Services</p>
          <p className="text-2xl font-extrabold text-amber-400">{counts.service}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <div className="relative mb-3">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher dans mes favoris..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-white/20' : 'bg-border'
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const tc = typeConfig[item.type];
            const TypeIcon = tc.icon;
            return (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
                {/* Top */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-extrabold text-primary">{item.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-bold text-foreground leading-snug line-clamp-2">{item.name}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="shrink-0 p-1 text-red-400/60 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Retirer des favoris"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-semibold ${tc.bg} ${tc.color}`}>
                    <TypeIcon className="w-2.5 h-2.5" />
                    {tc.label}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                    {item.category}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPinIcon className="w-3 h-3" />
                      {item.location}
                    </span>
                  )}
                </div>

                {/* Rating + price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <StarIcon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-foreground">{item.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({item.reviews})</span>
                  </div>
                  {item.price && (
                    <span className="text-xs font-bold text-primary">{item.price}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[10px] text-muted-foreground">Ajouté le {item.addedDate}</span>
                  <div className="flex gap-1.5">
                    {item.type === 'produit' && (
                      <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 transition-colors">
                        <ShoppingCartIcon className="w-3 h-3" />
                        Acheter
                      </button>
                    )}
                    <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-muted-foreground text-[10px] font-semibold hover:text-foreground hover:border-primary/40 transition-colors">
                      <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <HeartIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground mb-1">Aucun favori trouvé</p>
          <p className="text-xs text-muted-foreground/60">
            {search ? 'Essayez un autre terme de recherche.' : 'Ajoutez des produits, entreprises ou services à vos favoris.'}
          </p>
        </div>
      )}
    </div>
  );
}
