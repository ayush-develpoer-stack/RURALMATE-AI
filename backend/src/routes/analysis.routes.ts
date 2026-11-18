import { Router } from 'express';
import { submitProfile, getAnalysis, postAnalysis } from '../controllers/analysis.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.post('/profile', asyncHandler(submitProfile));
router.get('/', asyncHandler(getAnalysis));
router.post('/', asyncHandler(postAnalysis));

export default router;
