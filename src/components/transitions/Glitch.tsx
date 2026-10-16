"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface GlitchProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

const SHARDS = [
  {
    clip: "polygon(0% 0%, 54% 0%, 46% 48%, 0% 38%)",
    tx: -115,
    ty: -85,
    rot: -14,
  },
  {
    clip: "polygon(54% 0%, 100% 0%, 100% 44%, 46% 48%)",
    tx: 115,
    ty: -75,
    rot: 12,
  },
  {
    clip: "polygon(0% 38%, 46% 48%, 52% 100%, 0% 100%)",
    tx: -110,
    ty: 90,
    rot: 11,
  },
  {
    clip: "polygon(46% 48%, 100% 44%, 100% 100%, 52% 100%)",
    tx: 110,
    ty: 85,
    rot: -13,
  },
];

export default function Glitch({ topLayer, bottomLayer }: GlitchProps) {
  const shardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cracksSvgRef = useRef<SVGSVGElement>(null);
  const glitchFlashRef = useRef<HTMLDivElement>(null);
  const bottomWrapRef = useRef<HTMLDivElement>(null);

  useTransitionTimeline((tl) => {
    // Fase 1: trincas de vidro + pulso de aberração cromática.
    tl.to(cracksSvgRef.current, { opacity: 1, duration: 0.15 }, 0.05)
      .to(
        glitchFlashRef.current,
        { opacity: 0.85, duration: 0.08, yoyo: true, repeat: 3 },
        0.12
      )
      .to(cracksSvgRef.current, { opacity: 0, duration: 0.12 }, 0.36);

    // Fase 2: cada caco voa para fora, revelando o mundo de baixo.
    SHARDS.forEach((s, i) => {
      const el = shardRefs.current[i];
      if (!el) return;
      tl.to(
        el,
        {
          xPercent: s.tx * 0.06,
          yPercent: s.ty * 0.04,
          rotation: s.rot * 0.15,
          duration: 0.15,
          ease: "power2.in",
        },
        0.2
      ).to(
        el,
        {
          xPercent: s.tx,
          yPercent: s.ty,
          rotation: s.rot,
          opacity: 0,
          duration: 0.6,
          ease: "power3.inOut",
        },
        0.35
      );
    });

    tl.to(
      bottomWrapRef.current,
      { scale: 1, filter: "hue-rotate(0deg)", duration: 0.55, ease: "power2.out" },
      0.38
    );
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0D041A]">
      {/* Camada revelada ao fundo: Projetos Cyberpunk */}
      <div
        ref={bottomWrapRef}
        className="absolute inset-0 z-10 h-full w-full will-change-transform"
        style={{ transform: "scale(0.94)", filter: "hue-rotate(90deg)" }}
      >
        {bottomLayer}
      </div>

      {/* Cacos da camada superior (Sobre — Livro) que estilhaçam */}
      {SHARDS.map((shard, idx) => (
        <div
          key={idx}
          ref={(el) => {
            shardRefs.current[idx] = el;
          }}
          className="absolute inset-0 z-20 will-change-transform"
          style={{
            clipPath: shard.clip,
            filter:
              "drop-shadow(4px 0px 0px rgba(236,72,153,0.7)) drop-shadow(-4px 0px 0px rgba(34,211,238,0.7))",
          }}
        >
          {topLayer}
        </div>
      ))}

      {/* Flash Glitch RGB */}
      <div
        ref={glitchFlashRef}
        className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-r from-fuchsia-600/40 via-cyan-400/30 to-purple-600/40 opacity-0 mix-blend-screen"
      />

      {/* Linhas de vidro trincado */}
      <svg
        ref={cracksSvgRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d="M54,0 L46,48 L0,38 M46,48 L100,44 M46,48 L52,100 M46,48 L22,18 M46,48 L78,74"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="0.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M54.4,0 L46.4,48.3 L0,38.3 M46.4,48.3 L100,44.3 M46.4,48.3 L52.4,100"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
