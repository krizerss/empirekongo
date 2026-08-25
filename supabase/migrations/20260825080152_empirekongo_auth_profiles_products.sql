-- EmpireKongo: Auth + Profiles + Products migration
-- Timestamp: 20260825080152

-- ─── 1. TYPES ────────────────────────────────────────────────────────────────
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('visiteur', 'client', 'vendeur', 'entreprise', 'fournisseur', 'affilie', 'admin');

DROP TYPE IF EXISTS public.product_stock_status CASCADE;
CREATE TYPE public.product_stock_status AS ENUM ('En stock', 'Stock limité', 'Rupture de stock');

-- ─── 2. TABLES ───────────────────────────────────────────────────────────────

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role public.user_role DEFAULT 'client'::public.user_role,
  account_type TEXT DEFAULT 'member',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price TEXT NOT NULL,
  unit TEXT DEFAULT '',
  category TEXT DEFAULT '',
  city TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  alt_text TEXT DEFAULT '',
  stock_status public.product_stock_status DEFAULT 'En stock'::public.product_stock_status,
  stock_qty INTEGER DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  vendor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  vendor_name TEXT DEFAULT '',
  vendor_type TEXT DEFAULT 'Entreprise',
  vendor_phone TEXT DEFAULT '',
  vendor_email TEXT DEFAULT '',
  vendor_city TEXT DEFAULT '',
  vendor_verified BOOLEAN DEFAULT false,
  vendor_since TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. INDEXES ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_city ON public.products(city);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);

-- ─── 4. FUNCTIONS ────────────────────────────────────────────────────────────

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, account_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::public.user_role,
    COALESCE(NEW.raw_user_meta_data->>'account_type', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ─── 5. ENABLE RLS ───────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ─────────────────────────────────────────────────────────

-- Profiles: users manage their own profile
DROP POLICY IF EXISTS "users_manage_own_profiles" ON public.profiles;
CREATE POLICY "users_manage_own_profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Profiles: public can read profiles (for vendor display)
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles"
ON public.profiles
FOR SELECT
TO public
USING (is_active = true);

-- Products: public can read active products
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products"
ON public.products
FOR SELECT
TO public
USING (is_active = true);

-- Products: authenticated users can insert their own products
DROP POLICY IF EXISTS "users_insert_own_products" ON public.products;
CREATE POLICY "users_insert_own_products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (vendor_id = auth.uid());

-- Products: authenticated users can update their own products
DROP POLICY IF EXISTS "users_update_own_products" ON public.products;
CREATE POLICY "users_update_own_products"
ON public.products
FOR UPDATE
TO authenticated
USING (vendor_id = auth.uid())
WITH CHECK (vendor_id = auth.uid());

-- Products: authenticated users can delete their own products
DROP POLICY IF EXISTS "users_delete_own_products" ON public.products;
CREATE POLICY "users_delete_own_products"
ON public.products
FOR DELETE
TO authenticated
USING (vendor_id = auth.uid());

-- ─── 7. TRIGGERS ─────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_products_updated ON public.products;
CREATE TRIGGER on_products_updated
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 8. MOCK DATA ────────────────────────────────────────────────────────────
DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  vendor1_uuid UUID := gen_random_uuid();
  vendor2_uuid UUID := gen_random_uuid();
BEGIN
  -- Create auth users (trigger auto-creates profiles)
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'admin@empirekongo.cd', crypt('Admin2024!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Admin EmpireKongo', 'role', 'admin', 'account_type', 'member'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (vendor1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'kongoagro@empirekongo.cd', crypt('Vendor2024!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Kongo Agro SARL', 'role', 'entreprise', 'account_type', 'enterprise'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (vendor2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'saveurs@empirekongo.cd', crypt('Vendor2024!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Saveurs du Kongo', 'role', 'entreprise', 'account_type', 'enterprise'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
  ON CONFLICT (id) DO NOTHING;

  -- Insert sample products
  INSERT INTO public.products (
    name, description, price, unit, category, city,
    image_url, alt_text, stock_status, stock_qty, rating, review_count,
    vendor_id, vendor_name, vendor_type, vendor_phone, vendor_email,
    vendor_city, vendor_verified, vendor_since
  ) VALUES
    ('Café Robusta du Kongo', 'Café Robusta de haute qualité cultivé dans les terres fertiles du Kongo. Récolté à la main, séché au soleil et torréfié selon les méthodes traditionnelles.', '25,000 FC', '/ Kg', 'Agriculture', 'Kinshasa',
     'https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png', 'Grains de café robusta brun foncé dans un sac en jute',
     'En stock'::public.product_stock_status, 250, 4.7, 38,
     vendor1_uuid, 'Kongo Agro SARL', 'Entreprise', '+243 81 234 5678', 'contact@kongoagro.cd', 'Kinshasa', true, '2019'),
    ('Huile de Palme Naturelle', 'Huile de palme 100% naturelle, non raffinée, extraite à froid. Riche en vitamines A et E, idéale pour la cuisine traditionnelle congolaise.', '15,000 FC', '/ Litre', 'Agroalimentaire', 'Boma',
     'https://img.rocket.new/generatedImages/rocket_gen_img_100f6c606-1772807125471.png', 'Bouteille d''huile de palme rouge orangée sur fond sombre',
     'En stock'::public.product_stock_status, 180, 4.5, 24,
     vendor2_uuid, 'Saveurs du Kongo', 'Entreprise', '+243 82 345 6789', 'info@saveurskongo.cd', 'Boma', true, '2017'),
    ('Maïs Séché', 'Maïs séché naturellement au soleil, sans traitement chimique. Idéal pour la farine de maïs, la polenta ou l''alimentation animale.', '8,000 FC', '/ Kg', 'Agriculture', 'Kinshasa',
     'https://images.unsplash.com/photo-1658970870100-b926cb232e3e', 'Épis de maïs jaune doré séchés au soleil',
     'Stock limité'::public.product_stock_status, 45, 4.2, 15,
     vendor1_uuid, 'Kongo Agro SARL', 'Entreprise', '+243 81 234 5678', 'contact@kongoagro.cd', 'Kinshasa', true, '2019'),
    ('Savon Artisanal', 'Savon artisanal fabriqué à la main avec des huiles naturelles locales (palme, coco, karité). Sans sulfates ni parabènes.', '3,500 FC', '/ Pièce', 'Mode & Beauté', 'Boma',
     'https://images.unsplash.com/photo-1612799897476-e6e6e663f337', 'Savons artisanaux aux huiles naturelles empilés avec fleurs séchées',
     'En stock'::public.product_stock_status, 320, 4.8, 52,
     vendor2_uuid, 'Saveurs du Kongo', 'Entreprise', '+243 82 345 6789', 'info@saveurskongo.cd', 'Boma', true, '2017'),
    ('Miel Naturel', 'Miel pur de forêt tropicale, récolté par des apiculteurs locaux. Non pasteurisé, non filtré pour conserver tous ses bienfaits naturels.', '7,000 FC', '/ Pot', 'Agriculture', 'Kinshasa',
     'https://img.rocket.new/generatedImages/rocket_gen_img_1b9932d16-1772872383455.png', 'Pot de miel naturel doré avec rayon de miel',
     'En stock'::public.product_stock_status, 90, 4.9, 61,
     vendor1_uuid, 'Kongo Agro SARL', 'Entreprise', '+243 81 234 5678', 'contact@kongoagro.cd', 'Kinshasa', true, '2019'),
    ('Riz Local', 'Riz blanc cultivé localement dans les plaines de la province du Kongo Central. Grain long, texture ferme après cuisson.', '6,000 FC', '/ Kg', 'Agroalimentaire', 'Boma',
     'https://img.rocket.new/generatedImages/rocket_gen_img_136eca2eb-1784370700193.png', 'Riz blanc local dans un bol en bois sur fond sombre',
     'En stock'::public.product_stock_status, 500, 4.3, 29,
     vendor2_uuid, 'Saveurs du Kongo', 'Entreprise', '+243 82 345 6789', 'info@saveurskongo.cd', 'Boma', true, '2017'),
    ('Panneaux Solaires 300W', 'Panneau solaire monocristallin 300W haute performance. Rendement 21%, résistant aux intempéries (IP67). Garantie 10 ans fabricant.', '450,000 FC', '/ Unité', 'Énergie', 'Kinshasa',
     'https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png', 'Panneau solaire photovoltaïque bleu sur fond ciel africain',
     'Stock limité'::public.product_stock_status, 15, 4.6, 18,
     vendor1_uuid, 'Kongo Agro SARL', 'Entreprise', '+243 81 234 5678', 'contact@kongoagro.cd', 'Kinshasa', true, '2019'),
    ('Tissu Wax Africain', 'Tissu wax 100% coton, imprimé en Afrique de l''Ouest. Motifs géométriques et floraux traditionnels. Largeur 115 cm.', '35,000 FC', '/ Mètre', 'Mode & Beauté', 'Kinshasa',
     'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png', 'Tissu wax africain coloré avec motifs géométriques traditionnels',
     'En stock'::public.product_stock_status, 200, 4.6, 35,
     vendor2_uuid, 'Saveurs du Kongo', 'Entreprise', '+243 82 345 6789', 'info@saveurskongo.cd', 'Boma', true, '2017')
  ON CONFLICT (id) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
