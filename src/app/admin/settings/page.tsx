'use client';
import React, { useState } from 'react';
import { Cog6ToothIcon, ShoppingBagIcon, CreditCardIcon, ShieldCheckIcon, BellIcon, CheckCircleIcon,  } from '@heroicons/react/24/outline';

type SettingsTab = 'general' | 'marketplace' | 'subscriptions' | 'security' | 'notifications';

interface TabConfig {
  key: SettingsTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabConfig[] = [
  { key: 'general',       label: 'Général',       icon: Cog6ToothIcon },
  { key: 'marketplace',   label: 'Marketplace',   icon: ShoppingBagIcon },
  { key: 'subscriptions', label: 'Abonnements',   icon: CreditCardIcon },
  { key: 'security',      label: 'Sécurité',      icon: ShieldCheckIcon },
  { key: 'notifications', label: 'Notifications', icon: BellIcon },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [toast, setToast] = useState<string | null>(null);

  // General settings state
  const [platformName, setPlatformName] = useState('EmpireKongo');
  const [platformEmail, setPlatformEmail] = useState('contact@empirekongo.cd');
  const [platformPhone, setPlatformPhone] = useState('+243 81 000 0000');
  const [currency, setCurrency] = useState('CDF');

  // Marketplace settings state
  const [commissionRate, setCommissionRate] = useState('2');
  const [autoApproveProducts, setAutoApproveProducts] = useState(false);
  const [autoApproveSuppliers, setAutoApproveSuppliers] = useState(false);

  // Subscription plans state
  const [freePlanName, setFreePlanName] = useState('Free');
  const [premiumPlanName, setPremiumPlanName] = useState('Premium');
  const [premiumPrice, setPremiumPrice] = useState('9900');
  const [premiumDuration, setPremiumDuration] = useState('30');

  // Security settings state
  const [requireEmailVerif, setRequireEmailVerif] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [twoFactorAdmin, setTwoFactorAdmin] = useState(false);

  // Notification settings state
  const [emailNewUser, setEmailNewUser] = useState(true);
  const [emailNewOrder, setEmailNewOrder] = useState(true);
  const [emailNewReport, setEmailNewReport] = useState(true);
  const [systemNotifEnabled, setSystemNotifEnabled] = useState(true);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave() {
    showToast('Paramètres sauvegardés avec succès.');
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold animate-in bg-green-500/15 border-green-500/30 text-green-400">
          <CheckCircleIcon className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Paramètres</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configuration globale de la plateforme EmpireKongo</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-primary/15 text-primary border border-primary/25' :'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">

        {/* General */}
        {activeTab === 'general' && (
          <>
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Informations générales</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Nom de la plateforme</label>
                <input
                  type="text"
                  value={platformName}
                  onChange={e => setPlatformName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Email de contact</label>
                <input
                  type="email"
                  value={platformEmail}
                  onChange={e => setPlatformEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Téléphone</label>
                <input
                  type="text"
                  value={platformPhone}
                  onChange={e => setPlatformPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">Devise principale</label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="CDF">CDF — Franc Congolais</option>
                  <option value="USD">USD — Dollar Américain</option>
                  <option value="EUR">EUR — Euro</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Marketplace */}
        {activeTab === 'marketplace' && (
          <>
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Paramètres du marketplace</h2>
            <div className="space-y-5">
              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  Taux de commission (%)
                  <span className="ml-2 text-primary font-bold">Actuellement : {commissionRate}%</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={commissionRate}
                  onChange={e => setCommissionRate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Commission appliquée sur chaque transaction : montant × {commissionRate} / 100
                </p>
              </div>
              <div className="space-y-3">
                <ToggleSetting
                  label="Validation automatique des produits"
                  description="Les produits sont publiés sans validation manuelle"
                  value={autoApproveProducts}
                  onChange={setAutoApproveProducts}
                />
                <ToggleSetting
                  label="Validation automatique des fournisseurs"
                  description="Les fournisseurs sont approuvés sans vérification manuelle"
                  value={autoApproveSuppliers}
                  onChange={setAutoApproveSuppliers}
                />
              </div>
            </div>
          </>
        )}

        {/* Subscriptions */}
        {activeTab === 'subscriptions' && (
          <>
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Plans d'abonnement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-secondary/30 border border-border rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground">Plan Gratuit</h3>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Nom du plan</label>
                  <input
                    type="text"
                    value={freePlanName}
                    onChange={e => setFreePlanName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Prix : Gratuit (0 CDF)</p>
              </div>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-primary">Plan Premium</h3>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Nom du plan</label>
                  <input
                    type="text"
                    value={premiumPlanName}
                    onChange={e => setPremiumPlanName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">Prix (CDF)</label>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={e => setPremiumPrice(e.target.value)}
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">Durée (jours)</label>
                    <input
                      type="number"
                      value={premiumDuration}
                      onChange={e => setPremiumDuration(e.target.value)}
                      className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <>
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Paramètres de sécurité</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Timeout de session (minutes)</label>
                  <input
                    type="number"
                    value={sessionTimeout}
                    onChange={e => setSessionTimeout(e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2">Tentatives de connexion max</label>
                  <input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={e => setMaxLoginAttempts(e.target.value)}
                    className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <ToggleSetting
                  label="Vérification email obligatoire"
                  description="Les utilisateurs doivent vérifier leur email avant de se connecter"
                  value={requireEmailVerif}
                  onChange={setRequireEmailVerif}
                />
                <ToggleSetting
                  label="Authentification 2FA pour les admins"
                  description="Exiger une authentification à deux facteurs pour les comptes admin"
                  value={twoFactorAdmin}
                  onChange={setTwoFactorAdmin}
                />
              </div>
            </div>
          </>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <>
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Paramètres des notifications</h2>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notifications Email</h3>
              <ToggleSetting
                label="Nouvel utilisateur inscrit"
                description="Recevoir un email à chaque nouvelle inscription"
                value={emailNewUser}
                onChange={setEmailNewUser}
              />
              <ToggleSetting
                label="Nouvelle commande"
                description="Recevoir un email à chaque nouvelle commande"
                value={emailNewOrder}
                onChange={setEmailNewOrder}
              />
              <ToggleSetting
                label="Nouveau signalement"
                description="Recevoir un email à chaque nouveau signalement"
                value={emailNewReport}
                onChange={setEmailNewReport}
              />
              <div className="pt-3 border-t border-border">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Notifications Système</h3>
                <ToggleSetting
                  label="Notifications système activées"
                  description="Afficher les notifications dans le panneau admin"
                  value={systemNotifEnabled}
                  onChange={setSystemNotifEnabled}
                />
              </div>
            </div>
          </>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-4 border-t border-border">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Sauvegarder les paramètres
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, value, onChange }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50 hover:border-border transition-colors">
      <div className="flex-1 min-w-0 mr-4">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${value ? 'bg-primary' : 'bg-secondary border border-border'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
