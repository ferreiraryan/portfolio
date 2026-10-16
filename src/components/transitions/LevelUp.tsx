"use client";

import { ReactNode, useRef } from "react";
import { useTransitionTimeline } from "@/lib/useTransitionTimeline";

interface LevelUpProps {
  topLayer: ReactNode;
  bottomLayer: ReactNode;
}

export default function LevelUp({ topLayer, bottomLayer }: LevelUpProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const xpFillRef = useRef<HTMLDivElement>(null);
  const fillAmberRef = useRef<HTMLDivElement>(null);
  const lvlTextRef = useRef<HTMLSpanElement>(null);

  useTransitionTimeline((tl) => {
    const state = { xp: 0, wipe: 1 };

    // Barra enchendo: largura, cor (ciano → âmbar) e texto no mesmo frame.
    const applyXp = () => {
      const v = state.xp;
      if (xpFillRef.current) xpFillRef.current.style.width = `${v}%`;
      if (fillAmberRef.current)
        fillAmberRef.current.style.opacity = `${Math.min(1, v / 100)}`;
      if (lvlTextRef.current) {
        lvlTextRef.current.textContent =
          v >= 99.5
            ? "LEVEL UP! NV. 99 ALCANÇADO!"
            : `CARREGANDO XP: ${Math.round(v)}%`;
      }
    };

    // Wipe de baixo pra cima: o corte do Skills segue exatamente a linha/seta.
    const applyWipe = () => {
      const p = state.wipe;
      if (nextRef.current)
        nextRef.current.style.clipPath = `inset(${p * 100}% 0% 0% 0%)`;
      if (edgeRef.current) edgeRef.current.style.top = `${p * 100}%`;
    };

    tl.set(nextRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, 0)
      .set(edgeRef.current, { top: "100%" }, 0)
      .set(edgeRef.current, { opacity: 1 }, 0.6)

      // Fase 1: HUD surge no rodapé.
      .to(hudRef.current, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.02)

      // Fase 2: barra enche e a tela puxa para a paleta RPG (âmbar).
      .to(state, { xp: 100, duration: 0.5, ease: "power1.inOut", onUpdate: applyXp }, 0.05)
      .to(tintRef.current, { opacity: 0.85, duration: 0.5, ease: "power1.inOut" }, 0.05)

      // Pulso ao bater 100%.
      .to(hudRef.current, { scale: 1.03, duration: 0.1, yoyo: true, repeat: 1 }, 0.55)

      // Fase 3: seta ↑ aparece.
      .to(
        arrowRef.current,
        { opacity: 1, scale: 1, duration: 0.16, ease: "back.out(2)" },
        0.6
      )

      // Fase 4: a seta sobe e o Skills é revelado por onde ela passa.
      .to(state, { wipe: 0, duration: 0.42, ease: "power2.inOut", onUpdate: applyWipe }, 0.72)

      // Fase 5: HUD e seta saem, deixando o Skills 100% visível.
      .to([hudRef.current, arrowRef.current], { opacity: 0, duration: 0.12 }, 1.12);
  });

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#1C120B]"
    >
      {/* Camada superior inicial (Projetos Cyberpunk) */}
      <div className="absolute inset-0 z-10 h-full w-full">{topLayer}</div>

      {/* Tint: muda a cor da tela (ciano/violeta → âmbar RPG) conforme rola */}
      <div
        ref={tintRef}
        className="pointer-events-none absolute inset-0 z-[15] opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, rgba(251,191,36,0.35) 0%, rgba(28,18,11,0.92) 55%, rgba(28,18,11,0.98) 100%)",
        }}
      />

      {/* Camada revelada (Skills — Ficha RPG), revelada de baixo pra cima */}
      <div
        ref={nextRef}
        className="absolute inset-0 z-20 h-full w-full will-change-[clip-path]"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        {bottomLayer}
      </div>

      {/* Borda de varredura: linha luminosa + seta ↑ que sobem junto com o corte */}
      <div
        ref={edgeRef}
        className="pointer-events-none absolute inset-x-0 z-30 opacity-0"
        style={{ top: "100%" }}
      >
        <div className="absolute inset-x-0 top-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_28px_10px_rgba(251,191,36,0.55)]" />
        <div className="absolute inset-x-0 bottom-full mb-1 flex justify-center">
          <div ref={arrowRef} style={{ opacity: 0, transform: "scale(0.6)" }}>
            <svg
              width="34"
              height="20"
              viewBox="0 0 34 20"
              fill="none"
              className="drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
            >
              <path
                d="M3 17 L17 4 L31 17"
                stroke="#fcd34d"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* HUD de Level Up: barra de XP fixa no rodapé */}
      <div
        ref={hudRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 p-5 sm:p-8"
        style={{ opacity: 0, transform: "translateY(24px)" }}
      >
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-amber-200/80">
            <span>✦ Ascensão de Personagem</span>
            <span ref={lvlTextRef} className="text-amber-100">
              CARREGANDO XP: 0%
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-full border border-amber-300/50 bg-black/70 p-[2px] shadow-[0_0_30px_rgba(251,191,36,0.25)]">
            <div
              ref={xpFillRef}
              className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.8)]"
              style={{ width: "0%" }}
            >
              {/* Camada âmbar: faz a barra mudar de ciano para âmbar ao encher */}
              <div
                ref={fillAmberRef}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-yellow-200 shadow-[0_0_22px_rgba(251,191,36,0.9)] opacity-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
