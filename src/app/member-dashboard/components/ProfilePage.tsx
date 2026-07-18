'use client';
import React, { useState, useRef, useCallback } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  CameraIcon,
  MapPinIcon,
  PencilSquareIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ChatBubbleOvalLeftIcon,
  ExclamationTriangleIcon } from
'@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeSolid } from '@heroicons/react/24/solid';
import MonEntreprisePage from './MonEntreprisePage';

type ProfileTab = 'informations' | 'entreprise' | 'produits' | 'activite';

const tabs: {key: ProfileTab;label: string;}[] = [
{ key: 'informations', label: 'Informations' },
{ key: 'entreprise', label: 'Entreprise' },
{ key: 'produits', label: 'Produits' },
{ key: 'activite', label: 'Activité' }];


const recentActivity = [
{ id: 1, text: "Votre produit \'Café Robusta\' a été approuvé", time: 'Il y a 2 heures', icon: CheckCircleIcon, iconColor: 'text-green-400', iconBg: 'bg-green-400/10' },
{ id: 2, text: 'Nouveau message de Jean Mutombo', time: 'Il y a 3 heures', icon: ChatBubbleOvalLeftIcon, iconColor: 'text-blue-400', iconBg: 'bg-blue-400/10' },
{ id: 3, text: "Votre entreprise a reçu 21 vues aujourd\'hui", time: 'Il y a 1 jour', icon: BuildingOfficeIcon, iconColor: 'text-primary', iconBg: 'bg-primary/10' },
{ id: 4, text: 'Commande #1042 confirmée', time: 'Il y a 2 jours', icon: CheckCircleIcon, iconColor: 'text-green-400', iconBg: 'bg-green-400/10' },
{ id: 5, text: 'Nouveau avis 5 étoiles reçu', time: 'Il y a 3 jours', icon: CheckCircleIcon, iconColor: 'text-primary', iconBg: 'bg-primary/10' }];


const myProducts = [
{ id: 1, name: 'Café Robusta du Kongo', price: '25,000 FC', unit: '/ Kg', category: 'Agroalimentaire', status: 'Actif', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1584ec037-1777297733578.png', alt: 'Grains de café robusta du Congo', views: 142 },
{ id: 2, name: 'Huile de Palme Naturelle', price: '15,000 FC', unit: '/ Litre', category: 'Agroalimentaire', status: 'Actif', image: "https://img.rocket.new/generatedImages/rocket_gen_img_121e9621f-1765011340911.png", alt: 'Bouteille d\'huile de palme naturelle', views: 98 },
{ id: 3, name: 'Maïs Séché', price: '8,000 FC', unit: '/ Kg', category: 'Agriculture', status: 'En attente', image: "https://images.unsplash.com/photo-1571267013126-6c541fc89a0a", alt: 'Épis de maïs séché', views: 54 }];


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
  }
  if (file.size > MAX_SIZE_BYTES) {
    return 'Image trop lourde. Maximum 2 Mo.';
  }
  return null;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('informations');
  const [form, setForm] = useState({
    fullName: 'Christian Yukuwansompa',
    email: 'christian.yuku@mail.com',
    phone: '+243 800 000 000',
    joinDate: '12 Juin 2026',
    location: 'Kinshasa, RDC',
    bio: 'Entrepreneur & Producteur spécialisé dans les produits agricoles du Congo.',
    website: 'www.yukuwansompa.cd'
  });
  const [saved, setSaved] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePhotoChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPhotoError(null);
      const validationError = validateImageFile(file);
      if (validationError) {
        setPhotoError(validationError);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setPhotoUploading(true);
      if (profilePhotoUrl && profilePhotoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(profilePhotoUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setProfilePhotoUrl(newUrl);
      setTimeout(() => {
        setPhotoUploading(false);
      }, 800);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [profilePhotoUrl]
  );

  const currentPhotoSrc =
  profilePhotoUrl ??
  'https://img.rocket.new/generatedImages/rocket_gen_img_185c0d6c3-1783526083534.png';

  return (
    <div className="space-y-5">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Cover */}
        <div
          className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
          
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
              'radial-gradient(circle at 20% 50%, #F5A623 0%, transparent 60%)'
            }} />
          
        </div>

        <div className="px-5 pb-4 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            {/* Avatar + info */}
            <div className="flex items-end gap-4 -mt-10">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-card shadow-xl">
                  <AppImage
                    src={currentPhotoSrc}
                    alt="Portrait professionnel de Christian Yukuwansompa, entrepreneur congolais"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full" />
                  
                </div>
                {photoUploading &&
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                }
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0.5 right-0.5 w-6 h-6 rounded-full gold-gradient flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                  aria-label="Changer la photo de profil"
                  disabled={photoUploading}>
                  
                  <CameraIcon className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
              <div className="mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-base font-extrabold text-foreground leading-tight">
                    Christian Yukuwansompa
                  </h1>
                  <CheckBadgeSolid className="w-4 h-4 text-primary shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Entrepreneur &amp; Producteur</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPinIcon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Kinshasa, RDC</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 sm:mb-1">
              <button className="gold-gradient px-4 py-2 rounded-lg text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <PencilSquareIcon className="w-3.5 h-3.5" />
                Modifier le profil
              </button>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:border-primary hover:text-foreground transition-colors flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5" />
                Voir mon entreprise
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + Content */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) =>
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
            activeTab === tab.key ?
            'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
            }>
            
              {tab.label}
            </button>
          )}
        </div>

        <div className="p-5">
          {/* INFORMATIONS TAB */}
          {activeTab === 'informations' &&
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: form */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-sm font-bold text-foreground">Informations personnelles</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <UserIcon className="w-3 h-3" /> Nom complet
                    </label>
                    <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                  
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <EnvelopeIcon className="w-3 h-3" /> Email
                    </label>
                    <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                  
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <PhoneIcon className="w-3 h-3" /> Téléphone
                    </label>
                    <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                  
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <MapPinIcon className="w-3 h-3" /> Localisation
                    </label>
                    <input
                    type="text"
                    value={form.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                  
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <GlobeAltIcon className="w-3 h-3" /> Site web
                    </label>
                    <input
                    type="text"
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors" />
                  
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <CalendarDaysIcon className="w-3 h-3" /> Date d&apos;inscription
                    </label>
                    <input
                    type="text"
                    value={form.joinDate}
                    readOnly
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-muted-foreground outline-none cursor-not-allowed" />
                  
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Bio
                    </label>
                    <textarea
                    value={form.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={3}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none" />
                  
                  </div>
                </div>

                <button
                onClick={handleSave}
                className={`gold-gradient px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity ${saved ? 'opacity-70' : ''}`}>
                
                  {saved ? '✓ Enregistré' : 'Enregistrer les modifications'}
                </button>
              </div>

              {/* Right: photo + stats */}
              <div className="space-y-4">
                {/* Photo upload */}
                <div className="bg-secondary border border-border rounded-xl p-4 flex flex-col items-center gap-3">
                  <h3 className="text-xs font-bold text-foreground self-start">Photo de profil</h3>
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30">
                      <AppImage
                      src={currentPhotoSrc}
                      alt="Photo de profil Christian Yukuwansompa"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full" />
                    
                    </div>
                    {photoUploading &&
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                  }
                  </div>

                  <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                  aria-label="Sélectionner une photo de profil" />
                

                  <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={photoUploading}
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
                  
                    <CameraIcon className="w-3.5 h-3.5" />
                    {photoUploading ? 'Chargement...' : 'Changer la photo'}
                  </button>

                  {photoError &&
                <div className="flex items-start gap-1.5 w-full bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                      <ExclamationTriangleIcon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-400">{photoError}</p>
                    </div>
                }

                  <p className="text-[10px] text-muted-foreground text-center">
                    JPG, PNG ou WebP · Max 2 Mo
                    <br />
                    L&apos;ancienne photo sera supprimée automatiquement
                  </p>
                </div>

                {/* Account stats */}
                <div className="bg-secondary border border-border rounded-xl p-4 space-y-3">
                  <h3 className="text-xs font-bold text-foreground">Statistiques du compte</h3>
                  {[
                { label: 'Produits publiés', value: '12' },
                { label: 'Vues totales', value: '1,254' },
                { label: 'Favoris reçus', value: '34' },
                { label: 'Messages', value: '8' }].
                map((s) =>
                <div key={s.label} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{s.label}</span>
                      <span className="text-sm font-bold text-foreground">{s.value}</span>
                    </div>
                )}
                </div>
              </div>
            </div>
          }

          {/* ENTREPRISE TAB */}
          {activeTab === 'entreprise' &&
          <div className="-m-5">
              <div className="p-5">
                <MonEntreprisePage />
              </div>
            </div>
          }

          {/* PRODUITS TAB */}
          {activeTab === 'produits' &&
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">
                  Mes produits ({myProducts.length})
                </h2>
                <button className="gold-gradient px-4 py-2 rounded-lg text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  + Ajouter un produit
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) =>
              <div key={product.id} className="product-card">
                    <div className="relative h-32 overflow-hidden">
                      <AppImage
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw" />
                  
                      <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    product.status === 'Actif' ?
                    'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`
                    }>
                    
                        {product.status}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-foreground mb-1">{product.name}</h3>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        {product.category} · {product.views} vues
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-extrabold text-primary">{product.price}</span>
                        <span className="text-[10px] text-muted-foreground">{product.unit}</span>
                      </div>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* ACTIVITÉ TAB */}
          {activeTab === 'activite' &&
          <div className="space-y-3">
              <h2 className="text-sm font-bold text-foreground">Activité récente</h2>
              {recentActivity.map((act) =>
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 bg-secondary rounded-xl border border-border">
              
                  <div
                className={`w-8 h-8 rounded-lg ${act.iconBg} flex items-center justify-center shrink-0`}>
                
                    <act.icon className={`w-4 h-4 ${act.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground leading-relaxed">{act.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{act.time}</p>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

}