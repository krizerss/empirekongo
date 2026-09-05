'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import FavoriteButton from '@/components/store/FavoriteButton';
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
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

export interface StoreProductDetail {
  id: string; name: string; description: string; price: string; unit: string; category: string; subCategory: string; city: string; image: string; alt: string; stockQty: number; stockStatus: string; rating: number; reviewCount: number; vendorId: string; vendorName: string; vendorType: string; vendorPhone: string; vendorEmail: string; vendorCity: string; vendorVerified: boolean; vendorSince: string; vendorProducts: number;
  similarProducts: Array<{ id: string; name: string; vendorName: string; price: string; unit: string; image: string; alt: string; rating: number; }>;
}

export default function StoreProductDetailClient({ product }: { product: StoreProductDetail }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>('description');
  const images = useMemo(() => [{ src: product.image, alt: product.alt }], [product.image, product.alt]);

  const handleContact = () => {
    if (!isLoggedIn) { setShowAuthGuard(true); return; }
    const params = new URLSearchParams({ tab: 'messages', receiver: product.vendorId, product: product.id, productName: product.name });
    router.push(`/member-dashboard?${params.toString()}`);
  };

  const handleOrder = () => {
    if (!isLoggedIn) { setShowAuthGuard(true); return; }
    const params = new URLSearchParams({ product: product.id, quantity: String(quantity) });
    router.push(`/store?order=${params.toString()}`);
  };

  const stockLabel = product.stockQty > 0 ? `En stock (${product.stockQty} disponibles)` : 'Rupture de stock';
  const stockOk = product.stockQty > 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
            <Link href="/store" className="flex items-center gap-1 hover:text-foreground transition-colors"><ArrowLeftIcon className="w-3.5 h-3.5" /> Store</Link><span>/</span><span className="text-foreground truncate">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-3"><div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border"><AppImage src={images[activeImage].src} alt={images[activeImage].alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />{images.length > 1 && <><button onClick={() => setActiveImage((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronLeftIcon className="w-4 h-4" /></button><button onClick={() => setActiveImage((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70"><ChevronRightIcon className="w-4 h-4" /></button></>}</div></div>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-primary font-semibold uppercase tracking-wider mb-1">{product.category}</p><h1 className="text-2xl font-extrabold text-foreground mb-2">{product.name}</h1><div className="flex items-center gap-3"><div className="flex items-center gap-1">{[1,2,3,4,5].map((s) => <StarSolid key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'text-primary' : 'text-muted-foreground/30'}`} />)}</div><span className="text-sm text-muted-foreground">{product.rating.toFixed(1)} ({product.reviewCount} avis)</span></div></div><FavoriteButton productId={product.id} /></div>

              <div className="bg-card border border-border rounded-xl p-4"><div className="flex items-baseline gap-2"><span className="text-3xl font-extrabold text-primary">{product.price}</span><span className="text-muted-foreground">{product.unit}</span></div><div className="flex items-center gap-2 mt-2"><CheckCircleIcon className={`w-4 h-4 ${stockOk ? 'text-green-400' : 'text-red-400'}`} /><span className={`text-sm font-semibold ${stockOk ? 'text-green-400' : 'text-red-400'}`}>{stockLabel}</span></div></div>

              <div className="space-y-3"><div className="flex items-center gap-3"><span className="text-sm font-semibold text-muted-foreground">Quantité :</span><div className="flex items-center gap-2 bg-secondary border border-border rounded-lg"><button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">−</button><span className="w-10 text-center text-sm font-bold text-foreground">{quantity}</span><button onClick={() => setQuantity((q) => Math.min(Math.max(product.stockQty, 1), q + 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">+</button></div></div><div className="flex gap-3"><button disabled={!stockOk} onClick={handleOrder} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"><ShoppingCartIcon className="w-5 h-5" /> Commander</button><button onClick={handleContact} className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary text-primary rounded-xl font-bold hover:bg-primary/10 transition-colors"><ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> Contacter</button></div></div>

              <div className="grid grid-cols-3 gap-3">{[{ icon:<ShieldCheckIcon className="w-4 h-4" />,label:'Paiement sécurisé'},{icon:<TruckIcon className="w-4 h-4" />,label:'Livraison rapide'},{icon:<CheckCircleIcon className="w-4 h-4" />,label:'Qualité garantie'}].map((b)=><div key={b.label} className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl text-center"><span className="text-primary">{b.icon}</span><span className="text-[10px] text-muted-foreground font-semibold">{b.label}</span></div>)}</div>

              <div className="bg-card border border-border rounded-xl p-4"><p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-3">Fournisseur</p><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3 min-w-0"><div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0"><span className="text-sm font-extrabold text-primary">{product.vendorName.slice(0,2).toUpperCase()}</span></div><div className="min-w-0"><div className="flex items-center gap-1"><span className="text-sm font-bold text-foreground truncate">{product.vendorName}</span>{product.vendorVerified&&<CheckBadgeIcon className="w-4 h-4 text-primary shrink-0"/>}</div><div className="flex items-center gap-3 mt-0.5"><span className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPinIcon className="w-3 h-3"/>{product.vendorCity}</span><span className="text-[10px] text-muted-foreground">{product.vendorProducts} produits</span></div></div></div><Link href={`/fournisseurs/${product.vendorId}`} className="text-xs font-semibold text-primary hover:underline shrink-0">Voir profil →</Link></div><div className="grid grid-cols-2 gap-2 mt-3">{product.vendorPhone&&<a href={`tel:${product.vendorPhone}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground"><PhoneIcon className="w-3.5 h-3.5 text-primary"/>{product.vendorPhone}</a>}{product.vendorEmail&&<a href={`mailto:${product.vendorEmail}`} className="flex items-center gap-2 p-2 bg-secondary rounded-lg text-xs text-muted-foreground hover:text-foreground truncate"><EnvelopeIcon className="w-3.5 h-3.5 text-primary shrink-0"/>{product.vendorEmail}</a>}</div></div>
            </div>
          </div>

          <div className="mb-8"><div className="flex gap-1 border-b border-border mb-6">{(['description','characteristics','reviews'] as const).map((tab)=><button key={tab} onClick={()=>setActiveTab(tab)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab===tab?'border-primary text-primary':'border-transparent text-muted-foreground hover:text-foreground'}`}>{tab==='description'?'Description':tab==='characteristics'?'Caractéristiques':`Avis (${product.reviewCount})`}</button>)}</div>{activeTab==='description'&&<p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">{product.description||'Aucune description disponible pour ce produit.'}</p>}{activeTab==='characteristics'&&<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl"><div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"><span className="text-xs text-muted-foreground font-semibold">Catégorie</span><span className="text-xs font-bold text-foreground">{product.category}</span></div><div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"><span className="text-xs text-muted-foreground font-semibold">Sous-catégorie</span><span className="text-xs font-bold text-foreground">{product.subCategory||'—'}</span></div><div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"><span className="text-xs text-muted-foreground font-semibold">Ville</span><span className="text-xs font-bold text-foreground">{product.city||product.vendorCity||'—'}</span></div><div className="flex items-center justify-between p-3 bg-card border border-border rounded-xl"><span className="text-xs text-muted-foreground font-semibold">Type fournisseur</span><span className="text-xs font-bold text-foreground">{product.vendorType||'Fournisseur'}</span></div></div>}{activeTab==='reviews'&&<div className="max-w-2xl p-4 bg-card border border-border rounded-xl"><p className="text-4xl font-extrabold text-primary">{product.rating.toFixed(1)}</p><p className="text-sm text-muted-foreground mt-1">{product.reviewCount} avis enregistrés pour ce produit.</p></div>}</div>

          {product.similarProducts.length>0&&<div><h2 className="text-lg font-extrabold text-foreground mb-4">Produits similaires</h2><div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{product.similarProducts.map((p)=><Link key={p.id} href={`/store/product/${p.id}`} className="product-card group flex flex-col overflow-hidden"><div className="relative h-36"><AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw"/></div><div className="p-3"><p className="text-[10px] text-muted-foreground mb-0.5">{p.vendorName}</p><h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{p.name}</h3><div className="flex items-center gap-1"><StarSolid className="w-3 h-3 text-primary"/><span className="text-[10px] text-muted-foreground">{p.rating.toFixed(1)}</span></div><p className="text-sm font-extrabold text-primary mt-1">{p.price} <span className="text-[10px] font-normal text-muted-foreground">{p.unit}</span></p></div></Link>)}</div></div>}
        </div>
      </main><Footer/><AuthGuardModal open={showAuthGuard} onClose={()=>setShowAuthGuard(false)}/>
    </div>
  );
}
