import { randomUUID } from 'crypto';
import { getPrisma } from '../lib/prisma';
import type { UserRecord } from '../types/auth';

/**
 * User persistence abstraction.
 * Uses Prisma (PostgreSQL) when available; otherwise an in-memory Map so the
 * demo works without a configured database.
 */

const memoryUsers = new Map<string, UserRecord>(); // key: email (lowercased)

export const userStore = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const key = email.trim().toLowerCase();
    const prisma = getPrisma();
    if (prisma) {
      return prisma.user.findUnique({ where: { email: key } });
    }
    return memoryUsers.get(key) ?? null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const prisma = getPrisma();
    if (prisma) {
      return prisma.user.findUnique({ where: { id } });
    }
    for (const u of memoryUsers.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<UserRecord> {
    const key = data.email.trim().toLowerCase();
    const prisma = getPrisma();
    if (prisma) {
      return prisma.user.create({
        data: { name: data.name, email: key, passwordHash: data.passwordHash },
      });
    }
    const now = new Date();
    const user: UserRecord = {
      id: randomUUID(),
      name: data.name,
      email: key,
      passwordHash: data.passwordHash,
      createdAt: now,
      updatedAt: now,
    };
    memoryUsers.set(key, user);
    return user;
  },
};
