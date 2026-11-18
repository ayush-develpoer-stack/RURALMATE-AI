import { Router } from 'express';
import { calculateFinance } from '../controllers/finance.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/calculate', requireAuth, asyncHandler(calculateFinance));

export default router;
