"use client";

import { useJourney, WORLDS, journeyStore } from "@/lib/journeyStore";

export default function WorldJourneyRail() {
  const { currentWorld, unlockedWorlds, justUnlocked, scrollProgress } = useJourney();

  return (
    <nav
      aria-label="Trilha de navegação cinematográfica entre mundos"
      className="fixed right-5 md:right-7 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center select-none"
    >
      {/* Indicador de Cabeçalho da Trilha */}
      <div className="mb-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-[0.2em] text-neutral-400">
        <span className="text-white font-bold">{String(currentWorld).padStart(2, "0")}</span>
        <span className="text-neutral-500"> / 06</span>
      </div>

      <div className="relative flex flex-col items-center gap-5 py-2">
        {/* Linha Vertical de Fundo */}
        <div className="absolute top-3 bottom-3 w-[2px] bg-white/10 rounded-full" />

        {/* Linha de Progresso Luminosa Preenchida */}
        <div
          className="absolute top-3 w-[2px] bg-gradient-to-b from-white via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 ease-out"
          style={{
            height: `calc(${scrollProgress * 100}% - 12px)`,
            maxHeight: "calc(100% - 24px)",
          }}
        />

        {/* Os 6 Nós Temáticos */}
        {WORLDS.map((world) => {
          const isActive = currentWorld === world.index;
          const isUnlocked = unlockedWorlds[world.index - 1];
          const isJustUnlocked = justUnlocked === world.index;

          return (
            <div key={world.id} className="relative group flex items-center">
              {/* Tooltip / Card Lateral Temático (Expansão no Hover ou Foco do Teclado) */}
              <div
                role="tooltip"
                className="pointer-events-none absolute right-12 z-50 min-w-[190px] p-3 rounded-lg border border-white/15 bg-black/90 backdrop-blur-xl text-left shadow-2xl opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0 transition-all duration-200"
              >
                <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                  <span>{world.eyebrow}</span>
                  {isActive && (
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-emerald-400 font-bold animate-pulse">
                      ATIVO
                    </span>
                  )}
                </div>

                <div
                  className={`mt-1 font-sans text-sm font-bold tracking-tight ${
                    isUnlocked ? world.theme.textAccent : "text-neutral-300"
                  }`}
                >
                  {isUnlocked ? world.name : `${world.category} (Bloqueado)`}
                </div>

                <p className="mt-0.5 text-[11px] text-neutral-400 leading-tight">
                  {isUnlocked ? world.theme.tagline : "Role ou clique para revelar este universo."}
                </p>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono tracking-wider">
                  <span className="text-neutral-500">
                    {isUnlocked ? "EXPLORADO" : "FOG OF WAR"}
                  </span>
                  <span className={world.theme.textAccent}>
                    {isActive ? "VOCÊ ESTÁ AQUI" : "CLIQUE PARA VIAJAR ➔"}
                  </span>
                </div>
              </div>

              {/* Botão do Nó */}
              <button
                type="button"
                onClick={() => journeyStore.navigateToWorld(world.index)}
                aria-label={`Mundo ${world.index}: ${world.name}. ${
                  isActive ? "Atualmente visualizado" : isUnlocked ? "Explorado" : "Não descoberto"
                }`}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  isActive
                    ? `scale-125 z-10 ${world.theme.bgBadge} ${world.theme.borderBadge} border-2 shadow-[0_0_18px_${world.theme.glow}]`
                    : isUnlocked
                    ? `hover:scale-110 ${world.theme.bgBadge} border border-white/20 hover:border-white/60`
                    : "bg-black/80 border border-dashed border-white/25 hover:border-white/50 opacity-60 hover:opacity-100"
                }`}
              >
                {/* Efeito de Flash / Desbloqueio (Reveal FX) */}
                {isJustUnlocked && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: world.theme.accent }}
                  />
                )}

                {/* Símbolo do Nó */}
                {isUnlocked ? (
                  <span
                    className={`font-mono text-xs font-bold leading-none select-none ${
                      isActive ? world.theme.textAccent : "text-neutral-300"
                    }`}
                  >
                    {world.theme.symbol}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-400 select-none">
                    🔒
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
