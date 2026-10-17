"use client";

import { useState } from "react";

interface MangaVolume {
  id: string;
  vol: string;
  title: string;
  jpTitle: string;
  author: string;
  accent: string;
  quote: string;
  review: string;
}

const VOLUMES: MangaVolume[] = [
  {
    id: "vagabond",
    vol: "VOL. 01",
    title: "One Piece",
    jpTitle: "ワンピース",
    author: "Eiichiro Oda",
    accent: "bg-red-700 text-amber-300",
    quote: "“Enquanto eu estiver vivo, existem infinitas possibilidades!”",
    review:
      "A maior aula sobre curiosidade, parceria e construção de mundo. Me lembra todos os dias que explorar o desconhecido — seja uma ilha nova ou uma área da TI que nunca testei antes — é muito melhor quando a gente mantém a mente aberta e valoriza quem caminha junto.",
  },
  {
    id: "berserk",
    vol: "VOL. 02",
    title: "Omniscient Reader's Viewpoint",
    jpTitle: "전지적 독자 시점",
    author: "sing N song",
    accent: "bg-slate-900 text-cyan-400",
    quote: "“Toda grande história é construída a partir de pequenos fragmentos acumulados pelo caminho.”",
    review:
      "Em ORV, o universo inteiro é movido por histórias: cada desafio superado vira um fragmento narrativo que mantém os personagens de pé para o próximo cenário. Enxergo a TI do mesmo jeito — cada área que exploro, cada incidente resolvido e cada projeto que tiro do papel não são apenas códigos isolados, mas capítulos que vão construindo a minha própria história na tecnologia..",
  },
  {
    id: "akira",
    vol: "VOL. 03",
    title: "Neuromancer & Trilogia Sprawl",
    jpTitle: "ニューロマンサー",
    author: "William Gibson",
    accent: "bg-zinc-900 text-emerald-400",
    quote: "“O céu sobre o porto tinha a cor de uma TV sintonizada em um canal fora do ar.”",
    review:
      "O ponto de partida do cyberpunk e do próprio conceito de ciberespaço. A Trilogia Sprawl alimenta direto meu fascínio por redes, segurança, sistemas operacionais, inteligência artificial e essa fronteira onde o hardware, os dados e as pessoas se cruzam.",
  },
  {
    id: "spiderverse",
    vol: "VOL. 04",
    title: "Meditações",
    jpTitle: "Τὰ εἰς ἑαυτόν",
    author: "Marco Aurélio",
    accent: "bg-stone-800 text-amber-200",
    quote: "“A qualidade dos seus pensamentos determina a qualidade da sua mente.”",
    review:
      "Escrito como um caderno pessoal de reflexões, traz uma visão pé-no-chão sobre clareza mental, foco no que está ao nosso alcance e busca pela causa real das coisas. Na TI, quando tudo parece urgente, essa calma analítica faz toda a diferença para resolver problemas de verdade.",
  },
];

export default function Estante() {
  const [selectedVol, setSelectedVol] = useState<MangaVolume>(VOLUMES[0]);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-5 sm:p-10 md:p-14 bg-[#F4F0EA] text-neutral-950">
      {/* Retícula halftone sutil */}
      <div className="manga-halftone pointer-events-none absolute inset-0 opacity-[0.07]" />

      {/* Header HQ */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b-4 border-black pb-3 text-xs font-mono font-bold uppercase tracking-[0.2em] select-none">
        <span className="bg-black text-white px-2.5 py-1">
          05 // Universo Mangá &amp; Quadrinhos — A Estante
        </span>
        <span>LEITURA DA DIREITA PARA A ESQUERDA OU ESQUERDA PARA DIREITA</span>
      </header>

      {/* Estante & Painel de Leitura */}
      <div className="relative z-10 my-auto max-w-6xl mx-auto w-full py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Prateleira com Capas (Coluna Esquerda) */}
        <div className="lg:col-span-7">
          <div className="mb-4 inline-block bg-white border-4 border-black px-4 py-1.5 shadow-[5px_5px_0px_#000000] font-mono text-xs font-bold uppercase">
            ★ Clique em uma edição na prateleira para abrir o painel
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 pb-6 px-4 bg-[#E5DEC9] border-4 border-black shadow-[10px_10px_0px_#000000]">
            {VOLUMES.map((item) => {
              const active = item.id === selectedVol.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedVol(item)}
                  className={`group @container relative flex min-w-0 flex-col justify-between h-64 overflow-hidden p-3.5 text-left border-4 border-black transition-transform duration-200 ${active
                    ? "-translate-y-3 shadow-[8px_8px_0px_#000000] ring-2 ring-black"
                    : "hover:-translate-y-2 shadow-[4px_4px_0px_#000000]"
                    } ${item.accent}`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold border-b-2 border-current pb-1">
                    <span>{item.vol}</span>
                    <span>HQ</span>
                  </div>

                  <div className="my-auto min-w-0 w-full">
                    <p className="truncate text-xs font-bold opacity-80">{item.jpTitle}</p>
                    <h3 className="mt-1 font-sans text-[clamp(8.5px,12cqw,13px)] font-black uppercase leading-tight tracking-tight text-balance wrap-anywhere">
                      {item.title}
                    </h3>
                  </div>

                  <div className="truncate text-[10px] font-mono font-bold uppercase opacity-90">
                    {item.author}
                  </div>
                </button>
              );
            })}
          </div>
          {/* Base de madeira/tinta da prateleira */}
          <div className="h-4 w-full bg-black" />
        </div>

        {/* Painel de Quadrinho Aberto (Coluna Direita) */}
        <div className="lg:col-span-5">
          <div className="relative bg-white border-4 border-black p-6 sm:p-8 shadow-[12px_12px_0px_#000000]">
            {/* Etiqueta de capítulo no canto */}
            <div className="absolute -top-4 right-4 bg-yellow-300 border-[3px] border-black px-3 py-1 font-mono text-xs font-black uppercase shadow-[4px_4px_0px_#000]">
              {selectedVol.vol} {"// DESTAQUE"}
            </div>

            <p className="font-mono text-xs font-bold uppercase text-neutral-700">
              {selectedVol.author} • {selectedVol.jpTitle}
            </p>
            <h3 className="mt-1 font-display text-3xl sm:text-4xl font-black uppercase text-black">
              {selectedVol.title}
            </h3>

            {/* Balão de fala */}
            <div className="mt-5 relative bg-neutral-100 border-[3px] border-black p-4 rounded-xl font-serif italic text-base text-black">
              {selectedVol.quote}
            </div>

            <p className="mt-5 text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
              {selectedVol.review}
            </p>

            <div className="mt-6 pt-4 border-t-2 border-dashed border-black flex items-center justify-between text-xs font-mono font-bold">
              <span>IMPACTO CRIATIVO: MÁXIMO</span>
              <span className="bg-black text-white px-2 py-0.5">CONTINUA... ➔</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-[0.2em] select-none">
        <span>Fundo: Papel Off-White (#F4F0EA)</span>
        <span>Role para ligar o Tubo CRT (Arcade) ↓</span>
        <span>05 / 06</span>
      </footer>
    </div>
  );
}
