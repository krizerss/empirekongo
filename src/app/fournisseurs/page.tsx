'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon } from
'@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface Supplier {
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
  type: string;
  founded: string;
}

const suppliers: Supplier[] = [
{
  id: 1, name: 'Kongo Agro SARL', category: 'Agriculture', city: 'Kinshasa', type: 'Producteur',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png",
  logoAlt: 'Logo Kongo Agro SARL fond vert, entreprise agricole congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1734d4c84-1772803364064.png",
  coverAlt: 'Champs agricoles verts luxuriants au Congo, ferme agricole africaine en pleine production',
  description: 'Leader de l\'agriculture congolaise, Kongo Agro SARL produit et distribue des denrées alimentaires de qualité supérieure. Spécialisés dans les cultures vivrières et les produits d\'exportation.',
  products: 48, rating: 4.8, reviews: 312, verified: true, founded: '2015'
},
{
  id: 2, name: 'EcoBuild SARL', category: 'BTP & Matériaux', city: 'Matadi', type: 'Grossiste',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_103a7f7c1-1787646508270.png",
  logoAlt: 'Logo EcoBuild SARL fond bleu, entreprise de construction congolaise',
  cover: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
  coverAlt: 'Chantier de construction moderne avec grues et matériaux, bâtiment en cours à Matadi',
  description: 'Fournisseur de matériaux de construction de qualité pour les professionnels du BTP en RDC. Ciment, fer, bois et équipements disponibles en grande quantité.',
  products: 67, rating: 4.2, reviews: 145, verified: false, founded: '2018'
},
{
  id: 3, name: 'Green Energie', category: 'Énergie', city: 'Kinshasa', type: 'Importateur',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1e4a043f5-1784413143840.png",
  logoAlt: 'Logo Green Energie fond vert émeraude, entreprise énergétique congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png",
  coverAlt: 'Panneaux solaires sous ciel bleu africain, installation énergie renouvelable au Congo',
  description: 'Spécialiste des solutions d\'énergie renouvelable en RDC. Importation et installation de panneaux solaires, batteries et systèmes d\'éclairage pour particuliers et entreprises.',
  products: 23, rating: 4.7, reviews: 89, verified: true, founded: '2019'
},
{
  id: 4, name: 'Saveurs du Kongo', category: 'Agroalimentaire', city: 'Boma', type: 'Producteur',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_19b92d40e-1787646508289.png",
  logoAlt: 'Logo Saveurs du Kongo fond orange, entreprise agroalimentaire congolaise',
  cover: 'https://img.rocket.new/generatedImages/rocket_gen_img_11aeac4dd-1773092222659.png',
  coverAlt: 'Étalage coloré de fruits et légumes tropicaux africains, marché alimentaire congolais',
  description: 'Transformation et distribution de produits alimentaires locaux. Huiles, farines, conserves et épices issues des terroirs congolais, fabriquées selon des recettes traditionnelles.',
  products: 35, rating: 4.6, reviews: 267, verified: true, founded: '2012'
},
{
  id: 5, name: 'TechKongo Solutions', category: 'Technologie', city: 'Kinshasa', type: 'Distributeur',
  logo: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bba2e41c-1784370700110.png',
  logoAlt: 'Logo TechKongo Solutions fond bleu nuit, entreprise technologique congolaise',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3a8341e-1785794453121.png",
  coverAlt: 'Circuits imprimés et composants électroniques sur fond sombre, technologie africaine innovante',
  description: 'Distribution d\'équipements informatiques et électroniques reconditionnés. Réparation, maintenance et formation aux nouvelles technologies pour les entreprises congolaises.',
  products: 41, rating: 4.5, reviews: 198, verified: true, founded: '2017'
},
{
  id: 6, name: 'Mode Congo', category: 'Mode & Beauté', city: 'Kinshasa', type: 'Fabricant',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_13e4955e0-1784388894413.png",
  logoAlt: 'Logo Mode Congo, entreprise de mode et textile africain',
  cover: 'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png',
  coverAlt: 'Tissu wax africain coloré avec motifs géométriques traditionnels, textile africain authentique',
  description: 'Création et distribution de vêtements et tissus africains authentiques. Wax, bazin, soie et créations contemporaines inspirées des traditions vestimentaires congolaises.',
  products: 89, rating: 4.8, reviews: 423, verified: false, founded: '2014'
},
{
  id: 7, name: 'Congo Élevage Pro', category: 'Élevage', city: 'Lubumbashi', type: 'Producteur',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_168d904fb-1784388894499.png",
  logoAlt: 'Logo Congo Élevage Pro, ferme avicole et bovine congolaise',
  cover: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png',
  coverAlt: 'Poulet de ferme bien nourri dans une ferme avicole africaine, élevage traditionnel congolais',
  description: 'Élevage professionnel de volailles, bovins et porcins. Viandes fraîches, œufs et produits laitiers livrés directement aux restaurants, hôtels et particuliers de Lubumbashi.',
  products: 18, rating: 4.4, reviews: 76, verified: true, founded: '2016'
},
{
  id: 8, name: 'Pharma Kongo', category: 'Santé', city: 'Kinshasa', type: 'Grossiste',
  logo: "https://img.rocket.new/generatedImages/rocket_gen_img_132c518e0-1787646508101.png",
  logoAlt: 'Logo Pharma Kongo, distributeur pharmaceutique congolais',
  cover: "https://img.rocket.new/generatedImages/rocket_gen_img_154e5b012-1780833154113.png",
  coverAlt: 'Médicaments et produits pharmaceutiques sur fond blanc, pharmacie professionnelle',
  description: 'Distribution de médicaments génériques et de matériel médical aux pharmacies, cliniques et hôpitaux de la RDC. Partenaire de confiance du secteur de la santé depuis 2010.',
  products: 156, rating: 4.9, reviews: 534, verified: true, founded: '2010'
}];


const categories = ['Toutes', 'Agriculture', 'Agroalimentaire', 'BTP & Matériaux', 'Énergie', 'Technologie', 'Mode & Beauté', 'Élevage', 'Santé'];
const types = ['Tous', 'Producteur', 'Grossiste', 'Importateur', 'Fabricant', 'Distributeur'];
const cities = ['Toutes', 'Kinshasa', 'Boma', 'Matadi', 'Lubumbashi', 'Goma'];

export default function FournisseursPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...suppliers];
    if (search) list = list.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()));
    if (selectedCategory !== 'Toutes') list = list.filter((s) => s.category === selectedCategory);
    if (selectedType !== 'Tous') list = list.filter((s) => s.type === selectedType);
    if (selectedCity !== 'Toutes') list = list.filter((s) => s.city === selectedCity);
    if (onlyVerified) list = list.filter((s) => s.verified);
    return list;
  }, [search, selectedCategory, selectedType, selectedCity, onlyVerified]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <div className="bg-card border-b border-border px-4 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-extrabold text-foreground mb-1">Fournisseurs & Entreprises</h1>
              <p className="text-sm text-muted-foreground">{filtered.length} fournisseurs trouvés sur EmpireKongo</p>
            </div>

            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un fournisseur, une entreprise..."
                  className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                
                {search &&
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                }
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${showFilters ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}>
                <AdjustmentsHorizontalIcon className="w-4 h-4" />Filtres
              </button>
            </div>

            {/* Filter chips */}
            {showFilters &&
            <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Catégorie :</span>
                  {categories.map((c) =>
                <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedCategory === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{c}</button>
                )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Type :</span>
                  {types.map((t) =>
                <button key={t} onClick={() => setSelectedType(t)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{t}</button>
                )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">Ville :</span>
                  {cities.map((c) =>
                <button key={c} onClick={() => setSelectedCity(c)} className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${selectedCity === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40'}`}>{c}</button>
                )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer self-center">
                  <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-xs text-muted-foreground font-semibold">Vérifiés uniquement</span>
                </label>
              </div>
            }
          </div>
        </div>

        {/* List */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {filtered.length === 0 ?
          <div className="text-center py-20">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-foreground font-bold">Aucun fournisseur trouvé</p>
              <p className="text-muted-foreground text-sm mt-1">Essayez d'autres critères de recherche</p>
            </div> :

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((supplier) =>
            <div key={supplier.id} className="product-card group flex flex-col overflow-hidden">
                  {/* Cover */}
                  <div className="relative h-28 overflow-hidden">
                    <AppImage src={supplier.cover} alt={supplier.coverAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white border border-white/20">{supplier.type}</span>
                    </div>
                  </div>

                  {/* Logo */}
                  <div className="px-4 -mt-6 relative z-10 flex items-end justify-between">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-card bg-card shadow-lg">
                      <AppImage src={supplier.logo} alt={supplier.logoAlt} width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                    {supplier.verified &&
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full mb-1">
                        <CheckBadgeIcon className="w-3 h-3" />Vérifié
                      </span>
                }
                  </div>

                  {/* Info */}
                  <div className="px-4 pt-2 pb-4 flex flex-col flex-1">
                    <h3 className="text-sm font-extrabold text-foreground mb-0.5">{supplier.name}</h3>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] text-primary font-semibold">{supplier.category}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><MapPinIcon className="w-3 h-3" />{supplier.city}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">{supplier.description}</p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-center">
                        <p className="text-sm font-extrabold text-foreground">{supplier.products}</p>
                        <p className="text-[10px] text-muted-foreground">Produits</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <StarSolid className="w-3.5 h-3.5 text-primary" />
                          <span className="text-sm font-extrabold text-foreground">{supplier.rating}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{supplier.reviews} avis</p>
                      </div>
                      <div className="w-px h-8 bg-border" />
                      <div className="text-center">
                        <p className="text-sm font-extrabold text-foreground">{supplier.founded}</p>
                        <p className="text-[10px] text-muted-foreground">Fondé</p>
                      </div>
                    </div>

                    <Link href={`/fournisseurs/${supplier.id}`} className="w-full flex items-center justify-center py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors">
                      Voir le profil →
                    </Link>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </main>
      <Footer />
    </div>);

}