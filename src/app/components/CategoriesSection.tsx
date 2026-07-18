'use client';
import React from 'react';
import Link from 'next/link';

const categories = [
  {
    label: 'Agriculture',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10" strokeLinecap="round"/>
        <path d="M12 2c2.5 3 4 6.5 4 10" strokeLinecap="round"/>
        <path d="M12 2c-2.5 3-4 6.5-4 10" strokeLinecap="round"/>
        <path d="M2 12h20M12 2v20" strokeLinecap="round"/>
        <path d="M19 5c-3 1-5 3-7 7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Élevage',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M8 3c0 0-2 1-2 4v2H4l-1 3h1v5h2v-2h8v2h2v-5h1l-1-3h-2V7c0-3-2-4-2-4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="6" r="1" fill="currentColor"/>
        <circle cx="15" cy="6" r="1" fill="currentColor"/>
        <path d="M9 14c0 0 1.5 1 3 1s3-1 3-1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Agroalimentaire',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5"/>
        <path d="M8 21h8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Énergie',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M13 2L4.5 13.5H12L11 22l8.5-11.5H12L13 2z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'BTP & Matériaux',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="3" y="10" width="18" height="11" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 10l9-7 9 7" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="14" width="6" height="7"/>
        <path d="M9 14v7M15 14v7" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Mode & Beauté',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path d="M12 2l2 5h5l-4 3 1.5 5L12 12l-4.5 3L9 10 5 7h5z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12v10M8 22h8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Technologie',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <rect x="2" y="4" width="20" height="13" rx="2"/>
        <path d="M8 21h8M12 17v4" strokeLinecap="round"/>
        <path d="M7 9l3 3-3 3M13 15h4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: 'Voir plus',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <circle cx="5" cy="5" r="2"/>
        <circle cx="12" cy="5" r="2"/>
        <circle cx="19" cy="5" r="2"/>
        <circle cx="5" cy="12" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="19" cy="12" r="2"/>
        <circle cx="5" cy="19" r="2"/>
        <circle cx="12" cy="19" r="2"/>
        <circle cx="19" cy="19" r="2"/>
      </svg>
    ),
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-10 px-4 bg-background border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {categories?.map((cat, i) => (
            <Link
              key={cat?.label}
              href={cat?.label === 'Voir plus' ? '/marketplace' : `/marketplace?cat=${encodeURIComponent(cat?.label)}`}
              className="category-card group"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors text-primary">
                {cat?.icon}
              </div>
              <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat?.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}