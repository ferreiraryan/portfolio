"use client";

import { useSyncExternalStore } from "react";

/**
 * O "Sobre" (livro) é montado duas vezes: como camada revelada do rasgo de
 * papel e como camada superior do glitch. Para as duas cópias ficarem sempre
 * na mesma página, o estado do livro vive em um store externo compartilhado —
 * tanto o clique nos botões quanto o scroll (virada automática) escrevem nele.
 *
 * Cada "spread" (livro aberto) tem DUAS páginas independentes:
 * - `right`: a página direita (recto). Vira no INÍCIO da virada, escondida
 *   atrás da folha que se levanta.
 * - `left`: a página esquerda (verso). Vira no FIM da virada, escondida atrás
 *   da folha que acabou de pousar sobre ela.
 * Essa defasagem evita que o conteúdo "pisque" no meio da animação.
 */
let left = 0;
let right = 0;

const listeners = new Set<() => void>();

/** Snapshot cacheado para o `useSyncExternalStore` (identidade estável). */
let snapshot: [number, number] = [left, right];

function emit() {
  snapshot = [left, right];
  listeners.forEach((listener) => listener());
}

export const bookStore = {
  getSpread: () => snapshot,
  setSpread: (nextLeft: number, nextRight: number) => {
    const l = Math.round(nextLeft);
    const r = Math.round(nextRight);
    if (l === left && r === right) return;
    left = l;
    right = r;
    emit();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useBookSpread() {
  return useSyncExternalStore(
    bookStore.subscribe,
    bookStore.getSpread,
    bookStore.getSpread
  );
}
