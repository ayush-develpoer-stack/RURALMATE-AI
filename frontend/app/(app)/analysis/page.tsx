import { FiMapPin } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import AnalysisView from '@/components/analysis/AnalysisView';

export default function AnalysisPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 2 · Hyper-Local Analysis"
        icon={<FiMapPin />}
        title="Your local business opportunity"
        subtitle="A feasibility assessment based on local demand, competition, accessibility, capital fit and seasonality."
      />
      <AnalysisView />
    </div>
  );
}
