"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { bookStore, useBookSpread } from "@/lib/bookStore";
import {
  useDwellTimeline,
  useScrollToDwell,
} from "@/lib/useTransitionTimeline";

const CHAPTERS = [
  {
    number: "Capítulo I",
    title: "A Curiosidade & O Começo",
    quote: "“Mais do que decorar ferramentas, sempre quis abrir a caixa-preta e entender como a tecnologia realmente funciona por dentro.”",
    dropCap: "S",
    body: "ou estudante de Ciência da Computação na PUC Minas e técnico em Informática pelo COTEMIG. Minha relação com a TI nasceu da vontade genuína de resolver problemas do mundo real usando a computação. Antes mesmo de focar apenas em desenvolvimento, vivi a tecnologia na linha de frente: prestei suporte técnico, cuidei de redes e equipamentos na Prefeitura de Nova Lima — onde também ajudei professores a integrarem ferramentas digitais na rotina escolar — e atuei no suporte a sistemas críticos de alta demanda para magistrados e servidores no TRT da 3ª Região. Lidar diretamente com pessoas e sistemas me ensinou que a boa tecnologia é aquela que não falha quando alguém mais precisa.",
    marginNote: "Nota de Margem #01 — Base técnica no COTEMIG, Ciência da Computação na PUC Minas e vivência real mantendo sistemas no TRT-3 e na Prefeitura de Nova Lima.",
    metaLeft: "Nova Lima • Minas Gerais",
    metaRight: "Pág. 14 — 15",
  },
  {
    number: "Capítulo II",
    title: "Caminhos que Já Explorei",
    quote: "“Na computação, cada área que você experimenta muda a forma como você enxerga todas as outras.”",
    dropCap: "N",
    body: "unca gostei de me prender a uma única gaveta dentro da TI. Gosto de transitar por várias frentes para enxergar o sistema inteiro: já construí APIs e serviços backend com Java (Spring Boot), Node.js (TypeScript) e Python (FastAPI); criei interfaces web com React e aplicativos multiplataforma em tempo real com Flutter e Firebase; estudei administração de bancos de dados SQL e otimização de consultas; e montei meu próprio ambiente no Arch Linux para explorar redes, containers Docker, automação em Bash e segurança da informação. Cada experiência nova vira repertório para resolver o próximo desafio.",
    marginNote: "Nota de Margem #02 — Desenvolvimento Web & Mobile, Backend, Bancos de Dados, Infraestrutura Linux, Automação e Segurança.",
    metaLeft: "Versatilidade em TI",
    metaRight: "Pág. 16 — 17",
  },
  {
    number: "Capítulo III",
    title: "Do Silício às Histórias",
    quote: "“De um sensor lendo o mundo físico a uma boa história no fim do dia, tudo nasce da vontade de explorar.”",
    dropCap: "E",
    body: "ssa sede de testar coisas diferentes me levou até a programar microcontroladores ESP32 em C/C++ para capturar dados ambientais na borda, enquanto na faculdade aprofundo a base matemática de cálculo, álgebra linear e estatística que sustenta a ciência de dados e a inteligência artificial. Quando fecho o terminal e a IDE, gosto de mergulhar em universos gigantes como One Piece e Omniscient Reader's Viewpoint, nos clássicos cyberpunk da Trilogia Sprawl e em leituras de filosofia. No fundo, explorar tecnologia e acompanhar boas histórias têm muito em comum: ambos pedem curiosidade, atenção aos detalhes e vontade de descobrir o que vem a seguir.",
    marginNote: "Nota de Margem #03 — Role a página para fechar o livro e ver na prática os projetos que nasceram dessa caminhada.",
    metaLeft: "Hardware, Dados & Cultura",
    metaRight: "Pág. 18 — 19",
  },
];

type Chapter = (typeof CHAPTERS)[number];

/** 2 viradas de página (Cap. I → II → III). */
const TURNS = CHAPTERS.length - 1;
/** Duração de cada virada (em "unidades" da timeline de scroll). */
const PAGE_DURATION = 1.0;
/** Fração da virada em que a folha realmente gira (o resto é assentamento). */
const ROT = PAGE_DURATION * 0.86;
/** Respiro com o Cap. I parado antes da primeira virada. */
const LEAD = 0.2;
/** Duração total do dwell do livro. */
const DWELL_TOTAL = LEAD + TURNS * PAGE_DURATION;
/**
 * Antecipação da troca da página esquerda: ela muda um instante antes da folha
 * terminar de deitar, garantindo que o verso já a esteja cobrindo por completo.
 */
const LEFT_FLIP_LEAD = 0.05;

const MAX_CHAPTER = CHAPTERS.length - 1;

function clampChapter(idx: number) {
  return Math.min(Math.max(idx, 0), MAX_CHAPTER);
}

/**
 * Progresso (0..1) da dwell que deixa o capítulo `idx` assentado — com a folha
 * já de volta ao repouso (oculta), sem virada no meio.
 */
function settleProgress(idx: number) {
  const k = clampChapter(idx);
  if (k === 0) return 0;
  const t = LEAD + (k - 1) * PAGE_DURATION + ROT;
  return Math.min(1, t / DWELL_TOTAL);
}

/**
 * `useLayoutEffect` no cliente e `useEffect` no servidor (o componente é
 * pré-renderizado). A medição do livro precisa acontecer antes do primeiro
 * paint, para o palco já nascer com a escala certa.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Altura ocupada pelo elemento, incluindo as margens verticais. */
function outerHeight(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return (
    el.offsetHeight +
    (parseFloat(cs.marginTop) || 0) +
    (parseFloat(cs.marginBottom) || 0)
  );
}

/** Altura útil do interior do elemento (sem o padding vertical). */
function contentHeight(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return (
    el.clientHeight -
    (parseFloat(cs.paddingTop) || 0) -
    (parseFloat(cs.paddingBottom) || 0)
  );
}

interface SobreProps {
  /**
   * Quando verdadeiro, o livro vira ~2 capítulos automaticamente conforme o
   * scroll, enquanto este mundo está parado na tela (antes da próxima transição).
   * Só a instância revelada pelo rasgo de papel recebe esta flag.
   */
  scrollPages?: boolean;
}

/** Navegação "Folhear Capítulos" (interativa só na página estática). */
function FolhearNav({
  chapterIdx,
  interactive,
  goToChapter,
}: {
  chapterIdx: number;
  interactive: boolean;
  goToChapter: (idx: number) => void;
}) {
  return (
    <div className="mt-8 border-t border-stone-300 pt-5">
      <p className="mb-3 text-eyebrow font-mono uppercase tracking-[0.14em] text-stone-700">
        Folhear Capítulos:
      </p>
      <div className="flex flex-wrap gap-2">
        {CHAPTERS.map((chap, idx) => {
          const cls = `inline-flex min-h-10 items-center justify-center rounded-sm border px-3 py-2 text-[13px] font-mono uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EAE6DF] ${
            chapterIdx === idx
              ? "border-stone-900 bg-stone-900 text-stone-100"
              : "border-stone-400/60 bg-stone-200/70 text-stone-700 hover:bg-stone-300/80"
          }`;
          return interactive ? (
            <button
              key={chap.number}
              type="button"
              onClick={() => goToChapter(idx)}
              className={cls}
            >
              {chap.number}
            </button>
          ) : (
            <span key={chap.number} className={cls} aria-hidden="true">
              {chap.number}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Página esquerda: título, citação e o índice de folheio. */
function LeftPage({
  chapter,
  chapterIdx,
  interactive,
  goToChapter,
}: {
  chapter: Chapter;
  chapterIdx: number;
  interactive: boolean;
  goToChapter: (idx: number) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between p-6 sm:p-9 lg:p-11">
      <div>
        <div className="flex items-center justify-between text-eyebrow font-mono uppercase tracking-[0.14em] text-stone-700">
          <span>{chapter.number}</span>
          <span>{chapter.metaLeft}</span>
        </div>

        <h2 className="mt-4 font-serif text-3xl leading-tight font-normal text-balance text-stone-900 sm:text-4xl md:text-5xl">
          {chapter.title}
        </h2>
        <blockquote className="mt-6 border-l-2 border-stone-500 pl-4 font-serif text-xl italic leading-relaxed text-stone-700 sm:text-2xl">
          {chapter.quote}
        </blockquote>
      </div>

      <FolhearNav
        chapterIdx={chapterIdx}
        interactive={interactive}
        goToChapter={goToChapter}
      />
    </div>
  );
}

/** Página direita: corpo do capítulo, nota de margem e paginação. */
function RightPage({
  chapter,
  chapterIdx,
  interactive,
  goToChapter,
}: {
  chapter: Chapter;
  chapterIdx: number;
  interactive: boolean;
  goToChapter: (idx: number) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between p-6 sm:p-9 lg:p-11">
      <div>
        <p className="text-justify hyphens-auto font-serif text-[1.0625rem] leading-[1.7] text-stone-800 sm:text-[1.1875rem]">
          <span className="float-left pr-3 pt-1 font-serif text-[3.5rem] leading-none font-bold text-stone-900 sm:text-[4.5rem]">
            {chapter.dropCap}
          </span>
          {chapter.body}
        </p>

        <div className="mt-8 border-l-2 border-stone-700 bg-stone-200/75 p-4 font-mono text-[13px] leading-relaxed text-stone-700">
          {chapter.marginNote}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-stone-300 pt-4 font-mono text-[13px] text-stone-700">
        <span>{chapter.metaRight}</span>
        <div className="flex items-center gap-2">
          {interactive ? (
            <>
              <button
                type="button"
                onClick={() => goToChapter(chapterIdx - 1)}
                className="inline-flex min-h-10 items-center border border-stone-400 px-3 py-1.5 text-stone-800 transition hover:bg-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE9E3]"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={() => goToChapter(chapterIdx + 1)}
                className="inline-flex min-h-10 items-center bg-stone-900 px-3 py-1.5 text-stone-100 transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EDE9E3]"
              >
                Próxima →
              </button>
            </>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="inline-flex min-h-10 items-center border border-stone-400 px-3 py-1.5 text-stone-800"
              >
                ← Anterior
              </span>
              <span
                aria-hidden="true"
                className="inline-flex min-h-10 items-center bg-stone-900 px-3 py-1.5 text-stone-100"
              >
                Próxima →
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sobre({ scrollPages = false }: SobreProps) {
  const [rawLeft, rawRight] = useBookSpread();
  const leftIdx = clampChapter(rawLeft);
  const rightIdx = clampChapter(rawRight);
  const leftChapter = CHAPTERS[leftIdx];
  const rightChapter = CHAPTERS[rightIdx];
  // O capítulo "corrente" (destaque e rodapé) acompanha a página direita.
  const chapterIdx = rightIdx;
  const isLastChapter = rightIdx >= MAX_CHAPTER;

  const cardRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetShadowRef = useRef<HTMLDivElement>(null);
  const frontFaceRef = useRef<HTMLDivElement>(null);
  const backFaceRef = useRef<HTMLDivElement>(null);
  const frontShadeRef = useRef<HTMLDivElement>(null);
  const backShadeRef = useRef<HTMLDivElement>(null);
  const bookmarkRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  /** Reajusta o livro (chamado quando o capítulo muda). */
  const fitRef = useRef<(() => void) | null>(null);

  const goToDwell = useScrollToDwell();
  const goToChapter = useCallback(
    (idx: number) => {
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia(
          "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
        ).matches;
      if (isDesktop) {
        goToDwell(settleProgress(idx));
      } else {
        const k = clampChapter(idx);
        bookStore.setSpread(k, k);
      }
    },
    [goToDwell]
  );

  /**
   * "Fit-to-height" do livro.
   *
   * O palco é pinado em `h-screen overflow-hidden`, então tudo que passar de
   * 100dvh — o indicador de páginas e o rodapé — simplesmente sai da tela e não
   * tem como ser alcançado pelo scroll. Em vez de limitar a altura do card (o
   * que cortava o fim da página direita), o card passa a ter a altura natural do
   * capítulo mais alto e o palco 3D inteiro é escalado só o necessário para
   * caber entre o cabeçalho e o rodapé. A sobra de layout da escala é
   * compensada por uma margem negativa, de modo que o indicador continue logo
   * abaixo do livro.
   *
   * A altura do card NÃO pode seguir o capítulo atual: a página direita troca no
   * início da virada e cada capítulo tem um texto de comprimento diferente, o
   * que faria o livro mudar de tamanho no meio da animação. Por isso a caixa fica
   * presa à maior altura já medida nesta largura.
   *
   * Abaixo de `lg` nada é escalado: as páginas ficam empilhadas e seguem o
   * fluxo natural do documento.
   */
  useIsomorphicLayoutEffect(() => {
    const slot = slotRef.current;
    const stage = stageRef.current;
    const card = cardRef.current;
    const dots = dotsRef.current;
    if (!slot || !stage || !card || !dots) return;

    const isDesktop = () =>
      window.matchMedia(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
      ).matches;

    /** Maior altura natural do conteúdo medida nesta largura. */
    let maxNatural = 0;
    let lastWidth = -1;

    const fit = () => {
      if (!isDesktop()) {
        maxNatural = 0;
        lastWidth = -1;
        card.style.height = "";
        stage.style.transform = "";
        stage.style.marginBottom = "";
        return;
      }

      const width = stage.clientWidth;
      // Só a largura (reflow do texto) invalida a medida; virar de capítulo não.
      if (width !== lastWidth) {
        lastWidth = width;
        maxNatural = 0;
      }

      // Com a altura solta, `offsetHeight` é a altura natural do conteúdo.
      card.style.height = "";
      maxNatural = Math.max(maxNatural, card.offsetHeight);

      const room = contentHeight(slot) - outerHeight(dots);
      if (maxNatural <= 0 || room <= 0) return;

      card.style.height = `${maxNatural}px`;

      const scale = Math.min(1, room / maxNatural);
      stage.style.transform = scale === 1 ? "" : `scale(${scale})`;
      stage.style.marginBottom = `${-Math.round(maxNatural * (1 - scale))}px`;
    };

    fitRef.current = fit;
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(slot);
    observer.observe(stage);
    window.addEventListener("resize", fit);

    // `next/font` troca as métricas quando as fontes assentam: remede o livro
    // (com a caixa presa, o reflow não dispara o observer).
    let disposed = false;
    document.fonts?.ready.then(() => {
      if (!disposed) fit();
    });

    return () => {
      disposed = true;
      fitRef.current = null;
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  // Um capítulo mais alto que o anterior (raro) pode exigir crescer a caixa.
  useEffect(() => {
    fitRef.current?.();
  }, [leftIdx, rightIdx]);

  // Vira as páginas do livro presas ao scroll (2 viradas suaves na pausa).
  useDwellTimeline((tl) => {
    if (!scrollPages) return;

    const isDesktop =
      typeof window !== "undefined" &&
      window.matchMedia(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"
      ).matches;

    const sheet = sheetRef.current;
    const card = cardRef.current;

    if (isDesktop && sheet) {
      const shadow = sheetShadowRef.current;
      const frontFace = frontFaceRef.current;
      const backFace = backFaceRef.current;
      const front = frontShadeRef.current;
      const back = backShadeRef.current;
      const bookmark = bookmarkRef.current;

      tl.set(sheet, { autoAlpha: 0, rotateY: 0, z: 0 }, 0);
      // Estado inicial: a frente (recto) aparece; o verso fica escondido.
      if (frontFace) tl.set(frontFace, { autoAlpha: 1 }, 0);
      if (backFace) tl.set(backFace, { autoAlpha: 0 }, 0);
      // A fita começa em repouso sobre a página direita.
      if (bookmark) tl.set(bookmark, { y: 0, rotate: 0 }, 0);

      for (let k = 0; k < TURNS; k++) {
        const start = LEAD + k * PAGE_DURATION;
        const half = ROT / 2;
        const mid = start + half;
        const end = start + ROT;

        // A folha aparece em repouso (0°) e gira até deitar do outro lado.
        tl.set(sheet, { autoAlpha: 1, rotateY: 0 }, start);
        // Alterna as faces quando a folha está de perfil (90°), invisível: a
        // frente (recto) sai e o verso (página esquerda do novo capítulo) entra.
        if (frontFace) tl.set(frontFace, { autoAlpha: 1 }, start);
        if (backFace) tl.set(backFace, { autoAlpha: 0 }, start);
        tl.to(sheet, { rotateY: -180, duration: ROT, ease: "power2.inOut" }, start);
        // Leve "lift" para dar volume à folha no meio da virada.
        tl.to(sheet, { z: 46, duration: half, ease: "power1.in" }, start);
        tl.to(sheet, { z: 0, duration: half, ease: "power1.out" }, mid);

        if (frontFace) tl.set(frontFace, { autoAlpha: 0 }, mid);
        if (backFace) tl.set(backFace, { autoAlpha: 1 }, mid);

        if (shadow) {
          tl.to(shadow, { opacity: 0.5, duration: half, ease: "power1.in" }, start);
          tl.to(shadow, { opacity: 0, duration: half, ease: "power1.out" }, mid);
        }
        if (front) {
          // Auto-sombra da frente enquanto ela se levanta (some junto com a face).
          tl.fromTo(
            front,
            { opacity: 0 },
            { opacity: 0.55, duration: half, ease: "power1.in" },
            start
          );
        }
        if (back) {
          // Auto-sombra do verso conforme ele pousa, sumindo ao deitar.
          tl.fromTo(
            back,
            { opacity: 0 },
            { opacity: 0.55, duration: half * 0.6, ease: "power1.out" },
            mid
          );
          tl.to(
            back,
            { opacity: 0, duration: half * 0.4, ease: "power1.in" },
            mid + half * 0.6
          );
        }

        if (bookmark) {
          // A fita levanta um instante antes da folha aparecer, para ela passar
          // por baixo, e desce de volta ao deitar — assentando na nova página.
          tl.to(
            bookmark,
            { y: -22, rotate: -2.5, duration: 0.16, ease: "power2.out" },
            start - 0.06
          );
          tl.to(
            bookmark,
            { y: 0, rotate: 0, duration: 0.22, ease: "power2.inOut" },
            end - 0.22
          );
        }

        // Ao deitar, some e volta ao repouso — o conteúdo já bate com o estático.
        tl.set(sheet, { autoAlpha: 0, rotateY: 0, z: 0 }, end);
      }
    } else if (card) {
      // Mobile (páginas empilhadas): crossfade simples no meio de cada virada.
      const bookmark = bookmarkRef.current;
      if (bookmark) tl.set(bookmark, { y: 0, rotate: 0 }, 0);
      for (let k = 0; k < TURNS; k++) {
        const mid = LEAD + k * PAGE_DURATION + PAGE_DURATION / 2;
        tl.to(card, { opacity: 0, duration: 0.18, ease: "power1.in" }, mid - 0.18);
        tl.to(card, { opacity: 1, duration: 0.18, ease: "power1.out" }, mid);
        if (bookmark) {
          tl.to(
            bookmark,
            { y: -22, rotate: -2.5, duration: 0.16, ease: "power2.out" },
            mid - 0.24
          );
          tl.to(
            bookmark,
            { y: 0, rotate: 0, duration: 0.22, ease: "power2.inOut" },
            mid + 0.02
          );
        }
      }
    }

    // Garante que a dwell dure exatamente DWELL_TOTAL.
    const currentDuration = tl.duration();
    if (currentDuration < DWELL_TOTAL) {
      tl.to({}, { duration: DWELL_TOTAL - currentDuration }, currentDuration);
    }

    // O capítulo é derivado do tempo da timeline → funciona indo e voltando.
    tl.eventCallback("onUpdate", () => {
      const u = tl.time() - LEAD;
      let l: number;
      let r: number;

      if (isDesktop) {
        // A direita troca no início da virada; a esquerda, no fim (já coberta).
        const leftFlipAt = ROT - LEFT_FLIP_LEAD;
        r = u <= 0 ? 0 : Math.ceil(u / PAGE_DURATION);
        l = u < leftFlipAt ? 0 : Math.floor((u - leftFlipAt) / PAGE_DURATION) + 1;
      } else {
        // No mobile as duas páginas trocam juntas, no meio da virada.
        const m = Math.floor(u / PAGE_DURATION + 0.5);
        l = m;
        r = m;
      }

      bookStore.setSpread(clampChapter(l), clampChapter(r));
    });
  });

  return (
    <div className="relative flex min-h-screen lg:h-screen w-full flex-col justify-between lg:overflow-hidden bg-[#D6D3CD] p-5 text-[#1E1D1A] sm:p-8 lg:px-12 lg:py-8">
      {/* Cabeçalho editorial */}
      <header className="flex items-center justify-between border-b border-stone-400/70 pb-3 font-mono text-eyebrow uppercase tracking-[0.14em] text-stone-700 select-none">
        <span>02 // Universo Livro — Sobre</span>
        <span>Caderno de Jornada • Ex-Libris Ryan Ferreira</span>
      </header>

      {/* Livro Aberto em Duas Páginas */}
      <div
        ref={slotRef}
        className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col justify-center-safe py-4"
      >
        {/* Palco 3D do livro — sem overflow, para a folha girar livre. */}
        <div
          ref={stageRef}
          className="relative w-full"
          style={{ perspective: 2000, transformOrigin: "top center" }}
        >
          {/* Spread estático (recortado com borda e sombra) */}
          <div
            ref={cardRef}
            className="relative grid grid-cols-1 overflow-hidden rounded-sm border border-stone-400/80 bg-[#EAE6DF] shadow-[0_28px_60px_rgba(30,29,26,0.22)] lg:grid-cols-12"
          >
            {/* Sombra projetada pela folha enquanto vira */}
            <div
              ref={sheetShadowRef}
              className="pointer-events-none absolute inset-0 z-[15] opacity-0"
              style={{
                background:
                  "linear-gradient(to right, transparent 32%, rgba(30,29,26,0.38) 50%, transparent 68%)",
              }}
            />

            {/* Página Esquerda: Índice + Citação Principal */}
            <div className="relative z-10 border-b border-stone-300/90 lg:col-span-6 lg:border-r lg:border-b-0">
              <LeftPage
                chapter={leftChapter}
                chapterIdx={chapterIdx}
                interactive
                goToChapter={goToChapter}
              />
            </div>

            {/* Página Direita: corpo do capítulo */}
            <div className="relative z-10 bg-[#EDE9E3] lg:col-span-6">
              <RightPage
                chapter={rightChapter}
                chapterIdx={chapterIdx}
                interactive
                goToChapter={goToChapter}
              />
            </div>
          </div>

          {/* Folha que vira: frente = recto atual; verso = próximo verso */}
          <div
            ref={sheetRef}
            className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-full opacity-0 lg:block lg:w-1/2"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* FRENTE — página direita da virada em curso */}
            <div
              ref={frontFaceRef}
              className="absolute inset-0 overflow-hidden rounded-sm bg-[#EDE9E3] shadow-[0_10px_30px_rgba(30,29,26,0.18)]"
            >
              <RightPage
                chapter={leftChapter}
                chapterIdx={chapterIdx}
                interactive={false}
                goToChapter={goToChapter}
              />
              <div
                ref={frontShadeRef}
                className="pointer-events-none absolute inset-0 opacity-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(30,29,26,0.55), rgba(30,29,26,0.05) 45%, transparent 72%)",
                }}
              />
            </div>

            {/* VERSO — página esquerda (título/citação) do novo capítulo */}
            <div
              ref={backFaceRef}
              className="absolute inset-0 overflow-hidden rounded-sm bg-[#EAE6DF] opacity-0 shadow-[0_10px_30px_rgba(30,29,26,0.18)]"
              style={{ transform: "rotateY(180deg)" }}
            >
              <LeftPage
                chapter={rightChapter}
                chapterIdx={chapterIdx}
                interactive={false}
                goToChapter={goToChapter}
              />
              <div
                ref={backShadeRef}
                className="pointer-events-none absolute inset-0 opacity-0"
                style={{
                  background:
                    "linear-gradient(to left, rgba(30,29,26,0.55), rgba(30,29,26,0.05) 45%, transparent 72%)",
                }}
              />
            </div>
          </div>

          {/* Marcador de fita bordô — fora do overflow-hidden, para poder levantar */}
          <div
            ref={bookmarkRef}
            className="pointer-events-none absolute -top-2 right-8 z-30 h-16 w-6 bg-red-900/85 shadow-md"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)" }}
          />
        </div>

        {/* Indicador de páginas folheadas pelo scroll */}
        <div ref={dotsRef} className="mt-4 flex items-center justify-center gap-1">
          {CHAPTERS.map((chap, idx) => {
            const active = chapterIdx === idx;
            const bar = `h-2 rounded-full transition-all duration-300 ${
              active ? "w-10 bg-stone-700" : "w-2 bg-stone-500/70"
            }`;
            return scrollPages ? (
              <button
                key={chap.number}
                type="button"
                aria-label={`Ir para ${chap.number}`}
                aria-current={active ? "true" : undefined}
                onClick={() => goToChapter(idx)}
                className="flex h-7 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-700"
              >
                <span className={bar} />
              </button>
            ) : (
              <span
                key={chap.number}
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center"
              >
                <span className={bar} />
              </span>
            );
          })}
        </div>
      </div>

      <footer className="flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.12em] text-stone-700 select-none">
        <span>Tipografia: Playfair Display</span>
        <span>
          {isLastChapter
            ? "Role para quebrar a tela (Glitch) ↓"
            : "Continue rolando para folhear o livro ↓"}
        </span>
        <span>02 / 06</span>
      </footer>
    </div>
  );
}
