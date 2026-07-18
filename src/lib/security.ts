/**
 * Security utilities for EmpireKongo platform
 * - Input sanitization
 * - Rate limiting (client-side)
 * - XSS prevention helpers
 * - CSRF token generation
 */

// ─── Input Sanitization ────────────────────────────────────────────────────

/**
 * Strip HTML tags and dangerous characters from user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate phone number (international format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * Validate URL (http/https only)
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// ─── Password Strength ─────────────────────────────────────────────────────

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Très faible' | 'Faible' | 'Moyen' | 'Fort' | 'Très fort';
  color: string;
  suggestions: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score++;
  else suggestions.push('Au moins 8 caractères');

  if (password.length >= 12) score++;
  else if (password.length >= 8) suggestions.push('12 caractères ou plus recommandés');

  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('Ajouter une majuscule');

  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Ajouter un chiffre');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else suggestions.push('Ajouter un caractère spécial (!@#$...)');

  const labels: PasswordStrength['label'][] = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  return {
    score: Math.min(score, 4),
    label: labels[Math.min(score, 4)],
    color: colors[Math.min(score, 4)],
    suggestions,
  };
}

// ─── Rate Limiting (client-side) ───────────────────────────────────────────

const rateLimitStore: Record<string, { count: number; resetAt: number }> = {};

/**
 * Client-side rate limiter — returns true if action is allowed
 * @param key      Unique key for the action (e.g. 'login', 'register')
 * @param limit    Max attempts allowed
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitStore[key];

  if (!entry || now > entry.resetAt) {
    rateLimitStore[key] = { count: 1, resetAt: now + windowMs };
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}

export function getRateLimitRemaining(key: string, limit = 5): number {
  const entry = rateLimitStore[key];
  if (!entry || Date.now() > entry.resetAt) return limit;
  return Math.max(0, limit - entry.count);
}

// ─── CSRF Token ────────────────────────────────────────────────────────────

/**
 * Generate a simple CSRF token stored in sessionStorage
 * In production, use server-generated tokens
 */
export function getCsrfToken(): string {
  if (typeof window === 'undefined') return '';
  let token = sessionStorage.getItem('ek_csrf');
  if (!token) {
    token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    sessionStorage.setItem('ek_csrf', token);
  }
  return token;
}

// ─── File Upload Security ──────────────────────────────────────────────────

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateUploadedFile(
  file: File,
  allowedTypes: string[],
  maxBytes: number
): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Format non supporté. Formats acceptés : ${allowedTypes.map((t) => t.split('/')[1].toUpperCase()).join(', ')}` };
  }
  if (file.size > maxBytes) {
    const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `Fichier trop lourd. Maximum ${maxMb} Mo.` };
  }
  return { valid: true };
}

// ─── Session Security ──────────────────────────────────────────────────────

export const SESSION_KEY = 'ek_session';
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 min

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem('ek_csrf');
}

export function isSessionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.createdAt && Date.now() - parsed.createdAt < SESSION_TIMEOUT_MS;
  } catch {
    return false;
  }
}
