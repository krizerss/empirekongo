import SupplierClient from './SupplierClient';
import { createClient } from '@/lib/supabase/server';

const suppliersData: Record<string, any> = {
  '1': {
    id: 1, name: 'Kongo Agro SARL', category: 'Agriculture', city: 'Kinshasa', type: 'Producteur',
    address: 'Avenue du Commerce 45, Gombe, Kinshasa', phone: '+243 81 234 5678', email: 'contact@kongoagro.cd', website: 'www.kongoagro.cd',
    founded: '2015', employees: '50-100', verified: true, rating: 4.8, totalReviews: 312,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png",
    logoAlt: 'Logo Kongo Agro SARL',
    banner: 'https://images.unsplash.com/photo-1501184633355-06e92b102476',
    bannerAlt: 'Photo de couverture de Kongo Agro SARL',
    description: "Kongo Agro SARL est le leader de l'agriculture congolaise depuis 2015. Nous produisons et distribuons des denrées alimentaires de qualité supérieure.",
    products: [], reviews: []
  },
  '2': {
    id: 2, name: 'EcoBuild SARL', category: 'BTP & Matériaux', city: 'Matadi', type: 'Grossiste',
    address: 'Zone Industrielle, Matadi, Kongo Central', phone: '+243 84 567 8901', email: 'contact@ecobuild.cd', website: 'www.ecobuild.cd',
    founded: '2018', employees: '20-50', verified: false, rating: 4.2, totalReviews: 145,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11914d178-1784413962807.png",
    logoAlt: 'Logo EcoBuild SARL',
    banner: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
    bannerAlt: 'Photo de couverture de EcoBuild SARL',
    description: 'EcoBuild SARL est votre partenaire de confiance pour tous vos besoins en matériaux de construction.',
    products: [], reviews: []
  }
};

export const dynamic = 'force-dynamic';

type PageProps = { params: Promise<{ id: string }> };

export default async function SupplierProfilePage({ params }: PageProps) {
  const { id } = await params;
  const fallback = suppliersData[id] ?? suppliersData['1'];

  try {
    const supabase = await createClient();
    const { data: enterprise, error } = await supabase
      .from('enterprises')
      .select('id,name,category,description,city,logo_url,cover_url,verified,is_verified,created_at')
      .eq('id', id)
      .maybeSingle();

    if (!error && enterprise) {
      const supplier = {
        ...fallback,
        id: Number(enterprise.id) || fallback.id,
        name: enterprise.name || fallback.name,
        category: enterprise.category || fallback.category,
        description: enterprise.description || fallback.description,
        city: enterprise.city || fallback.city,
        logo: enterprise.logo_url || fallback.logo,
        banner: enterprise.cover_url || fallback.banner,
        logoAlt: `Logo ${enterprise.name || fallback.name}`,
        bannerAlt: `Photo de couverture de ${enterprise.name || fallback.name}`,
        verified: Boolean(enterprise.verified ?? enterprise.is_verified ?? fallback.verified),
        founded: enterprise.created_at ? new Date(enterprise.created_at).getFullYear().toString() : fallback.founded
      };

      return <SupplierClient supplier={supplier} />;
    }
  } catch (error) {
    console.error('Erreur chargement entreprise:', error);
  }

  return <SupplierClient supplier={fallback} />;
}
