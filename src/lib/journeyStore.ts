"use client";

import { useSyncExternalStore } from "react";
import { scrollToScrollY } from "@/lib/useLenis";

export interface WorldMeta {
  index: number; // 1-indexed (1..6)
  id: string;
  name: string;
  category: string;
  eyebrow: string;
  targetY: number; // desktop scroll position in px
  unlockY: number; // scroll position where unlock triggers
  theme: {
    accent: string;
    bgBadge: string;
    borderBadge: string;
    glow: string;
    textAccent: string;
    symbol: string;
    tagline: string;
  };
}

export const WORLDS: WorldMeta[] = [
  {
    index: 1,
    id: "hero",
    name: "Universo Neutro",
    category: "Início",
    eyebrow: "01 // Origem",
    targetY: 0,
    unlockY: 0,
    theme: {
      accent: "#FFFFFF",
      bgBadge: "bg-white/10",
      borderBadge: "border-white/30",
      glow: "rgba(255, 255, 255, 0.4)",
      textAccent: "text-white",
      symbol: "◎",
      tagline: "Ponto de Partida & Identidade",
    },
  },
  {
    index: 2,
    id: "sobre",
    name: "Trajetória & História",
    category: "Sobre",
    eyebrow: "02 // O Livro",
    targetY: 690,
    unlockY: 90,
    theme: {
      accent: "#D6D3CD",
      bgBadge: "bg-[#2A2621]",
      borderBadge: "border-[#C4BFB6]/40",
      glow: "rgba(214, 211, 205, 0.35)",
      textAccent: "text-[#EAE6DF]",
      symbol: "🕮",
      tagline: "Formação, Curiosidade & Caminhos",
    },
  },
  {
    index: 3,
    id: "projetos",
    name: "Terminal de Projetos",
    category: "Projetos",
    eyebrow: "03 // Cyberpunk",
    targetY: 2790,
    unlockY: 2010,
    theme: {
      accent: "#06B6D4",
      bgBadge: "bg-[#0D041A]",
      borderBadge: "border-cyan-400/50",
      glow: "rgba(6, 182, 212, 0.5)",
      textAccent: "text-cyan-300",
      symbol: ">_",
      tagline: "Projetos Reais & Engenharia",
    },
  },
  {
    index: 4,
    id: "skills",
    name: "Ficha de Personagem",
    category: "Skills",
    eyebrow: "04 // Grimório RPG",
    targetY: 3750,
    unlockY: 2970,
    theme: {
      accent: "#F59E0B",
      bgBadge: "bg-[#1C120B]",
      borderBadge: "border-amber-400/50",
      glow: "rgba(245, 158, 11, 0.5)",
      textAccent: "text-amber-300",
      symbol: "✦",
      tagline: "Árvore de Habilidades & Ranks",
    },
  },
  {
    index: 5,
    id: "estante",
    name: "Arquivo de Histórias",
    category: "Estante",
    eyebrow: "05 // Mangá & HQ",
    targetY: 4710,
    unlockY: 3930,
    theme: {
      accent: "#F4F0EA",
      bgBadge: "bg-white",
      borderBadge: "border-black",
      glow: "rgba(255, 255, 255, 0.3)",
      textAccent: "text-neutral-900",
      symbol: "▨",
      tagline: "Obras & Referências Criativas",
    },
  },
  {
    index: 6,
    id: "contato",
    name: "Arcade Central",
    category: "Contato",
    eyebrow: "06 // Fim de Jogo",
    targetY: 5670,
    unlockY: 4890,
    theme: {
      accent: "#10B981",
      bgBadge: "bg-[#050508]",
      borderBadge: "border-emerald-400/50",
      glow: "rgba(16, 185, 129, 0.5)",
      textAccent: "text-emerald-400",
      symbol: "👾",
      tagline: "Canal de Transmissão Aberto",
    },
  },
];

interface JourneyState {
  currentWorld: number; // 1..6
  unlockedWorlds: boolean[]; // 6 booleans
  justUnlocked: number | null; // index of world that just unlocked (for animation)
  scrollProgress: number; // 0..1
}

let state: JourneyState = {
  currentWorld: 1,
  unlockedWorlds: [true, false, false, false, false, false],
  justUnlocked: null,
  scrollProgress: 0,
};

const listeners = new Set<() => void>();
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export const journeyStore = {
  getSnapshot(): JourneyState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  /** Atualiza o progresso e o mundo ativo baseado na posição do scroll desktop */
  updateDesktopScroll(scrollY: number, totalScroll: number) {
    if (totalScroll <= 0) return;
    const progress = Math.min(1, Math.max(0, scrollY / totalScroll));

    // Determina o mundo atual baseado nos ranges do desktop
    let activeWorld = 1;
    if (scrollY < 390) activeWorld = 1;
    else if (scrollY < 2310) activeWorld = 2;
    else if (scrollY < 3270) activeWorld = 3;
    else if (scrollY < 4230) activeWorld = 4;
    else if (scrollY < 5190) activeWorld = 5;
    else activeWorld = 6;

    // Checa desbloqueio de novos mundos (Fog of War)
    const newUnlocked = [...state.unlockedWorlds];
    let newlyUnlockedIndex: number | null = null;

    WORLDS.forEach((w) => {
      const idx = w.index - 1;
      if (!newUnlocked[idx] && scrollY >= w.unlockY) {
        newUnlocked[idx] = true;
        if (newlyUnlockedIndex === null || w.index > newlyUnlockedIndex) {
          newlyUnlockedIndex = w.index;
        }
      }
    });

    const changed =
      state.currentWorld !== activeWorld ||
      newlyUnlockedIndex !== null ||
      Math.abs(state.scrollProgress - progress) > 0.005;

    if (changed) {
      if (newlyUnlockedIndex !== null) {
        if (unlockTimer) clearTimeout(unlockTimer);
        unlockTimer = setTimeout(() => {
          state = { ...state, justUnlocked: null };
          emitChange();
        }, 1600);
      }

      state = {
        ...state,
        currentWorld: activeWorld,
        unlockedWorlds: newUnlocked,
        justUnlocked: newlyUnlockedIndex ?? state.justUnlocked,
        scrollProgress: progress,
      };
      emitChange();
    }
  },

  /** Atualiza o mundo ativo no mobile (despinado) via IntersectionObserver */
  setMobileActiveWorld(worldIndex: number) {
    if (worldIndex < 1 || worldIndex > 6) return;
    const newUnlocked = [...state.unlockedWorlds];
    let newlyUnlockedIndex: number | null = null;

    for (let i = 0; i < worldIndex; i++) {
      if (!newUnlocked[i]) {
        newUnlocked[i] = true;
        newlyUnlockedIndex = i + 1;
      }
    }

    if (state.currentWorld !== worldIndex || newlyUnlockedIndex !== null) {
      if (newlyUnlockedIndex !== null) {
        if (unlockTimer) clearTimeout(unlockTimer);
        unlockTimer = setTimeout(() => {
          state = { ...state, justUnlocked: null };
          emitChange();
        }, 1600);
      }

      state = {
        ...state,
        currentWorld: worldIndex,
        unlockedWorlds: newUnlocked,
        justUnlocked: newlyUnlockedIndex ?? state.justUnlocked,
        scrollProgress: (worldIndex - 1) / 5,
      };
      emitChange();
    }
  },

  /** Navega para o mundo alvo com rolagem cinemática e suave */
  navigateToWorld(worldIndex: number, duration = 2.2) {
    const world = WORLDS.find((w) => w.index === worldIndex);
    if (!world) return;

    // Destrava imediatamente o mundo clicado caso ainda estivesse oculto
    const newUnlocked = [...state.unlockedWorlds];
    for (let i = 0; i < worldIndex; i++) {
      newUnlocked[i] = true;
    }
    state = {
      ...state,
      unlockedWorlds: newUnlocked,
      justUnlocked: worldIndex,
    };
    emitChange();

    if (unlockTimer) clearTimeout(unlockTimer);
    unlockTimer = setTimeout(() => {
      state = { ...state, justUnlocked: null };
      emitChange();
    }, 1600);

    // No desktop: scroll acelerado via Lenis na timeline master
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      scrollToScrollY(world.targetY, duration);
      return;
    }

    // No mobile: scroll suave nativo até a seção
    if (typeof document !== "undefined") {
      const el = document.getElementById(world.id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    scrollToScrollY(world.targetY, duration);
  },
};

export function useJourney(): JourneyState {
  return useSyncExternalStore(journeyStore.subscribe, journeyStore.getSnapshot, () => state);
}
