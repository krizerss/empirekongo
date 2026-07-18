import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import CategoriesSection from '@/app/components/CategoriesSection';
import PopularProductsSection from '@/app/components/PopularProductsSection';
import FeaturedEnterprisesSection from '@/app/components/FeaturedEnterprisesSection';
import NewsSection from '@/app/components/NewsSection';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <PopularProductsSection />
        <FeaturedEnterprisesSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}