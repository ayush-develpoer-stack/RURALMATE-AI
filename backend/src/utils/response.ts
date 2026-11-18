import type { Response } from 'express';

export function success<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ success: true, data });
}

export function failure(res: Response, message: string, status = 400): Response {
  return res.status(status).json({ success: false, message });
}
