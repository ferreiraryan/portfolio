"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface CRTProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

/**
 * Transição CRT: a Estante (papel) colapsa em uma linha de varredura, que troca
 * de cor para o fósforo verde do Arcade; a partir dessa linha o raster do
 * Contato se expande até a tela cheia, com flash e scanlines assentando.
 *
 * Diferente do fade-to-black anterior, a camada de saída é *transformada* e a
 * camada de entrada nasce da própria linha — nada de retângulo verde cobrindo
 * a tela.
 */
export default function CRT({ topLayer, bottomLayer }: CRTProps) {
  const topWrapRef = useRef<HTMLDivElement>(null);
  const bottomWrapRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const scanlineRef = useRef<HTMLDivElement>(null);
  const osdRef = useRef<HTMLDivElement>(null);

  useTransitionTimeline((tl) => {
    tl.set(
      topWrapRef.current,
      { transformOrigin: "50% 50%", pointerEvents: "auto" },
      0
    )
      .set(
        bottomWrapRef.current,
        { transformOrigin: "50% 50%", scaleY: 0.004 },
        0
      )
      .set(
        [beamRef.current, flashRef.current, scanlineRef.current, osdRef.current],
        { opacity: 0 },
        0
      )

      // 1. O sinal da Estante colapsa em uma linha quente de varredura.
      .to(
        topWrapRef.current,
        {
          scaleY: 0.004,
          scaleX: 1.04,
          filter: "brightness(2.4) saturate(0.1)",
          duration: 0.2,
          ease: "power3.in",
        },
        0
      )

      // 2. Handoff: a linha de papel vira o feixe de fósforo.
      .to(
        beamRef.current,
        { opacity: 1, scaleX: 1, duration: 0.1, ease: "power2.out" },
        0.14
      )
      .set(topWrapRef.current, { pointerEvents: "none" }, 0.2)
      .to(topWrapRef.current, { opacity: 0, duration: 0.05 }, 0.2)
      .to(
        beamRef.current,
        {
          backgroundColor: "#34D399",
          boxShadow: "0 0 48px 12px rgba(52,211,153,0.7)",
          duration: 0.08,
        },
        0.22
      )

      // 3. O raster do Arcade abre a partir da linha.
      .to(
        bottomWrapRef.current,
        { scaleY: 1, duration: 0.4, ease: "power4.out" },
        0.3
      )

      // 4. Flash de fósforo + scanlines assentando.
      .to(flashRef.current, { opacity: 0.6, duration: 0.05 }, 0.33)
      .to(flashRef.current, { opacity: 0, duration: 0.18 }, 0.38)
      .fromTo(
        bottomWrapRef.current,
        { filter: "brightness(1.7) contrast(0.92)" },
        { filter: "brightness(1) contrast(1)", duration: 0.34, ease: "power2.out" },
        0.34
      )
      .to(scanlineRef.current, { opacity: 0.45, duration: 0.06 }, 0.4)
      .to(scanlineRef.current, { opacity: 0, duration: 0.24 }, 0.5)
      .to(beamRef.current, { opacity: 0, duration: 0.2 }, 0.46)

      // 5. OSD de power-on, one-shot: some quando o dwell do Contato começa.
      .fromTo(
        osdRef.current,
        { opacity: 0, y: -6 },
        { opacity: 1, y: 0, duration: 0.12 },
        0.6
      )
      .to(osdRef.current, { opacity: 0, duration: 0.14 }, 0.84);
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050508]">
      {/* Camada de entrada (Contato Arcade): raster colapsado em linha */}
      <div
        ref={bottomWrapRef}
        className="absolute inset-0 z-10 h-full w-full will-change-transform"
        style={{
          transformOrigin: "50% 50%",
          transform: "scaleY(0.004)",
          filter: "brightness(1) contrast(1)",
        }}
      >
        {bottomLayer}
      </div>

      {/* Camada de saída (Estante Mangá/HQ): colapsa na linha */}
      <div
        ref={topWrapRef}
        className="absolute inset-0 z-20 h-full w-full will-change-transform"
        style={{
          transformOrigin: "50% 50%",
          filter: "brightness(1) saturate(1)",
        }}
      >
        {topLayer}
      </div>

      {/* Flash de fósforo na abertura do raster */}
      <div
        ref={flashRef}
        className="pointer-events-none absolute inset-0 z-30 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(220,255,235,0.95), rgba(52,211,153,0.35) 60%, transparent 85%)",
        }}
      />

      {/* Scanlines de assentamento (degauss) */}
      <div
        ref={scanlineRef}
        className="pointer-events-none absolute inset-0 z-[35] opacity-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0,0,0,0.4) 2px 4px)",
        }}
      />

      {/* Feixe de elétrons: linha fina real, sem translate (GSAP controla o transform) */}
      <div
        ref={beamRef}
        className="pointer-events-none absolute inset-x-0 z-40 opacity-0"
        style={{
          top: "50%",
          height: "2px",
          marginTop: "-1px",
          transform: "scaleX(0)",
          backgroundColor: "#F4F0EA",
          boxShadow: "0 0 24px 5px rgba(255,255,255,0.7)",
        }}
      />

      {/* OSD de power-on (escondido no mobile, onde o header ocupa a faixa) */}
      <div className="pointer-events-none absolute inset-x-0 top-24 z-[45] hidden justify-center sm:flex">
        <div
          ref={osdRef}
          className="border border-emerald-400/60 bg-black/75 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300 opacity-0"
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 align-middle" />
          POWER ON — SIGNAL OK · 60Hz
        </div>
      </div>
    </section>
  );
}
