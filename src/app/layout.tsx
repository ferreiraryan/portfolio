import type { Metadata, Viewport } from "next";
import { Inter, Syne, Playfair_Display, JetBrains_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ryanferreira.dev";

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ryan Ferreira — Tecnologia, Computação & Projetos",
    template: "%s | Ryan Ferreira",
  },
  description:
    "Portfólio cinematográfico de Ryan Ferreira. Estudante de Ciência da Computação (PUC Minas) e Técnico em Informática (COTEMIG), explorando engenharia de software, desenvolvimento full-stack e experiências interativas.",
  keywords: [
    "Ryan Ferreira",
    "Desenvolvedor de Software",
    "Ciência da Computação",
    "Engenharia de Software",
    "Full-Stack",
    "TypeScript",
    "Next.js",
    "React",
    "Tailwind CSS",
    "GSAP",
    "Portfólio",
  ],
  authors: [{ name: "Ryan Ferreira", url: "https://github.com/ferreiraryan" }],
  creator: "Ryan Ferreira",
  publisher: "Ryan Ferreira",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    title: "Ryan Ferreira — Tecnologia, Computação & Projetos",
    description:
      "Portfólio cinematográfico através de 6 mundos interativos. Ciência da Computação, desenvolvimento de software e projetos.",
    siteName: "Ryan Ferreira",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ryan Ferreira — Tecnologia, Computação & Projetos",
    description:
      "Portfólio cinematográfico através de 6 mundos interativos. Ciência da Computação, desenvolvimento de software e projetos.",
    creator: "@ferryan",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
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
