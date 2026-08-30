-- EmpireKongo: Add supplier type/product_count columns + mock data
-- Timestamp: 20260830180100

-- ─── 1. Add missing columns to suppliers ─────────────────────────────────────
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS supplier_type TEXT DEFAULT 'Producteur',
  ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS founded_year INTEGER;

-- ─── 2. Seed mock suppliers ───────────────────────────────────────────────────
DO $$
BEGIN
  INSERT INTO public.suppliers (
    id, name, slug, description,
    logo_url, cover_url,
    category, city, supplier_type,
    is_verified, is_active,
    rating, review_count, product_count, founded_year
  ) VALUES
  (
    gen_random_uuid(), 'Kongo Agro SARL', 'kongo-agro-sarl',
    'Leader de l''agriculture congolaise, Kongo Agro SARL produit et distribue des denrees alimentaires de qualite superieure. Specialises dans les cultures vivrieres et les produits d''exportation.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1734d4c84-1772803364064.png',
    'Agriculture', 'Kinshasa', 'Producteur',
    true, true, 4.8, 312, 48, 2015
  ),
  (
    gen_random_uuid(), 'EcoBuild SARL', 'ecobuild-sarl',
    'Fournisseur de materiaux de construction de qualite pour les professionnels du BTP en RDC. Ciment, fer, bois et equipements disponibles en grande quantite.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_103a7f7c1-1787646508270.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
    'BTP & Materiaux', 'Matadi', 'Grossiste',
    false, true, 4.2, 145, 67, 2018
  ),
  (
    gen_random_uuid(), 'Green Energie', 'green-energie',
    'Specialiste des solutions d''energie renouvelable en RDC. Importation et installation de panneaux solaires, batteries et systemes d''eclairage pour particuliers et entreprises.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1e4a043f5-1784413143840.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png',
    'Energie', 'Kinshasa', 'Importateur',
    true, true, 4.7, 89, 23, 2019
  ),
  (
    gen_random_uuid(), 'Saveurs du Kongo', 'saveurs-du-kongo',
    'Transformation et distribution de produits alimentaires locaux. Huiles, farines, conserves et epices issues des terroirs congolais, fabriquees selon des recettes traditionnelles.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_19b92d40e-1787646508289.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_11aeac4dd-1773092222659.png',
    'Agroalimentaire', 'Boma', 'Producteur',
    true, true, 4.6, 267, 35, 2012
  ),
  (
    gen_random_uuid(), 'TechKongo Solutions', 'techkongo-solutions',
    'Distribution d''equipements informatiques et electroniques reconditiones. Reparation, maintenance et formation aux nouvelles technologies pour les entreprises congolaises.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1bba2e41c-1784370700110.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1b3a8341e-1785794453121.png',
    'Technologie', 'Kinshasa', 'Distributeur',
    true, true, 4.5, 198, 41, 2017
  ),
  (
    gen_random_uuid(), 'Mode Congo', 'mode-congo',
    'Creation et distribution de vetements et tissus africains authentiques. Wax, bazin, soie et creations contemporaines inspirees des traditions vestimentaires congolaises.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_13e4955e0-1784388894413.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png',
    'Mode & Beaute', 'Kinshasa', 'Fabricant',
    false, true, 4.8, 423, 89, 2014
  ),
  (
    gen_random_uuid(), 'Congo Elevage Pro', 'congo-elevage-pro',
    'Elevage professionnel de volailles, bovins et porcins. Viandes fraiches, oeufs et produits laitiers livres directement aux restaurants, hotels et particuliers de Lubumbashi.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_168d904fb-1784388894499.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png',
    'Elevage', 'Lubumbashi', 'Producteur',
    true, true, 4.4, 76, 18, 2016
  ),
  (
    gen_random_uuid(), 'Pharma Kongo', 'pharma-kongo',
    'Distribution de medicaments generiques et de materiel medical aux pharmacies, cliniques et hopitaux de la RDC. Partenaire de confiance du secteur de la sante depuis 2010.',
    'https://img.rocket.new/generatedImages/rocket_gen_img_132c518e0-1787646508101.png',
    'https://img.rocket.new/generatedImages/rocket_gen_img_154e5b012-1780833154113.png',
    'Sante', 'Kinshasa', 'Grossiste',
    true, true, 4.9, 534, 156, 2010
  )
  ON CONFLICT (slug) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Suppliers mock data insertion failed: %', SQLERRM;
END $$;
