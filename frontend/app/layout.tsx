import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { BusinessProvider } from '@/context/BusinessContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'RuralMate AI — From Business Idea to Sustainable Growth',
  description:
    'AI-powered hyper-local business decision and growth platform for rural micro-entrepreneurs.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f7a4d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <BusinessProvider>{children}</BusinessProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
