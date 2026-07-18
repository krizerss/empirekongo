'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Cog6ToothIcon, GlobeAltIcon, BellIcon, ShieldCheckIcon, TrashIcon, ChevronRightIcon, CheckIcon, ExclamationTriangleIcon, MoonIcon, SunIcon, DevicePhoneMobileIcon,  } from '@heroicons/react/24/outline';
import Icon from '@/components/ui/AppIcon';


type SettingsTab = 'general' | 'notifications' | 'privacy' | 'danger';

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'general', label: 'Général', icon: Cog6ToothIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon },
  { key: 'privacy', label: 'Confidentialité', icon: ShieldCheckIcon },
  { key: 'danger', label: 'Zone Danger', icon: ExclamationTriangleIcon },
];

const languages = ['Français', 'English', 'Português', 'Swahili', 'Lingala'];
const currencies = ['Franc Congolais (FC)', 'Dollar US (USD)', 'Euro (EUR)', 'Rand (ZAR)', 'Naira (NGN)'];
const timezones = ['Africa/Kinshasa (UTC+1)', 'Africa/Lagos (UTC+1)', 'Africa/Nairobi (UTC+3)', 'Europe/Paris (UTC+2)', 'America/New_York (UTC-4)'];

interface ToggleProps { checked: boolean; onChange: () => void; }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary' : 'bg-secondary border border-border'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function AccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [general, setGeneral] = useState({ language: 'Français', currency: 'Franc Congolais (FC)', timezone: 'Africa/Kinshasa (UTC+1)', theme: 'dark\' as \'dark\' | \'light' });
  const [notifs, setNotifs] = useState({ email_orders: true, email_messages: true, email_promotions: false, email_newsletter: false, push_orders: true, push_messages: true, push_security: true, push_updates: false });
  const [privacy, setPrivacy] = useState({ profile_public: true, show_email: false, show_phone: false, show_activity: true, allow_messages: true, data_analytics: true });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (key: keyof typeof notifs) => setNotifs((p) => ({ ...p, [key]: !p[key] }));
  const togglePrivacy = (key: keyof typeof privacy) => setPrivacy((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/member-dashboard" className="hover:text-foreground transition-colors">Tableau de bord</Link>
            <ChevronRightIcon className="w-3.5 h-3.5" />
            <span className="text-foreground">Paramètres du compte</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Paramètres du compte</h1>
          <p className="text-muted-foreground text-sm mt-1">Gérez vos préférences, notifications et confidentialité.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <aside className="lg:w-56 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === tab.key
                        ? tab.key === 'danger' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* General */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2"><GlobeAltIcon className="w-5 h-5 text-primary" /> Langue & Région</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Langue', value: general.language, options: languages, key: 'language' },
                      { label: 'Devise', value: general.currency, options: currencies, key: 'currency' },
                      { label: 'Fuseau horaire', value: general.timezone, options: timezones, key: 'timezone' },
                    ].map((field) => (
                      <div key={field.key} className={field.key === 'timezone' ? 'sm:col-span-2' : ''}>
                        <label className="text-sm font-medium text-foreground block mb-1.5">{field.label}</label>
                        <select
                          value={field.value}
                          onChange={(e) => setGeneral((p) => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                        >
                          {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                    {general.theme === 'dark' ? <MoonIcon className="w-5 h-5 text-primary" /> : <SunIcon className="w-5 h-5 text-primary" />}
                    Apparence
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'dark', label: 'Sombre', icon: MoonIcon, desc: 'Interface sombre premium' },
                      { value: 'light', label: 'Clair', icon: SunIcon, desc: 'Interface claire et nette' },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() => setGeneral((p) => ({ ...p, theme: theme.value as 'dark' | 'light' }))}
                          className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left ${general.theme === theme.value ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/40'}`}
                        >
                          {general.theme === theme.value && (
                            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <CheckIcon className="w-3 h-3 text-primary-foreground" />
                            </span>
                          )}
                          <Icon className={`w-6 h-6 mb-2 ${general.theme === theme.value ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-bold ${general.theme === theme.value ? 'text-primary' : 'text-foreground'}`}>{theme.label}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{theme.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button onClick={handleSave} className="gold-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2">
                    {saved ? <><CheckIcon className="w-4 h-4" /> Enregistré !</> : 'Enregistrer les modifications'}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {[
                  {
                    title: 'Notifications par e-mail', icon: GlobeAltIcon,
                    items: [
                      { key: 'email_orders', label: 'Commandes et livraisons', desc: 'Mises à jour sur vos commandes' },
                      { key: 'email_messages', label: 'Nouveaux messages', desc: 'Quand vous recevez un message' },
                      { key: 'email_promotions', label: 'Promotions et offres', desc: 'Réductions et offres spéciales' },
                      { key: 'email_newsletter', label: 'Newsletter EmpireKongo', desc: 'Actualités et tendances du marché' },
                    ]
                  },
                  {
                    title: 'Notifications push', icon: DevicePhoneMobileIcon,
                    items: [
                      { key: 'push_orders', label: 'Commandes en temps réel', desc: 'Alertes instantanées sur vos commandes' },
                      { key: 'push_messages', label: 'Messages instantanés', desc: 'Notifications de nouveaux messages' },
                      { key: 'push_security', label: 'Alertes de sécurité', desc: 'Connexions et activités suspectes' },
                      { key: 'push_updates', label: 'Mises à jour produits', desc: 'Nouvelles fonctionnalités disponibles' },
                    ]
                  },
                ].map((section) => {
                  const Icon = section.icon;
                  return (
                    <div key={section.title} className="bg-card border border-border rounded-2xl p-6">
                      <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2"><Icon className="w-5 h-5 text-primary" /> {section.title}</h2>
                      <div className="space-y-4">
                        {section.items.map((item) => (
                          <div key={item.key} className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm font-medium text-foreground">{item.label}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle checked={notifs[item.key as keyof typeof notifs]} onChange={() => toggleNotif(item.key as keyof typeof notifs)} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end">
                  <button onClick={handleSave} className="gold-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2">
                    {saved ? <><CheckIcon className="w-4 h-4" /> Enregistré !</> : 'Enregistrer les préférences'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-primary" /> Visibilité du profil</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'profile_public', label: 'Profil public', desc: 'Votre profil est visible par tous les membres' },
                      { key: 'show_email', label: 'Afficher l\'e-mail', desc: 'Votre adresse e-mail est visible sur votre profil' },
                      { key: 'show_phone', label: 'Afficher le téléphone', desc: 'Votre numéro est visible sur votre profil' },
                      { key: 'show_activity', label: 'Afficher l\'activité', desc: 'Les autres voient votre activité récente' },
                      { key: 'allow_messages', label: 'Autoriser les messages', desc: 'N\'importe quel membre peut vous envoyer un message' },
                      { key: 'data_analytics', label: 'Analyses de données', desc: 'Contribuer à l\'amélioration de la plateforme' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between gap-4 py-1">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle checked={privacy[item.key as keyof typeof privacy]} onChange={() => togglePrivacy(item.key as keyof typeof privacy)} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={handleSave} className="gold-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2">
                    {saved ? <><CheckIcon className="w-4 h-4" /> Enregistré !</> : 'Enregistrer les paramètres'}
                  </button>
                </div>
              </div>
            )}

            {/* Danger zone */}
            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-start gap-3 mb-5">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <h2 className="text-base font-bold text-red-400">Zone de danger</h2>
                      <p className="text-sm text-muted-foreground mt-1">Ces actions sont irréversibles. Procédez avec prudence.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: 'Désactiver le compte', desc: 'Votre compte sera masqué temporairement. Vous pourrez le réactiver en vous reconnectant.', btnLabel: 'Désactiver', btnClass: 'border border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/10' },
                      { title: 'Exporter mes données', desc: 'Téléchargez une copie de toutes vos données personnelles au format JSON.', btnLabel: 'Exporter', btnClass: 'border border-border text-foreground hover:border-primary/40' },
                    ].map((action) => (
                      <div key={action.title} className="flex items-center justify-between gap-4 p-4 bg-background rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
                        </div>
                        <button className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${action.btnClass}`}>{action.btnLabel}</button>
                      </div>
                    ))}

                    {/* Delete account */}
                    <div className="p-4 bg-background rounded-xl border border-red-500/20">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="text-sm font-semibold text-red-400">Supprimer le compte</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Suppression définitive de toutes vos données. Cette action est irréversible.</p>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)} className="shrink-0 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1.5">
                          <TrashIcon className="w-4 h-4" /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete modal */}
                {showDeleteModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                        <TrashIcon className="w-6 h-6 text-red-400" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Supprimer le compte ?</h3>
                      <p className="text-sm text-muted-foreground mb-4">Cette action est <span className="text-red-400 font-semibold">irréversible</span>. Toutes vos données seront supprimées définitivement.</p>
                      <p className="text-sm text-foreground mb-2">Tapez <span className="font-mono font-bold text-red-400">SUPPRIMER</span> pour confirmer :</p>
                      <input
                        type="text"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        placeholder="SUPPRIMER"
                        className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors mb-4"
                      />
                      <div className="flex gap-3">
                        <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(''); }} className="flex-1 bg-secondary border border-border text-foreground font-semibold py-3 rounded-xl hover:border-primary/40 transition-colors text-sm">Annuler</button>
                        <button disabled={deleteConfirm !== 'SUPPRIMER'} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-3 rounded-xl hover:bg-red-500/20 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">Supprimer définitivement</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
