'use client';
import React, { useState } from 'react';
import {
  TagIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

interface Category {
  id: number;
  nom: string;
  slug: string;
  description: string;
  produits: number;
  fournisseurs: number;
  couleur: string;
  actif: boolean;
  parent?: string;
}

const mockCategories: Category[] = [
  { id: 1, nom: 'Agriculture & Alimentation', slug: 'agriculture', description: 'Produits agricoles, alimentaires et de la ferme', produits: 142, fournisseurs: 18, couleur: '#22c55e', actif: true },
  { id: 2, nom: 'Textile & Mode', slug: 'textile', description: 'Vêtements, tissus, accessoires de mode', produits: 89, fournisseurs: 12, couleur: '#f59e0b', actif: true },
  { id: 3, nom: 'Électronique & Tech', slug: 'electronique', description: 'Appareils électroniques, téléphones, accessoires', produits: 67, fournisseurs: 8, couleur: '#3b82f6', actif: true },
  { id: 4, nom: 'Artisanat & Art', slug: 'artisanat', description: 'Objets artisanaux, sculptures, peintures', produits: 54, fournisseurs: 22, couleur: '#f97316', actif: true },
  { id: 5, nom: 'Beauté & Cosmétiques', slug: 'beaute', description: 'Produits de beauté, soins, cosmétiques naturels', produits: 78, fournisseurs: 15, couleur: '#ec4899', actif: true },
  { id: 6, nom: 'Construction & BTP', slug: 'construction', description: 'Matériaux de construction, outillage', produits: 31, fournisseurs: 6, couleur: '#6b7280', actif: true },
  { id: 7, nom: 'Import / Export', slug: 'import-export', description: 'Commerce international, produits importés', produits: 45, fournisseurs: 9, couleur: '#8b5cf6', actif: true },
  { id: 8, nom: 'Services', slug: 'services', description: 'Prestations de service, consulting', produits: 23, fournisseurs: 14, couleur: '#06b6d4', actif: false },
];

interface EditModalProps {
  category: Partial<Category> | null;
  onClose: () => void;
  onSave: (cat: Partial<Category>) => void;
  isNew: boolean;
}

function EditModal({ category, onClose, onSave, isNew }: EditModalProps) {
  const [form, setForm] = useState<Partial<Category>>(category ?? { actif: true, couleur: '#F5A623' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-foreground">{isNew ? 'Nouvelle catégorie' : 'Modifier la catégorie'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Nom</label>
            <input
              type="text"
              value={form.nom ?? ''}
              onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="Nom de la catégorie"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Slug</label>
            <input
              type="text"
              value={form.slug ?? ''}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
              placeholder="slug-url"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Description</label>
            <textarea
              value={form.description ?? ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
              placeholder="Description courte"
            />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Couleur</label>
              <input
                type="color"
                value={form.couleur ?? '#F5A623'}
                onChange={e => setForm(f => ({ ...f, couleur: e.target.value }))}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setForm(f => ({ ...f, actif: !f.actif }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${form.actif ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.actif ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs text-muted-foreground">{form.actif ? 'Active' : 'Inactive'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            {isNew ? 'Créer' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [search, setSearch] = useState('');
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave(form: Partial<Category>) {
    if (editTarget) {
      setCategories(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...form } : c));
      showToast('Catégorie mise à jour.');
      setEditTarget(null);
    } else {
      const newCat: Category = {
        id: Date.now(),
        nom: form.nom ?? 'Nouvelle catégorie',
        slug: form.slug ?? 'nouvelle-categorie',
        description: form.description ?? '',
        produits: 0,
        fournisseurs: 0,
        couleur: form.couleur ?? '#F5A623',
        actif: form.actif ?? true,
      };
      setCategories(prev => [...prev, newCat]);
      showToast('Catégorie créée avec succès.');
      setShowNew(false);
    }
  }

  function handleDelete(id: number) {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Catégorie supprimée.', 'error');
  }

  function handleToggle(id: number) {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, actif: !c.actif } : c));
    showToast('Statut mis à jour.');
  }

  const filtered = categories.filter(c => {
    const q = search.toLowerCase();
    return !q || c.nom.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {toast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold ${
          toast.type === 'success' ? 'bg-green-500/15 border-green-500/30 text-green-400' : 'bg-red-500/15 border-red-500/30 text-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircleIcon className="w-4 h-4" /> : <XMarkIcon className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {(editTarget || showNew) && (
        <EditModal
          category={editTarget}
          isNew={showNew}
          onClose={() => { setEditTarget(null); setShowNew(false); }}
          onSave={handleSave}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Gestion des <span className="gold-text">Catégories</span></h1>
          <p className="text-sm text-muted-foreground mt-0.5">Organiser les produits et fournisseurs par catégorie</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-foreground">{categories.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Total catégories</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-green-400">{categories.filter(c => c.actif).length}</p>
          <p className="text-xs text-muted-foreground mt-1">Actives</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-primary">{categories.reduce((acc, c) => acc + c.produits, 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Produits total</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-extrabold text-blue-400">{categories.reduce((acc, c) => acc + c.fournisseurs, 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">Fournisseurs</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Rechercher une catégorie…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(cat => (
          <div key={cat.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${cat.couleur}20`, border: `1px solid ${cat.couleur}40` }}
              >
                <TagIcon className="w-5 h-5" style={{ color: cat.couleur }} />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditTarget(cat)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <PencilSquareIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/15 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-sm text-foreground mb-1 leading-snug">{cat.nom}</h3>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShoppingBagIcon className="w-3 h-3" />
                  {cat.produits}
                </span>
                <span>{cat.fournisseurs} fourn.</span>
              </div>
              <button
                onClick={() => handleToggle(cat.id)}
                className={`relative w-8 h-4 rounded-full transition-colors ${cat.actif ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${cat.actif ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="mt-2">
              <span className="text-[10px] font-mono text-muted-foreground/50">/{cat.slug}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
