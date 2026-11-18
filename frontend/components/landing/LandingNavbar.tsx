'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiArrowRight, FiGrid, FiLogOut } from 'react-icons/fi';
import Logo from '@/components/layout/Logo';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import './LandingNavbar.css';

const LINKS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Opportunities', href: '#product-demo' },
  { label: 'Government Support', href: '#gov-support' },
  { label: 'About', href: '#about' },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const authed = isAuthenticated && !loading;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`lnav ${scrolled ? 'lnav--scrolled' : ''}`}>
      <div className="container lnav__inner">
        <Link href="/" aria-label="RuralMate AI home">
          <Logo />
        </Link>

        <nav className="lnav__links" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="lnav__link">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="lnav__actions">
          {authed ? (
            <>
              <button type="button" className="lnav__login" onClick={logout}>
                Log out
              </button>
              <Link href="/dashboard">
                <Button size="sm" leftIcon={<FiGrid />}>
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="lnav__login">
                Login
              </Link>
              <Link href="/register">
                <Button size="sm" rightIcon={<FiArrowRight />}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="lnav__burger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="lnav__mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="lnav__mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="lnav__mobile-actions">
            {authed ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  <Button fullWidth leftIcon={<FiGrid />}>
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<FiLogOut />}
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button fullWidth rightIcon={<FiArrowRight />}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
