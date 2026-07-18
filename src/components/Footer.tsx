import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo + links */}
        <div className="flex items-center gap-8 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <AppLogo size={28} />
            <span className="font-bold text-sm text-foreground">EMPIREKONGO</span>
          </div>
          <nav className="flex items-center gap-6 flex-wrap">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Accueil</Link>
            <Link href="/store" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Store</Link>
            <Link href="/fournisseurs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Fournisseurs</Link>
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Services</Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">À propos</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Confidentialité</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Conditions</Link>
          </nav>
        </div>
        {/* Copyright */}
        <p className="text-sm text-muted-foreground">© 2026 EmpireKongo. Tous droits réservés.</p>
      </div>
    </footer>
  );
}