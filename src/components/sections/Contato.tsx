"use client";

import { FormEvent, useState } from "react";

export default function Contato() {
  const [coins, setCoins] = useState<number>(1);
  const [sentMessage, setSentMessage] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [playerEmail, setPlayerEmail] = useState<string>("");
  const [playerQuest, setPlayerQuest] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerEmail.trim()) return;
    setSentMessage(true);
  };

  return (
    <div className="crt-scanlines relative flex min-h-screen w-full flex-col justify-between p-5 sm:p-10 md:p-14 bg-[#050508] text-emerald-400 font-mono select-none overflow-hidden">
      {/* Brilho de tubo CRT */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.95)]" />

      {/* Topo do Fliperama */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/30 pb-3 text-xs uppercase tracking-[0.25em]">
        <span className="text-emerald-300">06 // Universo Arcade — CRT Terminal</span>
        <span className="text-amber-400 font-bold">
          HI-SCORE: 999.990 // CRÉDITOS: {coins}
        </span>
      </header>

      {/* Gabinete Arcade Central */}
      <div className="relative z-10 my-auto max-w-5xl mx-auto w-full py-6">
        <div className="rounded-2xl border-4 border-emerald-500/50 bg-[#0A0D0C]/95 p-6 sm:p-10 shadow-[0_0_70px_rgba(16,185,129,0.2)]">
          {/* Letreiro INSERT COIN + Botão de Ficha */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-500/30 pb-6">
            <div>
              <span className="inline-block px-3 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold tracking-widest animate-pulse">
                ★ INSERT COIN TO CONNECT ★
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-white">
                PLAYER 1 — INICIAR CONTATO
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                setCoins((c) => c + 1);
                setSentMessage(false);
              }}
              className="px-5 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-widest shadow-[0_0_24px_rgba(251,191,36,0.6)] transition active:scale-95"
            >
              🪙 INSERIR FICHA (+1 CRÉDITO)
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Canais Diretos (Select Stage) */}
            <div className="lg:col-span-5 space-y-3">
              <p className="text-xs uppercase tracking-widest text-emerald-300 mb-2">
                &gt; SELECT COMMUNICATION STAGE:
              </p>

              <a
                href="https://github.com/ryanferreira"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-500/20 hover:border-emerald-300 transition"
              >
                <span className="font-bold text-white">[1P] GITHUB</span>
                <span className="text-xs text-emerald-300">/ryanferreira ↗</span>
              </a>

              <a
                href="https://linkedin.com/in/ryanferreira"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-500/20 hover:border-cyan-300 text-cyan-300 transition"
              >
                <span className="font-bold text-white">[2P] LINKEDIN</span>
                <span className="text-xs">/in/ryanferreira ↗</span>
              </a>

              <a
                href="mailto:contato@ryanferreira.dev"
                className="flex items-center justify-between p-3.5 rounded border border-fuchsia-500/40 bg-fuchsia-950/20 hover:bg-fuchsia-500/20 hover:border-fuchsia-300 text-fuchsia-300 transition"
              >
                <span className="font-bold text-white">[3P] E-MAIL DIRETO</span>
                <span className="text-xs">contato@ryanferreira.dev</span>
              </a>
            </div>

            {/* Formulário de Transmissão Arcade */}
            <div className="lg:col-span-7">
              {sentMessage ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 rounded border-2 border-emerald-400 bg-emerald-950/30">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-300">
                    STAGE CLEAR! // MENSAGEM ENVIADA
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    GG, {playerName}! Missão registrada no servidor.
                  </h3>
                  <p className="mt-2 text-xs text-emerald-200">
                    Ryan Ferreira responderá em breve para {playerEmail}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSentMessage(false);
                      setPlayerName("");
                      setPlayerEmail("");
                      setPlayerQuest("");
                    }}
                    className="mt-5 px-4 py-2 rounded bg-emerald-400 text-black font-bold text-xs uppercase"
                  >
                    ENVIAR NOVA TRANSMISSÃO
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-emerald-300 mb-1">
                        NICKNAME / NOME:
                      </label>
                      <input
                        type="text"
                        required
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Ex.: Player One"
                        className="w-full rounded border border-emerald-500/40 bg-black/80 px-3.5 py-2.5 text-xs text-white focus:border-emerald-300 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-emerald-300 mb-1">
                        E-MAIL DE RESPOSTA:
                      </label>
                      <input
                        type="email"
                        required
                        value={playerEmail}
                        onChange={(e) => setPlayerEmail(e.target.value)}
                        placeholder="player@dominio.com"
                        className="w-full rounded border border-emerald-500/40 bg-black/80 px-3.5 py-2.5 text-xs text-white focus:border-emerald-300 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-emerald-300 mb-1">
                      BRIEFING DA MISSÃO / PROJETO:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={playerQuest}
                      onChange={(e) => setPlayerQuest(e.target.value)}
                      placeholder="Conte sobre o projeto, ideia ou oportunidade..."
                      className="w-full rounded border border-emerald-500/40 bg-black/80 px-3.5 py-2.5 text-xs text-white focus:border-emerald-300 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(52,211,153,0.5)] transition"
                  >
                    ▶ PRESS START — ENVIAR MENSAGEM
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-emerald-500/80">
        <span>CRT 60Hz • FÓSFORO VERDE</span>
        <span>FIM DA JORNADA — RYAN FERREIRA © 2026</span>
        <span>06 / 06</span>
      </footer>
    </div>
  );
}
