import StoreProductDetailClient, { StoreProductDetail } from './StoreProductDetailClient';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('id,name,description,price,unit,category,sub_category,city,image_url,alt_text,stock_status,stock_qty,rating,review_count,vendor_id,vendor_name,vendor_type,vendor_phone,vendor_email,vendor_city,vendor_verified,vendor_since,is_active')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('Erreur chargement produit:', error);
    notFound();
  }

  if (!product) notFound();

  const vendorId = product.vendor_id ? String(product.vendor_id) : '';
  const { count: vendorProducts } = vendorId
    ? await supabase.from('products').select('id', { count: 'exact', head: true }).eq('vendor_id', vendorId).eq('is_active', true)
    : { count: 0 };

  const { data: similar } = await supabase
    .from('products')
    .select('id,name,price,unit,image_url,alt_text,rating,review_count,vendor_name')
    .eq('is_active', true)
    .eq('category', product.category)
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const detail: StoreProductDetail = {
    id: String(product.id),
    name: product.name || 'Produit sans nom',
    description: product.description || '',
    price: product.price || 'Prix sur demande',
    unit: product.unit || '',
    category: product.category || 'Autre',
    subCategory: product.sub_category || '',
    city: product.city || product.vendor_city || '',
    image: product.image_url || '/assets/images/no_image.png',
    alt: product.alt_text || product.name || 'Produit EmpireKongo',
    stockQty: Number(product.stock_qty ?? 0),
    stockStatus: String(product.stock_status ?? ''),
    rating: Number(product.rating ?? 0),
    reviewCount: Number(product.review_count ?? 0),
    vendorId,
    vendorName: product.vendor_name || 'Fournisseur',
    vendorType: product.vendor_type || 'Fournisseur',
    vendorPhone: product.vendor_phone || '',
    vendorEmail: product.vendor_email || '',
    vendorCity: product.vendor_city || product.city || '',
    vendorVerified: Boolean(product.vendor_verified),
    vendorSince: product.vendor_since || '',
    vendorProducts: Number(vendorProducts ?? 0),
    similarProducts: (similar ?? []).map((p: any) => ({
      id: String(p.id),
      name: p.name || 'Produit',
      vendorName: p.vendor_name || 'Fournisseur',
      price: p.price || 'Prix sur demande',
      unit: p.unit || '',
      image: p.image_url || '/assets/images/no_image.png',
      alt: p.alt_text || p.name || 'Produit',
      rating: Number(p.rating ?? 0),
    })),
  };

  return <StoreProductDetailClient product={detail} />;
}
