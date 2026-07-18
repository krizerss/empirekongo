'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import {
  ShoppingCartIcon,
  ChatBubbleLeftEllipsisIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  TruckIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

interface ProductData {
  id: number;
  name: string;
  vendor: string;
  vendorId: number;
  vendorVerified: boolean;
  vendorCity: string;
  vendorPhone: string;
  vendorEmail: string;
  vendorProducts: number;
  vendorRating: number;
  price: string;
  priceNum: number;
  unit: string;
  category: string;
  city: string;
  images: { src: string; alt: string }[];
  rating: number;
  reviews: number;
  stock: number;
  isPromo?: boolean;
  promoLabel?: string;
  description: string;
  characteristics: { label: string; value: string }[];
  reviewsList: Review[];
}

interface SimilarProduct {
  id: number;
  name: string;
  vendor: string;
  price: string;
  unit: string;
  image: string;
  alt: string;
  rating: number;
}

interface Props {
  product: ProductData;
  similarProducts: SimilarProduct[];
}

export default function ProductClient({ product, similarProducts }: Props) {
  const { isLoggedIn } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [authAction, setAuthAction] = useState<'order' | 'message'>('order');
  const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');

  const handleAction = (action: 'order' | 'message') => {
    if (!isLoggedIn) {
      setAuthAction(action);
      setShowAuthGuard(true);
    }
  };

  const avgRating = product.reviewsList.reduce((s, r) => s + r.rating, 0) / product.reviewsList.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                {product.isPromo && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{product.promoLabel}</div>
                )}
                <AppImage src={product.images[activeImage]?.src} alt={product.images[activeImage]?.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                {product.images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                      <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveImage((i) => (i + 1) % product.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                      <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)} className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                      <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h1 className="text-2xl font-extrabold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarSolid key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} avis)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">{product.price}</span>
                  <span className="text-muted-foreground">{product.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircleIcon className={`w-4 h-4 ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {product.stock > 0 ? `En stock (${product.stock} disponibles)` : 'Rupture de stock'}
                  </span>
                </div>
              </div>

              {/* Quantity + Actions */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-muted-foreground">Quantité :</span>
                  <div className="flex items-center gap-2 bg-secondary border border-border rounded-lg">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">−</button>
                    <span className="w-10 text-center text-sm font-bold text-foreground">{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">+</button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => handleAction('order')} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
                    <ShoppingCartIcon className="w-5 h-5" />Commander
                  </button>
                  <button onClick={() => handleAction('message')} className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-colors">
                    <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />Contacter
                  </button>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: <ShieldCheckIcon className="w-4 h-4" />, label: 'Paiement sécurisé' },
                  { icon: <TruckIcon className="w-4 h-4" />, label: 'Livraison rapide' },
                  { icon: <CheckCircleIcon className="w-4 h-4" />, label: 'Qualité garantie' },
                ].map((b, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl text-center">
                    <span className="text-primary">{b.icon}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Vendor card */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Fournisseur</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <span className="text-sm font-extrabold text-primary">{product.vendor.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-foreground">{product.vendor}</span>
                        {product.vendorVerified && <CheckBadgeIcon className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPinIcon className="w-3 h-3" />{product.vendorCity}</span>
                        <span className="text-[10px] text-muted-foreground">{product.vendorProducts} produits</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/fournisseurs/${product.vendorId}`} className="text-xs font-semibold text-primary hover:underline">Voir profil →</Link>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <a href={`tel:${product.vendorPhone}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <PhoneIcon className="w-3.5 h-3.5 text-primary" />{product.vendorPhone}
                  </a>
                  <a href={`mailto:${product.vendorEmail}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <EnvelopeIcon className="w-3.5 h-3.5 text-primary" />{product.vendorEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-1 border-b border-border mb-6">
              {(['description', 'characteristics', 'reviews'] as const).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  {tab === 'description' ? 'Description' : tab === 'characteristics' ? 'Caractéristiques' : `Avis (${product.reviewsList.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{product.description}</p>
            )}

            {activeTab === 'characteristics' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                {product.characteristics.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                    <span className="text-xs text-muted-foreground font-semibold">{c.label}</span>
                    <span className="text-xs font-bold text-foreground">{c.value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-primary">{avgRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => <StarSolid key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-primary' : 'text-muted-foreground/30'}`} />)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{product.reviewsList.length} avis</p>
                  </div>
                </div>
                {product.reviewsList.map((review) => (
                  <div key={review.id} className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{review.avatar}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{review.author}</p>
                          <p className="text-[10px] text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => <StarSolid key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-primary' : 'text-muted-foreground/30'}`} />)}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Similar Products */}
          <div>
            <h2 className="text-lg font-extrabold text-foreground mb-4">Produits similaires</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {similarProducts.map((p) => (
                <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group flex flex-col">
                  <div className="relative h-36 overflow-hidden">
                    <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-muted-foreground mb-0.5">{p.vendor}</p>
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 mb-1">
                      <StarSolid className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground">{p.rating}</span>
                    </div>
                    <span className="text-sm font-extrabold text-primary">{p.price}</span>
                    <span className="text-[10px] text-muted-foreground ml-1">{p.unit}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showAuthGuard && <AuthGuardModal action={authAction} onClose={() => setShowAuthGuard(false)} />}
    </div>
  );
}
