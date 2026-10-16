"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface CRTProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

export default function CRT({ topLayer, bottomLayer }: CRTProps) {
  const crtOverlayRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const bottomWrapRef = useRef<HTMLDivElement>(null);

  useTransitionTimeline((tl) => {
    // Fase 1: escurece para o tubo desligado e acende o feixe de fósforo.
    tl.to(crtOverlayRef.current, { opacity: 1, duration: 0.15 }, 0.05)
      .to(
        beamRef.current,
        { opacity: 1, scaleX: 1, duration: 0.25, ease: "power3.inOut" },
        0.18
      )
      // Fase 2: o feixe se expande na vertical, ligando a tela CRT do Arcade.
      .to(
        beamRef.current,
        { scaleY: 1, duration: 0.35, ease: "power4.inOut" },
        0.44
      )
      .to(
        bottomWrapRef.current,
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
        0.55
      )
      .to([beamRef.current, crtOverlayRef.current], { opacity: 0, duration: 0.2 }, 0.78);
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050508]">
      {/* Camada superior inicial (Estante Mangá/HQ) */}
      <div className="absolute inset-0 z-10 h-full w-full">{topLayer}</div>

      {/* Tela preta do tubo CRT */}
      <div
        ref={crtOverlayRef}
        className="pointer-events-none absolute inset-0 z-20 bg-[#040406] opacity-0"
      />

      {/* Feixe de elétrons branco/verde que liga o monitor CRT */}
      <div
        ref={beamRef}
        className="pointer-events-none absolute inset-0 z-30 bg-emerald-300 shadow-[0_0_80px_#34d399]"
        style={{ transform: "scale(0, 0.008)", opacity: 0 }}
      />

      {/* Camada inferior revelada: Contato Arcade */}
      <div
        ref={bottomWrapRef}
        className="absolute inset-0 z-40 h-full w-full will-change-transform"
        style={{ opacity: 0, transform: "scale(0.96)" }}
      >
        {bottomLayer}
      </div>
    </section>
  );
}
