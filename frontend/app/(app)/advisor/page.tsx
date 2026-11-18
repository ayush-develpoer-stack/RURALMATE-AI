import { FiMessageSquare } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import AIChat from '@/components/ai/AIChat';

export default function AdvisorPage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="AI Advisor"
        icon={<FiMessageSquare />}
        title="Talk to RuralMate AI"
        subtitle="Ask about business ideas, financing, government support and growth — grounded in your context."
      />
      <AIChat />
    </div>
  );
}
