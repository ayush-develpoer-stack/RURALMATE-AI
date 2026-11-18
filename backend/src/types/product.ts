export interface ProductAnalyzeInput {
  productKey?: string;
  productName?: string;
  category?: string;
  notes?: string;
}

export interface ProductResult {
  productName: string;
  category: string;
  description: string;
  descriptionHindi: string;
  tags: string[];
  suggestedPriceMin: number;
  suggestedPriceMax: number;
  highlights: string[];
  marketOpportunities: MarketOpportunity[];
}

export interface MarketOpportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  potential: 'High' | 'Medium' | 'Emerging';
}
