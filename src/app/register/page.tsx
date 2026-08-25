'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon, PhoneIcon, ArrowRightIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const accountTypes = [
  { value: 'member', label: 'Membre', description: 'Commander, réserver et discuter avec les entreprises', icon: '👤' },
  { value: 'enterprise', label: 'Entreprise', description: 'Publier vos produits, gérer vos commandes et votre vitrine', icon: '🏢' },
] as const;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountType, setAccountType] = useState<'member' | 'enterprise'>('member');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', agree: false });

  useEffect(() => {
    if (searchParams.get('type') === 'enterprise') setAccountType('enterprise');
  }, [searchParams]);

  function update(name: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!form.agree) return setError('Vous devez accepter les conditions d’utilisation.');
    if (form.password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (form.password !== form.confirm) return setError('Les mots de passe ne correspondent pas.');

    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(),
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/member-dashboard`,
        data: { first_name: form.firstName.trim(), last_name: form.lastName.trim(), phone: form.phone.trim() || null, account_type: accountType },
      },
    });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    setLoading(false);
    if (data.session) {
      router.replace('/member-dashboard');
      router.refresh();
    } else {
      setMessage('Compte créé. Consultez votre e-mail pour confirmer votre adresse avant de vous connecter.');
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden"><div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" /><div className="relative z-10 flex flex-col justify-between p-12 w-full"><div className="flex items-center gap-3"><AppLogo size={36} /><div className="flex flex-col leading-none"><span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span><span className="text-[10px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span></div></div><div className="space-y-6"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /><span className="text-xs font-semibold text-primary uppercase">Inscription gratuite</span></div><h1 className="text-4xl font-extrabold text-foreground leading-tight">Créez votre compte<br /><span className="gold-text">et développez</span><br />vos affaires</h1><p className="text-muted-foreground text-sm leading-relaxed max-w-sm">Rejoignez la communauté EmpireKongo et accédez à un réseau d’affaires africain.</p><div className="space-y-3">{['Profil professionnel complet','Accès aux produits et services','Messagerie avec les entreprises','Tableau de bord personnel'].map(feature => <div key={feature} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"><CheckIcon className="w-3 h-3 text-primary" /></div><span className="text-sm text-muted-foreground">{feature}</span></div>)}</div></div><div className="border-l-2 border-primary/50 pl-4"><p className="text-sm text-muted-foreground italic">« Connecter, valoriser, développer. »</p><p className="text-xs text-primary font-semibold mt-2">— EmpireKongo</p></div></div></div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 overflow-y-auto"><div className="lg:hidden flex items-center gap-2 mb-8"><AppLogo size={30} /><span className="font-extrabold text-base text-foreground">EMPIREKONGO</span></div><div className="w-full max-w-lg"><div className="mb-7"><h2 className="text-3xl font-extrabold text-foreground mb-2">Créer un compte</h2><p className="text-muted-foreground text-sm">Déjà membre ? <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link></p></div>
        {error && <div className="mb-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"><ExclamationTriangleIcon className="w-4 h-4 text-red-400" /><p className="text-sm text-red-400">{error}</p></div>}
        {message && <div className="mb-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}
        <div className="grid grid-cols-2 gap-3 mb-5">{accountTypes.map(type => <button key={type.value} type="button" onClick={() => setAccountType(type.value)} className={`relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all ${accountType === type.value ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/40'}`}><span className="text-lg mb-1">{type.icon}</span><span className="text-sm font-bold text-foreground">{type.label}</span><span className="text-xs text-muted-foreground leading-snug">{type.description}</span></button>)}</div>
        <form onSubmit={handleSubmit} className="space-y-4"><div className="grid grid-cols-2 gap-3">{[['firstName','Prénom','Jean'],['lastName','Nom','Dupont']].map(([name,label,placeholder]) => <div key={name} className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor={name}>{label}</label><div className="relative"><UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] text-muted-foreground" /><input id={name} name={name} value={form[name as keyof typeof form] as string} onChange={e => update(name,e.target.value)} placeholder={placeholder} required className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground" /></div></div>)}</div>
          <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="email">Adresse e-mail</label><div className="relative"><EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] text-muted-foreground" /><input id="email" type="email" value={form.email} onChange={e => update('email',e.target.value)} placeholder="vous@exemple.com" required className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground" /></div></div>
          <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="phone">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></label><div className="relative"><PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] text-muted-foreground" /><input id="phone" type="tel" value={form.phone} onChange={e => update('phone',e.target.value)} placeholder="+243 000 000 000" className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground" /></div></div>
          <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="password">Mot de passe</label><div className="relative"><LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] text-muted-foreground" /><input id="password" type={showPassword?'text':'password'} value={form.password} onChange={e => update('password',e.target.value)} placeholder="Minimum 8 caractères" required className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground" /><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{showPassword?<EyeSlashIcon className="w-[18px]"/>:<EyeIcon className="w-[18px]"/>}</button></div></div>
          <div className="space-y-1.5"><label className="text-sm font-medium text-foreground" htmlFor="confirm">Confirmer le mot de passe</label><div className="relative"><LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] text-muted-foreground" /><input id="confirm" type={showConfirm?'text':'password'} value={form.confirm} onChange={e => update('confirm',e.target.value)} placeholder="Répétez le mot de passe" required className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground" /><button type="button" onClick={()=>setShowConfirm(v=>!v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{showConfirm?<EyeSlashIcon className="w-[18px]"/>:<EyeIcon className="w-[18px]"/>}</button></div></div>
          <label className="flex items-start gap-2.5 text-sm text-muted-foreground"><input type="checkbox" checked={form.agree} onChange={e=>update('agree',e.target.checked)} className="mt-1 w-4 h-4 accent-primary" />J’accepte les conditions d’utilisation et la politique de confidentialité.</label>
          <button type="submit" disabled={loading} className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">{loading?<span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"/>:<>Créer mon compte<ArrowRightIcon className="w-4 h-4"/></>}</button>
        </form></div></div>
    </div>
  );
}

export default function RegisterPage() { return <Suspense fallback={<div className="min-h-screen bg-background" />}><RegisterForm /></Suspense>; }
