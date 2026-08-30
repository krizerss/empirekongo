'use client';
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon, PhotoIcon, PencilSquareIcon, TrashIcon, EyeIcon, ChevronDownIcon, ShoppingCartIcon, CalendarDaysIcon,  } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  status: 'Actif' | 'Brouillon' | 'En attente';
  availability: 'Disponible' | 'Rupture' | 'Sur commande';
  dateAdded: string;
  image: string;
  description: string;
  views: number;
}

const CATEGORIES = ['Toutes', 'Agriculture', 'Élevage', 'Énergie', 'BTP', 'Mode', 'Technologie'];
const SUB_CATEGORIES: Record<string, string[]> = {
  Agriculture: ['Café & Cacao', 'Tubercules', 'Huiles végétales', 'Légumes & Fruits', 'Céréales'],
  Élevage: ['Volailles', 'Bovins', 'Porcins', 'Aquaculture'],
  Énergie: ['Combustibles', 'Solaire', 'Biomasse'],
  BTP: ['Matériaux', 'Outillage', 'Services'],
  Mode: ['Vêtements', 'Chaussures', 'Accessoires'],
  Technologie: ['Électronique', 'Informatique', 'Télécoms'],
};
const STATUSES = ['Tous', 'Actif', 'Brouillon', 'En attente'];
const AVAILABILITIES = ['Toutes', 'Disponible', 'Rupture', 'Sur commande'];

// Map Supabase stock_status → UI availability
function mapStockStatus(s: string): Product['availability'] {
  if (s === 'En stock') return 'Disponible';
  if (s === 'Rupture de stock') return 'Rupture';
  return 'Sur commande';
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Product['status'] }) {
  const map: Record<Product['status'], string> = {
    Actif: 'bg-green-400/15 text-green-400 border-green-400/30',
    Brouillon: 'bg-zinc-400/15 text-zinc-400 border-zinc-400/30',
    'En attente': 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status]}`}>
      {status}
    </span>
  );
}

function AvailabilityBadge({ availability }: { availability: Product['availability'] }) {
  const map: Record<Product['availability'], string> = {
    Disponible: 'text-green-400',
    Rupture: 'text-red-400',
    'Sur commande': 'text-blue-400',
  };
  return (
    <span className={`text-[10px] font-medium ${map[availability]}`}>● {availability}</span>
  );
}

// ─── Product placeholder image ────────────────────────────────────────────────

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center gap-1">
      <span className="text-xl font-extrabold text-primary/60">{initials}</span>
    </div>
  );
}

// ─── Select dropdown helper ───────────────────────────────────────────────────

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors pr-8"
        >
          <option value="">Sélectionner...</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (p: Omit<Product, 'id' | 'views' | 'dateAdded'>) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const mainImageRef = useRef<HTMLInputElement>(null);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMainImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    onAdd({
      name,
      description,
      category,
      subCategory,
      status: 'Brouillon',
      availability: 'Disponible',
      image: mainImagePreview || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-base font-extrabold text-foreground">Ajouter un produit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Remplissez les informations du produit</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo principale */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              Photo principale
            </label>
            <div
              onClick={() => mainImageRef.current?.click()}
              className="relative border-2 border-dashed border-border rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
            >
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Aperçu photo principale" className="w-full h-full object-cover" />
              ) : (
                <>
                  <PhotoIcon className="w-10 h-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">Cliquer pour ajouter une photo</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                </>
              )}
            </div>
            <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
          </div>

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
              Informations générales
            </h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nom du produit <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café Robusta Premium 50 kg"
                required
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre produit : origine, qualité, conditionnement..."
                rows={4}
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Prix</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 5000 CDF"
                  className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Unité</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="Ex: kg, sac, pièce"
                  className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Catégorie"
                value={category}
                onChange={(v) => { setCategory(v); setSubCategory(''); }}
                options={CATEGORIES.filter((c) => c !== 'Toutes')}
                required
              />
              <SelectField
                label="Sous-catégorie"
                value={subCategory}
                onChange={setSubCategory}
                options={category ? (SUB_CATEGORIES[category] || []) : []}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Enregistrer le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-secondary border border-border rounded-lg pl-3 pr-8 py-2 text-xs text-foreground focus:outline-none focus:border-primary/50 transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────

function ProductCard({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
      {/* Image */}
      <div className="relative h-40 bg-secondary overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <ProductImagePlaceholder name={product.name} />
        )}
        <div className="absolute top-2 left-2">
          <StatusBadge status={product.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-foreground truncate mb-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description || 'Aucune description'}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{product.category}</span>
          <AvailabilityBadge availability={product.availability} />
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <EyeIcon className="w-3 h-3" />
            <span>{product.views} vues</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDaysIcon className="w-3 h-3" />
            <span>{new Date(product.dateAdded).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
            <PencilSquareIcon className="w-3.5 h-3.5" />
            Modifier
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MyProductsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterAvailability, setFilterAvailability] = useState('Toutes');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch products from Supabase
  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mapped: Product[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'Non classé',
        subCategory: '',
        status: p.is_active ? 'Actif' : 'Brouillon',
        availability: mapStockStatus(p.stock_status || 'En stock'),
        dateAdded: p.created_at,
        image: p.image_url || '',
        description: p.description || '',
        views: p.review_count || 0,
      }));
      setProducts(mapped);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  // Add product to Supabase
  const handleAddProduct = async (p: Omit<Product, 'id' | 'views' | 'dateAdded'>) => {
    if (!user) return;
    try {
      const { error: insertError } = await supabase.from('products').insert({
        name: p.name,
        description: p.description,
        category: p.category,
        price: '0',
        vendor_id: user.id,
        image_url: p.image || '',
        stock_status: p.availability === 'Disponible' ? 'En stock' : p.availability === 'Rupture' ? 'Rupture de stock' : 'Stock limité',
        is_active: p.status === 'Actif',
      });
      if (insertError) throw insertError;
      await fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout du produit');
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('products').delete().eq('id', id).eq('vendor_id', user?.id);
      if (deleteError) throw deleteError;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  // Filters
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'Toutes' || p.category === filterCategory;
    const matchStatus = filterStatus === 'Tous' || p.status === filterStatus;
    const matchAvailability = filterAvailability === 'Toutes' || p.availability === filterAvailability;
    return matchSearch && matchCategory && matchStatus && matchAvailability;
  });

  const activeCount = products.filter((p) => p.status === 'Actif').length;
  const draftCount = products.filter((p) => p.status === 'Brouillon').length;
  const pendingCount = products.filter((p) => p.status === 'En attente').length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-foreground mb-1">Mes Produits</h1>
          <p className="text-sm text-muted-foreground">Gérez vos produits publiés sur EmpireKongo.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total', value: products.length, color: 'text-foreground' },
          { label: 'Actifs', value: activeCount, color: 'text-green-400' },
          { label: 'Brouillons', value: draftCount, color: 'text-zinc-400' },
          { label: 'En attente', value: pendingCount, color: 'text-amber-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FilterSelect label="Catégorie" value={filterCategory} onChange={setFilterCategory} options={CATEGORIES} />
          <FilterSelect label="Statut" value={filterStatus} onChange={setFilterStatus} options={STATUSES} />
          <FilterSelect label="Disponibilité" value={filterAvailability} onChange={setFilterAvailability} options={AVAILABILITIES} />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCartIcon className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <p className="text-base font-bold text-foreground mb-1">
            {products.length === 0 ? 'Aucun produit encore' : 'Aucun résultat'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {products.length === 0
              ? 'Commencez par ajouter votre premier produit.' :'Essayez de modifier vos filtres de recherche.'}
          </p>
          {products.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter un produit
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
}
