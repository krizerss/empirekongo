'use client';
import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { ArrowRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

const articles = [
{
  id: 1,
  title: 'Les jeunes entrepreneurs au cœur du développement',
  date: '15 Juil 2026',
  category: 'Communauté',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f786e9a-1772387694253.png",
  alt: 'Groupe de jeunes entrepreneurs africains souriants en réunion professionnelle, ambiance dynamique et collaborative'
},
{
  id: 2,
  title: "Salon International de l\'Agriculture 2026",
  date: '10 Juil 2026',
  category: 'Événement',
  image: "https://images.unsplash.com/photo-1462811404017-1bb91081d006",
  alt: 'Champs agricoles verts avec tracteur rouge au coucher du soleil, salon agriculture africaine 2026'
},
{
  id: 3,
  title: 'Comment booster votre entreprise ?',
  date: '5 Juil 2026',
  category: 'Conseils',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c530bfdb-1772808047021.png",
  alt: "Homme d'affaires africain confiant en costume sombre, conseils entreprise Congo"
},
{
  id: 4,
  title: 'Les nouvelles tendances du marché congolais',
  date: '1 Juil 2026',
  category: 'Marché',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11654b5aa-1774112341278.png",
  alt: 'Marché animé africain avec vendeurs et acheteurs, tendances économiques du Congo 2026'
}];


export default function NewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('animate');
        });
      },
      { threshold: 0.1 }
    );
    const elements = sectionRef?.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer?.observe(el));
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 px-4 bg-background pb-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-on-scroll [animation:animationIn_0.8s_ease-out_0.1s_both]">
          <h2 className="text-xl font-bold text-foreground">Actualités & Annonces</h2>
          <Link href="#" className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-opacity">
            Voir tout <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {articles?.map((article, i) =>
          <div
            key={article?.id}
            className="product-card group animate-on-scroll [animation:animationIn_0.8s_ease-out_both] cursor-pointer"
            style={{ animationDelay: `${i * 0.08}s` }}>
            
              <div className="relative h-40 overflow-hidden">
                <AppImage
                src={article?.image}
                alt={article?.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute top-2 left-2 badge-gold text-[10px]">{article?.category}</span>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold text-foreground leading-tight mb-2 line-clamp-2">{article?.title}</h3>
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{article?.date}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}