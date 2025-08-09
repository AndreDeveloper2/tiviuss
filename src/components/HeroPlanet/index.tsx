"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import logo from "../../../public/logo.svg";
import ButtonDemo from "@/components/ButtonDemo";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const HeroSectionPlanet = () => {
  const [, setIsSplineLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplineLoaded(true);
      setShowContent(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleSplineLoad = () => {
    setIsSplineLoaded(true);
    setTimeout(() => setShowContent(true), 500);
  };

  const handleSplineError = () => {
    setIsSplineLoaded(true);
    setShowContent(true);
  };

  const SplineLoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Carregando cena 3D...</p>
      </div>
    </div>
  );

  const [splineScene] = useState(() => {
    if (typeof window === "undefined")
      return "https://prod.spline.design/eUkvWftj5fIwwZQq/scene.splinecode";

    const width = window.innerWidth;
    if (width < 768) {
      return "https://prod.spline.design/P8z0ehIF3SrkAIbH/scene.splinecode";
    } else if (width < 1024) {
      return "https://prod.spline.design/eUkvWftj5fIwwZQq/scene.splinecode";
    }
    return "https://prod.spline.design/eUkvWftj5fIwwZQq/scene.splinecode";
  });

  // Schema markup estruturado para SEO
  const heroSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tivius",
    applicationCategory: "Entertainment",
    description:
      "Plataforma de streaming 4K com 20.000+ títulos e zero travamentos",
    operatingSystem: "Web, iOS, Android, Smart TV",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      description: "Teste grátis disponível",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "5000",
    },
  };

  return (
    <>
      {/* Schema Markup para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(heroSchema) }}
      />

      {/* Hero Section com semantic HTML otimizado */}
      <header
        className="h-screen w-full relative overflow-hidden"
        role="banner"
        aria-label="Tivius - Plataforma de Streaming 4K"
      >
        {/* Loading Screen Principal */}
        {!showContent && (
          <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="text-center">
              <div className="mb-8">
                <Image
                  src={logo}
                  alt="Tivius Logo"
                  className="mx-auto drop-shadow-2xl animate-pulse"
                  width={200}
                  height={80}
                  priority
                  style={{ width: "auto", height: "auto" }}
                />
              </div>

              <div
                className="relative mb-6"
                role="status"
                aria-label="Carregando"
              >
                <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                <div
                  className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "3s",
                  }}
                ></div>
              </div>

              <p className="text-white/80 text-sm animate-pulse mb-2">
                Carregando experiência...
              </p>

              <div className="w-64 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal com estrutura semântica */}
        <div
          className={`absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ${
            showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="max-w-2xl mx-auto px-6">
            {/* Logo com alt text otimizado */}
            <div className="text-center mb-8">
              <Image
                src={logo}
                alt="Tivius - Plataforma de Streaming 4K Premium"
                className="mx-auto drop-shadow-2xl"
                width={200}
                height={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            {/* H1 principal otimizada para SEO */}
            <h1 className="text-2xl text-center font-light mb-4 text-white">
              A TV Streaming de outro mundo
            </h1>

            {/* Subtitle mantendo texto original */}
            <h2 className="text-sm text-center mx-3 mb-8 text-white/80 leading-relaxed">
              Entretenimento sem fronteiras com qualidade 4K que vai te
              surpreender.
            </h2>

            {/* Estatísticas com schema markup e semantic markup */}
            <div
              className="flex justify-center items-center gap-8 mb-8 flex-wrap"
              itemScope
              itemType="https://schema.org/Product"
              role="region"
              aria-label="Estatísticas da plataforma Tivius"
            >
              <meta itemProp="name" content="Tivius Streaming Platform" />
              <meta
                itemProp="description"
                content="Plataforma de streaming 4K com mais de 20.000 títulos"
              />

              <div className="text-center">
                <div
                  className="text-xl font-bold text-purple-500"
                  itemProp="productionCompany"
                  itemScope
                  itemType="https://schema.org/Organization"
                >
                  <span itemProp="numberOfEmployees">20.000+</span>
                </div>
                <div className="text-xs text-white/60">Títulos em 4K</div>
              </div>

              <div className="text-center">
                <div
                  className="text-xl font-bold text-purple-500"
                  itemProp="videoQuality"
                >
                  4K
                </div>
                <div className="text-xs text-white/60">Ultra HD</div>
              </div>

              <div className="text-center">
                <div
                  className="text-[18px] font-bold text-purple-500"
                  itemProp="customerService"
                >
                  Suporte
                </div>
                <div className="text-xs text-white/60">24/7</div>
              </div>
            </div>

            {/* CTA otimizado para conversão e SEO */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <meta itemProp="price" content="0" />
                <meta itemProp="priceCurrency" content="BRL" />
                <meta
                  itemProp="availability"
                  content="https://schema.org/InStock"
                />
                <ButtonDemo />
              </div>
            </div>

            {/* Scroll indicator com texto original */}
            <div
              className="absolute left-1/2 transform -translate-x-1/2 z-10 text-white/30 text-xs animate-bounce"
              role="button"
              aria-label="Role para ver mais conteúdo"
              tabIndex={0}
            >
              ↓ Descubra mais
            </div>
          </div>
        </div>

        {/* Spline Scene com fallback acessível */}
        <div
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label="Animação 3D interativa do planeta Tivius"
        >
          <Suspense fallback={<SplineLoadingFallback />}>
            <Spline
              scene={splineScene}
              onLoad={handleSplineLoad}
              onError={handleSplineError}
              style={{
                width: "100%",
                height: "100%",
                transformOrigin: "center center",
                transform: "translate(0, 0)",
                zIndex: 0,
              }}
              aria-hidden="true" // Scene 3D é decorativa
            />
          </Suspense>
        </div>
      </header>
    </>
  );
};

export default HeroSectionPlanet;
