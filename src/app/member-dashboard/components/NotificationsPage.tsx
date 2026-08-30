'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { BellIcon, CheckIcon, TrashIcon, ShoppingBagIcon, ChatBubbleOvalLeftIcon, InformationCircleIcon, CheckCircleIcon, StarIcon, CurrencyDollarIcon, EllipsisHorizontalIcon,  } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// ─── Types ────────────────────────────────────────────────────────────────────

type NotifTab = 'all' | 'unread' | 'orders' | 'messages' | 'system';
type NotifType = 'order' | 'message' | 'payment' | 'system' | 'promotion' | 'review';

interface DbNotification {
  id: string;
  user_id: string;
  type: NotifType;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, unknown>;
  created_at: string;
}

const TYPE_ICON_MAP: Record<NotifType, { icon: React.ElementType; iconBg: string; iconColor: string }> = {
  order: { icon: CheckCircleIcon, iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  message: { icon: ChatBubbleOvalLeftIcon, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
  payment: { icon: CurrencyDollarIcon, iconBg: 'bg-green-500/10', iconColor: 'text-green-400' },
  system: { icon: InformationCircleIcon, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
  promotion: { icon: StarIcon, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  review: { icon: StarIcon, iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
};

const tabs: { key: NotifTab; label: string; icon: React.ElementType }[] = [
  { key: 'all', label: 'Tout', icon: BellIcon },
  { key: 'unread', label: 'Non lus', icon: BellIcon },
  { key: 'orders', label: 'Commandes', icon: ShoppingBagIcon },
  { key: 'messages', label: 'Messages', icon: ChatBubbleOvalLeftIcon },
  { key: 'system', label: 'Système', icon: InformationCircleIcon },
];

function filterNotifications(notifs: DbNotification[], tab: NotifTab): DbNotification[] {
  switch (tab) {
    case 'unread': return notifs.filter((n) => !n.is_read);
    case 'orders': return notifs.filter((n) => n.type === 'order');
    case 'messages': return notifs.filter((n) => n.type === 'message');
    case 'system': return notifs.filter((n) => n.type === 'system' || n.type === 'promotion' || n.type === 'review');
    default: return notifs;
  }
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHours < 24) return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<DbNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NotifTab>('all');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNotifications(data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Realtime subscription ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as DbNotification;
          setNotifications((prev) => [newNotif, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new as DbNotification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllRead = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  };

  const deleteNotif = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setOpenMenu(null);
    await supabase.from('notifications').delete().eq('id', id);
  };

  const deleteAll = async () => {
    if (!user) return;
    setNotifications([]);
    await supabase.from('notifications').delete().eq('user_id', user.id);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filtered = filterNotifications(notifications, activeTab);

  const tabCounts: Record<NotifTab, number> = {
    all: notifications.length,
    unread: notifications.filter((n) => !n.is_read).length,
    orders: notifications.filter((n) => n.type === 'order').length,
    messages: notifications.filter((n) => n.type === 'message').length,
    system: notifications.filter((n) => n.type === 'system' || n.type === 'promotion' || n.type === 'review').length,
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div>
        <div className="mb-5">
          <h1 className="text-xl font-extrabold text-foreground mb-1">Notifications</h1>
          <p className="text-sm text-muted-foreground">Restez informé de toutes vos activités.</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">Restez informé de toutes vos activités.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-foreground hover:border-primary/40 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tout marquer lu</span>
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary border border-border text-sm font-medium text-muted-foreground hover:text-red-400 hover:border-red-500/30 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tout supprimer</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-secondary border border-border rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const count = tabCounts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-card border border-border text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TabIcon className="w-4 h-4 shrink-0" />
              {tab.label}
              {count > 0 && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}
                >
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
            {activeTab === 'unread' ?'Vous avez tout lu ! Revenez plus tard.' :'Aucune notification dans cette catégorie.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif) => {
            const typeConfig = TYPE_ICON_MAP[notif.type] || TYPE_ICON_MAP['system'];
            const NotifIcon = typeConfig.icon;
            return (
              <div
                key={notif.id}
                className={`relative flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer group ${
                  !notif.is_read
                    ? 'bg-card border-border' :'bg-secondary/30 border-border/50'
                } hover:border-primary/20 hover:bg-card`}
                onClick={() => markRead(notif.id)}
              >
                {/* Unread dot */}
                {!notif.is_read && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary shrink-0" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.iconBg}`}>
                  <NotifIcon className={`w-5 h-5 ${typeConfig.iconColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-6">
                  <p className={`text-sm font-semibold leading-snug ${!notif.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1.5">{formatTime(notif.created_at)}</p>
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
                      {!notif.is_read && (
                        <button
                          onClick={() => { markRead(notif.id); setOpenMenu(null); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                        >
                          <CheckIcon className="w-4 h-4 text-green-400" /> Marquer comme lu
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotif(notif.id)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
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
    </div>
  );
}
