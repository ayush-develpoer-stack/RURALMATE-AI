import { FiFileText } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import BusinessPlanView from '@/components/business-plan/BusinessPlanView';

export default function BusinessPlanPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 5 · AI Business Plan"
        icon={<FiFileText />}
        title="Your market-ready business plan"
        subtitle="Generated from your profile, analysis, finances and scheme match — with numbers straight from the deterministic finance engine."
      />
      <BusinessPlanView />
    </div>
  );
}
