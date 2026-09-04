'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  TagIcon,
  CalendarDaysIcon,
  EyeIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XMarkIcon,
  CameraIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ShoppingBagIcon,
  PhotoIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/supabase/database';

interface Enterprise {
  id: string;
  name: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  founded: string;
  employees: string;
  logo: string;
  cover: string;
  verified: boolean;
  views: number;
  followers: number;
  rating: number;
}

const CATEGORIES = [
  'Agriculture', 'Agroalimentaire', 'Commerce', 'Construction', 'Éducation',
  'Énergie', 'Finance', 'Immobilier', 'Industrie', 'Informatique',
  'Logistique', 'Santé', 'Services', 'Technologie', 'Tourisme', 'Transport',
];

const EMPLOYEES_OPTIONS = [
  '1-5', '6-10', '11-25', '26-50', '51-100', '100-500', '500+',
];

const PRODUCT_CATEGORIES = ['Agriculture', 'Élevage', 'Énergie', 'BTP', 'Mode', 'Technologie', 'Commerce', 'Services'];
const PRODUCT_SUB_CATEGORIES: Record<string, string[]> = {
  Agriculture: ['Café & Cacao', 'Tubercules', 'Huiles végétales', 'Légumes & Fruits', 'Céréales'],
  Élevage: ['Volailles', 'Bovins', 'Porcins', 'Aquaculture'],
  Énergie: ['Combustibles', 'Solaire', 'Biomasse'],
  BTP: ['Matériaux', 'Outillage', 'Services'],
  Mode: ['Vêtements', 'Chaussures', 'Accessoires'],
  Technologie: ['Électronique', 'Informatique', 'Télécoms'],
  Commerce: ['Gros', 'Détail', 'Import/Export'],
  Services: ['Conseil', 'Formation', 'Maintenance'],
};

const DEFAULT_COVER = 'https://images.unsplash.com/photo-1501184633355-06e92b102476';
const DEFAULT_LOGO = 'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Format non supporté. Utilisez JPG, PNG ou WebP.';
  if (file.size > MAX_SIZE) return 'Image trop lourde. Maximum 2 Mo.';
  return null;
}

const initialEnterprises: Enterprise[] = [
  {
    id: '1',
    name: 'Kongo Agro SARL',
    category: 'Agriculture',
    location: 'Kinshasa, RDC',
    phone: '+243 81 234 5678',
    email: 'contact@kongoagro.cd',
    website: 'www.kongoagro.cd',
    description: 'Entreprise spécialisée dans la production et la commercialisation de produits agricoles de qualité en République Démocratique du Congo.',
    founded: '2018',
    employees: '11-25',
    logo: DEFAULT_LOGO,
    cover: DEFAULT_COVER,
    verified: true,
    views: 1254,
    followers: 89,
    rating: 4.8,
  },
];

type ViewMode = 'list' | 'detail' | 'form';

interface FormData {
  name: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  founded: string;
  employees: string;
  logo: string;
  cover: string;
}

const emptyForm: FormData = {
  name: '', category: '', location: '', phone: '', email: '',
  website: '', description: '', founded: '', employees: '', logo: DEFAULT_LOGO, cover: DEFAULT_COVER,
};

// ── Add Product to Enterprise Modal ──────────────────────────────────────────

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  subCategory: string;
  enterpriseId: string;
  image: string;
}

function AddProductToEnterpriseModal({
  enterprises,
  preselectedEnterpriseId,
  onClose,
  onAdd,
}: {
  enterprises: Enterprise[];
  preselectedEnterpriseId: string;
  onClose: () => void;
  onAdd: (product: ProductFormData) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [enterpriseId, setEnterpriseId] = useState(preselectedEnterpriseId);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; category?: string; enterprise?: string }>({});
  const imageRef = useRef<HTMLInputElement>(null);

  const selectedEnterprise = enterprises.find((e) => e.id === enterpriseId);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Le nom est requis';
    if (!category) errs.category = 'La catégorie est requise';
    if (!enterpriseId) errs.enterprise = "Sélectionnez une entreprise";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ name, description, category, subCategory, enterpriseId, image: imagePreview || '' });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-7 h-7 text-green-400" />
          </div>
          <h3 className="text-base font-extrabold text-foreground mb-1">Produit ajouté !</h3>
          <p className="text-xs text-muted-foreground mb-1">
            <span className="font-semibold text-foreground">{name}</span> a été affilié à
          </p>
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md overflow-hidden border border-border">
              <AppImage src={selectedEnterprise?.logo || DEFAULT_LOGO} alt={selectedEnterprise?.name || ''} width={24} height={24} className="object-cover w-full h-full" />
            </div>
            <span className="text-sm font-bold text-primary">{selectedEnterprise?.name}</span>
          </div>
          <button onClick={onClose} className="w-full py-2.5 gold-gradient text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-opacity">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-base font-extrabold text-foreground">Ajouter un produit</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Affiliez ce produit à l'une de vos entreprises</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Enterprise selector */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-widest">
              Entreprise affiliée <span className="text-red-400">*</span>
            </label>
            {enterprises.length === 1 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/20">
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                  <AppImage src={enterprises[0].logo} alt={enterprises[0].name} width={40} height={40} className="object-cover w-full h-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{enterprises[0].name}</p>
                    {enterprises[0].verified && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{enterprises[0].category} · {enterprises[0].location}</p>
                </div>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Sélectionnée</span>
              </div>
            ) : (
              <div className="space-y-2">
                {enterprises.map((ent) => (
                  <button
                    key={ent.id}
                    type="button"
                    onClick={() => setEnterpriseId(ent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      enterpriseId === ent.id
                        ? 'border-primary/50 bg-primary/8' :'border-border bg-secondary/50 hover:border-primary/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                      <AppImage src={ent.logo} alt={ent.name} width={40} height={40} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-foreground truncate">{ent.name}</p>
                        {ent.verified && <CheckBadgeIcon className="w-3.5 h-3.5 text-primary shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{ent.category} · {ent.location}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                      enterpriseId === ent.id ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {enterpriseId === ent.id && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors.enterprise && <p className="text-xs text-red-400 mt-1">{errors.enterprise}</p>}
          </div>

          {/* Photo principale */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Photo principale</label>
            <div
              onClick={() => imageRef.current?.click()}
              className="relative border-2 border-dashed border-border rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Aperçu photo principale" className="w-full h-full object-cover" />
              ) : (
                <>
                  <PhotoIcon className="w-9 h-9 text-muted-foreground mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">Cliquer pour ajouter une photo</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, WEBP — max 5 Mo</p>
                </>
              )}
            </div>
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Nom du produit */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Nom du produit <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="Ex: Café Robusta Premium 50 kg"
              className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${errors.name ? 'border-red-500/60' : 'border-border'}`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre produit : origine, qualité, conditionnement..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors resize-none"
            />
          </div>

          {/* Catégorie + Sous-catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Catégorie <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setSubCategory(''); if (errors.category) setErrors((p) => ({ ...p, category: '' })); }}
                  className={`w-full appearance-none px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors pr-8 ${errors.category ? 'border-red-500/60' : 'border-border'}`}
                >
                  <option value="">Sélectionner...</option>
                  {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Sous-catégorie</label>
              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!category}
                  className="w-full appearance-none px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors pr-8 disabled:opacity-50"
                >
                  <option value="">Sélectionner...</option>
                  {(PRODUCT_SUB_CATEGORIES[category] || []).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
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
              className="flex-1 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              Enregistrer le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MonEntreprisePage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loadingEnterprises, setLoadingEnterprises] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addProductEnterpriseId, setAddProductEnterpriseId] = useState<string>('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const selectedEnterprise = enterprises.find((e) => e.id === selectedId) ?? null;

  useEffect(() => {
    let cancelled = false;
    const loadEnterprises = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) setEnterprises([]);
          return;
        }

        const { data, error } = await supabase
          .from('enterprises')
          .select('id, owner_id, name, description, logo_url, cover_url, category, city, address, phone, email, website, is_verified, employee_count, founded_year')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped: Enterprise[] = (data ?? []).map((row: any) => ({
          id: row.id,
          name: row.name ?? '',
          category: row.category ?? '',
          location: [row.city, row.address].filter(Boolean).join(', '),
          phone: row.phone ?? '',
          email: row.email ?? '',
          website: row.website ?? '',
          description: row.description ?? '',
          founded: row.founded_year ? String(row.founded_year) : '',
          employees: row.employee_count ? String(row.employee_count) : '',
          logo: row.logo_url && !row.logo_url.startsWith('blob:') ? row.logo_url : DEFAULT_LOGO,
          cover: row.cover_url && !row.cover_url.startsWith('blob:') ? row.cover_url : DEFAULT_COVER,
          verified: !!row.is_verified,
          views: 0,
          followers: 0,
          rating: 0,
        }));

        if (!cancelled) setEnterprises(mapped);
      } catch (error: any) {
        console.error('Erreur de chargement des entreprises:', error);
        if (!cancelled) alert(`Impossible de charger les entreprises : ${error?.message || 'erreur inconnue'}`);
      } finally {
        if (!cancelled) setLoadingEnterprises(false);
      }
    };

    loadEnterprises();
    return () => { cancelled = true; };
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormErrors({});
    setViewMode('form');
  };

  const openEdit = (enterprise: Enterprise) => {
    setEditingId(enterprise.id);
    setForm({
      name: enterprise.name,
      category: enterprise.category,
      location: enterprise.location,
      phone: enterprise.phone,
      email: enterprise.email,
      website: enterprise.website,
      description: enterprise.description,
      founded: enterprise.founded,
      employees: enterprise.employees,
      logo: enterprise.logo,
      cover: enterprise.cover,
    });
    setFormErrors({});
    setViewMode('form');
  };

  const openDetail = (id: string) => {
    setSelectedId(id);
    setViewMode('detail');
  };

  const openAddProduct = (enterpriseId: string) => {
    setAddProductEnterpriseId(enterpriseId);
    setShowAddProduct(true);
  };

  const handleFormChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = useCallback(async (field: 'logo' | 'cover', file: File) => {
    const err = validateImage(file);
    if (err) { alert(err); return; }

    try {
      setUploadingImage(true);
      const publicUrl = await uploadImage(file, 'enterprise');
      setForm((prev) => ({ ...prev, [field]: publicUrl }));
      showSuccess(field === 'logo' ? 'Logo téléversé avec succès !' : 'Photo de couverture téléversée avec succès !');
    } catch (error: any) {
      console.error('Erreur upload image entreprise:', error);
      alert(`Impossible de téléverser l'image : ${error?.message || 'erreur inconnue'}`);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const validate = (): boolean => {
    const errors: Partial<FormData> = {};
    if (!form.name.trim()) errors.name = 'Le nom est requis';
    if (!form.category) errors.category = 'La catégorie est requise';
    if (!form.location.trim()) errors.location = 'La localisation est requise';
    if (!form.email.trim()) errors.email = "L'email est requis";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        return;
      }

      if (uploadingImage) {
        alert('Le téléversement de l’image est encore en cours. Veuillez patienter.');
        return;
      }

      const employeeCount = Number.parseInt(form.employees, 10);
      const foundedYear = Number.parseInt(form.founded, 10);
      const payload = {
        owner_id: user.id,
        name: form.name.trim(),
        slug: form.name.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
        category: form.category,
        city: form.location.trim(),
        address: '',
        phone: form.phone.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        description: form.description.trim(),
        logo_url: form.logo && !form.logo.startsWith('blob:') ? form.logo : DEFAULT_LOGO,
        cover_url: form.cover && !form.cover.startsWith('blob:') ? form.cover : DEFAULT_COVER,
        employee_count: Number.isFinite(employeeCount) ? employeeCount : 0,
        founded_year: Number.isFinite(foundedYear) ? foundedYear : null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('enterprises')
          .update(payload)
          .eq('id', editingId)
          .eq('owner_id', user.id);
        if (error) throw error;

        const updated: Enterprise = {
          id: editingId, ...form, verified: enterprises.find((e) => e.id === editingId)?.verified ?? false,
          views: enterprises.find((e) => e.id === editingId)?.views ?? 0,
          followers: enterprises.find((e) => e.id === editingId)?.followers ?? 0,
          rating: enterprises.find((e) => e.id === editingId)?.rating ?? 0,
        };
        setEnterprises((prev) => prev.map((e) => e.id === editingId ? updated : e));
        showSuccess('Entreprise modifiée avec succès !');
        setSelectedId(editingId);
        setViewMode('detail');
      } else {
        const { data, error } = await supabase
          .from('enterprises')
          .insert(payload)
          .select('id, name, description, logo_url, cover_url, category, city, address, phone, email, website, is_verified, employee_count, founded_year')
          .single();
        if (error) throw error;

        const newEnt: Enterprise = {
          id: data.id, name: data.name ?? '', category: data.category ?? '',
          location: [data.city, data.address].filter(Boolean).join(', '), phone: data.phone ?? '',
          email: data.email ?? '', website: data.website ?? '', description: data.description ?? '',
          founded: data.founded_year ? String(data.founded_year) : '', employees: data.employee_count ? String(data.employee_count) : '',
          logo: data.logo_url || DEFAULT_LOGO, cover: data.cover_url || DEFAULT_COVER,
          verified: !!data.is_verified, views: 0, followers: 0, rating: 0,
        };
        setEnterprises((prev) => [newEnt, ...prev]);
        showSuccess('Entreprise créée avec succès !');
        setViewMode('list');
      }
    } catch (error: any) {
      console.error('Erreur Supabase entreprise:', error);
      alert(`Enregistrement impossible : ${error?.message || 'erreur inconnue'}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Votre session a expiré. Veuillez vous reconnecter.');
        return;
      }

      const { error } = await supabase
        .from('enterprises')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);
      if (error) throw error;

      setEnterprises((prev) => prev.filter((e) => e.id !== id));
      setDeleteConfirm(null);
      if (selectedId === id) setViewMode('list');
      showSuccess('Entreprise supprimée.');
    } catch (error: any) {
      console.error('Erreur Supabase suppression entreprise:', error);
      alert(`Suppression impossible : ${error?.message || 'erreur inconnue'}`);
    }
  };

  if (loadingEnterprises) {
    return <div className="space-y-5"><div className="text-sm text-muted-foreground">Chargement de vos entreprises...</div></div>;
  }

  // ── LIST VIEW ──
  if (viewMode === 'list') {
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Mes entreprises</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{enterprises.length} entreprise{enterprises.length !== 1 ? 's' : ''} enregistrée{enterprises.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter une entreprise
          </button>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Empty state */}
        {enterprises.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <BuildingOfficeIcon className="w-8 h-8 text-primary/50" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Aucune entreprise</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-xs">Créez votre première entreprise pour la présenter sur la plateforme.</p>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PlusIcon className="w-4 h-4" />
              Créer mon entreprise
            </button>
          </div>
        )}

        {/* Enterprise cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {enterprises.map((ent) => (
            <div key={ent.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-colors group">
              {/* Cover */}
              <div className="relative h-28 overflow-hidden">
                <AppImage
                  src={ent.cover}
                  alt={`Couverture de ${ent.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {ent.verified && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                    <CheckBadgeIcon className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary">Vérifié</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="px-4 pb-4 -mt-6 relative">
                <div className="flex items-end gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl border-2 border-card overflow-hidden bg-card shadow-lg shrink-0">
                    <AppImage src={ent.logo} alt={`Logo ${ent.name}`} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <h3 className="text-sm font-extrabold text-foreground truncate leading-tight">{ent.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="badge-gold text-[10px] flex items-center gap-0.5">
                        <TagIcon className="w-2.5 h-2.5" />
                        {ent.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{ent.location}</span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <EyeIcon className="w-3.5 h-3.5" />
                    {ent.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <UserGroupIcon className="w-3.5 h-3.5" />
                    {ent.followers}
                  </span>
                  {ent.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <StarSolid className="w-3.5 h-3.5 text-primary" />
                      {ent.rating}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDetail(ent.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-colors"
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                    Voir
                    <ChevronRightIcon className="w-3 h-3 ml-auto" />
                  </button>
                  <button
                    onClick={() => openEdit(ent)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-muted-foreground text-xs font-semibold hover:border-primary hover:text-foreground transition-colors"
                  >
                    <PencilSquareIcon className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(ent.id)}
                    className="p-2 rounded-lg border border-border text-muted-foreground hover:border-red-500/50 hover:text-red-400 transition-colors"
                    aria-label="Supprimer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delete confirm modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-base font-bold text-foreground text-center mb-1">Supprimer l'entreprise ?</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">Cette action est irréversible. Toutes les données seront perdues.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add product modal (from list — user picks enterprise) */}
        {showAddProduct && (
          <AddProductToEnterpriseModal
            enterprises={enterprises}
            preselectedEnterpriseId={addProductEnterpriseId}
            onClose={() => setShowAddProduct(false)}
            onAdd={() => { showSuccess('Produit ajouté avec succès !'); }}
          />
        )}
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (viewMode === 'detail' && selectedEnterprise) {
    const ent = selectedEnterprise;
    return (
      <div className="space-y-5">
        {/* Back + actions */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à la liste
          </button>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => openAddProduct(ent.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg gold-gradient text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              <ShoppingBagIcon className="w-3.5 h-3.5" />
              Ajouter un produit
            </button>
            <button
              onClick={() => openEdit(ent)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:border-primary hover:text-foreground transition-colors"
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
              Modifier
            </button>
            <button
              onClick={() => setDeleteConfirm(ent.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4 shrink-0" />
            {successMsg}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Cover */}
          <div className="relative h-44 sm:h-52 overflow-hidden">
            <AppImage
              src={ent.cover}
              alt={`Couverture de ${ent.name}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 right-4 flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <EyeIcon className="w-3.5 h-3.5" />
                <span className="font-semibold">{ent.views.toLocaleString()} vues</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-xs">
                <UserGroupIcon className="w-3.5 h-3.5" />
                <span className="font-semibold">{ent.followers} abonnés</span>
              </div>
              {ent.rating > 0 && (
                <div className="flex items-center gap-1.5 text-white/80 text-xs">
                  <StarSolid className="w-3.5 h-3.5 text-primary" />
                  <span className="font-semibold">{ent.rating} / 5</span>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="px-5 pb-5 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-5">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-card bg-card shadow-xl shrink-0">
                <AppImage src={ent.logo} alt={`Logo ${ent.name}`} width={80} height={80} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-xl font-extrabold text-foreground leading-tight">{ent.name}</h2>
                  {ent.verified && <CheckBadgeIcon className="w-5 h-5 text-primary shrink-0" title="Entreprise vérifiée" />}
                </div>
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
                  <span className="badge-gold flex items-center gap-1">
                    <TagIcon className="w-3 h-3" />
                    {ent.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {ent.location}
                  </span>
                  {ent.founded && (
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-3.5 h-3.5" />
                      Fondée en {ent.founded}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {ent.description && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-foreground mb-2">À propos</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{ent.description}</p>
              </div>
            )}

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ent.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <PhoneIcon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Téléphone</p>
                    <p className="text-sm font-semibold text-foreground">{ent.phone}</p>
                  </div>
                </div>
              )}
              {ent.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <EnvelopeIcon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">{ent.email}</p>
                  </div>
                </div>
              )}
              {ent.website && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <GlobeAltIcon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Site web</p>
                    <p className="text-sm font-semibold text-foreground truncate">{ent.website}</p>
                  </div>
                </div>
              )}
              {ent.employees && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                  <UserGroupIcon className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Employés</p>
                    <p className="text-sm font-semibold text-foreground">{ent.employees} personnes</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick add product CTA */}
            <div className="mt-5 p-4 rounded-xl bg-primary/5 border border-primary/15 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <ShoppingBagIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Ajouter un produit</p>
                  <p className="text-xs text-muted-foreground">Affiliez un produit directement à <span className="font-semibold text-foreground">{ent.name}</span></p>
                </div>
              </div>
              <button
                onClick={() => openAddProduct(ent.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg gold-gradient text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity shadow-sm shrink-0"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <TrashIcon className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-base font-bold text-foreground text-center mb-1">Supprimer l'entreprise ?</h3>
              <p className="text-sm text-muted-foreground text-center mb-5">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">Annuler</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* Add product modal */}
        {showAddProduct && (
          <AddProductToEnterpriseModal
            enterprises={enterprises}
            preselectedEnterpriseId={addProductEnterpriseId}
            onClose={() => setShowAddProduct(false)}
            onAdd={() => { showSuccess('Produit ajouté avec succès !'); }}
          />
        )}
      </div>
    );
  }

  // ── FORM VIEW (Create / Edit) ──
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode(editingId ? 'detail' : 'list')}
          className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-extrabold text-foreground">
            {editingId ? "Modifier l'entreprise" : 'Nouvelle entreprise'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {editingId ? 'Mettez à jour les informations de votre entreprise' : 'Renseignez les informations de votre entreprise'}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Cover preview + upload */}
        <div className="relative h-36 overflow-hidden group">
          <AppImage
            src={form.cover || DEFAULT_COVER}
            alt="Photo de couverture de l'entreprise"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-xs font-semibold text-white hover:bg-black/70 transition-colors"
          >
            <CameraIcon className="w-3.5 h-3.5" />
            Changer la couverture
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('cover', f); }}
          />
        </div>

        {/* Logo upload */}
        <div className="px-5 -mt-8 mb-4 relative">
          <div className="relative inline-block">
            <div className="w-16 h-16 rounded-xl overflow-hidden border-4 border-card bg-card shadow-lg">
              <AppImage src={form.logo || DEFAULT_LOGO} alt="Logo de l'entreprise" width={64} height={64} className="object-cover w-full h-full" />
            </div>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full gold-gradient flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
              aria-label="Changer le logo"
            >
              <CameraIcon className="w-3 h-3 text-primary-foreground" />
            </button>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('logo', f); }}
            />
          </div>
        </div>

        {/* Form fields */}
        <div className="px-5 pb-6 space-y-5">
          {/* Row 1: Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Nom de l'entreprise <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder="Ex: Kongo Agro SARL"
                className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${formErrors.name ? 'border-red-500/60' : 'border-border'}`}
              />
              {formErrors.name && <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Catégorie <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${formErrors.category ? 'border-red-500/60' : 'border-border'}`}
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {formErrors.category && <p className="text-xs text-red-400 mt-1">{formErrors.category}</p>}
            </div>
          </div>

          {/* Row 2: Location + Founded */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Localisation <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder="Ex: Kinshasa, RDC"
                className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${formErrors.location ? 'border-red-500/60' : 'border-border'}`}
              />
              {formErrors.location && <p className="text-xs text-red-400 mt-1">{formErrors.location}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Année de fondation</label>
              <input
                type="text"
                value={form.founded}
                onChange={(e) => handleFormChange('founded', e.target.value)}
                placeholder="Ex: 2018"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
              />
            </div>
          </div>

          {/* Row 3: Phone + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="+243 81 234 5678"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="contact@entreprise.cd"
                className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${formErrors.email ? 'border-red-500/60' : 'border-border'}`}
              />
              {formErrors.email && <p className="text-xs text-red-400 mt-1">{formErrors.email}</p>}
            </div>
          </div>

          {/* Row 4: Website + Employees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Site web</label>
              <input
                type="text"
                value={form.website}
                onChange={(e) => handleFormChange('website', e.target.value)}
                placeholder="www.entreprise.cd"
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Nombre d'employés</label>
              <select
                value={form.employees}
                onChange={(e) => handleFormChange('employees', e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
              >
                <option value="">Sélectionner</option>
                {EMPLOYEES_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Décrivez votre entreprise, ses activités, ses valeurs..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setViewMode(editingId ? 'detail' : 'list')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {editingId ? 'Enregistrer les modifications' : "Créer l'entreprise"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
