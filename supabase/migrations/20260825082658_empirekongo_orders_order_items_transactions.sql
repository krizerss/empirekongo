-- EmpireKongo: Orders, Order Items & Transactions migration
-- Timestamp: 20260825082658
-- Depends on: 20260825080152_empirekongo_auth_profiles_products.sql

-- ─── 1. TYPES ────────────────────────────────────────────────────────────────

DROP TYPE IF EXISTS public.order_status CASCADE;
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

DROP TYPE IF EXISTS public.payment_status CASCADE;
CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'partial'
);

DROP TYPE IF EXISTS public.transaction_type CASCADE;
CREATE TYPE public.transaction_type AS ENUM (
  'purchase',
  'refund',
  'commission',
  'payout',
  'subscription'
);

DROP TYPE IF EXISTS public.transaction_status CASCADE;
CREATE TYPE public.transaction_status AS ENUM (
  'pending',
  'completed',
  'failed',
  'cancelled'
);

-- ─── 2. TABLES ───────────────────────────────────────────────────────────────

-- Orders (buyer places an order)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.order_status DEFAULT 'pending'::public.order_status,
  payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CDF',
  shipping_address TEXT DEFAULT '',
  shipping_city TEXT DEFAULT '',
  shipping_phone TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Order Items (products within an order)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL DEFAULT '',
  product_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT DEFAULT '',
  subtotal NUMERIC(12, 2) GENERATED ALWAYS AS (product_price * quantity) STORED,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Transactions (financial records linked to orders)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  transaction_type public.transaction_type NOT NULL DEFAULT 'purchase'::public.transaction_type,
  status public.transaction_status DEFAULT 'pending'::public.transaction_status,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CDF',
  payment_method TEXT DEFAULT '',
  payment_reference TEXT DEFAULT '',
  description TEXT DEFAULT '',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. INDEXES ──────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON public.transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON public.transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);

-- ─── 4. FUNCTIONS ────────────────────────────────────────────────────────────

-- Auto-update updated_at (reuse existing handle_updated_at if present)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Helper: check if current user is admin (reads auth metadata, no recursion risk)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
      AND (
        raw_user_meta_data->>'role' = 'admin'
        OR raw_app_meta_data->>'role' = 'admin'
      )
  );
$$;

-- ─── 5. ENABLE RLS ───────────────────────────────────────────────────────────

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ─────────────────────────────────────────────────────────

-- ── ORDERS ──────────────────────────────────────────────────────────────────

-- Buyers can view their own orders
DROP POLICY IF EXISTS "buyers_view_own_orders" ON public.orders;
CREATE POLICY "buyers_view_own_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (buyer_id = auth.uid());

-- Sellers can view orders placed with them
DROP POLICY IF EXISTS "sellers_view_own_orders" ON public.orders;
CREATE POLICY "sellers_view_own_orders"
ON public.orders
FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

-- Buyers can create orders (they are the buyer)
DROP POLICY IF EXISTS "buyers_create_orders" ON public.orders;
CREATE POLICY "buyers_create_orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- Buyers can update their own pending orders (e.g. cancel, update address)
DROP POLICY IF EXISTS "buyers_update_own_orders" ON public.orders;
CREATE POLICY "buyers_update_own_orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (buyer_id = auth.uid())
WITH CHECK (buyer_id = auth.uid());

-- Sellers can update orders assigned to them (e.g. confirm, ship, deliver)
DROP POLICY IF EXISTS "sellers_update_own_orders" ON public.orders;
CREATE POLICY "sellers_update_own_orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (seller_id = auth.uid())
WITH CHECK (seller_id = auth.uid());

-- Admins have full access to orders
DROP POLICY IF EXISTS "admin_full_access_orders" ON public.orders;
CREATE POLICY "admin_full_access_orders"
ON public.orders
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ── ORDER ITEMS ──────────────────────────────────────────────────────────────

-- Buyers can view items of their own orders
DROP POLICY IF EXISTS "buyers_view_own_order_items" ON public.order_items;
CREATE POLICY "buyers_view_own_order_items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.buyer_id = auth.uid()
  )
);

-- Sellers can view items of orders placed with them
DROP POLICY IF EXISTS "sellers_view_own_order_items" ON public.order_items;
CREATE POLICY "sellers_view_own_order_items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.seller_id = auth.uid()
  )
);

-- Buyers can insert items when creating an order they own
DROP POLICY IF EXISTS "buyers_insert_order_items" ON public.order_items;
CREATE POLICY "buyers_insert_order_items"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.buyer_id = auth.uid()
  )
);

-- Admins have full access to order items
DROP POLICY IF EXISTS "admin_full_access_order_items" ON public.order_items;
CREATE POLICY "admin_full_access_order_items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ── TRANSACTIONS ─────────────────────────────────────────────────────────────

-- Buyers can view their own transactions
DROP POLICY IF EXISTS "buyers_view_own_transactions" ON public.transactions;
CREATE POLICY "buyers_view_own_transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (buyer_id = auth.uid());

-- Sellers can view transactions where they are the seller
DROP POLICY IF EXISTS "sellers_view_own_transactions" ON public.transactions;
CREATE POLICY "sellers_view_own_transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (seller_id = auth.uid());

-- Buyers can create transactions (payment initiation)
DROP POLICY IF EXISTS "buyers_create_transactions" ON public.transactions;
CREATE POLICY "buyers_create_transactions"
ON public.transactions
FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- Admins have full access to transactions
DROP POLICY IF EXISTS "admin_full_access_transactions" ON public.transactions;
CREATE POLICY "admin_full_access_transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- ─── 7. TRIGGERS ─────────────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_transactions_updated ON public.transactions;
CREATE TRIGGER on_transactions_updated
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 8. MOCK DATA ────────────────────────────────────────────────────────────

DO $$
DECLARE
  buyer_id  UUID;
  seller_id UUID;
  product_id UUID;
  order1_id UUID := gen_random_uuid();
  order2_id UUID := gen_random_uuid();
BEGIN
  -- Resolve existing buyer (client role) and seller (entreprise/vendeur role)
  SELECT id INTO buyer_id
  FROM public.profiles
  WHERE role = 'client'
  LIMIT 1;

  SELECT id INTO seller_id
  FROM public.profiles
  WHERE role IN ('vendeur', 'entreprise')
  LIMIT 1;

  SELECT id INTO product_id
  FROM public.products
  LIMIT 1;

  IF buyer_id IS NULL OR seller_id IS NULL THEN
    RAISE NOTICE 'Skipping mock orders: buyer or seller profile not found.';
    RETURN;
  END IF;

  -- Order 1: delivered
  INSERT INTO public.orders (
    id, buyer_id, seller_id, status, payment_status,
    total_amount, currency, shipping_address, shipping_city, shipping_phone, notes
  ) VALUES (
    order1_id, buyer_id, seller_id,
    'delivered'::public.order_status,
    'paid'::public.payment_status,
    50000, 'CDF',
    '12 Avenue de la Paix', 'Kinshasa', '+243 81 000 0001',
    'Livraison rapide souhaitée'
  ) ON CONFLICT (id) DO NOTHING;

  -- Order 2: pending
  INSERT INTO public.orders (
    id, buyer_id, seller_id, status, payment_status,
    total_amount, currency, shipping_address, shipping_city, shipping_phone, notes
  ) VALUES (
    order2_id, buyer_id, seller_id,
    'pending'::public.order_status,
    'pending'::public.payment_status,
    25000, 'CDF',
    '45 Boulevard du 30 Juin', 'Kinshasa', '+243 82 000 0002',
    ''
  ) ON CONFLICT (id) DO NOTHING;

  -- Order items for order 1
  IF product_id IS NOT NULL THEN
    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_price, quantity, unit
    ) VALUES (
      order1_id, product_id, 'Café Robusta du Kongo', 25000, 2, 'Kg'
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_price, quantity, unit
    ) VALUES (
      order2_id, product_id, 'Café Robusta du Kongo', 25000, 1, 'Kg'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Transaction for order 1 (paid)
  INSERT INTO public.transactions (
    order_id, buyer_id, seller_id,
    transaction_type, status,
    amount, currency,
    payment_method, payment_reference,
    description
  ) VALUES (
    order1_id, buyer_id, seller_id,
    'purchase'::public.transaction_type,
    'completed'::public.transaction_status,
    50000, 'CDF',
    'mobile_money', 'TXN-2026-001',
    'Paiement commande #' || order1_id::TEXT
  ) ON CONFLICT (id) DO NOTHING;

  -- Transaction for order 2 (pending)
  INSERT INTO public.transactions (
    order_id, buyer_id, seller_id,
    transaction_type, status,
    amount, currency,
    payment_method, payment_reference,
    description
  ) VALUES (
    order2_id, buyer_id, seller_id,
    'purchase'::public.transaction_type,
    'pending'::public.transaction_status,
    25000, 'CDF',
    'mobile_money', '',
    'Paiement commande #' || order2_id::TEXT
  ) ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
