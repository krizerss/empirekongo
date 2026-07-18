'use client';
import React, { useState, useRef } from 'react';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  PhotoIcon,
  CheckBadgeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  ShoppingCartIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  category: string;
  subCategory: string;
  status: 'Actif' | 'Brouillon' | 'En attente';
  availability: 'Disponible' | 'Rupture' | 'Sur commande';
  dateAdded: string;
  image: string;
  description: string;
  views: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Café Robusta Premium',
    category: 'Agriculture',
    subCategory: 'Café & Cacao',
    status: 'Actif',
    availability: 'Disponible',
    dateAdded: '2024-05-10',
    image: '',
    description: 'Café robusta de haute qualité cultivé dans les collines du Kongo Central.',
    views: 342,
  },
  {
    id: 2,
    name: 'Manioc séché en sac',
    category: 'Agriculture',
    subCategory: 'Tubercules',
    status: 'Actif',
    availability: 'Disponible',
    dateAdded: '2024-04-22',
    image: '',
    description: 'Manioc séché et conditionné en sacs de 50 kg, prêt à l\'exportation.',
    views: 218,
  },
  {
    id: 3,
    name: 'Huile de palme artisanale',
    category: 'Agriculture',
    subCategory: 'Huiles végétales',
    status: 'En attente',
    availability: 'Sur commande',
    dateAdded: '2024-06-01',
    image: '',
    description: 'Huile de palme rouge produite artisanalement, sans additifs.',
    views: 95,
  },
  {
    id: 4,
    name: 'Charbon de bois (sac 25 kg)',
    category: 'Énergie',
    subCategory: 'Combustibles',
    status: 'Brouillon',
    availability: 'Disponible',
    dateAdded: '2024-06-15',
    image: '',
    description: 'Charbon de bois de qualité supérieure, idéal pour usage domestique.',
    views: 0,
  },
  {
    id: 5,
    name: 'Tomates fraîches (caisse)',
    category: 'Agriculture',
    subCategory: 'Légumes & Fruits',
    status: 'Actif',
    availability: 'Disponible',
    dateAdded: '2024-06-20',
    image: '',
    description: 'Tomates fraîches de saison, livrées en caisse de 20 kg.',
    views: 187,
  },
  {
    id: 6,
    name: 'Poulets fermiers vivants',
    category: 'Élevage',
    subCategory: 'Volailles',
    status: 'Actif',
    availability: 'Sur commande',
    dateAdded: '2024-07-01',
    image: '',
    description: 'Poulets élevés en plein air, sans antibiotiques, vendus à l\'unité.',
    views: 124,
  },
];

const CATEGORIES = ['Toutes', 'Agriculture', 'Élevage', 'Énergie', 'BTP', 'Mode', 'Technologie'];
const SUB_CATEGORIES: Record<string, string[]> = {
  Agriculture: ['Café & Cacao', 'Tubercules', 'Huiles végétales', 'Légumes & Fruits', 'Céréales'],
  Élevage: ['Volailles', 'Bovins', 'Porcins', 'Aquaculture'],
  Énergie: ['Combustibles', 'Solaire', 'Biomasse'],
  BTP: ['Matériaux', 'Outillage', 'Services'],
  Mode: ['Vêtements', 'Chaussures', 'Accessoires'],
  Technologie: ['Électronique', 'Informatique', 'Télécoms'],
};
const STATUSES = ['Tous', 'Actif', 'Brouillon', 'En attente'];
const AVAILABILITIES = ['Toutes', 'Disponible', 'Rupture', 'Sur commande'];

// ─── Mock enterprises (shared with MonEntreprisePage in a real app) ───────────

interface EnterpriseOption {
  id: string;
  name: string;
  category: string;
  location: string;
  logo: string;
  verified: boolean;
}

const MOCK_ENTERPRISES: EnterpriseOption[] = [
  {
    id: '1',
    name: 'Kongo Agro SARL',
    category: 'Agriculture',
    location: 'Kinshasa, RDC',
    logo: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png',
    verified: true,
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Product['status'] }) {
  const map: Record<Product['status'], string> = {
    Actif: 'bg-green-400/15 text-green-400 border-green-400/30',
    Brouillon: 'bg-zinc-400/15 text-zinc-400 border-zinc-400/30',
    'En attente': 'bg-amber-400/15 text-amber-400 border-amber-400/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status]}`}>
      {status}
    </span>
  );
}

function AvailabilityBadge({ availability }: { availability: Product['availability'] }) {
  const map: Record<Product['availability'], string> = {
    Disponible: 'text-green-400',
    Rupture: 'text-red-400',
    'Sur commande': 'text-blue-400',
  };
  return (
    <span className={`text-[10px] font-medium ${map[availability]}`}>● {availability}</span>
  );
}

// ─── Product placeholder image ────────────────────────────────────────────────

function ProductImagePlaceholder({ name }: { name: string }) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center gap-1">
      <span className="text-xl font-extrabold text-primary/60">{initials}</span>
    </div>
  );
}

// ─── Select dropdown helper ───────────────────────────────────────────────────

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full appearance-none bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors pr-8"
        >
          <option value="">Sélectionner...</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Add Product Modal ────────────────────────────────────────────────────────

function AddProductModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Omit<Product, 'id' | 'views' | 'dateAdded'>) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(MOCK_ENTERPRISES[0]?.id || '');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [enterpriseError, setEnterpriseError] = useState('');
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const selectedEnterprise = MOCK_ENTERPRISES.find((e) => e.id === selectedEnterpriseId);

  const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setMainImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setGalleryPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;
    if (!selectedEnterpriseId) {
      setEnterpriseError('Veuillez sélectionner une entreprise');
      return;
    }
    onAdd({
      name,
      description,
      category,
      subCategory,
      status: 'Brouillon',
      availability: 'Disponible',
      image: mainImagePreview || '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-base font-extrabold text-foreground">Ajouter un produit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Affiliez ce produit à l'une de vos entreprises</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Enterprise selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-widest">
              Entreprise affiliée <span className="text-red-400">*</span>
            </label>
            {MOCK_ENTERPRISES.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                Aucune entreprise trouvée. Créez d'abord une entreprise dans l'onglet <span className="font-bold">Mon entreprise</span>.
              </div>
            ) : MOCK_ENTERPRISES.length === 1 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/20">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary">
                  <img src={MOCK_ENTERPRISES[0].logo} alt={MOCK_ENTERPRISES[0].name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{MOCK_ENTERPRISES[0].name}</p>
                    {MOCK_ENTERPRISES[0].verified && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{MOCK_ENTERPRISES[0].category} · {MOCK_ENTERPRISES[0].location}</p>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0">Sélectionnée</span>
              </div>
            ) : (
              <div className="space-y-2">
                {MOCK_ENTERPRISES.map((ent) => (
                  <button
                    key={ent.id}
                    type="button"
                    onClick={() => { setSelectedEnterpriseId(ent.id); setEnterpriseError(''); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedEnterpriseId === ent.id
                        ? 'border-primary/50 bg-primary/8' :'border-border bg-secondary/50 hover:border-primary/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary">
                      <img src={ent.logo} alt={ent.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground truncate">{ent.name}</p>
                        {ent.verified && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{ent.category} · {ent.location}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      selectedEnterpriseId === ent.id ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {selectedEnterpriseId === ent.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {enterpriseError && <p className="text-xs text-red-400 mt-1">{enterpriseError}</p>}
            {selectedEnterprise && (
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                <BuildingOfficeIcon className="w-3 h-3 shrink-0" />
                Ce produit sera visible sur le profil de <span className="font-semibold text-foreground">{selectedEnterprise.name}</span>
              </p>
            )}
          </div>

          {/* Photo principale */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              Photo principale
            </label>
            <div
              onClick={() => mainImageRef.current?.click()}
              className="relative border-2 border-dashed border-border rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
            >
              {mainImagePreview ? (
                <img src={mainImagePreview} alt="Aperçu photo principale" className="w-full h-full object-cover" />
              ) : (
                <>
                  <PhotoIcon className="w-10 h-10 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">Cliquer pour ajouter une photo</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                </>
              )}
            </div>
            <input ref={mainImageRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
          </div>

          {/* Galerie d'images */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">
              Galerie d&apos;images
            </label>
            <div className="flex flex-wrap gap-2">
              {galleryPreviews.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={src} alt={`Galerie image ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryPreviews((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center"
                  >
                    <XMarkIcon className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => galleryRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <PlusIcon className="w-6 h-6 text-muted-foreground" />
                <span className="text-[9px] text-muted-foreground mt-1">Ajouter</span>
              </div>
            </div>
            <input ref={galleryRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGallery} />
          </div>

          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">
              Informations générales
            </h3>

            {/* Nom */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Nom du produit <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Café Robusta Premium 50 kg"
                required
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre produit : origine, qualité, conditionnement..."
                rows={4}
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none"
              />
            </div>

            {/* Catégorie + Sous-catégorie */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Catégorie"
                value={category}
                onChange={(v) => { setCategory(v); setSubCategory(''); }}
                options={CATEGORIES.filter((c) => c !== 'Toutes')}
                required
              />
              <SelectField
                label="Sous-catégorie"
                value={subCategory}
                onChange={setSubCategory}
                options={category ? (SUB_CATEGORIES[category] || []) : []}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Enregistrer le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Filter dropdown ──────────────────────────────────────────────────────────

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-secondary border border-border rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-foreground focus:outline-none focus:border-primary/60 transition-colors cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o === options[0] ? label : o}</option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Seller Profile Modal ─────────────────────────────────────────────────────

interface SellerInfo {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  verified: boolean;
  category: string;
}

function SellerProfileModal({ seller, onClose }: { seller: SellerInfo; onClose: () => void }) {
  const initials = seller.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-extrabold text-foreground">Profil du vendeur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-lg font-extrabold text-primary">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-extrabold text-foreground">{seller.name}</h3>
                {seller.verified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{seller.type}</p>
              {seller.verified && (
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                  ✓ Vérifié
                </span>
              )}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Localisation</p>
                <p className="text-sm font-semibold text-foreground">{seller.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <BuildingOfficeIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Secteur</p>
                <p className="text-sm font-semibold text-foreground">{seller.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <PhoneIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Téléphone</p>
                <p className="text-sm font-semibold text-foreground">{seller.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <EnvelopeIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Email</p>
                <p className="text-sm font-semibold text-foreground">{seller.email}</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Contacter le vendeur
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order / Reserve Modal ────────────────────────────────────────────────────

function OrderModal({
  productName,
  productId,
  mode,
  onClose,
}: {
  productName: string;
  productId: number;
  mode: 'reserve' | 'order';
  onClose: () => void;
}) {
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-extrabold text-foreground">
            {mode === 'reserve' ? '📅 Réserver ce produit' : '🛒 Commander ce produit'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        {submitted ? (
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">{mode === 'reserve' ? '📅' : '✅'}</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground mb-1">
              {mode === 'reserve' ? 'Réservation envoyée !' : 'Commande envoyée !'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {mode === 'reserve' ?'Le vendeur vous contactera pour confirmer la réservation.' :'Le vendeur a reçu votre commande et vous contactera bientôt.'}
            </p>
            <button onClick={onClose} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Produit</p>
              <p className="text-sm font-bold text-foreground">{productName}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantité</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Note (optionnel)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={mode === 'reserve' ? 'Date souhaitée, conditions...' : 'Instructions de livraison, précisions...'}
                rows={3}
                className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                Annuler
              </button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
                {mode === 'reserve' ? 'Réserver' : 'Commander'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MyProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('Toutes');
  const [filterStatus, setFilterStatus] = useState('Tous');
  const [filterAvailability, setFilterAvailability] = useState('Toutes');
  const [filterDate, setFilterDate] = useState('Toutes');
  const [showModal, setShowModal] = useState(false);
  const [sellerModal, setSellerModal] = useState<SellerInfo | null>(null);
  const [orderModal, setOrderModal] = useState<{ productName: string; productId: number; mode: 'reserve' | 'order' } | null>(null);

  const DATE_OPTIONS = ['Toutes', 'Aujourd\'hui', 'Cette semaine', 'Ce mois', 'Cette année'];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'Toutes' || p.category === filterCategory;
    const matchStatus = filterStatus === 'Tous' || p.status === filterStatus;
    const matchAvail = filterAvailability === 'Toutes' || p.availability === filterAvailability;
    return matchSearch && matchCat && matchStatus && matchAvail;
  });

  const handleAdd = (newProduct: Omit<Product, 'id' | 'views' | 'dateAdded'>) => {
    const today = new Date().toISOString().split('T')[0];
    setProducts((prev) => [
      { ...newProduct, id: Date.now(), views: 0, dateAdded: today },
      ...prev,
    ]);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Mes produits</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {products.length} produit{products.length !== 1 ? 's' : ''} dans votre catalogue
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shrink-0"
        >
          <PlusIcon className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-5 flex flex-col gap-3">
        {/* Search bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <FilterSelect label="Catégorie" value={filterCategory} onChange={setFilterCategory} options={CATEGORIES} />
          <FilterSelect label="Statut" value={filterStatus} onChange={setFilterStatus} options={STATUSES} />
          <FilterSelect label="Disponibilité" value={filterAvailability} onChange={setFilterAvailability} options={AVAILABILITIES} />
          <FilterSelect label="Date d'ajout" value={filterDate} onChange={setFilterDate} options={DATE_OPTIONS} />
          {(filterCategory !== 'Toutes' || filterStatus !== 'Tous' || filterAvailability !== 'Toutes' || search) && (
            <button
              onClick={() => { setFilterCategory('Toutes'); setFilterStatus('Tous'); setFilterAvailability('Toutes'); setSearch(''); }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {filtered.length !== products.length && (
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
            <MagnifyingGlassIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-base font-bold text-foreground mb-1">Aucun produit trouvé</p>
          <p className="text-sm text-muted-foreground">Essayez de modifier vos filtres ou votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group flex flex-col"
            >
              {/* Product image */}
              <div className="h-40 overflow-hidden relative">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <ProductImagePlaceholder name={product.name} />
                )}
                {/* Status overlay */}
                <div className="absolute top-2 left-2">
                  <StatusBadge status={product.status} />
                </div>
                {/* Action buttons overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <EyeIcon className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button className="w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center hover:bg-blue-500/80 transition-colors">
                    <PencilSquareIcon className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center hover:bg-red-500/80 transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>

              {/* Product info */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-bold text-foreground leading-tight line-clamp-1">{product.name}</h3>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">{product.description}</p>

                {/* Seller info — clickable */}
                <button
                  onClick={() =>
                    setSellerModal({
                      name: 'Ferme Kongo Agriculture',
                      type: 'Entreprise',
                      phone: '+243 xxx xxx xxx',
                      email: 'contact@fermekongo.cd',
                      city: 'Mbanza-Ngungu',
                      verified: true,
                      category: product.category,
                    })
                  }
                  className="flex items-center gap-1.5 mb-3 group/seller w-full text-left"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <span className="text-[8px] font-extrabold text-primary">FK</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground group-hover/seller:text-primary transition-colors font-medium underline-offset-2 group-hover/seller:underline truncate">
                    Ferme Kongo Agriculture
                  </span>
                  <CheckBadgeIcon className="w-3 h-3 text-primary shrink-0" />
                </button>

                {/* Category tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
                    {product.category}
                  </span>
                  {product.subCategory && (
                    <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[10px] font-medium rounded-full">
                      {product.subCategory}
                    </span>
                  )}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-2 border-t border-border mb-2">
                  <AvailabilityBadge availability={product.availability} />
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <EyeIcon className="w-3 h-3" />
                    <span>{product.views} vues</span>
                  </div>
                </div>

                {/* Reserve + Order buttons */}
                <div className="flex gap-1.5 mt-auto">
                  <button
                    onClick={() => setOrderModal({ productName: product.name, productId: product.id, mode: 'reserve' })}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/40 text-primary text-[11px] font-semibold hover:bg-primary/10 transition-colors"
                  >
                    <CalendarDaysIcon className="w-3 h-3" />
                    Réserver
                  </button>
                  <button
                    onClick={() => setOrderModal({ productName: product.name, productId: product.id, mode: 'order' })}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCartIcon className="w-3 h-3" />
                    Commander
                  </button>
                </div>

                <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                  Ajouté le {new Date(product.dateAdded).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add product modal */}
      {showModal && (
        <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}

      {/* Seller profile modal */}
      {sellerModal && (
        <SellerProfileModal seller={sellerModal} onClose={() => setSellerModal(null)} />
      )}

      {/* Order / Reserve modal */}
      {orderModal && (
        <OrderModal
          productName={orderModal.productName}
          productId={orderModal.productId}
          mode={orderModal.mode}
          onClose={() => setOrderModal(null)}
        />
      )}
    </div>
  );
}
