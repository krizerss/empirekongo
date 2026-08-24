'use client';
import React, { useState } from 'react';
import { LinkIcon, ClipboardDocumentIcon, CheckIcon, UsersIcon, CurrencyDollarIcon, ChartBarIcon, ShareIcon, GiftIcon, InformationCircleIcon,  } from '@heroicons/react/24/outline';

interface Referral {
  id: number;
  name: string;
  initials: string;
  date: string;
  status: 'actif' | 'en_attente' | 'inactif';
  commission: number;
  purchases: number;
}

const referrals: Referral[] = [
  { id: 1, name: 'Jean Mutombo', initials: 'JM', date: '15 Juil 2024', status: 'actif', commission: 12500, purchases: 3 },
  { id: 2, name: 'Marie Lukusa', initials: 'ML', date: '10 Juil 2024', status: 'actif', commission: 8750, purchases: 2 },
  { id: 3, name: 'Paul Nkosi', initials: 'PN', date: '05 Juil 2024', status: 'en_attente', commission: 0, purchases: 0 },
  { id: 4, name: 'Ange Kabila', initials: 'AK', date: '01 Juil 2024', status: 'actif', commission: 21000, purchases: 5 },
  { id: 5, name: 'Christelle Banza', initials: 'CB', date: '25 Juin 2024', status: 'inactif', commission: 3500, purchases: 1 },
];

const statusConfig = {
  actif: { label: 'Actif', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20' },
  en_attente: { label: 'En attente', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  inactif: { label: 'Inactif', color: 'text-muted-foreground', bg: 'bg-secondary border-border' },
};

const commissionHistory = [
  { month: 'Avr', amount: 15000 },
  { month: 'Mai', amount: 22500 },
  { month: 'Juin', amount: 18000 },
  { month: 'Juil', amount: 45750 },
];

function formatCDF(amount: number) {
  return new Intl.NumberFormat('fr-CD').format(amount) + ' CDF';
}

export default function AffiliationPage() {
  const [copied, setCopied] = useState(false);
  const affiliateLink = 'https://empirekongo.com/ref/CYK-2024-7842';

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommission = referrals.reduce((sum, r) => sum + r.commission, 0);
  const activeReferrals = referrals.filter((r) => r.status === 'actif').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground mb-1">Programme d'affiliation</h1>
        <p className="text-sm text-muted-foreground">Parrainez des membres et gagnez des commissions sur leurs achats.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Filleuls actifs</p>
          <p className="text-2xl font-extrabold text-foreground">{activeReferrals}</p>
          <p className="text-xs text-green-400 mt-1">+2 ce mois</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Total filleuls</p>
          <p className="text-2xl font-extrabold text-foreground">{referrals.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Inscrits</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Commissions</p>
          <p className="text-2xl font-extrabold text-primary">{formatCDF(totalCommission)}</p>
          <p className="text-xs text-muted-foreground mt-1">Total gagné</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground mb-2">Taux commission</p>
          <p className="text-2xl font-extrabold text-foreground">5%</p>
          <p className="text-xs text-muted-foreground mt-1">Par achat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Affiliate link */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Votre lien de parrainage</h3>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2.5 text-xs text-muted-foreground font-mono truncate">
                {affiliateLink}
              </div>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  copied
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400' :'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {copied ? <CheckIcon className="w-4 h-4" /> : <ClipboardDocumentIcon className="w-4 h-4" />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <ShareIcon className="w-3.5 h-3.5" />
                Partager WhatsApp
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <ShareIcon className="w-3.5 h-3.5" />
                Partager Facebook
              </button>
            </div>
          </div>

          {/* Commission history */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Historique des commissions</h3>
            </div>
            <div className="flex items-end gap-3 h-28">
              {commissionHistory.map((item) => {
                const maxAmount = Math.max(...commissionHistory.map((i) => i.amount));
                const heightPct = (item.amount / maxAmount) * 100;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">{formatCDF(item.amount).replace(' CDF', '')}</span>
                    <div className="w-full rounded-t-md bg-primary/20 relative overflow-hidden" style={{ height: `${heightPct}%` }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md" style={{ height: '100%' }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referrals table */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <UsersIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Mes filleuls</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Membre</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="text-right px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Commission</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r) => {
                    const sc = statusConfig[r.status];
                    return (
                      <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary">{r.initials}</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">{r.name}</p>
                              <p className="text-[10px] text-muted-foreground">{r.purchases} achat(s)</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{r.date}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.bg} ${sc.color}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-xs font-bold text-foreground">
                          {r.commission > 0 ? formatCDF(r.commission) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Withdraw */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <CurrencyDollarIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Solde disponible</h3>
            </div>
            <p className="text-3xl font-extrabold text-primary mb-1">{formatCDF(45750)}</p>
            <p className="text-xs text-muted-foreground mb-4">Disponible au retrait</p>
            <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
              Retirer mes gains
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-2">Minimum de retrait : 10 000 CDF</p>
          </div>

          {/* How it works */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <InformationCircleIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Comment ça marche ?</h3>
            </div>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Partagez votre lien unique avec vos contacts' },
                { step: '2', text: 'Ils s\'inscrivent sur EmpireKongo via votre lien' },
                { step: '3', text: 'Vous gagnez 5% sur chacun de leurs achats' },
                { step: '4', text: 'Retirez vos gains à tout moment' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-primary">{item.step}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <GiftIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Bonus palier</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Atteignez 10 filleuls actifs et obtenez un bonus de 50 000 CDF !</p>
            <div className="w-full bg-secondary rounded-full h-2 mb-1">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${(activeReferrals / 10) * 100}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">{activeReferrals}/10 filleuls actifs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
