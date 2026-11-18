'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { NAV_ITEMS } from './navConfig';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const current = NAV_ITEMS.find((n) => n.href === pathname);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.replace('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <button
          className="navbar__menu-btn"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <FiMenu />
        </button>
        <div className="navbar__title-wrap">
          <span className="navbar__title">{current?.label ?? 'RuralMate AI'}</span>
        </div>
        <Link href="/" className="navbar__brand">
          <Logo compact />
        </Link>
      </div>

      {open && (
        <div className="navbar__drawer-overlay" onClick={() => setOpen(false)}>
          <nav className="navbar__drawer" onClick={(e) => e.stopPropagation()}>
            <div className="navbar__drawer-head">
              <Logo />
              <button
                className="navbar__menu-btn"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>
            <div className="navbar__drawer-links">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`navbar__drawer-link ${
                    pathname === item.href ? 'navbar__drawer-link--active' : ''
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="navbar__drawer-icon">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
              {user && (
                <button className="navbar__drawer-logout" onClick={handleLogout}>
                  <span className="navbar__drawer-icon">
                    <FiLogOut />
                  </span>
                  Log out ({user.name})
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
