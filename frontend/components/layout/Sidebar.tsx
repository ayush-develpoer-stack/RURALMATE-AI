'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { NAV_GROUPS } from './navConfig';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="sidebar__nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="sidebar__group">
            <span className="sidebar__group-title">{group.title}</span>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar__link ${active ? 'sidebar__link--active' : ''}`}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="sidebar__footer">
        <div className="sidebar__footer-links">
          <Link
            href="/profile"
            className={`sidebar__link ${pathname === '/profile' ? 'sidebar__link--active' : ''}`}
          >
            <span className="sidebar__icon">
              <FiSettings />
            </span>
            <span>Settings</span>
          </Link>
          {user && (
            <button className="sidebar__link sidebar__link--logout" onClick={handleLogout}>
              <span className="sidebar__icon">
                <FiLogOut />
              </span>
              <span>Logout</span>
            </button>
          )}
        </div>
        {user && (
          <div className="sidebar__user">
            <span className="sidebar__avatar">{user.name.charAt(0).toUpperCase()}</span>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">{user.name}</span>
              <span className="sidebar__user-email">{user.email}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
