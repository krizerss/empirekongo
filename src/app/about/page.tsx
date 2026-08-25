'use client';
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppImage from '@/components/ui/AppImage';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import {
  CheckBadgeIcon,
  GlobeAltIcon,
  UsersIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  HeartIcon,
  TrophyIcon,
  ArrowRightIcon } from
'@heroicons/react/24/outline';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  avatarAlt: string;
  bio: string;
  linkedin?: string;
}

const team: TeamMember[] = [
{
  name: 'Emmanuel Kongo', role: 'Fondateur & CEO', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a79b8e72-1763295320816.png", avatarAlt: 'Portrait professionnel Emmanuel Kongo, fondateur EmpireKongo',
  bio: 'Entrepreneur visionnaire avec 15 ans d\'expérience dans le commerce africain. Passionné par la transformation digitale de l\'économie congolaise.'
},
{
  name: 'Amina Diallo', role: 'Directrice des Opérations', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1da2046d3-1763298640049.png", avatarAlt: 'Portrait professionnel Amina Diallo, directrice des opérations EmpireKongo',
  bio: 'Experte en gestion des opérations et en développement de partenariats stratégiques en Afrique centrale et de l\'ouest.'
},
{
  name: 'Patrick Mbeki', role: 'Directeur Technique', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1276dced3-1763296874694.png", avatarAlt: 'Portrait professionnel Patrick Mbeki, directeur technique EmpireKongo',
  bio: 'Ingénieur logiciel senior spécialisé dans les plateformes e-commerce et les solutions de paiement mobile pour les marchés africains.'
},
{
  name: 'Cécile Nzinga', role: 'Directrice Marketing', avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1da2046d3-1763298640049.png", avatarAlt: 'Portrait professionnel Cécile Nzinga, directrice marketing EmpireKongo',
  bio: 'Spécialiste en marketing digital et en stratégie de croissance pour les marchés émergents africains.'
}];


const values = [
{ icon: ShieldCheckIcon, title: 'Confiance & Sécurité', description: 'Chaque fournisseur est vérifié. Chaque transaction est sécurisée. Votre confiance est notre priorité absolue.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
{ icon: GlobeAltIcon, title: 'Ancrage Africain', description: 'Conçu pour l\'Afrique, par des Africains. Nous comprenons les réalités locales et construisons des solutions adaptées.', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
{ icon: LightBulbIcon, title: 'Innovation Continue', description: 'Nous repoussons constamment les limites pour offrir des outils modernes qui transforment le commerce africain.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
{ icon: UsersIcon, title: 'Communauté d\'Abord', description: 'EmpireKongo est une communauté avant tout. Chaque membre contribue à la croissance collective de l\'écosystème.', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
{ icon: HeartIcon, title: 'Impact Social', description: 'Nous créons des opportunités économiques pour les entrepreneurs, artisans et PME à travers toute la RDC.', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
{ icon: TrophyIcon, title: 'Excellence', description: 'Nous visons l\'excellence dans chaque produit, chaque service et chaque interaction avec notre communauté.', color: 'text-primary', bg: 'bg-primary/10 border-primary/20' }];


const stats = [
{ value: '12,000+', label: 'Membres actifs', icon: '👥' },
{ value: '520+', label: 'Produits listés', icon: '📦' },
{ value: '120+', label: 'Fournisseurs vérifiés', icon: '🏭' },
{ value: '18', label: 'Villes couvertes', icon: '📍' },
{ value: '4.8/5', label: 'Note moyenne', icon: '⭐' },
{ value: '2021', label: 'Année de création', icon: '🚀' }];


const milestones = [
{ year: '2021', title: 'Fondation d\'EmpireKongo', description: 'Lancement de la plateforme avec 50 fournisseurs pionniers à Kinshasa.' },
{ year: '2022', title: 'Expansion nationale', description: 'Extension à 8 provinces congolaises, 500 membres et lancement du module Marketplace.' },
{ year: '2023', title: 'Levée de fonds', description: 'Financement de 2M$ pour accélérer le développement technologique et l\'expansion régionale.' },
{ year: '2024', title: 'Lancement des Services', description: 'Intégration des prestataires de services, freelances et consultants sur la plateforme.' },
{ year: '2025', title: 'Expansion régionale', description: 'Ouverture aux marchés du Congo-Brazzaville, Cameroun et Angola. 10,000 membres atteints.' },
{ year: '2026', title: 'EmpireKongo 2.0', description: 'Refonte complète de la plateforme avec IA, paiements mobiles avancés et outils B2B premium.' }];


function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A1200] via-[#0D0D0D] to-[#0D1A0D] border-b border-border py-20 px-4">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-9xl">🌍</div>
            <div className="absolute bottom-10 right-10 text-8xl">🏆</div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <AppLogo size={72} />
            </div>
            <div className="inline-flex items-center gap-2 badge-gold mb-4">
              <CheckBadgeIcon className="w-3.5 h-3.5" />
              <span>Notre histoire</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight">
              Connecter, Valoriser,<br />
              <span className="gold-text">Développer l'Afrique</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              EmpireKongo est la première plateforme B2B africaine qui connecte producteurs, fournisseurs, entreprises et consommateurs en République Démocratique du Congo et au-delà.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat) =>
              <div key={stat.label} className="text-center p-4">
                  <p className="text-3xl mb-2">{stat.icon}</p>
                  <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Mission & Vision */}
          <section className="mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary/10 to-amber-900/10 border border-primary/20 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-5">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-4">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Démocratiser l'accès au commerce B2B en Afrique en offrant une plateforme numérique inclusive qui permet à chaque entrepreneur, artisan, PME et grande entreprise de se connecter, de commercer et de prospérer — sans barrières géographiques ni financières.
              </p>
              <div className="mt-6 space-y-3">
                {['Faciliter les échanges commerciaux locaux', 'Valoriser les produits africains', 'Créer des emplois et opportunités'].map((item) =>
                <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/20 rounded-3xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-5">
                <span className="text-2xl">🔭</span>
              </div>
              <h2 className="text-2xl font-extrabold mb-4">Notre Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                Devenir le premier écosystème commercial numérique d'Afrique centrale d'ici 2030 — une plateforme où 1 million d'entreprises africaines échangent, collaborent et construisent ensemble une économie africaine forte, autonome et tournée vers l'avenir.
              </p>
              <div className="mt-6 space-y-3">
                {['1M+ entreprises connectées d\'ici 2030', 'Présence dans 15 pays africains', 'Leader du B2B numérique en Afrique'].map((item) =>
                <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                    <span className="text-sm text-foreground/80">{item}</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3">Notre Parcours</h2>
              <p className="text-muted-foreground">De l'idée à la réalité — 5 ans de croissance</p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border hidden md:block" />
              <div className="space-y-8">
                {milestones.map((m, i) =>
                <div key={m.year} className={`flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className={`bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-colors ${i % 2 === 0 ? 'md:ml-auto' : ''}`} style={{ maxWidth: '420px' }}>
                        <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{m.year}</p>
                        <h3 className="font-bold text-base mb-2">{m.title}</h3>
                        <p className="text-sm text-muted-foreground">{m.description}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/20 border-2 border-primary items-center justify-center shrink-0 z-10">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    </div>
                    <div className="flex-1" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3">Nos Valeurs</h2>
              <p className="text-muted-foreground">Les principes qui guident chacune de nos décisions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((v) =>
              <div key={v.title} className={`rounded-2xl border p-6 transition-all hover:shadow-lg hover:shadow-black/30 ${v.bg}`}>
                  <div className={`w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center mb-4`}>
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className={`font-bold text-base mb-2 ${v.color}`}>{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              )}
            </div>
          </section>

          {/* Team */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3">L'Équipe Dirigeante</h2>
              <p className="text-muted-foreground">Des passionnés qui construisent l'avenir du commerce africain</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) =>
              <div key={member.name} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all hover:shadow-xl hover:shadow-black/30 group text-center">
                  <div className="relative h-48 overflow-hidden">
                    <AppImage src={member.avatar} alt={member.avatarAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base">{member.name}</h3>
                    <p className="text-xs text-primary font-semibold mt-0.5 mb-3">{member.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-[#1A1A1A] to-[#0D0D0D] border border-primary/20 p-10 text-center">
            <div className="absolute inset-0 opacity-5 text-[200px] flex items-center justify-center">🌍</div>
            <div className="relative">
              <h2 className="text-3xl font-extrabold mb-4">
                Rejoignez l'<span className="gold-text">Empire</span>
              </h2>
              <p className="text-muted-foreground text-base max-w-xl mx-auto mb-8">
                Plus de 12,000 entrepreneurs font déjà confiance à EmpireKongo. Rejoignez la communauté et développez votre activité.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/register" className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Créer un compte gratuit
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link href="/store" className="flex items-center gap-2 px-6 py-3 bg-secondary border border-border rounded-xl font-semibold hover:border-primary/50 transition-colors">
                  Explorer le Store
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>);

}