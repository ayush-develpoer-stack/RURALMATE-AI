import type { ChatInsight } from '@/services/ai.service';
import './AIInsightCard.css';

function formatValue(insight: ChatInsight): string {
  if (insight.unit === '₹') return '₹' + insight.value.toLocaleString('en-IN');
  return `${insight.value}${insight.unit ?? ''}`;
}

export default function AIInsightCard({ insights }: { insights: ChatInsight[] }) {
  return (
    <div className="ai-insights">
      {insights.map((it, i) => (
        <div key={i} className="ai-insights__item">
          <span className="ai-insights__value">{formatValue(it)}</span>
          <span className="ai-insights__label">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
