'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/useAuth';

export default function StoreOrderBridge() {
  const { isLoggedIn } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      if (!isLoggedIn || window.location.pathname !== '/store') return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest('button');
      if (!button || (button.textContent || '').replace(/\s+/g, ' ').trim() !== 'Commander') return;

      const link = button.closest('a[href^="/store/product/"]') as HTMLAnchorElement | null;
      const productId = link?.getAttribute('href')?.split('/').pop();
      if (!productId) return;

      event.preventDefault();
      event.stopPropagation();

      const supabase = createClient();
      setMessage('Création de la commande...');

      const { error } = await supabase.rpc('create_store_order', {
        p_product_id: productId,
        p_quantity: 1,
      });

      if (error) {
        const knownMessages: Record<string, string> = {
          AUTH_REQUIRED: 'Connexion requise pour commander.',
          PRODUCT_NOT_AVAILABLE: 'Ce produit n’est plus disponible.',
          INSUFFICIENT_STOCK: 'Stock insuffisant pour ce produit.',
          INVALID_PRODUCT_PRICE: 'Le prix de ce produit est invalide.',
          INVALID_QUANTITY: 'Quantité invalide.',
        };
        const code = error.message?.split(':')[0]?.trim();
        setMessage(knownMessages[code] || 'Impossible de créer la commande.');
        window.setTimeout(() => setMessage(null), 3500);
        return;
      }

      setMessage('Commande créée avec succès.');
      window.setTimeout(() => setMessage(null), 3500);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [isLoggedIn]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-xl border border-border bg-card px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-foreground">{message}</p>
    </div>
  );
}
