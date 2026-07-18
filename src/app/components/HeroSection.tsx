'use client';
import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';

const trustBadges = [
  {
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Fournisseurs Vérifiés',
    subtitle: 'Des partenaires de confiance',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: 'Produits de Qualité',
    subtitle: 'Sélection rigoureuse',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Paiement Sécurisé',
    subtitle: 'Transactions garanties',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: 'Support 24/7',
    subtitle: 'Assistance dédiée',
  },
];

export default function HeroSection() {
  return (
    <section className="relative flex flex-col overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <AppImage
          src="/assets/images/hero-bg.jpg-1784381053621.png"
          alt="Ouvrier industriel devant des containers de fret au coucher du soleil"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay — stronger on left for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      </div>
      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="max-w-lg">
            {/* Brand label */}
            <p className="text-yellow-500 font-semibold text-sm tracking-widest uppercase mb-3">
              EMPIREKONGO
            </p>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] mb-5">
              Le marché des<br />
              grands producteurs<br />
              et{' '}
              <span className="text-yellow-500">fournisseurs</span>
              <br />
              <span className="text-yellow-500">Africains</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/75 text-base mb-8 leading-relaxed">
              Connectez-vous aux meilleurs fournisseurs.<br />
              Développez votre business avec confiance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/marketplace"
                className="inline-flex items-center px-6 py-3 rounded font-semibold text-sm text-black"
                style={{ backgroundColor: '#C9A84C', border: '1px solid #C9A84C' }}
              >
                Explorer le Marketplace
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 rounded font-semibold text-sm text-white border border-white/60 hover:bg-white/10 transition-colors"
              >
                Devenir Fournisseur
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Trust badges bar */}
      <div className="relative z-10 w-full" style={{ backgroundColor: 'rgba(10,10,10,0.88)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {trustBadges?.map((badge) => (
              <div key={badge?.title} className="flex items-center gap-3 px-4 py-5">
                <div className="shrink-0">{badge?.icon}</div>
                <div>
                  <p className="text-white font-semibold text-sm">{badge?.title}</p>
                  <p className="text-white/50 text-xs mt-0.5">{badge?.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
