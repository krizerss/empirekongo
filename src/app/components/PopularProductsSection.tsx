'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { ArrowRightIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';

const products = [
{
  id: 1,
  name: 'Café Robusta du Kongo',
  vendor: 'Kongo Agro SARL',
  price: '25,000 FC',
  unit: '/ Kg',
  image: "https://images.unsplash.com/photo-1702898708885-781c4833cdfb",
  alt: 'Grains de café robusta brun foncé sur fond sombre, texture riche et aromatique'
},
{
  id: 2,
  name: "Huile de Palme Naturelle",
  vendor: 'Saveurs du Kongo',
  price: '15,000 FC',
  unit: '/ Litre',
  image: "https://images.unsplash.com/photo-1696919960994-5a9d5373e2d7",
  alt: "Bouteille d'huile de palme orange dorée sur fond sombre, huile naturelle congolaise"
},
{
  id: 3,
  name: 'Maïs Séché',
  vendor: 'Kongo Agro SARL',
  price: '8,000 FC',
  unit: '/ Kg',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f701f8b-1772059631290.png",
  alt: 'Épis de maïs jaune séché sur fond sombre, céréales africaines traditionnelles'
},
{
  id: 4,
  name: 'Savon Artisanal',
  vendor: 'Saveurs du Kongo',
  price: '3,500 FC',
  unit: '/ Pièce',
  image: "https://images.unsplash.com/photo-1620567838715-4fc924689483",
  alt: 'Savons artisanaux naturels empilés sur fond sombre, savonnerie artisanale congolaise'
},
{
  id: 5,
  name: 'Miel Naturel',
  vendor: 'Kongo Agro SARL',
  price: '7,000 FC',
  unit: '/ Pot',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b47db9fd-1773266281961.png",
  alt: 'Pot de miel naturel doré ambré sur fond sombre, miel pur récolté au Congo'
},
{
  id: 6,
  name: 'Riz Local',
  vendor: 'Saveurs du Kongo',
  price: '6,000 FC',
  unit: '/ Kg',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_136eca2eb-1784370700193.png",
  alt: 'Riz blanc local dans un bol sur fond sombre, riz cultivé localement en RDC'
}];


export default function PopularProductsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const [showAuthGuard, setShowAuthGuard] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  const handleOrder = () => {
    if (!isLoggedIn) {
      setShowAuthGuard(true);
    }
    // If logged in, redirect to marketplace or open order flow
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-on-scroll [animation:animationIn_0.8s_ease-out_0.1s_both]">
          <h2 className="text-xl font-bold text-foreground">Produits populaires</h2>
          <Link href="/marketplace" className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-opacity">
            Voir tout <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products?.map((product, i) =>
          <div
            key={product?.id}
            className="product-card animate-on-scroll [animation:animationIn_0.8s_ease-out_both] cursor-pointer flex flex-col"
            style={{ animationDelay: `${i * 0.08}s` }}>
            
              <div className="relative h-36 overflow-hidden">
                <AppImage
                src={product?.image}
                alt={product?.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 16vw" />
              
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-xs font-bold text-foreground leading-tight mb-1 line-clamp-2">{product?.name}</h3>
                <p className="text-[10px] text-muted-foreground mb-2">{product?.vendor}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-sm font-extrabold text-primary">{product?.price}</span>
                  <span className="text-[10px] text-muted-foreground">{product?.unit}</span>
                </div>
                <button
                onClick={handleOrder}
                className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-colors">
                
                  <ShoppingCartIcon className="w-3 h-3" />
                  Commander
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAuthGuard &&
      <AuthGuardModal action="order" onClose={() => setShowAuthGuard(false)} />
      }
    </section>);

}