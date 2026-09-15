import CatalogSection from './components/CatalogSection.tsx';
import HeroSection from './components/HeroSection.tsx';
import HomeFooter from './components/HomeFooter.tsx';
import HomeHeader from './components/HomeHeader.tsx';
import HowItWorksSection from './components/HowItWorksSection.tsx';

// The document scrolls here rather than an inner container, so the header and
// the structure headings can stick to the viewport. The explore page owns its
// own height instead, because its canvas must never scroll out of view.
function HomePage() {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <HomeHeader />

      <main className="flex-1">
        <HeroSection />
        <CatalogSection />
        <HowItWorksSection />
      </main>

      <HomeFooter />
    </div>
  );
}

export default HomePage;
