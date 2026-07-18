'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ChatBubbleLeftEllipsisIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface SupplierProfile {
  id: number;
  name: string;
  logo: string;
  logoAlt: string;
  banner: string;
  bannerAlt: string;
  category: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  founded: string;
  employees: string;
  description: string;
  verified: boolean;
  type: string;
  rating: number;
  totalReviews: number;
  products: { id: number; name: string; price: string; unit: string; image: string; alt: string; rating: number }[];
  reviews: { id: number; author: string; rating: number; date: string; comment: string; avatar: string }[];
}

interface Props {
  supplier: SupplierProfile;
}

export default function SupplierClient({ supplier }: Props) {
  const { isLoggedIn } = useAuth();
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'contact'>('products');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  const handleContact = () => {
    if (!isLoggedIn) { setShowAuthGuard(true); return; }
    setActiveTab('contact');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { setShowAuthGuard(true); return; }
    setContactSent(true);
  };

  const avgRating = supplier.reviews.reduce((s, r) => s + r.rating, 0) / supplier.reviews.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Banner */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <AppImage src={supplier.banner} alt={supplier.bannerAlt} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        {/* Profile header */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative -mt-16 mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-background bg-card shadow-2xl shrink-0">
              <AppImage src={supplier.logo} alt={supplier.logoAlt} width={96} height={96} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-extrabold text-foreground">{supplier.name}</h1>
                {supplier.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    <CheckBadgeIcon className="w-3.5 h-3.5" />Vérifié
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">{supplier.type}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-primary font-semibold">{supplier.category}</span>
                <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" />{supplier.city}</span>
                <span className="flex items-center gap-1"><CalendarDaysIcon className="w-3.5 h-3.5" />Depuis {supplier.founded}</span>
                <span className="flex items-center gap-1"><BuildingOfficeIcon className="w-3.5 h-3.5" />{supplier.employees} employés</span>
              </div>
            </div>
            <div className="flex gap-2 pb-2">
              <button onClick={handleContact} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />Contacter
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
            {[
              { label: 'Produits', value: supplier.products.length.toString() + '+' },
              { label: 'Note', value: supplier.rating.toString(), icon: <StarSolid className="w-3.5 h-3.5 text-primary inline mr-0.5" /> },
              { label: 'Avis', value: supplier.totalReviews.toString() },
              { label: 'Fondé en', value: supplier.founded },
            ].map((stat, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-extrabold text-foreground">{stat.icon}{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* About */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <h2 className="text-sm font-extrabold text-foreground mb-2">À propos</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{supplier.description}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-border mb-6">
            {(['products', 'reviews', 'contact'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab === 'products' ? `Produits (${supplier.products.length})` : tab === 'reviews' ? `Avis (${supplier.reviews.length})` : 'Contact'}
              </button>
            ))}
          </div>

          {/* Products tab */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {supplier.products.map((product) => (
                <Link key={product.id} href={`/store/product/${product.id}`} className="product-card group flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <AppImage src={product.image} alt={product.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-xs font-bold text-foreground line-clamp-2 mb-1">{product.name}</h3>
                    <div className="flex items-center gap-1 mb-2">
                      <StarSolid className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-muted-foreground">{product.rating}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-sm font-extrabold text-primary">{product.price}</span>
                      <span className="text-[10px] text-muted-foreground">{product.unit}</span>
                    </div>
                    <button onClick={(e) => { e.preventDefault(); if (!isLoggedIn) setShowAuthGuard(true); }} className="mt-auto w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-semibold hover:bg-primary/90 transition-colors">
                      <ShoppingCartIcon className="w-3 h-3" />Commander
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-2xl mb-10">
              <div className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-primary">{avgRating.toFixed(1)}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => <StarSolid key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'text-primary' : 'text-muted-foreground/30'}`} />)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{supplier.totalReviews} avis au total</p>
                </div>
              </div>
              {supplier.reviews.map((review) => (
                <div key={review.id} className="p-4 bg-card border border-border rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{review.avatar}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{review.author}</p>
                        <p className="text-[10px] text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => <StarSolid key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-primary' : 'text-muted-foreground/30'}`} />)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* Contact tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
              {/* Contact info */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-extrabold text-foreground mb-4">Coordonnées</h3>
                  <div className="space-y-3">
                    {[
                      { icon: <MapPinIcon className="w-4 h-4 text-primary" />, label: 'Adresse', value: supplier.address },
                      { icon: <PhoneIcon className="w-4 h-4 text-primary" />, label: 'Téléphone', value: supplier.phone },
                      { icon: <EnvelopeIcon className="w-4 h-4 text-primary" />, label: 'Email', value: supplier.email },
                      { icon: <GlobeAltIcon className="w-4 h-4 text-primary" />, label: 'Site web', value: supplier.website },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-secondary rounded-xl">
                        {item.icon}
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">{item.label}</p>
                          <p className="text-sm font-semibold text-foreground">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="h-48 bg-secondary flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPinIcon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-semibold text-foreground">{supplier.city}</p>
                      <p className="text-xs text-muted-foreground">{supplier.address}</p>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,166,35,0.1),transparent_70%)]" />
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-extrabold text-foreground mb-4">Envoyer un message</h3>
                {contactSent ? (
                  <div className="text-center py-8">
                    <div className="w-14 h-14 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">✅</span>
                    </div>
                    <p className="font-bold text-foreground">Message envoyé !</p>
                    <p className="text-xs text-muted-foreground mt-1">{supplier.name} vous répondra bientôt.</p>
                    <button onClick={() => setContactSent(false)} className="mt-4 text-xs text-primary hover:underline">Envoyer un autre message</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Votre nom</label>
                      <input type="text" required value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jean Dupont" className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Votre email</label>
                      <input type="email" required value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} placeholder="jean@exemple.cd" className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Message</label>
                      <textarea required rows={5} value={contactForm.message} onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))} placeholder="Décrivez votre besoin, demande de devis..." className="w-full px-3 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                      Envoyer le message
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {showAuthGuard && <AuthGuardModal action="message" onClose={() => setShowAuthGuard(false)} />}
    </div>
  );
}
