import type { Request, Response } from 'express';
import { success, failure } from '../utils/response';
import { isNonEmptyString } from '../utils/validation';
import { generateBusinessPlan, structuredChat, type BusinessPlanInput } from '../services/ai.service';
import { saveBusinessPlan, listBusinessPlans, deleteBusinessPlan } from '../services/userData.service';
import { OpenRouterError } from '../lib/openrouter';

/**
 * Map an OpenRouterError to an HTTP status + user-facing message.
 */
function mapAIError(err: unknown): { status: number; message: string } {
  if (err instanceof OpenRouterError) {
    switch (err.code) {
      case 'not_configured':
        return { status: 503, message: 'AI is not configured on the server.' };
      case 'unauthorized':
        return { status: 502, message: 'AI authentication failed. Please check the server API key.' };
      case 'rate_limit':
        return { status: 429, message: 'AI is busy right now. Please try again in a moment.' };
      case 'timeout':
        return { status: 504, message: 'The AI request timed out. Please try again.' };
      case 'server_error':
        return { status: 502, message: 'The AI provider is temporarily unavailable.' };
      case 'empty':
        return { status: 502, message: 'The AI returned an empty response. Please try again.' };
      default:
        return { status: 502, message: 'The AI request failed. Please try again.' };
    }
  }
  return { status: 500, message: 'Something went wrong. Please try again.' };
}

export async function postBusinessPlan(req: Request, res: Response): Promise<Response> {
  const body = (req.body ?? {}) as BusinessPlanInput;
  const plan = await generateBusinessPlan({
    profile: body.profile ?? {},
    analysis: body.analysis ?? {},
    financials: body.financials ?? {},
    topScheme: body.topScheme ?? {},
  });

  // Persist a snapshot for the authenticated user (best-effort — never blocks the plan).
  let saved = false;
  if (req.user?.sub) {
    try {
      await saveBusinessPlan(req.user.sub, {
        title: plan.title,
        subtitle: plan.subtitle,
        generatedBy: plan.generatedBy,
        sections: plan.sections,
      });
      saved = true;
    } catch {
      /* non-fatal — the plan is still returned */
    }
  }

  return success(res, { ...plan, saved });
}

export async function getBusinessPlans(req: Request, res: Response): Promise<Response> {
  if (!req.user?.sub) return failure(res, 'Authentication required', 401);
  const plans = await listBusinessPlans(req.user.sub);
  return success(res, { plans });
}

export async function removeBusinessPlan(req: Request, res: Response): Promise<Response> {
  if (!req.user?.sub) return failure(res, 'Authentication required', 401);
  const id = req.params.id;
  if (!isNonEmptyString(id)) return failure(res, 'A plan id is required', 422);
  const deleted = await deleteBusinessPlan(req.user.sub, id);
  if (!deleted) return failure(res, 'Plan not found', 404);
  return success(res, { deleted: true });
}

export async function postChat(req: Request, res: Response): Promise<Response> {
  const { message } = (req.body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(message)) {
    return failure(res, 'A non-empty "message" is required', 422);
  }
  if (message.length > 2000) {
    return failure(res, 'Message is too long (max 2000 characters)', 422);
  }
  try {
    const result = await structuredChat(message.trim(), req.user?.sub);
    return success(res, result);
  } catch (err) {
    // structuredChat already falls back to demo text on AI errors, so reaching
    // here is unexpected — map it to a safe standard error, never raw output.
    const { status, message: msg } = mapAIError(err);
    return failure(res, msg, status);
  }
}
