import LandingNavbar from './LandingNavbar';
import Hero from './Hero';
import TrustStrip from './TrustStrip';
import ProblemSection from './ProblemSection';
import HowItWorks from './HowItWorks';
import FeaturesSection from './FeaturesSection';
import ProductDemo from './ProductDemo';
import FinancialIntelligence from './FinancialIntelligence';
import GovSupport from './GovSupport';
import AIAssistant from './AIAssistant';
import DashboardPreview from './DashboardPreview';
import CTASection from './CTASection';
import LandingFooter from './LandingFooter';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      <LandingNavbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <ProductDemo />
        <FinancialIntelligence />
        <GovSupport />
        <AIAssistant />
        <DashboardPreview />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
