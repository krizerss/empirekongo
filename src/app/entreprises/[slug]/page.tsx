import EnterpriseDetailClient from './EnterpriseDetailClient';

export default async function EnterpriseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <EnterpriseDetailClient slug={slug} />;
}
