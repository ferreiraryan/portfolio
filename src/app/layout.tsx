import type { Metadata } from "next";
import { Inter, Syne, Playfair_Display, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Ryan Ferreira — Tecnologia, Computação & Projetos",
  description:
    "Portfólio de Ryan Ferreira. Estudante de Ciência da Computação (PUC Minas) e Técnico em Informática (COTEMIG), explorando desenvolvimento de software, infraestrutura, dados, IoT, suporte e segurança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${syne.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="bg-[#050505] text-[#F5F5F7] antialiased selection:bg-white selection:text-black">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
