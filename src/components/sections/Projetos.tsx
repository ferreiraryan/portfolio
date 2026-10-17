"use client";

import { useState } from "react";
import SectionScrollPrompt from "@/components/navigation/SectionScrollPrompt";

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
    code: "PRJ_01 // DEVSTORE-FULLSTACK",
    name: "DevStore — E-commerce Full Stack",
    category: "FULL-STACK",
    status: "PUBLICADO [DOCKER & WEB]",
    stack: ["Node.js", "TypeScript", "React", "Docker", "JWT", "REST API"],
    summary:
      "Projeto em que conectei várias pontas que gosto de estudar: desenvolvimento web, arquitetura de backend, segurança e infraestrutura. Criei a API em Node.js com TypeScript e autenticação JWT, integrei ao frontend em React e isolei todo o ambiente em containers Docker para manter o deploy limpo e previsível.",
    metrics: "Full Stack Ponta a Ponta • Autenticação JWT • Ambiente em Docker",
    repoUrl: "https://github.com/ferreiraryan",
    liveUrl: "https://ecomerce-node-git-main-ferreiraryans-projects.vercel.app/",
  },
  {
    id: "chronos-engine",
    code: "PRJ_02 // GRENE-IOT-DATA",
    name: "Grene — Monitoramento Ambiental IoT",
    category: "AI & ENGINE",
    status: "EM PRODUÇÃO [IOT & EDGE]",
    stack: ["C/C++", "ESP32", "API REST", "Docker", "Edge Computing"],
    summary:
      "Minha exploração na fronteira entre hardware, redes e dados. Programei o firmware em C/C++ para o microcontrolador ESP32 ler sensores físicos com baixo consumo de energia e transmitir os dados estruturados em tempo real para um backend via API REST orquestrado com Docker.",
    metrics: "IoT & Hardware (ESP32) • Captura de Dados na Borda • API em Tempo Real",
    repoUrl: "https://github.com/ferreiraryan/grene",
    liveUrl: "https://grene-production.up.railway.app/",
  },
  {
    id: "valkyrie-ai",
    code: "PRJ_03 // MOVIE-QUEUE-APP",
    name: "Movie Queue — App Social Multiplataforma",
    category: "FULL-STACK",
    status: "PUBLICADO [ANDROID & PWA]",
    stack: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "PWA", "Android"],
    summary:
      "Nasceu daquela indecisão clássica na hora de escolher um filme com os amigos. Desenvolvi o app em Flutter e Dart para rodar tanto no Android quanto no navegador como PWA, usando Firebase Authentication e Cloud Firestore para sincronizar escolhas em tempo real.",
    metrics: "Mobile & Web (PWA) • Sincronização em Tempo Real • Cloud BaaS",
    repoUrl: "https://github.com/ferreiraryan/movie-queue",
    liveUrl: "https://movie-queue-c2e96.web.app/",
  },
  {
    id: "akira-ui",
    code: "PRJ_04 // VISUALISIT-ALGO",
    name: "Visualisit — Visualizador de Algoritmos",
    category: "CREATIVE WEB",
    status: "MVP PUBLICADO [ALGORITMOS]",
    stack: ["React", "TypeScript", "Algoritmos", "Estruturas de Dados", "Vite"],
    summary:
      "Um jeito de tirar os conceitos da Ciência da Computação do papel e torná-los visuais. Construí uma aplicação interativa em React e TypeScript que anima passo a passo algoritmos clássicos de ordenação, como Selection Sort e Insertion Sort, facilitando enxergar a lógica acontecendo na tela.",
    metrics: "Ciência da Computação • Lógica Visual Passo a Passo • Interface Reativa",
    repoUrl: "https://github.com/ferreiraryan/visualisit",
    liveUrl: "https://github.com/ferreiraryan/visualisit",
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
    <div className="relative flex min-h-screen w-full flex-col justify-between p-5 sm:p-8 lg:px-12 lg:py-8 bg-[#0D041A] text-fuchsia-100 font-mono overflow-hidden">
      {/* Glow Cyberpunk de fundo */}
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      {/* Header Terminal */}
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/30 pb-3 text-eyebrow uppercase tracking-[0.14em] text-fuchsia-200 select-none">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          03 // Universo Cyberpunk — Terminal de Projetos
        </span>
        <span className="text-cyan-400">SYS_KERNEL: RYAN_OS v4.2 // ROOT_ACCESS</span>
      </header>

      {/* Janela Principal do Terminal */}
      <div className="relative z-10 my-auto max-w-7xl mx-auto w-full py-6">
        <div className="rounded-lg border border-fuchsia-500/40 bg-[#140826]/98 shadow-[0_0_50px_rgba(217,70,239,0.18)] backdrop-blur-md overflow-hidden">
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
                  className={`px-3 py-1.5 rounded text-xs transition border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    filter === cat
                      ? "bg-cyan-400 text-black font-bold border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                      : "bg-fuchsia-950/50 text-fuchsia-200 border-fuchsia-500/30 hover:border-cyan-400/60"
                  }`}
                >
                  [{cat}]
                </button>
              ))}
            </div>
          </div>

          {/* Corpo dividido: Lista de Diretórios + Inspecionar Sistema */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[540px]">
            {/* Coluna Esquerda: Lista de Projetos */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-fuchsia-500/30 p-4 sm:p-5 space-y-2.5">
              <p className="text-xs uppercase tracking-[0.14em] text-[#E9D5FF] mb-3">
                &gt; SELECIONE UM MÓDULO ({filtered.length} ENCONTRADOS):
              </p>
              {filtered.map((proj) => {
                const active = proj.id === activeProject.id;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setSelectedId(proj.id)}
                    className={`w-full text-left p-4 rounded border transition flex flex-col gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                      active
                        ? "bg-fuchsia-500/20 border-cyan-400 text-white shadow-[inset_0_0_18px_rgba(34,211,238,0.2)]"
                        : "bg-black/30 border-fuchsia-500/35 text-fuchsia-100 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-cyan-300">
                      <span>{proj.code}</span>
                      <span>{active ? "◄ ATIVO" : "READY"}</span>
                    </div>
                    <span className="text-base sm:text-lg font-bold tracking-tight">
                      {proj.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coluna Direita: Detalhes do Projeto Ativo */}
            <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between bg-[#0B0314]/90">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-fuchsia-500/20 pb-3">
                  <span className="text-xs text-cyan-400 font-semibold">
                    {activeProject.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs">
                    {activeProject.status}
                  </span>
                </div>

                <h3 className="mt-4 text-[1.75rem] sm:text-4xl font-extrabold text-white tracking-tight">
                  {activeProject.name}
                </h3>

                <p className="mt-4 min-h-[4.5rem] text-base sm:text-[17px] text-[#F3ECFF] leading-relaxed">
                  {activeProject.summary}
                </p>

                {/* Stack Tags */}
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#E9D5FF] mb-2">
                    STACK_LOADED:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-fuchsia-950/80 border border-fuchsia-400/40 text-[13px] text-cyan-100"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Telemetria */}
                <div className="mt-6 p-3.5 rounded bg-black/60 border border-cyan-500/30 text-sm tabular-nums text-cyan-200">
                  <span className="text-[#E9D5FF] font-bold">TELEMETRIA: </span>
                  {activeProject.metrics}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-fuchsia-500/20 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] text-[#E9D5FF]">
                  STATUS: COMPILADO SEM ERROS
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center px-4 py-2 rounded text-[13px] font-bold border border-fuchsia-400/60 text-fuchsia-200 hover:bg-fuchsia-500/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    &gt; VER_CÓDIGO (GITHUB)
                  </a>
                  <a
                    href={activeProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-10 items-center px-4 py-2 rounded text-[13px] font-bold bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.5)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    &gt; EXECUTAR_DEMO ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionScrollPrompt targetWorld={4} text="ROLE PARA AS HABILIDADES" />

      <footer className="relative z-10 flex items-center justify-between text-eyebrow uppercase tracking-[0.14em] text-fuchsia-300 select-none">
        <span>MEM: 64GB NEURAL RAM</span>
        <span>03 / 06</span>
      </footer>
    </div>
  );
}
