import type { Request, Response } from 'express';
import { success, failure } from '../utils/response';
import { validateProfile, toNumber } from '../utils/validation';
import { generateAnalysis } from '../services/analysis.service';
import { saveProfile, getProfile, saveAnalysis } from '../services/userData.service';
import type { EntrepreneurProfile } from '../types/business';

function userId(req: Request): string {
  return req.user?.sub ?? '';
}

export async function submitProfile(req: Request, res: Response): Promise<Response> {
  const body = req.body as Record<string, unknown>;
  const parsed: Record<string, unknown> = {
    ...body,
    capital: toNumber(body.capital),
    monthlyRevenue: body.monthlyRevenue !== undefined ? toNumber(body.monthlyRevenue) : undefined,
    monthlyExpenses: body.monthlyExpenses !== undefined ? toNumber(body.monthlyExpenses) : undefined,
    existingLoans: body.existingLoans !== undefined ? toNumber(body.existingLoans) : undefined,
  };

  const { valid, errors } = validateProfile(parsed);
  if (!valid) return failure(res, errors.join(', '), 422);

  const profile = await saveProfile(userId(req), parsed as unknown as EntrepreneurProfile);
  return success(res, { profile });
}

export async function getAnalysis(req: Request, res: Response): Promise<Response> {
  const profile = await getProfile(userId(req));
  const analysis = generateAnalysis(profile);
  await saveAnalysis(userId(req), analysis);
  return success(res, analysis);
}

export async function postAnalysis(req: Request, res: Response): Promise<Response> {
  const body = req.body as Partial<EntrepreneurProfile>;
  const profile =
    body && Object.keys(body).length
      ? (body as EntrepreneurProfile)
      : await getProfile(userId(req));
  const analysis = generateAnalysis(profile);
  await saveAnalysis(userId(req), analysis);
  return success(res, analysis);
}
