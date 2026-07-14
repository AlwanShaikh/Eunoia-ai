import { NavBar } from '@/components/landing/nav-bar';
import { HeroSection } from '@/components/landing/hero-section';
import { FeatureGrid } from '@/components/landing/feature-grid';
import { WhyEunoia } from '@/components/landing/why-eunoia';
import { Benefits } from '@/components/landing/testimonials';
import { Footer } from '@/components/landing/footer';
import { AnimatedSection } from '@/components/ui/animated-section';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-100">
      <NavBar />
      <HeroSection />
      <AnimatedSection from="bottom" delay={0.1}>
        <FeatureGrid />
      </AnimatedSection>
      <AnimatedSection from="bottom" delay={0.15}>
        <WhyEunoia />
      </AnimatedSection>
      <AnimatedSection from="bottom" delay={0.2}>
        <Benefits />
      </AnimatedSection>
      <AnimatedSection from="bottom" delay={0.25}>
        <Footer />
      </AnimatedSection>
    </main>
  );
}
