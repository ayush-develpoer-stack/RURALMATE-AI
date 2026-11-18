import { apiClient } from './api';
import type { ProductResult } from '@/types/product';

export interface ProductAnalyzeInput {
  productKey?: string;
  notes?: string;
}

export interface SavedProduct {
  id: string;
  productName: string;
  category: string;
  description: string;
  tags: string[];
  suggestedPrice: string;
  imageUrl: string | null;
  createdAt: string;
}

export const productService = {
  analyze: (input: ProductAnalyzeInput) =>
    apiClient.post<ProductResult & { saved?: boolean }>('/product/analyze', input),
  list: () =>
    apiClient.get<{ products: { key: string; productName: string; category: string }[] }>(
      '/product',
    ),
  mine: () => apiClient.get<{ products: SavedProduct[] }>('/product/mine'),
};
