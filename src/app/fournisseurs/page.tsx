'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { MagnifyingGlassIcon, MapPinIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Supplier {
  id: string; name: string; logo: string; logoAlt: string; cover: string; coverAlt: string;
  category: string; city: string; description: string; products: number; rating: number;
  reviews: number; verified: boolean; type: string; founded: string;
}

const FALLBACK_IMAGE = '/assets/images/no_image.png';
const categories = ['Toutes', 'Agriculture', 'Agroalimentaire', 'BTP & Matériaux', 'Énergie', 'Technologie', 'Mode & Beauté', 'Élevage', 'Santé'];
const types = ['Tous', 'Producteur', 'Grossiste', 'Importateur', 'Fabricant', 'Distributeur'];
const supplierTypes = new Set(['producteur', 'grossiste', 'importateur', 'fabricant', 'distributeur']);
const cities = ['Toutes', 'Kinshasa', 'Boma', 'Matadi', 'Lubumbashi', 'Goma'];

function normalizeType(value: unknown): string {
  return String(value ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function displayType(value: unknown): string {
  const normalized = normalizeType(value);
  const labels: Record<string, string> = {
    producteur: 'Producteur',
    grossiste: 'Grossiste',
    importateur: 'Importateur',
    fabricant: 'Fabricant',
    distributeur: 'Distributeur',
  };
  return labels[normalized] || 'Fournisseur';
}

export default function FournisseursPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadEnterprises() {
      setLoading(true); setLoadError('');
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('enterprises')
          .select('id,name,slug,category,description,city,logo_url,cover_url,verified,is_verified,owner_id,created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!active) return;

        const ownerIds = (data ?? []).map((enterprise: any) => enterprise.owner_id).filter(Boolean);
        const productCounts = new Map<string, number>();
        const supplierTypesByOwner = new Map<string, Set<string>>();

        if (ownerIds.length > 0) {
          const { data: products, error: productsError } = await supabase
            .from('products')
            .select('vendor_id,vendor_type')
            .in('vendor_id', ownerIds)
            .eq('is_active', true);

          if (productsError) {
            console.error('Erreur lors du chargement des produits fournisseurs:', productsError);
          } else {
            (products ?? []).forEach((product: any) => {
              const vendorId = String(product.vendor_id);
              productCounts.set(vendorId, (productCounts.get(vendorId) ?? 0) + 1);
              const type = normalizeType(product.vendor_type);
              if (supplierTypes.has(type)) {
                if (!supplierTypesByOwner.has(vendorId)) supplierTypesByOwner.set(vendorId, new Set());
                supplierTypesByOwner.get(vendorId)!.add(type);
              }
            });
          }
        }

        const mapped: Supplier[] = (data ?? []).map((enterprise: any) => {
          const ownerId = enterprise.owner_id ? String(enterprise.owner_id) : '';
          const enterpriseTypes = supplierTypesByOwner.get(ownerId);
          const type = enterpriseTypes?.values().next().value || '';
          return {
            id: String(enterprise.id),
            name: enterprise.name || 'Entreprise sans nom',
            logo: enterprise.logo_url || FALLBACK_IMAGE,
            logoAlt: `Logo ${enterprise.name || 'de l’entreprise'}`,
            cover: enterprise.cover_url || FALLBACK_IMAGE,
            coverAlt: `Photo de couverture de ${enterprise.name || 'l’entreprise'}`,
            category: enterprise.category || 'Entreprise',
            city: enterprise.city || 'RDC',
            description: enterprise.description || 'Aucune description disponible.',
            products: ownerId ? (productCounts.get(ownerId) ?? 0) : 0,
            rating: 0,
            reviews: 0,
            verified: Boolean(enterprise.verified ?? enterprise.is_verified),
            type: displayType(type),
            founded: enterprise.created_at ? new Date(enterprise.created_at).getFullYear().toString() : '—'
          };
        });

        // Une entreprise n'est fournisseur que si elle possède au moins un produit actif
        // déclaré avec un type d'approvisionnement reconnu.
        setSuppliers(mapped.filter((supplier) => supplier.type !== 'Fournisseur'));
      } catch (error) {
        console.error('Erreur lors du chargement des entreprises:', error);
        if (active) setLoadError('Impossible de charger les entreprises pour le moment.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadEnterprises();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    let list = [...suppliers];
    if (search) {
      const query = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query) || s.category.toLowerCase().includes(query));
    }
    if (selectedCategory !== 'Toutes') list = list.filter((s) => s.category === selectedCategory);
    if (selectedType !== 'Tous') list = list.filter((s) => s.type === selectedType);
    if (selectedCity !== 'Toutes') list = list.filter((s) => s.city === selectedCity);
    if (onlyVerified) list = list.filter((s) => s.verified);
    return list;
  }, [suppliers, search, selectedCategory, selectedType, selectedCity, onlyVerified]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="bg-card border-b border-border px-4 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-foreground mb-1">Fournisseurs & Entreprises</h1>
              <p className="text-sm text-muted-foreground">{loading ? 'Chargement des entreprises...' : `${filtered.length} fournisseurs trouvés sur EmpireKongo`}</p>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un fournisseur, une entreprise..." className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>}
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}><AdjustmentsHorizontalIcon className="w-4 h-4" />Filtres</button>
            </div>
            {showFilters && <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-2"><span className="text-xs text-muted-foreground font-semibold self-center">Catégorie :</span>{categories.map((c) => <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{c}</button>)}</div>
              <div className="flex flex-wrap gap-2"><span className="text-xs text-muted-foreground font-semibold self-center">Type :</span>{types.map((t) => <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{t}</button>)}</div>
              <div className="flex flex-wrap gap-2"><span className="text-xs text-muted-foreground font-semibold self-center">Ville :</span>{cities.map((c) => <button key={c} onClick={() => setSelectedCity(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedCity === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{c}</button>)}</div>
              <label className="flex items-center gap-2 cursor-pointer self-center"><input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="w-4 h-4 accent-primary" /><span className="text-xs text-muted-foreground font-semibold">Vérifiés uniquement</span></label>
            </div>}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? <div className="text-center py-20"><p className="text-foreground font-bold">Chargement des entreprises...</p><p className="text-muted-foreground text-sm mt-1">Récupération des informations depuis EmpireKongo.</p></div> : loadError ? <div className="text-center py-20"><p className="text-foreground font-bold">{loadError}</p><p className="text-muted-foreground text-sm mt-1">Vérifiez la connexion à Supabase puis rechargez la page.</p></div> : filtered.length === 0 ? <div className="text-center py-20"><p className="text-4xl mb-3">🔍</p><p className="text-foreground font-bold">Aucun fournisseur trouvé</p><p className="text-muted-foreground text-sm mt-1">Essayez d'autres critères de recherche</p></div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((supplier) => <div key={supplier.id} className="product-card group flex flex-col overflow-hidden">
              <div className="relative h-28 overflow-hidden"><AppImage src={supplier.cover} alt={supplier.coverAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute top-2 right-2"><span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">{supplier.type}</span></div></div>
              <div className="px-4 -mt-6 relative z-10 flex items-end justify-between"><div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-card bg-card shadow-lg"><AppImage src={supplier.logo} alt={supplier.logoAlt} width={48} height={48} className="object-cover w-full h-full" /></div>{supplier.verified && <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full mb-1"><CheckBadgeIcon className="w-3 h-3" />Vérifié</span>}</div>
              <div className="px-4 pt-2 pb-4 flex flex-col flex-1"><h3 className="text-sm font-extrabold text-foreground mb-0.5">{supplier.name}</h3><div className="flex items-center gap-3 mb-2"><span className="text-[10px] text-primary font-semibold">{supplier.category}</span><span className="flex items-center gap-1 text-[10px] text-muted-foreground"><MapPinIcon className="w-3 h-3" />{supplier.city}</span></div><p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{supplier.description}</p>
                <div className="flex items-center justify-between mb-3"><div className="text-center"><p className="text-sm font-extrabold text-foreground">{supplier.products}</p><p className="text-[10px] text-muted-foreground">Produits</p></div><div className="w-px h-8 bg-border" /><div className="text-center"><div className="flex items-center gap-1 justify-center"><StarSolid className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-extrabold text-foreground">{supplier.rating || '—'}</span></div><p className="text-[10px] text-muted-foreground">{supplier.reviews || 0} avis</p></div><div className="w-px h-8 bg-border" /><div className="text-center"><p className="text-sm font-extrabold text-foreground">{supplier.founded}</p><p className="text-[10px] text-muted-foreground">Fondé</p></div></div>
                <Link href={`/fournisseurs/${supplier.id}`} className="w-full flex items-center justify-center py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">Voir le profil →</Link>
              </div>
            </div>)}
          </div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
