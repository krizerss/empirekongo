import ProductClient from './ProductClient';

const productsData: Record<string, {
  id: number;name: string;vendor: string;vendorId: number;vendorVerified: boolean;
  vendorCity: string;vendorPhone: string;vendorEmail: string;vendorProducts: number;vendorRating: number;
  price: string;priceNum: number;unit: string;category: string;city: string;
  images: {src: string;alt: string;}[];
  rating: number;reviews: number;stock: number;isPromo?: boolean;promoLabel?: string;
  description: string;
  characteristics: {label: string;value: string;}[];
  reviewsList: {id: number;author: string;rating: number;date: string;comment: string;avatar: string;}[];
}> = {
  '1': {
    id: 1, name: 'Café Robusta du Kongo', vendor: 'Kongo Agro SARL', vendorId: 1, vendorVerified: true, vendorCity: 'Kinshasa', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorProducts: 48, vendorRating: 4.8,
    price: '25,000 FC', priceNum: 25000, unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa', stock: 500,
    images: [
    { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png', alt: 'Grains de café robusta brun foncé dans un sac en jute, café artisanal congolais de qualité premium' },
    { src: 'https://images.unsplash.com/photo-1691775755067-a9807ac8939c', alt: 'Tasse de café noir fumant sur fond sombre, café robusta congolais fraîchement torréfié' },
    { src: "https://images.unsplash.com/photo-1589938004568-f1bdcdaf72d0", alt: 'Plantation de caféiers verts luxuriants en Afrique centrale, culture du café robusta' }],

    rating: 4.8, reviews: 124,
    description: "Le Café Robusta du Kongo est cultivé dans les hauts plateaux de la République Démocratique du Congo, à plus de 1500m d'altitude. Sa saveur intense et son arôme boisé en font un café d'exception apprécié des connaisseurs. Récolté à la main par des agriculteurs locaux, ce café est séché naturellement au soleil avant d'être torréfié selon des méthodes traditionnelles.",
    characteristics: [
    { label: 'Origine', value: 'Hauts plateaux du Kongo' },
    { label: 'Altitude', value: '1500 - 2000m' },
    { label: 'Variété', value: 'Robusta' },
    { label: 'Traitement', value: 'Séchage naturel' },
    { label: 'Torréfaction', value: 'Moyenne à foncée' },
    { label: 'Conditionnement', value: 'Sac en jute 1Kg' },
    { label: 'Conservation', value: '18 mois' },
    { label: 'Certification', value: 'Agriculture locale' }],

    reviewsList: [
    { id: 1, author: 'Jean-Pierre M.', rating: 5, date: '12 Jan 2026', comment: "Café exceptionnel ! L'arôme est incroyable et le goût est vraiment authentique. Je recommande vivement.", avatar: 'JP' },
    { id: 2, author: 'Marie K.', rating: 4, date: '5 Fév 2026', comment: 'Très bon café, livraison rapide. La qualité est au rendez-vous, je reviendrai commander.', avatar: 'MK' },
    { id: 3, author: 'André B.', rating: 5, date: '20 Mar 2026', comment: "Le meilleur café que j'ai goûté depuis longtemps. Vraiment fier de soutenir les producteurs locaux.", avatar: 'AB' }]

  },
  '2': {
    id: 2, name: 'Huile de Palme Naturelle', vendor: 'Saveurs du Kongo', vendorId: 2, vendorVerified: true, vendorCity: 'Boma', vendorPhone: '+243 82 345 6789', vendorEmail: 'info@saveurskongo.cd', vendorProducts: 35, vendorRating: 4.6,
    price: '15,000 FC', priceNum: 15000, unit: '/ Litre', category: 'Agroalimentaire', city: 'Boma', stock: 200, isPromo: true, promoLabel: '-20%',
    images: [
    { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dbae1103-1779692655900.png', alt: "Bouteille d'huile de palme rouge orangée sur fond sombre, produit naturel africain" },
    { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dbae1103-1779692655900.png', alt: 'Huile de palme rouge dans un bol en bois, huile naturelle congolaise traditionnelle' }],

    rating: 4.6, reviews: 89,
    description: "Huile de palme 100% naturelle, extraite à froid de palmiers cultivés sans pesticides dans la région de Boma. Riche en vitamines A et E, cette huile est idéale pour la cuisine africaine traditionnelle. Sa couleur rouge orangée caractéristique témoigne de sa richesse en caroténoïdes.",
    characteristics: [
    { label: 'Type', value: 'Huile de palme rouge' },
    { label: 'Extraction', value: 'À froid' },
    { label: 'Origine', value: 'Région de Boma' },
    { label: 'Contenance', value: '1 Litre' },
    { label: 'Conservation', value: '12 mois' },
    { label: 'Vitamines', value: 'A, E, K' }],

    reviewsList: [
    { id: 1, author: 'Cécile N.', rating: 5, date: '8 Jan 2026', comment: 'Huile de très bonne qualité, couleur magnifique et goût authentique. Parfaite pour mes recettes.', avatar: 'CN' },
    { id: 2, author: 'Paul D.', rating: 4, date: '15 Fév 2026', comment: 'Bonne huile, livraison soignée. Je suis satisfait de mon achat.', avatar: 'PD' }]

  },
  '3': {
    id: 3, name: 'Maïs Séché', vendor: 'Kongo Agro SARL', vendorId: 1, vendorVerified: true, vendorCity: 'Kinshasa', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorProducts: 48, vendorRating: 4.8,
    price: '8,000 FC', priceNum: 8000, unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa', stock: 1000,
    images: [
    { src: "https://img.rocket.new/generatedImages/rocket_gen_img_12f701f8b-1772059631290.png", alt: 'Épis de maïs jaune doré séchés au soleil, céréale de base congolaise' }],

    rating: 4.5, reviews: 67,
    description: "Maïs séché de qualité supérieure, cultivé localement dans les plaines fertiles du Kongo. Idéal pour la farine de maïs, la polenta et les préparations traditionnelles africaines.",
    characteristics: [
    { label: 'Type', value: 'Maïs séché' },
    { label: 'Origine', value: 'Plaines du Kongo' },
    { label: 'Conditionnement', value: 'Sac 1Kg' },
    { label: 'Conservation', value: '12 mois' }],

    reviewsList: [
    { id: 1, author: 'Lucie M.', rating: 5, date: '10 Jan 2026', comment: 'Très bon maïs, bien séché et de bonne qualité. Je recommande.', avatar: 'LM' }]

  },
  '5': {
    id: 5, name: 'Miel Naturel', vendor: 'Kongo Agro SARL', vendorId: 1, vendorVerified: true, vendorCity: 'Kinshasa', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorProducts: 48, vendorRating: 4.8,
    price: '7,000 FC', priceNum: 7000, unit: '/ Pot', category: 'Agriculture', city: 'Kinshasa', stock: 150,
    images: [
    { src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bd4d46c0-1766748178463.png', alt: 'Pot de miel naturel doré avec rayon de miel, apiculture congolaise traditionnelle' }],

    rating: 4.9, reviews: 203,
    description: "Miel 100% naturel récolté par des apiculteurs locaux dans les forêts du Kongo. Non pasteurisé, riche en enzymes et antioxydants. Un produit pur et authentique.",
    characteristics: [
    { label: 'Type', value: 'Miel toutes fleurs' },
    { label: 'Extraction', value: 'À froid' },
    { label: 'Contenance', value: '500g' },
    { label: 'Conservation', value: '24 mois' }],

    reviewsList: [
    { id: 1, author: 'Sophie K.', rating: 5, date: '5 Mar 2026', comment: 'Miel délicieux, très parfumé. Le meilleur que j\'ai goûté !', avatar: 'SK' }]

  }
};

const similarProducts = [
{ id: 3, name: 'Maïs Séché', vendor: 'Kongo Agro SARL', price: '8,000 FC', unit: '/ Kg', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12f701f8b-1772059631290.png", alt: 'Épis de maïs jaune doré séchés au soleil, céréale de base congolaise', rating: 4.5 },
{ id: 5, name: 'Miel Naturel', vendor: 'Kongo Agro SARL', price: '7,000 FC', unit: '/ Pot', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1bd4d46c0-1766748178463.png', alt: 'Pot de miel naturel doré avec rayon de miel, apiculture congolaise traditionnelle', rating: 4.9 },
{ id: 6, name: 'Riz Local', vendor: 'Saveurs du Kongo', price: '6,000 FC', unit: '/ Kg', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17814ecf6-1784370699737.png", alt: 'Riz blanc local dans un bol en bois sur fond sombre, céréale cultivée localement en RDC', rating: 4.4 },
{ id: 11, name: 'Tomates Fraîches', vendor: 'Saveurs du Kongo', price: '4,000 FC', unit: '/ Kg', image: 'https://images.unsplash.com/photo-1667986968934-bf1fd9db241f', alt: 'Tomates fraîches rouges brillantes sur fond sombre, légumes frais du jardin congolais', rating: 4.3 }];


export const dynamic = 'force-static';

export function generateStaticParams() {
  return Object.keys(productsData).map((id) => ({ id }));
}

type PageProps = {
  params: Promise<{id: string;}>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = productsData[id] ?? productsData['1'];
  return <ProductClient product={product} similarProducts={similarProducts} />;
}