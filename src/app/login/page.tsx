'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, ArrowRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { checkRateLimit, getRateLimitRemaining, isValidEmail, sanitizeInput } from '@/lib/security';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side rate limiting — max 5 attempts per minute
    if (!checkRateLimit('login', 5, 60_000)) {
      const remaining = getRateLimitRemaining('login', 5);
      setError(`Trop de tentatives. Veuillez patienter avant de réessayer. (${remaining} essais restants)`);
      return;
    }

    // Input validation
    const cleanEmail = sanitizeInput(email);
    if (!isValidEmail(cleanEmail)) {
      setError('Adresse e-mail invalide.');
      return;
    }
    if (password.length < 6) {
      setError('Mot de passe trop court.');
      return;
    }

    setLoading(true);
    setAttempts((prev) => prev + 1);

    // Simulate auth — replace with real Supabase auth
    setTimeout(() => {
      setLoading(false);
      // On success, store session and redirect
      // useAuth().login({ id: '...', name: '...', email: cleanEmail, role: 'client' });
      // router.push('/member-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 30% 40%, #F5A623 0%, transparent 50%), radial-gradient(circle at 70% 70%, #E8941A 0%, transparent 40%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">Plateforme B2B Africaine</span>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">
              Rejoignez le réseau<br />
              <span className="gold-text">d&apos;affaires africain</span><br />
              le plus dynamique
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Connectez-vous à plus de 12 350 membres, 1 250 entreprises et 5 420 produits sur une seule plateforme.
            </p>
            <div className="flex gap-8 pt-2">
              {[
                { value: '12K+', label: 'Membres' },
                { value: '1.2K+', label: 'Entreprises' },
                { value: '5.4K+', label: 'Produits' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l-2 border-primary/50 pl-4">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;EmpireKongo a transformé la façon dont je développe mes affaires en Afrique.&rdquo;
            </p>
            <p className="text-xs text-primary font-semibold mt-2">— Marie K., Fondatrice de TechAfrique</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <AppLogo size={30} />
          <span className="font-extrabold text-base text-foreground tracking-tight">EMPIREKONGO</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Bon retour 👋</h2>
            <p className="text-muted-foreground text-sm">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">
                S&apos;inscrire gratuitement
              </Link>
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Adresse e-mail
              </label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  autoComplete="email"
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Mot de passe
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-secondary accent-primary cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                Se souvenir de moi
              </label>
            </div>

            {/* Attempts warning */}
            {attempts >= 3 && (
              <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2.5">
                <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-400">
                  Plusieurs tentatives échouées. Vérifiez vos identifiants ou réinitialisez votre mot de passe.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou continuer avec</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', icon: 'G' },
              { label: 'Facebook', icon: 'f' },
            ].map((provider) => (
              <button
                key={provider.label}
                type="button"
                className="flex items-center justify-center gap-2.5 bg-secondary border border-border rounded-xl py-3 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-secondary/80 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[11px] font-bold text-primary">
                  {provider.icon}
                </span>
                {provider.label}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            En vous connectant, vous acceptez nos{' '}
            <Link href="#" className="text-primary hover:underline">
              Conditions d&apos;utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="#" className="text-primary hover:underline">
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
