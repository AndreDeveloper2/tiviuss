// GalaxyBackground.jsx
"use client";

import { ReactNode } from "react";

interface GalaxyBackgroundProps {
  children: ReactNode;
  className?: string;
}

export default function GalaxyBackground({
  children,
  className = "",
}: GalaxyBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Fundo principal: preto -> cinza-900 -> branco */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-white"></div>

      {/* Overlay roxo sutil apenas no meio/baixo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/15 to-purple-900/10"></div>

      {/* Camada de estrelas */}
      <div className="absolute inset-0">
        {/* Estrelas pequenas */}
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Nebulosas sutis */}
      <div className="absolute inset-0">
        <div
          className="absolute top-[30%] left-[20%] w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[25%] right-[15%] w-52 h-52 bg-blue-500/8 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s", animationDuration: "10s" }}
        ></div>
      </div>

      {/* Shooting stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-[15%] -left-2 w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-0 animate-[shooting_8s_infinite]"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-[65%] -left-2 w-12 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-0 animate-[shooting_8s_infinite]"
          style={{ animationDelay: "7s" }}
        ></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes shooting {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(-200px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
