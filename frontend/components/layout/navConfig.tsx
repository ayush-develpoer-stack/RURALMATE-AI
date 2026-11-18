import type { ReactNode } from 'react';
import {
  FiGrid,
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiShield,
  FiFileText,
  FiShoppingBag,
  FiUsers,
  FiActivity,
  FiMessageSquare,
} from 'react-icons/fi';

export interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: <FiGrid /> }],
  },
  {
    title: 'Business',
    items: [
      { label: 'My Profile', href: '/profile', icon: <FiUser /> },
      { label: 'Business Analysis', href: '/analysis', icon: <FiMapPin /> },
      { label: 'Financial Plan', href: '/finance', icon: <FiDollarSign /> },
      { label: 'Government Support', href: '/schemes', icon: <FiShield /> },
      { label: 'Business Plan', href: '/business-plan', icon: <FiFileText /> },
    ],
  },
  {
    title: 'Growth',
    items: [
      { label: 'Product AI', href: '/catalog', icon: <FiShoppingBag /> },
      { label: 'Market Opportunities', href: '/market', icon: <FiUsers /> },
      { label: 'What-If Simulator', href: '/simulator', icon: <FiActivity /> },
    ],
  },
  {
    title: 'AI',
    items: [{ label: 'AI Advisor', href: '/advisor', icon: <FiMessageSquare /> }],
  },
];

// Flat list (used by the mobile drawer and for resolving the current page title).
export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
