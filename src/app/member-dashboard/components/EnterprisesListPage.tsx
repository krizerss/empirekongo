'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';

interface Enterprise {
  id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  cover_url: string | null;
  category: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  employee_count: number | null;
  founded_year: number | null;
  is_verified: boolean | null;
}

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80';
const FALLBACK_LOGO = '/assets/images/app_logo.png';

function usableImage(url: string | null, fallback: string) {
  if (!url || url.startsWith('blob:')) return fallback;
  return url;
}

export default function EnterprisesListPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadEnterprises() {
      setLoading(true); setError(null);
      try {
        const supabase = createClient();
        const { data, error: queryError } = await supabase.from('enterprises').select('id,name,slug,logo_url,cover_url,category,city,address,description,phone,email,website,employee_count,founded_year,is_verified').eq('is_active', true).order('created_at', { ascending: false });
        if (queryError) throw queryError;
        if (mounted) setEnterprises((data ?? []) as Enterprise[]);
      } catch (err) {
        console.error('Erreur lors du chargement des entreprises:', err);
        if (mounted) { setError("Impossible de charger les entreprises depuis la base de données."); setEnterprises([]); }
      } finally { if (mounted) setLoading(false); }
    }
    loadEnterprises();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => ['Toutes', ...Array.from(new Set(enterprises.map((e) => e.category).filter(Boolean) as string[]))], [enterprises]);
  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return enterprises.filter((enterprise) => {
      const searchable = [enterprise.name, enterprise.city, enterprise.category, enterprise.description].filter(Boolean).join(' ').toLowerCase();
      return (!normalizedSearch || searchable.includes(normalizedSearch)) && (selectedCategory === 'Toutes' || enterprise.category === selectedCategory);
    });
  }, [enterprises, search, selectedCategory]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between"><div><h1 className="text-xl font-extrabold text-foreground">Entreprises</h1><p className="text-xs text-muted-foreground mt-0.5">{loading ? 'Chargement des entreprises...' : `${filtered.length} entreprise${filtered.length !== 1 ? 's' : ''} trouvée${filtered.length !== 1 ? 's' : ''}`}</p></div></div>
      <div className="flex flex-col sm:flex-row gap-3"><div className="relative flex-1"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Rechercher une entreprise..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Effacer la recherche"><XMarkIcon className="w-4 h-4" /></button>}</div><div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">{categories.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${selectedCategory === cat ? 'gold-gradient text-primary-foreground border-transparent shadow-md' : 'bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'}`}>{cat}</button>)}</div></div>
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-72 rounded-xl border border-border bg-card animate-pulse" />)}</div> : filtered.length === 0 ? <div className="flex flex-col items-center justify-center h-48 text-muted-foreground"><BuildingOfficeIcon className="w-12 h-12 mb-3 text-primary/30" /><p className="text-base font-semibold mb-1">Aucune entreprise trouvée</p><p className="text-sm text-muted-foreground/60">{enterprises.length === 0 ? "Aucune entreprise active n'est encore enregistrée." : "Essayez d'autres mots-clés ou filtres."}</p></div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((enterprise) => <div key={enterprise.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 group"><div className="relative h-28 overflow-hidden"><AppImage src={usableImage(enterprise.cover_url, FALLBACK_COVER)} alt={`Couverture de ${enterprise.name}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />{enterprise.is_verified && <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20"><CheckBadgeIcon className="w-3 h-3 text-primary" /><span className="text-[10px] font-bold text-white">Vérifié</span></div>}</div><div className="px-4 pb-4 -mt-7 relative"><div className="flex items-end gap-3 mb-3"><div className="w-14 h-14 rounded-xl overflow-hidden border-3 border-card bg-card shadow-lg shrink-0"><AppImage src={usableImage(enterprise.logo_url, FALLBACK_LOGO)} alt={`Logo de ${enterprise.name}`} width={56} height={56} className="object-cover w-full h-full" /></div><div className="flex-1 min-w-0 pb-1"><h3 className="text-sm font-extrabold text-foreground leading-tight truncate">{enterprise.name}</h3><div className="flex items-center gap-1 mt-0.5"><TagIcon className="w-3 h-3 text-primary shrink-0" /><span className="text-[10px] text-muted-foreground truncate">{enterprise.category || 'Non catégorisée'}</span></div></div></div><div className="flex items-center gap-1 text-muted-foreground mb-2"><MapPinIcon className="w-3 h-3 shrink-0" /><span className="text-[11px] truncate">{enterprise.city || enterprise.address || 'Localisation non renseignée'}</span></div><p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-3 min-h-[32px]">{enterprise.description || 'Aucune description disponible.'}</p><div className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground"><div className="flex items-center gap-1"><UserGroupIcon className="w-3 h-3" /><span>{enterprise.employee_count ?? 0} employé{(enterprise.employee_count ?? 0) !== 1 ? 's' : ''}</span></div>{enterprise.founded_year && <div className="flex items-center gap-1"><BuildingOfficeIcon className="w-3 h-3" /><span>Depuis {enterprise.founded_year}</span></div>}</div><div className="flex items-center gap-2 mb-3 text-muted-foreground">{enterprise.phone && <PhoneIcon className="w-3 h-3" title={enterprise.phone} />}{enterprise.email && <EnvelopeIcon className="w-3 h-3" title={enterprise.email} />}{enterprise.website && <GlobeAltIcon className="w-3 h-3" title={enterprise.website} />}</div><button type="button" disabled={!enterprise.slug} onClick={() => { if (enterprise.slug) window.location.href = `/entreprises/${enterprise.slug}`; }} className="w-full py-2 rounded-xl gold-gradient text-primary-foreground text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm">Voir l'entreprise</button></div></div>)}</div>}
    </div>
  );
}
