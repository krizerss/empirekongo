'use client';

import { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.');
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.');
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) return setError(updateError.message);
    setSuccess(true);
  }

  return <div className="min-h-screen bg-background flex items-center justify-center px-6"><div className="w-full max-w-md"><div className="flex justify-center mb-8"><AppLogo size={42} /></div>{success ? <div className="text-center space-y-5"><h1 className="text-3xl font-extrabold text-foreground">Mot de passe mis à jour</h1><p className="text-sm text-muted-foreground">Votre nouveau mot de passe est actif.</p><Link href="/login" className="inline-flex w-full justify-center gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl">Se connecter</Link></div> : <><h1 className="text-3xl font-extrabold text-foreground mb-2">Nouveau mot de passe</h1><p className="text-sm text-muted-foreground mb-7">Choisissez un mot de passe d’au moins 8 caractères.</p>{error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}<form onSubmit={handleSubmit} className="space-y-4"><input type="password" required minLength={8} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Nouveau mot de passe" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground" /><input type="password" required minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirmer le mot de passe" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground" /><button disabled={loading} className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl disabled:opacity-60">{loading?'Mise à jour…':'Réinitialiser le mot de passe'}</button></form></>}</div></div>;
}
