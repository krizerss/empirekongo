'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/useAuth';

export default function StoreOrderBridge() {
  const { isLoggedIn } = useAuth();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const createOrder = async (productId: string, quantity: number) => {
      const supabase = createClient();
      setMessage('Création de la commande...');
      const { error } = await supabase.rpc('create_store_order', {
        p_product_id: productId,
        p_quantity: quantity,
        p_shipping_address: null,
        p_shipping_city: null,
        p_shipping_phone: null,
        p_notes: null,
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
      } else {
        setMessage('Commande créée avec succès.');
      }
      window.setTimeout(() => setMessage(null), 3500);
    };

    const handleClick = (event: MouseEvent) => {
      if (!isLoggedIn) return;
      const path = window.location.pathname;
      if (path !== '/store' && !path.startsWith('/store/product/')) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest('button');
      if (!button || (button.textContent || '').replace(/\s+/g, ' ').trim() !== 'Commander') return;

      const link = button.closest('a[href^="/store/product/"]') as HTMLAnchorElement | null;
      const productId = link?.getAttribute('href')?.split('/').pop() || (path.startsWith('/store/product/') ? path.split('/').filter(Boolean).pop() : undefined);
      if (!productId) return;

      event.preventDefault();
      event.stopPropagation();
      void createOrder(productId, 1);
    };

    const handleOrderRequest = (event: Event) => {
      if (!isLoggedIn) return;
      const detail = (event as CustomEvent<{ productId?: string; quantity?: number }>).detail;
      if (!detail?.productId) return;
      void createOrder(detail.productId, Math.max(1, Number(detail.quantity) || 1));
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('store-order-request', handleOrderRequest as EventListener);
    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('store-order-request', handleOrderRequest as EventListener);
    };
  }, [isLoggedIn]);

  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[100] max-w-sm rounded-xl border border-border bg-card px-4 py-3 shadow-2xl">
      <p className="text-sm font-semibold text-foreground">{message}</p>
    </div>
  );
}
