import SupplierClient from './SupplierClient';
import { createClient } from '@/lib/supabase/server';

const suppliersData: Record<string, any> = {
  '1': {
    id: 1, name: 'Kongo Agro SARL', category: 'Agriculture', city: 'Kinshasa', type: 'Producteur',
    address: 'Avenue du Commerce 45, Gombe, Kinshasa', phone: '+243 81 234 5678', email: 'contact@kongoagro.cd', website: 'www.kongoagro.cd',
    founded: '2015', employees: '50-100', verified: true, rating: 4.8, totalReviews: 312,
    logo: '/assets/images/app_logo.png',
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
    logo: '/assets/images/app_logo.png',
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
      .select('id,owner_id,name,category,description,city,address,phone,email,website,logo_url,cover_url,verified,is_verified,employee_count,founded_year,created_at')
      .eq('id', id)
      .maybeSingle();

    if (!error && enterprise) {
      const { data: products } = await supabase
        .from('products')
        .select('id,name,price,unit,image_url,rating')
        .eq('vendor_id', enterprise.owner_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      const supplier = {
        ...fallback,
        id: Number(enterprise.id) || fallback.id,
        name: enterprise.name || fallback.name,
        category: enterprise.category || fallback.category,
        description: enterprise.description || fallback.description,
        city: enterprise.city || fallback.city,
        address: enterprise.address || '',
        phone: enterprise.phone || '',
        email: enterprise.email || '',
        website: enterprise.website || '',
        logo: enterprise.logo_url || '/assets/images/app_logo.png',
        banner: enterprise.cover_url || fallback.banner,
        logoAlt: `Logo ${enterprise.name || fallback.name}`,
        bannerAlt: `Photo de couverture de ${enterprise.name || fallback.name}`,
        verified: Boolean(enterprise.verified ?? enterprise.is_verified ?? false),
        founded: enterprise.founded_year?.toString() || (enterprise.created_at ? new Date(enterprise.created_at).getFullYear().toString() : fallback.founded),
        employees: enterprise.employee_count ? enterprise.employee_count.toString() : '—',
        products: (products ?? []).map((product: any) => ({
          id: Number(product.id) || 0,
          name: product.name || 'Produit sans nom',
          price: product.price || '—',
          unit: product.unit || '',
          image: product.image_url || '/assets/images/no_image.png',
          alt: product.name || 'Produit',
          rating: Number(product.rating ?? 0),
        })),
      };

      return <SupplierClient supplier={supplier} />;
    }
  } catch (error) {
    console.error('Erreur chargement entreprise:', error);
  }

  return <SupplierClient supplier={fallback} />;
}
