import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarketplaceContent from '@/app/marketplace/components/MarketplaceContent';

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <MarketplaceContent />
      </main>
      <Footer />
    </div>
  );
}