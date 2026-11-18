import type { EntrepreneurProfile } from '../types/business';
import type { AnalysisResult } from '../types/business';
import type { FinanceResult } from '../types/finance';
import type { SchemeMatch } from '../types/scheme';
import { generateText, isAIConfigured } from '../lib/openrouter';

export interface BusinessPlanInput {
  profile: Partial<EntrepreneurProfile>;
  analysis?: Partial<AnalysisResult>;
  financials?: Partial<FinanceResult>;
  topScheme?: Partial<SchemeMatch>;
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

function inr(n?: number): string {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return '₹' + n.toLocaleString('en-IN');
}

const SYSTEM_PROMPT =
  'You are RuralMate AI, an advisor for rural micro-entrepreneurs in India. ' +
  'Write clear, practical, encouraging business guidance in plain English. ' +
  'IMPORTANT: Use ONLY the financial figures provided verbatim — never invent or recalculate numbers. ' +
  'Keep each section to 2-4 sentences.';

/**
 * Deterministic, high-quality business-plan generator.
 * All financial numbers come from the finance engine — this only formats/explains.
 */
function buildDeterministicPlan(input: BusinessPlanInput): BusinessPlan {
  const name = input.profile?.name || 'The entrepreneur';
  const location = input.profile?.location || 'the local rural area';
  const business = input.analysis?.recommendedBusiness || 'the proposed business';
  const feasibility = input.analysis?.feasibilityScore;
  const goal = input.profile?.goal || 'build a profitable and sustainable rural enterprise';
  const f = input.financials;
  const scheme = input.topScheme;

  const sections: BusinessPlanSection[] = [
    {
      title: 'Executive Summary',
      body: `${name} plans to establish a ${business} in ${location}. Based on a hyper-local feasibility assessment${
        feasibility ? ` (feasibility score ${feasibility}/100)` : ''
      }, this venture aligns strong local demand with the available capital and skills. The goal is to ${goal.toLowerCase()}. This plan outlines the market opportunity, investment structure, financial outlook, risks, and a practical growth path.`,
    },
    {
      title: 'Business Idea',
      body: `The proposed enterprise is a ${business}. It addresses a clear local need and builds on locally available resources and demand. The business focuses on quality, reliability, and consistent supply to build trust within the community and beyond.`,
    },
    {
      title: 'Local Market',
      body: `${location} shows favourable signals for this business${
        input.analysis?.localDemand ? `, with a local demand indicator of ${input.analysis.localDemand}/100` : ''
      }. Proximity to weekly markets, town markets, and supplier networks supports steady operations. ${
        input.analysis?.competition
          ? `Competition is moderate (${input.analysis.competition}/100), leaving room for a quality-focused entrant.`
          : ''
      }`,
    },
    {
      title: 'Target Customers',
      body: `Primary customers include local households, nearby retailers, and small institutions. Secondary opportunities include wholesalers and online/B2B buyers as the business scales. A focus on consistent quality helps convert first-time buyers into repeat customers.`,
    },
    {
      title: 'Investment & Financing',
      body: `The estimated project cost is ${inr(f?.projectCost)}, of which ${inr(
        f?.ownCapital,
      )} is the entrepreneur's own contribution. This leaves a financing gap of ${inr(
        f?.financingGap,
      )}, which can be met through an institutional loan${
        f?.estimatedEmi ? ` with an estimated EMI of ${inr(f.estimatedEmi)} per month` : ''
      }${
        f?.loanTenureMonths ? ` over ${f.loanTenureMonths} months at ${f.annualInterestRate}% annual interest` : ''
      }.`,
    },
    {
      title: 'Financial Outlook',
      body: `Projected monthly revenue is ${inr(f?.monthlyRevenue)} against monthly expenses of ${inr(
        f?.monthlyExpenses,
      )}, giving a monthly operating surplus of ${inr(f?.monthlySurplus)}. After EMI, the estimated net monthly cash flow is ${inr(
        f?.netMonthlyAfterEmi,
      )}. ${
        f?.breakEvenMonths
          ? `At this rate, the own-capital investment is recovered in approximately ${f.breakEvenMonths} months.`
          : 'Break-even depends on improving the operating surplus relative to EMI obligations.'
      }`,
    },
    {
      title: 'Potential Government Support',
      body: scheme?.name
        ? `${scheme.fullName || scheme.name} appears potentially relevant for this profile (${
            scheme.matchScore ?? ''
          }% indicative match). ${scheme.subsidyInfo || ''} This is not a confirmation of eligibility — details should be verified on the official source before applying.`
        : `Several central and state schemes support rural micro-enterprises. These should be explored and verified on official portals before applying.`,
    },
    {
      title: 'Risks & Mitigation',
      body: `Key risks include seasonal demand fluctuations, input-cost variation, and competition. These can be mitigated by diversifying products, maintaining buffer stock during peak supply, building direct customer relationships, and controlling operating costs. Maintaining a small financial reserve improves resilience.`,
    },
    {
      title: 'Marketing Strategy',
      body: `Initial marketing relies on word-of-mouth, local retailer tie-ups, and visible quality. As the business grows, participation in local markets, simple branding/packaging, and gradual entry into online and B2B channels (including ONDC) can expand reach cost-effectively.`,
    },
    {
      title: 'Growth Plan',
      body: `Phase 1 focuses on stable local operations and consistent quality. Phase 2 expands capacity and adds nearby markets and wholesalers. Phase 3 introduces value-added products, better packaging, and online/institutional channels — moving from local supply to sustainable, diversified growth.`,
    },
  ];

  return {
    generatedBy: 'demo',
    title: `Business Plan — ${business}`,
    subtitle: `Prepared for ${name}, ${location}`,
    sections,
  };
}

/**
 * Generate a business plan. Uses OpenRouter to enhance the narrative when
 * configured; always falls back to the deterministic plan on any AI failure.
 * Financial numbers are ALWAYS the deterministic ones.
 */
export async function generateBusinessPlan(input: BusinessPlanInput): Promise<BusinessPlan> {
  const plan = buildDeterministicPlan(input);
  if (!isAIConfigured()) return plan;

  const f = input.financials;
  const facts = [
    `Entrepreneur: ${input.profile?.name || 'N/A'}`,
    `Location: ${input.profile?.location || 'N/A'}`,
    `Business: ${input.analysis?.recommendedBusiness || 'N/A'}`,
    `Feasibility score: ${input.analysis?.feasibilityScore ?? 'N/A'}/100`,
    `Project cost: ${inr(f?.projectCost)}`,
    `Own capital: ${inr(f?.ownCapital)}`,
    `Financing gap: ${inr(f?.financingGap)}`,
    `Monthly revenue: ${inr(f?.monthlyRevenue)}`,
    `Monthly expenses: ${inr(f?.monthlyExpenses)}`,
    `Monthly surplus: ${inr(f?.monthlySurplus)}`,
    `Estimated EMI: ${inr(f?.estimatedEmi)}`,
    `Break-even months: ${f?.breakEvenMonths ?? 'N/A'}`,
    `Top scheme: ${input.topScheme?.name || 'N/A'}`,
  ].join('\n');

  const prompt =
    `Using ONLY these facts (do not change any number):\n${facts}\n\n` +
    `Write an "Executive Summary" for this rural business plan in 3-4 sentences. ` +
    `Be encouraging and practical. Return plain text only, no headings.`;

  try {
    const aiSummary = await generateText(prompt, {
      system: SYSTEM_PROMPT,
      temperature: 0.6,
      maxTokens: 320,
    });
    const idx = plan.sections.findIndex((s) => s.title === 'Executive Summary');
    if (idx >= 0 && aiSummary) {
      plan.sections[idx] = { title: 'Executive Summary', body: aiSummary };
      plan.generatedBy = 'ai';
    }
    return plan;
  } catch {
    // Any AI failure → guaranteed deterministic plan.
    return plan;
  }
}

/**
 * Reusable helpers (available for future AI-enhanced features). Each falls back
 * gracefully by throwing OpenRouterError when not configured.
 */
export async function generateBusinessRecommendation(context: string): Promise<string> {
  return generateText(
    `A rural entrepreneur describes their situation:\n${context}\n\n` +
      `Suggest a suitable business direction and briefly explain why. 3-4 sentences.`,
    { system: SYSTEM_PROMPT },
  );
}

export async function generateProductDetails(productName: string, notes = ''): Promise<string> {
  return generateText(
    `Write a compelling e-commerce product description (2-3 sentences) for a rural, ` +
      `handmade/farm product called "${productName}". ${notes}`,
    { system: SYSTEM_PROMPT, maxTokens: 220 },
  );
}

export async function generateMarketExplanation(
  productOrBusiness: string,
  channels: string[] = [],
): Promise<string> {
  const list = channels.length ? channels.join(', ') : 'local retailers, wholesalers, B2B, online, institutional buyers';
  return generateText(
    `For a rural ${productOrBusiness}, briefly explain how to approach these potential markets: ${list}. ` +
      `Give one practical tip per channel. Keep it under 120 words.`,
    { system: SYSTEM_PROMPT, maxTokens: 320 },
  );
}

/**
 * Free-form advisory chat. Uses OpenRouter when configured; otherwise returns a
 * deterministic fallback so the endpoint stays usable in demo mode.
 */
export async function chat(message: string): Promise<{ reply: string; mode: 'ai' | 'demo' }> {
  if (!isAIConfigured()) {
    return { reply: chatFallback(message), mode: 'demo' };
  }
  const reply = await generateText(message, {
    system:
      SYSTEM_PROMPT +
      ' You are chatting with a rural entrepreneur. Answer helpfully in 4-6 sentences. ' +
      'For any money figures, give rough guidance and remind them the app computes exact numbers.',
    temperature: 0.7,
    maxTokens: 500,
  });
  return { reply, mode: 'ai' };
}

function chatFallback(message: string): string {
  return (
    `Thanks for your question: "${message.slice(0, 160)}". ` +
    `In demo mode I can share general guidance: for a small rural budget, consider a dairy unit, ` +
    `food processing, or a handicraft/bamboo venture — each has strong local demand and low entry cost. ` +
    `Start by validating local demand and competition, then structure the finances (project cost, ` +
    `funding gap, EMI and break-even are calculated precisely in the Finance section), and check ` +
    `potentially relevant schemes like PMEGP or MUDRA. ` +
    `Connect an OpenRouter API key on the server to enable full AI conversations.`
  );
}

/* ------------------------------------------------------------------ *
 * Structured chat — AI explains, deterministic engines own the numbers.
 * The frontend maps `type` to trusted visual components. The LLM never
 * produces chart config or arbitrary markup; it only writes `message`.
 * ------------------------------------------------------------------ */

export type ChatType =
  | 'text'
  | 'feasibility'
  | 'financial_summary'
  | 'scheme'
  | 'comparison';

export interface ChatInsight {
  label: string;
  value: number;
  unit?: string;
}
export interface ChatChart {
  type: 'bar' | 'line';
  title: string;
  data: { label: string; value: number }[];
}
export interface ChatFinancialItem {
  label: string;
  value: string;
}
export interface ChatAction {
  label: string;
  href: string;
}
export interface StructuredChatResponse {
  type: ChatType;
  mode: 'ai' | 'demo';
  message: string;
  insights?: ChatInsight[];
  chart?: ChatChart;
  financial?: ChatFinancialItem[];
  actions?: ChatAction[];
}

function detectIntent(message: string): ChatType {
  const m = message.toLowerCase();
  if (/(from\s+\d+\s+to\s+\d+)|(\d+\s*(?:to|→|->)\s*\d+)/.test(m) && /(customer|price|sell|unit)/.test(m)) {
    return 'comparison';
  }
  if (/(afford|financ|money|capital|cost|emi|loan|fund|budget|invest)/.test(m)) {
    return 'financial_summary';
  }
  if (/(scheme|support|subsid|government|pmegp|mudra|loan scheme|grant)/.test(m)) {
    return 'scheme';
  }
  if (
    /(feasib|suitable|which business|business idea|start|idea|opportunit|dairy|recommend|profitable|next step|do next|what should i|where do i)/.test(
      m,
    )
  ) {
    return 'feasibility';
  }
  return 'text';
}

function parseComparison(message: string): { from: number; to: number } | null {
  const m = message.match(/from\s+(\d+)\s+to\s+(\d+)/i) || message.match(/(\d+)\s*(?:to|→|->)\s*(\d+)/);
  if (!m) return null;
  return { from: Number(m[1]), to: Number(m[2]) };
}

function nextActionAction(href: string, label: string): ChatAction {
  return { label, href };
}

/**
 * Build a structured, visual chat response. Uses deterministic dashboard data
 * for all numbers; AI (or a deterministic fallback) writes the explanation text.
 */
export async function structuredChat(
  message: string,
  userId?: string,
): Promise<StructuredChatResponse> {
  // Lazy import avoids any load-order coupling.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { getDashboard } = require('./dashboard.service') as typeof import('./dashboard.service');
  const dash = await getDashboard(userId);
  const a = dash.analysis;
  const f = dash.finance;
  const intent = detectIntent(message);

  let base: Omit<StructuredChatResponse, 'message' | 'mode'> = { type: 'text' };

  if (intent === 'feasibility') {
    base = {
      type: 'feasibility',
      insights: [
        { label: 'Feasibility', value: a.feasibilityScore, unit: '/100' },
        { label: 'Capital Fit', value: a.capitalFit, unit: '/100' },
      ],
      chart: {
        type: 'bar',
        title: 'Business opportunity factors',
        data: [
          { label: 'Demand', value: a.localDemand },
          { label: 'Competition', value: a.competition },
          { label: 'Accessibility', value: a.accessibility },
          { label: 'Capital Fit', value: a.capitalFit },
          { label: 'Seasonality', value: a.seasonality },
        ],
      },
      actions: [
        nextActionAction('/analysis', 'View Analysis'),
        nextActionAction('/finance', 'View Financial Plan'),
      ],
    };
  } else if (intent === 'financial_summary') {
    base = {
      type: 'financial_summary',
      financial: [
        { label: 'Project Cost', value: inr(f.projectCost) },
        { label: 'Your Capital', value: inr(f.ownCapital) },
        { label: 'Funding Gap', value: inr(f.financingGap) },
        { label: 'Monthly Surplus', value: inr(f.monthlySurplus) },
        { label: 'Estimated EMI', value: inr(f.estimatedEmi) },
      ],
      chart: {
        type: 'bar',
        title: 'Monthly cash flow',
        data: [
          { label: 'Revenue', value: f.monthlyRevenue },
          { label: 'Expenses', value: f.monthlyExpenses },
          { label: 'Surplus', value: f.monthlySurplus },
        ],
      },
      actions: [nextActionAction('/finance', 'Open Financial Plan')],
    };
  } else if (intent === 'scheme') {
    const top = dash.schemes[0];
    base = {
      type: 'scheme',
      insights: top ? [{ label: `${top.name} match`, value: top.matchScore, unit: '%' }] : undefined,
      actions: [nextActionAction('/schemes', 'Explore Government Support')],
    };
  } else if (intent === 'comparison') {
    const parsed = parseComparison(message);
    if (parsed) {
      const price = 700;
      const raw = 350;
      const fixed = 20000;
      const calc = (customers: number) => {
        const revenue = price * customers;
        const profit = revenue - raw * customers - fixed;
        return { revenue, profit };
      };
      const before = calc(parsed.from);
      const after = calc(parsed.to);
      base = {
        type: 'comparison',
        insights: [
          { label: `Revenue (${parsed.from})`, value: before.revenue, unit: '₹' },
          { label: `Revenue (${parsed.to})`, value: after.revenue, unit: '₹' },
          { label: `Profit (${parsed.from})`, value: before.profit, unit: '₹' },
          { label: `Profit (${parsed.to})`, value: after.profit, unit: '₹' },
        ],
        chart: {
          type: 'bar',
          title: 'Before vs after',
          data: [
            { label: `Rev @${parsed.from}`, value: before.revenue },
            { label: `Rev @${parsed.to}`, value: after.revenue },
            { label: `Profit @${parsed.from}`, value: before.profit },
            { label: `Profit @${parsed.to}`, value: after.profit },
          ],
        },
        actions: [nextActionAction('/simulator', 'Open What-If Simulator')],
      };
    }
  }

  // Message text — AI if configured, deterministic fallback otherwise.
  const context =
    `Business: ${a.recommendedBusiness} (feasibility ${a.feasibilityScore}/100). ` +
    `Project cost ${inr(f.projectCost)}, own capital ${inr(f.ownCapital)}, funding gap ${inr(
      f.financingGap,
    )}, monthly surplus ${inr(f.monthlySurplus)}, EMI ${inr(f.estimatedEmi)}.`;

  let text: string;
  let mode: 'ai' | 'demo';
  try {
    if (!isAIConfigured()) throw new Error('not configured');
    text = await generateText(
      `Context (use these exact numbers, do not change them): ${context}\n\n` +
        `The entrepreneur asks: "${message}"\n\n` +
        `Answer helpfully in 3-4 sentences. Do not invent new numbers.`,
      { system: SYSTEM_PROMPT, temperature: 0.6, maxTokens: 320 },
    );
    mode = 'ai';
  } catch {
    text = fallbackChatText(intent, dash);
    mode = 'demo';
  }

  return { ...base, message: text, mode };
}

function fallbackChatText(
  intent: ChatType,
  dash: import('../types/dashboard').DashboardData,
): string {
  const a = dash.analysis;
  const f = dash.finance;
  switch (intent) {
    case 'feasibility':
      return `${a.recommendedBusiness} looks potentially suitable for your profile, with a feasibility score of ${a.feasibilityScore}/100. Demand and capital fit are the strongest factors. Review the full analysis, then structure your finances to see the funding you'll need.`;
    case 'financial_summary':
      return `Your estimated project cost is ${inr(f.projectCost)}, of which ${inr(
        f.ownCapital,
      )} is your own capital — leaving a financing gap of ${inr(
        f.financingGap,
      )}. With a monthly surplus of ${inr(f.monthlySurplus)}, an EMI of about ${inr(
        f.estimatedEmi,
      )} looks manageable. Exact figures are in the Financial Plan.`;
    case 'scheme':
      return `Based on your profile, ${
        dash.schemes[0]?.name ?? 'several schemes'
      } may be potentially relevant. Eligibility and documents are listed under Government Support — always verify on the official source before applying.`;
    case 'comparison':
      return `Here's the before-and-after based on your inputs. Increasing customers raises revenue while fixed costs stay stable, so profit grows. Open the What-If Simulator to explore more scenarios.`;
    default:
      return `In demo mode I can offer general guidance for your ${a.recommendedBusiness.toLowerCase()} plan. For business ideas, financing, government support, or product pricing, ask a specific question or use the sections in your dashboard.`;
  }
}

// Re-export the low-level primitives so all AI communication stays centralized here.
export { generateText, isAIConfigured } from '../lib/openrouter';
