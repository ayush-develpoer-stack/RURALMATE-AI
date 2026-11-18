import Link from 'next/link';
import { FiArrowRight, FiCompass } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import type { NextAction } from '@/types/dashboard';
import './RecommendedAction.css';

export default function RecommendedAction({ action }: { action: NextAction }) {
  return (
    <div className="rec-action">
      <span className="rec-action__eyebrow">
        <FiCompass /> Recommended Next Step
      </span>
      <h3 className="rec-action__title">{action.title}</h3>
      <p className="rec-action__reason">{action.reason}</p>
      <Link href={action.href}>
        <Button variant="secondary" rightIcon={<FiArrowRight />}>
          {action.ctaLabel}
        </Button>
      </Link>
    </div>
  );
}
