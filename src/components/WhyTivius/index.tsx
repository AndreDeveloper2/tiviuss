import React, { useState, useEffect, useRef } from "react";
import GradientText from "../ui/gradientText";

// Simulação do ScrollReveal
const ScrollReveal = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 rotate-0"
          : "opacity-0 translate-y-8 rotate-2"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Imagem flutuante limpa
const FloatingImage = ({ imageUrl, title, category, position = "left" }) => {
  return (
    <div
      className={`
        relative group cursor-pointer w-full max-w-lg mx-auto lg:mx-0
        ${position === "left" ? "lg:justify-self-start" : "lg:justify-self-end"}
      `}
      style={{
        transform: "perspective(1200px) rotateX(8deg) rotateY(-8deg)",
        transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        animation: "imageFloat 8s ease-in-out infinite",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(-20px) scale(1.05)";
        e.currentTarget.style.animation = "none";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "perspective(1200px) rotateX(8deg) rotateY(-8deg) translateY(0px) scale(1)";
        e.currentTarget.style.animation = "imageFloat 8s ease-in-out infinite";
      }}
    >
      {/* Shadow */}
      <div className="absolute inset-0 bg-black/40 rounded-2xl lg:rounded-3xl blur-2xl transform translate-y-8 scale-95 opacity-60" />

      {/* Main Image Container */}
      <div className="relative aspect-video rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl">
        {/* Content Image */}
        <img
          src={imageUrl}
          alt={`${title || category} - Streaming 4K Tivius`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" />

        {/* Content Info */}
        {(title || category) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 lg:p-6">
            {category && (
              <span className="text-purple-500 text-xs lg:text-sm font-semibold uppercase tracking-wide">
                {category}
              </span>
            )}
            {title && (
              <h4 className="text-white text-lg lg:text-xl font-bold mt-1">
                {title}
              </h4>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes imageFloat {
          0%,
          100% {
            transform: perspective(1200px) rotateX(8deg) rotateY(-8deg)
              translateY(0px);
          }
          25% {
            transform: perspective(1200px) rotateX(5deg) rotateY(-5deg)
              translateY(-12px);
          }
          50% {
            transform: perspective(1200px) rotateX(10deg) rotateY(-10deg)
              translateY(-6px);
          }
          75% {
            transform: perspective(1200px) rotateX(3deg) rotateY(-3deg)
              translateY(-18px);
          }
        }
      `}</style>
    </div>
  );
};

// Componente principal
const FloatingImageSection = () => {
  const sections = [
    {
      id: 1,
      position: "left",
      tvContent: {
        imageUrl:
          "https://film-grab.com/wp-content/uploads/2024/06/Godzilla-X-Kong-52.jpg",
        title: "Godzilla x Kong: The New Empire",
        category: "Filme",
      },
      textContent: {
        title: "Qualidade 4K",
        subtitle: "Imagens de outro mundo",
        description: "Viva cada cena com realismo impressionante em Ultra HD.",
      },
    },
    {
      id: 2,
      position: "right",
      tvContent: {
        imageUrl:
          "https://cdn.ome.lt/fU2spkFQZwHiZWTbCKyu-Cvmb9w=/1200x630/smart/extras/conteudos/BANNER_SITE_FILMES_2025_77LfRPS.png",
        title: "",
        category: "Filmes Premium",
      },
      textContent: {
        title: "20.000+ Títulos",
        subtitle: "Biblioteca infinita",
        description: "De clássicos a lançamentos, entretenimento sem limites.",
      },
    },
    {
      id: 3,
      position: "left",
      tvContent: {
        imageUrl:
          "https://static.vecteezy.com/system/resources/thumbnails/049/548/991/small_2x/man-on-sofa-watching-large-led-television-in-living-room-with-copy-space-for-text-photo.jpg",
      },
      textContent: {
        title: "Multitelas",
        subtitle: "Assista em qualquer lugar",
        description: "TV, celular, tablet. Sua diversão te acompanha sempre.",
      },
    },
    {
      id: 4,
      position: "right",
      tvContent: {
        imageUrl:
          "https://www.bitmag.com.br/wp-content/uploads/2024/07/tv-paga.jpg",

        category: "Todos os canais!",
      },
      textContent: {
        title: "Zero Travamentos",
        subtitle: "Streaming ultra rápido",
        description: "Tecnologia que elimina buffering. Fluidez garantida.",
      },
    },
  ];

  // Schema markup para a seção de benefícios
  const benefitsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Benefícios da Plataforma Tivius",
    description: "Principais vantagens do streaming Tivius",
    itemListElement: sections.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: section.textContent.title,
        description: section.textContent.description,
      },
    })),
  };

  return (
    <>
      {/* Schema Markup para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(benefitsSchema) }}
      />

      {/* Seção principal com semantic HTML */}
      <section
        className="min-h-screen"
        aria-labelledby="why-choose-title"
        itemScope
        itemType="https://schema.org/AboutPage"
      >
        {/* Background com efeito de estrelas */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 py-12 lg:py-20">
          {/* Cabeçalho da seção */}
          <header className="text-center mb-12 lg:mb-20 px-4">
            <ScrollReveal>
              <h2
                id="why-choose-title"
                className="text-3xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r text-white mb-4 lg:mb-6"
                itemProp="name"
              >
                Por que escolher a Tivius?
              </h2>
              <p
                className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4"
                itemProp="description"
              >
                A experiência de streaming mais avançada do universo
              </p>
            </ScrollReveal>
          </header>

          {/* Grid de benefícios */}
          <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-16 lg:space-y-24">
            {sections.map((section, index) => (
              <article
                key={section.id}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  section.position === "right" ? "lg:grid-flow-col-dense" : ""
                }`}
                itemScope
                itemType="https://schema.org/Service"
              >
                {/* Imagem */}
                <div
                  className={`${
                    section.position === "right" ? "lg:col-start-2" : ""
                  } order-1 lg:order-none`}
                >
                  <ScrollReveal delay={index * 150}>
                    <FloatingImage
                      imageUrl={section.tvContent.imageUrl}
                      title={section.tvContent.title}
                      category={section.tvContent.category}
                      position={section.position}
                    />
                  </ScrollReveal>
                </div>

                {/* Conteúdo de texto com structured data */}
                <div
                  className={`${
                    section.position === "right" ? "lg:col-start-1" : ""
                  } order-2 lg:order-none`}
                >
                  <ScrollReveal delay={index * 150 + 200}>
                    <div className="space-y-4 lg:space-y-6 text-center lg:text-left">
                      <div className="space-y-3">
                        <h3
                          className="text-3xl lg:text-5xl font-bold text-white"
                          itemProp="name"
                        >
                          {section.textContent.title}
                        </h3>
                        <h4
                          className="text-xl lg:text-2xl text-purple-500 font-medium"
                          itemProp="category"
                        >
                          {section.textContent.subtitle}
                        </h4>
                      </div>

                      <p
                        className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-md mx-auto lg:mx-0"
                        itemProp="description"
                      >
                        {section.textContent.description}
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FloatingImageSection;
