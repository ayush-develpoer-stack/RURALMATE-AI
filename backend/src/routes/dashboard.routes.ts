import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', requireAuth, asyncHandler(getDashboardData));

export default router;
