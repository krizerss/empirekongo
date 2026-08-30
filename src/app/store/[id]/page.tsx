import ProductDetailClient from '@/app/components/ProductDetailClient';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoreProductPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <ProductDetailClient
      productId={id}
      backHref="/store"
      backLabel="Store"
    />
  );
}
