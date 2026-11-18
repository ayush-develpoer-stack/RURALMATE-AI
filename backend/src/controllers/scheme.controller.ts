import type { Request, Response } from 'express';
import { success } from '../utils/response';
import { toNumber } from '../utils/validation';
import { matchSchemes, type SchemeMatchInput } from '../services/scheme.service';
import { getProfile } from '../services/userData.service';
import type { BusinessCategory } from '../types/business';

function userId(req: Request): string {
  return req.user?.sub ?? '';
}

export async function getSchemes(req: Request, res: Response): Promise<Response> {
  const profile = await getProfile(userId(req));
  const input: SchemeMatchInput = {
    category: profile?.category,
    businessStatus: profile?.businessStatus,
    projectCost: undefined,
  };
  return success(res, matchSchemes(input));
}

export async function postSchemeMatch(req: Request, res: Response): Promise<Response> {
  const body = req.body as Record<string, unknown>;
  const profile = await getProfile(userId(req));
  const input: SchemeMatchInput = {
    category: (body.category as BusinessCategory) ?? profile?.category,
    businessStatus: (body.businessStatus as 'new' | 'existing') ?? profile?.businessStatus,
    projectCost: body.projectCost !== undefined ? toNumber(body.projectCost) : undefined,
  };
  return success(res, matchSchemes(input));
}
