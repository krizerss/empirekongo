'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheckIcon, LockClosedIcon, DevicePhoneMobileIcon, EyeIcon, EyeSlashIcon, ChevronRightIcon, ExclamationTriangleIcon, XMarkIcon, ComputerDesktopIcon, MapPinIcon, ClockIcon, CheckCircleIcon, ArrowPathIcon,  } from '@heroicons/react/24/outline';
import Icon from '@/components/ui/AppIcon';


const activeSessions = [
  { id: 1, device: 'Chrome sur Windows 11', location: 'Kinshasa, RDC', ip: '197.243.xx.xx', lastActive: 'Maintenant', current: true, icon: ComputerDesktopIcon },
  { id: 2, device: 'Safari sur iPhone 15', location: 'Kinshasa, RDC', ip: '197.243.xx.xx', lastActive: 'Il y a 2 heures', current: false, icon: DevicePhoneMobileIcon },
  { id: 3, device: 'Firefox sur macOS', location: 'Brazzaville, Congo', ip: '196.12.xx.xx', lastActive: 'Il y a 3 jours', current: false, icon: ComputerDesktopIcon },
];

const loginHistory = [
  { id: 1, device: 'Chrome / Windows', location: 'Kinshasa, RDC', date: '18 Juil 2026, 14:32', status: 'success' },
  { id: 2, device: 'iPhone / Safari', location: 'Kinshasa, RDC', date: '17 Juil 2026, 09:15', status: 'success' },
  { id: 3, device: 'Inconnu / Android', location: 'Lagos, Nigeria', date: '15 Juil 2026, 22:47', status: 'failed' },
  { id: 4, device: 'Chrome / Windows', location: 'Kinshasa, RDC', date: '14 Juil 2026, 11:20', status: 'success' },
  { id: 5, device: 'Firefox / macOS', location: 'Brazzaville, Congo', date: '12 Juil 2026, 16:05', status: 'success' },
];

function getPasswordStrength(password: string): number {
  if (!password) return -1;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score - 1;
}

const strengthLevels = [
  { label: 'Très faible', color: 'bg-red-500', textColor: 'text-red-400', bars: 1 },
  { label: 'Faible', color: 'bg-orange-500', textColor: 'text-orange-400', bars: 2 },
  { label: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-400', bars: 3 },
  { label: 'Fort', color: 'bg-green-500', textColor: 'text-green-400', bars: 4 },
];

export default function SecuritySettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [sessions, setSessions] = useState(activeSessions);

  const strength = getPasswordStrength(passwords.newPass);
  const strengthInfo = strength >= 0 ? strengthLevels[strength] : null;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (!passwords.current) { setPwError('Entrez votre mot de passe actuel.'); return; }
    if (strength < 2) { setPwError('Nouveau mot de passe trop faible.'); return; }
    if (passwords.newPass !== passwords.confirm) { setPwError('Les mots de passe ne correspondent pas.'); return; }
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPwSaved(true);
      setPasswords({ current: '', newPass: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 3000);
    }, 1500);
  };

  const handleToggle2FA = () => {
    setTwoFALoading(true);
    setTimeout(() => {
      setTwoFALoading(false);
      setTwoFAEnabled((v) => !v);
    }, 1000);
  };

  const revokeSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Link href="/member-dashboard" className="hover:text-foreground transition-colors">Tableau de bord</Link>
          <ChevronRightIcon className="w-3.5 h-3.5" />
          <span className="text-foreground">Sécurité</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Paramètres de sécurité</h1>
        <p className="text-muted-foreground text-sm mb-8">Protégez votre compte avec des paramètres de sécurité avancés.</p>

        <div className="space-y-6">
          {/* Change password */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2"><LockClosedIcon className="w-5 h-5 text-primary" /> Changer le mot de passe</h2>

            {pwSaved && (
              <div className="mb-4 flex items-center gap-2.5 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                <CheckCircleIcon className="w-4 h-4 text-green-400 shrink-0" />
                <p className="text-sm text-green-400">Mot de passe mis à jour avec succès !</p>
              </div>
            )}
            {pwError && (
              <div className="mb-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{pwError}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { id: 'current', label: 'Mot de passe actuel', value: passwords.current, show: showCurrent, setShow: setShowCurrent, key: 'current' },
                { id: 'newPass', label: 'Nouveau mot de passe', value: passwords.newPass, show: showNew, setShow: setShowNew, key: 'newPass' },
                { id: 'confirm', label: 'Confirmer le nouveau mot de passe', value: passwords.confirm, show: showConfirm, setShow: setShowConfirm, key: 'confirm' },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{field.label}</label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                    <input
                      type={field.show ? 'text' : 'password'}
                      value={field.value}
                      onChange={(e) => { setPasswords((p) => ({ ...p, [field.key]: e.target.value })); setPwError(''); }}
                      placeholder="••••••••"
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                    <button type="button" onClick={() => field.setShow((v: boolean) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {field.show ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {field.key === 'newPass' && passwords.newPass && (
                    <div className="space-y-1 pt-1">
                      <div className="flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strengthInfo && i < strengthInfo.bars ? strengthInfo.color : 'bg-secondary'}`} />
                        ))}
                      </div>
                      {strengthInfo && <p className={`text-xs font-semibold ${strengthInfo.textColor}`}>{strengthInfo.label}</p>}
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={pwLoading} className="gold-gradient text-primary-foreground font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2 disabled:opacity-60">
                  {pwLoading ? <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><LockClosedIcon className="w-4 h-4" /> Mettre à jour</>}
                </button>
              </div>
            </form>
          </div>

          {/* 2FA */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${twoFAEnabled ? 'bg-green-500/10 border border-green-500/20' : 'bg-secondary border border-border'}`}>
                  <ShieldCheckIcon className={`w-5 h-5 ${twoFAEnabled ? 'text-green-400' : 'text-muted-foreground'}`} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Authentification à deux facteurs (2FA)</h2>
                  <p className="text-sm text-muted-foreground mt-1">Ajoutez une couche de sécurité supplémentaire avec un code SMS ou une application d&apos;authentification.</p>
                  {twoFAEnabled && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">Activé</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={twoFALoading}
                className={`shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${twoFAEnabled ? 'bg-secondary border border-border text-foreground hover:border-red-500/40 hover:text-red-400' : 'gold-gradient text-primary-foreground hover:opacity-90'}`}
              >
                {twoFALoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : twoFAEnabled ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>

          {/* Active sessions */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2"><DevicePhoneMobileIcon className="w-5 h-5 text-primary" /> Sessions actives</h2>
              <button onClick={() => setSessions(sessions.filter((s) => s.current))} className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">Révoquer toutes les autres</button>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => {
                const Icon = session.icon;
                return (
                  <div key={session.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${session.current ? 'border-primary/20 bg-primary/5' : 'border-border bg-secondary/50'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${session.current ? 'bg-primary/10' : 'bg-secondary'}`}>
                      <Icon className={`w-5 h-5 ${session.current ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground truncate">{session.device}</p>
                        {session.current && <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">Session actuelle</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPinIcon className="w-3 h-3" />{session.location}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><ClockIcon className="w-3 h-3" />{session.lastActive}</span>
                      </div>
                    </div>
                    {!session.current && (
                      <button onClick={() => revokeSession(session.id)} className="shrink-0 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
              {sessions.length === 1 && (
                <p className="text-sm text-muted-foreground text-center py-2">Aucune autre session active.</p>
              )}
            </div>
          </div>

          {/* Login history */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2"><ClockIcon className="w-5 h-5 text-primary" /> Historique de connexions</h2>
            <div className="space-y-2">
              {loginHistory.map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${entry.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{entry.device}</p>
                    <p className="text-xs text-muted-foreground">{entry.location}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                    <span className={`text-[10px] font-semibold ${entry.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                      {entry.status === 'success' ? 'Réussie' : 'Échouée'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
