"use client";

import { useState } from "react";

interface SkillNode {
  name: string;
  level: number;
  rank: string;
  manaCost: string;
  desc: string;
}

const SKILL_TREES: Record<string, SkillNode[]> = {
  "Grimório Front-End": [
    {
      name: "Next.js 16 & React 19",
      level: 96,
      rank: "MESTRE [S+]",
      manaCost: "Passiva Contínua",
      desc: "Server Components, App Router, Streaming SSR e arquitetura modular de alta performance.",
    },
    {
      name: "TypeScript Estrito",
      level: 94,
      rank: "MESTRE [S]",
      manaCost: "0 MP",
      desc: "Tipagem avançada, generics, inferência segura de contratos de API e zero 'any'.",
    },
    {
      name: "Tailwind CSS & Design Systems",
      level: 98,
      rank: "GRÃO-MESTRE [SS]",
      manaCost: "10 MP",
      desc: "Tokens semânticos, layouts responsivos fluidos e temas customizados multiverso.",
    },
  ],
  "Artes de Animação": [
    {
      name: "GSAP & ScrollTrigger",
      level: 92,
      rank: "ARCANO [S]",
      manaCost: "25 MP",
      desc: "Timelines complexas, pin de seções, scrub milimétrico e cortes de tela sincronizados.",
    },
    {
      name: "Lenis & Framer Motion",
      level: 90,
      rank: "ARCANO [A+]",
      manaCost: "15 MP",
      desc: "Inércia suave de rolagem sincronizada ao ticker e transições declarativas de layout.",
    },
    {
      name: "SVG Clip-Path & Shaders",
      level: 86,
      rank: "ESPECIALISTA [A]",
      manaCost: "35 MP",
      desc: "Máscaras vetoriais dinâmicas para efeitos de rasgo de papel, estilhaços e CRT.",
    },
  ],
  "Forja Back-End": [
    {
      name: "Node.js & APIs REST/GraphQL",
      level: 91,
      rank: "MESTRE [S]",
      manaCost: "20 MP",
      desc: "Serviços escaláveis, autenticação segura, caching inteligente e baixa latência.",
    },
    {
      name: "PostgreSQL, Prisma & Redis",
      level: 88,
      rank: "VETERANO [A+]",
      manaCost: "20 MP",
      desc: "Modelagem relacional limpa, índices otimizados e filas assíncronas.",
    },
    {
      name: "Docker, CI/CD & Cloud",
      level: 85,
      rank: "VETERANO [A]",
      manaCost: "30 MP",
      desc: "Containers reprodutíveis, pipelines automatizados e deploy edge.",
    },
  ],
};

const BASE_ATTRIBUTES = [
  { code: "INT", name: "Arquitetura & Lógica", val: 96 },
  { code: "DEX", name: "UI Motion & Performance", val: 94 },
  { code: "WIS", name: "Resolução de Problemas", val: 92 },
  { code: "CHA", name: "Storytelling & UX", val: 95 },
];

export default function Skills() {
  const categories = Object.keys(SKILL_TREES);
  const [activeCat, setActiveCat] = useState<string>(categories[0]);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(
    SKILL_TREES[categories[0]][0]
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-5 sm:p-8 lg:px-12 lg:py-8 bg-[#1C120B] text-[#F7ECD8]">
      {/* Header RPG */}
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/30 pb-3 font-mono text-eyebrow uppercase tracking-[0.14em] text-amber-300 select-none">
        <span>04 // Universo RPG — Ficha de Personagem</span>
        <span>GUILDA DOS ENGENHEIROS • NÍVEL 99</span>
      </header>

      {/* Container da Ficha */}
      <div className="my-auto max-w-7xl mx-auto w-full py-6">
        <div className="rounded-md border-2 border-amber-500/60 bg-[#2A1B10] shadow-[0_25px_70px_rgba(0,0,0,0.75)] p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Coluna Esquerda: Status do Personagem & Atributos */}
          <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-amber-600/30 pb-6 lg:pb-0 lg:pr-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-400/50 font-mono text-xs text-amber-200">
                  CLASSE: ARQUITETO ARCANO
                </span>
                <span className="font-mono text-xs text-amber-300 font-bold">
                  NV. 99
                </span>
              </div>

              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-[#F7ECD8]">
                Ryan Ferreira
              </h2>

              {/* Barras de HP / MP / XP */}
              <div className="mt-4 space-y-2 font-mono text-[13px]">
                <div>
                  <div className="flex justify-between text-emerald-300 mb-1">
                    <span>HP (ESTABILIDADE EM PRODUÇÃO)</span>
                    <span className="tabular-nums">9999 / 9999</span>
                  </div>
                  <div className="h-3 w-full rounded bg-black/70 overflow-hidden border border-emerald-500/60">
                    <div className="h-full w-full bg-gradient-to-r from-emerald-600 to-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sky-300 mb-1">
                    <span>MP (CRIATIVIDADE &amp; CAFEÍNA)</span>
                    <span className="tabular-nums">850 / 850</span>
                  </div>
                  <div className="h-3 w-full rounded bg-black/70 overflow-hidden border border-sky-500/60">
                    <div className="h-full w-[94%] bg-gradient-to-r from-sky-600 to-cyan-300" />
                  </div>
                </div>
              </div>

              {/* Atributos Primários */}
              <div className="mt-6">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber-300">
                  Atributos Base:
                </p>
                <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BASE_ATTRIBUTES.map((attr) => (
                    <div
                      key={attr.code}
                      className="bg-black/35 border border-amber-600/40 p-2.5 rounded"
                    >
                      <div className="flex justify-between text-[13px] font-mono mb-1">
                        <span>
                          <strong className="text-amber-300">[{attr.code}]</strong> {attr.name}
                        </span>
                        <span className="tabular-nums text-[#F3E3C3] font-bold">
                          {attr.val}/100
                        </span>
                      </div>
                      <div className="h-2 w-full bg-black/70 rounded overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-600 to-yellow-400"
                          style={{ width: `${attr.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 rounded bg-amber-950/40 border border-amber-500/30 font-mono text-[13px] text-[#F3E3C3]">
              <strong className="text-amber-400">EQUIPAMENTO ATUAL:</strong>{" "}
              Next.js 16 Grimoire + Luvas de TypeScript + Botas de Scroll Suave (Lenis)
            </div>
          </div>

          {/* Coluna Direita: Árvore de Skills Interativa */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Abas de Grimórios */}
              <div className="flex flex-wrap gap-2 border-b border-amber-600/30 pb-4">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCat(cat);
                      setSelectedSkill(SKILL_TREES[cat][0]);
                    }}
                    className={`px-3.5 py-2 rounded font-mono text-[13px] uppercase tracking-wider transition border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                      activeCat === cat
                        ? "bg-amber-500 text-black font-bold border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
                        : "bg-black/40 text-amber-100 border-amber-600/50 hover:bg-amber-900/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Barras das Habilidades da Categoria */}
              <div className="mt-5 space-y-3">
                {SKILL_TREES[activeCat].map((sk) => {
                  const isSelected = selectedSkill.name === sk.name;
                  return (
                    <button
                      key={sk.name}
                      type="button"
                      onClick={() => setSelectedSkill(sk)}
                      className={`w-full text-left p-4 rounded border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]"
                          : "bg-black/30 border-amber-700/40 hover:border-amber-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs text-amber-300">
                        <span className="font-bold text-base text-[#F7ECD8]">
                          ✦ {sk.name}
                        </span>
                        <span className="tabular-nums">
                          {sk.rank} • LVL {sk.level}
                        </span>
                      </div>
                      <div className="mt-2.5 h-3 w-full rounded-full bg-black/70 p-0.5 border border-amber-600/50">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-300"
                          style={{ width: `${sk.level}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caixa de Inspeção da Skill Selecionada */}
            <div className="mt-6 min-h-[140px] p-4 sm:p-5 rounded border border-amber-400/50 bg-[#140C06] shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                <span>GRIMÓRIO // DETALHE DA HABILIDADE</span>
                <span>CUSTO: {selectedSkill.manaCost}</span>
              </div>
              <h3 className="mt-1 font-serif text-2xl font-bold text-[#F7ECD8]">
                {selectedSkill.name}
              </h3>
              <p className="mt-2 text-[15px] sm:text-base text-[#F3E3C3] leading-relaxed">
                {selectedSkill.desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-between font-mono text-eyebrow uppercase tracking-[0.14em] text-amber-300 select-none">
        <span>Fundo: Marrom / Âmbar (#1C120B)</span>
        <span>Role para abrir o Painel de HQ ↓</span>
        <span>04 / 06</span>
      </footer>
    </div>
  );
}
