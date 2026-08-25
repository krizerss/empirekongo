'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import MonEntreprisePage from './MonEntreprisePage';

type ProfileTab = 'informations' | 'entreprise' | 'produits' | 'activite';

type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
};

const tabs: { key: ProfileTab; label: string }[] = [
  { key: 'informations', label: 'Informations' },
  { key: 'entreprise', label: 'Entreprise' },
  { key: 'produits', label: 'Produits' },
  { key: 'activite', label: 'Activité' },
];

const emptyForm: ProfileForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  bio: '',
};

export default function ProfilePage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<ProfileTab>('informations');
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [createdAt, setCreatedAt] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;

      if (userError || !data.user) {
        setError('Impossible de récupérer votre session. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const user = data.user;
      const metadata = user.user_metadata ?? {};

      setForm({
        firstName: metadata.first_name ?? '',
        lastName: metadata.last_name ?? '',
        email: user.email ?? '',
        phone: metadata.phone ?? '',
        location: metadata.location ?? '',
        website: metadata.website ?? '',
        bio: metadata.bio ?? '',
      });
      setCreatedAt(user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : '');
      setAvatarUrl(metadata.avatar_url ?? '');
      setLoading(false);
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [supabase]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setMessage('');
    setError('');
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');
    setError('');

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        website: form.website.trim(),
        bio: form.bio.trim(),
      },
    });

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setMessage('Profil enregistré avec succès.');
    setSaving(false);
  };

  if (activeTab === 'entreprise') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Mon entreprise</h1>
          <button
            onClick={() => setActiveTab('informations')}
            className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
          >
            Retour au profil
          </button>
        </div>
        <MonEntreprisePage />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
        Chargement de votre profil...
      </div>
    );
  }

  const displayName = `${form.firstName} ${form.lastName}`.trim() || form.email.split('@')[0] || 'Utilisateur';

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <div className="px-5 pb-5 -mt-9 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-card bg-secondary flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-9 h-9 text-muted-foreground" />
                )}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-extrabold text-foreground">{displayName}</h1>
                  {form.email && <CheckCircleIcon className="w-4 h-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{form.email}</p>
                {form.location && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <MapPinIcon className="w-3 h-3" /> {form.location}
                  </div>
                )}
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-green-400/10 text-green-400 text-xs font-semibold">Compte connecté</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'produits' && (
            <div className="py-8 text-center">
              <BuildingOfficeIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="font-bold text-foreground">Gestion des produits</h2>
              <p className="text-sm text-muted-foreground mt-1">La connexion des produits à Supabase sera activée dans l'étape suivante.</p>
            </div>
          )}

          {activeTab === 'activite' && (
            <div className="py-8 text-center">
              <CheckCircleIcon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h2 className="font-bold text-foreground">Activité</h2>
              <p className="text-sm text-muted-foreground mt-1">Les données d'activité réelles seront branchées après le profil.</p>
            </div>
          )}

          {activeTab === 'informations' && (
            <div className="max-w-3xl space-y-5">
              <div>
                <h2 className="text-sm font-bold text-foreground">Informations personnelles</h2>
                <p className="text-xs text-muted-foreground mt-1">Ces informations sont enregistrées dans votre compte Supabase.</p>
              </div>

              {message && <div className="rounded-lg bg-green-400/10 border border-green-400/20 px-4 py-3 text-sm text-green-400">{message}</div>}
              {error && <div className="rounded-lg bg-red-400/10 border border-red-400/20 px-4 py-3 text-sm text-red-400">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Prénom" icon={<UserIcon className="w-3.5 h-3.5" />} value={form.firstName} onChange={(v) => updateField('firstName', v)} />
                <Field label="Nom" icon={<UserIcon className="w-3.5 h-3.5" />} value={form.lastName} onChange={(v) => updateField('lastName', v)} />
                <Field label="Email" icon={<EnvelopeIcon className="w-3.5 h-3.5" />} value={form.email} onChange={(v) => updateField('email', v)} type="email" disabled />
                <Field label="Téléphone" icon={<PhoneIcon className="w-3.5 h-3.5" />} value={form.phone} onChange={(v) => updateField('phone', v)} />
                <Field label="Localisation" icon={<MapPinIcon className="w-3.5 h-3.5" />} value={form.location} onChange={(v) => updateField('location', v)} />
                <Field label="Site web" icon={<GlobeAltIcon className="w-3.5 h-3.5" />} value={form.website} onChange={(v) => updateField('website', v)} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Biographie</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateField('bio', e.target.value)}
                  rows={4}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Présentez-vous en quelques mots..."
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDaysIcon className="w-4 h-4" />
                Membre depuis {createdAt || '—'}
              </div>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="gold-gradient px-6 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, value, onChange, type = 'text', disabled = false }: { label: string; icon: React.ReactNode; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">{icon} {label}</label>
      <input type={type} value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed" />
    </div>
  );
}
