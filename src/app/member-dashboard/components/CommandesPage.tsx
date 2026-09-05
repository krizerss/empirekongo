'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, EyeIcon, CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/useAuth';

type OrderStatus = 'en_attente' | 'confirmee' | 'en_livraison' | 'livree' | 'annulee';

type DbOrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface Order {
  dbId: string;
  id: string;
  date: string;
  customer: { name: string; avatar: string; phone: string; email: string; location: string; company: string; verified: boolean };
  product: { name: string; category: string; quantity: string; unitPrice: number; total: number; image: string };
  status: OrderStatus;
  note: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  en_attente: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: ClockIcon },
  confirmee: { label: 'Confirmée', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircleIcon },
  en_livraison: { label: 'En livraison', color: 'text-primary', bg: 'bg-primary/10', icon: TruckIcon },
  livree: { label: 'Livrée', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircleSolid },
  annulee: { label: 'Annulée', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircleIcon },
};

function formatCDF(amount: number) {
  return new Intl.NumberFormat('fr-CD').format(amount) + ' CDF';
}

function mapStatus(status: string): OrderStatus {
  if (status === 'confirmed' || status === 'processing') return 'confirmee';
  if (status === 'shipped') return 'en_livraison';
  if (status === 'delivered') return 'livree';
  if (status === 'cancelled' || status === 'refunded') return 'annulee';
  return 'en_attente';
}

function mapDbStatus(status: OrderStatus): DbOrderStatus {
  if (status === 'confirmee') return 'confirmed';
  if (status === 'en_livraison') return 'shipped';
  if (status === 'livree') return 'delivered';
  if (status === 'annulee') return 'cancelled';
  return 'pending';
}

function nextStatuses(status: OrderStatus): OrderStatus[] {
  if (status === 'en_attente') return ['confirmee', 'annulee'];
  if (status === 'confirmee') return ['en_livraison', 'annulee'];
  if (status === 'en_livraison') return ['livree'];
  return [];
}

export default function CommandesPage() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let active = true;
    const loadOrders = async () => {
      if (!user?.id) {
        setOrders([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);

      const { data: orderRows, error: orderError } = await supabase
        .from('orders')
        .select('id,buyer_id,status,total_amount,shipping_city,shipping_phone,shipping_address,notes,created_at')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (orderError) {
        if (active) { setError('Impossible de charger les commandes.'); setOrders([]); setLoading(false); }
        return;
      }

      const rows = orderRows || [];
      const orderIds = rows.map((o: any) => o.id);
      const buyerIds = Array.from(new Set(rows.map((o: any) => o.buyer_id).filter(Boolean)));

      const [itemsResult, profilesResult] = await Promise.all([
        orderIds.length ? supabase.from('order_items').select('order_id,product_id,product_name,product_price,quantity,unit,subtotal').in('order_id', orderIds) : Promise.resolve({ data: [], error: null } as any),
        buyerIds.length ? supabase.from('profiles').select('id,full_name,email,phone,avatar_url,account_type').in('id', buyerIds) : Promise.resolve({ data: [], error: null } as any),
      ]);

      const productIds = Array.from(new Set((itemsResult.data || []).map((i: any) => i.product_id).filter(Boolean)));
      const productsResult = productIds.length
        ? await supabase.from('products').select('id,name,category,image_url').in('id', productIds)
        : { data: [], error: null } as any;

      const itemsByOrder = new Map<string, any[]>();
      (itemsResult.data || []).forEach((item: any) => {
        const list = itemsByOrder.get(item.order_id) || [];
        list.push(item);
        itemsByOrder.set(item.order_id, list);
      });
      const profiles = new Map((profilesResult.data || []).map((p: any) => [p.id, p]));
      const products = new Map((productsResult.data || []).map((p: any) => [p.id, p]));

      const mapped: Order[] = rows.map((row: any) => {
        const item = (itemsByOrder.get(row.id) || [])[0];
        const buyer = profiles.get(row.buyer_id) || {};
        const product = products.get(item?.product_id) || {};
        const name = buyer.full_name || buyer.email?.split('@')[0] || 'Client';
        const quantity = Number(item?.quantity) || 1;
        const unitPrice = Number(item?.product_price) || 0;
        const total = Number(item?.subtotal ?? row.total_amount) || 0;
        return {
          dbId: row.id,
          id: `CMD-${String(row.id).slice(0, 8).toUpperCase()}`,
          date: new Date(row.created_at).toLocaleString('fr-CD', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          customer: {
            name,
            avatar: name.split(/\s+/).map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
            phone: row.shipping_phone || buyer.phone || 'Non renseigné',
            email: buyer.email || 'Non renseigné',
            location: row.shipping_city || row.shipping_address || 'Non précisée',
            company: buyer.account_type === 'enterprise' ? 'Entreprise' : 'Client EmpireKongo',
            verified: true,
          },
          product: {
            name: item?.product_name || product.name || 'Produit',
            category: product.category || 'Autres',
            quantity: `${quantity}${item?.unit ? ` ${item.unit}` : ''}`,
            unitPrice,
            total,
            image: product.image_url || '',
          },
          status: mapStatus(row.status),
          note: row.notes || '',
        };
      });

      if (active) { setOrders(mapped); setLoading(false); }
    };

    if (isLoggedIn) void loadOrders();
    else { setOrders([]); setLoading(false); }

    const channel = supabase.channel(`seller-orders-${user?.id || 'guest'}`).on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => void loadOrders()).subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, [supabase, user?.id, isLoggedIn]);

  const updateOrderStatus = async (order: Order, status: OrderStatus) => {
    if (!user?.id || updatingOrderId) return;
    setUpdatingOrderId(order.dbId);
    setActionError(null);

    const dbStatus = mapDbStatus(status);
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: dbStatus })
      .eq('id', order.dbId)
      .eq('seller_id', user.id);

    if (updateError) {
      setActionError('Impossible de mettre à jour la commande.');
      setUpdatingOrderId(null);
      return;
    }

    const notificationTitle = status === 'confirmee'
      ? 'Commande confirmée'
      : status === 'en_livraison'
        ? 'Commande expédiée'
        : status === 'livree'
          ? 'Commande livrée'
          : 'Commande annulée';
    const notificationMessage = status === 'confirmee'
      ? `Votre commande ${order.id} a été confirmée.`
      : status === 'en_livraison'
        ? `Votre commande ${order.id} est maintenant en livraison.`
        : status === 'livree'
          ? `Votre commande ${order.id} a été livrée.`
          : `Votre commande ${order.id} a été annulée.`;

    if (status !== 'en_attente') {
      const { error: notificationError } = await supabase.from('notifications').insert({
        user_id: (await supabase.from('orders').select('buyer_id').eq('id', order.dbId).maybeSingle()).data?.buyer_id,
        type: 'order',
        title: notificationTitle,
        message: notificationMessage,
        data: { order_id: order.dbId, status: dbStatus },
      });
      if (notificationError) console.warn('Order notification could not be created:', notificationError.message);
    }

    const updatedOrder = { ...order, status };
    setOrders((current) => current.map((item) => item.dbId === order.dbId ? updatedOrder : item));
    setSelectedOrder((current) => current?.dbId === order.dbId ? updatedOrder : current);
    setUpdatingOrderId(null);
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = o.customer.name.toLowerCase().includes(q) || o.product.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchSearch && (statusFilter === 'all' || o.status === statusFilter);
  });

  const stats = {
    total: orders.length,
    en_attente: orders.filter((o) => o.status === 'en_attente').length,
    confirmee: orders.filter((o) => o.status === 'confirmee').length,
    livree: orders.filter((o) => o.status === 'livree').length,
  };

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Mes commandes</h1>
        <p className="text-sm text-muted-foreground">Toutes les commandes reçues de vos clients.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <div className="stat-card"><p className="text-xs text-muted-foreground mb-2">Total commandes</p><p className="text-2xl font-extrabold text-foreground">{stats.total}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground mb-2">En attente</p><p className="text-2xl font-extrabold text-yellow-400">{stats.en_attente}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground mb-2">Confirmées</p><p className="text-2xl font-extrabold text-blue-400">{stats.confirmee}</p></div>
        <div className="stat-card"><p className="text-xs text-muted-foreground mb-2">Livrées</p><p className="text-2xl font-extrabold text-green-400">{stats.livree}</p></div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Rechercher par client, produit ou N° commande..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" /></div>
        <div className="flex items-center gap-2"><FunnelIcon className="w-4 h-4 text-muted-foreground shrink-0" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')} className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"><option value="all">Tous les statuts</option><option value="en_attente">En attente</option><option value="confirmee">Confirmée</option><option value="en_livraison">En livraison</option><option value="livree">Livrée</option><option value="annulee">Annulée</option></select></div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-4 text-sm text-red-400">{error}</div>}
      {loading ? <div className="bg-card border border-border rounded-xl p-10 text-center"><p className="text-2xl mb-2">⏳</p><p className="text-sm font-semibold text-foreground">Chargement des commandes...</p></div> : <div className="space-y-3">
        {filtered.length === 0 && <div className="bg-card border border-border rounded-xl p-10 text-center"><p className="text-muted-foreground text-sm">Aucune commande trouvée.</p></div>}
        {filtered.map((order) => { const sc = statusConfig[order.status]; const StatusIcon = sc.icon; return (
          <div key={order.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="shrink-0 lg:w-36"><p className="text-xs font-bold text-primary">{order.id}</p><p className="text-[11px] text-muted-foreground mt-0.5">{order.date}</p></div>
              <div className="flex items-center gap-3 flex-1 min-w-0"><div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><span className="text-xs font-bold text-primary">{order.customer.avatar}</span></div><div className="min-w-0"><div className="flex items-center gap-1.5"><p className="text-sm font-semibold text-foreground truncate">{order.customer.name}</p>{order.customer.verified && <CheckCircleSolid className="w-3.5 h-3.5 text-primary shrink-0" />}</div><p className="text-xs text-muted-foreground truncate">{order.customer.company}</p><div className="flex items-center gap-3 mt-1"><span className="flex items-center gap-1 text-[11px] text-muted-foreground"><PhoneIcon className="w-3 h-3" />{order.customer.phone}</span><span className="flex items-center gap-1 text-[11px] text-muted-foreground hidden sm:flex"><MapPinIcon className="w-3 h-3" />{order.customer.location}</span></div></div></div>
              <div className="flex-1 min-w-0 lg:border-l lg:border-border lg:pl-4"><p className="text-sm font-semibold text-foreground truncate">{order.product.name}</p><p className="text-xs text-muted-foreground">{order.product.category} · {order.product.quantity}</p><p className="text-sm font-bold text-primary mt-1">{formatCDF(order.product.total)}</p></div>
              <div className="flex items-center gap-3 shrink-0"><div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${sc.bg}`}><StatusIcon className={`w-3.5 h-3.5 ${sc.color}`} /><span className={`text-xs font-semibold ${sc.color}`}>{sc.label}</span></div><button onClick={() => { setActionError(null); setSelectedOrder(order); }} className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors" title="Voir les détails"><EyeIcon className="w-4 h-4" /></button></div>
            </div>
            {order.note && <div className="mt-3 pt-3 border-t border-border/50"><p className="text-xs text-muted-foreground italic">📝 {order.note}</p></div>}
          </div>
        ); })}
      </div>}

      {selectedOrder && <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}><div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center justify-between"><div><p className="font-bold text-foreground text-sm">{selectedOrder.id}</p><p className="text-xs text-muted-foreground">{selectedOrder.date}</p></div><div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${statusConfig[selectedOrder.status].bg}`}><span className={`text-xs font-semibold ${statusConfig[selectedOrder.status].color}`}>{statusConfig[selectedOrder.status].label}</span></div></div>
        <div className="p-5 space-y-5">
          <div><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Informations du client</p><div className="bg-secondary rounded-xl p-4"><div className="flex items-center gap-3 mb-3"><div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><span className="text-sm font-bold text-primary">{selectedOrder.customer.avatar}</span></div><div><div className="flex items-center gap-1.5"><p className="font-bold text-foreground text-sm">{selectedOrder.customer.name}</p>{selectedOrder.customer.verified && <CheckCircleSolid className="w-4 h-4 text-primary" />}</div><p className="text-xs text-muted-foreground">{selectedOrder.customer.company}</p></div></div><div className="space-y-2"><div className="flex items-center gap-2.5"><PhoneIcon className="w-4 h-4 text-muted-foreground shrink-0" /><span className="text-sm text-foreground">{selectedOrder.customer.phone}</span></div><div className="flex items-center gap-2.5"><EnvelopeIcon className="w-4 h-4 text-muted-foreground shrink-0" /><span className="text-sm text-foreground">{selectedOrder.customer.email}</span></div><div className="flex items-center gap-2.5"><MapPinIcon className="w-4 h-4 text-muted-foreground shrink-0" /><span className="text-sm text-foreground">{selectedOrder.customer.location}</span></div></div></div></div>
          <div><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Produit commandé</p><div className="bg-secondary rounded-xl p-4"><p className="font-bold text-foreground text-sm mb-1">{selectedOrder.product.name}</p><p className="text-xs text-muted-foreground mb-3">{selectedOrder.product.category}</p><div className="grid grid-cols-3 gap-3"><div><p className="text-[10px] text-muted-foreground mb-0.5">Quantité</p><p className="text-sm font-semibold text-foreground">{selectedOrder.product.quantity}</p></div><div><p className="text-[10px] text-muted-foreground mb-0.5">Prix unitaire</p><p className="text-sm font-semibold text-foreground">{formatCDF(selectedOrder.product.unitPrice)}</p></div><div><p className="text-[10px] text-muted-foreground mb-0.5">Total</p><p className="text-sm font-bold text-primary">{formatCDF(selectedOrder.product.total)}</p></div></div></div></div>
          {selectedOrder.note && <div><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Note</p><p className="text-sm text-muted-foreground italic bg-secondary rounded-xl p-3">{selectedOrder.note}</p></div>}
          {actionError && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">{actionError}</div>}
          {nextStatuses(selectedOrder.status).length > 0 && <div><p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gestion de la commande</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{nextStatuses(selectedOrder.status).map((nextStatus) => { const nextConfig = statusConfig[nextStatus]; const NextIcon = nextConfig.icon; const isUpdating = updatingOrderId === selectedOrder.dbId; return <button key={nextStatus} disabled={isUpdating} onClick={() => void updateOrderStatus(selectedOrder, nextStatus)} className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-bold border border-border ${nextConfig.bg} ${nextConfig.color} hover:border-primary/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}><NextIcon className="w-4 h-4" />{isUpdating ? 'Mise à jour...' : `Passer à : ${nextConfig.label}`}</button>; })}</div></div>}
          <div className="flex gap-2 pt-1"><button onClick={() => setSelectedOrder(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">Fermer</button><a href={`mailto:${selectedOrder.customer.email}`} className="flex-1 py-2.5 rounded-xl bg-primary text-black text-sm font-bold hover:bg-primary/90 transition-colors text-center">Contacter le client</a></div>
        </div>
      </div></div>}
    </div>
  );
}
