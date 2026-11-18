'use client';

import Link from 'next/link';
import { FiArrowRight, FiMessageSquare, FiGrid } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import './CTASection.css';

export default function CTASection() {
  const { isAuthenticated, loading } = useAuth();
  const authed = isAuthenticated && !loading;
  return (
    <section className="ctasec">
      <div className="container">
        <div className="ctasec__inner">
          <h2 className="ctasec__title">
            Your next business decision can start with better information.
          </h2>
          <p className="ctasec__desc">
            Build a clearer path from business idea to sustainable growth.
          </p>
          <div className="ctasec__actions">
            {authed ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" leftIcon={<FiGrid />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/advisor">
                  <Button size="lg" variant="outline" leftIcon={<FiMessageSquare />}>
                    Ask the AI Advisor
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg" variant="secondary" rightIcon={<FiArrowRight />}>
                    Start Business Analysis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" leftIcon={<FiMessageSquare />}>
                    Talk to AI
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
