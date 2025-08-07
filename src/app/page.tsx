"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import logoWW from "../../public/logoWW.svg";
import ButtonDemo from "@/components/ButtonDemo";

// Lazy loading do Spline conforme documentação oficial
const Spline = React.lazy(() => import("@splinetool/react-spline"));

const Home = () => {
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Timeout de segurança - sempre remove o loading após 6 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Timeout: Removendo loading após 6 segundos");
      setIsSplineLoaded(true);
      setShowContent(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleSplineLoad = () => {
    console.log("Spline carregado com sucesso!");
    setIsSplineLoaded(true);
    // Pequeno delay para transição suave
    setTimeout(() => setShowContent(true), 500);
  };

  const handleSplineError = (error) => {
    console.error("Erro no Spline:", error);
    setIsSplineLoaded(true);
    setShowContent(true);
  };

  // Loading Component customizado
  const SplineLoadingFallback = () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60 text-sm">Carregando cena 3D...</p>
      </div>
    </div>
  );

  return (
    <main className="h-screen w-full relative overflow-hidden">
      {/* Loading Screen Principal */}
      {!showContent && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-8">
              <Image
                src={logoWW}
                alt="Tivius Logo"
                className="mx-auto drop-shadow-2xl animate-pulse"
                width={200}
                height={80}
                priority
                style={{ width: "auto", height: "auto" }}
              />
            </div>

            <div className="relative mb-6">
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

      {/* Conteúdo Principal */}
      <div
        className={`absolute w-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-2xl mx-auto px-6">
          <Image
            src={logoWW}
            alt="Tivius Logo"
            className="mx-auto mb-8 drop-shadow-2xl"
            width={200}
            height={80}
            priority
            style={{ width: "auto", height: "auto" }}
          />

          <h1 className="text-2xl text-center font-light mb-4 text-white">
            Streaming de outro mundo
          </h1>

          <p className="text-sm text-center mx-3 mb-8 text-white/80 leading-relaxed">
            Entretenimento sem fronteiras com qualidade 4K que vai te
            surpreender.
          </p>

          <div className="flex justify-center items-center gap-8 mb-8 flex-wrap">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-500">10.000+</div>
              <div className="text-xs text-white/60">Conteúdos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-500">4K</div>
              <div className="text-xs text-white/60">Ultra HD</div>
            </div>
            <div className="text-center">
              <div className="text-[18px] font-bold text-purple-500">
                Suporte
              </div>
              <div className="text-xs text-white/60">24/7</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <ButtonDemo />
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 z-10 text-white/30 text-xs animate-bounce">
            ↓ Descubra mais
          </div>
        </div>
      </div>

      {/* Spline Scene com Suspense */}
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={<SplineLoadingFallback />}>
          <Spline
            scene="https://prod.spline.design/eUkvWftj5fIwwZQq/scene.splinecode"
            onLoad={handleSplineLoad}
            onError={handleSplineError}
            style={{
              width: "100%",
              height: "100%",
              zIndex: 0,
            }}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default Home;
