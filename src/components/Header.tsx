'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import {
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  TruckIcon,
  UsersIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  LinkIcon,
  CreditCardIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useAuth, UserRole } from '@/lib/useAuth';

interface NavModule {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  visibleTo: UserRole[];
  requiresAuth?: boolean;
  children?: { label: string; href: string; description?: string }[];
}

const ALL_ROLES: UserRole[] = ['visiteur', 'client', 'vendeur', 'entreprise', 'fournisseur', 'affilie', 'admin'];
const LOGGED_IN: UserRole[] = ['client', 'vendeur', 'entreprise', 'fournisseur', 'affilie', 'admin'];

const navModules: NavModule[] = [
  {
    label: 'Store',
    href: '/store',
    icon: ShoppingBagIcon,
    visibleTo: ALL_ROLES,
    children: [
      { label: 'Tous les produits', href: '/store', description: 'Parcourir le catalogue complet' },
      { label: 'Catégories', href: '/store/categories', description: 'Explorer par catégorie' },
      { label: 'Promotions', href: '/store/promotions', description: 'Offres et réductions du moment' },
      { label: 'Nouveautés', href: '/store?filter=nouveautes', description: 'Derniers produits ajoutés' },
      { label: 'Meilleures ventes', href: '/store?filter=bestsellers', description: 'Les plus populaires' },
    ],
  },
  {
    label: 'Entreprises',
    href: '#entreprises',
    icon: BuildingOfficeIcon,
    visibleTo: ALL_ROLES,
    children: [
      { label: 'Toutes les entreprises', href: '#entreprises', description: 'Annuaire complet' },
      { label: 'Entreprises populaires', href: '#entreprises?filter=populaires', description: 'Les mieux notées' },
      { label: 'Par secteur', href: '#entreprises?filter=secteur', description: 'Filtrer par domaine' },
      { label: 'Par province', href: '#entreprises?filter=province', description: 'Filtrer par localisation' },
    ],
  },
  {
    label: 'Fournisseurs',
    href: '/fournisseurs',
    icon: TruckIcon,
    visibleTo: ALL_ROLES,
    children: [
      { label: 'Tous les fournisseurs', href: '/fournisseurs', description: 'Catalogue B2B complet' },
      { label: 'Grossistes', href: '/fournisseurs?type=grossiste', description: 'Vente en gros' },
      { label: 'Fabricants', href: '/fournisseurs?type=fabricant', description: 'Production locale' },
      { label: 'Importateurs', href: '/fournisseurs?type=importateur', description: 'Produits importés' },
    ],
  },
  {
    label: 'Communauté',
    href: '#communaute',
    icon: UsersIcon,
    visibleTo: ALL_ROLES,
    children: [
      { label: 'Publications', href: '#communaute', description: 'Fil d\'actualité' },
      { label: 'Événements', href: '#communaute?tab=evenements', description: 'Agenda professionnel' },
      { label: 'Annonces', href: '#communaute?tab=annonces', description: 'Offres et opportunités' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    icon: WrenchScrewdriverIcon,
    visibleTo: ALL_ROLES,
    children: [
      { label: 'Tous les services', href: '/services', description: 'Prestataires disponibles' },
      { label: 'Freelances', href: '/services?type=Freelance', description: 'Indépendants qualifiés' },
      { label: 'Agences', href: '/services?type=Agence', description: 'Équipes professionnelles' },
      { label: 'Consultants', href: '/services?type=Consultant', description: 'Experts sectoriels' },
      { label: 'Techniciens', href: '/services?type=Technicien', description: 'Interventions techniques' },
      { label: 'Emplois', href: '#emploi', description: 'Trouver un poste' },
      { label: 'Publier une offre', href: '#emploi?action=publier', description: 'Recruter des talents' },
      { label: 'Candidatures', href: '#emploi?tab=candidatures', description: 'Suivre mes candidatures' },
    ],
  },
  {
    label: 'Affiliation',
    href: '#affiliation',
    icon: LinkIcon,
    visibleTo: LOGGED_IN,
    requiresAuth: true,
    children: [
      { label: 'Mon programme', href: '#affiliation', description: 'Mon lien de parrainage' },
      { label: 'Mes gains', href: '#affiliation?tab=gains', description: 'Commissions accumulées' },
      { label: 'Demande de retrait', href: '#affiliation?tab=retrait', description: 'Retirer mes gains' },
    ],
  },
  {
    label: 'Paiements',
    href: '#paiements',
    icon: CreditCardIcon,
    visibleTo: LOGGED_IN,
    requiresAuth: true,
    children: [
      { label: 'Historique', href: '#paiements', description: 'Toutes mes transactions' },
      { label: 'Transactions', href: '#paiements?tab=transactions', description: 'Détail des paiements' },
    ],
  },
  {
    label: 'À propos',
    href: '/about',
    icon: InformationCircleIcon,
    visibleTo: ALL_ROLES,
  },
  {
    label: 'Contact',
    href: '#contact',
    icon: EnvelopeIcon,
    visibleTo: ALL_ROLES,
  },
];

const ROLE_LABELS: Record<UserRole, string> = {
  visiteur: 'Visiteur',
  client: 'Client',
  vendeur: 'Vendeur',
  entreprise: 'Entreprise',
  fournisseur: 'Fournisseur',
  affilie: 'Affilié',
  admin: 'Admin',
};

const ROLE_COLORS: Record<UserRole, string> = {
  visiteur: 'bg-gray-500/20 text-gray-400',
  client: 'bg-blue-500/20 text-blue-400',
  vendeur: 'bg-amber-500/20 text-amber-400',
  entreprise: 'bg-purple-500/20 text-purple-400',
  fournisseur: 'bg-green-500/20 text-green-400',
  affilie: 'bg-pink-500/20 text-pink-400',
  admin: 'bg-red-500/20 text-red-400',
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const { isLoggedIn, userRole, user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const visibleModules = navModules.filter((m) => m.visibleTo.includes(userRole));
  const primaryNav = visibleModules.slice(0, 5);
  const secondaryNav = visibleModules.slice(5);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-10 h-10 shrink-0">
            <AppImage
              src="/assets/empirekongo-logo.svg"
              alt="EmpireKongo Logo"
              width={40}
              height={40}
              className="w-10 h-10 drop-shadow-[0_0_8px_rgba(201,168,76,0.5)] group-hover:drop-shadow-[0_0_14px_rgba(201,168,76,0.8)] transition-all duration-300"
              priority={true}
              unoptimized={true}
            />
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="font-extrabold text-lg tracking-tight text-foreground">EMPIREKONGO</span>
            <span className="text-[9px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser, Développer</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5" ref={dropdownRef}>
          {primaryNav.map((mod) => {
            const isActive = pathname === mod.href || (mod.href !== '/' && !mod.href.startsWith('#') && pathname?.startsWith(mod.href));
            const hasChildren = mod.children && mod.children.length > 0;
            const isOpen = openDropdown === mod.label;
            const isLocked = mod.requiresAuth && !isLoggedIn;

            return (
              <div key={mod.label} className="relative">
                <button
                  onClick={() => !isLocked && setOpenDropdown(isOpen ? null : mod.label)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-foreground bg-secondary'
                      : isLocked
                      ? 'text-muted-foreground/40 cursor-not-allowed'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}
                  title={isLocked ? 'Connexion requise' : mod.label}
                >
                  <mod.icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{mod.label}</span>
                  {isLocked && <LockClosedIcon className="w-2.5 h-2.5 text-muted-foreground/40" />}
                  {hasChildren && !isLocked && (
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {hasChildren && isOpen && !isLocked && (
                  <div className="absolute top-full left-0 mt-1 w-60 bg-card border border-border rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                    <div className="p-1.5 space-y-0.5">
                      {mod.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className="flex flex-col px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors group"
                        >
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors">{child.label}</span>
                          {child.description && (
                            <span className="text-xs text-muted-foreground mt-0.5">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* "Plus" dropdown for secondary modules */}
          {secondaryNav.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === '__more__' ? null : '__more__')}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                Plus
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${openDropdown === '__more__' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === '__more__' && (
                <div className="absolute top-full right-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  <div className="p-1.5 space-y-0.5">
                    {secondaryNav.map((mod) => {
                      const isLocked = mod.requiresAuth && !isLoggedIn;
                      return (
                        <Link
                          key={mod.label}
                          href={isLocked ? '/login' : mod.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                            isLocked
                              ? 'text-muted-foreground/50 hover:bg-secondary/40'
                              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          <mod.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{mod.label}</span>
                          {isLocked && <LockClosedIcon className="w-3 h-3" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0" ref={dropdownRef}>
          {/* Search bar */}
          <div className="flex items-center">
            {searchOpen && (
              <div className="flex items-center gap-1 mr-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  placeholder="Rechercher..."
                  className="w-48 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Fermer la recherche"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Rechercher"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === '__user__' ? null : '__user__')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-primary">
                      {user?.name?.slice(0, 2).toUpperCase() ?? 'EK'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-semibold text-foreground max-w-[80px] truncate">
                    {user?.name?.split(' ')[0] ?? 'Mon compte'}
                  </span>
                  <span className={`text-[9px] font-bold px-1 py-0.5 rounded-sm mt-0.5 ${ROLE_COLORS[userRole]}`}>
                    {ROLE_LABELS[userRole]}
                  </span>
                </div>
                <ChevronDownIcon className={`w-3 h-3 text-muted-foreground transition-transform ${openDropdown === '__user__' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === '__user__' && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-primary">
                            {user?.name?.slice(0, 2).toUpperCase() ?? 'EK'}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[userRole]}`}>
                          {ROLE_LABELS[userRole]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href="/member-dashboard"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <UserCircleIcon className="w-4 h-4" />
                      Mon tableau de bord
                    </Link>
                    <Link
                      href="/member-dashboard"
                      onClick={() => setOpenDropdown(null)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Cog6ToothIcon className="w-4 h-4" />
                      Paramètres
                    </Link>
                  </div>
                  <div className="p-1.5 border-t border-border">
                    <button
                      onClick={() => { logout(); setOpenDropdown(null); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-md border border-border text-sm font-semibold text-foreground hover:border-primary transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-md gold-gradient text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-muted-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-card border-b border-border max-h-[85vh] overflow-y-auto">
          {/* Role indicator mobile */}
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Accès actuel :</span>
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[userRole]}`}>
              {ROLE_LABELS[userRole]}
            </span>
          </div>

          <div className="px-3 py-2 space-y-0.5">
            {visibleModules.map((mod) => {
              const hasChildren = mod.children && mod.children.length > 0;
              const isExpanded = mobileExpanded === mod.label;
              const isLocked = mod.requiresAuth && !isLoggedIn;

              return (
                <div key={mod.label}>
                  <button
                    onClick={() => !isLocked && setMobileExpanded(isExpanded ? null : mod.label)}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isLocked
                        ? 'text-muted-foreground/40 cursor-not-allowed'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                    }`}
                  >
                    <mod.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left">{mod.label}</span>
                    {isLocked ? (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
                        <LockClosedIcon className="w-3 h-3" />
                        Connexion requise
                      </span>
                    ) : hasChildren ? (
                      <ChevronDownIcon className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    ) : null}
                  </button>
                  {hasChildren && isExpanded && !isLocked && (
                    <div className="ml-7 mb-1 space-y-0.5">
                      {mod.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-2 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 px-4 py-3 border-t border-border">
            {isLoggedIn ? (
              <>
                <Link
                  href="/member-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-md border border-border text-sm font-semibold text-foreground"
                >
                  Mon compte
                </Link>
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex-1 text-center py-2 rounded-md bg-red-500/10 border border-red-500/30 text-sm font-semibold text-red-400"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-md border border-border text-sm font-semibold"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 rounded-md gold-gradient text-sm font-semibold text-primary-foreground"
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}