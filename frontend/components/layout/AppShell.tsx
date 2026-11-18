import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AppShell.css';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell__main">
        <Navbar />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}
