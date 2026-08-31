'use client';

import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  EyeIcon,
  MapPinIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/useAuth';

interface EnterpriseRow {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  logo_url: string | null;
  cover_url: string | null;
  is_verified: boolean | null;
  is_active: boolean | null;
  employee_count: number | null;
  founded_year: number | null;
  created_at: string;
  updated_at: string;
}

type EnterpriseForm = {
  name: string;
  category: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  province: string;
  country: string;
  logo_url: string;
  cover_url: string;
  employee_count: string;
  founded_year: string;
};

const categories = [
  'Agriculture', 'Agroalimentaire', 'Commerce', 'Construction', 'Éducation',
  'Énergie', 'Finance', 'Immobilier', 'Industrie', 'Informatique',
  'Logistique', 'Santé', 'Services', 'Technologie', 'Tourisme', 'Transport',
];

const emptyForm: EnterpriseForm = {
  name: '', category: '', description: '', phone: '', email: '', website: '',
  address: '', city: '', province: '', country: 'RDC', logo_url: '', cover_url: '',
  employee_count: '', founded_year: '',
};

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function MonEntreprisePage() {
  const { user, loading: authLoading } = useAuth();
  const [enterprises, setEnterprises] = useState<EnterpriseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<EnterpriseForm>(emptyForm);

  const supabase = useMemo(() => createClient(), []);

  const loadEnterprises = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('enterprises')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (queryError) {
      setError(`Impossible de charger vos entreprises : ${queryError.message}`);
      setEnterprises([]);
    } else {
      setEnterprises((data ?? []) as EnterpriseRow[]);
    }
    setLoading(false);
  }, [supabase, user?.id]);

  useEffect(() => {
    if (!authLoading) loadEnterprises();
  }, [authLoading, loadEnterprises]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setSuccess('');
    setFormOpen(true);
  };

  const openEdit = (enterprise: EnterpriseRow) => {
    setEditingId(enterprise.id);
    setForm({
      name: enterprise.name ?? '',
      category: enterprise.category ?? '',
      description: enterprise.description ?? '',
      phone: enterprise.phone ?? '',
      email: enterprise.email ?? '',
      website: enterprise.website ?? '',
      address: enterprise.address ?? '',
      city: enterprise.city ?? '',
      province: enterprise.province ?? '',
      country: enterprise.country ?? 'RDC',
      logo_url: enterprise.logo_url ?? '',
      cover_url: enterprise.cover_url ?? '',
      employee_count: enterprise.employee_count?.toString() ?? '',
      founded_year: enterprise.founded_year?.toString() ?? '',
    });
    setError('');
    setSuccess('');
    setFormOpen(true);
  };

  const saveEnterprise = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.id || !form.name.trim()) {
      setError('Le nom de l’entreprise est obligatoire.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const baseSlug = slugify(form.name) || `entreprise-${Date.now()}`;
    const payload = {
      name: form.name.trim(),
      slug: editingId ? undefined : `${baseSlug}-${Date.now().toString().slice(-6)}`,
      category: form.category || null,
      description: form.description || null,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      address: form.address || null,
      city: form.city || null,
      province: form.province || null,
      country: form.country || 'RDC',
      logo_url: form.logo_url || null,
      cover_url: form.cover_url || null,
      employee_count: form.employee_count ? Number(form.employee_count) : null,
      founded_year: form.founded_year ? Number(form.founded_year) : null,
      is_active: true,
    };

    const result = editingId
      ? await supabase.from('enterprises').update(payload).eq('id', editingId).eq('owner_id', user.id)
      : await supabase.from('enterprises').insert({ ...payload, owner_id: user.id });

    if (result.error) {
      setError(`Enregistrement impossible : ${result.error.message}`);
    } else {
      setFormOpen(false);
      setSuccess(editingId ? 'Entreprise mise à jour avec succès.' : 'Entreprise créée avec succès.');
      await loadEnterprises();
    }
    setSaving(false);
  };

  const removeEnterprise = async () => {
    if (!deleteId || !user?.id) return;
    setSaving(true);
    setError('');

    const { error: deleteError } = await supabase
      .from('enterprises')
      .delete()
      .eq('id', deleteId)
      .eq('owner_id', user.id);

    if (deleteError) {
      setError(`Suppression impossible : ${deleteError.message}`);
    } else {
      setSuccess('Entreprise supprimée avec succès.');
      if (selectedId === deleteId) setSelectedId(null);
      await loadEnterprises();
    }
    setDeleteId(null);
    setSaving(false);
  };

  if (authLoading || loading) {
    return <div className="flex items-center justify-center min-h-64 text-sm text-muted-foreground">Chargement de vos entreprises…</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <BuildingOfficeIcon className="w-12 h-12 text-primary/40 mb-3" />
        <h2 className="text-lg font-bold text-foreground">Connexion requise</h2>
        <p className="text-sm text-muted-foreground mt-1">Connectez-vous pour gérer votre entreprise.</p>
      </div>
    );
  }

  const selected = enterprises.find((item) => item.id === selectedId) ?? null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Mon entreprise</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Données enregistrées directement dans Supabase</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg gold-gradient text-primary-foreground text-sm font-semibold">
          <PlusIcon className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
      {success && <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm"><CheckCircleIcon className="w-4 h-4" />{success}</div>}

      {enterprises.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-10 text-center">
          <BuildingOfficeIcon className="w-12 h-12 mx-auto text-primary/40 mb-3" />
          <h2 className="font-bold text-foreground">Aucune entreprise enregistrée</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Créez votre entreprise. Elle sera liée à votre compte connecté.</p>
          <button onClick={openCreate} className="px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-bold"><PlusIcon className="inline w-4 h-4 mr-1" /> Créer mon entreprise</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {enterprises.map((enterprise) => (
            <div key={enterprise.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="h-28 bg-secondary relative overflow-hidden">
                {enterprise.cover_url ? <img src={enterprise.cover_url} alt="Couverture" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-r from-primary/20 to-transparent" />}
                {enterprise.is_verified && <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full bg-black/50 text-primary">✓ Vérifiée</span>}
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 -mt-9 rounded-xl border-2 border-card bg-secondary overflow-hidden shrink-0">
                    {enterprise.logo_url ? <img src={enterprise.logo_url} alt={enterprise.name} className="w-full h-full object-cover" /> : <BuildingOfficeIcon className="w-7 h-7 m-3.5 text-primary/60" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-extrabold text-foreground truncate">{enterprise.name}</h2>
                    <p className="text-xs text-primary">{enterprise.category || 'Catégorie non définie'}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {(enterprise.city || enterprise.province) && <p className="flex gap-1"><MapPinIcon className="w-3.5 h-3.5" />{[enterprise.city, enterprise.province, enterprise.country].filter(Boolean).join(', ')}</p>}
                  {enterprise.email && <p>{enterprise.email}</p>}
                  {enterprise.phone && <p>{enterprise.phone}</p>}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => setSelectedId(enterprise.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-xs font-semibold"><EyeIcon className="w-3.5 h-3.5" /> Voir</button>
                  <button onClick={() => openEdit(enterprise)} className="px-3 py-2 rounded-lg border border-border text-xs font-semibold"><PencilSquareIcon className="w-3.5 h-3.5 inline mr-1" /> Modifier</button>
                  <button onClick={() => setDeleteId(enterprise.id)} className="p-2 rounded-lg border border-red-500/30 text-red-400"><TrashIcon className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedId(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h2 className="font-extrabold text-lg">{selected.name}</h2><button onClick={() => setSelectedId(null)}><XMarkIcon className="w-5 h-5" /></button></div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.description || 'Aucune description.'}</p>
            <div className="grid grid-cols-2 gap-3 mt-5 text-xs">
              <div className="p-3 rounded-lg bg-secondary"><span className="text-muted-foreground">Catégorie</span><p className="font-semibold mt-1">{selected.category || '—'}</p></div>
              <div className="p-3 rounded-lg bg-secondary"><span className="text-muted-foreground">Employés</span><p className="font-semibold mt-1">{selected.employee_count ?? '—'}</p></div>
              <div className="p-3 rounded-lg bg-secondary"><span className="text-muted-foreground">Fondée en</span><p className="font-semibold mt-1">{selected.founded_year ?? '—'}</p></div>
              <div className="p-3 rounded-lg bg-secondary"><span className="text-muted-foreground">Site web</span><p className="font-semibold mt-1 truncate">{selected.website || '—'}</p></div>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={saveEnterprise} className="bg-card border border-border rounded-2xl w-full max-w-2xl p-6 my-8 space-y-4">
            <div className="flex items-center justify-between"><div><h2 className="font-extrabold text-lg">{editingId ? 'Modifier mon entreprise' : 'Créer mon entreprise'}</h2><p className="text-xs text-muted-foreground">Les modifications sont sauvegardées dans Supabase.</p></div><button type="button" onClick={() => setFormOpen(false)}><XMarkIcon className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Nom *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <div><label className="block text-xs font-semibold mb-1.5">Catégorie</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm"><option value="">Sélectionner</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
              <Field label="Ville" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="Province" value={form.province} onChange={(v) => setForm({ ...form, province: v })} />
              <Field label="Téléphone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
              <Field label="Site web" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
              <Field label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
              <Field label="Nombre d’employés" type="number" value={form.employee_count} onChange={(v) => setForm({ ...form, employee_count: v })} />
              <Field label="Année de fondation" type="number" value={form.founded_year} onChange={(v) => setForm({ ...form, founded_year: v })} />
              <Field label="URL du logo" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} />
              <Field label="URL de couverture" value={form.cover_url} onChange={(v) => setForm({ ...form, cover_url: v })} />
            </div>
            <div><label className="block text-xs font-semibold mb-1.5">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm resize-none" /></div>
            <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setFormOpen(false)} className="px-4 py-2.5 rounded-lg border border-border text-sm">Annuler</button><button disabled={saving} className="px-5 py-2.5 rounded-lg gold-gradient text-primary-foreground text-sm font-bold">{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div>
          </form>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"><div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm"><h2 className="font-bold">Supprimer l’entreprise ?</h2><p className="text-sm text-muted-foreground mt-2">Cette action supprimera aussi les produits liés par la contrainte de la base.</p><div className="flex gap-3 mt-5"><button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-lg border border-border">Annuler</button><button onClick={removeEnterprise} disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-semibold">Supprimer</button></div></div></div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <div><label className="block text-xs font-semibold mb-1.5">{label}</label><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm" /></div>;
}
