import React, { useState, useEffect, useRef } from "react";
import ButtonCallAction from "../ButtonCallAction";

interface UseCountAnimationProps {
  end: number;
  duration?: number;
  shouldStart?: boolean;
}

interface StatCardProps {
  number: number;
  suffix: string;
  label: string;
  delay?: number;
  shouldAnimate?: boolean;
}

// Hook para animação de números
const useCountAnimation = ({
  end,
  duration = 2000,
  shouldStart = false,
}: UseCountAnimationProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (shouldStart && !hasAnimated) {
      setHasAnimated(true);
      let startTime: number;
      const startCount = 0;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Easing function para suavizar
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(
          startCount + (end - startCount) * easeOut
        );

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [shouldStart, end, duration, hasAnimated]);

  return count;
};

// Componente de estatística individual
const StatCard: React.FC<StatCardProps> = ({
  number,
  suffix,
  label,
  delay = 0,
  shouldAnimate,
}) => {
  const animatedNumber = useCountAnimation({
    end: number,
    duration: 2500,
    shouldStart: shouldAnimate,
  });

  return (
    <div
      className="text-center transform transition-all duration-700 hover:scale-105"
      style={{
        animation: shouldAnimate
          ? `fadeInUp 1s ease-out ${delay}ms forwards`
          : "none",
        opacity: shouldAnimate ? 1 : 0,
        transform: shouldAnimate ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div className="relative">
        {/* Número principal */}
        <div className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2 lg:mb-4">
          {animatedNumber.toLocaleString("pt-BR")}
          {suffix}
        </div>

        {/* Brilho atrás do número */}
        <div className="absolute inset-0 text-4xl md:text-6xl lg:text-7xl font-bold text-purple-500/20 blur-sm">
          {animatedNumber.toLocaleString("pt-BR")}
          {suffix}
        </div>
      </div>

      {/* Label */}
      <p className="text-lg lg:text-xl text-gray-300 font-medium">{label}</p>
    </div>
  );
};

// Componente principal
const AnimatedStatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  const stats = [
    {
      number: 5000,
      suffix: "+",
      label: "Famílias conectadas",
      delay: 0,
    },
    {
      number: 98,
      suffix: "%",
      label: "Qualidade 4K garantida",
      delay: 200,
    },
    {
      number: 24,
      suffix: "",
      label: "Horas de entretenimento diário",
      delay: 400,
    },
    {
      number: 99,
      suffix: "%",
      label: "Satisfação dos usuários",
      delay: 600,
    },
  ];

  return (
    <>
      {/* CSS das animações */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6),
              0 0 60px rgba(168, 85, 247, 0.3);
          }
        }

        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      <div ref={sectionRef} className="relative py-16 lg:py-24">
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6">
          {/* Título da seção */}
          <div className="text-center mb-12 lg:mb-16">
            <div
              className="inline-block"
              style={{
                animation: isVisible ? "fadeInUp 1s ease-out forwards" : "none",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                Junte-se à<span className="text-purple-500"> revolução </span>
                do streaming
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                Milhares de famílias já descobriram o futuro do entretenimento
              </p>
            </div>
          </div>

          {/* Grid de estatísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                number={stat.number}
                suffix={stat.suffix}
                label={stat.label}
                delay={stat.delay}
                shouldAnimate={isVisible}
              />
            ))}
          </div>

          {/* CTA adicional */}
          <div className="text-center mt-12 lg:mt-16">
            <div
              className="inline-block"
              style={{
                animation: isVisible
                  ? "fadeInUp 1s ease-out 800ms forwards"
                  : "none",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <ButtonCallAction />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedStatsSection;
