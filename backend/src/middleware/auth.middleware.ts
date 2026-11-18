import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';
import { failure } from '../utils/response';

/**
 * Protects routes. Expects: Authorization: Bearer <token>
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    failure(res, 'Authentication required', 401);
    return;
  }
  const token = header.slice(7).trim();
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    failure(res, 'Invalid or expired token', 401);
  }
}
