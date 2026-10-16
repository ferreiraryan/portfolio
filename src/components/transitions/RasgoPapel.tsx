"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface RasgoPapelProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

/** PRNG determinístico (mesma sequência no servidor e no cliente). */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/**
 * Gera a "linha de rasgo": uma borda quase horizontal (y ≈ 50%) com ruído
 * fino e eventuais picos (fibras do papel). O resultado é irregular, como um
 * papel rasgado de verdade — e não um zigue-zague simétrico.
 */
function makeTearSeam() {
  const rand = mulberry32(0x5eed1234);
  const count = 56;
  const pts: { x: number; y: number }[] = [];

  for (let i = 0; i <= count; i++) {
    const x = (i / count) * 100;
    let y =
      50 +
      Math.sin(i * 0.42) * 0.35 +
      Math.sin(i * 2.7) * 0.34 +
      (rand() - 0.5) * 1.5;

    // entalhes/picos curtos: a fibra cede de forma irregular
    if (rand() < 0.18) {
      y += (rand() < 0.5 ? -1 : 1) * (1.5 + rand() * 2.1);
    }
    pts.push({ x, y: clamp(y, 46, 54) });
  }

  const toStr = (arr: { x: number; y: number }[]) =>
    arr.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(", ");

  const leftToRight = toStr(pts);
  const rightToLeft = toStr([...pts].reverse());

  // Meia superior: topo reto + borda rasgada (da direita para a esquerda).
  const topClip = `polygon(0% 0%, 100% 0%, ${rightToLeft})`;
  // Meia inferior: borda rasgada (esquerda → direita) + base reta.
  const bottomClip = `polygon(${leftToRight}, 100% 100%, 0% 100%)`;

  const seamPoints = pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

  // Pequenos fios saindo da borda, em direção ao vão do rasgo.
  const hairs: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 3; i < pts.length - 3; i += 2) {
    if (rand() < 0.45) {
      const p = pts[i];
      const len = 1 + rand() * 1.9;
      const dir = p.y < 50 ? -1 : 1;
      hairs.push({
        x1: p.x,
        y1: p.y,
        x2: p.x + (rand() - 0.5) * 2.6,
        y2: p.y + dir * len,
      });
    }
  }

  return { topClip, bottomClip, seamPoints, hairs };
}

const { topClip: TOP_CLIP, bottomClip: BOTTOM_CLIP, seamPoints: SEAM_POINTS, hairs: HAIRS } =
  makeTearSeam();

export default function RasgoPapel({ topLayer, bottomLayer }: RasgoPapelProps) {
  const halfARef = useRef<HTMLDivElement>(null);
  const halfBRef = useRef<HTMLDivElement>(null);
  const seamSvgRef = useRef<SVGSVGElement>(null);
  const seamLineRef = useRef<SVGPolylineElement>(null);

  useTransitionTimeline((tl) => {
    // 1. O rasgo se propaga pelo papel (a linha "corta" de fora a fora).
    tl.to(seamSvgRef.current, { autoAlpha: 1, duration: 0.07 }, 0.04)
      .to(
        seamLineRef.current,
        { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut" },
        0.04
      )
      // 2. O papel cede e se abre, com uma leve torção.
      .to(
        seamSvgRef.current,
        { autoAlpha: 0, duration: 0.12 },
        0.42
      )
      .to(
        halfARef.current,
        { yPercent: -104, rotation: -1.8, duration: 0.7, ease: "power3.inOut" },
        0.4
      )
      .to(
        halfBRef.current,
        { yPercent: 104, rotation: 1.8, duration: 0.7, ease: "power3.inOut" },
        0.4
      );
  });

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#D6D3CD]">
      {/* Mundo revelado por trás do papel */}
      <div className="absolute inset-0 z-10 h-full w-full">{bottomLayer}</div>

      {/* Meia superior do papel (Hero) */}
      <div
        ref={halfARef}
        className="absolute inset-0 z-20 will-change-transform"
        style={{
          clipPath: TOP_CLIP,
          filter: "drop-shadow(0px 16px 14px rgba(0,0,0,0.45))",
        }}
      >
        {topLayer}
        {/* Sombra interna na borda rasgada */}
        <div
          className="pointer-events-none absolute inset-x-0 z-30 h-[9%]"
          style={{
            top: "44.5%",
            background:
              "linear-gradient(to bottom, transparent 55%, rgba(60,55,48,0.45) 100%)",
          }}
        />
      </div>

      {/* Meia inferior do papel (Hero) */}
      <div
        ref={halfBRef}
        className="absolute inset-0 z-20 will-change-transform"
        style={{
          clipPath: BOTTOM_CLIP,
          filter: "drop-shadow(0px -16px 14px rgba(0,0,0,0.45))",
        }}
      >
        {topLayer}
        <div
          className="pointer-events-none absolute inset-x-0 z-30 h-[9%]"
          style={{
            top: "46.5%",
            background:
              "linear-gradient(to top, transparent 55%, rgba(60,55,48,0.45) 100%)",
          }}
        />
      </div>

      {/* Fibras e brilho da borda rasgada */}
      <svg
        ref={seamSvgRef}
        className="pointer-events-none absolute inset-0 z-30 h-full w-full opacity-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* espessura do papel exposta pelo rasgo */}
        <polyline
          points={SEAM_POINTS}
          fill="none"
          stroke="#EFEAE1"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.9}
          vectorEffect="non-scaling-stroke"
        />
        {/* brilho fibroso */}
        <polyline
          points={SEAM_POINTS}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.8}
          vectorEffect="non-scaling-stroke"
        />
        {HAIRS.map((h, i) => (
          <line
            key={i}
            x1={h.x1}
            y1={h.y1}
            x2={h.x2}
            y2={h.y2}
            stroke="#F3EEE6"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.75}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* linha que se propaga como uma lágrima/corte */}
        <polyline
          ref={seamLineRef}
          points={SEAM_POINTS}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="120"
          strokeDashoffset="120"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
