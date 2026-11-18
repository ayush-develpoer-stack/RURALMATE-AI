import {
  FiShoppingBag,
  FiTruck,
  FiBriefcase,
  FiGlobe,
  FiHome,
} from 'react-icons/fi';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import type { MarketOpportunity } from '@/types/product';
import './MarketOpportunities.css';

const ICONS: Record<string, JSX.Element> = {
  'local-retail': <FiShoppingBag />,
  wholesalers: <FiTruck />,
  b2b: <FiBriefcase />,
  online: <FiGlobe />,
  institutional: <FiHome />,
};

function potentialVariant(p: MarketOpportunity['potential']): 'success' | 'primary' | 'warning' {
  if (p === 'High') return 'success';
  if (p === 'Medium') return 'primary';
  return 'warning';
}

export default function MarketOpportunities({
  opportunities,
}: {
  opportunities: MarketOpportunity[];
}) {
  return (
    <div className="market-opps">
      {opportunities.map((o) => (
        <Card key={o.id} hover className="market-opps__card">
          <div className="market-opps__icon">{ICONS[o.id] ?? <FiBriefcase />}</div>
          <div className="market-opps__body">
            <div className="market-opps__head">
              <h4>{o.title}</h4>
              <Badge variant={potentialVariant(o.potential)} size="sm">
                {o.potential}
              </Badge>
            </div>
            <p>{o.description}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
