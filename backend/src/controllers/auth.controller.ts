import type { Request, Response } from 'express';
import { success, failure } from '../utils/response';
import { isNonEmptyString } from '../utils/validation';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  AuthError,
} from '../services/auth.service';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function register(req: Request, res: Response): Promise<Response> {
  const { name, email, password } = (req.body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(name)) return failure(res, 'Name is required', 422);
  if (!isNonEmptyString(email) || !EMAIL_RE.test(email)) {
    return failure(res, 'A valid email is required', 422);
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    return failure(res, 'Password must be at least 6 characters', 422);
  }
  try {
    const result = await registerUser(name.trim(), email.trim(), password);
    return success(res, result, 201);
  } catch (err) {
    if (err instanceof AuthError) return failure(res, err.message, err.status);
    return failure(res, 'Unable to register. Please try again.', 500);
  }
}

export async function login(req: Request, res: Response): Promise<Response> {
  const { email, password } = (req.body ?? {}) as Record<string, unknown>;
  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    return failure(res, 'Email and password are required', 422);
  }
  try {
    const result = await loginUser(email.trim(), password);
    return success(res, result);
  } catch (err) {
    if (err instanceof AuthError) return failure(res, err.message, err.status);
    return failure(res, 'Unable to log in. Please try again.', 500);
  }
}

export async function me(req: Request, res: Response): Promise<Response> {
  if (!req.user) return failure(res, 'Authentication required', 401);
  try {
    const user = await getCurrentUser(req.user.sub);
    return success(res, { user });
  } catch (err) {
    if (err instanceof AuthError) return failure(res, err.message, err.status);
    return failure(res, 'Unable to load user.', 500);
  }
}
