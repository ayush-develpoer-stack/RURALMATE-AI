import { FiDollarSign } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import FinanceView from '@/components/finance/FinanceView';

export default function FinancePage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 3 · Financial Structuring"
        icon={<FiDollarSign />}
        title="Structure your finances"
        subtitle="Deterministic calculations for financing gap, EMI, monthly surplus and break-even — no guesswork."
      />
      <FinanceView />
    </div>
  );
}
