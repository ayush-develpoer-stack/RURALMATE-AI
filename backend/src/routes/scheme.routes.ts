import { Router } from 'express';
import { getSchemes, postSchemeMatch } from '../controllers/scheme.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(getSchemes));
router.post('/match', asyncHandler(postSchemeMatch));

export default router;
