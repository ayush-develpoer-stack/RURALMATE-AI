import type { Request, Response } from 'express';
import { success, failure } from '../utils/response';
import { analyzeProduct, listProducts } from '../services/product.service';
import { saveProduct, listUserProducts } from '../services/userData.service';
import type { ProductAnalyzeInput } from '../types/product';

function priceRange(min: number, max: number): string {
  return `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`;
}

export async function postAnalyzeProduct(req: Request, res: Response): Promise<Response> {
  const body = (req.body ?? {}) as ProductAnalyzeInput & { imageUrl?: string };
  const result = analyzeProduct(body);

  // Persist the generated listing for the authenticated user (best-effort).
  let saved = false;
  if (req.user?.sub) {
    try {
      await saveProduct(req.user.sub, {
        productName: result.productName,
        category: result.category,
        description: result.description,
        tags: result.tags,
        suggestedPrice: priceRange(result.suggestedPriceMin, result.suggestedPriceMax),
        imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : null,
        marketOpportunities: result.marketOpportunities,
      });
      saved = true;
    } catch {
      /* non-fatal — the listing is still returned */
    }
  }

  return success(res, { ...result, saved });
}

export function getProducts(_req: Request, res: Response): Response {
  return success(res, { products: listProducts() });
}

export async function getMyProducts(req: Request, res: Response): Promise<Response> {
  if (!req.user?.sub) return failure(res, 'Authentication required', 401);
  const products = await listUserProducts(req.user.sub);
  return success(res, { products });
}
