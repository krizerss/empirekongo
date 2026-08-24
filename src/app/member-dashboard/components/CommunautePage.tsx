'use client';
import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  UsersIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  BookmarkIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftIcon,
  ShareIcon,
  PlusIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { FireIcon as FireSolid } from '@heroicons/react/24/solid';

interface Post {
  id: number;
  author: string;
  initials: string;
  role: string;
  time: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  hot: boolean;
}

const posts: Post[] = [
  {
    id: 1,
    author: 'Jean Mutombo',
    initials: 'JM',
    role: 'Vendeur',
    time: 'Il y a 2h',
    category: 'Agriculture',
    title: 'Comment exporter du café robusta vers l\'Europe ?',
    content: 'Je cherche des conseils sur les certifications nécessaires pour exporter du café vers l\'UE. Quelqu\'un a de l\'expérience dans ce domaine ?',
    likes: 24,
    comments: 12,
    tags: ['export', 'café', 'agriculture'],
    hot: true,
  },
  {
    id: 2,
    author: 'Marie Lukusa',
    initials: 'ML',
    role: 'Entreprise',
    time: 'Il y a 5h',
    category: 'Business',
    title: 'Retour d\'expérience : lancer une startup à Kinshasa en 2024',
    content: 'Après 2 ans d\'activité, je partage les leçons apprises sur le financement, la réglementation et la croissance d\'une startup en RDC.',
    likes: 56,
    comments: 31,
    tags: ['startup', 'kinshasa', 'entrepreneuriat'],
    hot: true,
  },
  {
    id: 3,
    author: 'Paul Nkosi',
    initials: 'PN',
    role: 'Fournisseur',
    time: 'Il y a 1j',
    category: 'BTP',
    title: 'Fournisseurs de ciment fiables à Goma — recommandations ?',
    content: 'Je cherche des fournisseurs de ciment de qualité dans la région de Goma. Merci de partager vos contacts ou expériences.',
    likes: 18,
    comments: 9,
    tags: ['btp', 'ciment', 'goma'],
    hot: false,
  },
  {
    id: 4,
    author: 'Ange Kabila',
    initials: 'AK',
    role: 'Affilié',
    time: 'Il y a 2j',
    category: 'Finance',
    title: 'Mobile money vs banque traditionnelle pour les PME congolaises',
    content: 'Analyse comparative des solutions de paiement disponibles en RDC pour les petites et moyennes entreprises.',
    likes: 43,
    comments: 22,
    tags: ['finance', 'mobile-money', 'pme'],
    hot: false,
  },
];

const categories = ['Tous', 'Agriculture', 'Business', 'BTP', 'Finance', 'Technologie', 'Mode', 'Énergie'];

const topMembers = [
  { name: 'Marie Lukusa', initials: 'ML', posts: 47, role: 'Entreprise', color: 'bg-purple-500/20 text-purple-400' },
  { name: 'Jean Mutombo', initials: 'JM', posts: 38, role: 'Vendeur', color: 'bg-amber-500/20 text-amber-400' },
  { name: 'Christelle Banza', initials: 'CB', posts: 29, role: 'Affiliée', color: 'bg-pink-500/20 text-pink-400' },
  { name: 'Paul Nkosi', initials: 'PN', posts: 21, role: 'Fournisseur', color: 'bg-green-500/20 text-green-400' },
];

export default function CommunautePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-foreground mb-1">Communauté</h1>
          <p className="text-sm text-muted-foreground">Échangez, partagez et apprenez avec les membres EmpireKongo.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
          <PlusIcon className="w-4 h-4" />
          Nouvelle discussion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Membres actifs</p>
          <p className="text-2xl font-extrabold text-foreground">2,847</p>
          <p className="text-xs text-green-400 mt-1">+124 ce mois</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Discussions</p>
          <p className="text-2xl font-extrabold text-foreground">1,203</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Réponses</p>
          <p className="text-2xl font-extrabold text-primary">8,491</p>
          <p className="text-xs text-muted-foreground mt-1">Total</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">En ligne</p>
          <p className="text-2xl font-extrabold text-green-400">143</p>
          <p className="text-xs text-muted-foreground mt-1">Maintenant</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search + filter */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une discussion..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Posts */}
          {filtered.map((post) => (
            <div key={post.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{post.initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{post.author}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                      {post.role}
                    </span>
                    {post.hot && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <FireSolid className="w-2.5 h-2.5" />
                        Tendance
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">{post.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {post.category}
                    </span>
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-bold text-foreground mb-2 leading-snug">{post.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{post.content}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                    <TagIcon className="w-2.5 h-2.5" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    likedPosts.includes(post.id) ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <HandThumbUpIcon className="w-4 h-4" />
                  {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <ChatBubbleOvalLeftIcon className="w-4 h-4" />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <BookmarkIcon className="w-4 h-4" />
                  Sauvegarder
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  <ShareIcon className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <ChatBubbleLeftRightIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">Aucune discussion trouvée</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Top members */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Membres actifs</h3>
            </div>
            <div className="space-y-3">
              {topMembers.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground/50 w-4">{i + 1}</span>
                  <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold">{m.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.posts} posts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending tags */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <FireIcon className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-foreground">Tags populaires</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['export', 'agriculture', 'startup', 'kinshasa', 'finance', 'btp', 'mobile-money', 'pme', 'café', 'énergie'].map((tag) => (
                <button
                  key={tag}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-secondary text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  <TagIcon className="w-2.5 h-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
