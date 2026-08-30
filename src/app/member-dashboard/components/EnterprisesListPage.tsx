'use client';
import React, { useState, useMemo, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  TagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';

interface Enterprise {
  id: string;
  name: string;
  logo_url: string;
  cover_url: string;
  category: string;
  city: string;
  description: string;
  employee_count: number;
  is_verified: boolean;
  founded_year: number | null;
}

export default function EnterprisesListPage() {
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from('enterprises')
          .select('id, name, logo_url, cover_url, category, city, description, employee_count, is_verified, founded_year')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setEnterprises(data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des entreprises');
      } finally {
        setLoading(false);
      }
    };

    fetchEnterprises();
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(enterprises.map((e) => e.category).filter(Boolean)));
    return ['Toutes', ...cats];
  }, [enterprises]);

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const matchSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.city.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'Toutes' || e.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [enterprises, search, selectedCategory]);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">Entreprises</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Chargement...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="h-28 bg-secondary" />
              <div className="px-4 pb-4 -mt-7 relative">
                <div className="flex items-end gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl bg-secondary border-3 border-card" />
                  <div className="flex-1 space-y-1.5 pb-1">
                    <div className="h-3.5 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-secondary rounded w-2/3 mb-3" />
                <div className="h-8 bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <BuildingOfficeIcon className="w-12 h-12 mb-3 text-red-400/50" />
        <p className="text-base font-semibold mb-1 text-red-400">Erreur de chargement</p>
        <p className="text-sm text-muted-foreground/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Entreprises</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} entreprise{filtered.length !== 1 ? 's' : ''} trouvée{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'gold-gradient text-primary-foreground border-transparent shadow-md'
                  : 'bg-secondary border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <BuildingOfficeIcon className="w-12 h-12 mb-3 text-primary/30" />
          <p className="text-base font-semibold mb-1">Aucune entreprise trouvée</p>
          <p className="text-sm text-muted-foreground/60">Essayez d'autres mots-clés ou filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((enterprise) => (
            <div
              key={enterprise.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-200 group cursor-pointer"
            >
              {/* Cover */}
              <div className="relative h-28 overflow-hidden">
                <AppImage
                  src={enterprise.cover_url || 'https://images.unsplash.com/photo-1501184633355-06e92b102476'}
                  alt={`Couverture de ${enterprise.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {enterprise.is_verified && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/20">
                    <CheckBadgeIcon className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-white">Vérifié</span>
                  </div>
                )}
              </div>

              {/* Logo + info */}
              <div className="px-4 pb-4 -mt-7 relative">
                <div className="flex items-end gap-3 mb-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-3 border-card bg-card shadow-lg shrink-0">
                    <AppImage
                      src={enterprise.logo_url || 'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png'}
                      alt={`Logo ${enterprise.name}`}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-extrabold text-foreground leading-tight truncate">{enterprise.name}</h3>
                    </div>
                    {enterprise.category && (
                      <span className="badge-gold text-[10px] flex items-center gap-0.5 mt-0.5 w-fit">
                        <TagIcon className="w-2.5 h-2.5" />
                        {enterprise.category}
                      </span>
                    )}
                  </div>
                </div>

                {enterprise.city && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{enterprise.city}</span>
                  </div>
                )}

                {enterprise.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                    {enterprise.description}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {enterprise.employee_count > 0 && (
                    <span className="flex items-center gap-1">
                      <UserGroupIcon className="w-3.5 h-3.5" />
                      {enterprise.employee_count} employés
                    </span>
                  )}
                  {enterprise.founded_year && (
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-3.5 h-3.5" />
                      Depuis {enterprise.founded_year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
