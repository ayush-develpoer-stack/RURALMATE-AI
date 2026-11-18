import { Router } from 'express';
import { postAnalyzeProduct, getProducts, getMyProducts } from '../controllers/product.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

// Product endpoints require a valid JWT (Authorization: Bearer <token>).
router.use(requireAuth);

router.get('/', asyncHandler(getProducts));
router.get('/mine', asyncHandler(getMyProducts));
router.post('/analyze', asyncHandler(postAnalyzeProduct));

export default router;
