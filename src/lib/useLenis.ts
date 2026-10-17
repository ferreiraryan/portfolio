"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

/** Rola até uma posição Y do documento respeitando preferências de movimento. */
export function scrollToScrollY(y: number, duration = 1.1) {
  if (typeof window !== "undefined") {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      window.scrollTo({ top: y, behavior: "auto" });
      return;
    }
  }

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
    // Se o usuário preferir movimento reduzido, desativa smooth scroll
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
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

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        if (lenisInstance === lenis) lenisInstance = null;
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      if (lenisInstance === lenis) lenisInstance = null;
    };
  }, []);
}
