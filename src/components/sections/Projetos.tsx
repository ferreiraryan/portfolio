"use client";

import { useState } from "react";
import githubProjects from "@/data/github-projects.json";
import type { ProjectItem } from "@/types/github";

const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: "hub_agent",
    code: "PRJ_01 // HUB_AGENT",
    name: "HUB Agent — Autonomous Orchestrator",
    category: "AI & ENGINE",
    status: "ACTIVE LINK",
    stack: ["Python", "FastAPI", "AI Agents", "Docker"],
    summary:
      "Plataforma e hub central para orquestração de agentes autônomos, execução de tarefas assíncronas e integração com modelos neurais.",
    metrics: "39 COMMITS • 0 STARS • SYNC: RECENTE",
    repoUrl: "https://github.com/ferreiraryan/HUB_AGENT",
    liveUrl: "https://github.com/ferreiraryan/HUB_AGENT",
    commitCount: 39,
    stars: 0,
    pushedAt: new Date().toISOString(),
    featured: true,
  },
  {
    id: "portfolio",
    code: "PRJ_02 // PORTFOLIO",
    name: "Portfólio Cinematográfico",
    category: "CREATIVE WEB",
    status: "DEPLOYED [PROD]",
    stack: ["Next.js 16", "React 19", "Tailwind CSS v4", "GSAP", "Lenis"],
    summary:
      "Jornada cinematográfica interativa em scroll único com 6 mundos temáticos, timelines sincronizadas no GSAP e transições de tela fluidas.",
    metrics: "14 COMMITS • 0 STARS • SYNC: RECENTE",
    repoUrl: "https://github.com/ferreiraryan/portfolio",
    liveUrl: "https://portfolio-three-bay-99.vercel.app",
    commitCount: 14,
    stars: 0,
    pushedAt: new Date().toISOString(),
    featured: true,
  },
  {
    id: "boid_java",
    code: "PRJ_03 // BOID_JAVA",
    name: "Boids Flocking & Swarm Simulation",
    category: "CREATIVE WEB",
    status: "SIMULATION ACTIVE",
    stack: ["Java", "Computação Gráfica", "Física Vetorial", "Algoritmos"],
    summary:
      "Simulação de comportamento emergente de enxames (algoritmo Boids de Craig Reynolds) com vetores físicos de separação, alinhamento e coesão em tempo real.",
    metrics: "8 COMMITS • 0 STARS • SYNC: RECENTE",
    repoUrl: "https://github.com/ferreiraryan/boid_java",
    liveUrl: "https://github.com/ferreiraryan/boid_java",
    commitCount: 8,
    stars: 0,
    pushedAt: new Date().toISOString(),
    featured: true,
  },
];

const PROJECTS: ProjectItem[] =
  Array.isArray(githubProjects) && githubProjects.length > 0
    ? (githubProjects as ProjectItem[])
    : FALLBACK_PROJECTS;

export default function Projetos() {
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const [filter, setFilter] = useState<string>("★ DESTAQUES");

  const categories = [
    "★ DESTAQUES",
    "ALL",
    "FULL-STACK",
    "CREATIVE WEB",
    "AI & ENGINE",
  ].filter(
    (cat) =>
      cat === "★ DESTAQUES" ||
      cat === "ALL" ||
      PROJECTS.some((p) => p.category === cat)
  );

  const getFilteredList = (currentFilter: string) => {
    if (currentFilter === "★ DESTAQUES") {
      const feat = PROJECTS.filter((p) => p.featured);
      return feat.length > 0 ? feat : PROJECTS;
    }
    if (currentFilter === "ALL") return PROJECTS;
    return PROJECTS.filter((p) => p.category === currentFilter);
  };

  const filtered = getFilteredList(filter);
  const activeProject =
    PROJECTS.find((p) => p.id === selectedId) || filtered[0] || PROJECTS[0];

  const hasLiveDemo =
    Boolean(activeProject.liveUrl) &&
    activeProject.liveUrl !== activeProject.repoUrl;

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between p-5 sm:p-10 md:p-14 bg-[#0D041A] text-fuchsia-100 font-mono select-none overflow-hidden">
      {/* Glow Cyberpunk de fundo */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Header Terminal */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/30 pb-3 text-[11px] uppercase tracking-[0.25em] text-fuchsia-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          03 // Universo Cyberpunk — Terminal de Projetos
        </span>
        <span className="text-cyan-400">
          SYS_KERNEL: GITHUB_SYNC // RANKING: COMMITS & DESTAQUES
        </span>
      </header>

      {/* Janela Principal do Terminal */}
      <div className="relative z-10 my-auto max-w-6xl mx-auto w-full py-6">
        <div className="rounded-lg border border-fuchsia-500/40 bg-[#140826]/90 shadow-[0_0_50px_rgba(217,70,239,0.18)] backdrop-blur-md overflow-hidden">
          {/* Barra da Janela */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#1F0D3D] border-b border-fuchsia-500/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-fuchsia-200 font-semibold truncate">
                ryan@cyberdeck:~/projetos$ ./filtrar_destaques.sh --github
              </span>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilter(cat);
                    const nextList = getFilteredList(cat);
                    if (nextList.length > 0) setSelectedId(nextList[0].id);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] transition border ${
                    filter === cat
                      ? cat === "★ DESTAQUES"
                        ? "bg-amber-400 text-black font-bold border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.7)]"
                        : "bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                      : "bg-fuchsia-950/50 text-fuchsia-300 border-fuchsia-500/30 hover:border-cyan-400/60"
                  }`}
                >
                  [{cat}]
                </button>
              ))}
            </div>
          </div>

          {/* Corpo dividido: Lista de Diretórios + Inspecionar Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Coluna Esquerda: Lista de Projetos */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-fuchsia-500/30 p-4 sm:p-6 space-y-2.5 max-h-[500px] overflow-y-auto">
              <p className="text-[11px] uppercase tracking-widest text-fuchsia-400 mb-3 flex items-center justify-between">
                <span>&gt; MÓDULOS ({filtered.length}):</span>
                <span className="text-[10px] text-cyan-400">
                  {filter === "★ DESTAQUES" ? "PROJETOS SELECIONADOS" : "ORDEM: COMMITS"}
                </span>
              </p>
              {filtered.map((proj) => {
                const active = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedId(proj.id)}
                    className={`w-full text-left p-3.5 rounded border transition flex flex-col gap-1.5 ${
                      active
                        ? "bg-fuchsia-500/20 border-cyan-400 text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.2)]"
                        : "bg-black/30 border-fuchsia-500/20 text-fuchsia-200/80 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-cyan-300">
                      <span className="truncate max-w-[160px]">{proj.code}</span>
                      <div className="flex items-center gap-1.5">
                        {proj.featured && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[9px] font-bold">
                            ★
                          </span>
                        )}
                        <span className="font-bold text-amber-300">
                          {active ? "◄ ATIVO" : `${proj.commitCount} COMMITS`}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm sm:text-base font-bold tracking-tight">
                      {proj.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coluna Direita: Detalhes do Projeto Ativo */}
            <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between bg-[#0B0314]/80">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/20 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-cyan-400 font-semibold">
                      {activeProject.code}
                    </span>
                    {activeProject.featured && (
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 border border-amber-300/50 text-amber-300 text-[10px] font-bold shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                        ★ DESTAQUE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px]">
                      {activeProject.commitCount} COMMITS
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px]">
                      {activeProject.status}
                    </span>
                  </div>
                </div>

                <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {activeProject.name}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-fuchsia-100/85 leading-relaxed">
                  {activeProject.summary}
                </p>

                {/* Stack Tags */}
                <div className="mt-6">
                  <p className="text-[11px] uppercase tracking-widest text-fuchsia-400 mb-2">
                    STACK_LOADED:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-fuchsia-950/80 border border-fuchsia-400/40 text-xs text-cyan-200"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Telemetria */}
                <div className="mt-6 p-3.5 rounded bg-black/60 border border-cyan-500/30 text-xs text-cyan-300">
                  <span className="text-fuchsia-400 font-bold">TELEMETRIA: </span>
                  {activeProject.metrics}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-fuchsia-500/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-fuchsia-400">
                  STATUS: SINCRONIZADO VIA GITHUB API
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded text-xs font-bold border border-fuchsia-400/60 text-fuchsia-200 hover:bg-fuchsia-500/20 transition"
                  >
                    &gt; VER_CÓDIGO (GITHUB)
                  </a>
                  {hasLiveDemo ? (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded text-xs font-bold bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.5)] transition"
                    >
                      &gt; EXECUTAR_DEMO ↗
                    </a>
                  ) : (
                    <span className="px-3 py-2 rounded text-xs font-mono text-fuchsia-400/60 border border-fuchsia-800/40">
                      [DEMO DIRETA NO GITHUB]
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-fuchsia-400">
        <span>MEM: 64GB NEURAL RAM</span>
        <span>Role para ganhar XP (Level Up) ↓</span>
        <span>03 / 06</span>
      </footer>
    </div>
  );
}
