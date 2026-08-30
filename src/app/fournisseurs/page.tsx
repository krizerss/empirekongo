'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';

interface Supplier {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  cover_url: string;
  category: string;
  city: string;
  description: string;
  product_count: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  supplier_type: string;
  founded_year: number | null;
}

const LOGO_ALTS: Record<string, string> = {
  'kongo-agro-sarl': 'Logo Kongo Agro SARL fond vert, entreprise agricole congolaise',
  'ecobuild-sarl': 'Logo EcoBuild SARL fond bleu, entreprise de construction congolaise',
  'green-energie': 'Logo Green Energie fond vert émeraude, entreprise énergétique congolaise',
  'saveurs-du-kongo': 'Logo Saveurs du Kongo fond orange, entreprise agroalimentaire congolaise',
  'techkongo-solutions': 'Logo TechKongo Solutions fond bleu nuit, entreprise technologique congolaise',
  'mode-congo': 'Logo Mode Congo, entreprise de mode et textile africain',
  'congo-elevage-pro': 'Logo Congo Élevage Pro, ferme avicole et bovine congolaise',
  'pharma-kongo': 'Logo Pharma Kongo, distributeur pharmaceutique congolais',
};

const COVER_ALTS: Record<string, string> = {
  'kongo-agro-sarl': 'Champs agricoles verts luxuriants au Congo, ferme agricole africaine en pleine production',
  'ecobuild-sarl': 'Chantier de construction moderne avec grues et matériaux, bâtiment en cours à Matadi',
  'green-energie': 'Panneaux solaires sous ciel bleu africain, installation énergie renouvelable au Congo',
  'saveurs-du-kongo': 'Étalage coloré de fruits et légumes tropicaux africains, marché alimentaire congolais',
  'techkongo-solutions': 'Circuits imprimés et composants électroniques sur fond sombre, technologie africaine innovante',
  'mode-congo': 'Tissu wax africain coloré avec motifs géométriques traditionnels, textile africain authentique',
  'congo-elevage-pro': 'Poulet de ferme bien nourri dans une ferme avicole africaine, élevage traditionnel congolais',
  'pharma-kongo': 'Médicaments et produits pharmaceutiques sur fond blanc, pharmacie professionnelle',
};

export default function FournisseursPage() {
  const supabase = createClient();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('suppliers')
        .select('id, name, slug, logo_url, cover_url, category, city, description, product_count, rating, review_count, is_verified, supplier_type, founded_year')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setSuppliers(data || []);
      }
      setLoading(false);
    }
    fetchSuppliers();
  }, []);

  // Derive dynamic filter options from loaded data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(suppliers.map((s) => s.category).filter(Boolean)));
    return ['Toutes', ...cats];
  }, [suppliers]);

  const types = useMemo(() => {
    const ts = Array.from(new Set(suppliers.map((s) => s.supplier_type).filter(Boolean)));
    return ['Tous', ...ts];
  }, [suppliers]);

  const cities = useMemo(() => {
    const cs = Array.from(new Set(suppliers.map((s) => s.city).filter(Boolean)));
    return ['Toutes', ...cs];
  }, [suppliers]);

  const filtered = useMemo(() => {
    let list = [...suppliers];
    if (search)
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase())
      );
    if (selectedCategory !== 'Toutes') list = list.filter((s) => s.category === selectedCategory);
    if (selectedType !== 'Tous') list = list.filter((s) => s.supplier_type === selectedType);
    if (selectedCity !== 'Toutes') list = list.filter((s) => s.city === selectedCity);
    if (onlyVerified) list = list.filter((s) => s.is_verified);
    return list;
  }, [suppliers, search, selectedCategory, selectedType, selectedCity, onlyVerified]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <div className="bg-card border-b border-border px-4 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-foreground mb-1">Fournisseurs & Entreprises</h1>
              <p className="text-sm text-muted-foreground">
                {loading ? 'Chargement...' : `${filtered.length} fournisseur${filtered.length !== 1 ? 's' : ''} trouvé${filtered.length !== 1 ? 's' : ''} sur EmpireKongo`}
              </p>
            </div>

            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un fournisseur, une entreprise..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                  showFilters
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4" />Filtres
              </button>
            </div>

            {/* Filter chips */}
            {showFilters && (
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Catégorie :</span>
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        selectedCategory === c
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Type :</span>
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        selectedType === t
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Ville :</span>
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCity(c)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        selectedCity === c
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 cursor-pointer self-center">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs text-muted-foreground font-semibold">Vérifiés uniquement</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Chargement des fournisseurs...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="text-foreground font-bold">Erreur de chargement</p>
              <p className="text-muted-foreground text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-foreground font-bold">Aucun fournisseur trouvé</p>
              <p className="text-muted-foreground text-sm mt-1">Essayez d&apos;autres critères de recherche</p>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((supplier) => (
                <div key={supplier.id} className="product-card group flex flex-col overflow-hidden">
                  {/* Cover */}
                  <div className="relative h-28 overflow-hidden">
                    <AppImage
                      src={supplier.cover_url || '/assets/images/no_image.png'}
                      alt={COVER_ALTS[supplier.slug] || `Couverture ${supplier.name}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">
                        {supplier.supplier_type}
                      </span>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="px-4 -mt-6 relative z-10 flex items-end justify-between">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-card bg-card shadow-lg">
                      <AppImage
                        src={supplier.logo_url || '/assets/images/no_image.png'}
                        alt={LOGO_ALTS[supplier.slug] || `Logo ${supplier.name}`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    {supplier.is_verified && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full mb-1">
                        <CheckBadgeIcon className="w-3 h-3" />Vérifié
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="px-4 pt-2 pb-4 flex flex-col flex-1">
                    <h3 className="text-sm font-extrabold text-foreground mb-0.5">{supplier.name}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] text-primary font-semibold">{supplier.category}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPinIcon className="w-3 h-3" />{supplier.city}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{supplier.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-sm font-extrabold text-foreground">{supplier.product_count ?? 0}</p>
                        <p className="text-[10px] text-muted-foreground">Produits</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <StarSolid className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-extrabold text-foreground">{supplier.rating}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{supplier.review_count} avis</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <p className="text-sm font-extrabold text-foreground">{supplier.founded_year ?? '—'}</p>
                        <p className="text-[10px] text-muted-foreground">Fondé</p>
                      </div>
                    </div>

                    <Link
                      href={`/fournisseurs/${supplier.id}`}
                      className="w-full text-center py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-black transition-colors"
                    >
                      Voir le profil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
