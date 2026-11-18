import { FiActivity } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import SimulatorView from '@/components/simulator/SimulatorView';

export default function SimulatorPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 8 · What-If Simulator"
        icon={<FiActivity />}
        title="Test your business scenarios"
        subtitle="Move the levers and watch revenue, profit and break-even update instantly — proof that RuralMate is a decision-support system, not a chatbot."
      />
      <SimulatorView />
    </div>
  );
}
