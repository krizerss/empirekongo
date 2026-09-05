'use client';
import React, { useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import AuthGuardModal from '@/components/ui/AuthGuardModal';
import { useAuth } from '@/lib/useAuth';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, MapPinIcon, XMarkIcon, PhoneIcon, EnvelopeIcon, BuildingOfficeIcon, ShoppingCartIcon, CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, TruckIcon, ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

const allCategories = [
{ label: 'Toutes catégories', count: 520 },
{ label: 'Agriculture', count: 134 },
{ label: 'Élevage', count: 67 },
{ label: 'Agroalimentaire', count: 89 },
{ label: 'Énergie', count: 43 },
{ label: 'BTP & Matériaux', count: 56 },
{ label: 'Mode & Beauté', count: 72 },
{ label: 'Technologie', count: 59 },
{ label: 'Autres', count: 0 }];


const allCities = ['Toutes les villes', 'Kinshasa', 'Matadi', 'Boma', 'Lubumbashi', 'Goma'];

interface Product {
  id: number;
  name: string;
  vendor: string;
  vendorType: string;
  vendorPhone: string;
  vendorEmail: string;
  vendorCity: string;
  vendorVerified: boolean;
  price: string;
  unit: string;
  category: string;
  city: string;
  image: string;
  alt: string;
  description?: string;
  stock?: 'En stock' | 'Stock limité' | 'Rupture de stock';
  stockQty?: number;
  rating?: number;
  reviewCount?: number;
  images?: {src: string;alt: string;}[];
  reviews?: {author: string;rating: number;date: string;comment: string;}[];
  vendorSince?: string;
  vendorProducts?: number;
}

const allProducts: Product[] = [
{
  id: 1, name: 'Café Robusta du Kongo', vendor: 'Kongo Agro SARL', vendorType: 'Entreprise', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '25,000 FC', unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png", alt: 'Grains de café robusta brun foncé dans un sac en jute, café artisanal congolais de qualité premium',
  description: 'Café Robusta de haute qualité cultivé dans les terres fertiles du Kongo. Récolté à la main, séché au soleil et torréfié selon les méthodes traditionnelles. Arôme intense, corps plein et légère amertume caractéristique du terroir congolais.',
  stock: 'En stock', stockQty: 250, rating: 4.7, reviewCount: 38, vendorSince: '2019', vendorProducts: 12,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1aceaa107-1772687295264.png", alt: 'Grains de café robusta brun foncé dans un sac en jute' },
  { src: "https://images.unsplash.com/photo-1691775755067-a9807ac8939c", alt: 'Tasse de café noir fumant sur fond sombre' },
  { src: "https://images.unsplash.com/photo-1687821015492-cb3422bdb76a", alt: 'Plantation de café avec feuilles vertes et cerises rouges' }],

  reviews: [
  { author: 'Jean-Pierre M.', rating: 5, date: '12 juin 2025', comment: 'Excellent café, très aromatique. Je commande régulièrement depuis 2 ans.' },
  { author: 'Marie K.', rating: 4, date: '3 mai 2025', comment: 'Bonne qualité, livraison rapide. Légèrement plus amer que prévu mais très bon.' },
  { author: 'Paul N.', rating: 5, date: '18 avr. 2025', comment: 'Le meilleur café que j\'ai goûté au Congo. Fortement recommandé !' }]

},
{
  id: 2, name: "Huile de Palme Naturelle", vendor: 'Saveurs du Kongo', vendorType: 'Entreprise', vendorPhone: '+243 82 345 6789', vendorEmail: 'info@saveurskongo.cd', vendorCity: 'Boma', vendorVerified: true, price: '15,000 FC', unit: '/ Litre', category: 'Agroalimentaire', city: 'Boma',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_100f6c606-1772807125471.png", alt: "Bouteille d'huile de palme rouge orangée sur fond sombre, produit naturel africain",
  description: "Huile de palme 100% naturelle, non raffinée, extraite à froid. Riche en vitamines A et E, idéale pour la cuisine traditionnelle congolaise. Sans additifs ni conservateurs.",
  stock: 'En stock', stockQty: 180, rating: 4.5, reviewCount: 24, vendorSince: '2017', vendorProducts: 8,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1dbae1103-1779692655900.png", alt: "Bouteille d'huile de palme rouge orangée" },
  { src: "https://images.unsplash.com/photo-1644126978412-cc8b041efafe", alt: "Régimes de noix de palme orange sur palmier" }],

  reviews: [
  { author: 'Cécile B.', rating: 5, date: '20 juin 2025', comment: 'Huile de très bonne qualité, couleur et goût authentiques.' },
  { author: 'Robert L.', rating: 4, date: '8 mai 2025', comment: 'Bonne huile, conforme à la description. Livraison soignée.' }]

},
{
  id: 3, name: 'Maïs Séché', vendor: 'Kongo Agro SARL', vendorType: 'Entreprise', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '8,000 FC', unit: '/ Kg', category: 'Agriculture', city: 'Kinshasa',
  image: "https://images.unsplash.com/photo-1658970870100-b926cb232e3e", alt: 'Épis de maïs jaune doré séchés au soleil, céréale de base congolaise',
  description: 'Maïs séché naturellement au soleil, sans traitement chimique. Idéal pour la farine de maïs, la polenta ou l\'alimentation animale. Cultivé localement dans la province de Kinshasa.',
  stock: 'Stock limité', stockQty: 45, rating: 4.2, reviewCount: 15, vendorSince: '2019', vendorProducts: 12,
  images: [
  { src: "https://images.unsplash.com/photo-1658970870100-b926cb232e3e", alt: 'Épis de maïs jaune doré séchés au soleil' },
  { src: "https://images.unsplash.com/photo-1673694800551-b84c5e7d2933", alt: 'Grains de maïs jaune dans un bol en bois' }],

  reviews: [
  { author: 'Alain T.', rating: 4, date: '1 juil. 2025', comment: 'Bon maïs, bien séché. Parfait pour la farine.' }]

},
{
  id: 4, name: 'Savon Artisanal', vendor: 'Saveurs du Kongo', vendorType: 'Entreprise', vendorPhone: '+243 82 345 6789', vendorEmail: 'info@saveurskongo.cd', vendorCity: 'Boma', vendorVerified: true, price: '3,500 FC', unit: '/ Pièce', category: 'Mode & Beauté', city: 'Boma',
  image: "https://images.unsplash.com/photo-1612799897476-e6e6e663f337", alt: 'Savons artisanaux aux huiles naturelles empilés avec fleurs séchées, savonnerie artisanale',
  description: 'Savon artisanal fabriqué à la main avec des huiles naturelles locales (palme, coco, karité). Sans sulfates ni parabènes. Convient aux peaux sensibles. Parfum naturel aux plantes.',
  stock: 'En stock', stockQty: 320, rating: 4.8, reviewCount: 52, vendorSince: '2017', vendorProducts: 8,
  images: [
  { src: "https://images.unsplash.com/photo-1612799897476-e6e6e663f337", alt: 'Savons artisanaux empilés avec fleurs séchées' },
  { src: "https://images.unsplash.com/photo-1605264965122-e8471bed733c", alt: 'Savon naturel avec ingrédients botaniques' }],

  reviews: [
  { author: 'Nadège F.', rating: 5, date: '15 juin 2025', comment: 'Savon magnifique, sent très bon et mousse bien. Ma peau adore !' },
  { author: 'Christelle M.', rating: 5, date: '2 juin 2025', comment: 'Qualité exceptionnelle. Je ne veux plus d\'autre savon.' },
  { author: 'Didier K.', rating: 4, date: '20 mai 2025', comment: 'Très bon produit, livraison rapide.' }]

},
{
  id: 5, name: 'Miel Naturel', vendor: 'Kongo Agro SARL', vendorType: 'Entreprise', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '7,000 FC', unit: '/ Pot', category: 'Agriculture', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b9932d16-1772872383455.png", alt: 'Pot de miel naturel doré avec rayon de miel, apiculture congolaise traditionnelle',
  description: 'Miel pur de forêt tropicale, récolté par des apiculteurs locaux. Non pasteurisé, non filtré pour conserver tous ses bienfaits naturels. Goût floral intense avec des notes boisées.',
  stock: 'En stock', stockQty: 90, rating: 4.9, reviewCount: 61, vendorSince: '2019', vendorProducts: 12,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1bd4d46c0-1766748178463.png", alt: 'Pot de miel naturel doré avec rayon de miel' },
  { src: "https://images.unsplash.com/photo-1630942233538-4e21d78a8622", alt: 'Ruche en bois dans une forêt tropicale verte' }],

  reviews: [
  { author: 'Sophie A.', rating: 5, date: '10 juil. 2025', comment: 'Miel incroyable, goût unique. Rien à voir avec le miel industriel.' },
  { author: 'Emmanuel D.', rating: 5, date: '28 juin 2025', comment: 'Pur et naturel. Je recommande vivement !' }]

},
{
  id: 6, name: 'Riz Local', vendor: 'Saveurs du Kongo', vendorType: 'Entreprise', vendorPhone: '+243 82 345 6789', vendorEmail: 'info@saveurskongo.cd', vendorCity: 'Boma', vendorVerified: true, price: '6,000 FC', unit: '/ Kg', category: 'Agroalimentaire', city: 'Boma',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_136eca2eb-1784370700193.png", alt: 'Riz blanc local dans un bol en bois sur fond sombre, céréale cultivée localement en RDC',
  description: 'Riz blanc cultivé localement dans les plaines de la province du Kongo Central. Grain long, texture ferme après cuisson. Sans OGM, sans pesticides chimiques.',
  stock: 'En stock', stockQty: 500, rating: 4.3, reviewCount: 29, vendorSince: '2017', vendorProducts: 8,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_17814ecf6-1784370699737.png", alt: 'Riz blanc local dans un bol en bois' }],

  reviews: [
  { author: 'Bernadette N.', rating: 4, date: '5 juil. 2025', comment: 'Bon riz, cuit bien. Bon rapport qualité-prix.' }]

},
{
  id: 7, name: 'Panneaux Solaires 300W', vendor: 'Green Energie', vendorType: 'Entreprise', vendorPhone: '+243 89 456 7890', vendorEmail: 'info@greenenergie.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '450,000 FC', unit: '/ Unité', category: 'Énergie', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png", alt: 'Panneau solaire photovoltaïque bleu sur fond ciel africain, énergie renouvelable au Congo',
  description: 'Panneau solaire monocristallin 300W haute performance. Rendement 21%, résistant aux intempéries (IP67). Garantie 10 ans fabricant. Idéal pour usage résidentiel et commercial en RDC.',
  stock: 'Stock limité', stockQty: 15, rating: 4.6, reviewCount: 18, vendorSince: '2020', vendorProducts: 6,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1b937a421-1773093286076.png", alt: 'Panneau solaire photovoltaïque bleu sur fond ciel africain' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_188d0b4c9-1779362425586.png", alt: 'Installation de panneaux solaires sur toit de maison' }],

  reviews: [
  { author: 'Théodore M.', rating: 5, date: '22 juin 2025', comment: 'Excellent panneau, installation facile. Très satisfait du rendement.' },
  { author: 'Gisèle K.', rating: 4, date: '10 juin 2025', comment: 'Bonne qualité, livraison dans les délais.' }]

},
{
  id: 8, name: 'Ciment Portland 50kg', vendor: 'EcoBuild SARL', vendorType: 'Entreprise', vendorPhone: '+243 84 567 8901', vendorEmail: 'contact@ecobuild.cd', vendorCity: 'Matadi', vendorVerified: false, price: '18,000 FC', unit: '/ Sac', category: 'BTP & Matériaux', city: 'Matadi',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3a5dfb7-1772551496700.png", alt: 'Sacs de ciment empilés sur chantier de construction, matériaux de construction congolais',
  description: 'Ciment Portland CEM II 42.5R, sac de 50 kg. Haute résistance initiale, idéal pour fondations, dalles et maçonnerie. Conforme aux normes congolaises de construction.',
  stock: 'En stock', stockQty: 1200, rating: 4.1, reviewCount: 33, vendorSince: '2016', vendorProducts: 15,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_13de156d2-1772741976528.png", alt: 'Sacs de ciment empilés sur chantier de construction' }],

  reviews: [
  { author: 'Augustin B.', rating: 4, date: '18 juil. 2025', comment: 'Ciment de bonne qualité, prise rapide. Bon pour les travaux.' }]

},
{
  id: 9, name: 'Poulet de Ferme', vendor: 'Kongo Agro SARL', vendorType: 'Entreprise', vendorPhone: '+243 81 234 5678', vendorEmail: 'contact@kongoagro.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '12,000 FC', unit: '/ Kg', category: 'Élevage', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png", alt: 'Poulet de ferme bien nourri dans une ferme avicole africaine, élevage traditionnel congolais',
  description: 'Poulet fermier élevé en plein air, nourri aux céréales locales sans hormones ni antibiotiques. Chair ferme et savoureuse. Disponible entier ou en morceaux selon commande.',
  stock: 'En stock', stockQty: 60, rating: 4.4, reviewCount: 27, vendorSince: '2019', vendorProducts: 12,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1ff16ffa0-1773206697563.png", alt: 'Poulet de ferme bien nourri dans une ferme avicole africaine' }],

  reviews: [
  { author: 'Véronique M.', rating: 5, date: '14 juil. 2025', comment: 'Poulet délicieux, goût authentique. Bien meilleur que le poulet industriel.' }]

},
{
  id: 10, name: 'Smartphone Réparation', vendor: 'TechKongo Solutions', vendorType: 'Entreprise', vendorPhone: '+243 85 678 9012', vendorEmail: 'support@techkongo.cd', vendorCity: 'Kinshasa', vendorVerified: true, price: '25,000 FC', unit: '/ Service', category: 'Technologie', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1754a7a72-1764760492454.png", alt: 'Technicien réparant smartphone avec outils de précision, service technologique congolais',
  description: 'Service de réparation de smartphones toutes marques (Samsung, iPhone, Tecno, Infinix…). Remplacement d\'écran, batterie, connecteur de charge. Diagnostic gratuit. Garantie 3 mois sur les réparations.',
  stock: 'En stock', stockQty: 999, rating: 4.7, reviewCount: 44, vendorSince: '2021', vendorProducts: 5,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1fe7f5850-1772260058846.png", alt: 'Technicien réparant smartphone avec outils de précision' }],

  reviews: [
  { author: 'Franck O.', rating: 5, date: '9 juil. 2025', comment: 'Réparation rapide et soignée. Mon téléphone est comme neuf !' },
  { author: 'Isabelle N.', rating: 4, date: '30 juin 2025', comment: 'Bon service, technicien compétent. Je recommande.' }]

},
{
  id: 11, name: 'Tomates Fraîches', vendor: 'Saveurs du Kongo', vendorType: 'Entreprise', vendorPhone: '+243 82 345 6789', vendorEmail: 'info@saveurskongo.cd', vendorCity: 'Boma', vendorVerified: true, price: '4,000 FC', unit: '/ Kg', category: 'Agriculture', city: 'Boma',
  image: "https://images.unsplash.com/photo-1536250370089-ff04e7a123fc", alt: 'Tomates fraîches rouges brillantes sur fond sombre, légumes frais du jardin congolais',
  description: 'Tomates fraîches cultivées sans pesticides dans les jardins maraîchers de Boma. Récoltées à maturité, riches en lycopène. Idéales pour sauces, salades et plats traditionnels.',
  stock: 'Stock limité', stockQty: 30, rating: 4.3, reviewCount: 19, vendorSince: '2017', vendorProducts: 8,
  images: [
  { src: "https://images.unsplash.com/photo-1667986968934-bf1fd9db241f", alt: 'Tomates fraîches rouges brillantes sur fond sombre' }],

  reviews: [
  { author: 'Lucie M.', rating: 4, date: '16 juil. 2025', comment: 'Tomates bien mûres et savoureuses. Parfaites pour la sauce.' }]

},
{
  id: 12, name: 'Tissu Wax Africain', vendor: 'Mode Congo', vendorType: 'Entreprise', vendorPhone: '+243 86 789 0123', vendorEmail: 'contact@modecongo.cd', vendorCity: 'Kinshasa', vendorVerified: false, price: '35,000 FC', unit: '/ Mètre', category: 'Mode & Beauté', city: 'Kinshasa',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png", alt: 'Tissu wax africain coloré avec motifs géométriques traditionnels, textile africain authentique',
  description: 'Tissu wax 100% coton, imprimé en Afrique de l\'Ouest. Motifs géométriques et floraux traditionnels. Largeur 115 cm. Disponible en plusieurs coloris. Idéal pour confection de vêtements traditionnels.',
  stock: 'En stock', stockQty: 200, rating: 4.6, reviewCount: 35, vendorSince: '2018', vendorProducts: 20,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_13b6e2cb6-1765354968164.png", alt: 'Tissu wax africain coloré avec motifs géométriques traditionnels' }],

  reviews: [
  { author: 'Angélique D.', rating: 5, date: '11 juil. 2025', comment: 'Tissu magnifique, couleurs vives et résistantes. Très belle qualité.' },
  { author: 'Serge M.', rating: 4, date: '5 juil. 2025', comment: 'Bon tissu, conforme aux photos. Livraison rapide.' }]

}];


// ─── Seller Profile Modal ─────────────────────────────────────────────────────

interface SellerProfile {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  verified: boolean;
  category: string;
}

function SellerProfileModal({ seller, onClose, onContact }: {seller: SellerProfile;onClose: () => void;onContact: () => void;}) {
  const initials = seller.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-extrabold text-foreground">Profil du vendeur</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-lg font-extrabold text-primary">{initials}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base font-extrabold text-foreground">{seller.name}</h3>
                {seller.verified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{seller.type}</p>
              {seller.verified &&
              <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">✓ Vérifié</span>
              }
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <MapPinIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Localisation</p>
                <p className="text-sm font-semibold text-foreground">{seller.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <BuildingOfficeIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Secteur</p>
                <p className="text-sm font-semibold text-foreground">{seller.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <PhoneIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Téléphone</p>
                <p className="text-sm font-semibold text-foreground">{seller.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <EnvelopeIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">Email</p>
                <p className="text-sm font-semibold text-foreground">{seller.email}</p>
              </div>
            </div>
          </div>
          <button onClick={() => onContact()} className="w-full mt-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Contacter le vendeur
          </button>
        </div>
      </div>
    </div>);

}

// ─── Order / Reserve Modal ────────────────────────────────────────────────────

interface OrderProduct {
  id: number;
  name: string;
  price: string;
  unit: string;
  vendor: string;
}

function OrderModal({ product, mode, onClose }: {product: OrderProduct;mode: 'reserve' | 'order';onClose: () => void;}) {
  const [quantity, setQuantity] = useState('1');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-extrabold text-foreground">
            {mode === 'reserve' ? '📅 Réserver ce produit' : '🛒 Commander ce produit'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
        {submitted ?
        <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-full bg-green-400/15 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">{mode === 'reserve' ? '📅' : '✅'}</span>
            </div>
            <h3 className="text-base font-extrabold text-foreground mb-1">
              {mode === 'reserve' ? 'Réservation envoyée !' : 'Commande envoyée !'}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {mode === 'reserve' ? 'Le vendeur vous contactera pour confirmer la réservation.' : 'Le vendeur a reçu votre commande et vous contactera bientôt.'}
            </p>
            <button onClick={onClose} className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">Fermer</button>
          </div> :

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-0.5">Produit</p>
              <p className="text-sm font-bold text-foreground">{product.name}</p>
              <p className="text-xs text-primary font-semibold mt-0.5">{product.price} {product.unit}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Vendeur : {product.vendor}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Quantité</label>
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Note (optionnel)</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={mode === 'reserve' ? 'Date souhaitée, conditions...' : 'Instructions de livraison, précisions...'} rows={3} className="bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/60 transition-colors resize-none" />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">Annuler</button>
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
                {mode === 'reserve' ? 'Réserver' : 'Commander'}
              </button>
            </div>
          </form>
        }
      </div>
    </div>);

}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, size = 'sm' }: {rating: number;size?: 'sm' | 'md';}) {
  const sz = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) =>
      <StarSolid key={s} className={`${sz} ${s <= Math.round(rating) ? 'text-amber-400' : 'text-muted-foreground/30'}`} />
      )}
    </div>);

}

// ─── Product Detail Modal ─────────────────────────────────────────────────────

function ProductDetailModal({
  product,
  onClose,
  onOrder,
  onReserve,
  onViewSeller






}: {product: Product;onClose: () => void;onOrder: () => void;onReserve: () => void;onViewSeller: () => void;}) {
  const [activeImg, setActiveImg] = useState(0);
  const images = product.images && product.images.length > 0 ? product.images : [{ src: product.image, alt: product.alt }];
  const initials = product.vendor.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const stockColor =
  product.stock === 'En stock' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
  product.stock === 'Stock limité' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20';

  const stockDot =
  product.stock === 'En stock' ? 'bg-green-400' :
  product.stock === 'Stock limité' ? 'bg-amber-400' : 'bg-red-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-black/70"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 border-b border-border bg-card/95 backdrop-blur-sm">
          <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Retour au marketplace
          </button>
          <span className="badge-gold text-[10px]">{product.category}</span>
        </div>

        <div className="p-5 space-y-5">
          {/* Image gallery */}
          <div className="space-y-2">
            <div className="relative h-56 sm:h-72 rounded-xl overflow-hidden bg-secondary">
              <AppImage
                src={images[activeImg]?.src}
                alt={images[activeImg]?.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 672px" />
              
              {images.length > 1 &&
              <>
                  <button
                  onClick={() => setActiveImg((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                  <button
                  onClick={() => setActiveImg((prev) => (prev + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
                  
                    <ChevronRightIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) =>
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImg ? 'bg-white w-4' : 'bg-white/50'}`} />
                  )}
                  </div>
                </>
              }
            </div>
            {images.length > 1 &&
            <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) =>
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${i === activeImg ? 'border-primary' : 'border-border hover:border-primary/40'}`}>
                
                    <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="56px" />
                  </button>
              )}
              </div>
            }
          </div>

          {/* Title + price + stock */}
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-tight mb-2">{product.name}</h1>
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-primary">{product.price}</span>
                <span className="text-sm text-muted-foreground">{product.unit}</span>
              </div>
              {product.stock &&
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${stockColor}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stockDot}`} />
                  {product.stock}
                  {product.stock === 'Stock limité' && product.stockQty &&
                <span className="opacity-70">({product.stockQty} restants)</span>
                }
                </span>
              }
            </div>
            {/* Rating summary */}
            {product.rating &&
            <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size="md" />
                <span className="text-sm font-bold text-foreground">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount} avis)</span>
              </div>
            }
          </div>

          {/* Description */}
          {product.description &&
          <div>
              <h2 className="text-sm font-extrabold text-foreground mb-2 uppercase tracking-wide">Description</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          }

          {/* Guarantees */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2.5 p-3 bg-secondary rounded-xl">
              <TruckIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Livraison</p>
                <p className="text-xs font-bold text-foreground">Disponible</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-secondary rounded-xl">
              <ShieldCheckIcon className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">Garantie</p>
                <p className="text-xs font-bold text-foreground">Qualité assurée</p>
              </div>
            </div>
          </div>

          {/* Vendor profile */}
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-secondary/50">
              <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Vendeur</h2>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-base font-extrabold text-primary">{initials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-extrabold text-foreground truncate">{product.vendor}</span>
                    {product.vendorVerified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{product.vendorType}</p>
                </div>
                {product.vendorVerified &&
                <span className="shrink-0 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">✓ Vérifié</span>
                }
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 bg-secondary rounded-lg">
                  <p className="text-sm font-extrabold text-foreground">{product.vendorSince || '—'}</p>
                  <p className="text-[10px] text-muted-foreground">Depuis</p>
                </div>
                <div className="text-center p-2 bg-secondary rounded-lg">
                  <p className="text-sm font-extrabold text-foreground">{product.vendorProducts || '—'}</p>
                  <p className="text-[10px] text-muted-foreground">Produits</p>
                </div>
                <div className="text-center p-2 bg-secondary rounded-lg">
                  <MapPinIcon className="w-3.5 h-3.5 text-primary mx-auto mb-0.5" />
                  <p className="text-[10px] text-muted-foreground">{product.vendorCity}</p>
                </div>
              </div>
              <button
                onClick={onViewSeller}
                className="w-full py-2 rounded-lg border border-primary/40 text-primary text-xs font-bold hover:bg-primary/10 transition-colors">
                
                Voir le profil complet
              </button>
            </div>
          </div>

          {/* Reviews */}
          {product.reviews && product.reviews.length > 0 &&
          <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wide">Avis clients</h2>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.rating || 0} />
                  <span className="text-xs text-muted-foreground">{product.reviewCount} avis</span>
                </div>
              </div>
              <div className="space-y-3">
                {product.reviews.map((review, idx) =>
              <div key={idx} className="p-3.5 bg-secondary rounded-xl">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <p className="text-xs font-bold text-foreground">{review.author}</p>
                        <p className="text-[10px] text-muted-foreground">{review.date}</p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{review.comment}</p>
                  </div>
              )}
              </div>
            </div>
          }

          {/* CTA buttons */}
          <div className="flex gap-3 pt-1 pb-1">
            <button
              onClick={onReserve}
              disabled={product.stock === 'Rupture de stock'}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/40 text-primary text-sm font-bold hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              
              <CalendarDaysIcon className="w-4 h-4" />
              Réserver
            </button>
            <button
              onClick={onOrder}
              disabled={product.stock === 'Rupture de stock'}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              
              <ShoppingCartIcon className="w-4 h-4" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>);

}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketplaceContent() {
  const { isLoggedIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Toutes catégories');
  const [selectedCity, setSelectedCity] = useState('Toutes les villes');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sellerModal, setSellerModal] = useState<SellerProfile | null>(null);
  const [orderModal, setOrderModal] = useState<{product: OrderProduct;mode: 'reserve' | 'order';} | null>(null);
  const [authGuard, setAuthGuard] = useState<'order' | 'reserve' | 'message' | 'contact' | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const handleProtectedAction = (action: 'order' | 'reserve' | 'message' | 'contact', fn: () => void) => {
    if (!isLoggedIn) {
      setAuthGuard(action);
    } else {
      fn();
    }
  };

  const filtered = allProducts?.filter((p) => {
    const matchCat = selectedCategory === 'Toutes catégories' || p?.category === selectedCategory;
    const matchCity = selectedCity === 'Toutes les villes' || p?.city === selectedCity;
    const matchSearch = !searchQuery || p?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || p?.vendor?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Marketplace</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Catégories</h3>
            </div>
            <div className="p-2">
              {allCategories?.map((cat) =>
              <button
                key={cat?.label}
                onClick={() => setSelectedCategory(cat?.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCategory === cat?.label ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`
                }>
                
                  <span>{cat?.label}</span>
                  {cat?.count > 0 &&
                <span className={`text-[11px] ${selectedCategory === cat?.label ? 'text-primary' : 'text-muted-foreground'}`}>{cat?.count}</span>
                }
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">Localisation</h3>
            </div>
            <div className="p-2">
              {allCities?.map((city) =>
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                selectedCity === city ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`
                }>
                
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{city}</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search + filter bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2.5">
              <MagnifyingGlassIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder-muted-foreground outline-none" />
              
              {searchQuery &&
              <button onClick={() => setSearchQuery('')}>
                  <XMarkIcon className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              }
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e?.target?.value)}
              className="hidden sm:block bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground outline-none cursor-pointer">
              
              {allCities?.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold">
              
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filtrer
            </button>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen &&
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60" onClick={() => setSidebarOpen(false)}>
              <div className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border p-4 overflow-y-auto" onClick={(e) => e?.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Filtres</h3>
                  <button onClick={() => setSidebarOpen(false)}>
                    <XMarkIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Catégories</h4>
                  {allCategories?.map((cat) =>
                <button
                  key={cat?.label}
                  onClick={() => {setSelectedCategory(cat?.label);setSidebarOpen(false);}}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-1 transition-all ${selectedCategory === cat?.label ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary'}`}>
                  
                      <span>{cat?.label}</span>
                      {cat?.count > 0 && <span className="text-[11px]">{cat?.count}</span>}
                    </button>
                )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Villes</h4>
                  {allCities?.map((city) =>
                <button
                  key={city}
                  onClick={() => {setSelectedCity(city);setSidebarOpen(false);}}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-all ${selectedCity === city ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary'}`}>
                  
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{city}</span>
                    </button>
                )}
                </div>
              </div>
            </div>
          }

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">{filtered?.length}</span> produits trouvés
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedCategory !== 'Toutes catégories' &&
              <span className="badge-gold cursor-pointer" onClick={() => setSelectedCategory('Toutes catégories')}>
                  {selectedCategory} ×
                </span>
              }
            </div>
          </div>

          {/* Products grid */}
          {filtered?.length === 0 ?
          <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-semibold mb-2">Aucun produit trouvé</p>
              <p className="text-sm">Essayez de modifier vos filtres</p>
            </div> :

          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered?.map((product) =>
            <div key={product?.id} className="product-card flex flex-col">
                  {/* Image — click opens detail */}
                  <button
                className="relative h-36 overflow-hidden w-full text-left"
                onClick={() => setDetailProduct(product)}>
                
                    <AppImage
                  src={product?.image}
                  alt={product?.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 25vw" />
                
                    <div className="absolute top-2 right-2">
                      <span className="badge-gold text-[10px]">{product?.category}</span>
                    </div>
                    {/* Stock badge */}
                    {product.stock === 'Stock limité' &&
                <div className="absolute bottom-2 left-2">
                        <span className="px-1.5 py-0.5 bg-amber-400/90 text-black text-[9px] font-bold rounded">Stock limité</span>
                      </div>
                }
                    {product.stock === 'Rupture de stock' &&
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-2 py-1 bg-red-500/90 text-white text-[10px] font-bold rounded">Rupture de stock</span>
                      </div>
                }
                  </button>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    {/* Product name — click opens detail */}
                    <button
                  onClick={() => setDetailProduct(product)}
                  className="text-sm font-bold text-foreground leading-tight mb-1 line-clamp-2 text-left hover:text-primary transition-colors">
                  
                      {product?.name}
                    </button>

                    {/* Rating */}
                    {product.rating &&
                <div className="flex items-center gap-1 mb-1.5">
                        <StarRating rating={product.rating} />
                        <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
                      </div>
                }

                    {/* Seller row */}
                    <button
                  onClick={() =>
                  setSellerModal({
                    name: product.vendor,
                    type: product.vendorType,
                    phone: product.vendorPhone,
                    email: product.vendorEmail,
                    city: product.vendorCity,
                    verified: product.vendorVerified,
                    category: product.category
                  })
                  }
                  className="flex items-center gap-1 mb-1.5 group/seller w-full text-left">
                  
                      <CheckBadgeIcon className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-[11px] text-muted-foreground group-hover/seller:text-primary transition-colors font-medium underline-offset-2 group-hover/seller:underline truncate">
                        {product?.vendor}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 mb-3">
                      <MapPinIcon className="w-3 h-3 text-muted-foreground" />
                      <p className="text-[11px] text-muted-foreground">{product?.city}</p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-sm font-extrabold text-primary">{product?.price}</span>
                      <span className="text-[10px] text-muted-foreground">{product?.unit}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5 mt-auto">
                      <button
                    onClick={() =>
                    handleProtectedAction('reserve', () =>
                    setOrderModal({
                      product: { id: product.id, name: product.name, price: product.price, unit: product.unit, vendor: product.vendor },
                      mode: 'reserve'
                    })
                    )
                    }
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-primary/40 text-primary text-[11px] font-semibold hover:bg-primary/10 transition-colors">
                    
                        <CalendarDaysIcon className="w-3 h-3" />
                        Réserver
                      </button>
                      <button
                    onClick={() =>
                    handleProtectedAction('order', () =>
                    setOrderModal({
                      product: { id: product.id, name: product.name, price: product.price, unit: product.unit, vendor: product.vendor },
                      mode: 'order'
                    })
                    )
                    }
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors">
                    
                        <ShoppingCartIcon className="w-3 h-3" />
                        Commander
                      </button>
                    </div>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>

      {/* Product detail modal */}
      {detailProduct &&
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onOrder={() =>
        handleProtectedAction('order', () => {
          setOrderModal({
            product: { id: detailProduct.id, name: detailProduct.name, price: detailProduct.price, unit: detailProduct.unit, vendor: detailProduct.vendor },
            mode: 'order'
          });
          setDetailProduct(null);
        })
        }
        onReserve={() =>
        handleProtectedAction('reserve', () => {
          setOrderModal({
            product: { id: detailProduct.id, name: detailProduct.name, price: detailProduct.price, unit: detailProduct.unit, vendor: detailProduct.vendor },
            mode: 'reserve'
          });
          setDetailProduct(null);
        })
        }
        onViewSeller={() => {
          setSellerModal({
            name: detailProduct.vendor,
            type: detailProduct.vendorType,
            phone: detailProduct.vendorPhone,
            email: detailProduct.vendorEmail,
            city: detailProduct.vendorCity,
            verified: detailProduct.vendorVerified,
            category: detailProduct.category
          });
          setDetailProduct(null);
        }} />

      }

      {/* Seller profile modal */}
      {sellerModal &&
      <SellerProfileModal
        seller={sellerModal}
        onClose={() => setSellerModal(null)}
        onContact={() => handleProtectedAction('contact', () => setSellerModal(null))} />

      }

      {/* Order / Reserve modal */}
      {orderModal &&
      <OrderModal
        product={orderModal.product}
        mode={orderModal.mode}
        onClose={() => setOrderModal(null)} />

      }

      {/* Auth guard modal */}
      {authGuard &&
      <AuthGuardModal action={authGuard} onClose={() => setAuthGuard(null)} />
      }
    </div>);

}