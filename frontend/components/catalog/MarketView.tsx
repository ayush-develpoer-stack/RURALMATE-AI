'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiUsers } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingState from '@/components/ui/LoadingState';
import ErrorState from '@/components/ui/ErrorState';
import MarketOpportunities from './MarketOpportunities';
import { productService } from '@/services/product.service';
import { ApiRequestError } from '@/services/api';
import type { MarketOpportunity } from '@/types/product';

export default function MarketView() {
  const [opps, setOpps] = useState<MarketOpportunity[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    productService
      .analyze({})
      .then((r) => setOpps(r.marketOpportunities))
      .catch((err) =>
        setError(err instanceof ApiRequestError ? err.message : 'Unable to load markets.'),
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <LoadingState message="Finding potential markets..." />;
  if (error) return <ErrorState title="Unable to load markets" message={error} onRetry={load} />;
  if (!opps) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <Card gradient>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <FiUsers size={22} />
          <div>
            <strong>What to sell → How to present it → Where potential buyers may exist</strong>
            <p className="text-secondary" style={{ marginTop: 4, fontSize: 'var(--fs-sm)' }}>
              These are potential channels to explore, not a marketplace. Reach grows as the
              business scales.
            </p>
          </div>
        </div>
      </Card>

      <MarketOpportunities opportunities={opps} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link href="/simulator">
          <Button rightIcon={<FiArrowRight />}>Open What-If Simulator</Button>
        </Link>
      </div>
    </div>
  );
}
