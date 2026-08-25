'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon, ShoppingCartIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, ListBulletIcon, BoltIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Product {
  id: number;
  name: string;
  vendor: string;
  vendorVerified: boolean;
  price: string;
  priceNum: number;
  unit: string;
  category: string;
  city: string;
  image: string;
  alt: string;
  rating: number;
  reviews: number;
  isPromo?: boolean;
  promoLabel?: string;
  isSponsored?: boolean;
  stock: number;
}

const categories = [
{ label: 'Toutes', count: 520, icon: '🏪' },
{ label: 'Agriculture', count: 134, icon: '🌾' },
{ label: 'Élevage', count: 67, icon: '🐄' },
{ label: 'Agroalimentaire', count: 89, icon: '🥘' },
{ label: 'Énergie', count: 43, icon: '⚡' },
{ label: 'BTP & Matériaux', count: 56, icon: '🏗️' },
{ label: 'Mode & Beauté', count: 72, icon: '👗' },
{ label: 'Technologie', count: 59, icon: '💻' }];


const allProducts: Product[] = [
{ id: 1, name: 'Café Robusta du Kongo', vendor: 'Kongo Agro SARL', vendorVerified: true, price: '25,000 FC', priceNum: 25000, unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png', alt: 'Grains de café robusta brun foncé dans un sac en jute, café artisanal congolais de qualité premium', rating: 4.8, reviews: 124, isSponsored: true, stock: 500 },
{ id: 2, name: 'Huile de Palme Naturelle', vendor: 'Saveurs du Kongo', vendorVerified: true, price: '15,000 FC', priceNum: 15000, unit: '/ Litre', category: 'Agroalimentaire', city: 'Boma', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dbae1103-1779692655900.png', alt: "Bouteille d'huile de palme rouge orangée sur fond sombre, produit naturel africain", rating: 4.6, reviews: 89, isPromo: true, promoLabel: '-20%', stock: 200 },
{ id: 3, name: 'Maïs Séché', vendor: 'Kongo Agro SARL', vendorVerified: true, price: '8,000 FC', priceNum: 8000, unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f701f8b-1772059631290.png", alt: 'Épis de maïs jaune doré séchés au soleil, céréale de base congolaise', rating: 4.5, reviews: 67, stock: 1000 },
{ id: 4, name: 'Savon Artisanal', vendor: 'Saveurs du Kongo', vendorVerified: true, price: '3,500 FC', priceNum: 3500, unit: '/ Pièce', category: 'Mode & Beauté', city: 'Boma', image: 'https://images.unsplash.com/photo-1612799897476-e6e6e663f337', alt: 'Savons artisanaux aux huiles naturelles empilés avec fleurs séchées, savonnerie artisanale', rating: 4.7, reviews: 203, isPromo: true, promoLabel: '-15%', stock: 300 },
{ id: 5, name: 'Miel Naturel', vendor: 'Kongo Agro SARL', vendorVerified: true, price: '7,000 FC', priceNum: 7000, unit: '/ Pot', category: 'Agriculture', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bd4d46c0-1766748178463.png', alt: 'Pot de miel naturel doré avec rayon de miel, apiculture congolaise traditionnelle', rating: 4.9, reviews: 156, stock: 150 },
{ id: 6, name: 'Riz Local', vendor: 'Saveurs du Kongo', vendorVerified: true, price: '6,000 FC', priceNum: 6000, unit: '/ Kg', category: 'Agroalimentaire', city: 'Boma', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17814ecf6-1784370699737.png", alt: 'Riz blanc local dans un bol en bois sur fond sombre, céréale cultivée localement en RDC', rating: 4.4, reviews: 78, stock: 800 },
{ id: 7, name: 'Panneaux Solaires 300W', vendor: 'Green Energie', vendorVerified: true, price: '450,000 FC', priceNum: 450000, unit: '/ Unité', category: 'Énergie', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png', alt: 'Panneau solaire photovoltaïque bleu sur fond ciel africain, énergie renouvelable au Congo', rating: 4.7, reviews: 45, isSponsored: true, stock: 30 },
{ id: 8, name: 'Ciment Portland 50kg', vendor: 'EcoBuild SARL', vendorVerified: false, price: '18,000 FC', priceNum: 18000, unit: '/ Sac', category: 'BTP & Matériaux', city: 'Matadi', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13de156d2-1772741976528.png', alt: 'Sacs de ciment empilés sur chantier de construction, matériaux de construction congolais', rating: 4.2, reviews: 34, stock: 600 },
{ id: 9, name: 'Poulet de Ferme', vendor: 'Kongo Agro SARL', vendorVerified: true, price: '12,000 FC', priceNum: 12000, unit: '/ Kg', category: 'Élevage', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png', alt: 'Poulet de ferme bien nourri dans une ferme avicole africaine, élevage traditionnel congolais', rating: 4.6, reviews: 91, stock: 80 },
{ id: 10, name: 'Smartphone Réparation', vendor: 'TechKongo Solutions', vendorVerified: true, price: '25,000 FC', priceNum: 25000, unit: '/ Service', category: 'Technologie', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1fe7f5850-1772260058846.png', alt: 'Technicien réparant smartphone avec outils de précision, service technologique congolais', rating: 4.5, reviews: 112, stock: 999 },
{ id: 11, name: 'Tomates Fraîches', vendor: 'Saveurs du Kongo', vendorVerified: true, price: '4,000 FC', priceNum: 4000, unit: '/ Kg', category: 'Agriculture', city: 'Boma', image: 'https://images.unsplash.com/photo-1667986968934-bf1fd9db241f', alt: 'Tomates fraîches rouges brillantes sur fond sombre, légumes frais du jardin congolais', rating: 4.3, reviews: 55, isPromo: true, promoLabel: '-10%', stock: 400 },
{ id: 12, name: 'Tissu Wax Africain', vendor: 'Mode Congo', vendorVerified: false, price: '35,000 FC', priceNum: 35000, unit: '/ Mètre', category: 'Mode & Beauté', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png', alt: 'Tissu wax africain coloré avec motifs géométriques traditionnels, textile africain authentique', rating: 4.8, reviews: 178, stock: 250 },
{ id: 13, name: 'Batterie Lithium 200Ah', vendor: 'Green Energie', vendorVerified: true, price: '320,000 FC', priceNum: 320000, unit: '/ Unité', category: 'Énergie', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c7840ec5-1766559134167.png", alt: 'Batterie lithium-ion de grande capacité pour stockage énergie solaire, technologie verte', rating: 4.6, reviews: 28, stock: 15 },
{ id: 14, name: 'Fer à Béton 12mm', vendor: 'EcoBuild SARL', vendorVerified: false, price: '22,000 FC', priceNum: 22000, unit: '/ Barre', category: 'BTP & Matériaux', city: 'Matadi', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bcf9ad31-1765031427300.png", alt: 'Barres de fer à béton empilées sur chantier, matériaux de construction métalliques', rating: 4.1, reviews: 19, stock: 1200 },
{ id: 15, name: 'Poisson Fumé', vendor: 'Saveurs du Kongo', vendorVerified: true, price: '9,500 FC', priceNum: 9500, unit: '/ Kg', category: 'Agroalimentaire', city: 'Boma', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17a4bff08-1773092221968.png", alt: 'Poissons fumés dorés sur fond sombre, spécialité culinaire congolaise traditionnelle', rating: 4.7, reviews: 143, isSponsored: true, stock: 120 },
{ id: 16, name: 'Ordinateur Portable Reconditionné', vendor: 'TechKongo Solutions', vendorVerified: true, price: '180,000 FC', priceNum: 180000, unit: '/ Unité', category: 'Technologie', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18e55d832-1787646508931.png", alt: 'Ordinateur portable reconditionné ouvert sur fond sombre, technologie accessible au Congo', rating: 4.4, reviews: 67, isPromo: true, promoLabel: '-25%', stock: 20 }];


const ITEMS_PER_PAGE = 12;

const sortOptions = [
{ value: 'popular', label: 'Plus populaires' },
{ value: 'price_asc', label: 'Prix croissant' },
{ value: 'price_desc', label: 'Prix décroissant' },
{ value: 'rating', label: 'Mieux notés' },
{ value: 'newest', label: 'Nouveautés' }];


export default function StorePage() {
  const { isLoggedIn } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [onlyPromo, setOnlyPromo] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const cities = ['Toutes', 'Kinshasa', 'Boma', 'Matadi', 'Lubumbashi', 'Goma'];

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'Toutes') list = list.filter((p) => p.category === selectedCategory);
    if (selectedCity !== 'Toutes') list = list.filter((p) => p.city === selectedCity);
    if (onlyPromo) list = list.filter((p) => p.isPromo);
    if (onlyVerified) list = list.filter((p) => p.vendorVerified);
    list = list.filter((p) => p.priceNum >= priceRange[0] && p.priceNum <= priceRange[1]);
    if (sortBy === 'price_asc') list.sort((a, b) => a.priceNum - b.priceNum);else
    if (sortBy === 'price_desc') list.sort((a, b) => b.priceNum - a.priceNum);else
    if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, selectedCategory, selectedCity, sortBy, priceRange, onlyPromo, onlyVerified]);

  const sponsored = allProducts.filter((p) => p.isSponsored).slice(0, 3);
  const promos = allProducts.filter((p) => p.isPromo).slice(0, 4);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleOrder = () => {
    if (!isLoggedIn) setShowAuthGuard(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="bg-card border-b border-border px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Store EmpireKongo</h1>
                <p className="text-sm text-muted-foreground mt-1">{filtered.length} produits disponibles</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {setSearch(e.target.value);setCurrentPage(1);}}
                  placeholder="Rechercher un produit, un fournisseur..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                
                {search &&
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                }
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                Filtres
              </button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors">
                {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            {showFilters &&
            <aside className="w-64 shrink-0 space-y-6">
                {/* Categories */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-bold text-foreground mb-3">Catégories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) =>
                  <button key={cat.label} onClick={() => {setSelectedCategory(cat.label);setCurrentPage(1);}} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.label ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                        <span className="flex items-center gap-2"><span>{cat.icon}</span>{cat.label}</span>
                        <span className="text-xs opacity-60">{cat.count}</span>
                      </button>
                  )}
                  </div>
                </div>

                {/* City */}
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-bold text-foreground mb-3">Ville</h3>
                  <div className="space-y-1">
                    {cities.map((city) =>
                  <button key={city} onClick={() => {setSelectedCity(city);setCurrentPage(1);}} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === city ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>
                        {city}
                      </button>
                  )}
                  </div>
                </div>

                {/* Options */}
                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-foreground mb-1">Options</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Promotions uniquement</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-muted-foreground">Fournisseurs vérifiés</span>
                  </label>
                </div>
              </aside>
            }

            <div className="flex-1 min-w-0 space-y-8">
              {/* Promotions Banner */}
              {!onlyPromo &&
              <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <TagIcon className="w-5 h-5 text-primary" />
                    <h2 className="text-base font-extrabold text-foreground">Promotions du moment</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {promos.map((p) =>
                  <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group relative overflow-hidden">
                        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.promoLabel}</div>
                        <div className="relative h-28 overflow-hidden">
                          <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-bold text-foreground line-clamp-1">{p.name}</p>
                          <p className="text-xs text-primary font-semibold mt-0.5">{p.price}</p>
                        </div>
                      </Link>
                  )}
                  </div>
                </div>
              }

              {/* Sponsored */}
              {!onlyPromo &&
              <div>
                  <div className="flex items-center gap-2 mb-3">
                    <BoltIcon className="w-4 h-4 text-primary" />
                    <h2 className="text-sm font-bold text-foreground">Produits sponsorisés</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {sponsored.map((p) =>
                  <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group flex gap-3 p-3">
                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                          <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="80px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Sponsorisé</span>
                          <p className="text-xs font-bold text-foreground line-clamp-2 mt-0.5">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground">{p.vendor}</p>
                          <p className="text-sm font-extrabold text-primary mt-1">{p.price}</p>
                        </div>
                      </Link>
                  )}
                  </div>
                </div>
              }

              {/* Category chips */}
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) =>
                <button key={cat.label} onClick={() => {setSelectedCategory(cat.label);setCurrentPage(1);}} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === cat.label ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}>
                    <span>{cat.icon}</span>{cat.label}
                  </button>
                )}
              </div>

              {/* Products Grid */}
              {paginated.length === 0 ?
              <div className="text-center py-20">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-foreground font-bold">Aucun produit trouvé</p>
                  <p className="text-muted-foreground text-sm mt-1">Essayez d'autres filtres</p>
                </div> :

              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>
                  {paginated.map((product) =>
                viewMode === 'grid' ?
                <Link key={product.id} href={`/store/product/${product.id}`} className="product-card group flex flex-col">
                        <div className="relative h-40 overflow-hidden">
                          {product.isPromo && <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{product.promoLabel}</div>}
                          {product.isSponsored && <div className="absolute top-2 right-2 z-10 bg-primary/90 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">Sponsorisé</div>}
                          <AppImage src={product.image} alt={product.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">
                            {product.vendor}
                            {product.vendorVerified && <CheckBadgeIcon className="w-3 h-3 text-primary" />}
                          </p>
                          <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{product.name}</h3>
                          <div className="flex items-center gap-1 mb-2">
                            <StarSolid className="w-3 h-3 text-primary" />
                            <span className="text-[10px] text-muted-foreground">{product.rating} ({product.reviews})</span>
                          </div>
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-sm font-extrabold text-primary">{product.price}</span>
                            <span className="text-[10px] text-muted-foreground">{product.unit}</span>
                          </div>
                          <button onClick={(e) => {e.preventDefault();handleOrder();}} className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-colors">
                            <ShoppingCartIcon className="w-3 h-3" />Commander
                          </button>
                        </div>
                      </Link> :

                <Link key={product.id} href={`/store/product/${product.id}`} className="product-card group flex gap-4 p-4">
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                          <AppImage src={product.image} alt={product.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">{product.vendor}{product.vendorVerified && <CheckBadgeIcon className="w-3 h-3 text-primary" />}</p>
                            <h3 className="text-sm font-bold text-foreground mt-0.5">{product.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <StarSolid className="w-3 h-3 text-primary" />
                              <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews} avis)</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div>
                              <span className="text-base font-extrabold text-primary">{product.price}</span>
                              <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
                            </div>
                            <button onClick={(e) => {e.preventDefault();handleOrder();}} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors">
                              <ShoppingCartIcon className="w-3.5 h-3.5" />Commander
                            </button>
                          </div>
                        </div>
                      </Link>

                )}
                </div>
              }

              {/* Pagination */}
              {totalPages > 1 &&
              <div className="flex items-center justify-center gap-2 pt-4">
                  <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
                <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'}`}>
                      {page}
                    </button>
                )}
                  <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors">
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showAuthGuard && <AuthGuardModal action="order" onClose={() => setShowAuthGuard(false)} />}
    </div>);

}