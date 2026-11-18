import { Router } from 'express';
import {
  postBusinessPlan,
  getBusinessPlans,
  removeBusinessPlan,
  postChat,
} from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// AI endpoints require a valid JWT (Authorization: Bearer <token>).
router.use(requireAuth);

router.post('/business-plan', asyncHandler(postBusinessPlan));
router.get('/business-plans', asyncHandler(getBusinessPlans));
router.delete('/business-plans/:id', asyncHandler(removeBusinessPlan));
router.post('/chat', asyncHandler(postChat));

export default router;
