'use client';

import React, { useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/lib/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function FavoriteButton({ productId, className = '' }: { productId: string; className?: string }) {
  const { isLoggedIn } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!isLoggedIn) return;
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return;
      supabase.from('favorites').select('id').eq('product_id', productId).eq('user_id', data.user.id).maybeSingle().then(({ data: row }) => {
        if (active) setFavorite(Boolean(row));
      });
    });
    return () => { active = false; };
  }, [isLoggedIn, productId, supabase]);

  const toggleFavorite = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isLoggedIn || loading) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    if (favorite) {
      const { error } = await supabase.from('favorites').delete().eq('product_id', productId).eq('user_id', user.id);
      if (!error) setFavorite(false);
    } else {
      const { error } = await supabase.from('favorites').insert({ product_id: productId, user_id: user.id });
      if (!error) setFavorite(true);
    }
    setLoading(false);
  };

  return (
    <button type="button" onClick={toggleFavorite} disabled={loading} aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} title={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'} className={`p-2.5 rounded-xl bg-secondary border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-50 ${className}`}>
      {favorite ? <HeartSolid className="w-5 h-5 text-primary" /> : <HeartIcon className="w-5 h-5" />}
    </button>
  );
}
