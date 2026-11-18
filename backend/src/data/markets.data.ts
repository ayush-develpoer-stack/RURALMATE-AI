import type { MapMarker } from '../types/business';
import type { MarketOpportunity } from '../types/product';

/**
 * Demo map markers around the entrepreneur's location.
 * Offsets are relative to the user's coordinates.
 */
export function buildMapMarkers(userLat: number, userLng: number, label: string): MapMarker[] {
  return [
    { id: 'user', label, type: 'user', lat: userLat, lng: userLng, detail: 'Your location' },
    { id: 'm1', label: 'Weekly Mandi', type: 'market', lat: userLat + 0.02, lng: userLng + 0.03, detail: 'Primary local market' },
    { id: 'm2', label: 'Town Market', type: 'market', lat: userLat - 0.03, lng: userLng + 0.015, detail: 'Higher footfall market' },
    { id: 'c1', label: 'Existing Dairy', type: 'competitor', lat: userLat + 0.012, lng: userLng - 0.02, detail: 'Established competitor' },
    { id: 'c2', label: 'Local Vendor', type: 'competitor', lat: userLat - 0.018, lng: userLng - 0.025, detail: 'Small competitor' },
    { id: 's1', label: 'Feed Supplier', type: 'supplier', lat: userLat + 0.028, lng: userLng - 0.01, detail: 'Raw material supplier' },
  ];
}

export const MARKET_OPPORTUNITIES: MarketOpportunity[] = [
  {
    id: 'local-retail',
    type: 'Local Retailers',
    title: 'Local Retailers & Kirana Stores',
    description: 'Supply directly to nearby shops for steady, recurring orders.',
    potential: 'High',
  },
  {
    id: 'wholesalers',
    type: 'Wholesalers',
    title: 'Regional Wholesalers',
    description: 'Bulk offtake at lower margins but predictable volume.',
    potential: 'Medium',
  },
  {
    id: 'b2b',
    type: 'B2B Buyers',
    title: 'B2B & Corporate Buyers',
    description: 'Institutions and businesses seeking reliable local suppliers.',
    potential: 'Medium',
  },
  {
    id: 'online',
    type: 'Online Customers',
    title: 'Online Marketplaces',
    description: 'List handmade and processed goods on e-commerce and ONDC.',
    potential: 'Emerging',
  },
  {
    id: 'institutional',
    type: 'Institutional Buyers',
    title: 'Institutional Buyers',
    description: 'Schools, hostels, and government programs with regular demand.',
    potential: 'High',
  },
];
