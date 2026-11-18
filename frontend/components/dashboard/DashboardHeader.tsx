import { FiMapPin } from 'react-icons/fi';
import './DashboardHeader.css';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

interface DashboardHeaderProps {
  name: string;
  location?: string;
}

export default function DashboardHeader({ name, location }: DashboardHeaderProps) {
  return (
    <div className="dash-header">
      <div className="dash-header__text">
        <h1 className="dash-header__title">
          {greeting()}, {name}
        </h1>
        <p className="dash-header__sub">Here&apos;s your business growth overview.</p>
      </div>
      <div className="dash-header__user">
        <div className="dash-header__user-info">
          <span className="dash-header__user-name">{name}</span>
          {location && (
            <span className="dash-header__user-loc">
              <FiMapPin /> {location}
            </span>
          )}
        </div>
        <span className="dash-header__avatar">{name.charAt(0).toUpperCase()}</span>
      </div>
    </div>
  );
}
