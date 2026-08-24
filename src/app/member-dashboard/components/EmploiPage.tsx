'use client';
import React, { useState } from 'react';
import { MagnifyingGlassIcon, BriefcaseIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, FunnelIcon, BookmarkIcon, ArrowTopRightOnSquareIcon, PlusIcon, CheckBadgeIcon,  } from '@heroicons/react/24/outline';

type JobType = 'CDI' | 'CDD' | 'Freelance' | 'Stage';

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

const typeColors: Record<JobType, string> = {
  CDI: 'bg-green-500/10 text-green-400 border-green-500/20',
  CDD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Freelance: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Stage: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const jobTypes: (JobType | 'Tous')[] = ['Tous', 'CDI', 'CDD', 'Freelance', 'Stage'];

export default function EmploiPage() {
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
          <h1 className="text-xl font-extrabold text-foreground mb-1">Emploi</h1>
          <p className="text-sm text-muted-foreground">Offres d'emploi et opportunités professionnelles en RDC.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0">
          <PlusIcon className="w-4 h-4" />
          Publier une offre
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Offres actives</p>
          <p className="text-2xl font-extrabold text-foreground">347</p>
          <p className="text-xs text-green-400 mt-1">+28 cette semaine</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Entreprises</p>
          <p className="text-2xl font-extrabold text-foreground">89</p>
          <p className="text-xs text-muted-foreground mt-1">Recrutent</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Candidatures</p>
          <p className="text-2xl font-extrabold text-primary">1,204</p>
          <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
        </div>
        <div className="stat-card">
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
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${typeColors[job.type]}`}>
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
                          ? 'bg-primary/10 border-primary/30 text-primary' :'border-border text-muted-foreground hover:text-foreground'
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
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${typeColors[selectedJob.type]}`}>
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
