"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface PainelHQProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

export default function PainelHQ({ topLayer, bottomLayer }: PainelHQProps) {
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const sfxBadgeRef = useRef<HTMLDivElement>(null);
  const bottomWrapRef = useRef<HTMLDivElement>(null);

  useTransitionTimeline((tl) => {
    // Onomatopeia de mangá explode no centro e os painéis diagonais se abrem.
    tl.to(
      sfxBadgeRef.current,
      { scale: 1.1, rotation: -6, opacity: 1, duration: 0.2, ease: "back.out(2)" },
      0.05
    )
      .to(sfxBadgeRef.current, { scale: 0, opacity: 0, duration: 0.18 }, 0.38)
      .to(
        leftPanelRef.current,
        { xPercent: -105, duration: 0.65, ease: "power3.inOut" },
        0.22
      )
      .to(
        rightPanelRef.current,
        { xPercent: 105, duration: 0.65, ease: "power3.inOut" },
        0.22
      )
      .to(
        bottomWrapRef.current,
        { scale: 1, duration: 0.6, ease: "power2.out" },
        0.28
      );
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#F4F0EA]">
      {/* Camada inferior revelada: Estante Mangá/HQ */}
      <div
        ref={bottomWrapRef}
        className="absolute inset-0 z-10 h-full w-full will-change-transform"
        style={{ transform: "scale(0.92)" }}
      >
        {bottomLayer}
      </div>

      {/* Painel esquerdo de quadrinho (com borda preta grossa) */}
      <div
        ref={leftPanelRef}
        className="absolute inset-0 z-20 will-change-transform"
        style={{
          clipPath: "polygon(0% 0%, 58% 0%, 42% 100%, 0% 100%)",
          filter: "drop-shadow(10px 0px 0px #000000)",
        }}
      >
        {topLayer}
      </div>

      {/* Painel direito de quadrinho */}
      <div
        ref={rightPanelRef}
        className="absolute inset-0 z-20 will-change-transform"
        style={{
          clipPath: "polygon(58% 0%, 100% 0%, 100% 100%, 42% 100%)",
          filter: "drop-shadow(-10px 0px 0px #000000)",
        }}
      >
        {topLayer}
      </div>

      {/* Onomatopeia estilo Mangá/HQ na abertura do painel */}
      <div
        ref={sfxBadgeRef}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
        style={{ opacity: 0, transform: "scale(0) rotate(-12deg)" }}
      >
        <div className="border-4 border-black bg-yellow-300 px-6 py-3 font-display text-3xl font-black uppercase tracking-tight text-black shadow-[8px_8px_0px_#000000] sm:text-5xl">
          ドン! {"// SNAP!"}
        </div>
      </div>
    </section>
  );
}
