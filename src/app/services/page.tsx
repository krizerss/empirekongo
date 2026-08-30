'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';

import { MagnifyingGlassIcon, MapPinIcon, AdjustmentsHorizontalIcon, XMarkIcon, BriefcaseIcon, ClockIcon, CurrencyDollarIcon, FunnelIcon, BookmarkIcon, ArrowTopRightOnSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, StarIcon as StarSolid } from '@heroicons/react/24/solid';

type ServiceType = 'Tous' | 'Freelance' | 'Agence' | 'Consultant' | 'Technicien';
type JobType = 'CDI' | 'CDD' | 'Freelance' | 'Stage';

interface ServiceProvider {
  id: number;
  name: string;
  avatar: string;
  avatarAlt: string;
  type: ServiceType;
  specialty: string;
  skills: string[];
  city: string;
  rating: number;
  reviews: number;
  projects: number;
  rate: string;
  availability: 'Disponible' | 'Occupé' | 'Sur demande';
  verified: boolean;
  bio: string;
  responseTime: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  companyInitials: string;
  location: string;
  type: JobType;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  verified: boolean;
  urgent: boolean;
}

const providers: ServiceProvider[] = [
{
  id: 1, name: 'Jean-Baptiste Mukendi', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_19755ce44-1763292726380.png", avatarAlt: 'Portrait professionnel de Jean-Baptiste Mukendi, développeur web congolais',
  type: 'Freelance', specialty: 'Développement Web & Mobile', skills: ['React', 'Node.js', 'Flutter', 'UI/UX'],
  city: 'Kinshasa', rating: 4.9, reviews: 87, projects: 134, rate: '50,000 FC/j', availability: 'Disponible', verified: true,
  bio: 'Développeur full-stack avec 6 ans d\'expérience. Spécialisé dans les applications web et mobiles pour les entreprises africaines.',
  responseTime: '< 2h'
},
{
  id: 2, name: 'Agence DigitalKongo', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_138270a8f-1787646508290.png", avatarAlt: 'Logo Agence DigitalKongo, agence de communication digitale',
  type: 'Agence', specialty: 'Marketing Digital & Communication', skills: ['SEO', 'Social Media', 'Branding', 'Publicité'],
  city: 'Kinshasa', rating: 4.7, reviews: 203, projects: 89, rate: '200,000 FC/projet', availability: 'Disponible', verified: true,
  bio: 'Agence de communication digitale leader en RDC. Nous aidons les entreprises à développer leur présence en ligne et à atteindre leurs clients.',
  responseTime: '< 4h'
},
{
  id: 3, name: 'Dr. Amina Kabila', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_173d0deb6-1763295848580.png", avatarAlt: 'Portrait professionnel de Dr. Amina Kabila, consultante en stratégie',
  type: 'Consultant', specialty: 'Stratégie d\'Entreprise & Finance', skills: ['Business Plan', 'Finance', 'Audit', 'Gestion'],
  city: 'Lubumbashi', rating: 4.8, reviews: 56, projects: 42, rate: '80,000 FC/h', availability: 'Sur demande', verified: true,
  bio: 'Consultante senior avec 12 ans d\'expérience en stratégie d\'entreprise et finance d\'entreprise pour les PME africaines.',
  responseTime: '< 24h'
},
{
  id: 4, name: 'TechRepair Pro', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_152d55c1e-1787646508296.png", avatarAlt: 'Logo TechRepair Pro, service de réparation électronique',
  type: 'Technicien', specialty: 'Réparation Électronique & Informatique', skills: ['Smartphones', 'PC', 'Réseaux', 'CCTV'],
  city: 'Kinshasa', rating: 4.5, reviews: 312, projects: 890, rate: '15,000 FC/intervention', availability: 'Disponible', verified: true,
  bio: 'Service de réparation professionnel pour tous vos appareils électroniques. Intervention rapide à domicile ou en atelier.',
  responseTime: '< 1h'
},
{
  id: 5, name: 'Marie-Claire Lumumba', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_177e50721-1773215914521.png", avatarAlt: 'Portrait professionnel de Marie-Claire Lumumba, graphiste',
  type: 'Freelance', specialty: 'Design Graphique & Identité Visuelle', skills: ['Illustrator', 'Photoshop', 'Figma', 'Branding'],
  city: 'Goma', rating: 4.6, reviews: 145, projects: 267, rate: '30,000 FC/j', availability: 'Occupé', verified: false,
  bio: 'Graphiste créative spécialisée dans l\'identité visuelle et le design de marque pour les entreprises africaines.',
  responseTime: '< 6h'
},
{
  id: 6, name: 'Kongo Legal Partners', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1534062e3-1787646508427.png", avatarAlt: 'Logo Kongo Legal Partners, cabinet juridique',
  type: 'Agence', specialty: 'Conseil Juridique & Conformité', skills: ['Droit des affaires', 'Contrats', 'OHADA', 'Fiscalité'],
  city: 'Kinshasa', rating: 4.9, reviews: 78, projects: 156, rate: '100,000 FC/dossier', availability: 'Disponible', verified: true,
  bio: 'Cabinet juridique spécialisé dans le droit des affaires en RDC et en Afrique centrale. Accompagnement des entreprises locales et internationales.',
  responseTime: '< 12h'
},
{
  id: 7, name: 'Patrick Ngoy', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18891469a-1763296787260.png", avatarAlt: 'Portrait professionnel de Patrick Ngoy, consultant en logistique',
  type: 'Consultant', specialty: 'Logistique & Supply Chain', skills: ['Transport', 'Import/Export', 'Douanes', 'Entrepôts'],
  city: 'Matadi', rating: 4.4, reviews: 34, projects: 67, rate: '60,000 FC/j', availability: 'Disponible', verified: false,
  bio: 'Expert en logistique et chaîne d\'approvisionnement avec 8 ans d\'expérience dans le commerce international en Afrique centrale.',
  responseTime: '< 8h'
},
{
  id: 8, name: 'ElectroPro SARL', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17bd0324b-1787646506869.png", avatarAlt: 'Logo ElectroPro SARL, entreprise d\'électricité',
  type: 'Technicien', specialty: 'Électricité & Installation Solaire', skills: ['Câblage', 'Solaire', 'Groupe électrogène', 'Domotique'],
  city: 'Kinshasa', rating: 4.7, reviews: 189, projects: 445, rate: '25,000 FC/intervention', availability: 'Disponible', verified: true,
  bio: 'Entreprise spécialisée dans l\'installation électrique et les systèmes d\'énergie solaire pour particuliers et entreprises.',
  responseTime: '< 3h'
}];

const jobs: Job[] = [
  {
    id: 1,
    title: 'Développeur Web Full Stack',
    company: 'TechKongo SARL',
    companyInitials: 'TK',
    location: 'Kinshasa, DRC',
    type: 'CDI',
    salary: '800 - 1 200 USD/mois',
    posted: 'Il y a 1j',
    description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe et développer des solutions web innovantes pour le marché congolais.',
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    verified: true,
    urgent: false,
  },
  {
    id: 2,
    title: 'Responsable Commercial Export',
    company: 'Congo Agro Export',
    companyInitials: 'CA',
    location: 'Lubumbashi, DRC',
    type: 'CDI',
    salary: '600 - 900 USD/mois',
    posted: 'Il y a 2j',
    description: 'Poste clé pour développer nos marchés d\'exportation agricole vers l\'Europe et l\'Asie. Expérience en commerce international requise.',
    skills: ['Commerce international', 'Négociation', 'Anglais', 'Français'],
    verified: true,
    urgent: true,
  },
  {
    id: 3,
    title: 'Comptable Senior',
    company: 'Groupe Mutombo',
    companyInitials: 'GM',
    location: 'Kinshasa, DRC',
    type: 'CDI',
    salary: '500 - 700 USD/mois',
    posted: 'Il y a 3j',
    description: 'Gestion de la comptabilité générale, fiscalité et reporting financier pour un groupe d\'entreprises diversifiées.',
    skills: ['OHADA', 'Excel', 'SYSCOHADA', 'Fiscalité'],
    verified: false,
    urgent: false,
  },
  {
    id: 4,
    title: 'Designer UI/UX',
    company: 'StartupKin',
    companyInitials: 'SK',
    location: 'Remote / Kinshasa',
    type: 'Freelance',
    salary: '300 - 600 USD/projet',
    posted: 'Il y a 4j',
    description: 'Mission freelance pour concevoir l\'interface d\'une application mobile de paiement destinée au marché africain.',
    skills: ['Figma', 'UI Design', 'Prototypage', 'Mobile'],
    verified: true,
    urgent: false,
  },
  {
    id: 5,
    title: 'Ingénieur Électricien',
    company: 'BTP Solutions Congo',
    companyInitials: 'BS',
    location: 'Goma, DRC',
    type: 'CDD',
    salary: '450 - 650 USD/mois',
    posted: 'Il y a 5j',
    description: 'Mission de 12 mois pour la supervision des installations électriques sur un chantier de construction résidentiel.',
    skills: ['Électricité BT/HT', 'AutoCAD', 'Gestion chantier'],
    verified: false,
    urgent: true,
  },
];

const availabilityColors = {
  'Disponible': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Occupé': 'text-red-400 bg-red-500/10 border-red-500/20',
  'Sur demande': 'text-amber-400 bg-amber-500/10 border-amber-500/20'
};

const typeIcons: Record<string, string> = {
  Freelance: '👤',
  Agence: '🏢',
  Consultant: '💼',
  Technicien: '🔧'
};

const jobTypeColors: Record<JobType, string> = {
  CDI: 'bg-green-500/10 text-green-400 border-green-500/20',
  CDD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Freelance: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Stage: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const jobTypes: (JobType | 'Tous')[] = ['Tous', 'CDI', 'CDD', 'Freelance', 'Stage'];

function PrestatairesTab() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<ServiceType>('Tous');
  const [filterCity, setFilterCity] = useState('Toutes');
  const [filterAvailability, setFilterAvailability] = useState('Toutes');
  const [showFilters, setShowFilters] = useState(false);

  const types: ServiceType[] = ['Tous', 'Freelance', 'Agence', 'Consultant', 'Technicien'];
  const cities = ['Toutes', 'Kinshasa', 'Lubumbashi', 'Goma', 'Matadi'];
  const availabilities = ['Toutes', 'Disponible', 'Occupé', 'Sur demande'];

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()) || p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchType = activeType === 'Tous' || p.type === activeType;
      const matchCity = filterCity === 'Toutes' || p.city === filterCity;
      const matchAvail = filterAvailability === 'Toutes' || p.availability === filterAvailability;
      return matchSearch && matchType && matchCity && matchAvail;
    });
  }, [search, activeType, filterCity, filterAvailability]);

  return (
    <>
      {/* Type Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {types.map((type) =>
        <button
          key={type}
          onClick={() => setActiveType(type)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
          activeType === type ?
          'bg-primary text-primary-foreground shadow-lg shadow-primary/20' :
          'bg-secondary border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'}`
          }>
            {type !== 'Tous' && <span>{typeIcons[type]}</span>}
            {type}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeType === type ? 'bg-primary-foreground/20' : 'bg-border'}`}>
              {type === 'Tous' ? providers.length : providers.filter((p) => p.type === type).length}
            </span>
          </button>
        )}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters &&
      <div className="mb-6 p-5 bg-card border border-border rounded-2xl flex flex-wrap gap-8">
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Ville</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) =>
            <button key={city} onClick={() => setFilterCity(city)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterCity === city ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  {city}
                </button>
            )}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Disponibilité</p>
            <div className="flex flex-wrap gap-2">
              {availabilities.map((a) =>
            <button key={a} onClick={() => setFilterAvailability(a)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterAvailability === a ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
                  {a}
                </button>
            )}
            </div>
          </div>
        </div>
      }

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-6">{filtered.length} prestataire(s) trouvé(s)</p>

      {/* Provider Cards */}
      {filtered.length === 0 ?
      <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-lg font-bold mb-2">Aucun prestataire trouvé</h3>
          <p className="text-muted-foreground text-sm">Modifiez vos critères de recherche</p>
          <button onClick={() => {setSearch('');setActiveType('Tous');setFilterCity('Toutes');setFilterAvailability('Toutes');}} className="mt-4 text-primary hover:underline text-sm">
            Réinitialiser les filtres
          </button>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) =>
        <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-black/30 group">
              {/* Card Header */}
              <div className="p-5 pb-4">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border">
                      <AppImage src={p.avatar} alt={p.avatarAlt} width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-lg">{typeIcons[p.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="font-bold text-sm truncate">{p.name}</h3>
                      {p.verified && <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-primary font-medium mb-1">{p.specialty}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3" />
                        {p.city}
                      </div>
                      <div className="flex items-center gap-1">
                        <StarSolid className="w-3 h-3 text-yellow-400" />
                        {p.rating} ({p.reviews})
                      </div>
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-1 rounded-full border font-medium ${availabilityColors[p.availability]}`}>
                    {p.availability}
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{p.bio}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.skills.slice(0, 4).map((skill) =>
              <span key={skill} className="text-xs px-2 py-0.5 bg-secondary rounded-md text-muted-foreground">{skill}</span>
              )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="px-5 py-3 border-t border-border grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-foreground">{p.projects}</p>
                  <p className="text-[10px] text-muted-foreground">Projets</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{p.reviews}</p>
                  <p className="text-[10px] text-muted-foreground">Avis</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <ClockIcon className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">{p.responseTime}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Réponse</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">À partir de</p>
                  <p className="text-sm font-extrabold text-primary">{p.rate}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 bg-secondary border border-border rounded-xl text-xs font-medium hover:border-primary/50 transition-colors">
                    Profil
                  </button>
                  <button className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity">
                    Contacter
                  </button>
                </div>
              </div>
            </div>
        )}
        </div>
      }
    </>
  );
}

function EmploiTab() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<JobType | 'Tous'>('Tous');
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0]);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === 'Tous' || j.type === typeFilter;
    return matchSearch && matchType;
  });

  const toggleSave = (id: number) => {
    setSavedJobs((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-foreground mb-1">Offres d'emploi</h2>
          <p className="text-sm text-muted-foreground">Offres d'emploi et opportunités professionnelles en RDC.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
          <PlusIcon className="w-4 h-4" />
          Publier une offre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Offres actives</p>
          <p className="text-2xl font-extrabold text-foreground">347</p>
          <p className="text-xs text-green-400 mt-1">+28 cette semaine</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Entreprises</p>
          <p className="text-2xl font-extrabold text-foreground">89</p>
          <p className="text-xs text-muted-foreground mt-1">Recrutent</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Candidatures</p>
          <p className="text-2xl font-extrabold text-primary">1,204</p>
          <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-2">Mes favoris</p>
          <p className="text-2xl font-extrabold text-foreground">{savedJobs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Sauvegardés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Titre, entreprise, compétence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-secondary border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FunnelIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as JobType | 'Tous')}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            {jobTypes.map((t) => (
              <option key={t} value={t}>{t === 'Tous' ? 'Tous les types' : t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Job list + detail */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`w-full text-left bg-card border rounded-xl p-4 transition-colors hover:border-primary/40 ${
                selectedJob?.id === job.id ? 'border-primary/60 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary">{job.companyInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-bold text-foreground leading-snug">{job.title}</p>
                    {job.urgent && (
                      <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                        URGENT
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.company}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${jobTypeColors[job.type]}`}>
                      {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <MapPinIcon className="w-3 h-3" />
                      {job.location}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <BriefcaseIcon className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Aucune offre trouvée</p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selectedJob ? (
            <div className="bg-card border border-border rounded-xl p-5 sticky top-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-base font-extrabold text-primary">{selectedJob.companyInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-extrabold text-foreground leading-snug">{selectedJob.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">{selectedJob.company}</span>
                        {selectedJob.verified && (
                          <CheckBadgeIcon className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleSave(selectedJob.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        savedJobs.includes(selectedJob.id)
                          ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <BookmarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPinIcon className="w-4 h-4 text-primary/60 shrink-0" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BriefcaseIcon className="w-4 h-4 text-primary/60 shrink-0" />
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${jobTypeColors[selectedJob.type]}`}>
                    {selectedJob.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CurrencyDollarIcon className="w-4 h-4 text-primary/60 shrink-0" />
                  {selectedJob.salary}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ClockIcon className="w-4 h-4 text-primary/60 shrink-0" />
                  {selectedJob.posted}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="mb-5">
                <h3 className="text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Compétences requises</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill} className="text-xs px-3 py-1 rounded-full bg-secondary border border-border text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                  Postuler maintenant
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                  Voir l'entreprise
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-10 text-center">
              <BriefcaseIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Sélectionnez une offre pour voir les détails</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type MainTab = 'prestataires' | 'emploi';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<MainTab>('prestataires');
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0D1A2A] via-[#0D0D0D] to-[#1A1A1A] border-b border-border py-14 px-4">
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 badge-gold mb-4">
                <BriefcaseIcon className="w-3.5 h-3.5" />
                <span>Services & Emploi</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
                {activeTab === 'prestataires' ? (
                  <>Trouvez le bon <span className="gold-text">Prestataire</span></>
                ) : (
                  <>Trouvez votre <span className="gold-text">Emploi</span></>
                )}
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                {activeTab === 'prestataires'
                  ? `${providers.length} prestataires vérifiés — Freelances, Agences, Consultants & Techniciens`
                  : `${jobs.length} offres d'emploi actives — CDI, CDD, Freelance & Stages en RDC`}
              </p>
            </div>

            {/* Search */}
            {activeTab === 'prestataires' && (
              <div className="max-w-2xl mx-auto relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Développeur, designer, consultant, technicien..."
                  className="w-full pl-12 pr-4 py-4 bg-secondary border border-border rounded-2xl text-sm focus:outline-none focus:border-primary transition-colors" />
                {search &&
                  <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                }
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Main Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab('prestataires')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === 'prestataires' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🔧</span>
              Prestataires
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'prestataires' ? 'bg-primary/20 text-primary' : 'bg-border text-muted-foreground'}`}>
                {providers.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('emploi')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === 'emploi' ?'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <BriefcaseIcon className="w-4 h-4" />
              Emploi
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'emploi' ? 'bg-primary/20 text-primary' : 'bg-border text-muted-foreground'}`}>
                {jobs.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'prestataires' ? <PrestatairesTab /> : <EmploiTab />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
