'use client';
import React from 'react';
import Link from 'next/link';
import { XMarkIcon, LockClosedIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface AuthGuardModalProps {
  action: 'order' | 'reserve' | 'message' | 'contact';
  onClose: () => void;
}

const actionLabels: Record<string, string> = {
  order: 'commander un produit',
  reserve: 'réserver un produit',
  message: 'envoyer un message',
  contact: 'contacter un vendeur',
};

export default function AuthGuardModal({ action, onClose }: AuthGuardModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
              <LockClosedIcon className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-sm font-extrabold text-foreground">Connexion requise</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Vous devez avoir un compte pour{' '}
            <span className="text-foreground font-semibold">{actionLabels[action]}</span>.
            Connectez-vous ou créez un compte gratuitement.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col gap-3 mb-5">
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-2.5 gold-gradient text-primary-foreground rounded-xl text-sm font-bold text-center hover:opacity-90 transition-opacity"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="w-full py-2.5 bg-secondary border border-border text-foreground rounded-xl text-sm font-semibold text-center hover:border-primary/40 transition-colors"
            >
              Créer un compte membre
            </Link>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">Vous êtes une entreprise ?</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Enterprise account */}
          <Link
            href="/register?type=enterprise"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-primary/30 bg-primary/5 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
          >
            <BuildingOfficeIcon className="w-4 h-4" />
            Créer un compte entreprise
          </Link>

          <p className="text-center text-[11px] text-muted-foreground mt-4">
            La recherche et la navigation restent accessibles à tous.
          </p>
        </div>
      </div>
    </div>
  );
}
