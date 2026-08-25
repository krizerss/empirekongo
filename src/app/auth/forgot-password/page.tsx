'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
    });
    setLoading(false);
    if (resetError) return setError(resetError.message);
    setSent(true);
  }

  return <div className="min-h-screen bg-background flex items-center justify-center px-6"><div className="w-full max-w-md"><div className="flex justify-center mb-8"><AppLogo size={42} /></div>{sent ? <div className="text-center space-y-5"><h1 className="text-3xl font-extrabold text-foreground">E-mail envoyé</h1><p className="text-sm text-muted-foreground">Si un compte existe pour <span className="text-foreground font-semibold">{email}</span>, Supabase a envoyé un lien sécurisé de réinitialisation.</p><Link href="/login" className="inline-flex w-full justify-center gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl">Retour à la connexion</Link></div> : <><h1 className="text-3xl font-extrabold text-foreground mb-2">Mot de passe oublié ?</h1><p className="text-sm text-muted-foreground mb-7">Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>{error && <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}<form onSubmit={handleSubmit} className="space-y-5"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@exemple.com" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground" /><button disabled={loading} className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl disabled:opacity-60">{loading?'Envoi…':'Envoyer le lien'}</button></form><p className="text-center text-sm text-muted-foreground mt-6"><Link href="/login" className="text-primary font-semibold">Retour à la connexion</Link></p></>}</div></div>;
}
