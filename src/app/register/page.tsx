'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const accountTypes = [
  { value: 'member', label: 'Membre', description: 'Commander, réserver et discuter avec les entreprises', icon: '👤' },
  { value: 'enterprise', label: 'Entreprise', description: 'Publiez vos produits, gérez vos commandes et votre vitrine', icon: '🏢' },
];

const passwordStrengthLevels = [
  { label: 'Très faible', color: 'bg-red-500', width: 'w-1/4' },
  { label: 'Faible', color: 'bg-orange-500', width: 'w-2/4' },
  { label: 'Moyen', color: 'bg-yellow-500', width: 'w-3/4' },
  { label: 'Fort', color: 'bg-green-500', width: 'w-full' },
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [accountType, setAccountType] = useState<'member' | 'enterprise'>('member');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    agree: false,
  });

  // Pre-select enterprise if ?type=enterprise is in URL
  useEffect(() => {
    if (searchParams?.get('type') === 'enterprise') {
      setAccountType('enterprise');
    }
  }, [searchParams]);

  const passwordStrength = getPasswordStrength(form.password);
  const strengthInfo = passwordStrength >= 0 ? passwordStrengthLevels[passwordStrength] : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D0D] via-[#1A1200] to-[#0D0D0D]" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 25% 35%, #F5A623 0%, transparent 55%), radial-gradient(circle at 75% 65%, #E8941A 0%, transparent 45%)',
          }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(245,166,35,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <AppLogo size={36} />
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-lg text-foreground tracking-tight">EMPIREKONGO</span>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Connecter, Valoriser</span>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wider uppercase">Inscription gratuite</span>
            </div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">
              Créez votre compte<br />
              <span className="gold-text">et développez</span><br />
              vos affaires
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Rejoignez la communauté EmpireKongo et accédez à un réseau d&apos;affaires africain en pleine croissance.
            </p>

            {/* Feature list */}
            <div className="space-y-3 pt-2">
              {[
                'Profil professionnel complet',
                'Accès à 5 420+ produits et services',
                'Messagerie directe avec les entreprises',
                'Tableau de bord analytique avancé',
                'Mise en avant de votre entreprise',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <CheckIcon className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="border-l-2 border-primary/50 pl-4">
            <p className="text-sm text-muted-foreground italic">
              &ldquo;En 3 mois, j&apos;ai multiplié mes contacts professionnels par 5 grâce à EmpireKongo.&rdquo;
            </p>
            <p className="text-xs text-primary font-semibold mt-2">— Jean-Paul M., Directeur Commercial</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={30} />
          <span className="font-extrabold text-base text-foreground tracking-tight">EMPIREKONGO</span>
        </div>

        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Créer un compte</h2>
            <p className="text-muted-foreground text-sm">
              Déjà membre ?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            {accountTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setAccountType(type.value as 'member' | 'enterprise')}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  accountType === type.value
                    ? 'border-primary bg-primary/10' :'border-border bg-secondary hover:border-primary/40'
                }`}
              >
                {accountType === type.value && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 text-primary-foreground" />
                  </span>
                )}
                <span className="text-lg mb-1">{type.icon}</span>
                <span className={`text-sm font-bold mb-0.5 ${accountType === type.value ? 'text-primary' : 'text-foreground'}`}>
                  {type.label}
                </span>
                <span className="text-xs text-muted-foreground leading-snug">{type.description}</span>
              </button>
            ))}
          </div>
          {accountType === 'enterprise' && (
            <div className="mb-5 px-3 py-2 rounded-lg bg-primary/8 border border-primary/20 flex items-start gap-2">
              <span className="text-primary text-sm mt-0.5">ℹ️</span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Le compte <span className="text-primary font-semibold">Entreprise</span> est réservé aux sociétés et professionnels souhaitant publier des produits et services. Pour acheter ou commander, choisissez <span className="font-semibold text-foreground">Membre</span>.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="firstName">Prénom</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-muted-foreground" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Jean"
                    required
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="lastName">Nom</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-muted-foreground" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Dupont"
                    required
                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Adresse e-mail</label>
              <div className="relative">
                <EnvelopeIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="phone">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></label>
              <div className="relative">
                <PhoneIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+243 000 000 000"
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Mot de passe</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 caractères"
                  required
                  className="w-full bg-secondary border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {/* Password strength */}
              {form.password && strengthInfo && (
                <div className="space-y-1 pt-1">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strengthInfo.color} ${strengthInfo.width}`} />
                  </div>
                  <p className={`text-xs font-medium ${strengthInfo.color.replace('bg-', 'text-')}`}>
                    {strengthInfo.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="confirm">Confirmer le mot de passe</label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                <input
                  id="confirm"
                  name="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={handleChange}
                  placeholder="Répétez le mot de passe"
                  required
                  className={`w-full bg-secondary border rounded-xl pl-10 pr-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 transition-colors ${
                    form.confirm && form.confirm !== form.password
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                      : form.confirm && form.confirm === form.password
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30' :'border-border focus:border-primary focus:ring-primary/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeSlashIcon className="w-[18px] h-[18px]" /> : <EyeIcon className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-400">Les mots de passe ne correspondent pas</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                checked={form.agree}
                onChange={handleChange}
                required
                className="w-4 h-4 mt-0.5 rounded border-border bg-secondary accent-primary cursor-pointer shrink-0"
              />
              <label htmlFor="agree" className="text-sm text-muted-foreground cursor-pointer select-none leading-relaxed">
                J&apos;accepte les{' '}
                <Link href="#" className="text-primary hover:underline">Conditions d&apos;utilisation</Link>
                {' '}et la{' '}
                <Link href="#" className="text-primary hover:underline">Politique de confidentialité</Link>
                {' '}d&apos;EmpireKongo.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.agree}
              className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Inscription 100% gratuite. Aucune carte bancaire requise.
          </p>
        </div>
      </div>
    </div>
  );
}
