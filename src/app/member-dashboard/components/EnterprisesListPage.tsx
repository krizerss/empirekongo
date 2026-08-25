'use client';
import React, { useState, useMemo } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon } from
'@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Enterprise {
  id: number;
  name: string;
  logo: string;
  logoAlt: string;
  cover: string;
  coverAlt: string;
  category: string;
  city: string;
  description: string;
  products: number;
  rating: number;
  reviews: number;
  verified: boolean;
  followers: number;
  founded: string;
}

const enterprises: Enterprise[] = [
{
  id: 1,
  name: 'Kongo Agro SARL',
  category: 'Agriculture',
  city: 'Kinshasa',
  logo: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png',
  logoAlt: 'Logo Kongo Agro SARL fond vert, entreprise agricole congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1734d4c84-1772803364064.png",
  coverAlt: 'Champs agricoles verts luxuriants au Congo, ferme africaine en production',
  description: "Leader de l'agriculture congolaise, Kongo Agro SARL produit et distribue des denrées alimentaires de qualité supérieure.",
  products: 48,
  rating: 4.8,
  reviews: 312,
  verified: true,
  followers: 89,
  founded: '2015'
},
{
  id: 2,
  name: 'EcoBuild SARL',
  category: 'BTP & Matériaux',
  city: 'Matadi',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_103a7f7c1-1787646508270.png",
  logoAlt: 'Logo EcoBuild SARL fond bleu, entreprise de construction congolaise',
  cover: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
  coverAlt: 'Chantier de construction moderne avec grues et matériaux à Matadi',
  description: 'Fournisseur de matériaux de construction de qualité pour les professionnels du BTP en RDC.',
  products: 67,
  rating: 4.2,
  reviews: 145,
  verified: false,
  followers: 54,
  founded: '2018'
},
{
  id: 3,
  name: 'TechCongo Solutions',
  category: 'Technologie',
  city: 'Kinshasa',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_14ca0f424-1787646507481.png",
  logoAlt: 'Logo TechCongo Solutions, entreprise technologique congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1fbd9a01b-1765828697210.png",
  coverAlt: 'Bureau moderne avec équipements informatiques et développeurs au travail',
  description: 'Solutions informatiques et technologiques innovantes pour les entreprises congolaises. Développement web, mobile et infrastructure.',
  products: 23,
  rating: 4.6,
  reviews: 98,
  verified: true,
  followers: 132,
  founded: '2019'
},
{
  id: 4,
  name: 'Congo Textile',
  category: 'Mode & Textile',
  city: 'Lubumbashi',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19eddd235-1787646508286.png",
  logoAlt: 'Logo Congo Textile, entreprise de mode et textile congolaise',
  cover: "https://images.unsplash.com/photo-1686155535993-afb41d41fbfb",
  coverAlt: 'Atelier de couture avec tissus colorés et machines à coudre à Lubumbashi',
  description: "Fabrication et distribution de vêtements et textiles de qualité, valorisant les tissus traditionnels congolais.",
  products: 35,
  rating: 4.4,
  reviews: 76,
  verified: true,
  followers: 67,
  founded: '2017'
},
{
  id: 5,
  name: 'Santé Plus RDC',
  category: 'Santé',
  city: 'Goma',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd7c06f7-1787646508430.png",
  logoAlt: 'Logo Santé Plus RDC, entreprise de santé congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_12191a16b-1769447560076.png",
  coverAlt: 'Clinique moderne avec personnel médical en blouse blanche à Goma',
  description: 'Distribution de médicaments et équipements médicaux pour les structures de santé en RDC.',
  products: 120,
  rating: 4.7,
  reviews: 203,
  verified: true,
  followers: 211,
  founded: '2016'
},
{
  id: 6,
  name: 'Énergie Verte Congo',
  category: 'Énergie',
  city: 'Kinshasa',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_13e52a4b4-1787646509440.png",
  logoAlt: 'Logo Énergie Verte Congo, entreprise solaire congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1c10745a7-1780650511052.png",
  coverAlt: 'Panneaux solaires installés sur un toit à Kinshasa sous soleil africain',
  description: "Solutions d'énergie solaire et renouvelable pour les ménages et entreprises congolaises.",
  products: 18,
  rating: 4.5,
  reviews: 87,
  verified: false,
  followers: 45,
  founded: '2020'
}];


const CATEGORIES = ['Toutes', ...Array.from(new Set(enterprises.map((e) => e.category)))];

export default function EnterprisesListPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.city.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Toutes' || e.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Entreprises</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} entreprise{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />
          
          {search &&
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            
              <XMarkIcon className="w-4 h-4" />
            </button>
          }
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) =>
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
            selectedCategory === cat ?
            'gold-gradient text-primary-foreground border-transparent shadow-md' :
            'bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`
            }>
            
              {cat}
            </button>
          )}
        </div>
      </div>

      {/* Enterprise grid */}
      {filtered.length === 0 ?
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <BuildingOfficeIcon className="w-12 h-12 mb-3 text-primary/30" />
          <p className="text-base font-semibold mb-1">Aucune entreprise trouvée</p>
          <p className="text-sm text-muted-foreground/60">Essayez d'autres mots-clés ou filtres.</p>
        </div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((enterprise) =>
        <div
          key={enterprise.id}
          className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 group cursor-pointer">
          
              {/* Cover */}
              <div className="relative h-28 overflow-hidden">
                <AppImage
              src={enterprise.cover}
              alt={enterprise.coverAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {enterprise.verified &&
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <CheckBadgeIcon className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-white">Vérifié</span>
                  </div>
            }
              </div>

              {/* Logo + info */}
              <div className="px-4 pb-4 -mt-7 relative">
                <div className="flex items-end gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-3 border-card bg-card shadow-lg shrink-0">
                    <AppImage
                  src={enterprise.logo}
                  alt={enterprise.logoAlt}
                  width={56}
                  height={56}
                  className="object-cover w-full h-full" />
                
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-extrabold text-foreground leading-tight truncate">{enterprise.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <TagIcon className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-[10px] text-muted-foreground truncate">{enterprise.category}</span>
                    </div>
                  </div>
                </div>

                {/* Location + rating */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPinIcon className="w-3 h-3 shrink-0" />
                    <span className="text-[11px]">{enterprise.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarSolid className="w-3 h-3 text-primary" />
                    <span className="text-[11px] font-bold text-foreground">{enterprise.rating}</span>
                    <span className="text-[10px] text-muted-foreground">({enterprise.reviews})</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {enterprise.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-3 h-3" />
                    <span>{enterprise.products} produits</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserGroupIcon className="w-3 h-3" />
                    <span>{enterprise.followers} abonnés</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BuildingOfficeIcon className="w-3 h-3" />
                    <span>Depuis {enterprise.founded}</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-2 rounded-xl gold-gradient text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-sm">
                  Voir l'entreprise
                </button>
              </div>
            </div>
        )}
        </div>
      }
    </div>);

}