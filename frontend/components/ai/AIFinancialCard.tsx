import type { ChatFinancialItem } from '@/services/ai.service';
import './AIFinancialCard.css';

export default function AIFinancialCard({ items }: { items: ChatFinancialItem[] }) {
  return (
    <div className="ai-financial">
      {items.map((it, i) => (
        <div key={i} className="ai-financial__item">
          <span className="ai-financial__label">{it.label}</span>
          <span className="ai-financial__value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
