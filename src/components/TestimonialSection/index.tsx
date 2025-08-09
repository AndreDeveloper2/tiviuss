import React, { useEffect, useState } from "react";

const TestimonialsSection = () => {
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);

  // Criar estrelas de fundo
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 100; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 3,
      });
    }
    setStars(newStars);
  }, []);

  // Criar partículas flutuantes
  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        id: Date.now(),
        left: Math.random() * 100,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 2,
      };

      setParticles((prev) => [...prev, newParticle]);

      // Remover partícula após animação
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 15000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Maria Rosa",
      role: "Cliente há 2 semanas",
      avatar: "MR",
      text: "Incrível! A qualidade 4K é perfeita e não trava nunca. Minha família toda ama assistir filmes juntos agora. O melhor streaming que já usei!",
      className: "card-1",
      datePublished: "2024-07-25",
    },
    {
      id: 2,
      name: "João Silva",
      role: "Cliente há 6 meses",
      avatar: "JS",
      text: "Zero travamentos, catálogo gigantesco e preço justo. Cancelei outros streamings depois de conhecer a Tivius. Recomendo 100%!",
      className: "card-2",
      datePublished: "2024-02-09",
    },
    {
      id: 3,
      name: "Ana Ferreira",
      role: "Cliente há 1 mês",
      avatar: "AF",
      text: "Meus filhos adoram! Tem desenhos, filmes, séries... e a qualidade é impressionante. Da para dizer que o suporte é quase 24h sempre me ajuda quando preciso.",
      className: "card-3",
      datePublished: "2024-07-09",
    },
    {
      id: 4,
      name: "Roberto Carlos",
      role: "Cliente há 2 meses",
      avatar: "RC",
      text: "A tecnologia por trás é incrível. Streaming ultra rápido, sem buffering, qualidade 4K real. Definitivamente o futuro do entretenimento!",
      className: "card-4",
      datePublished: "2024-06-09",
    },
    {
      id: 5,
      name: "Lucia Santos",
      role: "Cliente há muito tempo",
      avatar: "LS",
      text: "Economizei muito cancelando outros serviços. A Tivius tem tudo em um lugar só, com qualidade superior e preço imbatível!",
      className: "card-5",
      datePublished: "2023-12-15",
    },
  ];

  // Structured Data para Reviews
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Tivius",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: testimonials.length,
      bestRating: "5",
      worstRating: "5",
    },
    review: testimonials.map((testimonial) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: testimonial.name,
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
      reviewBody: testimonial.text,
      datePublished: testimonial.datePublished,
    })),
  };

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <style jsx>{`
        .testimonials-section {
          position: relative;
          min-height: 100vh;
          padding: 100px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          overflow: hidden;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .star {
          position: absolute;
          background: #fff;
          border-radius: 50%;
          animation: twinkle 3s infinite ease-in-out;
        }

        .star:nth-child(odd) {
          animation-delay: 1s;
        }

        .star:nth-child(3n) {
          animation-delay: 2s;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: 80px;
          z-index: 10;
          position: relative;
        }

        .section-title {
          font-size: 3.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          text-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
        }

        .testimonials-container {
          position: relative;
          width: 100%;
          max-width: 1400px;
          height: 600px;
          z-index: 10;
        }

        .testimonial-card {
          position: absolute;
          width: 350px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 30px;
          color: white;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: transform 0.3s ease;
        }

        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          margin-right: 15px;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }

        .user-info h4 {
          font-size: 1.1rem;
          margin-bottom: 5px;
        }

        .user-info .role {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.9rem;
        }

        .stars-rating {
          display: flex;
          margin-bottom: 15px;
        }

        .star-icon {
          color: #fbbf24;
          font-size: 18px;
          margin-right: 2px;
        }

        .testimonial-text {
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
        }

        .card-1 {
          top: 50px;
          left: 50px;
          animation: float1 6s ease-in-out infinite;
        }

        .card-2 {
          top: 80px;
          right: 100px;
          animation: float2 8s ease-in-out infinite;
        }

        .card-3 {
          bottom: 120px;
          left: 150px;
          animation: float3 7s ease-in-out infinite;
        }

        .card-4 {
          bottom: 50px;
          right: 50px;
          animation: float4 9s ease-in-out infinite;
        }

        .card-5 {
          top: 250px;
          left: 50%;
          transform: translateX(-50%);
          animation: float5 5s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(1deg);
          }
          66% {
            transform: translateY(10px) rotate(-1deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(2deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(15px) rotate(-1deg);
          }
          75% {
            transform: translateY(-25px) rotate(1deg);
          }
        }

        @keyframes float4 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          40% {
            transform: translateY(-15px) rotate(1deg);
          }
          80% {
            transform: translateY(20px) rotate(-2deg);
          }
        }

        @keyframes float5 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-35px) rotate(-1deg);
          }
        }

        .particle {
          position: absolute;
          background: rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          pointer-events: none;
          animation: particle-float 15s linear infinite;
        }

        @keyframes particle-float {
          0% {
            opacity: 0;
            transform: translateY(100vh) scale(0);
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) scale(1);
          }
          90% {
            opacity: 1;
            transform: translateY(-10vh) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20vh) scale(0);
          }
        }

        @media (max-width: 1200px) {
          .testimonials-container {
            height: 800px;
          }

          .testimonial-card {
            width: 300px;
            padding: 25px;
          }

          .card-2 {
            right: 20px;
          }
          .card-4 {
            right: 20px;
          }
          .card-1 {
            left: 20px;
          }
          .card-3 {
            left: 50px;
          }
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2.5rem;
          }

          .testimonials-container {
            height: 1200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            padding: 20px 0;
          }

          .testimonial-card {
            width: 280px;
            padding: 25px;
            position: static !important;
            margin: 0;
          }

          /* Manter animações no mobile */
          .card-1 {
            animation: float1 6s ease-in-out infinite;
          }
          .card-2 {
            animation: float2 8s ease-in-out infinite;
          }
          .card-3 {
            animation: float3 7s ease-in-out infinite;
          }
          .card-4 {
            animation: float4 9s ease-in-out infinite;
          }
          .card-5 {
            animation: float5 5s ease-in-out infinite;
          }
        }
      `}</style>

      <section
        className="testimonials-section"
        id="avaliacoes-clientes"
        aria-labelledby="testimonials-heading"
        role="region"
      >
        <div className="stars" aria-hidden="true">
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            aria-hidden="true"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}

        <header className="section-header">
          <h2 id="testimonials-heading" className="section-title">
            O que dizem nossos usuários
          </h2>
          <p className="section-subtitle">
            Milhares de famílias já descobriram uma nova forma de entretenimento
          </p>
        </header>

        <div
          className="testimonials-container"
          role="group"
          aria-label="Depoimentos de clientes"
        >
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className={`testimonial-card ${testimonial.className}`}
              itemScope
              itemType="https://schema.org/Review"
            >
              <div className="card-header">
                <div
                  className="avatar"
                  aria-label={`Avatar de ${testimonial.name}`}
                >
                  {testimonial.avatar}
                </div>
                <div className="user-info">
                  <h4
                    itemProp="author"
                    itemScope
                    itemType="https://schema.org/Person"
                  >
                    <span itemProp="name">{testimonial.name}</span>
                  </h4>
                  <span className="role">{testimonial.role}</span>
                </div>
              </div>

              <div
                className="stars-rating"
                itemProp="reviewRating"
                itemScope
                itemType="https://schema.org/Rating"
                aria-label="Avaliação: 5 de 5 estrelas"
                role="img"
              >
                <meta itemProp="ratingValue" content="5" />
                <meta itemProp="bestRating" content="5" />
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star-icon" aria-hidden="true">
                    ⭐
                  </span>
                ))}
              </div>

              <blockquote className="testimonial-text">
                <p itemProp="reviewBody">{testimonial.text}</p>
              </blockquote>

              <meta
                itemProp="datePublished"
                content={testimonial.datePublished}
              />
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;
