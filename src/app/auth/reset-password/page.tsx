'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, CheckIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const strengthLevels = [
  { label: 'Très faible', color: 'bg-red-500', textColor: 'text-red-400', bars: 1 },
  { label: 'Faible', color: 'bg-orange-500', textColor: 'text-orange-400', bars: 2 },
  { label: 'Moyen', color: 'bg-yellow-500', textColor: 'text-yellow-400', bars: 3 },
  { label: 'Fort', color: 'bg-green-500', textColor: 'text-green-400', bars: 4 },
];

function getStrength(password: string): number {
  if (!password) return -1;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score - 1;
}

const requirements = [
  { label: 'Au moins 8 caractères', test: (p: string) => p.length >= 8 },
  { label: 'Une lettre majuscule', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Un caractère spécial (!@#$...)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const strength = getStrength(password);
  const strengthInfo = strength >= 0 ? strengthLevels[strength] : null;
  const passwordsMatch = !!confirm && password === confirm;
  const passwordsMismatch = !!confirm && password !== confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (strength < 2) {
      setError('Votre mot de passe est trop faible. Utilisez au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.');
      return;
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Le lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien.');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
        return;
      }

      await supabase.auth.signOut();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #F5A623 0%, transparent 50%), radial-gradient(circle at 70% 70%, #E8941A 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3"><AppLogo size={36} /><div className="flex flex-col leading-none"><span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span><span className="text-[10px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span></div></div>
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"><LockClosedIcon className="w-10 h-10 text-primary" /></div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">Créez un<br /><span className="gold-text">mot de passe</span><br />sécurisé</h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">Choisissez un mot de passe fort pour protéger votre compte EmpireKongo.</p>
            <div className="space-y-3 pt-2">{requirements.map((req) => (<div key={req.label} className={`flex items-center gap-3 transition-opacity ${password ? '' : 'opacity-50'}`}><div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${req.test(password) ? 'bg-green-500/20 border border-green-500/40' : 'bg-secondary border border-border'}`}>{req.test(password) && <CheckIcon className="w-3 h-3 text-green-400" />}</div><span className={`text-sm transition-colors ${req.test(password) ? 'text-green-400' : 'text-muted-foreground'}`}>{req.label}</span></div>))}</div>
          </div>
          <div className="border-l-2 border-primary/50 pl-4"><p className="text-sm text-muted-foreground italic">&ldquo;Un bon mot de passe est votre première ligne de défense.&rdquo;</p><p className="text-xs text-primary font-semibold mt-2">— Équipe Sécurité EmpireKongo</p></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="lg:hidden flex items-center gap-2 mb-10"><AppLogo size={30} /><span className="font-extrabold text-base text-foreground tracking-tight">EMPIREKONGO</span></div>
        <div className="w-full max-w-md">
          <Link href="/auth/forgot-password" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"><ArrowLeftIcon className="w-4 h-4" />Retour</Link>
          {success ? (
            <div className="space-y-6 text-center"><div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto"><CheckCircleIcon className="w-10 h-10 text-green-400" /></div><div><h2 className="text-2xl font-extrabold text-foreground mb-2">Mot de passe mis à jour !</h2><p className="text-muted-foreground text-sm">Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.</p></div><Link href="/login" className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">Se connecter</Link></div>
          ) : (
            <>
              <div className="mb-8"><div className="lg:hidden w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"><LockClosedIcon className="w-7 h-7 text-primary" /></div><h2 className="text-3xl font-extrabold text-foreground mb-2">Nouveau mot de passe</h2><p className="text-muted-foreground text-sm">Choisissez un mot de passe fort et mémorable.</p></div>
              {error && <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"><ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-sm text-red-400">{error}</p></div>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="password">Nouveau mot de passe</label><div className="relative"><LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" /><input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" required className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}</button></div>
                  {password && <div className="space-y-1.5 pt-1"><div className="flex gap-1">{[0,1,2,3].map((i) => <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strengthInfo && i < strengthInfo.bars ? strengthInfo.color : 'bg-secondary'}`} />)}</div>{strengthInfo && <p className={`text-xs font-semibold ${strengthInfo.textColor}`}>{strengthInfo.label}</p>}</div>}
                </div>
                <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="confirm">Confirmer le mot de passe</label><div className="relative"><LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" /><input id="confirm" type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(''); }} placeholder="••••••••" required className={`w-full bg-secondary border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${passwordsMismatch ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' : passwordsMatch ? 'border-green-500/60 focus:border-green-500 focus:ring-green-500/20' : 'border-border focus:border-primary focus:ring-primary/30'}`} /><button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">{showConfirm ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}</button></div>{passwordsMatch && <p className="text-xs text-green-400 flex items-center gap-1"><CheckIcon className="w-3 h-3" /> Les mots de passe correspondent</p>}{passwordsMismatch && <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>}</div>
                <div className="lg:hidden bg-secondary border border-border rounded-xl p-4 space-y-2"><p className="text-xs font-semibold text-foreground mb-2">Exigences :</p>{requirements.map((req) => <div key={req.label} className="flex items-center gap-2"><div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${req.test(password) ? 'bg-green-500/20' : 'bg-secondary border border-border'}`}>{req.test(password) && <CheckIcon className="w-2.5 h-2.5 text-green-400" />}</div><span className={`text-xs ${req.test(password) ? 'text-green-400' : 'text-muted-foreground'}`}>{req.label}</span></div>)}</div>
                <button type="submit" disabled={loading} className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm">{loading ? <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <><LockClosedIcon className="w-4 h-4" />Réinitialiser le mot de passe</>}</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
