'use client';
import React, { useState, useRef, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MapPinIcon,
  ChatBubbleLeftIcon,
  PlusIcon,
  PencilSquareIcon,
  CameraIcon,
  StarIcon,
  EyeIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  TagIcon } from
'@heroicons/react/24/outline';
import {
  CheckBadgeIcon,
  StarIcon as StarSolid } from
'@heroicons/react/24/solid';

type EnterpriseTab = 'apropos' | 'produits' | 'galerie' | 'avis' | 'informations';

const TABS: {key: EnterpriseTab;label: string;}[] = [
{ key: 'apropos', label: 'À propos' },
{ key: 'produits', label: 'Produits' },
{ key: 'galerie', label: 'Galerie' },
{ key: 'avis', label: 'Avis' },
{ key: 'informations', label: 'Informations' }];


const enterpriseProducts = [
{
  id: 1,
  name: 'Café Robusta du Kongo',
  price: '25,000 FC',
  unit: '/ Kg',
  category: 'Agroalimentaire',
  status: 'Actif',
  views: 142,
  image: "https://images.unsplash.com/photo-1548230593-fd72a6504b80",
  alt: 'Grains de café robusta congolais dans un sac en jute brun'
},
{
  id: 2,
  name: 'Maïs Séché',
  price: '8,000 FC',
  unit: '/ Kg',
  category: 'Agriculture',
  status: 'Actif',
  views: 98,
  image: "https://images.unsplash.com/photo-1671371260099-19e317fa04b3",
  alt: 'Épis de maïs séché jaune doré sur fond sombre'
},
{
  id: 3,
  name: 'Miel Naturel',
  price: '7,000 FC',
  unit: '/ Pot',
  category: 'Agroalimentaire',
  status: 'Actif',
  views: 76,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_161c640b8-1784005760500.png",
  alt: 'Pot de miel naturel pur avec rayon de miel'
},
{
  id: 4,
  name: 'Huile de Palme Naturelle',
  price: '15,000 FC',
  unit: '/ Litre',
  category: 'Agroalimentaire',
  status: 'En attente',
  views: 54,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_100f6c606-1772807125471.png",
  alt: "Bouteille d\'huile de palme naturelle congolaise"
}];


const galleryImages = [
{ id: 1, src: "https://img.rocket.new/generatedImages/rocket_gen_img_13226860a-1774137538117.png", alt: 'Champs agricoles verts luxuriants au Congo' },
{ id: 2, src: "https://img.rocket.new/generatedImages/rocket_gen_img_186bfa786-1787646509451.png", alt: 'Récolte de maïs dans les champs congolais' },
{ id: 3, src: "https://img.rocket.new/generatedImages/rocket_gen_img_1f3a491e6-1772510978376.png", alt: 'Entrepôt de stockage de produits agricoles' },
{ id: 4, src: "https://img.rocket.new/generatedImages/rocket_gen_img_1c29cca8c-1787646508310.png", alt: 'Transformation artisanale de produits locaux' },
{ id: 5, src: "https://img.rocket.new/generatedImages/rocket_gen_img_19ccbe58b-1772175213968.png", alt: 'Équipe de travail dans les champs agricoles' },
{ id: 6, src: "https://img.rocket.new/generatedImages/rocket_gen_img_11654b5aa-1774112341278.png", alt: 'Marché local de produits frais congolais' }];


const reviews = [
{
  id: 1,
  author: 'Jean Mutombo',
  avatar: 'JM',
  rating: 5,
  date: 'Il y a 2 jours',
  comment: 'Excellente entreprise ! Les produits sont de très haute qualité et la livraison est rapide. Je recommande vivement.',
  product: 'Café Robusta du Kongo'
},
{
  id: 2,
  author: 'Marie Kabila',
  avatar: 'MK',
  rating: 4,
  date: 'Il y a 1 semaine',
  comment: 'Très bons produits agricoles. Le miel naturel est exceptionnel. Service client réactif et professionnel.',
  product: 'Miel Naturel'
},
{
  id: 3,
  author: 'Pierre Lumumba',
  avatar: 'PL',
  rating: 5,
  date: 'Il y a 2 semaines',
  comment: "Kongo Agro SARL est une référence dans le secteur agricole congolais. Qualité irréprochable à chaque commande.",
  product: 'Maïs Séché'
}];


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
  if (file.size > MAX_SIZE_BYTES) return 'Image trop lourde. Maximum 2 Mo.';
  return null;
}

export default function EnterprisePage() {
  const [activeTab, setActiveTab] = useState<EnterpriseTab>('apropos');
  const [isFollowing, setIsFollowing] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (validateImageFile(file)) return;
    if (coverUrl?.startsWith('blob:')) URL.revokeObjectURL(coverUrl);
    setCoverUrl(URL.createObjectURL(file));
    if (coverInputRef.current) coverInputRef.current.value = '';
  }, [coverUrl]);

  const handleLogoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (validateImageFile(file)) return;
    if (logoUrl?.startsWith('blob:')) URL.revokeObjectURL(logoUrl);
    setLogoUrl(URL.createObjectURL(file));
    if (logoInputRef.current) logoInputRef.current.value = '';
  }, [logoUrl]);

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-extrabold text-foreground">Mon entreprise</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
          <PencilSquareIcon className="w-3.5 h-3.5" />
          Modifier
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* ── Cover photo ── */}
        <div className="relative h-44 sm:h-52 overflow-hidden group">
          <AppImage
            src={coverUrl ?? 'https://images.unsplash.com/photo-1501184633355-06e92b102476'}
            alt="Champs agricoles verts luxuriants au Congo avec ciel bleu, couverture Kongo Agro SARL"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="100vw" />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Cover edit button */}
          <button
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-xs font-semibold text-white hover:bg-black/70 transition-colors">
            
            <CameraIcon className="w-3.5 h-3.5" />
            Changer la couverture
          </button>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

          {/* Stats overlay on cover */}
          <div className="absolute bottom-3 right-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <EyeIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">1,254 vues</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <UserGroupIcon className="w-3.5 h-3.5" />
              <span className="font-semibold">89 abonnés</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <StarSolid className="w-3.5 h-3.5 text-primary" />
              <span className="font-semibold">{avgRating} / 5</span>
            </div>
          </div>
        </div>

        {/* ── Enterprise header ── */}
        <div className="px-5 pb-0 -mt-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
            {/* Logo */}
            <div className="relative shrink-0 group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-card bg-card shadow-xl">
                <AppImage
                  src={logoUrl ?? 'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png'}
                  alt="Logo Kongo Agro SARL entreprise agricole congolaise, fond vert nature"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full" />
                
              </div>
              <button
                onClick={() => logoInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gold-gradient flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                aria-label="Changer le logo">
                
                <CameraIcon className="w-3 h-3 text-primary-foreground" />
              </button>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0 sm:pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-foreground leading-tight">Kongo Agro SARL</h2>
                <CheckBadgeIcon className="w-5 h-5 text-primary shrink-0" title="Entreprise vérifiée" />
              </div>
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                <span className="badge-gold flex items-center gap-1">
                  <TagIcon className="w-3 h-3" />
                  Agriculture
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  Kinshasa, RDC
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDaysIcon className="w-3.5 h-3.5" />
                  Fondée en 2018
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0 sm:pb-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg gold-gradient text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-md">
                <ChatBubbleLeftIcon className="w-4 h-4" />
                Contacter
              </button>
              <button
                onClick={() => setIsFollowing((v) => !v)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                isFollowing ?
                'border-primary bg-primary/10 text-primary' : 'border-border text-foreground hover:border-primary'}`
                }>
                
                {isFollowing ?
                <>
                    <CheckBadgeIcon className="w-4 h-4" />
                    Abonné
                  </> :

                <>
                    <PlusIcon className="w-4 h-4" />
                    Suivre
                  </>
                }
              </button>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-0 overflow-x-auto border-b border-border -mx-5 px-5">
            {TABS.map((tab) =>
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key ?
              'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
              }>
              
                {tab.label}
              </button>
            )}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="px-5 py-5">
          {/* À PROPOS */}
          {activeTab === 'apropos' &&
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left: about + contact */}
              <div className="lg:col-span-3 space-y-5">
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3 flex items-center gap-2">
                    <BuildingOfficeIcon className="w-4 h-4 text-primary" />
                    À propos de l'entreprise
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Kongo Agro SARL est une entreprise spécialisée dans la production et la transformation des produits agricoles locaux de grande qualité. Fondée en 2018 à Kinshasa, nous travaillons avec plus de 200 agriculteurs locaux pour offrir les meilleurs produits congolais sur le marché national et international.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                    Notre mission est de valoriser les ressources agricoles du Congo-Kinshasa en proposant des produits naturels, traçables et certifiés, tout en soutenant les communautés rurales locales.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                { label: 'Produits', value: '12', icon: TagIcon },
                { label: 'Abonnés', value: '89', icon: UserGroupIcon },
                { label: 'Avis', value: `${reviews.length}`, icon: StarIcon }].
                map((stat) =>
                <div key={stat.label} className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
                      <stat.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                      <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
                    </div>
                )}
                </div>

                {/* Contact info */}
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-3">Informations de contact</h3>
                  <div className="space-y-2.5">
                    {[
                  { icon: PhoneIcon, value: '+243 800 000 000', label: 'Téléphone' },
                  { icon: EnvelopeIcon, value: 'contact@kongoagro.cd', label: 'Email' },
                  { icon: GlobeAltIcon, value: 'www.kongoagro.cd', label: 'Site web' },
                  { icon: MapPinIcon, value: 'Kinshasa, RDC', label: 'Adresse' }].
                  map((item) =>
                  <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border border-border/40">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
                          <p className="text-xs font-semibold text-foreground truncate">{item.value}</p>
                        </div>
                      </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Right: products preview */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm text-foreground">Nos produits</h3>
                  <button
                  onClick={() => setActiveTab('produits')}
                  className="text-xs text-primary font-semibold hover:underline">
                  
                    Voir tout
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {enterpriseProducts.slice(0, 4).map((p) =>
                <div key={p.id} className="product-card overflow-hidden rounded-xl border border-border/50">
                      <div className="relative h-20 overflow-hidden">
                        <AppImage src={p.image} alt={p.alt} fill className="object-cover" sizes="15vw" />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold text-foreground leading-tight line-clamp-2">{p.name}</p>
                        <p className="text-[10px] text-primary font-extrabold mt-0.5">
                          {p.price} <span className="text-muted-foreground font-normal">{p.unit}</span>
                        </p>
                      </div>
                    </div>
                )}
                </div>
                <button
                onClick={() => setActiveTab('produits')}
                className="w-full py-2 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors">
                
                  Voir tous les produits
                </button>
              </div>
            </div>
          }

          {/* PRODUITS */}
          {activeTab === 'produits' &&
          <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-foreground">Tous les produits ({enterpriseProducts.length})</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg gold-gradient text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Ajouter un produit
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {enterpriseProducts.map((p) =>
              <div key={p.id} className="product-card overflow-hidden rounded-xl border border-border/50 group">
                    <div className="relative h-32 overflow-hidden">
                      <AppImage src={p.image} alt={p.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                      <div className="absolute top-2 right-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'Actif' ?
                    'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`
                    }>
                          {p.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-foreground leading-tight mb-1 line-clamp-2">{p.name}</p>
                      <p className="text-sm text-primary font-extrabold">
                        {p.price} <span className="text-xs text-muted-foreground font-normal">{p.unit}</span>
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <EyeIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">{p.views} vues</span>
                      </div>
                    </div>
                  </div>
              )}
                {/* Add product card */}
                <button className="rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 h-[168px] text-muted-foreground hover:text-primary group">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Ajouter</span>
                </button>
              </div>
            </div>
          }

          {/* GALERIE */}
          {activeTab === 'galerie' &&
          <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-foreground">Galerie photos ({galleryImages.length})</h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
                  <PlusIcon className="w-3.5 h-3.5" />
                  Ajouter des photos
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {galleryImages.map((img) =>
              <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer border border-border/30">
                    <AppImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="33vw" />
                
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <EyeIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
              )}
                {/* Add photo placeholder */}
                <button className="aspect-square rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary group">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlusIcon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold">Ajouter</span>
                </button>
              </div>
            </div>
          }

          {/* AVIS */}
          {activeTab === 'avis' &&
          <div>
              {/* Rating summary */}
              <div className="flex items-center gap-6 p-4 bg-secondary/30 rounded-xl border border-border/40 mb-5">
                <div className="text-center shrink-0">
                  <p className="text-4xl font-extrabold text-foreground">{avgRating}</p>
                  <div className="flex items-center gap-0.5 justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((s) =>
                  <StarSolid key={s} className={`w-3.5 h-3.5 ${parseFloat(avgRating) >= s ? 'text-primary' : 'text-muted-foreground/30'}`} />
                  )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{reviews.length} avis</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviews.filter((r) => r.rating === star).length;
                  const pct = reviews.length ? count / reviews.length * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-3 shrink-0">{star}</span>
                        <StarSolid className="w-3 h-3 text-primary shrink-0" />
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{count}</span>
                      </div>);

                })}
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-4">
                {reviews.map((review) =>
              <div key={review.id} className="p-4 bg-secondary/20 rounded-xl border border-border/40">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">{review.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="text-sm font-bold text-foreground">{review.author}</p>
                          <span className="text-[10px] text-muted-foreground">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 my-1">
                          {[1, 2, 3, 4, 5].map((s) =>
                      <StarSolid key={s} className={`w-3 h-3 ${review.rating >= s ? 'text-primary' : 'text-muted-foreground/30'}`} />
                      )}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                        <p className="text-[10px] text-primary/70 mt-1.5 font-medium">Produit : {review.product}</p>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* INFORMATIONS */}
          {activeTab === 'informations' &&
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* General info */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-foreground mb-3">Informations générales</h3>
                {[
              { label: "Nom de l'entreprise", value: 'Kongo Agro SARL' },
              { label: 'Secteur d\'activité', value: 'Agriculture & Agroalimentaire' },
              { label: 'Forme juridique', value: 'SARL' },
              { label: 'Date de création', value: '15 Mars 2018' },
              { label: 'Numéro RCCM', value: 'CD/KIN/RCCM/18-B-12345' },
              { label: 'Numéro d\'identification', value: 'A2018-KIN-00456' },
              { label: 'Effectif', value: '50 – 100 employés' }].
              map((item) =>
              <div key={item.label} className="flex flex-col gap-0.5 p-3 rounded-lg bg-secondary/30 border border-border/40">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
                    <p className="text-xs font-semibold text-foreground">{item.value}</p>
                  </div>
              )}
              </div>

              {/* Contact + location */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-foreground mb-3">Contact & Localisation</h3>
                {[
              { label: 'Téléphone principal', value: '+243 800 000 000', icon: PhoneIcon },
              { label: 'Téléphone secondaire', value: '+243 810 000 000', icon: PhoneIcon },
              { label: 'Email professionnel', value: 'contact@kongoagro.cd', icon: EnvelopeIcon },
              { label: 'Site web', value: 'www.kongoagro.cd', icon: GlobeAltIcon },
              { label: 'Adresse', value: 'Avenue du Commerce, Gombe, Kinshasa', icon: MapPinIcon },
              { label: 'Ville', value: 'Kinshasa', icon: MapPinIcon },
              { label: 'Pays', value: 'République Démocratique du Congo', icon: MapPinIcon }].
              map((item) =>
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/40">
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-3 h-3 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs font-semibold text-foreground break-words">{item.value}</p>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>
      </div>
    </div>);

}