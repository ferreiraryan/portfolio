"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Acesso à instância do Lenis (para rolagem programática suave). */
export function getLenis() {
  return lenisInstance;
}

/** Rola suavemente até uma posição Y do documento. */
export function scrollToScrollY(y: number, duration = 1.1) {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { duration });
    return;
  }
  if (typeof window !== "undefined") {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisInstance = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);
}
