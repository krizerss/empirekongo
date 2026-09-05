'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, XMarkIcon, ShoppingCartIcon, TagIcon, ChevronLeftIcon, ChevronRightIcon, Squares2X2Icon, ListBulletIcon, BoltIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Product {
  id: string;
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

const categoryDefinitions = [
{ label: 'Toutes', icon: '🏪' },
{ label: 'Agriculture', icon: '🌾' },
{ label: 'Élevage', icon: '🐄' },
{ label: 'Agroalimentaire', icon: '🥘' },
{ label: 'Énergie', icon: '⚡' },
{ label: 'BTP & Matériaux', icon: '🏗️' },
{ label: 'Mode & Beauté', icon: '👗' },
{ label: 'Technologie', icon: '💻' }];

const ITEMS_PER_PAGE = 12;

const sortOptions = [
{ value: 'popular', label: 'Plus populaires' },
{ value: 'price_asc', label: 'Prix croissant' },
{ value: 'price_desc', label: 'Prix décroissant' },
{ value: 'rating', label: 'Mieux notés' },
{ value: 'newest', label: 'Nouveautés' }];

export default function StorePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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

  const supabase = useMemo(() => createClient(), []);
  const cities = useMemo(() => ['Toutes', ...Array.from(new Set(products.map((p) => p.city).filter(Boolean))).sort()], [products]);
  const categories = useMemo(() => categoryDefinitions.map((cat) => ({ ...cat, count: cat.label === 'Toutes' ? products.length : products.filter((p) => p.category === cat.label).length })), [products]);

  const mapProduct = (row: any): Product => {
    const priceText = String(row.price ?? '0');
    const numericPrice = Number(priceText.replace(/[^0-9.-]/g, '')) || 0;
    return {
      id: String(row.id),
      name: row.name,
      vendor: row.vendor_name || 'Fournisseur EmpireKongo',
      vendorVerified: row.vendor_verified === true,
      price: priceText,
      priceNum: numericPrice,
      unit: row.unit || '',
      category: row.category || 'Autres',
      city: row.city || row.vendor_city || 'Non précisée',
      image: row.image_url || '/assets/images/placeholder.png',
      alt: row.alt_text || row.name,
      rating: Number(row.rating) || 0,
      reviews: Number(row.review_count) || 0,
      stock: Number(row.stock_qty) || 0,
    };
  };

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      setLoading(true);
      setLoadError(null);
      const { data, error } = await supabase
        .from('products')
        .select('id,name,description,price,unit,category,city,image_url,alt_text,stock_status,stock_qty,rating,review_count,vendor_id,vendor_name,vendor_type,vendor_city,vendor_verified,is_active,created_at,updated_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!active) return;
      if (error) {
        setLoadError('Impossible de charger les produits.');
        setProducts([]);
      } else {
        setProducts((data || []).map(mapProduct));
      }
      setLoading(false);
    };

    loadProducts();

    const channel = supabase
      .channel('store-products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => loadProducts())
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'Toutes') list = list.filter((p) => p.category === selectedCategory);
    if (selectedCity !== 'Toutes') list = list.filter((p) => p.city === selectedCity);
    if (onlyPromo) list = list.filter((p) => p.isPromo);
    if (onlyVerified) list = list.filter((p) => p.vendorVerified);
    list = list.filter((p) => p.priceNum >= priceRange[0] && p.priceNum <= priceRange[1]);
    if (sortBy === 'price_asc') list.sort((a, b) => a.priceNum - b.priceNum);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.priceNum - a.priceNum);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, search, selectedCategory, selectedCity, sortBy, priceRange, onlyPromo, onlyVerified]);

  const sponsored = products.filter((p) => p.isSponsored).slice(0, 3);
  const promos = products.filter((p) => p.isPromo).slice(0, 4);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedCity, sortBy, priceRange, onlyPromo, onlyVerified]);

  const handleOrder = (productId: string) => {
    if (!isLoggedIn) {
      setShowAuthGuard(true);
      return;
    }
    router.push(`/store/product/${productId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="bg-card border-b border-border px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">Store EmpireKongo</h1>
                <p className="text-sm text-muted-foreground mt-1">{loading ? 'Chargement des produits...' : `${filtered.length} produits disponibles`}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}><Squares2X2Icon className="w-4 h-4" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}><ListBulletIcon className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit, un fournisseur..." className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}><AdjustmentsHorizontalIcon className="w-4 h-4" />Filtres</button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors">{sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {showFilters && <aside className="w-64 shrink-0 space-y-6">
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Catégories</h3>
                <div className="space-y-1">{categories.map((cat) => <button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.label ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}><span className="flex items-center gap-2"><span>{cat.icon}</span>{cat.label}</span><span className="text-xs opacity-60">{cat.count}</span></button>)}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Ville</h3>
                <div className="space-y-1">{cities.map((city) => <button key={city} onClick={() => setSelectedCity(city)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === city ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}>{city}</button>)}</div>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground mb-1">Options</h3>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={onlyPromo} onChange={(e) => setOnlyPromo(e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm text-muted-foreground">Promotions uniquement</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-sm text-muted-foreground">Fournisseurs vérifiés</span></label>
              </div>
            </aside>}

            <div className="flex-1 min-w-0 space-y-8">
              {!loading && !loadError && promos.length > 0 && !onlyPromo && <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 rounded-2xl p-5"><div className="flex items-center gap-2 mb-4"><TagIcon className="w-5 h-5 text-primary" /><h2 className="text-base font-extrabold text-foreground">Promotions du moment</h2></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{promos.map((p) => <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group relative overflow-hidden"><div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{p.promoLabel}</div><div className="relative h-28 overflow-hidden"><AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" /></div><div className="p-2"><p className="text-xs font-bold text-foreground line-clamp-1">{p.name}</p><p className="text-xs text-primary font-semibold mt-0.5">{p.price}</p></div></Link>)}</div></div>}

              {!loading && !loadError && sponsored.length > 0 && !onlyPromo && <div><div className="flex items-center gap-2 mb-3"><BoltIcon className="w-4 h-4 text-primary" /><h2 className="text-sm font-bold text-foreground">Produits sponsorisés</h2></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{sponsored.map((p) => <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group flex gap-3 p-3"><div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden"><AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="80px" /></div><div className="flex-1 min-w-0"><span className="text-[9px] font-bold text-primary uppercase tracking-wider">Sponsorisé</span><p className="text-xs font-bold text-foreground line-clamp-2 mt-0.5">{p.name}</p><p className="text-[10px] text-muted-foreground">{p.vendor}</p><p className="text-sm font-extrabold text-primary mt-1">{p.price}</p></div></Link>)}</div></div>}

              <div className="flex gap-2 flex-wrap">{categories.map((cat) => <button key={cat.label} onClick={() => setSelectedCategory(cat.label)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === cat.label ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}><span>{cat.icon}</span>{cat.label}</span></button>)}</div>

              {loading ? <div className="text-center py-20"><p className="text-4xl mb-3">⏳</p><p className="text-foreground font-bold">Chargement des produits</p><p className="text-muted-foreground text-sm mt-1">Connexion à EmpireKongo...</p></div> : loadError ? <div className="text-center py-20"><p className="text-4xl mb-3">⚠️</p><p className="text-foreground font-bold">{loadError}</p><p className="text-muted-foreground text-sm mt-1">Vérifiez votre connexion puis actualisez la page.</p></div> : paginated.length === 0 ? <div className="text-center py-20"><p className="text-4xl mb-3">🔍</p><p className="text-foreground font-bold">Aucun produit trouvé</p><p className="text-muted-foreground text-sm mt-1">Essayez d'autres filtres</p></div> : <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-3'}>{paginated.map((product) => viewMode === 'grid' ? <Link key={product.id} href={`/store/product/${product.id}`} className="product-card group flex flex-col"><div className="relative h-40 overflow-hidden">{product.isPromo && <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{product.promoLabel}</div>}{product.isSponsored && <div className="absolute top-2 right-2 z-10 bg-primary/90 text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full">Sponsorisé</div>}<AppImage src={product.image} alt={product.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" /></div><div className="p-3 flex flex-col flex-1"><p className="text-[10px] text-muted-foreground mb-0.5 flex items-center gap-1">{product.vendor}{product.vendorVerified && <CheckBadgeIcon className="w-3 h-3 text-primary" />}</p><h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{product.name}</h3><div className="flex items-center gap-1 mb-2"><StarSolid className="w-3 h-3 text-primary" /><span className="text-[10px] text-muted-foreground">{product.rating} ({product.reviews})</span></div><div className="flex items-baseline gap-1 mb-2"><span className="text-sm font-extrabold text-primary">{product.price}</span><span className="text-[10px] text-muted-foreground">{product.unit}</span></div><button onClick={(e) => {e.preventDefault();handleOrder(product.id);}} className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-colors"><ShoppingCartIcon className="w-3 h-3" />Commander</button></div></Link> : <Link key={product.id} href={`/store/product/${product.id}`} className="product-card group flex gap-4 p-4"><div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden"><AppImage src={product.image} alt={product.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="96px" /></div><div className="flex-1 min-w-0 flex flex-col justify-between"><div><p className="text-[10px] text-muted-foreground flex items-center gap-1">{product.vendor}{product.vendorVerified && <CheckBadgeIcon className="w-3 h-3 text-primary" />}</p><h3 className="text-sm font-bold text-foreground mt-0.5">{product.name}</h3><div className="flex items-center gap-1 mt-1"><StarSolid className="w-3 h-3 text-primary" /><span className="text-xs text-muted-foreground">{product.rating} ({product.reviews} avis)</span></div></div><div className="flex items-center justify-between mt-2"><div><span className="text-base font-extrabold text-primary">{product.price}</span><span className="text-xs text-muted-foreground ml-1">{product.unit}</span></div><button onClick={(e) => {e.preventDefault();handleOrder(product.id);}} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"><ShoppingCartIcon className="w-3.5 h-3.5" />Commander</button></div></div></Link>)}</div>}

              {totalPages > 1 && <div className="flex items-center justify-center gap-2 pt-4"><button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"><ChevronLeftIcon className="w-4 h-4" /></button>{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-muted-foreground hover:text-foreground'}`}>{page}</button>)}<button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"><ChevronRightIcon className="w-4 h-4" /></button></div>}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showAuthGuard && <AuthGuardModal action="order" onClose={() => setShowAuthGuard(false)} />}
    </div>);
}
