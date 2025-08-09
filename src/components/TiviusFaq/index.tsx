import React, { useState, useEffect } from "react";
import ButtonTest from "../ButtonTest";

const TiviusFAQ = () => {
  const [openItem, setOpenItem] = useState(null);
  const [stars, setStars] = useState([]);
  const [particles, setParticles] = useState([]);

  // Criar estrelas de fundo
  useEffect(() => {
    const newStars = [];
    for (let i = 0; i < 80; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 1,
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
        size: Math.random() * 4 + 2,
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 12000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const faqItems = [
    {
      id: 1,
      question:
        "Como funciona o Tivius? Precisa instalar cabos ou fazer visita técnica?",
      answer:
        "Não precisa de nada disso! O Tivius funciona 100% online. Você recebe o acesso por WhatsApp e instala em segundos nos seus dispositivos. Sem cabos, sem visita técnica, sem complicação!",
      icon: "🚀",
      keywords: "como funciona tivius streaming online instalação",
    },
    {
      id: 2,
      question: "Posso testar antes de fechar o plano?",
      answer:
        "Claro! Oferecemos teste gratuito para você experimentar a qualidade 4K e todo nosso catálogo. Assim você pode ver que realmente vale a pena antes de assinar.",
      icon: "🎯",
      keywords: "teste grátis tivius experimentar antes de assinar",
    },
    {
      id: 3,
      question: "Precisa de contrato ou consulta ao CPF?",
      answer:
        "Não! Zero burocracia. Não pedimos CPF, não fazemos consulta e não tem contrato de fidelidade. Você pode cancelar quando quiser, sem multa e sem complicação.",
      icon: "✅",
      keywords: "sem contrato sem cpf sem burocracia tivius",
    },
    {
      id: 4,
      question: "Em quais dispositivos posso assistir?",
      answer:
        "Funciona em praticamente tudo! Computador, tablet, celular, TV Smart, TV Box, Fire Stick, Chromecast e muito mais. Você instala uma vez e assiste onde quiser.",
      icon: "📱",
      keywords: "dispositivos compatíveis tv smart fire stick chromecast",
    },
    {
      id: 5,
      question: "Quantas pessoas podem assistir ao mesmo tempo?",
      answer:
        "Dependendo do seu plano, você pode ter múltiplas telas simultâneas. Toda família pode assistir conteúdos diferentes ao mesmo tempo, sem travamentos!",
      icon: "👨‍👩‍👧‍👦",
      keywords: "múltiplas telas simultâneas família assistir junto",
    },
    {
      id: 6,
      question: "Precisa de internet muito rápida?",
      answer:
        "Nossa tecnologia é otimizada! Funciona bem a partir de 10MB. Mas quanto melhor sua internet, melhor a qualidade. E o melhor: não trava nem com internet mais fraca!",
      icon: "⚡",
      keywords: "velocidade internet necessária 10mb streaming",
    },
    {
      id: 7,
      question: "E se eu quiser cancelar?",
      answer:
        "Super fácil! Sem multa, sem burocracia. É só nos avisar pelo WhatsApp e cancelamos na hora. Não fazemos drama nem tentamos te convencer a ficar.",
      icon: "🔓",
      keywords: "cancelar tivius sem multa fácil cancelamento",
    },
    {
      id: 8,
      question: "Quanto custa? Tem taxa de instalação?",
      answer:
        "Temos planos a partir de R$ 39,90/mês. Zero taxa de instalação, zero taxa de adesão. O preço que você vê é o preço que você paga, sem pegadinhas!",
      icon: "💰",
      keywords: "preço tivius 39,90 sem taxa instalação custo",
    },
  ];

  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  // Structured Data para FAQ
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <style jsx>{`
        .faq-section {
          position: relative;
          min-height: 100vh;
          padding: 80px 20px;
          overflow: hidden;
        }

        .stars {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .star {
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          animation: twinkle 4s infinite ease-in-out;
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        .particle {
          position: absolute;
          background: linear-gradient(
            45deg,
            rgba(139, 92, 246, 0.4),
            rgba(59, 130, 246, 0.4)
          );
          border-radius: 50%;
          pointer-events: none;
          animation: particle-rise 12s linear infinite;
        }

        @keyframes particle-rise {
          0% {
            opacity: 0;
            transform: translateY(100vh) scale(0) rotate(0deg);
          }
          10% {
            opacity: 1;
            transform: translateY(90vh) scale(1) rotate(45deg);
          }
          90% {
            opacity: 1;
            transform: translateY(-10vh) scale(1) rotate(315deg);
          }
          100% {
            opacity: 0;
            transform: translateY(-20vh) scale(0) rotate(360deg);
          }
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
        }

        .faq-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .faq-title {
          font-size: 3.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
          0%,
          100% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            text-shadow: 0 0 40px rgba(139, 92, 246, 0.6);
          }
        }

        .faq-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 600px;
          margin: 0 auto;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .faq-item {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: float-in 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        .faq-item:nth-child(1) {
          animation-delay: 0.1s;
        }
        .faq-item:nth-child(2) {
          animation-delay: 0.2s;
        }
        .faq-item:nth-child(3) {
          animation-delay: 0.3s;
        }
        .faq-item:nth-child(4) {
          animation-delay: 0.4s;
        }
        .faq-item:nth-child(5) {
          animation-delay: 0.5s;
        }
        .faq-item:nth-child(6) {
          animation-delay: 0.6s;
        }
        .faq-item:nth-child(7) {
          animation-delay: 0.7s;
        }
        .faq-item:nth-child(8) {
          animation-delay: 0.8s;
        }

        @keyframes float-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .faq-item.open {
          border-color: rgba(139, 92, 246, 0.4);
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
          transform: scale(1.02);
        }

        .faq-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 25px 30px;
          cursor: pointer;
          color: white;
          font-weight: 600;
          font-size: 1.1rem;
          user-select: none;
          transition: all 0.3s ease;
        }

        .faq-question:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .question-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .question-icon {
          font-size: 1.5rem;
          animation: bounce 2s infinite ease-in-out;
        }

        @keyframes bounce {
          0%,
          20%,
          50%,
          80%,
          100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        .toggle-icon {
          font-size: 1.2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          color: #8b5cf6;
        }

        .faq-item.open .toggle-icon {
          transform: rotate(45deg);
          color: #06b6d4;
        }

        .faq-answer {
          padding: 0 30px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          font-size: 1rem;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .faq-item.open .faq-answer {
          max-height: 200px;
          opacity: 1;
          padding: 0 30px 30px 30px;
          animation: slide-in 0.4s ease-out;
        }

        @keyframes slide-in {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .cta-section {
          text-align: center;
          margin-top: 60px;
          padding: 40px;
          background: rgba(139, 92, 246, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(20px);
        }

        .cta-text {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 25px;
        }

        .cta-button {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          padding: 15px 40px;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          animation: pulse-button 2s infinite ease-in-out;
        }

        @keyframes pulse-button {
          0%,
          100% {
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          }
          50% {
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
          }
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
        }

        @media (max-width: 768px) {
          .faq-title {
            font-size: 2.5rem;
          }

          .faq-question {
            padding: 20px;
            font-size: 1rem;
          }

          .question-content {
            gap: 10px;
          }

          .question-icon {
            font-size: 1.2rem;
          }

          .faq-answer {
            padding: 0 20px;
            font-size: 0.9rem;
          }

          .faq-item.open .faq-answer {
            padding: 0 20px 25px 20px;
          }

          .cta-section {
            padding: 30px 20px;
            margin-top: 40px;
          }
        }
      `}</style>

      <section
        className="faq-section"
        id="perguntas-frequentes"
        aria-labelledby="faq-heading"
        role="region"
        itemScope
        itemType="https://schema.org/FAQPage"
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
            }}
          />
        ))}

        <div className="container">
          <header className="faq-header">
            <h2 id="faq-heading" className="faq-title">
              Dúvidas Frequentes
            </h2>
            <p className="faq-subtitle">
              Tudo que você precisa saber sobre o streaming do futuro
            </p>
          </header>

          <div
            className="faq-list"
            role="list"
            aria-label="Lista de perguntas frequentes"
          >
            {faqItems.map((item, index) => (
              <article
                key={item.id}
                className={`faq-item ${openItem === item.id ? "open" : ""}`}
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
                role="listitem"
              >
                <h3
                  className="faq-question"
                  onClick={() => toggleItem(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={openItem === item.id}
                  aria-controls={`faq-answer-${item.id}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleItem(item.id);
                    }
                  }}
                  data-keywords={item.keywords}
                >
                  <div className="question-content">
                    <span
                      className="question-icon"
                      aria-hidden="true"
                      role="img"
                      aria-label="Ícone da pergunta"
                    >
                      {item.icon}
                    </span>
                    <span itemProp="name">{item.question}</span>
                  </div>
                  <span className="toggle-icon" aria-hidden="true">
                    +
                  </span>
                </h3>

                <div
                  id={`faq-answer-${item.id}`}
                  className="faq-answer"
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                  role="region"
                  aria-labelledby={`faq-question-${item.id}`}
                >
                  <p itemProp="text">{item.answer}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="cta-section" role="complementary">
            <p className="cta-text">
              Ainda tem dúvidas? Teste grátis agora mesmo!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <ButtonTest />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default TiviusFAQ;
