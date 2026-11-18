import type { ProductAnalyzeInput, ProductResult } from '../types/product';
import {
  PRODUCT_BLUEPRINTS,
  DEFAULT_PRODUCT_KEY,
  type ProductBlueprint,
} from '../data/products.data';
import { MARKET_OPPORTUNITIES } from '../data/markets.data';

function pickProduct(input: ProductAnalyzeInput): ProductBlueprint {
  if (input.productKey) {
    const match = PRODUCT_BLUEPRINTS.find((p) => p.key === input.productKey);
    if (match) return match;
  }
  return (
    PRODUCT_BLUEPRINTS.find((p) => p.key === DEFAULT_PRODUCT_KEY) ?? PRODUCT_BLUEPRINTS[0]
  );
}

export function analyzeProduct(input: ProductAnalyzeInput): ProductResult {
  const blueprint = pickProduct(input);
  return {
    productName: blueprint.productName,
    category: blueprint.category,
    description: blueprint.description,
    descriptionHindi: blueprint.descriptionHindi,
    tags: blueprint.tags,
    suggestedPriceMin: blueprint.suggestedPriceMin,
    suggestedPriceMax: blueprint.suggestedPriceMax,
    highlights: blueprint.highlights,
    marketOpportunities: MARKET_OPPORTUNITIES,
  };
}

export function listProducts(): { key: string; productName: string; category: string }[] {
  return PRODUCT_BLUEPRINTS.map((p) => ({
    key: p.key,
    productName: p.productName,
    category: p.category,
  }));
}
