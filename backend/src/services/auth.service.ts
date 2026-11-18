import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userStore } from './user.store';
import type { AuthTokenPayload, PublicUser, UserRecord } from '../types/auth';

/**
 * JWT signing secret. In production a real secret is mandatory — we never fall
 * back to a public default there, because that would let anyone forge tokens.
 * In non-production (local/dev) a fixed dev secret keeps the DX friction-free.
 */
const JWT_SECRET: string = (() => {
  const fromEnv = process.env.JWT_SECRET?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production.');
  }
  // eslint-disable-next-line no-console
  console.warn('⚠️  JWT_SECRET not set — using an insecure dev secret (non-production only).');
  return 'ruralmate-dev-secret-change-me';
})();
const JWT_EXPIRES_IN = '7d';
const SALT_ROUNDS = 10;

function toPublic(user: UserRecord): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function signToken(user: UserRecord): string {
  const payload: AuthTokenPayload = { sub: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<{ user: PublicUser; token: string }> {
  const existing = await userStore.findByEmail(email);
  if (existing) {
    throw new AuthError('An account with this email already exists', 409);
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userStore.create({ name, email, passwordHash });
  return { user: toPublic(user), token: signToken(user) };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<{ user: PublicUser; token: string }> {
  const user = await userStore.findByEmail(email);
  if (!user) throw new AuthError('Invalid email or password', 401);
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AuthError('Invalid email or password', 401);
  return { user: toPublic(user), token: signToken(user) };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await userStore.findById(userId);
  if (!user) throw new AuthError('User not found', 404);
  return toPublic(user);
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
