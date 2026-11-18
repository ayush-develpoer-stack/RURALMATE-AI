import Link from 'next/link';
import Logo from '@/components/layout/Logo';
import './LandingFooter.css';

const COLS = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Government Support', href: '#gov-support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

export default function LandingFooter() {
  return (
    <footer className="lfooter">
      <div className="container lfooter__inner">
        <div className="lfooter__brand">
          <Logo />
          <p className="lfooter__tagline">From Business Idea to Sustainable Growth.</p>
          <p className="lfooter__built">Built for rural entrepreneurs.</p>
        </div>
        <div className="lfooter__cols">
          {COLS.map((c) => (
            <div key={c.title} className="lfooter__col">
              <h4>{c.title}</h4>
              {c.links.map((l) =>
                l.href.startsWith('#') ? (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} href={l.href}>
                    {l.label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="lfooter__bottom">
        <div className="container">
          <span>© {new Date().getFullYear()} RuralMate AI · SIH 2026 · Team Globalantic Innovators</span>
          <span className="text-muted">
            SIH26091 · Ministry of Social Justice and Empowerment
          </span>
        </div>
      </div>
    </footer>
  );
}
