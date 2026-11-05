"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SectionScrollPrompt from "@/components/navigation/SectionScrollPrompt";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.style.setProperty("--mouse-x", "50%");
      container.style.setProperty("--mouse-y", "50%");
      return;
    }

    let rafId: number | null = null;
    let targetX = 50;
    let targetY = 50;

    const update = () => {
      container.style.setProperty("--mouse-x", `${targetX}%`);
      container.style.setProperty("--mouse-y", `${targetY}%`);
      rafId = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
      if (!rafId) {
        rafId = requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-full flex-col justify-between px-6 py-10 md:px-16 md:py-12 bg-[#050505] text-[#F5F5F7] select-none overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.065), transparent 60%)",
      }}
    >
      <header className="flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.2em] text-neutral-400 select-none">
        <span>01 // Universo Neutro</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ryan Ferreira © 2026
        </span>
      </header>

      <div className="my-auto max-w-5xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/[0.03] text-[11px] font-mono uppercase tracking-[0.3em] text-neutral-400"
        >
          <span>Portfólio &amp; Jornada em TI</span>
          <span className="text-neutral-600">•</span>
          <span>Múltiplas Áreas</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-extrabold tracking-tight text-white leading-none"
        >
          Ryan Ferreira
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 md:mt-8 max-w-2xl mx-auto text-base sm:text-xl md:text-2xl font-light text-neutral-400 leading-relaxed"
        >
          Movido pela curiosidade de entender como tudo funciona — do{" "}
          <span className="text-white font-normal">hardware</span> e da{" "}
          <span className="text-white font-normal">infraestrutura</span> ao{" "}
          <span className="text-white font-normal">código</span>, aos{" "}
          <span className="text-white font-normal">dados</span> e às{" "}
          <span className="text-white font-normal">interfaces</span>.
        </motion.p>
      </div>

      <SectionScrollPrompt targetWorld={2} text="ROLE PARA EXPLORAR A JORNADA" />

      <footer className="flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.2em] text-neutral-400 select-none">
        <span>Next.js 16 • GSAP • Lenis</span>
        <span>01 / 06</span>
      </footer>
    </div>
  );
}
