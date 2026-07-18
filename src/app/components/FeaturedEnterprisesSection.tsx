'use client';
import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { MapPinIcon, ArrowRightIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';

const enterprises = [
{
  id: 1,
  name: 'Kongo Agro SARL',
  category: 'Agriculture',
  city: 'Kinshasa',
  image: "https://images.unsplash.com/photo-1501184633355-06e92b102476",
  alt: 'Champs agricoles verts luxuriants au Congo, ferme agricole africaine en pleine production',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png",
  logoAlt: 'Logo Kongo Agro SARL fond vert, entreprise agricole congolaise'
},
{
  id: 2,
  name: 'EcoBuild SARL',
  category: 'BTP & Matériaux',
  city: 'Matadi',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png",
  alt: 'Chantier de construction moderne avec grues et matériaux, bâtiment en cours à Matadi',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11914d178-1784413962807.png",
  logoAlt: 'Logo EcoBuild SARL fond bleu, entreprise de construction congolaise'
},
{
  id: 3,
  name: 'Green Energie',
  category: 'Énergie',
  city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_178c3b07b-1784413971617.png",
  alt: 'Panneaux solaires sous ciel bleu africain, installation énergie renouvelable au Congo',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_174be1878-1784413962817.png",
  logoAlt: 'Logo Green Energie fond vert émeraude, entreprise énergétique congolaise'
},
{
  id: 4,
  name: 'Saveurs du Kongo',
  category: 'Agroalimentaire',
  city: 'Boma',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_11aeac4dd-1773092222659.png",
  alt: 'Étalage coloré de fruits et légumes tropicaux africains, marché alimentaire congolais',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1bcef8728-1784413963236.png",
  logoAlt: 'Logo Saveurs du Kongo fond orange, entreprise agroalimentaire congolaise'
},
{
  id: 5,
  name: 'TechKongo Solutions',
  category: 'Technologie',
  city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_16dc05e63-1772136844881.png",
  alt: 'Circuits imprimés et composants électroniques sur fond sombre, technologie africaine innovante',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1bba2e41c-1784370700110.png",
  logoAlt: 'Logo TechKongo Solutions fond bleu nuit, entreprise technologique congolaise'
}];


export default function FeaturedEnterprisesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();
  const [showAuthGuard, setShowAuthGuard] = useState(false);

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

  const handleMessage = () => {
    if (!isLoggedIn) {
      setShowAuthGuard(true);
    }
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-on-scroll [animation:animationIn_0.8s_ease-out_0.1s_both]">
          <h2 className="text-xl font-bold text-foreground">Entreprises en vedette</h2>
          <Link href="#" className="flex items-center gap-1 text-sm text-primary font-semibold hover:opacity-80 transition-opacity">
            Voir tout <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {enterprises?.map((ent, i) =>
          <div
            key={ent?.id}
            className="product-card animate-on-scroll [animation:animationIn_0.8s_ease-out_both] cursor-pointer flex flex-col"
            style={{ animationDelay: `${i * 0.08}s` }}>
            
              {/* Cover */}
              <div className="relative h-24 overflow-hidden">
                <AppImage
                src={ent?.image}
                alt={ent?.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 20vw" />
              
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              {/* Logo */}
              <div className="px-3 -mt-5 relative z-10">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-card bg-card shadow-lg">
                  <AppImage
                  src={ent?.logo}
                  alt={ent?.logoAlt}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full" />
                
                </div>
              </div>
              <div className="px-3 pb-3 pt-1 flex flex-col flex-1">
                <div className="flex items-center gap-1 mb-0.5">
                  <h3 className="text-xs font-bold text-foreground leading-tight">{ent?.name}</h3>
                  <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-1">{ent?.category}</p>
                <div className="flex items-center gap-1 mb-2">
                  <MapPinIcon className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-muted-foreground">{ent?.city}</span>
                </div>
                {/* Message button — requires auth */}
                <button
                onClick={handleMessage}
                className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/40 text-primary text-[10px] font-semibold hover:bg-primary/10 transition-colors">
                
                  <ChatBubbleLeftEllipsisIcon className="w-3 h-3" />
                  Contacter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showAuthGuard &&
      <AuthGuardModal action="message" onClose={() => setShowAuthGuard(false)} />
      }
    </section>);

}