export interface MarketOpportunity {
  id: string;
  type: string;
  title: string;
  description: string;
  potential: 'High' | 'Medium' | 'Emerging';
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

export interface BusinessPlanSection {
  title: string;
  body: string;
}

export interface BusinessPlan {
  generatedBy: 'ai' | 'demo';
  title: string;
  subtitle: string;
  sections: BusinessPlanSection[];
}
