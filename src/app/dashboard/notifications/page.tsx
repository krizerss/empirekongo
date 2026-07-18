'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BellIcon, CheckIcon, TrashIcon, ChevronRightIcon, ShoppingBagIcon, ChatBubbleOvalLeftIcon, ShieldCheckIcon, InformationCircleIcon, CheckCircleIcon, StarIcon, TruckIcon, CurrencyDollarIcon, EllipsisHorizontalIcon,  } from '@heroicons/react/24/outline';
import Icon from '@/components/ui/AppIcon';


type NotifTab = 'all' | 'unread' | 'orders' | 'messages' | 'system';

interface Notification {
  id: number;
  type: 'order' | 'message' | 'system' | 'promo' | 'security';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const initialNotifications: Notification[] = [
  { id: 1, type: 'order', title: 'Commande confirmée', body: 'Votre commande #1042 de Café Robusta a été confirmée et est en cours de préparation.', time: 'Il y a 5 min', read: false, icon: CheckCircleIcon, iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  { id: 2, type: 'message', title: 'Nouveau message de Jean Mutombo', body: 'Bonjour, je suis intéressé par votre produit Huile de Palme. Pouvez-vous me donner plus d\'informations ?', time: 'Il y a 23 min', read: false, icon: ChatBubbleOvalLeftIcon, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  { id: 3, type: 'order', title: 'Livraison en route', body: 'Votre commande #1038 est en cours de livraison. Livraison prévue demain avant 18h.', time: 'Il y a 1 heure', read: false, icon: TruckIcon, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { id: 4, type: 'system', title: 'Profil complété à 85%', body: 'Ajoutez votre photo de profil et votre description pour atteindre 100% et augmenter votre visibilité.', time: 'Il y a 2 heures', read: false, icon: InformationCircleIcon, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
  { id: 5, type: 'promo', title: 'Promotion spéciale — 20% de réduction', body: 'Profitez de 20% de réduction sur tous les produits agricoles ce week-end. Offre limitée !', time: 'Il y a 3 heures', read: true, icon: StarIcon, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { id: 6, type: 'security', title: 'Nouvelle connexion détectée', body: 'Une connexion depuis Firefox / macOS à Brazzaville a été détectée. Si ce n\'est pas vous, sécurisez votre compte.', time: 'Il y a 5 heures', read: true, icon: ShieldCheckIcon, iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
  { id: 7, type: 'order', title: 'Avis demandé', body: 'Vous avez reçu votre commande #1035. Donnez votre avis pour aider la communauté EmpireKongo.', time: 'Il y a 1 jour', read: true, icon: StarIcon, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
  { id: 8, type: 'message', title: 'Réponse de TechAfrique SARL', body: 'Merci pour votre intérêt. Nous pouvons vous proposer un tarif préférentiel pour une commande en gros.', time: 'Il y a 1 jour', read: true, icon: ChatBubbleOvalLeftIcon, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  { id: 9, type: 'system', title: 'Mise à jour de la plateforme', body: 'EmpireKongo v2.4 est disponible avec de nouvelles fonctionnalités : messagerie améliorée, filtres avancés.', time: 'Il y a 2 jours', read: true, icon: InformationCircleIcon, iconBg: 'bg-secondary', iconColor: 'text-muted-foreground' },
  { id: 10, type: 'order', title: 'Paiement reçu', body: 'Vous avez reçu un paiement de 45 000 FC pour la commande #1031 de Maïs Séché.', time: 'Il y a 3 jours', read: true, icon: CurrencyDollarIcon, iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
];

const tabs: { key: NotifTab; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Tout', icon: BellIcon },
  { key: 'unread', label: 'Non lus', icon: BellIcon },
  { key: 'orders', label: 'Commandes', icon: ShoppingBagIcon },
  { key: 'messages', label: 'Messages', icon: ChatBubbleOvalLeftIcon },
  { key: 'system', label: 'Système', icon: InformationCircleIcon },
];

function filterNotifications(notifs: Notification[], tab: NotifTab): Notification[] {
  switch (tab) {
    case 'unread': return notifs.filter((n) => !n.read);
    case 'orders': return notifs.filter((n) => n.type === 'order');
    case 'messages': return notifs.filter((n) => n.type === 'message');
    case 'system': return notifs.filter((n) => n.type === 'system' || n.type === 'security' || n.type === 'promo');
    default: return notifs;
  }
}

export default function NotificationsCenterPage() {
  const [activeTab, setActiveTab] = useState<NotifTab>('all');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filterNotifications(notifications, activeTab);

  const markRead = (id: number) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteNotif = (id: number) => { setNotifications((prev) => prev.filter((n) => n.id !== id)); setOpenMenu(null); };
  const deleteAll = () => setNotifications([]);

  const tabCounts: Record<NotifTab, number> = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    orders: notifications.filter((n) => n.type === 'order').length,
    messages: notifications.filter((n) => n.type === 'message').length,
    system: notifications.filter((n) => n.type === 'system' || n.type === 'security' || n.type === 'promo').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Link href="/member-dashboard" className="hover:text-foreground transition-colors">Tableau de bord</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-foreground">Notifications</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground">Centre de notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">{unreadCount}</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-1">Restez informé de toutes vos activités.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors">
                <CheckIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Tout marquer lu</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={deleteAll} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors">
                <TrashIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Tout supprimer</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-secondary border border-border rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = tabCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key ? 'bg-card border border-border text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
                {count > 0 && (
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
              <BellIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Aucune notification</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {activeTab === 'unread' ? 'Vous avez tout lu ! Revenez plus tard.' : 'Aucune notification dans cette catégorie.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                    !notif.read ? 'bg-card border-border' : 'bg-secondary/30 border-border/50'
                  } hover:border-primary/20 hover:bg-card`}
                  onClick={() => markRead(notif.id)}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                    <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-snug ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{notif.body}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1.5">{notif.time}</p>
                  </div>

                  {/* Actions menu */}
                  <div className="shrink-0 relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setOpenMenu(openMenu === notif.id ? null : notif.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <EllipsisHorizontalIcon className="w-4 h-4" />
                    </button>
                    {openMenu === notif.id && (
                      <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-xl shadow-xl py-1 w-44">
                        {!notif.read && (
                          <button onClick={() => { markRead(notif.id); setOpenMenu(null); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors">
                            <CheckIcon className="w-4 h-4 text-green-400" /> Marquer comme lu
                          </button>
                        )}
                        <button onClick={() => deleteNotif(notif.id)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                          <TrashIcon className="w-4 h-4" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
