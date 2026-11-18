import { randomUUID } from 'crypto';
import { getPrisma } from '../lib/prisma';
import type { EntrepreneurProfile, AnalysisResult } from '../types/business';
import type { FinanceResult } from '../types/finance';

/**
 * Per-user persistence for profile / analysis / finance.
 * Uses Prisma (Supabase) when available; falls back to in-memory maps keyed by
 * userId so the app still works without a database.
 */

const memProfiles = new Map<string, EntrepreneurProfile>();
const memAnalysis = new Map<string, AnalysisResult>();
const memFinance = new Map<string, FinanceResult>();

/* ---- Profile ---- */

/** Compose a display label from the structured location parts. */
function composeLocation(parts: {
  village?: string | null;
  town?: string | null;
  district?: string | null;
  state?: string | null;
}): string {
  return [parts.village, parts.town, parts.district, parts.state]
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .join(', ');
}

function profileToDb(p: EntrepreneurProfile) {
  const hasStructured = Boolean(p.village || p.town || p.district || p.state);
  // Backward compatibility: an older single-string profile (no structured fields)
  // has its free-text location stored in `state` so nothing is lost.
  const state = p.state ?? (hasStructured ? null : p.location || null);
  return {
    businessStatus: p.businessStatus,
    category: p.category,
    village: p.village ?? null,
    town: p.town ?? null,
    district: p.district ?? null,
    state,
    capital: p.capital,
    experience: p.experience,
    goal: p.goal,
    revenue: p.monthlyRevenue ?? null,
    expenses: p.monthlyExpenses ?? null,
    loans: p.existingLoans ?? null,
    products: p.products ?? [],
  };
}

function dbToProfile(row: any, name: string): EntrepreneurProfile {
  const composed = composeLocation(row);
  return {
    name,
    businessStatus: row.businessStatus,
    category: row.category,
    location: composed || row.state || row.district || '',
    village: row.village ?? undefined,
    town: row.town ?? undefined,
    district: row.district ?? undefined,
    state: row.state ?? undefined,
    capital: row.capital,
    experience: row.experience,
    goal: row.goal,
    monthlyRevenue: row.revenue ?? undefined,
    monthlyExpenses: row.expenses ?? undefined,
    existingLoans: row.loans ?? undefined,
    products: row.products ?? [],
  };
}

export async function saveProfile(
  userId: string,
  profile: EntrepreneurProfile,
): Promise<EntrepreneurProfile> {
  const prisma = getPrisma();
  if (prisma) {
    const data = profileToDb(profile);
    await prisma.entrepreneurProfile.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
  } else {
    memProfiles.set(userId, profile);
  }
  return profile;
}

export async function getProfile(userId: string): Promise<EntrepreneurProfile | null> {
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!row) return null;
    return dbToProfile(row, row.user?.name ?? 'Entrepreneur');
  }
  return memProfiles.get(userId) ?? null;
}

/* ---- Analysis snapshot ---- */

export async function saveAnalysis(userId: string, a: AnalysisResult): Promise<void> {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.businessAnalysis.create({
      data: {
        userId,
        recommendedBusiness: a.recommendedBusiness,
        feasibilityScore: a.feasibilityScore,
        demandScore: a.localDemand,
        competitionScore: a.competition,
        accessibilityScore: a.accessibility,
        capitalFitScore: a.capitalFit,
        seasonalityScore: a.seasonality,
        confidenceScore: a.dataConfidence,
        reasons: a.reasons,
      },
    });
  } else {
    memAnalysis.set(userId, a);
  }
}

/* ---- Finance snapshot ---- */

export async function saveFinance(userId: string, f: FinanceResult): Promise<void> {
  const prisma = getPrisma();
  if (prisma) {
    await prisma.financialPlan.create({
      data: {
        userId,
        projectCost: f.projectCost,
        ownCapital: f.ownCapital,
        fundingGap: f.financingGap,
        expectedRevenue: f.monthlyRevenue,
        monthlyExpenses: f.monthlyExpenses,
        monthlySurplus: f.monthlySurplus,
        breakEven: f.breakEvenMonths ?? null,
        emi: f.estimatedEmi,
      },
    });
  } else {
    memFinance.set(userId, f);
  }
}

/* ---- Business plans (persisted history) ---- */

export interface BusinessPlanSection {
  title: string;
  body: string;
}

export interface SavedBusinessPlan {
  id: string;
  title: string;
  subtitle: string;
  generatedBy: 'ai' | 'demo';
  sections: BusinessPlanSection[];
  createdAt: string;
}

export interface BusinessPlanInputToSave {
  title: string;
  subtitle?: string;
  generatedBy: 'ai' | 'demo';
  sections: BusinessPlanSection[];
}

const memPlans = new Map<string, SavedBusinessPlan[]>();

export async function saveBusinessPlan(
  userId: string,
  plan: BusinessPlanInputToSave,
): Promise<SavedBusinessPlan> {
  const prisma = getPrisma();
  const content = { generatedBy: plan.generatedBy, sections: plan.sections };
  if (prisma) {
    const row = await prisma.businessPlan.create({
      data: {
        userId,
        title: plan.title,
        subtitle: plan.subtitle ?? null,
        content,
      },
    });
    return {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle ?? '',
      generatedBy: plan.generatedBy,
      sections: plan.sections,
      createdAt: row.createdAt.toISOString(),
    };
  }
  const saved: SavedBusinessPlan = {
    id: randomUUID(),
    title: plan.title,
    subtitle: plan.subtitle ?? '',
    generatedBy: plan.generatedBy,
    sections: plan.sections,
    createdAt: new Date().toISOString(),
  };
  const list = memPlans.get(userId) ?? [];
  list.unshift(saved);
  memPlans.set(userId, list);
  return saved;
}

export async function listBusinessPlans(
  userId: string,
  limit = 10,
): Promise<SavedBusinessPlan[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await prisma.businessPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((row: any) => {
      const content = (row.content ?? {}) as {
        generatedBy?: 'ai' | 'demo';
        sections?: BusinessPlanSection[];
      };
      return {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle ?? '',
        generatedBy: content.generatedBy ?? 'demo',
        sections: content.sections ?? [],
        createdAt: row.createdAt.toISOString(),
      };
    });
  }
  return (memPlans.get(userId) ?? []).slice(0, limit);
}

/**
 * Delete a business plan owned by the given user. Ownership is enforced by
 * scoping the delete to (id AND userId) so a user can only delete their own.
 * Returns true when a row was removed.
 */
export async function deleteBusinessPlan(userId: string, id: string): Promise<boolean> {
  const prisma = getPrisma();
  if (prisma) {
    const result = await prisma.businessPlan.deleteMany({ where: { id, userId } });
    return result.count > 0;
  }
  const list = memPlans.get(userId) ?? [];
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  list.splice(idx, 1);
  memPlans.set(userId, list);
  return true;
}

/* ---- Products (persisted catalog) ---- */

export interface SavedProduct {
  id: string;
  productName: string;
  category: string;
  description: string;
  tags: string[];
  suggestedPrice: string;
  imageUrl: string | null;
  createdAt: string;
}

export interface ProductInputToSave {
  productName: string;
  category: string;
  description: string;
  tags: string[];
  suggestedPrice: string;
  imageUrl?: string | null;
  marketOpportunities?: unknown;
}

const memProducts = new Map<string, SavedProduct[]>();

export async function saveProduct(
  userId: string,
  product: ProductInputToSave,
): Promise<SavedProduct> {
  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.product.create({
      data: {
        userId,
        productName: product.productName,
        category: product.category,
        description: product.description,
        tags: product.tags,
        suggestedPrice: product.suggestedPrice,
        imageUrl: product.imageUrl ?? null,
        marketOpportunities: (product.marketOpportunities ?? null) as any,
      },
    });
    return {
      id: row.id,
      productName: row.productName,
      category: row.category,
      description: row.description,
      tags: row.tags,
      suggestedPrice: row.suggestedPrice,
      imageUrl: row.imageUrl ?? null,
      createdAt: row.createdAt.toISOString(),
    };
  }
  const saved: SavedProduct = {
    id: randomUUID(),
    productName: product.productName,
    category: product.category,
    description: product.description,
    tags: product.tags,
    suggestedPrice: product.suggestedPrice,
    imageUrl: product.imageUrl ?? null,
    createdAt: new Date().toISOString(),
  };
  const list = memProducts.get(userId) ?? [];
  list.unshift(saved);
  memProducts.set(userId, list);
  return saved;
}

export async function listUserProducts(userId: string, limit = 20): Promise<SavedProduct[]> {
  const prisma = getPrisma();
  if (prisma) {
    const rows = await prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((row: any) => ({
      id: row.id,
      productName: row.productName,
      category: row.category,
      description: row.description,
      tags: row.tags,
      suggestedPrice: row.suggestedPrice,
      imageUrl: row.imageUrl ?? null,
      createdAt: row.createdAt.toISOString(),
    }));
  }
  return (memProducts.get(userId) ?? []).slice(0, limit);
}
