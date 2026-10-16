"use client";

import { createContext, useCallback, useContext, useEffect } from "react";

/**
 * Assinatura de uma transição: recebe uma timeline (que será encaixada no
 * "master" de scroll) e adiciona nela os tweens daquele efeito.
 */
export type TransitionBuilder = (tl: gsap.core.Timeline) => void;

export type RegisterTransition = (
  index: number,
  builder: TransitionBuilder
) => () => void;

/** Registro da timeline de cada efeito no palco único. */
export const TransitionTimelineContext =
  createContext<RegisterTransition | null>(null);

/** Registro das animações que rodam na "pausa" (dwell) de cada mundo. */
export const TransitionDwellContext = createContext<RegisterTransition | null>(
  null
);

/** Índice/ordem da camada atual, injetado pelo palco. */
export const TransitionIndexContext = createContext<number | undefined>(
  undefined
);

/**
 * Permite "rolar até" um ponto da pausa (dwell) de um mundo.
 * `progress` vai de 0 a 1 dentro da pausa daquele mundo.
 */
export type ScrollToDwell = (index: number, progress: number) => void;

export const TransitionScrollContext = createContext<ScrollToDwell | null>(
  null
);

/**
 * Registra a timeline de uma transição no palco único (`TransitionStage`).
 * O índice vem do contexto, garantindo a ordem correta dos efeitos.
 */
export function useTransitionTimeline(builder: TransitionBuilder) {
  const register = useContext(TransitionTimelineContext);
  const index = useContext(TransitionIndexContext);

  useEffect(() => {
    if (!register || index === undefined) return;
    return register(index, builder);
    // O builder é recriado a cada render mas só é registrado uma vez;
    // ele apenas lê refs e constantes, portanto não precisa entrar nas deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, index]);
}

/**
 * Registra uma animação que roda enquanto o mundo fica parado na tela
 * (depois do efeito da camada em que o componente está). É usado, por exemplo,
 * para o livro virar páginas conforme o scroll.
 */
export function useDwellTimeline(builder: TransitionBuilder) {
  const register = useContext(TransitionDwellContext);
  const index = useContext(TransitionIndexContext);

  useEffect(() => {
    if (!register || index === undefined) return;
    return register(index, builder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [register, index]);
}

/**
 * Retorna uma função `(progress) => void` que rola a página até um ponto da
 * pausa do mundo atual (usado pelos botões de folhear do livro).
 */
export function useScrollToDwell() {
  const scroll = useContext(TransitionScrollContext);
  const index = useContext(TransitionIndexContext);

  return useCallback(
    (progress: number) => {
      if (scroll && index !== undefined) scroll(index, progress);
    },
    [scroll, index]
  );
}
