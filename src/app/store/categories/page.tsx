'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  Squares2X2Icon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/solid';

interface SubCategory {
  name: string;
  count: number;
  href: string;
}

interface Category {
  id: number;
  label: string;
  icon: string;
  count: number;
  description: string;
  color: string;
  bgColor: string;
  featured?: boolean;
  subcategories: SubCategory[];
}

const categories: Category[] = [
  {
    id: 1,
    label: 'Agriculture',
    icon: '🌾',
    count: 134,
    description: 'Cultures vivrières, céréales, légumes et fruits frais du Congo',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10 border-green-500/20',
    featured: true,
    subcategories: [
      { name: 'Céréales & Grains', count: 34, href: '/store?cat=cereales' },
      { name: 'Légumes Frais', count: 28, href: '/store?cat=legumes' },
      { name: 'Fruits Tropicaux', count: 22, href: '/store?cat=fruits' },
      { name: 'Épices & Condiments', count: 18, href: '/store?cat=epices' },
      { name: 'Café & Cacao', count: 16, href: '/store?cat=cafe' },
      { name: 'Tubercules', count: 16, href: '/store?cat=tubercules' },
    ],
  },
  {
    id: 2,
    label: 'Agroalimentaire',
    icon: '🥘',
    count: 89,
    description: 'Produits transformés, conserves, huiles et denrées alimentaires',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    featured: true,
    subcategories: [
      { name: 'Huiles Alimentaires', count: 24, href: '/store?cat=huiles' },
      { name: 'Conserves & Bocaux', count: 18, href: '/store?cat=conserves' },
      { name: 'Farines & Amidons', count: 15, href: '/store?cat=farines' },
      { name: 'Boissons Locales', count: 14, href: '/store?cat=boissons' },
      { name: 'Poissons & Viandes', count: 18, href: '/store?cat=poissons' },
    ],
  },
  {
    id: 3,
    label: 'Élevage',
    icon: '🐄',
    count: 67,
    description: 'Animaux d\'élevage, produits laitiers et dérivés animaux',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    subcategories: [
      { name: 'Volailles', count: 22, href: '/store?cat=volailles' },
      { name: 'Bovins & Ovins', count: 18, href: '/store?cat=bovins' },
      { name: 'Produits Laitiers', count: 15, href: '/store?cat=laitiers' },
      { name: 'Aquaculture', count: 12, href: '/store?cat=aquaculture' },
    ],
  },
  {
    id: 4,
    label: 'Énergie',
    icon: '⚡',
    count: 43,
    description: 'Panneaux solaires, batteries, groupes électrogènes et solutions énergétiques',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    featured: true,
    subcategories: [
      { name: 'Panneaux Solaires', count: 14, href: '/store?cat=solaires' },
      { name: 'Batteries & Stockage', count: 12, href: '/store?cat=batteries' },
      { name: 'Groupes Électrogènes', count: 10, href: '/store?cat=groupes' },
      { name: 'Éclairage LED', count: 7, href: '/store?cat=led' },
    ],
  },
  {
    id: 5,
    label: 'BTP & Matériaux',
    icon: '🏗️',
    count: 56,
    description: 'Ciment, fer, bois, carrelage et matériaux de construction',
    color: 'text-stone-400',
    bgColor: 'bg-stone-500/10 border-stone-500/20',
    subcategories: [
      { name: 'Ciment & Béton', count: 16, href: '/store?cat=ciment' },
      { name: 'Fer & Métaux', count: 14, href: '/store?cat=fer' },
      { name: 'Bois & Menuiserie', count: 12, href: '/store?cat=bois' },
      { name: 'Carrelage & Revêtements', count: 8, href: '/store?cat=carrelage' },
      { name: 'Plomberie', count: 6, href: '/store?cat=plomberie' },
    ],
  },
  {
    id: 6,
    label: 'Mode & Beauté',
    icon: '👗',
    count: 72,
    description: 'Tissus wax, vêtements, cosmétiques et accessoires africains',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 border-pink-500/20',
    featured: true,
    subcategories: [
      { name: 'Tissus & Wax', count: 24, href: '/store?cat=tissus' },
      { name: 'Vêtements Femme', count: 18, href: '/store?cat=femme' },
      { name: 'Vêtements Homme', count: 14, href: '/store?cat=homme' },
      { name: 'Cosmétiques Naturels', count: 10, href: '/store?cat=cosmetiques' },
      { name: 'Bijoux & Accessoires', count: 6, href: '/store?cat=bijoux' },
    ],
  },
  {
    id: 7,
    label: 'Technologie',
    icon: '💻',
    count: 59,
    description: 'Smartphones, ordinateurs, électronique et services tech',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    subcategories: [
      { name: 'Smartphones', count: 18, href: '/store?cat=smartphones' },
      { name: 'Ordinateurs', count: 14, href: '/store?cat=ordinateurs' },
      { name: 'Accessoires Tech', count: 12, href: '/store?cat=accessoires-tech' },
      { name: 'Réparation & Services', count: 15, href: '/store?cat=reparation' },
    ],
  },
  {
    id: 8,
    label: 'Artisanat',
    icon: '🎨',
    count: 38,
    description: 'Sculptures, peintures, vannerie et art traditionnel congolais',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    subcategories: [
      { name: 'Sculptures & Masques', count: 12, href: '/store?cat=sculptures' },
      { name: 'Peintures & Toiles', count: 10, href: '/store?cat=peintures' },
      { name: 'Vannerie & Poterie', count: 9, href: '/store?cat=vannerie' },
      { name: 'Bijoux Artisanaux', count: 7, href: '/store?cat=bijoux-artisanaux' },
    ],
  },
  {
    id: 9,
    label: 'Santé & Bien-être',
    icon: '💊',
    count: 31,
    description: 'Plantes médicinales, compléments naturels et produits de santé',
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10 border-teal-500/20',
    subcategories: [
      { name: 'Plantes Médicinales', count: 12, href: '/store?cat=plantes' },
      { name: 'Compléments Naturels', count: 10, href: '/store?cat=complements' },
      { name: 'Hygiène & Soins', count: 9, href: '/store?cat=hygiene' },
    ],
  },
  {
    id: 10,
    label: 'Mobilier & Déco',
    icon: '🛋️',
    count: 27,
    description: 'Meubles, décoration intérieure et articles de maison',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    subcategories: [
      { name: 'Meubles', count: 10, href: '/store?cat=meubles' },
      { name: 'Décoration', count: 9, href: '/store?cat=decoration' },
      { name: 'Literie & Textiles', count: 8, href: '/store?cat=literie' },
    ],
  },
  {
    id: 11,
    label: 'Transport & Auto',
    icon: '🚗',
    count: 22,
    description: 'Pièces auto, motos, vélos et équipements de transport',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    subcategories: [
      { name: 'Pièces Automobiles', count: 10, href: '/store?cat=pieces-auto' },
      { name: 'Motos & Vélos', count: 7, href: '/store?cat=motos' },
      { name: 'Accessoires Auto', count: 5, href: '/store?cat=accessoires-auto' },
    ],
  },
  {
    id: 12,
    label: 'Éducation & Bureautique',
    icon: '📚',
    count: 19,
    description: 'Fournitures scolaires, livres, matériel de bureau',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    subcategories: [
      { name: 'Fournitures Scolaires', count: 8, href: '/store?cat=scolaire' },
      { name: 'Livres & Manuels', count: 6, href: '/store?cat=livres' },
      { name: 'Matériel de Bureau', count: 5, href: '/store?cat=bureau' },
    ],
  },
];

const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);

export default function CategoriesPage() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = categories.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const featured = categories.filter((c) => c.featured);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] border-b border-border py-14 px-4">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-12 text-8xl">🌾</div>
            <div className="absolute top-4 right-24 text-6xl">💻</div>
            <div className="absolute bottom-6 left-1/3 text-7xl">⚡</div>
            <div className="absolute bottom-4 right-12 text-5xl">👗</div>
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 badge-gold mb-4">
              <Squares2X2Icon className="w-3.5 h-3.5" />
              <span>Toutes les catégories</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              Explorez par <span className="gold-text">Catégorie</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              {totalProducts.toLocaleString()} produits répartis en {categories.length} catégories
            </p>
            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une catégorie..."
                className="w-full pl-12 pr-4 py-3.5 bg-secondary border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Featured Categories */}
          {!search && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <FireIcon className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Catégories Populaires</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/store?category=${cat.label}`}
                    className={`relative overflow-hidden rounded-2xl border p-6 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/40 ${cat.bgColor}`}
                  >
                    <span className="text-5xl">{cat.icon}</span>
                    <div>
                      <p className={`font-bold text-base ${cat.color}`}>{cat.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.count} produits</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Categories Grid */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">
                {search ? `Résultats pour "${search}"` : 'Toutes les catégories'}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({filtered.length})</span>
              </h2>
              <Link href="/store" className="text-sm text-primary hover:underline flex items-center gap-1">
                Voir tous les produits <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-muted-foreground text-lg">Aucune catégorie trouvée pour "{search}"</p>
                <button onClick={() => setSearch('')} className="mt-4 text-primary hover:underline text-sm">
                  Effacer la recherche
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((cat) => (
                  <div
                    key={cat.id}
                    className={`rounded-2xl border overflow-hidden transition-all duration-300 ${cat.bgColor} hover:shadow-lg hover:shadow-black/30`}
                  >
                    {/* Category Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-background/40 flex items-center justify-center text-2xl shrink-0">
                            {cat.icon}
                          </div>
                          <div>
                            <h3 className={`font-bold text-base ${cat.color}`}>{cat.label}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                          </div>
                        </div>
                        <span className="shrink-0 badge-gold text-xs">{cat.count}</span>
                      </div>

                      {/* Subcategories */}
                      <div className="mt-4 space-y-1.5">
                        {(expandedId === cat.id ? cat.subcategories : cat.subcategories.slice(0, 3)).map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/30 hover:bg-background/60 transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              <TagIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{sub.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{sub.count}</span>
                          </Link>
                        ))}
                        {cat.subcategories.length > 3 && (
                          <button
                            onClick={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
                            className="w-full text-xs text-primary hover:underline py-1 text-center"
                          >
                            {expandedId === cat.id
                              ? 'Voir moins'
                              : `+ ${cat.subcategories.length - 3} sous-catégories`}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-5 pb-4">
                      <Link
                        href={`/store?category=${cat.label}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-background/40 hover:bg-background/70 text-sm font-medium transition-colors group"
                      >
                        <span>Voir les produits</span>
                        <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Stats Bar */}
          <section className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Catégories', value: categories.length, icon: '📦' },
              { label: 'Produits', value: totalProducts, icon: '🛍️' },
              { label: 'Fournisseurs', value: 120, icon: '🏭' },
              { label: 'Villes couvertes', value: 18, icon: '📍' },
            ].map((stat) => (
              <div key={stat.label} className="stat-card text-center">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className="text-2xl font-extrabold text-primary">{stat.value.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
