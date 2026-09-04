'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { createClient } from '@/lib/supabase/client';

const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data, error }) => {
      if (!active || error || !data.user) return;
      if (data.user.email_confirmed_at) setStatus('success');
    });
    return () => { active = false; };
  }, []);

  const handleResend = async () => {
    if (!canResend || !email) {
      if (!email) {
        setStatus('error');
        setMessage('Adresse e-mail introuvable. Retournez à l’inscription pour recommencer.');
      }
      return;
    }

    setResending(true);
    setStatus('idle');
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/member-dashboard` },
    });

    setResending(false);
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setCanResend(false);
    setCountdown(RESEND_COOLDOWN);
    setMessage('Un nouveau lien de vérification a été envoyé à votre adresse e-mail.');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #F5A623 0%, transparent 50%), radial-gradient(circle at 70% 70%, #E8941A 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 0), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 0)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3"><span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span></div>
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"><EnvelopeIcon className="w-10 h-10 text-primary" /></div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">Vérifiez votre<br /><span className="gold-text">adresse e-mail</span></h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">Un lien sécurisé de vérification a été envoyé à votre adresse e-mail. Cliquez dessus pour confirmer votre compte.</p>
            <div className="space-y-3 pt-2">
              {['Lien sécurisé envoyé par Supabase', 'Vérifiez vos spams si nécessaire', 'Nouveau lien possible après 60 secondes'].map((tip) => (
                <div key={tip} className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /><span className="text-sm text-muted-foreground">{tip}</span></div>
              ))}
            </div>
          </div>
          <div className="border-l-2 border-primary/50 pl-4"><p className="text-sm text-muted-foreground italic">&ldquo;La sécurité de votre compte est notre priorité absolue.&rdquo;</p><p className="text-xs text-primary font-semibold mt-2">— Équipe EmpireKongo</p></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="lg:hidden flex items-center gap-2 mb-10"><span className="font-extrabold text-base text-foreground tracking-tight">EMPIREKONGO</span></div>
        <div className="w-full max-w-md">
          <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"><ArrowLeftIcon className="w-4 h-4" />Retour à l&apos;inscription</Link>

          {status === 'success' ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto"><CheckCircleIcon className="w-10 h-10 text-green-400" /></div>
              <div><h2 className="text-2xl font-extrabold text-foreground mb-2">E-mail vérifié !</h2><p className="text-muted-foreground text-sm">Votre adresse e-mail est confirmée par Supabase. Vous pouvez maintenant accéder à votre compte.</p></div>
              <Link href="/login" className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">Accéder à mon compte</Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="lg:hidden w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4"><EnvelopeIcon className="w-7 h-7 text-primary" /></div>
                <h2 className="text-3xl font-extrabold text-foreground mb-2">Vérification e-mail</h2>
                <p className="text-muted-foreground text-sm">Lien envoyé à <span className="text-foreground font-semibold">{email || 'votre adresse e-mail'}</span></p>
              </div>

              {status === 'error' && <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"><ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /><p className="text-sm text-red-400">{message}</p></div>}
              {message && status !== 'error' && <div className="mb-5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">{message}</div>}

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-secondary/50 p-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto"><EnvelopeIcon className="w-7 h-7 text-primary" /></div>
                  <h3 className="font-bold text-foreground">Consultez votre boîte e-mail</h3>
                  <p className="text-sm text-muted-foreground">Ouvrez le message envoyé par EmpireKongo/Supabase puis cliquez sur le lien de confirmation. La vérification sera effectuée directement par Supabase.</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{canResend ? 'Vous n’avez rien reçu ?' : <>Renvoyer dans <span className="text-primary font-semibold tabular-nums">{countdown}s</span></>}</span>
                  <button type="button" onClick={() => void handleResend()} disabled={!canResend || resending} className={`flex items-center gap-1.5 font-semibold transition-colors ${canResend && !resending ? 'text-primary hover:text-primary/80' : 'text-muted-foreground cursor-not-allowed'}`}>
                    <ArrowPathIcon className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />Renvoyer le lien
                  </button>
                </div>

                <Link href="/login" className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">J&apos;ai déjà vérifié mon e-mail</Link>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-6">Mauvaise adresse e-mail ? <Link href="/register" className="text-primary hover:underline font-semibold">Modifier</Link></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
