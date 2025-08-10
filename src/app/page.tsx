"use client";

import HeroSectionPlanet from "@/components/HeroPlanet";
import FloatingGlassCardsSection from "@/components/WhyTivius";
import GalaxyBackground from "@/components/ui/galaxyBackground";
import AnimatedStatsSection from "@/components/ui/animatedStatsSection";
import TestimonialsSection from "@/components/TestimonialSection";
import TiviusFAQ from "@/components/TiviusFaq";

const Home = () => {
  return (
    <main role="main">
      <HeroSectionPlanet />
      <section
        className="relative"
        role="region"
        aria-label="Conteúdo principal"
      >
        <GalaxyBackground>
          <FloatingGlassCardsSection />
          <AnimatedStatsSection />
          <TestimonialsSection />
          <TiviusFAQ />
        </GalaxyBackground>
      </section>
    </main>
  );
};

export default Home;
