'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon, MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { getMarketplaceProducts } from '@/lib/supabase/database';

interface DbProduct {
  id: string; name: string; description: string | null; category: string | null;
  price: string | number | null; unit: string | null; image_url: string | null;
  vendor_id: string | null; vendor_name: string | null; vendor_city: string | null;
  vendor_verified: boolean | null; rating: number | null; review_count: number | null;
  favorite_count: number | null; created_at: string;
}

const fallbackImage = '/assets/images/no_image.png';
const formatPrice = (value: string | number | null) => {
  if (value === null || value === undefined || value === '') return 'Prix sur demande';
  const numeric = Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(numeric) ? `${new Intl.NumberFormat('fr-FR').format(numeric)} FC` : String(value);
};

export default function MarketplaceContent() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Toutes catégories');
  const [city, setCity] = useState('Toutes les villes');
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = async () => {
    try {
      setError('');
      const rows = await getMarketplaceProducts();
      setProducts(rows as DbProduct[]);
    } catch (err) {
      console.error('Marketplace products error:', err);
      setError('Impossible de charger les produits pour le moment.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadProducts(); }, []);

  const categories = useMemo(() => ['Toutes catégories', ...Array.from(new Set(products.map(p => p.category || 'Autres')))], [products]);
  const cities = useMemo(() => ['Toutes les villes', ...Array.from(new Set(products.map(p => p.vendor_city || 'RDC')))], [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter(product => {
      const haystack = [product.name, product.vendor_name, product.category, product.vendor_city, product.description].filter(Boolean).join(' ').toLowerCase();
      return (!query || haystack.includes(query)) &&
        (category === 'Toutes catégories' || (product.category || 'Autres') === category) &&
        (city === 'Toutes les villes' || (product.vendor_city || 'RDC') === city);
    });
  }, [products, search, category, city]);

  const displayedProducts = useMemo(() => {
    const defaultView = !search.trim() && category === 'Toutes catégories' && city === 'Toutes les villes';
    return defaultView ? filteredProducts.slice(0, 5) : filteredProducts;
  }, [filteredProducts, search, category, city]);

  return (
    <section className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="mb-2 text-sm font-medium text-primary">Marketplace EmpireKongo</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Les produits les plus populaires</h1><p className="mt-2 max-w-2xl text-muted-foreground">Les produits réellement publiés sur EmpireKongo, classés par popularité.</p></div>
          <button onClick={() => setShowFilters(v => !v)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted"><AdjustmentsHorizontalIcon className="h-5 w-5" /> Filtres</button>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1"><MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un produit ou une entreprise..." className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-10 outline-none focus:border-primary" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><XMarkIcon className="h-5 w-5 text-muted-foreground" /></button>}</div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-primary">{categories.map(item => <option key={item}>{item}</option>)}</select>
          <select value={city} onChange={e => setCity(e.target.value)} className="rounded-lg border border-border bg-card px-4 py-3 outline-none focus:border-primary">{cities.map(item => <option key={item}>{item}</option>)}</select>
        </div>

        {showFilters && <div className="mb-6 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Le classement initial utilise le nombre réel de favoris enregistrés dans Supabase.</div>}

        {loading ? <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{Array.from({length:5}).map((_,i)=><div key={i} className="h-80 animate-pulse rounded-xl border border-border bg-card" />)}</div> : error ? <div className="rounded-xl border border-border bg-card p-8 text-center"><p>{error}</p><button onClick={() => {setLoading(true);void loadProducts();}} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Réessayer</button></div> : displayedProducts.length === 0 ? <div className="rounded-xl border border-border bg-card p-12 text-center"><p className="font-semibold">Aucun produit trouvé</p></div> : <>
          <div className="mb-4 flex items-center justify-between"><p className="text-sm text-muted-foreground">{!search && category === 'Toutes catégories' && city === 'Toutes les villes' ? 'Top 5 des produits les plus favoris' : `${displayedProducts.length} produit(s)`}</p></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {displayedProducts.map(product => {
              const image = product.image_url || fallbackImage;
              const favorites = Number(product.favorite_count || 0);
              const rating = Number(product.rating || 0);
              return <Link key={product.id} href={`/store/product/${product.id}`} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted"><AppImage src={image} alt={product.name} fill className="object-cover transition duration-300 group-hover:scale-105" />{favorites > 0 && <div className="absolute right-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">♥ {favorites}</div>}</div>
                <div className="p-4"><div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPinIcon className="h-3.5 w-3.5" />{product.vendor_city || 'RDC'}</div><h2 className="line-clamp-2 min-h-10 font-semibold group-hover:text-primary">{product.name}</h2><div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><span className="truncate">{product.vendor_name || 'Vendeur EmpireKongo'}</span>{product.vendor_verified && <CheckBadgeIcon className="h-4 w-4 shrink-0 text-primary" />}</div><div className="mt-3 flex items-center justify-between gap-2"><span className="font-bold">{formatPrice(product.price)}</span>{product.unit && <span className="text-xs text-muted-foreground">{product.unit}</span>}</div><div className="mt-3 flex items-center gap-1 text-xs"><StarSolid className="h-4 w-4" /><span>{rating > 0 ? rating.toFixed(1) : 'Nouveau'}</span>{Number(product.review_count || 0) > 0 && <span className="text-muted-foreground">({product.review_count})</span>}</div></div>
              </Link>;
            })}
          </div>
        </>}
      </div>
    </section>
  );
}
