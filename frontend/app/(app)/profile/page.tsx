import { FiUser } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import ProfileForm from '@/components/profile/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="page-wrap">
      <SectionHeader
        eyebrow="Step 1 · Profile"
        icon={<FiUser />}
        title="Tell us about the entrepreneur"
        subtitle="Your profile powers every screen — analysis, finance, schemes, plan and market. Data flows through the whole journey."
      />
      <ProfileForm />
    </div>
  );
}
