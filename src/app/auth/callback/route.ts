// This file intentionally has no HTTP method exports.
// Auth callback routing is handled by src/app/auth/callback/page.tsx (server component redirect)
// and the actual token exchange is in src/app/api/auth/callback/route.ts
export const dynamic = 'force-dynamic';
