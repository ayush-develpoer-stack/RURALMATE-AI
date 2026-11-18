import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async (or sync) Express handler so any thrown error / rejected promise
 * is forwarded to the central error middleware instead of becoming an unhandled
 * rejection. Without this, an async controller that rejects (e.g. a transient
 * database error) leaves the request hanging with no response. On the success
 * path the handler's return value (a Response) is ignored and next() is never
 * called, so existing behaviour is unchanged.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => unknown,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
