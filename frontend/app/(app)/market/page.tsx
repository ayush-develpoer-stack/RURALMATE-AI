import { FiUsers } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import MarketView from '@/components/catalog/MarketView';

export default function MarketPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 7 · Market Opportunities"
        icon={<FiUsers />}
        title="Where your potential buyers may exist"
        subtitle="Identify potential channels — local retailers, wholesalers, B2B, online and institutional buyers."
      />
      <MarketView />
    </div>
  );
}
