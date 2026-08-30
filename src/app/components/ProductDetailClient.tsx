'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCartIcon, ChatBubbleLeftEllipsisIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, CheckCircleIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon, StarIcon,  } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductReview {
  id: string;
  author_name: string;
  author_initials: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  unit: string;
  category: string;
  city: string;
  image_url: string;
  alt_text: string;
  stock_status: string;
  stock_qty: number;
  rating: number;
  review_count: number;
  vendor_name: string;
  vendor_type: string;
  vendor_phone: string;
  vendor_email: string;
  vendor_city: string;
  vendor_verified: boolean;
  vendor_since: string;
  vendor_id: string | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  vendor_name: string;
  price: string;
  unit: string;
  image_url: string;
  alt_text: string;
  rating: number;
}

interface Props {
  productId: string;
  backHref: string;
  backLabel: string;
}

export default function ProductDetailClient({ productId, backHref, backLabel }: Props) {
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [authAction, setAuthAction] = useState<'order' | 'message'>('order');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();

        // Load product
        const { data: prod, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .eq('is_active', true)
          .single();

        if (prodErr || !prod) {
          setError('Produit introuvable.');
          setLoading(false);
          return;
        }
        setProduct(prod);

        // Load specs
        const { data: specsData } = await supabase
          .from('product_specs')
          .select('label, value')
          .eq('product_id', productId)
          .order('sort_order', { ascending: true });
        setSpecs(specsData || []);

        // Load reviews
        const { data: reviewsData } = await supabase
          .from('product_reviews')
          .select('id, author_name, author_initials, rating, comment, created_at')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });
        setReviews(reviewsData || []);

        // Load related products (same category, different id)
        const { data: relatedData } = await supabase
          .from('products')
          .select('id, name, vendor_name, price, unit, image_url, alt_text, rating')
          .eq('category', prod.category)
          .eq('is_active', true)
          .neq('id', productId)
          .limit(4);
        setRelated(relatedData || []);
      } catch {
        setError('Erreur lors du chargement du produit.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleAction = (action: 'order' | 'message') => {
    if (!isLoggedIn) {
      setAuthAction(action);
      setShowAuthGuard(true);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { setShowAuthGuard(true); return; }
    if (!reviewForm.comment.trim()) return;
    setSubmittingReview(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setShowAuthGuard(true); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const authorName = profile?.full_name || user.email?.split('@')[0] || 'Anonyme';
      const initials = authorName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase() || 'AN';

      await supabase.from('product_reviews').insert({
        product_id: productId,
        user_id: user.id,
        author_name: authorName,
        author_initials: initials,
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
      });

      // Reload reviews
      const { data: refreshed } = await supabase
        .from('product_reviews')
        .select('id, author_name, author_initials, rating, comment, created_at')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      setReviews(refreshed || []);
      setReviewForm({ rating: 5, comment: '' });
      setReviewSubmitted(true);
      setTimeout(() => setReviewSubmitted(false), 3000);
    } catch {
      // silent
    } finally {
      setSubmittingReview(false);
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : product?.rating || 0;

  const stockColors: Record<string, string> = {
    'En stock': 'text-green-400',
    'Stock limité': 'text-yellow-400',
    'Rupture de stock': 'text-red-400',
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement du produit…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground mb-2">{error || 'Produit introuvable'}</p>
            <Link href={backHref} className="text-sm text-primary hover:underline">← {backLabel}</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link href={backHref} className="hover:text-foreground transition-colors">{backLabel}</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </div>

          <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à {backLabel.toLowerCase()}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <AppImage
                  src={product.image_url || '/assets/images/no_image.png'}
                  alt={product.alt_text || product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-5">
              <div>
                <p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category}</p>
                <h1 className="text-2xl font-extrabold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarSolid key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} ({product.review_count} avis)</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-primary">{product.price}</span>
                  <span className="text-muted-foreground">{product.unit}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircleIcon className={`w-4 h-4 ${product.stock_qty > 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`text-sm font-semibold ${stockColors[product.stock_status] || 'text-muted-foreground'}`}>
                    {product.stock_status}
                    {product.stock_qty > 0 && ` (${product.stock_qty} disponibles)`}
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
                  <button
                    onClick={() => handleAction('order')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCartIcon className="w-5 h-5" />Commander
                  </button>
                  <button
                    onClick={() => handleAction('message')}
                    className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-colors"
                  >
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
                      <span className="text-sm font-extrabold text-primary">
                        {product.vendor_name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-foreground">{product.vendor_name}</span>
                        {product.vendor_verified && <CheckBadgeIcon className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <MapPinIcon className="w-3 h-3" />{product.vendor_city}
                        </span>
                        {product.vendor_since && (
                          <span className="text-[10px] text-muted-foreground">Depuis {product.vendor_since}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {product.vendor_id && (
                    <Link href={`/fournisseurs/${product.vendor_id}`} className="text-xs font-semibold text-primary hover:underline">
                      Voir profil →
                    </Link>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {product.vendor_phone && (
                    <a href={`tel:${product.vendor_phone}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
                      <PhoneIcon className="w-3.5 h-3.5 text-primary" />{product.vendor_phone}
                    </a>
                  )}
                  {product.vendor_email && (
                    <a href={`mailto:${product.vendor_email}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors truncate">
                      <EnvelopeIcon className="w-3.5 h-3.5 text-primary shrink-0" /><span className="truncate">{product.vendor_email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-1 border-b border-border mb-6">
              {(['description', 'specs', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {tab === 'description' ? 'Description' : tab === 'specs' ? 'Caractéristiques' : `Avis (${reviews.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {product.description || 'Aucune description disponible pour ce produit.'}
              </p>
            )}

            {activeTab === 'specs' && (
              specs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {specs.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl">
                      <span className="text-xs text-muted-foreground font-semibold">{s.label}</span>
                      <span className="text-xs font-bold text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune caractéristique disponible.</p>
              )
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4 max-w-2xl">
                {/* Rating summary */}
                <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-primary">{avgRating.toFixed(1)}</p>
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarSolid key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{reviews.length} avis</p>
                  </div>
                </div>

                {/* Review list */}
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-card border border-border rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{review.author_initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{review.author_name}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDate(review.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarSolid key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-primary' : 'text-muted-foreground/30'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                ))}

                {/* Add review form */}
                <div className="p-4 bg-card border border-border rounded-xl">
                  <h3 className="text-sm font-extrabold text-foreground mb-3">Laisser un avis</h3>
                  {reviewSubmitted ? (
                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                      <CheckCircleIcon className="w-4 h-4" />Avis publié avec succès !
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5">Note</p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                              className="focus:outline-none"
                            >
                              {s <= reviewForm.rating
                                ? <StarSolid className="w-6 h-6 text-primary" />
                                : <StarIcon className="w-6 h-6 text-muted-foreground/40" />}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                        placeholder="Partagez votre expérience avec ce produit…"
                        rows={3}
                        className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
                      />
                      <button
                        type="submit"
                        disabled={submittingReview || !reviewForm.comment.trim()}
                        className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingReview ? 'Publication…' : 'Publier mon avis'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="text-lg font-extrabold text-foreground mb-4">Produits similaires</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((p) => (
                  <Link key={p.id} href={`${backHref}/${p.id}`} className="product-card group flex flex-col">
                    <div className="relative h-36 overflow-hidden">
                      <AppImage
                        src={p.image_url || '/assets/images/no_image.png'}
                        alt={p.alt_text || p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="25vw"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-muted-foreground mb-0.5">{p.vendor_name}</p>
                      <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{p.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        <StarSolid className="w-3 h-3 text-primary" />
                        <span className="text-[10px] text-muted-foreground">{p.rating?.toFixed(1)}</span>
                      </div>
                      <span className="text-sm font-extrabold text-primary">{p.price}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">{p.unit}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {showAuthGuard && <AuthGuardModal action={authAction} onClose={() => setShowAuthGuard(false)} />}
    </div>
  );
}
