import HeroSection from './components/HeroSection';
import StructureCardSection from './components/StructureCardSection';

function HomePage() {
  return (
    <div className="h-screen w-screen overflow-auto bg-neutral-900 text-white [view-transition-name:page]">
      <HeroSection />
      <StructureCardSection />
    </div>
  );
}

export default HomePage;
