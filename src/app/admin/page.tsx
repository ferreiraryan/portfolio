"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminLoginModal from "@/components/admin/AdminLoginModal";
import AdminProjectsTab from "@/components/admin/AdminProjectsTab";
import AdminSkillsTab from "@/components/admin/AdminSkillsTab";
import AdminEstanteTab from "@/components/admin/AdminEstanteTab";
import AdminChaptersTab from "@/components/admin/AdminChaptersTab";
import AdminLivrosTab from "@/components/admin/AdminLivrosTab";
import type {
  ProjectItem,
  OverridesConfig,
  MangaVolume,
  ChapterItem,
  SkillTrees,
  AttributeNode,
} from "@/types/github";
import type { ReadingBook } from "@/types/books";

interface SkillsData {
  skillTrees: SkillTrees;
  baseAttributes: AttributeNode[];
  totalCommitsAll?: number;
  totalRepos?: number;
}

type TabType = "PROJECTS" | "SKILLS" | "ESTANTE" | "CHAPTERS" | "LIVROS";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("PROJECTS");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Estados dos dados
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [overrides, setOverrides] = useState<OverridesConfig>({
    excludedRepos: [],
    overrides: {},
    manualProjects: [],
  });
  const [skills, setSkills] = useState<SkillsData>({
    skillTrees: {},
    baseAttributes: [],
  });
  const [estante, setEstante] = useState<MangaVolume[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [livros, setLivros] = useState<ReadingBook[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.ok) {
        const d = await res.json();
        setProjects(d.projects || []);
        setOverrides(d.overrides || { excludedRepos: [], overrides: {}, manualProjects: [] });
        setSkills(d.skills || { skillTrees: {}, baseAttributes: [] });
        setEstante(d.estante || []);
        setChapters(d.chapters || []);
        setLivros(d.livros || []);
        setHasUnsavedChanges(false);
      }
    } catch {
      showToast("Erro ao carregar dados do servidor.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initAuth() {
      try {
        const res = await fetch("/api/admin/auth");
        const d = await res.json();
        if (!active) return;
        setAuthenticated(Boolean(d.authenticated));

        if (d.authenticated) {
          const dataRes = await fetch("/api/admin/data");
          if (!active) return;
          if (dataRes.ok) {
            const data = await dataRes.json();
            setProjects(data.projects || []);
            setOverrides(data.overrides || { excludedRepos: [], overrides: {}, manualProjects: [] });
            setSkills(data.skills || { skillTrees: {}, baseAttributes: [] });
            setEstante(data.estante || []);
            setChapters(data.chapters || []);
            setLivros(data.livros || []);
            setHasUnsavedChanges(false);
          }
        }
      } catch {
        if (active) setAuthenticated(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    initAuth();

    return () => {
      active = false;
    };
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projects,
          overrides,
          skills,
          estante,
          chapters,
          livros,
        }),
      });

      const d = await res.json();
      if (res.ok && d.ok) {
        setHasUnsavedChanges(false);
        showToast("Alterações salvas com sucesso em todos os mundos!");
      } else {
        showToast(d.error || "Erro ao salvar alterações.", "error");
      }
    } catch {
      showToast("Falha na conexão ao tentar salvar.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncGithub = async () => {
    if (syncing) return;
    setSyncing(true);
    showToast("Disparando sincronização com a API do GitHub...");

    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const d = await res.json();
      if (res.ok && d.ok) {
        showToast("Sincronização com GitHub concluída com sucesso!");
        await loadData();
      } else {
        showToast(d.error || "Erro ao sincronizar com GitHub.", "error");
      }
    } catch {
      showToast("Falha na chamada de sincronização.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
  };

  // Se ainda estiver checando auth
  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050508] text-cyan-400 font-mono text-sm">
        <span className="animate-pulse">CARREGANDO_SUBSISTEMA // ACESSANDO KERNEL...</span>
      </div>
    );
  }

  // Se não estiver autenticado
  if (!authenticated) {
    return (
      <AdminLoginModal
        onSuccess={async () => {
          setAuthenticated(true);
          await loadData();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#07030F] text-fuchsia-100 font-mono select-none flex flex-col justify-between">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              : "bg-rose-950/90 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
          }`}
        >
          <span>{toast.type === "success" ? "✓" : "⚠"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Central de Controle */}
      <header className="sticky top-0 z-40 bg-[#0E061A]/95 border-b border-fuchsia-500/30 backdrop-blur-md px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <h1 className="text-sm font-extrabold tracking-widest uppercase text-white flex items-center gap-2">
              <span>RYAN_OS // PAINEL DE CONTROLE</span>
              <span className="text-[10px] text-cyan-400 font-normal px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40">
                ROOT_ACCESS
              </span>
            </h1>
            <p className="text-[10px] text-fuchsia-300/60 hidden sm:block">
              Gerencie projetos, destaques, grimórios RPG, estante e capítulos literários.
            </p>
          </div>
        </div>

        {/* Botões de Ação do Topo */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {hasUnsavedChanges && (
            <span className="text-[10px] text-amber-300 animate-pulse font-bold">
              ● ALTERAÇÕES PENDENTES
            </span>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveAll}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-bounce"
                : "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]"
            } disabled:opacity-50`}
          >
            <span>💾</span>
            <span>{saving ? "GRAVANDO..." : "SALVAR TUDO"}</span>
          </button>

          <button
            type="button"
            disabled={syncing}
            onClick={handleSyncGithub}
            className="px-3.5 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <span className={syncing ? "animate-spin" : ""}>🔄</span>
            <span>{syncing ? "SINCRONIZANDO..." : "SINCRONIZAR GITHUB"}</span>
          </button>

          <Link
            href="/livros"
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-emerald-950/80 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-900/60 text-xs font-semibold transition"
          >
            Ver /livros ↗
          </Link>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded-lg bg-fuchsia-950/80 text-fuchsia-200 border border-fuchsia-500/40 hover:bg-fuchsia-900/60 text-xs font-semibold transition"
          >
            Ver Portfólio ↗
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 text-xs transition"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* Barra de Abas */}
        <div className="flex flex-wrap items-center gap-2 border-b border-fuchsia-500/20 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("PROJECTS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "PROJECTS"
                ? "bg-cyan-400 text-black border-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                : "bg-[#140826] text-fuchsia-300 border-fuchsia-500/30 hover:border-cyan-400/50"
            }`}
          >
            <span>🚀</span>
            <span>Mundo 03: Projetos &amp; Destaques ({projects.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("SKILLS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "SKILLS"
                ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]"
                : "bg-[#140826] text-fuchsia-300 border-fuchsia-500/30 hover:border-amber-400/50"
            }`}
          >
            <span>🧙</span>
            <span>Mundo 04: Skills &amp; Grimórios RPG</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ESTANTE")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "ESTANTE"
                ? "bg-yellow-300 text-black border-black shadow-[0_0_15px_rgba(253,224,71,0.5)]"
                : "bg-[#140826] text-fuchsia-300 border-fuchsia-500/30 hover:border-yellow-300/50"
            }`}
          >
            <span>📚</span>
            <span>Mundo 05: Estante de Mangás ({estante.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("CHAPTERS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "CHAPTERS"
                ? "bg-stone-300 text-black border-stone-400 shadow-[0_0_15px_rgba(214,211,205,0.5)]"
                : "bg-[#140826] text-fuchsia-300 border-fuchsia-500/30 hover:border-stone-400/50"
            }`}
          >
            <span>📖</span>
            <span>Mundo 02: Capítulos do Livro ({chapters.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("LIVROS")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              activeTab === "LIVROS"
                ? "bg-emerald-400 text-black border-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                : "bg-[#140826] text-emerald-300 border-emerald-500/30 hover:border-emerald-400/50"
            }`}
          >
            <span>📱</span>
            <span>CrossPoint: Leituras &amp; E-reader ({livros.length})</span>
          </button>
        </div>

        {/* Renderização da Aba Ativa */}
        {loading ? (
          <div className="py-24 text-center text-cyan-400">
            <span className="animate-pulse">CARREGANDO DADOS DO SERVIDOR...</span>
          </div>
        ) : (
          <div>
            {activeTab === "PROJECTS" && (
              <AdminProjectsTab
                projects={projects}
                overrides={overrides}
                onChange={(nextProjects, nextOverrides) => {
                  setProjects(nextProjects);
                  setOverrides(nextOverrides);
                  setHasUnsavedChanges(true);
                }}
              />
            )}

            {activeTab === "SKILLS" && (
              <AdminSkillsTab
                skills={skills}
                onChange={(nextSkills) => {
                  setSkills(nextSkills);
                  setHasUnsavedChanges(true);
                }}
              />
            )}

            {activeTab === "ESTANTE" && (
              <AdminEstanteTab
                estante={estante}
                onChange={(nextEstante) => {
                  setEstante(nextEstante);
                  setHasUnsavedChanges(true);
                }}
              />
            )}

            {activeTab === "CHAPTERS" && (
              <AdminChaptersTab
                chapters={chapters}
                onChange={(nextChapters) => {
                  setChapters(nextChapters);
                  setHasUnsavedChanges(true);
                }}
              />
            )}

            {activeTab === "LIVROS" && (
              <AdminLivrosTab
                livros={livros}
                onChange={(nextLivros) => {
                  setLivros(nextLivros);
                  setHasUnsavedChanges(true);
                }}
                showToast={showToast}
              />
            )}
          </div>
        )}
      </main>

      {/* Rodapé do Painel */}
      <footer className="border-t border-fuchsia-500/20 bg-[#0E061A]/80 px-6 py-4 text-[11px] text-fuchsia-400/70 flex flex-wrap items-center justify-between gap-3">
        <span>SISTEMA: RYAN_CONTROL_PANEL v2.5 // AUTENTICADO</span>
        <span>MODO OFFLINE-FIRST: GRAVAÇÕES DIRETAS EM ARQUIVOS JSON</span>
        <span>2026 • TODOS OS MUNDOS SINCRONIZADOS</span>
      </footer>
    </div>
  );
}
