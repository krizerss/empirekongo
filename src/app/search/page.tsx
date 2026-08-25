'use client';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { MagnifyingGlassIcon, XMarkIcon, MapPinIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

type Tab = 'produits' | 'fournisseurs' | 'entreprises';

interface ProductResult {
  id: number;
  name: string;
  vendor: string;
  price: string;
  category: string;
  city: string;
  image: string;
  alt: string;
  rating: number;
  verified: boolean;
  isPromo?: boolean;
  promoLabel?: string;
}

interface SupplierResult {
  id: number;
  name: string;
  logo: string;
  logoAlt: string;
  category: string;
  city: string;
  products: number;
  rating: number;
  reviews: number;
  verified: boolean;
  type: string;
}

interface CompanyResult {
  id: number;
  name: string;
  logo: string;
  logoAlt: string;
  sector: string;
  city: string;
  employees: string;
  rating: number;
  verified: boolean;
}

const allProducts: ProductResult[] = [
{ id: 1, name: 'Café Robusta du Kongo', vendor: 'Kongo Agro SARL', price: '25,000 FC', category: 'Agriculture', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png', alt: 'Grains de café robusta brun foncé dans un sac en jute', rating: 4.8, verified: true },
{ id: 2, name: 'Huile de Palme Naturelle', vendor: 'Saveurs du Kongo', price: '15,000 FC', category: 'Agroalimentaire', city: 'Boma', image: "https://img.rocket.new/generatedImages/rocket_gen_img_100f6c606-1772807125471.png", alt: "Bouteille d'huile de palme rouge orangée", rating: 4.6, verified: true, isPromo: true, promoLabel: '-20%' },
{ id: 3, name: 'Panneaux Solaires 300W', vendor: 'Green Energie', price: '450,000 FC', category: 'Énergie', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_107b227ae-1780819347412.png", alt: 'Panneau solaire photovoltaïque bleu', rating: 4.7, verified: true },
{ id: 4, name: 'Tissu Wax Africain', vendor: 'Mode Congo', price: '35,000 FC', category: 'Mode & Beauté', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png', alt: 'Tissu wax africain coloré avec motifs géométriques', rating: 4.8, verified: false },
{ id: 5, name: 'Miel Naturel', vendor: 'Kongo Agro SARL', price: '7,000 FC', category: 'Agriculture', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b9932d16-1772872383455.png", alt: 'Pot de miel naturel doré avec rayon de miel', rating: 4.9, verified: true },
{ id: 6, name: 'Ciment Portland 50kg', vendor: 'EcoBuild SARL', price: '18,000 FC', category: 'BTP & Matériaux', city: 'Matadi', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3a5dfb7-1772551496700.png", alt: 'Sacs de ciment empilés sur chantier de construction', rating: 4.2, verified: false }];


const allSuppliers: SupplierResult[] = [
{ id: 1, name: 'Kongo Agro SARL', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png", logoAlt: 'Logo Kongo Agro SARL', category: 'Agriculture', city: 'Kinshasa', products: 48, rating: 4.8, reviews: 312, verified: true, type: 'Producteur' },
{ id: 2, name: 'EcoBuild SARL', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_158e26c32-1787646508677.png", logoAlt: 'Logo EcoBuild SARL', category: 'BTP & Matériaux', city: 'Matadi', products: 67, rating: 4.2, reviews: 145, verified: false, type: 'Grossiste' },
{ id: 3, name: 'Green Energie', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1e6a434cd-1787646508253.png", logoAlt: 'Logo Green Energie', category: 'Énergie', city: 'Kinshasa', products: 23, rating: 4.7, reviews: 89, verified: true, type: 'Importateur' },
{ id: 4, name: 'TechKongo Solutions', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1da3a8ebb-1787646508221.png", logoAlt: 'Logo TechKongo Solutions', category: 'Technologie', city: 'Kinshasa', products: 31, rating: 4.5, reviews: 201, verified: true, type: 'Distributeur' }];


const allCompanies: CompanyResult[] = [
{ id: 1, name: 'Kongo Industries', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_18e854107-1787646507146.png", logoAlt: 'Logo Kongo Industries', sector: 'Industrie', city: 'Kinshasa', employees: '50-200', rating: 4.6, verified: true },
{ id: 2, name: 'BTP Congo SARL', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1b7c298dc-1787646508084.png", logoAlt: 'Logo BTP Congo SARL', sector: 'Construction', city: 'Matadi', employees: '20-50', rating: 4.3, verified: true },
{ id: 3, name: 'Énergie Verte RDC', logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1db7085-1787646506828.png", logoAlt: 'Logo Énergie Verte RDC', sector: 'Énergie', city: 'Kinshasa', employees: '10-20', rating: 4.7, verified: false }];


const suggestions = ['Café', 'Huile de palme', 'Panneaux solaires', 'Tissu wax', 'Ciment', 'Miel', 'Riz', 'Poulet'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('produits');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterCity, setFilterCity] = useState('Toutes');
  const [filterVerified, setFilterVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setIsLoading(true);
    setHasSearched(true);
    setTimeout(() => setIsLoading(false), 600);
  };

  const filteredProducts = allProducts.filter((p) => {
    const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()) || p.vendor.toLowerCase().includes(query.toLowerCase());
    const matchCity = filterCity === 'Toutes' || p.city === filterCity;
    const matchVerified = !filterVerified || p.verified;
    return matchQuery && matchCity && matchVerified;
  });

  const filteredSuppliers = allSuppliers.filter((s) => {
    const matchQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase());
    const matchCity = filterCity === 'Toutes' || s.city === filterCity;
    const matchVerified = !filterVerified || s.verified;
    return matchQuery && matchCity && matchVerified;
  });

  const filteredCompanies = allCompanies.filter((c) => {
    const matchQuery = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.sector.toLowerCase().includes(query.toLowerCase());
    const matchCity = filterCity === 'Toutes' || c.city === filterCity;
    const matchVerified = !filterVerified || c.verified;
    return matchQuery && matchCity && matchVerified;
  });

  const tabs: {key: Tab;label: string;count: number;}[] = [
  { key: 'produits', label: 'Produits', count: filteredProducts.length },
  { key: 'fournisseurs', label: 'Fournisseurs', count: filteredSuppliers.length },
  { key: 'entreprises', label: 'Entreprises', count: filteredCompanies.length }];


  const cities = ['Toutes', 'Kinshasa', 'Boma', 'Matadi', 'Lubumbashi', 'Goma'];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Search Hero */}
        <section className="bg-gradient-to-b from-[#1A1A1A] to-background border-b border-border py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-extrabold text-center mb-6">
              Rechercher sur <span className="gold-text">EmpireKongo</span>
            </h1>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Produits, fournisseurs, entreprises..."
                className="w-full pl-12 pr-28 py-4 bg-secondary border border-border rounded-2xl text-base focus:outline-none focus:border-primary transition-colors" />
              
              {query &&
              <button onClick={() => {setQuery('');setHasSearched(false);}} className="absolute right-20 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              }
              <button
                onClick={() => handleSearch(query)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
                
                Chercher
              </button>
            </div>

            {/* Suggestions */}
            {!hasSearched &&
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) =>
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="px-3 py-1.5 bg-secondary border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                
                    {s}
                  </button>
              )}
              </div>
            }
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Empty State — No search yet */}
          {!hasSearched &&
          <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <MagnifyingGlassIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-bold mb-2">Commencez votre recherche</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Tapez un mot-clé pour trouver des produits, fournisseurs ou entreprises sur EmpireKongo.
              </p>
            </div>
          }

          {/* Loading */}
          {isLoading &&
          <div className="flex flex-col items-center py-20 gap-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Recherche en cours...</p>
            </div>
          }

          {/* Results */}
          {hasSearched && !isLoading &&
          <>
              {/* Tabs + Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                  {tabs.map((tab) =>
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key ?
                  'bg-primary text-primary-foreground' :
                  'text-muted-foreground hover:text-foreground'}`
                  }>
                  
                      {tab.label}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary-foreground/20' : 'bg-border'}`}>
                        {tab.count}
                      </span>
                    </button>
                )}
                </div>
                <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-xl text-sm hover:border-primary/50 transition-colors">
                
                  <FunnelIcon className="w-4 h-4" />
                  Filtres
                  {(filterCity !== 'Toutes' || filterVerified) &&
                <span className="w-2 h-2 rounded-full bg-primary" />
                }
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters &&
            <div className="mb-6 p-4 bg-card border border-border rounded-xl flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Ville</p>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) =>
                  <button
                    key={city}
                    onClick={() => setFilterCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filterCity === city ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`
                    }>
                    
                          {city}
                        </button>
                  )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                    onClick={() => setFilterVerified(!filterVerified)}
                    className={`w-10 h-5 rounded-full transition-colors relative ${filterVerified ? 'bg-primary' : 'bg-secondary border border-border'}`}>
                    
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filterVerified ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-sm text-muted-foreground">Vérifiés uniquement</span>
                    </label>
                  </div>
                </div>
            }

              {/* Results summary */}
              <p className="text-sm text-muted-foreground mb-6">
                {tabs.find((t) => t.key === activeTab)?.count} résultat(s) pour{' '}
                <span className="text-foreground font-medium">"{query}"</span>
              </p>

              {/* Products Tab */}
              {activeTab === 'produits' &&
            <>
                  {filteredProducts.length === 0 ?
              <EmptyState type="produits" query={query} /> :

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filteredProducts.map((p) =>
                <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group block">
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            {p.isPromo &&
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{p.promoLabel}</span>
                    }
                            {p.verified &&
                    <span className="absolute top-2 right-2">
                                <CheckBadgeIcon className="w-5 h-5 text-primary" />
                              </span>
                    }
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.name}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{p.vendor}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-primary font-bold text-sm">{p.price}</span>
                              <div className="flex items-center gap-1">
                                <StarSolid className="w-3.5 h-3.5 text-yellow-400" />
                                <span className="text-xs text-muted-foreground">{p.rating}</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                )}
                    </div>
              }
                </>
            }

              {/* Suppliers Tab */}
              {activeTab === 'fournisseurs' &&
            <>
                  {filteredSuppliers.length === 0 ?
              <EmptyState type="fournisseurs" query={query} /> :

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredSuppliers.map((s) =>
                <Link key={s.id} href={`/fournisseurs/${s.id}`} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-black/30 group">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                              <AppImage src={s.logo} alt={s.logoAlt} width={56} height={56} className="object-cover w-full h-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-sm truncate">{s.name}</h3>
                                {s.verified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{s.type} · {s.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" />{s.city}</div>
                            <div className="flex items-center gap-1"><StarSolid className="w-3.5 h-3.5 text-yellow-400" />{s.rating} ({s.reviews})</div>
                            <span>{s.products} produits</span>
                          </div>
                        </Link>
                )}
                    </div>
              }
                </>
            }

              {/* Companies Tab */}
              {activeTab === 'entreprises' &&
            <>
                  {filteredCompanies.length === 0 ?
              <EmptyState type="entreprises" query={query} /> :

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredCompanies.map((c) =>
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-black/30">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0">
                              <AppImage src={c.logo} alt={c.logoAlt} width={56} height={56} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-bold text-sm">{c.name}</h3>
                                {c.verified && <CheckBadgeIcon className="w-4 h-4 text-primary" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{c.sector}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" />{c.city}</div>
                            <span>{c.employees} employés</span>
                            <div className="flex items-center gap-1"><StarSolid className="w-3.5 h-3.5 text-yellow-400" />{c.rating}</div>
                          </div>
                        </div>
                )}
                    </div>
              }
                </>
            }
            </>
          }
        </div>
      </main>
      <Footer />
    </div>);

}

function EmptyState({ type, query }: {type: string;query: string;}) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">🔍</p>
      <h3 className="text-lg font-bold mb-2">Aucun résultat trouvé</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto">
        Aucun(e) {type} ne correspond à "{query}". Essayez d'autres mots-clés ou modifiez vos filtres.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link href="/store" className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          Parcourir le store
        </Link>
        <Link href="/fournisseurs" className="px-4 py-2 bg-secondary border border-border rounded-xl text-sm font-medium hover:border-primary/50 transition-colors">
          Voir les fournisseurs
        </Link>
      </div>
    </div>);

}