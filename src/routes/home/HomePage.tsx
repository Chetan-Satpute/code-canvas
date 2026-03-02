import FooterSection from './components/FooterSection';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import StructureCardSection from './components/StructureCardSection';

function HomePage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-auto bg-neutral-900 text-white [view-transition-name:page]">
      <div className="flex-1 overflow-auto">
        <HeroSection />
        <hr className='border-neutral-800' />
        <StructureCardSection />
        <hr className='border-neutral-800' />
        <HowItWorksSection />
      </div>
      <FooterSection />
    </div>
  );
}

export default HomePage;
