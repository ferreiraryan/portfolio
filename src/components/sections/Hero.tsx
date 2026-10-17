"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative flex h-screen w-full flex-col justify-between px-6 py-10 md:px-16 md:py-12 bg-[#050505] text-[#F5F5F7] select-none overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(550px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.065), transparent 60%)`,
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

      <footer className="flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.2em] text-neutral-400 select-none">
        <span>Next.js 16 • GSAP • Lenis</span>
        <div className="flex items-center gap-2 text-neutral-300">
          <span>Role para rasgar</span>
          <span className="inline-block animate-bounce">↓</span>
        </div>
        <span>01 / 06</span>
      </footer>
    </div>
  );
}
