import { FiShield } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import SchemesView from '@/components/schemes/SchemesView';

export default function SchemesPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 4 · Government Support"
        icon={<FiShield />}
        title="Potentially relevant schemes"
        subtitle="Matched to your profile using deterministic rules. Always verify eligibility on the official source before applying."
      />
      <SchemesView />
    </div>
  );
}
