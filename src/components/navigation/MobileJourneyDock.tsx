"use client";

import { useEffect, useState } from "react";
import { useJourney, WORLDS, journeyStore } from "@/lib/journeyStore";

export default function MobileJourneyDock() {
  const { currentWorld, unlockedWorlds } = useJourney();
  const [open, setOpen] = useState(false);

  // Monitora seções no mobile usando IntersectionObserver para sincronizar o mundo ativo
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const world = WORLDS.find((w) => w.id === id);
            if (world) {
              journeyStore.setMobileActiveWorld(world.index);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    WORLDS.forEach((w) => {
      const el = document.getElementById(w.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeMeta = WORLDS[currentWorld - 1] ?? WORLDS[0];

  const handleSelect = (idx: number) => {
    journeyStore.navigateToWorld(idx);
    setOpen(false);
  };

  return (
    <nav
      aria-label="Navegação móvel entre seções"
      className="fixed bottom-4 inset-x-0 z-40 block lg:hidden px-4 pointer-events-none select-none"
    >
      <div className="mx-auto max-w-sm flex flex-col items-center">
        {/* Menu Expandido de Mundos (Drawer/Popover) */}
        {open && (
          <div className="pointer-events-auto mb-2 w-full rounded-2xl border border-white/20 bg-black/95 p-3 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              <span>Navegador de Mundos</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-neutral-400 hover:text-white p-1"
                aria-label="Fechar navegador"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {WORLDS.map((w) => {
                const isActive = currentWorld === w.index;
                const isUnlocked = unlockedWorlds[w.index - 1];

                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelect(w.index)}
                    aria-label={`Ir para ${w.name}`}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                      isActive
                        ? "bg-white/15 border border-white/40 shadow-sm"
                        : "bg-white/[0.04] border border-white/5 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/50 text-xs font-mono font-bold text-white border border-white/20">
                      {isUnlocked ? w.theme.symbol : "🔒"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 truncate">
                        {w.eyebrow.split("//")[0]}
                      </p>
                      <p
                        className={`text-xs font-bold truncate ${
                          isUnlocked ? w.theme.textAccent : "text-neutral-400"
                        }`}
                      >
                        {w.category}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Pílula Principal do Dock */}
        <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-black/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Abrir menu de mundos do portfólio"
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-mono text-emerald-400 font-bold border border-emerald-400/30">
              {activeMeta.theme.symbol}
            </span>

            <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              {activeMeta.eyebrow}
            </span>

            <span className="text-[10px] font-mono text-neutral-400">
              ({currentWorld}/06)
            </span>

            <span className="text-neutral-400 text-xs ml-1">
              {open ? "▲" : "▼"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
