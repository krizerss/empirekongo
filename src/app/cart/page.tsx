'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  PhoneIcon,
  PencilSquareIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';

interface SupabaseProduct {
  id: string;
  name: string;
  price: string;
  unit: string;
  image_url: string;
  alt_text: string;
  vendor_id: string;
  vendor_name: string;
  stock_qty: number;
  stock_status: string;
  category: string;
  city: string;
  rating: number;
  review_count: number;
}

function parsePriceNum(price: string): number {
  return parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
}

function formatCDF(amount: number): string {
  return amount.toLocaleString('fr-CD') + ' FC';
}

type Step = 'cart' | 'checkout' | 'success';

export default function CartPage() {
  const { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalAmount } = useCart();
  const { isLoggedIn, user, profile } = useAuth();
  const supabase = createClient();

  const [step, setStep] = useState<Step>('cart');
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [orderId, setOrderId] = useState('');

  // Checkout form
  const [shippingAddress, setShippingAddress] = useState(profile?.address || '');
  const [shippingCity, setShippingCity] = useState(profile?.city || 'Kinshasa');
  const [shippingPhone, setShippingPhone] = useState(profile?.phone || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (profile) {
      setShippingPhone(profile.phone || '');
    }
  }, [profile]);

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      let query = supabase
        .from('products')
        .select('id, name, price, unit, image_url, alt_text, vendor_id, vendor_name, stock_qty, stock_status, category, city, rating, review_count')
        .eq('is_active', true)
        .neq('stock_status', 'Rupture de stock')
        .order('created_at', { ascending: false })
        .limit(20);

      if (productSearch.trim()) {
        query = query.ilike('name', `%${productSearch.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      setProducts(data || []);
    } catch {
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [productSearch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = (p: SupabaseProduct) => {
    addItem({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: parsePriceNum(p.price),
      priceLabel: p.price,
      unit: p.unit,
      image: p.image_url,
      alt: p.alt_text || p.name,
      vendorId: p.vendor_id,
      vendorName: p.vendor_name,
      stock: p.stock_qty,
    });
  };

  const isInCart = (productId: string) => items.some((i) => i.productId === productId);

  const handleSubmitOrder = async () => {
    if (!isLoggedIn || !user) return;
    if (items.length === 0) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      // Group items by vendor to create one order per vendor
      const vendorGroups: Record<string, typeof items> = {};
      items.forEach((item) => {
        const vid = item.vendorId || 'unknown';
        if (!vendorGroups[vid]) vendorGroups[vid] = [];
        vendorGroups[vid].push(item);
      });

      const firstVendorId = Object.keys(vendorGroups)[0];
      const firstGroup = vendorGroups[firstVendorId];
      const groupTotal = firstGroup.reduce((s, i) => s + i.price * i.quantity, 0);

      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: firstVendorId !== 'unknown' ? firstVendorId : user.id,
          status: 'pending',
          payment_status: 'pending',
          total_amount: totalAmount,
          currency: 'CDF',
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_phone: shippingPhone,
          notes: notes,
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      const newOrderId = orderData.id;

      // Insert order_items
      const orderItems = items.map((item) => ({
        order_id: newOrderId,
        product_id: item.productId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        unit: item.unit,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderId(newOrderId);
      clearCart();
      setStep('success');
    } catch (err: any) {
      setSubmitError(err?.message || 'Une erreur est survenue lors de la soumission.');
    } finally {
      setSubmitting(false);
    }
  };

  const cities = ['Kinshasa', 'Lubumbashi', 'Goma', 'Boma', 'Matadi', 'Mbuji-Mayi', 'Kisangani', 'Bukavu'];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Page Header */}
        <div className="bg-card border-b border-border px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <ShoppingCartIcon className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-extrabold text-foreground">Mon Panier</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalItems > 0 ? `${totalItems} article${totalItems > 1 ? 's' : ''} sélectionné${totalItems > 1 ? 's' : ''}` : 'Votre panier est vide'}
              </p>
            </div>
          </div>
        </div>

        {/* Steps indicator */}
        {step !== 'success' && (
          <div className="bg-card/50 border-b border-border px-4 py-3">
            <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs">
              <span className={`flex items-center gap-1.5 font-semibold ${step === 'cart' ? 'text-primary' : 'text-muted-foreground'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'cart' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>1</span>
                Panier
              </span>
              <div className="w-8 h-px bg-border" />
              <span className={`flex items-center gap-1.5 font-semibold ${step === 'checkout' ? 'text-primary' : 'text-muted-foreground'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 'checkout' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>2</span>
                Livraison
              </span>
              <div className="w-8 h-px bg-border" />
              <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-secondary text-muted-foreground">3</span>
                Confirmation
              </span>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 py-6">

          {/* SUCCESS STATE */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mb-5">
                <CheckCircleSolid className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">Commande soumise !</h2>
              <p className="text-muted-foreground text-sm mb-1">Votre commande a été enregistrée avec succès.</p>
              {orderId && (
                <p className="text-xs text-primary font-mono bg-primary/10 px-3 py-1.5 rounded-lg mt-2 mb-6">
                  Réf : {orderId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <p className="text-xs text-muted-foreground mb-8 max-w-sm">
                Le vendeur va confirmer votre commande sous peu. Vous pouvez suivre l'état dans votre tableau de bord.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/member-dashboard" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Voir mes commandes
                </Link>
                <Link href="/store" className="px-6 py-2.5 bg-secondary text-foreground rounded-xl font-semibold text-sm hover:bg-secondary/80 transition-colors">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          )}

          {/* CART STEP */}
          {step === 'cart' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Product selection + cart items */}
              <div className="lg:col-span-2 space-y-5">

                {/* Cart Items */}
                {items.length > 0 && (
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <h2 className="text-sm font-bold text-foreground">Articles dans le panier ({totalItems})</h2>
                      <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                        <TrashIcon className="w-3.5 h-3.5" />
                        Vider
                      </button>
                    </div>
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <div key={item.productId} className="flex items-center gap-3 p-4">
                          <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-secondary">
                            {item.image ? (
                              <AppImage src={item.image} alt={item.alt} fill className="object-cover" sizes="56px" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBagIcon className="w-6 h-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.vendorName}</p>
                            <p className="text-sm font-bold text-primary mt-0.5">{formatCDF(item.price * item.quantity)}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                            >
                              <MinusIcon className="w-3.5 h-3.5 text-foreground" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <PlusIcon className="w-3.5 h-3.5 text-foreground" />
                            </button>
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors ml-1"
                            >
                              <XMarkIcon className="w-3.5 h-3.5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Selection */}
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-border">
                    <h2 className="text-sm font-bold text-foreground mb-2">Ajouter des produits</h2>
                    <div className="relative">
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="w-full bg-secondary border border-border rounded-lg pl-3 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  </div>

                  {loadingProducts ? (
                    <div className="p-8 text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Chargement des produits...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="p-8 text-center">
                      <ShoppingBagIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Aucun produit trouvé</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border max-h-96 overflow-y-auto">
                      {products.map((p) => {
                        const inCart = isInCart(p.id);
                        const cartItem = items.find((i) => i.productId === p.id);
                        return (
                          <div key={p.id} className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-secondary">
                              {p.image_url ? (
                                <AppImage src={p.image_url} alt={p.alt_text || p.name} fill className="object-cover" sizes="48px" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBagIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.vendor_name} · {p.city}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm font-bold text-primary">{p.price}</span>
                                <span className="text-xs text-muted-foreground">{p.unit}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${p.stock_status === 'En stock' ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                                  {p.stock_status}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0">
                              {inCart ? (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => updateQuantity(p.id, (cartItem?.quantity || 1) - 1)}
                                    className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center hover:border-primary/50 transition-colors"
                                  >
                                    <MinusIcon className="w-3 h-3 text-foreground" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-foreground">{cartItem?.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(p.id, (cartItem?.quantity || 1) + 1)}
                                    disabled={(cartItem?.quantity || 0) >= p.stock_qty}
                                    className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center hover:bg-primary/30 transition-colors disabled:opacity-40"
                                  >
                                    <PlusIcon className="w-3 h-3 text-primary" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleAddProduct(p)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 border border-primary/30 text-primary rounded-lg text-xs font-semibold hover:bg-primary/25 transition-colors"
                                >
                                  <PlusIcon className="w-3.5 h-3.5" />
                                  Ajouter
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-4 sticky top-20">
                  <h2 className="text-sm font-bold text-foreground mb-4">Récapitulatif</h2>

                  {items.length === 0 ? (
                    <div className="text-center py-6">
                      <ShoppingCartIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Votre panier est vide</p>
                      <p className="text-xs text-muted-foreground mt-1">Ajoutez des produits depuis la liste</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 mb-4">
                        {items.map((item) => (
                          <div key={item.productId} className="flex justify-between text-xs">
                            <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                            <span className="text-foreground font-medium shrink-0">{formatCDF(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border pt-3 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-foreground">Total</span>
                          <span className="text-lg font-extrabold text-primary">{formatCDF(totalAmount)}</span>
                        </div>
                      </div>

                      {!isLoggedIn ? (
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-300">Connectez-vous pour passer commande</p>
                          </div>
                          <Link href="/login" className="block w-full text-center py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                            Se connecter
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => setStep('checkout')}
                          className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                        >
                          Passer la commande →
                        </button>
                      )}
                    </>
                  )}

                  <Link href="/store" className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeftIcon className="w-3.5 h-3.5" />
                    Continuer mes achats
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* CHECKOUT STEP */}
          {step === 'checkout' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-5">
                    <button onClick={() => setStep('cart')} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                      <ArrowLeftIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <h2 className="text-base font-bold text-foreground">Informations de livraison</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        <MapPinIcon className="w-3.5 h-3.5 inline mr-1" />
                        Adresse de livraison
                      </label>
                      <input
                        type="text"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Ex: Avenue Kasa-Vubu, N°12, Commune de Barumbu"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Ville</label>
                      <select
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors"
                      >
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        <PhoneIcon className="w-3.5 h-3.5 inline mr-1" />
                        Téléphone de contact
                      </label>
                      <input
                        type="tel"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="+243 8XX XXX XXX"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                        <PencilSquareIcon className="w-3.5 h-3.5 inline mr-1" />
                        Notes pour le vendeur (optionnel)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Instructions spéciales, heure de livraison préférée..."
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none"
                      />
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-300">{submitError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div>
                <div className="bg-card border border-border rounded-xl p-4 sticky top-20">
                  <h2 className="text-sm font-bold text-foreground mb-4">Votre commande</h2>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-2">
                        <div className="relative w-8 h-8 shrink-0 rounded overflow-hidden bg-secondary">
                          {item.image && <AppImage src={item.image} alt={item.alt} fill className="object-cover" sizes="32px" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">×{item.quantity}</p>
                        </div>
                        <span className="text-xs font-semibold text-foreground shrink-0">{formatCDF(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border pt-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">Total</span>
                      <span className="text-lg font-extrabold text-primary">{formatCDF(totalAmount)}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting || !shippingPhone}
                    className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Confirmer la commande
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-muted-foreground text-center mt-2">
                    Le téléphone est requis pour confirmer la livraison
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
