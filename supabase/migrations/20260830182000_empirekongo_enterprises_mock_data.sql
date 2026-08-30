-- Migration: enterprises mock data + RLS policies
-- Timestamp: 20260830182000

-- Ensure RLS is enabled
ALTER TABLE public.enterprises ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "public_can_read_enterprises" ON public.enterprises;
CREATE POLICY "public_can_read_enterprises"
ON public.enterprises
FOR SELECT
TO public
USING (is_active = true);

DROP POLICY IF EXISTS "users_manage_own_enterprises" ON public.enterprises;
CREATE POLICY "users_manage_own_enterprises"
ON public.enterprises
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enterprises_owner_id ON public.enterprises(owner_id);
CREATE INDEX IF NOT EXISTS idx_enterprises_category ON public.enterprises(category);
CREATE INDEX IF NOT EXISTS idx_enterprises_city ON public.enterprises(city);
CREATE INDEX IF NOT EXISTS idx_enterprises_is_active ON public.enterprises(is_active);

-- Mock data (public demo enterprises with no owner — visible to all)
DO $$
BEGIN
  INSERT INTO public.enterprises (
    id, owner_id, name, slug, description, logo_url, cover_url,
    category, city, address, phone, email, website,
    is_verified, is_active, employee_count, founded_year, created_at, updated_at
  ) VALUES
  (
    gen_random_uuid(), NULL,
    'Kongo Agro SARL',
    'kongo-agro-sarl',
    'Leader de l''agriculture congolaise, Kongo Agro SARL produit et distribue des denrees alimentaires de qualite superieure en Republique Democratique du Congo.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1734d4c84-1772803364064.png',
    'Agriculture', 'Kinshasa', 'Avenue du Commerce, Kinshasa',
    '+243 81 234 5678', 'contact@kongoagro.cd', 'www.kongoagro.cd',
    true, true, 25, 2015, now(), now()
  ),
  (
    gen_random_uuid(), NULL,
    'EcoBuild SARL',
    'ecobuild-sarl',
    'Fournisseur de materiaux de construction de qualite pour les professionnels du BTP en RDC. Solutions durables et innovantes.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_103a7f7c1-1787646508270.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
    'Construction', 'Matadi', 'Zone Industrielle, Matadi',
    '+243 82 345 6789', 'info@ecobuild.cd', 'www.ecobuild.cd',
    false, true, 50, 2018, now(), now()
  ),
  (
    gen_random_uuid(), NULL,
    'TechCongo Solutions',
    'techcongo-solutions',
    'Solutions informatiques et technologiques innovantes pour les entreprises congolaises. Developpement web, mobile et infrastructure IT.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_14ca0f424-1787646507481.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1fbd9a01b-1765828697210.png',
    'Technologie', 'Kinshasa', 'Quartier Gombe, Kinshasa',
    '+243 83 456 7890', 'hello@techcongo.cd', 'www.techcongo.cd',
    true, true, 30, 2019, now(), now()
  ),
  (
    gen_random_uuid(), NULL,
    'Congo Textile',
    'congo-textile',
    'Fabrication et distribution de vetements et textiles de qualite, valorisant les tissus traditionnels congolais pour le marche local et international.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_19eddd235-1787646508286.png',
    'https://images.unsplash.com/photo-1686155535993-afb41d41fbfb',
    'Commerce', 'Lubumbashi', 'Avenue Kasai, Lubumbashi',
    '+243 84 567 8901', 'contact@congotextile.cd', 'www.congotextile.cd',
    true, true, 40, 2017, now(), now()
  ),
  (
    gen_random_uuid(), NULL,
    'Sante Plus RDC',
    'sante-plus-rdc',
    'Distribution de medicaments et equipements medicaux pour les structures de sante en RDC. Partenaire de confiance du secteur medical.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1bd7c06f7-1787646508430.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_12191a16b-1769447560076.png',
    'Santé', 'Goma', 'Boulevard du Lac, Goma',
    '+243 85 678 9012', 'info@santeplus.cd', 'www.santeplus.cd',
    true, true, 120, 2016, now(), now()
  ),
  (
    gen_random_uuid(), NULL,
    'Energie Verte Congo',
    'energie-verte-congo',
    'Solutions d''energie solaire et renouvelable pour les menages et entreprises congolaises. Vers un Congo plus vert et energetiquement independant.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_13e52a4b4-1787646509440.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1c10745a7-1780650511052.png',
    'Énergie', 'Kinshasa', 'Avenue de l''Universite, Kinshasa',
    '+243 86 789 0123', 'contact@energieverte.cd', 'www.energieverte.cd',
    false, true, 18, 2020, now(), now()
  )
  ON CONFLICT (slug) DO NOTHING;

EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
