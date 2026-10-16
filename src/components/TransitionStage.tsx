"use client";

import { ReactElement, ReactNode, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  RegisterTransition,
  ScrollToDwell,
  TransitionBuilder,
  TransitionDwellContext,
  TransitionIndexContext,
  TransitionScrollContext,
  TransitionTimelineContext,
} from "@/lib/useTransitionTimeline";
import { scrollToScrollY } from "@/lib/useLenis";

gsap.registerPlugin(ScrollTrigger);

/** Duração normalizada de cada efeito de transição (em "unidades" de timeline). */
const EFFECT_DURATION = 1;
/** Tempo de respiro (mundo parado) depois de cada efeito. */
const HOLD_AFTER_EFFECT = 0.85;
/** Pequeno respiro antes do primeiro efeito. */
const LEAD_IN = 0.3;
/** Respiro final para apreciar o último mundo antes de soltar o pin. */
const TRAILING_HOLD = 0.7;
/** Quanto de scroll (px) cada unidade de timeline representa. */
const PX_PER_UNIT = 900;

/**
 * Palco único: todos os mundos/transições ficam empilhados e são orquestrados
 * por UMA timeline com UM pin. Isso elimina os "buracos" que apareciam quando
 * cada transição tinha o próprio pin (duas cópias do mesmo mundo, com o
 * espaçamento interno aparecendo na emenda do scroll).
 */
export default function TransitionStage({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buildersRef = useRef(new Map<number, TransitionBuilder>());
  const dwellsRef = useRef(new Map<number, TransitionBuilder>());
  const dwellWindowsRef = useRef(
    new Map<number, { start: number; duration: number }>()
  );

  const childrenArray = (
    Array.isArray(children) ? children : [children]
  ).filter(Boolean) as ReactElement[];

  const register = useCallback<RegisterTransition>((index, builder) => {
    buildersRef.current.set(index, builder);
    return () => {
      buildersRef.current.delete(index);
    };
  }, []);

  const registerDwell = useCallback<RegisterTransition>((index, builder) => {
    dwellsRef.current.set(index, builder);
    return () => {
      dwellsRef.current.delete(index);
    };
  }, []);

  const scrollToDwell = useCallback<ScrollToDwell>((index, progress) => {
    const range =
      dwellWindowsRef.current.get(index) ??
      dwellWindowsRef.current.values().next().value;
    if (!range) return;
    const clamped = Math.min(1, Math.max(0, progress));
    const time = range.start + clamped * range.duration;
    scrollToScrollY(time * PX_PER_UNIT);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const els = layerRefs.current.filter(Boolean) as HTMLDivElement[];
    if (els.length === 0) return;

    const ctx = gsap.context(() => {
      // Estado inicial: apenas a primeira camada visível.
      gsap.set(els, { autoAlpha: 0 });
      gsap.set(els[0], { autoAlpha: 1 });

      dwellWindowsRef.current.clear();

      const master = gsap.timeline({ paused: true });
      let position = LEAD_IN;
      let total = LEAD_IN;

      // Monta cada efeito em sequência, trocando as camadas no tempo certo.
      for (let i = 0; i < els.length; i++) {
        const builder = buildersRef.current.get(i);
        const isLast = i === els.length - 1;

        master.set(els[i], { autoAlpha: 1 }, position);
        if (i > 0) master.set(els[i - 1], { autoAlpha: 0 }, position);

        if (builder) {
          const effect = gsap.timeline();
          builder(effect);
          const duration = effect.duration();
          if (duration > 0) effect.timeScale(duration / EFFECT_DURATION);
          master.add(effect, position);
        }

        // Animação de "pausa": roda enquanto o mundo fica parado na tela.
        // A própria duração do dwell define quanto tempo o mundo fica parado.
        let hold = HOLD_AFTER_EFFECT;
        const dwellBuilder = dwellsRef.current.get(i);
        if (dwellBuilder) {
          const dwell = gsap.timeline();
          dwellBuilder(dwell);
          const duration = dwell.duration();
          if (duration > 0) {
            const start = position + EFFECT_DURATION;
            master.add(dwell, start);
            dwellWindowsRef.current.set(i, { start, duration });
            hold = Math.max(hold, duration);
          }
        }

        const span = EFFECT_DURATION + (isLast ? 0 : hold);
        position += span;
        total += span;
      }

      // Estende a timeline com a pausa final para que a duração do master
      // seja exatamente `total` — mantendo scroll = tempo × PX_PER_UNIT.
      master.to({}, { duration: TRAILING_HOLD }, position);
      total += TRAILING_HOLD;

      const trigger = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + Math.round(total * PX_PER_UNIT),
        pin: stage,
        scrub: 0.85,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: master,
      });

      // Recalcula depois que fontes/imagens assentarem.
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      const onLoad = () => ScrollTrigger.refresh();
      window.addEventListener("load", onLoad);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("load", onLoad);
        trigger.kill();
        master.kill();
      };
    }, stage);

    return () => ctx.revert();
  }, []);

  return (
    <TransitionTimelineContext.Provider value={register}>
      <TransitionDwellContext.Provider value={registerDwell}>
        <TransitionScrollContext.Provider value={scrollToDwell}>
          <main
            ref={stageRef}
            className="relative h-screen w-full overflow-hidden bg-[#050505]"
          >
            {childrenArray.map((child, i) => (
              <TransitionIndexContext.Provider value={i} key={i}>
                <div
                  ref={(el) => {
                    layerRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                >
                  {child}
                </div>
              </TransitionIndexContext.Provider>
            ))}
          </main>
        </TransitionScrollContext.Provider>
      </TransitionDwellContext.Provider>
    </TransitionTimelineContext.Provider>
  );
}
