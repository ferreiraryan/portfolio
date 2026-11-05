"use client";

import { journeyStore } from "@/lib/journeyStore";

interface SectionScrollPromptProps {
  targetWorld: number; // 1..6
  text?: string;
  direction?: "down" | "up";
  className?: string;
}

interface PromptTheme {
  defaultText: string;
  containerClasses: string;
  mouseBorder: string;
  mouseDot: string;
  arrowColor: string;
  focusRing: string;
}

const PROMPT_THEMES: Record<number, PromptTheme> = {
  // 1. Hero (Origem / Branco / Minimalista)
  1: {
    defaultText: "VOLTAR AO INÍCIO",
    containerClasses:
      "bg-black/80 text-neutral-200 border border-white/30 shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:border-white/70 hover:text-white hover:bg-white/10",
    mouseBorder: "border-neutral-300 group-hover:border-white",
    mouseDot: "bg-white",
    arrowColor: "text-white",
    focusRing: "focus-visible:ring-white",
  },
  // 2. Sobre (O Livro / Pergaminho / Sépias & Dourados Quentes)
  2: {
    defaultText: "ROLE PARA EXPLORAR A JORNADA",
    containerClasses:
      "bg-[#1E1B18]/85 text-[#EAE6DF] border border-[#C4BFB6]/50 shadow-[0_8px_30px_rgba(214,211,205,0.22)] hover:border-[#EAE6DF] hover:bg-[#2A2621]",
    mouseBorder: "border-[#C4BFB6]/70 group-hover:border-[#EAE6DF]",
    mouseDot: "bg-[#EAE6DF]",
    arrowColor: "text-[#EAE6DF]",
    focusRing: "focus-visible:ring-[#EAE6DF]",
  },
  // 3. Projetos (Terminal Cyberpunk / Ciano Neon)
  3: {
    defaultText: "ROLE PARA OS PROJETOS",
    containerClasses:
      "bg-[#0D041A]/90 text-cyan-200 border border-cyan-400/50 shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:border-cyan-300 hover:text-white hover:bg-[#150628]",
    mouseBorder: "border-cyan-400/70 group-hover:border-cyan-300",
    mouseDot: "bg-cyan-400",
    arrowColor: "text-cyan-400",
    focusRing: "focus-visible:ring-cyan-400",
  },
  // 4. Skills (Grimório RPG / Dourado Âmbar)
  4: {
    defaultText: "ROLE PARA AS HABILIDADES",
    containerClasses:
      "bg-[#1C120B]/90 text-amber-200 border border-amber-400/50 shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:border-amber-300 hover:text-white hover:bg-[#2A1B10]",
    mouseBorder: "border-amber-400/70 group-hover:border-amber-300",
    mouseDot: "bg-amber-400",
    arrowColor: "text-amber-400",
    focusRing: "focus-visible:ring-amber-400",
  },
  // 5. Estante (Mangá & HQ / P&B Halftone Sólido)
  5: {
    defaultText: "ROLE PARA ABRIR A ESTANTE",
    containerClasses:
      "bg-[#F4F0EA] text-neutral-900 border-2 border-black shadow-[4px_4px_0px_#000000] hover:bg-white hover:shadow-[5px_5px_0px_#000000]",
    mouseBorder: "border-black",
    mouseDot: "bg-black",
    arrowColor: "text-black",
    focusRing: "focus-visible:ring-black",
  },
  // 6. Contato (Arcade Central / CRT Verde Fósforo)
  6: {
    defaultText: "ROLE PARA ENTRAR EM CONTATO",
    containerClasses:
      "bg-[#050508]/90 text-emerald-300 border border-emerald-400/60 shadow-[0_0_24px_rgba(16,185,129,0.45)] hover:border-emerald-300 hover:text-emerald-100 hover:bg-[#0A0D10]",
    mouseBorder: "border-emerald-400/70 group-hover:border-emerald-300",
    mouseDot: "bg-emerald-400",
    arrowColor: "text-emerald-400",
    focusRing: "focus-visible:ring-emerald-400",
  },
};

export default function SectionScrollPrompt({
  targetWorld,
  text,
  direction = "down",
  className = "",
}: SectionScrollPromptProps) {
  const theme = PROMPT_THEMES[targetWorld] ?? PROMPT_THEMES[2];
  const labelText = text || theme.defaultText;
  const isUp = direction === "up" || targetWorld === 1;

  const handleClick = () => {
    journeyStore.navigateToWorld(targetWorld, 2.2);
  };

  return (
    <div
      className={`relative lg:absolute lg:bottom-12 sm:lg:bottom-14 lg:left-1/2 lg:-translate-x-1/2 z-20 my-4 lg:my-0 flex justify-center pointer-events-auto select-none ${className}`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Avançar para seção: ${labelText}`}
        className={`group flex items-center gap-3.5 px-5 py-2.5 rounded-full backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${theme.containerClasses} ${theme.focusRing}`}
      >
        {/* Ícone de Mouse Animado com Indicador de Scroll */}
        <div
          className={`relative flex h-6 w-3.5 items-start justify-center rounded-full border p-0.5 transition-colors ${theme.mouseBorder}`}
        >
          <div
            className={`h-1.5 w-1 rounded-full animate-pulse [animation-duration:1.4s] ${theme.mouseDot}`}
          />
        </div>

        {/* Texto Temático da Seção */}
        <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] font-medium whitespace-nowrap">
          {labelText}
        </span>

        {/* Seta Indicativa com Microanimação Suave */}
        <span
          className={`inline-block font-bold transition-transform duration-200 ${
            isUp
              ? "group-hover:-translate-y-0.5"
              : "group-hover:translate-y-0.5"
          } ${theme.arrowColor}`}
        >
          {isUp ? "↑" : "↓"}
        </span>
      </button>
    </div>
  );
}
