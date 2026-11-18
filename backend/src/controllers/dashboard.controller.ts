import type { Request, Response } from 'express';
import { success } from '../utils/response';
import { getDashboard } from '../services/dashboard.service';

export async function getDashboardData(req: Request, res: Response): Promise<Response> {
  // User identity comes from the verified JWT — never from the client.
  const data = await getDashboard(req.user?.sub);
  return success(res, data);
}
