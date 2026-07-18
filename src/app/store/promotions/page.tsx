'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import {
  TagIcon,
  BoltIcon,
  ChevronRightIcon,
  FireIcon,
  ClockIcon } from
'@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface PromoProduct {
  id: number;
  name: string;
  vendor: string;
  vendorVerified: boolean;
  originalPrice: number;
  promoPrice: number;
  discount: number;
  unit: string;
  category: string;
  city: string;
  image: string;
  alt: string;
  rating: number;
  reviews: number;
  stock: number;
  endsAt: string;
  isFlash?: boolean;
}

const promoProducts: PromoProduct[] = [
{ id: 2, name: 'Huile de Palme Naturelle', vendor: 'Saveurs du Kongo', vendorVerified: true, originalPrice: 18750, promoPrice: 15000, discount: 20, unit: '/ Litre', category: 'Agroalimentaire', city: 'Boma', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dbae1103-1779692655900.png', alt: "Bouteille d'huile de palme rouge orangée sur fond sombre", rating: 4.6, reviews: 89, stock: 200, endsAt: '2026-07-25T23:59:00', isFlash: true },
{ id: 4, name: 'Savon Artisanal', vendor: 'Saveurs du Kongo', vendorVerified: true, originalPrice: 4118, promoPrice: 3500, discount: 15, unit: '/ Pièce', category: 'Mode & Beauté', city: 'Boma', image: 'https://images.unsplash.com/photo-1612799897476-e6e6e663f337', alt: 'Savons artisanaux aux huiles naturelles empilés avec fleurs séchées', rating: 4.7, reviews: 203, stock: 300, endsAt: '2026-07-30T23:59:00' },
{ id: 11, name: 'Tomates Fraîches', vendor: 'Saveurs du Kongo', vendorVerified: true, originalPrice: 4444, promoPrice: 4000, discount: 10, unit: '/ Kg', category: 'Agriculture', city: 'Boma', image: "https://images.unsplash.com/photo-1536250370089-ff04e7a123fc", alt: 'Tomates fraîches rouges brillantes sur fond sombre', rating: 4.3, reviews: 55, stock: 400, endsAt: '2026-07-22T23:59:00', isFlash: true },
{ id: 16, name: 'Ordinateur Portable Reconditionné', vendor: 'TechKongo Solutions', vendorVerified: true, originalPrice: 240000, promoPrice: 180000, discount: 25, unit: '/ Unité', category: 'Technologie', city: 'Kinshasa', image: "https://images.unsplash.com/photo-1555584352-072a5f715e26", alt: 'Ordinateur portable reconditionné ouvert sur fond sombre', rating: 4.4, reviews: 67, stock: 20, endsAt: '2026-07-28T23:59:00' },
{ id: 17, name: 'Batterie Solaire 100Ah', vendor: 'Green Energie', vendorVerified: true, originalPrice: 200000, promoPrice: 160000, discount: 20, unit: '/ Unité', category: 'Énergie', city: 'Kinshasa', image: "https://img.rocket.new/generatedImages/rocket_gen_img_166a12f9a-1777019207121.png", alt: 'Batterie lithium-ion de grande capacité pour stockage énergie solaire', rating: 4.6, reviews: 28, stock: 15, endsAt: '2026-07-31T23:59:00' },
{ id: 18, name: 'Riz Local Premium', vendor: 'Saveurs du Kongo', vendorVerified: true, originalPrice: 7500, promoPrice: 6000, discount: 20, unit: '/ Kg', category: 'Agroalimentaire', city: 'Boma', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_17814ecf6-1784370699737.png', alt: 'Riz blanc local dans un bol en bois sur fond sombre', rating: 4.4, reviews: 78, stock: 800, endsAt: '2026-08-05T23:59:00' },
{ id: 19, name: 'Fer à Béton 12mm (lot 10)', vendor: 'EcoBuild SARL', vendorVerified: false, originalPrice: 250000, promoPrice: 200000, discount: 20, unit: '/ Lot', category: 'BTP & Matériaux', city: 'Matadi', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bcf9ad31-1765031427300.png', alt: 'Barres de fer à béton empilées sur chantier', rating: 4.1, reviews: 19, stock: 50, endsAt: '2026-07-26T23:59:00', isFlash: true },
{ id: 20, name: 'Tissu Wax 6 Yards', vendor: 'Mode Congo', vendorVerified: false, originalPrice: 45000, promoPrice: 35000, discount: 22, unit: '/ Pièce', category: 'Mode & Beauté', city: 'Kinshasa', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png', alt: 'Tissu wax africain coloré avec motifs géométriques traditionnels', rating: 4.8, reviews: 178, stock: 250, endsAt: '2026-08-10T23:59:00' }];


function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor(diff % 86400000 / 3600000),
        minutes: Math.floor(diff % 3600000 / 60000),
        seconds: Math.floor(diff % 60000 / 1000)
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }: {value: number;label: string;}) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-background/40 rounded-xl flex items-center justify-center text-xl font-extrabold text-primary">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{label}</span>
    </div>);

}

function FlashCountdown({ endsAt }: {endsAt: string;}) {
  const t = useCountdown(endsAt);
  return (
    <div className="flex items-center gap-2">
      <CountdownUnit value={t.days} label="j" />
      <span className="text-primary font-bold text-lg mb-4">:</span>
      <CountdownUnit value={t.hours} label="h" />
      <span className="text-primary font-bold text-lg mb-4">:</span>
      <CountdownUnit value={t.minutes} label="min" />
      <span className="text-primary font-bold text-lg mb-4">:</span>
      <CountdownUnit value={t.seconds} label="sec" />
    </div>);

}

export default function PromotionsPage() {
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const categories = ['Toutes', 'Agriculture', 'Agroalimentaire', 'Énergie', 'BTP & Matériaux', 'Mode & Beauté', 'Technologie'];

  const flashPromos = promoProducts.filter((p) => p.isFlash);
  const filtered = activeFilter === 'Toutes' ? promoProducts : promoProducts.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2A1500] via-[#1A0D00] to-[#0D0D0D] border-b border-border py-14 px-4">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-6 left-8 text-7xl">🔥</div>
            <div className="absolute top-4 right-16 text-5xl">⚡</div>
            <div className="absolute bottom-4 left-1/4 text-6xl">🏷️</div>
            <div className="absolute bottom-6 right-8 text-4xl">💥</div>
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-3 py-1 text-xs font-semibold mb-4">
              <BoltIcon className="w-3.5 h-3.5" />
              Offres limitées
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Promotions & <span className="gold-text">Réductions</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {promoProducts.length} offres actives · Économisez jusqu'à 25% sur les meilleurs produits
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Flash Sales Banner */}
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2">
                <BoltIcon className="w-5 h-5 text-red-400" />
                <h2 className="text-xl font-bold text-red-400">Ventes Flash</h2>
              </div>
              <div className="h-px flex-1 bg-red-500/20" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ClockIcon className="w-4 h-4" />
                <span>Se terminent bientôt</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {flashPromos.map((p) =>
              <Link key={p.id} href={`/store/product/${p.id}`} className="group relative bg-gradient-to-br from-red-950/40 to-card border border-red-500/20 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all hover:shadow-xl hover:shadow-red-900/20">
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <BoltIcon className="w-3 h-3" />
                    -{p.discount}%
                  </div>
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm mb-1">{p.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-primary font-extrabold">{p.promoPrice.toLocaleString()} FC</span>
                        <span className="ml-2 text-xs text-muted-foreground line-through">{p.originalPrice.toLocaleString()} FC</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.stock} restants</span>
                    </div>
                    <FlashCountdown endsAt={p.endsAt} />
                    {/* Stock bar */}
                    <div className="mt-3">
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(p.stock / 500 * 100, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* Promo Banners */}
          <section className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/60 to-amber-900/20 border border-amber-500/20 p-6 flex items-center gap-4">
              <span className="text-5xl">🌾</span>
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wide mb-1">Semaine Agricole</p>
                <h3 className="text-lg font-extrabold">Jusqu'à -20% sur l'Agriculture</h3>
                <p className="text-sm text-muted-foreground mt-1">Valable jusqu'au 31 juillet 2026</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-amber-400 ml-auto shrink-0" />
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/60 to-blue-900/20 border border-blue-500/20 p-6 flex items-center gap-4">
              <span className="text-5xl">💻</span>
              <div>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-1">Tech Week</p>
                <h3 className="text-lg font-extrabold">-25% sur la Technologie</h3>
                <p className="text-sm text-muted-foreground mt-1">Offres exclusives sur l'électronique</p>
              </div>
              <ChevronRightIcon className="w-5 h-5 text-blue-400 ml-auto shrink-0" />
            </div>
          </section>

          {/* All Promos */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FireIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Toutes les Promotions</h2>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === cat ?
                'bg-primary text-primary-foreground' :
                'bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`
                }>
                
                  {cat}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((p) =>
              <Link key={p.id} href={`/store/product/${p.id}`} className="product-card group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="bg-red-500 text-white text-xs font-extrabold px-2 py-0.5 rounded-full">-{p.discount}%</span>
                      {p.isFlash &&
                    <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <BoltIcon className="w-3 h-3" />Flash
                        </span>
                    }
                    </div>
                    {p.vendorVerified &&
                  <span className="absolute top-2 right-2">
                        <CheckBadgeIcon className="w-5 h-5 text-primary" />
                      </span>
                  }
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">{p.category}</p>
                    <h3 className="font-semibold text-sm mb-1 line-clamp-2">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{p.vendor}</p>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-primary font-extrabold text-sm">{p.promoPrice.toLocaleString()} FC</span>
                        <span className="ml-1.5 text-xs text-muted-foreground line-through">{p.originalPrice.toLocaleString()} FC</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <StarSolid className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{p.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TagIcon className="w-3.5 h-3.5" />
                      <span>Économisez {(p.originalPrice - p.promoPrice).toLocaleString()} FC</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>);

}