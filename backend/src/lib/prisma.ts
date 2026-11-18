/**
 * Prisma client with graceful fallback.
 *
 * Returns a PrismaClient ONLY when DATABASE_URL is configured AND the generated
 * client is available (`npx prisma generate` has run). Otherwise returns null and
 * the app falls back to an in-memory store — so the demo runs without Supabase.
 */
type AnyPrisma = any;

let prisma: AnyPrisma | null = null;
let initialized = false;

export function getPrisma(): AnyPrisma | null {
  if (initialized) return prisma;
  initialized = true;

  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    // eslint-disable-next-line no-console
    console.log('ℹ️  DATABASE_URL not set — using in-memory store (demo mode).');
    prisma = null;
    return prisma;
  }

  try {
    // Lazy require so a missing generated client doesn't crash the server.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    // eslint-disable-next-line no-console
    console.log('✅ Prisma connected (PostgreSQL).');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      '⚠️  Prisma client unavailable (run `npx prisma generate`). Falling back to in-memory store.',
    );
    prisma = null;
  }

  return prisma;
}

export function isDbEnabled(): boolean {
  return getPrisma() !== null;
}
