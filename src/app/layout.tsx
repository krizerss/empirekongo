import React from 'react';
import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import StoreOrderBridge from '@/components/StoreOrderBridge';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'EmpireKongo — Marketplace des Entreprises du Congo',
  description: 'EmpireKongo connecte les entreprises et producteurs congolais pour acheter, vendre et développer leur business sur une seule plateforme.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>
        {children}
        <StoreOrderBridge />
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  var routes = {
    'Tableau de bord':'dashboard','Mon profil':'profile','Mes commandes':'orders','Messages':'messages',
    'Notifications':'notifications','Mes favoris':'favorites','Mes produits':'products','Mon entreprise':'enterprise',
    'Entreprises':'entreprises','Fournisseurs':'fournisseurs','Communauté':'communaute','Emploi':'emploi',
    'Services':'services','Affiliation':'affiliation','Paiements':'paiements','Paramètres':'settings'
  };
  function sync() {
    var params = new URLSearchParams(window.location.search);
    var tab = params.get('tab');
    if (!tab) return;
    var buttons = document.querySelectorAll('button.sidebar-link');
    buttons.forEach(function (button) {
      var label = (button.textContent || '').replace(/[0-9]+/g, '').trim();
      if (routes[label] === tab && !button.disabled) button.click();
    });
  }
  function install() {
    document.addEventListener('click', function (event) {
      var target = event.target;
      if (!(target instanceof Element)) return;
      var button = target.closest('button.sidebar-link');
      if (!button || button.disabled) return;
      var label = (button.textContent || '').replace(/[0-9]+/g, '').trim();
      var tab = routes[label];
      if (!tab) return;
      var url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.pushState({}, '', url.pathname + '?' + url.searchParams.toString());
    }, true);
    window.addEventListener('popstate', function () { setTimeout(sync, 0); });
    setTimeout(sync, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  else install();
})();`,
          }}
        />
        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fempirekong5268back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.19" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" />
      </body>
    </html>
  );
}
