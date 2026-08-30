'use client';
import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, MapPinIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, BuildingOfficeIcon, ShoppingCartIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

const allCategories = [
  { label: 'Toutes catégories', count: 0 },
  { label: 'Agriculture', count: 0 },
  { label: 'Élevage', count: 0 },
  { label: 'Agroalimentaire', count: 0 },
  { label: 'Énergie', count: 0 },
  { label: 'BTP & Matériaux', count: 0 },
  { label: 'Mode & Beauté', count: 0 },
  { label: 'Technologie', count: 0 },
  { label: 'Autres', count: 0 },
];

const allCities = ['Toutes les villes', 'Kinshasa', 'Matadi', 'Boma', 'Lubumbashi', 'Goma'];

interface Product {
  id: string;
  name: string;
  vendor: string;
  vendorType: string;
  vendorPhone: string;
  vendorEmail: string;
  vendorCity: string;
  vendorVerified: boolean;
  price: string;
  unit: string;
  category: string;
  city: string;
  image: string;
  alt: string;
  description?: string;
  stock?: 'En stock' | 'Stock limité' | 'Rupture de stock';
  stockQty?: number;
  rating?: number;
  reviewCount?: number;
  vendorSince?: string;
  vendorProducts?: number;
}

// ─── Seller Profile Modal ─────────────────────────────────────────────────────

interface SellerProfile {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  verified: boolean;
  category: string;
}

function SellerProfileModal({ seller, onClose, onContact }: { seller: SellerProfile; onClose: () => void; onContact: () => void }) {
  const initials = seller.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-extrabold text-foreground">Profil du vendeur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-lg font-extrabold text-primary">{initials}</span>
            </div>
            <div>
              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                <h3 className="text-base font-extrabold text-foreground">{seller.name}</h3>
                {seller.verified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{seller.type}</p>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">✓ Vérifié</span>
              )}
            </div>
          </div>
          <div className="space-y-2.5 mb-5">
            <div className="flex items-center justify-between gap-2.5 text-sm text-muted-foreground">
              <MapPinIcon className="w-4 h-4 text-primary/60 shrink-0" />
              <span>{seller.city}</span>
            </div>
            <div className="flex items-center justify-between gap-2.5 text-sm text-muted-foreground">
              <BuildingOfficeIcon className="w-4 h-4 text-primary/60 shrink-0" />
              <span>{seller.category}</span>
            </div>
            <div className="flex items-center justify-between gap-2.5 text-sm text-muted-foreground">
              <PhoneIcon className="w-4 h-4 text-primary/60 shrink-0" />
              <span>{seller.phone}</span>
            </div>
            <div className="flex items-center justify-between gap-2.5 text-sm text-muted-foreground">
              <EnvelopeIcon className="w-4 h-4 text-primary/60 shrink-0" />
              <span className="truncate">{seller.email}</span>
            </div>
          </div>
          <button
            onClick={onContact}
            className="w-full gold-gradient text-primary-foreground font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Contacter ce vendeur
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail View ──────────────────────────────────────────────────────

function ProductDetail({ product, onBack, onContact }: { product: Product; onBack: () => void; onContact: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const images = [{ src: product.image, alt: product.alt }];

  const stockColors = {
    'En stock': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Stock limité': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Rupture de stock': 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeftIcon className="w-4 h-4" />
        Retour au marketplace
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary border border-border">
            <AppImage src={images[currentImg]?.src} alt={images[currentImg]?.alt} fill className="object-cover" />
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImg((p) => (p - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <button onClick={() => setCurrentImg((p) => (p + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImg(i)} className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${i === currentImg ? 'border-primary' : 'border-border hover:border-primary/50'}`}>
                  <AppImage src={img.src} alt={img.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">{product.category}</span>
              {product.stock && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${stockColors[product.stock]}`}>{product.stock}</span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-1">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarSolid key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.rating || 0) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{product.rating?.toFixed(1)} ({product.reviewCount} avis)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-primary">{product.price}</span>
            <span className="text-sm text-muted-foreground">{product.unit}</span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <div className="flex gap-3">
            <button onClick={onContact} className="flex-1 gold-gradient text-primary-foreground font-bold py-3 rounded-xl text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <ShoppingCartIcon className="w-4 h-4" />
              Commander
            </button>
            <button onClick={onContact} className="px-4 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:border-primary/50 transition-colors flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              Contacter
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1.5"><TruckIcon className="w-4 h-4 text-primary/60" /><span>Livraison disponible</span></div>
            <div className="flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-primary/60" /><span>Vendeur vérifié</span></div>
          </div>

          {/* Vendor card */}
          <div className="p-4 rounded-xl border border-border bg-secondary/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-extrabold text-primary">{product.vendor.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">{product.vendor}</span>
                  {product.vendorVerified && <CheckBadgeIcon className="w-4 h-4 text-primary" />}
                </div>
                <span className="text-xs text-muted-foreground">{product.vendorType} · {product.vendorCity}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><CalendarDaysIcon className="w-3.5 h-3.5" /><span>Depuis {product.vendorSince}</span></div>
              <div className="flex items-center gap-1.5"><MapPinIcon className="w-3.5 h-3.5" /><span>{product.vendorCity}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketplaceContent() {
  const { isLoggedIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sellerModal, setSellerModal] = useState<SellerProfile | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  // Load products from Supabase
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Products load error:', error.message);
          setProducts([]);
        } else {
          const mapped: Product[] = (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            vendor: p.vendor_name,
            vendorType: p.vendor_type,
            vendorPhone: p.vendor_phone,
            vendorEmail: p.vendor_email,
            vendorCity: p.vendor_city,
            vendorVerified: p.vendor_verified,
            price: p.price,
            unit: p.unit,
            category: p.category,
            city: p.city,
            image: p.image_url,
            alt: p.alt_text,
            description: p.description,
            stock: p.stock_status,
            stockQty: p.stock_qty,
            rating: parseFloat(p.rating) || 0,
            reviewCount: p.review_count,
            vendorSince: p.vendor_since,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.log('Products fetch failed:', err);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'Toutes catégories' || p.category === selectedCategory;
    const matchCity = selectedCity === 'Toutes les villes' || p.city === selectedCity;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const paginated = filtered.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  const handleContact = (product: Product) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    setSellerModal({
      name: product.vendor,
      type: product.vendorType,
      phone: product.vendorPhone,
      email: product.vendorEmail,
      city: product.vendorCity,
      verified: product.vendorVerified,
      category: product.category,
    });
  };

  const stockColors: Record<string, string> = {
    'En stock': 'text-green-400 bg-green-400/10 border-green-400/20',
    'Stock limité': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    'Rupture de stock': 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onContact={() => handleContact(selectedProduct)}
          />
        </div>
        {showAuthModal && <AuthGuardModal action="contact" onClose={() => setShowAuthModal(false)} />}
        {sellerModal && (
          <SellerProfileModal
            seller={sellerModal}
            onClose={() => setSellerModal(null)}
            onContact={() => setSellerModal(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Marketplace B2B</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loadingProducts ? 'Chargement...' : `${filtered.length} produit${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Rechercher un produit..."
                  className="w-full bg-secondary border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`}
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Catégorie</label>
                <div className="flex flex-wrap gap-1.5">
                  {allCategories.map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => { setSelectedCategory(cat.label); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCategory === cat.label ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Ville</label>
                <div className="flex flex-wrap gap-1.5">
                  {allCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => { setSelectedCity(city); setCurrentPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedCity === city ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'}`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                  <div className="h-6 bg-secondary rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg font-semibold">Aucun produit trouvé</p>
            <p className="text-muted-foreground text-sm mt-1">Essayez de modifier vos filtres de recherche</p>
            <button
              onClick={() => { setSelectedCategory('Toutes catégories'); setSelectedCity('Toutes les villes'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((product) => (
                <Link
                  key={product.id}
                  href={`/marketplace/${product.id}`}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-200 group cursor-pointer block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <AppImage
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock && product.stock !== 'En stock' && (
                      <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full border ${stockColors[product.stock]}`}>
                        {product.stock}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{product.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs text-muted-foreground truncate">{product.vendor}</span>
                          {product.vendorVerified && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0">{product.category}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarSolid key={s} className={`w-3 h-3 ${s <= Math.round(product.rating || 0) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">({product.reviewCount})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-primary">{product.price}</span>
                        <span className="text-xs text-muted-foreground ml-1">{product.unit}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{product.city}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleContact(product); }}
                      className="mt-3 w-full py-2 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
                    >
                      Contacter le vendeur
                    </button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showAuthModal && <AuthGuardModal action="contact" onClose={() => setShowAuthModal(false)} />}
      {sellerModal && (
        <SellerProfileModal
          seller={sellerModal}
          onClose={() => setSellerModal(null)}
          onContact={() => setSellerModal(null)}
        />
      )}
    </div>
  );
}