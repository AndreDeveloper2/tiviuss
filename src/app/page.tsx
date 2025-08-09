"use client";

import Head from "next/head";
import HeroSectionPlanet from "@/components/HeroPlanet";
import FloatingGlassCardsSection from "@/components/WhyTivius";
import GalaxyBackground from "@/components/ui/galaxyBackground";
import AnimatedStatsSection from "@/components/ui/animatedStatsSection";
import TestimonialsSection from "@/components/TestimonialSection";
import TiviusFAQ from "@/components/TiviusFaq";

const Home = () => {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tivius",
    description:
      "Streaming premium 4K com catálogo completo, sem contrato e sem burocracia. O futuro do entretenimento digital.",
    url: "https://seudominio.com.br",
    logo: "/images/logo.png",
    foundingDate: "2023",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-98578-9062",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressRegion: "SP",
      addressLocality: "São Paulo",
    },
  };

  return (
    <>
      <Head>
        <title>
          Tivius - Streaming Premium 4K | Sem Contrato, Sem Burocracia
        </title>
        <meta
          name="description"
          content="🚀 A revolução do streaming chegou! Qualidade 4K real, catálogo gigantesco, instalação em segundos. Teste GRÁTIS agora! Sem contrato, sem CPF, sem complicação."
        />
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Tivius" />
        <link rel="canonical" href="https://seudominio.com.br" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seudominio.com.br" />
        <meta
          property="og:title"
          content="Tivius - Streaming Premium 4K | Teste Grátis Agora!"
        />
        <meta
          property="og:description"
          content="🎬 Streaming premium com qualidade 4K, catálogo gigantesco e zero burocracia! Funciona em qualquer dispositivo. Teste grátis e comprove!"
        />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Tivius Streaming - Qualidade 4K Premium"
        />
        <meta property="og:site_name" content="Tivius" />
        <meta property="og:locale" content="pt_BR" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://seudominio.com.br" />
        <meta
          name="twitter:title"
          content="Tivius - Streaming Premium 4K | Teste Grátis!"
        />
        <meta
          name="twitter:description"
          content="🚀 A revolução do streaming! Qualidade 4K, sem contrato, sem burocracia. Teste grátis agora!"
        />
        <meta name="twitter:image" content="/images/twitter-image.jpg" />
        <meta
          name="twitter:image:alt"
          content="Tivius - Streaming Premium 4K"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />

        {/* Hreflang */}
        <link
          rel="alternate"
          hrefLang="pt-br"
          href="https://seudominio.com.br"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://seudominio.com.br"
        />

        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData),
          }}
        />
      </Head>

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
    </>
  );
};

export default Home;
