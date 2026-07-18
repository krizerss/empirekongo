'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { EnvelopeIcon, ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInput = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setStatus('idle');
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  }, [otp]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const newOtp = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    const nextEmpty = pasted.length < OTP_LENGTH ? pasted.length : OTP_LENGTH - 1;
    inputRefs.current[nextEmpty]?.focus();
  }, []);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < OTP_LENGTH) {
      setStatus('error');
      setErrorMsg('Veuillez entrer les 6 chiffres du code.');
      return;
    }
    setLoading(true);
    setStatus('idle');
    setTimeout(() => {
      setLoading(false);
      // Simulate: code "123456" is valid
      if (code === '123456') {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg('Code incorrect. Vérifiez votre e-mail et réessayez.');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    setResending(true);
    setOtp(Array(OTP_LENGTH).fill(''));
    setStatus('idle');
    setTimeout(() => {
      setResending(false);
      setCanResend(false);
      setCountdown(RESEND_COOLDOWN);
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const isComplete = otp.every((d) => d !== '');

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
              <EnvelopeIcon className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-extrabold text-foreground leading-tight">
              Vérifiez votre<br />
              <span className="gold-text">adresse e-mail</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
              Un code de vérification à 6 chiffres a été envoyé à votre adresse e-mail. Entrez-le pour activer votre compte.
            </p>
            <div className="space-y-3 pt-2">
              {['Code valable 10 minutes', 'Vérifiez vos spams si nécessaire', 'Renvoi possible après 60 secondes'].map((tip) => (
                <div key={tip} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-l-2 border-primary/50 pl-4">
            <p className="text-sm text-muted-foreground italic">&ldquo;La sécurité de votre compte est notre priorité absolue.&rdquo;</p>
            <p className="text-xs text-primary font-semibold mt-2">— Équipe EmpireKongo</p>
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
          <Link href="/register" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeftIcon className="w-4 h-4" />
            Retour à l&apos;inscription
          </Link>

          {status === 'success' ? (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                <CheckCircleIcon className="w-10 h-10 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">E-mail vérifié !</h2>
                <p className="text-muted-foreground text-sm">Votre compte a été activé avec succès. Vous pouvez maintenant vous connecter.</p>
              </div>
              <Link href="/login" className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all text-sm">
                Accéder à mon compte
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="lg:hidden w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <EnvelopeIcon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mb-2">Vérification e-mail</h2>
                <p className="text-muted-foreground text-sm">
                  Code envoyé à <span className="text-foreground font-semibold">v***@exemple.com</span>
                </p>
              </div>

              {status === 'error' && (
                <div className="mb-5 flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                  <ExclamationTriangleIcon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{errorMsg}</p>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-6">
                {/* OTP inputs */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-3 block">Code de vérification</label>
                  <div className="flex gap-3 justify-between" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleInput(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-secondary text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                          digit ? 'border-primary bg-primary/5' : 'border-border'
                        } ${status === 'error' ? 'border-red-500/60' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {canResend ? 'Code expiré ?' : (
                      <span>Renvoyer dans <span className="text-primary font-semibold tabular-nums">{countdown}s</span></span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || resending}
                    className={`flex items-center gap-1.5 font-semibold transition-colors ${canResend && !resending ? 'text-primary hover:text-primary/80' : 'text-muted-foreground cursor-not-allowed'}`}
                  >
                    {resending ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <ArrowPathIcon className="w-4 h-4" />}
                    Renvoyer le code
                  </button>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${(otp.filter(Boolean).length / OTP_LENGTH) * 100}%` }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !isComplete}
                  className="w-full gold-gradient text-primary-foreground font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Vérifier le code
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-muted-foreground mt-6">
                Mauvaise adresse e-mail ?{' '}
                <Link href="/register" className="text-primary hover:underline font-semibold">Modifier</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
