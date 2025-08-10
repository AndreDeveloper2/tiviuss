import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tivius - Streaming Premium",
  description:
    "🚀 A revolução do streaming chegou! Qualidade 4K real, catálogo gigantesco, instalação em segundos. Teste GRÁTIS agora! Sem contrato, sem CPF, sem complicação.",
  authors: [{ name: "Tivius" }],
  keywords: ["streaming", "4K", "TV", "entretenimento", "sem contrato"],
  openGraph: {
    type: "website",
    url: "https://seudominio.com.br",
    title: "Tivius - Streaming Premium 4K | Teste Grátis Agora!",
    description:
      "🎬 Streaming premium com qualidade 4K, catálogo gigantesco e zero burocracia! Funciona em qualquer dispositivo. Teste grátis e comprove!",
    siteName: "Tivius",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tivius - Streaming Premium 4K | Teste Grátis!",
    description:
      "🚀 A revolução do streaming! Qualidade 4K, sem contrato, sem burocracia. Teste grátis agora!",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  alternates: {
    canonical: "https://seudominio.com.br",
    languages: {
      "pt-br": "https://seudominio.com.br",
      "x-default": "https://seudominio.com.br",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
