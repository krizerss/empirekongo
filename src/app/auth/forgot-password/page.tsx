'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { EnvelopeIcon, ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { isValidEmail, sanitizeInput } from '@/lib/security';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = sanitizeInput(email);
    if (!isValidEmail(clean)) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #F5A623 0%, transparent 50%), radial-gradient(circle at 70% 70%, #E8941A 0%, transparent 40%)' }} />
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheckIcon className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">
              Récupérez<br />
              <span className="gold-text">votre accès</span><br />
              en toute sécurité
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Entrez votre adresse e-mail et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
            </p>
            <div className="space-y-4 pt-2">
              {[
                { step: '01', text: 'Entrez votre adresse e-mail' },
                { step: '02', text: 'Recevez le lien de réinitialisation' },
                { step: '03', text: 'Créez un nouveau mot de passe sécurisé' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{item.step}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l-2 border-primary/50 pl-4">
            <p className="text-sm text-muted-foreground italic">&ldquo;Votre sécurité est notre engagement. Lien valable 30 minutes.&rdquo;</p>
            <p className="text-xs text-primary font-semibold mt-2">— Équipe Sécurité EmpireKongo</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <AppLogo size={30} />
          <span className="font-extrabold text-base text-foreground tracking-tight">EMPIREKONGO</span>
        </div>

        <div className="w-full max-w-md">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à la connexion
          </Link>

          {sent ? (
            <div className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircleIcon className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">E-mail envoyé !</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Un lien de réinitialisation a été envoyé à <span className="text-foreground font-semibold">{email}</span>. Vérifiez votre boîte de réception et vos spams.
                </p>
              </div>
              <div className="bg-secondary border border-border rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-foreground">À savoir :</p>
                <ul className="space-y-1.5">
                  {['Le lien expire dans 30 minutes', 'Vérifiez vos spams si nécessaire', 'Un seul lien actif à la fois'].map((tip) => (
                    <li key={tip} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="w-full bg-secondary border border-border text-foreground font-semibold py-3 rounded-xl hover:border-primary/40 transition-colors text-sm"
              >
                Utiliser une autre adresse
              </button>
              <Link href="/login" className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="lg:hidden w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mb-2">Mot de passe oublié ?</h2>
                <p className="text-muted-foreground text-sm">Pas de panique. Entrez votre e-mail et on s&apos;occupe du reste.</p>
              </div>

              {error && (
                <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">Adresse e-mail</label>
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="vous@exemple.com"
                      required
                      autoComplete="email"
                      className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Envoyer le lien
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Vous vous souvenez ?{' '}
                <Link href="/login" className="text-primary font-semibold hover:underline">Se connecter</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
