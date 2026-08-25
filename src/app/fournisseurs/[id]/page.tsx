import SupplierClient from './SupplierClient';

const suppliersData: Record<string, {
  id: number;name: string;logo: string;logoAlt: string;banner: string;bannerAlt: string;
  category: string;city: string;address: string;phone: string;email: string;website: string;
  founded: string;employees: string;description: string;verified: boolean;type: string;
  rating: number;totalReviews: number;
  products: {id: number;name: string;price: string;unit: string;image: string;alt: string;rating: number;}[];
  reviews: {id: number;author: string;rating: number;date: string;comment: string;avatar: string;}[];
}> = {
  '1': {
    id: 1, name: 'Kongo Agro SARL', category: 'Agriculture', city: 'Kinshasa', type: 'Producteur',
    address: 'Avenue du Commerce 45, Gombe, Kinshasa', phone: '+243 81 234 5678', email: 'contact@kongoagro.cd', website: 'www.kongoagro.cd',
    founded: '2015', employees: '50-100', verified: true, rating: 4.8, totalReviews: 312,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c67d252f-1784370699791.png",
    logoAlt: 'Logo Kongo Agro SARL fond vert, entreprise agricole congolaise',
    banner: "https://img.rocket.new/generatedImages/rocket_gen_img_1734d4c84-1772803364064.png",
    bannerAlt: 'Champs agricoles verts luxuriants au Congo, ferme agricole africaine en pleine production',
    description: "Kongo Agro SARL est le leader de l'agriculture congolaise depuis 2015. Nous produisons et distribuons des denrées alimentaires de qualité supérieure, issues de nos fermes situées dans les provinces de Kinshasa et du Kongo Central. Notre mission est de nourrir la RDC avec des produits locaux, sains et accessibles. Nous travaillons avec plus de 200 agriculteurs partenaires et exportons vers 5 pays africains.",
    products: [
    { id: 1, name: 'Café Robusta du Kongo', price: '25,000 FC', unit: '/ Kg', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png', alt: 'Grains de café robusta brun foncé dans un sac en jute, café artisanal congolais', rating: 4.8 },
    { id: 3, name: 'Maïs Séché', price: '8,000 FC', unit: '/ Kg', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f701f8b-1772059631290.png", alt: 'Épis de maïs jaune doré séchés au soleil, céréale de base congolaise', rating: 4.5 },
    { id: 5, name: 'Miel Naturel', price: '7,000 FC', unit: '/ Pot', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bd4d46c0-1766748178463.png', alt: 'Pot de miel naturel doré avec rayon de miel, apiculture congolaise traditionnelle', rating: 4.9 },
    { id: 9, name: 'Poulet de Ferme', price: '12,000 FC', unit: '/ Kg', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png', alt: 'Poulet de ferme bien nourri dans une ferme avicole africaine, élevage traditionnel congolais', rating: 4.6 }],

    reviews: [
    { id: 1, author: 'Jean-Pierre M.', rating: 5, date: '12 Jan 2026', comment: 'Fournisseur exceptionnel ! Produits de qualité, livraison ponctuelle et service client irréprochable. Je recommande vivement Kongo Agro à tous les professionnels.', avatar: 'JP' },
    { id: 2, author: 'Marie K.', rating: 5, date: '5 Fév 2026', comment: 'Partenaire de confiance depuis 2 ans. La qualité est constante et les prix sont compétitifs. Très satisfaite de notre collaboration.', avatar: 'MK' },
    { id: 3, author: 'André B.', rating: 4, date: '20 Mar 2026', comment: "Bonne entreprise, produits frais et bien conditionnés. Quelques délais de livraison parfois mais dans l'ensemble très satisfait.", avatar: 'AB' }]

  },
  '2': {
    id: 2, name: 'EcoBuild SARL', category: 'BTP & Matériaux', city: 'Matadi', type: 'Grossiste',
    address: 'Zone Industrielle, Matadi, Kongo Central', phone: '+243 84 567 8901', email: 'contact@ecobuild.cd', website: 'www.ecobuild.cd',
    founded: '2018', employees: '20-50', verified: false, rating: 4.2, totalReviews: 145,
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_103a7f7c1-1787646508270.png",
    logoAlt: 'Logo EcoBuild SARL fond bleu, entreprise de construction congolaise',
    banner: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a19ed1be-1772640739892.png',
    bannerAlt: 'Chantier de construction moderne avec grues et matériaux, bâtiment en cours à Matadi',
    description: 'EcoBuild SARL est votre partenaire de confiance pour tous vos besoins en matériaux de construction. Basés à Matadi, nous approvisionnons les chantiers de la RDC en ciment, fer, bois et équipements de qualité à des prix compétitifs.',
    products: [
    { id: 8, name: 'Ciment Portland 50kg', price: '18,000 FC', unit: '/ Sac', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13de156d2-1772741976528.png', alt: 'Sacs de ciment empilés sur chantier de construction, matériaux de construction congolais', rating: 4.2 },
    { id: 14, name: 'Fer à Béton 12mm', price: '22,000 FC', unit: '/ Barre', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bcf9ad31-1765031427300.png', alt: 'Barres de fer à béton empilées sur chantier, matériaux de construction métalliques', rating: 4.1 }],

    reviews: [
    { id: 1, author: 'Paul D.', rating: 4, date: '8 Jan 2026', comment: 'Bons matériaux, prix corrects. La livraison est parfois un peu longue mais la qualité est là.', avatar: 'PD' },
    { id: 2, author: 'Cécile N.', rating: 4, date: '15 Fév 2026', comment: 'Fournisseur sérieux, ciment de bonne qualité. Je recommande pour les gros chantiers.', avatar: 'CN' }]

  }
};

export const dynamic = 'force-static';

export function generateStaticParams() {
  return Object.keys(suppliersData).map((id) => ({ id }));
}

type PageProps = {
  params: Promise<{id: string;}>;
};

export default async function SupplierProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supplier = suppliersData[id] ?? suppliersData['1'];
  return <SupplierClient supplier={supplier} />;
}