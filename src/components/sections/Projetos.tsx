"use client";

import { useState } from "react";

interface ProjectItem {
  id: string;
  code: string;
  name: string;
  category: "FULL-STACK" | "AI & ENGINE" | "CREATIVE WEB";
  status: string;
  stack: string[];
  summary: string;
  metrics: string;
  repoUrl: string;
  liveUrl: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "nexus-os",
    code: "PRJ_01 // NEXUS-CYBERDECK",
    name: "Nexus OS — Cloud Dev Environment",
    category: "FULL-STACK",
    status: "ONLINE [99.98% UPTIME]",
    stack: ["Next.js 14", "TypeScript", "WebSockets", "Docker", "Tailwind"],
    summary:
      "Ambiente de desenvolvimento colaborativo no navegador com terminal em tempo real, execução em containers isolados e telemetria de latência.",
    metrics: "< 18ms sync latency • 12k+ sessões",
    repoUrl: "https://github.com/ryanferreira/nexus-os",
    liveUrl: "https://nexus-os-demo.vercel.app",
  },
  {
    id: "chronos-engine",
    code: "PRJ_02 // CHRONOS-SCROLL",
    name: "Chronos — Narrative Scroll Engine",
    category: "CREATIVE WEB",
    status: "DEPLOYED [v2.4.0]",
    stack: ["GSAP", "ScrollTrigger", "Lenis", "Framer Motion", "WebGL"],
    summary:
      "Motor de storytelling interativo que sincroniza transições de corte de tela, shaders e trilhas de áudio baseadas na velocidade do scroll.",
    metrics: "60fps cravados • 0 CLS",
    repoUrl: "https://github.com/ryanferreira/chronos-engine",
    liveUrl: "https://chronos-scroll.vercel.app",
  },
  {
    id: "valkyrie-ai",
    code: "PRJ_03 // VALKYRIE-CORE",
    name: "Valkyrie — Autonomous Code Auditor",
    category: "AI & ENGINE",
    status: "NEURAL LINK ACTIVE",
    stack: ["Node.js", "TypeScript", "AST Parser", "PostgreSQL", "Redis"],
    summary:
      "Pipeline de análise estática e semântica que inspeciona pull requests, detecta gargalos de concorrência e sugere patches automatizados.",
    metrics: "420+ repos auditados • -64% bug rate",
    repoUrl: "https://github.com/ryanferreira/valkyrie-ai",
    liveUrl: "https://valkyrie-auditor.vercel.app",
  },
  {
    id: "akira-ui",
    code: "PRJ_04 // AKIRA-DESIGN-SYS",
    name: "Akira — Neo-Tokyo UI Kit",
    category: "CREATIVE WEB",
    status: "STABLE RELEASE",
    stack: ["React 18", "Tailwind CSS", "Radix UI", "SVG Filters"],
    summary:
      "Biblioteca de componentes acessíveis com estética cyberpunk, HUDs modulares, efeitos de glitch controlados e suporte completo a teclado.",
    metrics: "38 componentes • 100% A11y score",
    repoUrl: "https://github.com/ryanferreira/akira-ui",
    liveUrl: "https://akira-ui.vercel.app",
  },
];

export default function Projetos() {
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const [filter, setFilter] = useState<string>("ALL");

  const filtered =
    filter === "ALL" ? PROJECTS : PROJECTS.filter((p) => p.category === filter);
  const activeProject =
    PROJECTS.find((p) => p.id === selectedId) || filtered[0] || PROJECTS[0];

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
        <span className="text-cyan-400">SYS_KERNEL: RYAN_OS v4.2 // ROOT_ACCESS</span>
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
              <span className="ml-2 text-fuchsia-200 font-semibold">
                ryan@cyberdeck:~/projetos$ ./listar_sistemas.sh
              </span>
            </div>

            {/* Filtros de Categoria */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["ALL", "FULL-STACK", "CREATIVE WEB", "AI & ENGINE"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFilter(cat);
                    const nextList =
                      cat === "ALL"
                        ? PROJECTS
                        : PROJECTS.filter((p) => p.category === cat);
                    if (nextList.length > 0) setSelectedId(nextList[0].id);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] transition border ${
                    filter === cat
                      ? "bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
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
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-fuchsia-500/30 p-4 sm:p-6 space-y-2.5">
              <p className="text-[11px] uppercase tracking-widest text-fuchsia-400 mb-3">
                &gt; SELECIONE UM MÓDULO ({filtered.length} ENCONTRADOS):
              </p>
              {filtered.map((proj) => {
                const active = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedId(proj.id)}
                    className={`w-full text-left p-3.5 rounded border transition flex flex-col gap-1 ${
                      active
                        ? "bg-fuchsia-500/20 border-cyan-400 text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.2)]"
                        : "bg-black/30 border-fuchsia-500/20 text-fuchsia-200/80 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-cyan-300">
                      <span>{proj.code}</span>
                      <span>{active ? "◄ ATIVO" : "READY"}</span>
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
                  <span className="text-xs text-cyan-400 font-semibold">
                    {activeProject.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px]">
                    {activeProject.status}
                  </span>
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
                  STATUS: COMPILADO SEM ERROS
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
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded text-xs font-bold bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.5)] transition"
                  >
                    &gt; EXECUTAR_DEMO ↗
                  </a>
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
