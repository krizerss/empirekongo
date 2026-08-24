'use client';
import React, { useState, useRef, useEffect } from 'react';
import AppLogo from '@/components/ui/AppLogo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  ShoppingBagIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  TruckIcon,
  UsersIcon,
  BriefcaseIcon,
  WrenchScrewdriverIcon,
  LinkIcon,
  CreditCardIcon,
  ChartBarIcon,
  LockClosedIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import DashboardHome from './DashboardHome';
import ProfilePage from './ProfilePage';
import MonEntreprisePage from './MonEntreprisePage';
import MyProductsPage from './MyProductsPage';
import MessagesPage from './MessagesPage';
import CommandesPage from './CommandesPage';
import EnterprisesListPage from './EnterprisesListPage';
import CommunautePage from './CommunautePage';
import EmploiPage from './EmploiPage';
import AffiliationPage from './AffiliationPage';
import PaiementsPage from './PaiementsPage';
import FavorisPage from './FavorisPage';
import { useAuth, UserRole } from '@/lib/useAuth';

type TabKey =
  | 'dashboard' |'profile' |'products' |'enterprise' |'messages' |'notifications' |'orders' |'favorites' |'settings' |'store' |'entreprises' |'fournisseurs' |'communaute' |'emploi' |'services' |'affiliation' |'paiements';

interface NavItem {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  visibleTo: UserRole[];
  section: string;
  requiresAuth?: boolean;
  href?: string;
}

const ALL_ROLES: UserRole[] = ['visiteur', 'client', 'vendeur', 'entreprise', 'fournisseur', 'affilie', 'admin'];
const LOGGED_IN: UserRole[] = ['client', 'vendeur', 'entreprise', 'fournisseur', 'affilie', 'admin'];

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: HomeIcon, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'profile', label: 'Mon profil', icon: UserIcon, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'orders', label: 'Mes commandes', icon: ClipboardDocumentListIcon, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'messages', label: 'Messages', icon: ChatBubbleLeftIcon, badge: 5, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'notifications', label: 'Notifications', icon: BellIcon, badge: 6, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'favorites', label: 'Mes favoris', icon: HeartIcon, visibleTo: LOGGED_IN, section: 'Mon espace' },
  { key: 'products', label: 'Mes produits', icon: ShoppingBagIcon, visibleTo: LOGGED_IN, section: 'Gestion' },
  { key: 'enterprise', label: 'Mon entreprise', icon: BuildingOfficeIcon, visibleTo: LOGGED_IN, section: 'Gestion' },
  { key: 'store', label: 'Store', icon: ShoppingBagIcon, visibleTo: ALL_ROLES, section: 'Modules', href: '/marketplace' },
  { key: 'entreprises', label: 'Entreprises', icon: BuildingOfficeIcon, visibleTo: ALL_ROLES, section: 'Modules' },
  { key: 'fournisseurs', label: 'Fournisseurs', icon: TruckIcon, visibleTo: ALL_ROLES, section: 'Modules' },
  { key: 'communaute', label: 'Communauté', icon: UsersIcon, visibleTo: ALL_ROLES, section: 'Modules' },
  { key: 'emploi', label: 'Emploi', icon: BriefcaseIcon, visibleTo: ALL_ROLES, section: 'Modules' },
  { key: 'services', label: 'Services', icon: WrenchScrewdriverIcon, visibleTo: ALL_ROLES, section: 'Modules' },
  { key: 'affiliation', label: 'Affiliation', icon: LinkIcon, visibleTo: LOGGED_IN, section: 'Modules', requiresAuth: true },
  { key: 'paiements', label: 'Paiements', icon: CreditCardIcon, visibleTo: LOGGED_IN, section: 'Modules', requiresAuth: true },
  { key: 'settings', label: 'Paramètres', icon: Cog6ToothIcon, visibleTo: LOGGED_IN, section: 'Compte' },
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
  visiteur: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  client: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  vendeur: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  entreprise: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  fournisseur: 'bg-green-500/20 text-green-400 border-green-500/30',
  affilie: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
};

interface SidebarNavProps {
  visibleItems: NavItem[];
  sections: string[];
  activeTab: TabKey;
  isLoggedIn: boolean;
  userRole: UserRole;
  setActiveTab: (tab: TabKey) => void;
  onItemClick?: () => void;
}

function SidebarNav({
  visibleItems,
  sections,
  activeTab,
  isLoggedIn,
  userRole,
  setActiveTab,
  onItemClick,
}: SidebarNavProps) {
  return (
    <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-4">
      {sections.map((section) => {
        const items = visibleItems.filter((i) => i.section === section);
        return (
          <div key={section}>
            <p className="px-3 mb-1 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
              {section}
            </p>
            <div className="space-y-0.5">
              {items.map((item) => {
                const isLocked = item.requiresAuth && !isLoggedIn;
                if (item.href && !isLocked) {
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onItemClick}
                      className="sidebar-link w-full flex items-center gap-3"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1 text-sm">{item.label}</span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (!isLocked) {
                        setActiveTab(item.key);
                        onItemClick?.();
                      }
                    }}
                    disabled={isLocked}
                    className={`sidebar-link w-full ${activeTab === item.key ? 'active' : ''} ${
                      isLocked ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {isLocked ? (
                      <LockClosedIcon className="w-3 h-3 text-muted-foreground/50" />
                    ) : item.badge ? (
                      <span className="notification-badge">{item.badge}</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {(() => {
        const lockedModules = navItems.filter(
          (item) => item.section === 'Modules' && !item.visibleTo.includes(userRole)
        );
        if (lockedModules.length === 0) return null;
        return (
          <div>
            <p className="px-3 mb-1 text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">
              Non disponible
            </p>
            <div className="space-y-0.5">
              {lockedModules.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg opacity-25 cursor-not-allowed"
                >
                  <item.icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 text-sm text-muted-foreground">{item.label}</span>
                  <LockClosedIcon className="w-3 h-3 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </nav>
  );
}

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { userRole, user, logout, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const effectiveRole: UserRole = loading ? 'client' : isLoggedIn ? userRole : 'client';
  const visibleItems = navItems.filter((item) => item.visibleTo.includes(effectiveRole));
  const sections = Array.from(new Set(visibleItems.map((i) => i.section).filter(Boolean)));

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome onNavigate={(tab) => setActiveTab(tab as TabKey)} />;
      case 'profile':
        return <ProfilePage />;
      case 'enterprise':
        return <MonEntreprisePage />;
      case 'entreprises':
        return <EnterprisesListPage />;
      case 'products':
        return <MyProductsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'orders':
        return <CommandesPage />;
      case 'communaute':
        return <CommunautePage />;
      case 'emploi':
        return <EmploiPage />;
      case 'affiliation':
        return <AffiliationPage />;
      case 'paiements':
        return <PaiementsPage />;
      case 'favorites':
        return <FavorisPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <ChartBarIcon className="w-12 h-12 mb-3 text-primary/30" />
            <p className="text-lg font-semibold mb-1">Section en construction</p>
            <p className="text-sm text-muted-foreground/60">Cette section sera disponible prochainement.</p>
          </div>
        );
    }
  };

  const displayName = user?.name ?? 'Mon compte';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border fixed top-0 left-0 bottom-0 z-40">
        <Link href="/" className="px-4 py-3.5 border-b border-border flex items-center gap-2 shrink-0">
          <AppLogo size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-sm text-foreground tracking-tight">EMPIREKONGO</span>
            <span className="text-[8px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span>
          </div>
        </Link>

        <div className="px-3 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-primary">{initials}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email ?? 'Non connecté'}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <ShieldCheckIcon className="w-3 h-3 text-muted-foreground/50" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[userRole]}`}>
              {ROLE_LABELS[userRole]}
            </span>
          </div>
        </div>

        <SidebarNav
          visibleItems={visibleItems}
          sections={sections}
          activeTab={activeTab}
          isLoggedIn={isLoggedIn}
          userRole={userRole}
          setActiveTab={setActiveTab}
        />

        <div className="p-2 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full flex items-center gap-3 text-red-400 hover:bg-red-400/10 hover:text-red-400"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3.5 border-b border-border flex items-center justify-between shrink-0">
              <Link href="/" className="flex items-center gap-2">
                <AppLogo size={26} />
                <span className="font-extrabold text-sm text-foreground">EMPIREKONGO</span>
              </Link>
              <button onClick={() => setMobileOpen(false)}>
                <XMarkIcon className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-3 py-3 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-primary">{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{displayName}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[userRole]}`}>
                    {ROLE_LABELS[userRole]}
                  </span>
                </div>
              </div>
            </div>

            <SidebarNav
              visibleItems={visibleItems}
              sections={sections}
              activeTab={activeTab}
              isLoggedIn={isLoggedIn}
              userRole={userRole}
              setActiveTab={setActiveTab}
              onItemClick={() => setMobileOpen(false)}
            />

            <div className="p-2 border-t border-border shrink-0">
              <button
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="sidebar-link w-full flex items-center gap-3 text-red-400 hover:bg-red-400/10"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 py-2.5 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-sm font-semibold text-foreground capitalize">
                {activeTab === 'dashboard' ?'Tableau de bord'
                  : navItems.find((i) => i.key === activeTab)?.label ?? activeTab}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Rechercher"
            >
              <MagnifyingGlassIcon className="w-[18px] h-[18px]" />
            </button>

            <button
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Notifications"
            >
              <BellIcon className="w-[18px] h-[18px]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                6
              </span>
            </button>

            {/* User avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUserDropdownOpen((v) => !v);
                }}
                className="flex items-center gap-2 pl-2 border-l border-border ml-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[11px] font-bold text-primary">{initials}</span>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-foreground max-w-[100px] truncate">
                  {displayName.split(' ')[0]}
                </span>
                <ChevronDownIcon
                  className={`w-3.5 h-3.5 text-muted-foreground hidden sm:block transition-transform duration-200 ${
                    userDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-[100]">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-primary">{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
                        <span
                          className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[userRole]}`}
                        >
                          {ROLE_LABELS[userRole]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <UserIcon className="w-4 h-4 shrink-0" />
                      <span>Mon profil</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('settings');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <Cog6ToothIcon className="w-4 h-4 shrink-0" />
                      <span>Paramètres</span>
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        handleLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}