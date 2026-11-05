"use client";

import { useState } from "react";
import type { ProjectItem, OverridesConfig } from "@/types/github";

interface AdminProjectsTabProps {
  projects: ProjectItem[];
  overrides: OverridesConfig;
  onChange: (projects: ProjectItem[], overrides: OverridesConfig) => void;
}

export default function AdminProjectsTab({
  projects,
  overrides,
  onChange,
}: AdminProjectsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // Formulário para criação/edição
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<ProjectItem["category"]>("FULL-STACK");
  const [formStatus, setFormStatus] = useState("ONLINE [PROD]");
  const [formSummary, setFormSummary] = useState("");
  const [formStack, setFormStack] = useState("");
  const [formLiveUrl, setFormLiveUrl] = useState("");
  const [formRepoUrl, setFormRepoUrl] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);

  const excludedSet = new Set(overrides.excludedRepos || []);

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject(proj);
    setFormName(proj.name);
    setFormCategory(proj.category);
    setFormStatus(proj.status);
    setFormSummary(proj.summary);
    setFormStack(proj.stack.join(", "));
    setFormLiveUrl(proj.liveUrl || "");
    setFormRepoUrl(proj.repoUrl || "");
    setFormFeatured(Boolean(proj.featured));
    setIsCreatingManual(false);
  };

  const openCreateModal = () => {
    setIsCreatingManual(true);
    setEditingProject(null);
    setFormName("");
    setFormCategory("FULL-STACK");
    setFormStatus("EM PRODUÇÃO [PRIVADO]");
    setFormSummary("");
    setFormStack("TypeScript, Next.js, Node.js");
    setFormLiveUrl("");
    setFormRepoUrl("");
    setFormFeatured(false);
  };

  const toggleFeatured = (proj: ProjectItem) => {
    const nextFeatured = !proj.featured;
    const repoKey = proj.id;

    // Atualiza overrides
    const newOverrides = { ...overrides };
    newOverrides.overrides = newOverrides.overrides || {};
    newOverrides.overrides[repoKey] = {
      ...(newOverrides.overrides[repoKey] || {}),
      featured: nextFeatured,
    };

    // Atualiza projects
    const nextProjects = projects.map((p) =>
      p.id === proj.id ? { ...p, featured: nextFeatured } : p
    );

    onChange(nextProjects, newOverrides);
  };

  const toggleVisibility = (proj: ProjectItem) => {
    const isExcluded = excludedSet.has(proj.id) || excludedSet.has(proj.name);
    const newExcluded = isExcluded
      ? (overrides.excludedRepos || []).filter((r) => r !== proj.id && r !== proj.name)
      : [...(overrides.excludedRepos || []), proj.id];

    const newOverrides: OverridesConfig = {
      ...overrides,
      excludedRepos: newExcluded,
    };

    onChange(projects, newOverrides);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    const stackArray = formStack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (isCreatingManual) {
      // Criar projeto manual
      const newId = `manual_${Date.now()}`;
      const codeIndex = (projects.length + 1).toString().padStart(2, "0");
      const newProj: ProjectItem = {
        id: newId,
        code: `PRJ_${codeIndex} // ${formName.toUpperCase().replace(/[-_ ]+/g, "_").slice(0, 20)}`,
        name: formName,
        category: formCategory,
        status: formStatus,
        stack: stackArray,
        summary: formSummary,
        metrics: `PROJETO MANUAL • 0 BUGS CRÍTICOS`,
        repoUrl: formRepoUrl || "#",
        liveUrl: formLiveUrl || "",
        commitCount: 1,
        stars: 0,
        pushedAt: new Date().toISOString(),
        featured: formFeatured,
        isManual: true,
      };

      const newOverrides: OverridesConfig = {
        ...overrides,
        manualProjects: [...(overrides.manualProjects || []), newProj],
      };

      onChange([newProj, ...projects], newOverrides);
    } else if (editingProject) {
      // Atualizar projeto existente
      const repoKey = editingProject.id;
      const newOverrides: OverridesConfig = {
        ...overrides,
        overrides: {
          ...(overrides.overrides || {}),
          [repoKey]: {
            ...(overrides.overrides?.[repoKey] || {}),
            name: formName,
            category: formCategory,
            status: formStatus,
            summary: formSummary,
            stack: stackArray,
            liveUrl: formLiveUrl,
            featured: formFeatured,
          },
        },
      };

      const nextProjects = projects.map((p) => {
        if (p.id === editingProject.id) {
          return {
            ...p,
            name: formName,
            category: formCategory,
            status: formStatus,
            summary: formSummary,
            stack: stackArray,
            liveUrl: formLiveUrl,
            featured: formFeatured,
          };
        }
        return p;
      });

      onChange(nextProjects, newOverrides);
    }

    setEditingProject(null);
    setIsCreatingManual(false);
  };

  const handleDeleteManual = (proj: ProjectItem) => {
    if (!confirm(`Deseja realmente remover o projeto manual "${proj.name}"?`)) return;

    const nextProjects = projects.filter((p) => p.id !== proj.id);
    const newOverrides: OverridesConfig = {
      ...overrides,
      manualProjects: (overrides.manualProjects || []).filter((p) => p.id !== proj.id),
    };

    onChange(nextProjects, newOverrides);
  };

  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.stack.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === "FEATURED") return proj.featured;
    if (filterCategory === "EXCLUDED") return excludedSet.has(proj.id) || excludedSet.has(proj.name);
    if (filterCategory === "VISIBLE") return !excludedSet.has(proj.id) && !excludedSet.has(proj.name);
    if (filterCategory !== "ALL") return proj.category === filterCategory;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Barra de Ações Superiores */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#140826] p-4 rounded-xl border border-fuchsia-500/30">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por nome, stack ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-xs text-white placeholder-fuchsia-300/40 focus:border-cyan-400 focus:outline-none w-64"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-xs text-cyan-300 focus:border-cyan-400 focus:outline-none"
          >
            <option value="ALL">Todas Categorias</option>
            <option value="FEATURED">★ Apenas Destaques</option>
            <option value="VISIBLE">👁️ Apenas Visíveis</option>
            <option value="EXCLUDED">🚫 Apenas Ocultos</option>
            <option value="FULL-STACK">FULL-STACK</option>
            <option value="CREATIVE WEB">CREATIVE WEB</option>
            <option value="AI & ENGINE">AI & ENGINE</option>
            <option value="EXPERIMENTS">EXPERIMENTS</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        >
          <span>+</span> Novo Projeto Manual / Privado
        </button>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((proj) => {
          const isExcluded = excludedSet.has(proj.id) || excludedSet.has(proj.name);

          return (
            <div
              key={proj.id}
              className={`flex flex-col justify-between p-4 rounded-xl border transition ${
                isExcluded
                  ? "bg-black/30 border-rose-900/40 opacity-60"
                  : proj.featured
                  ? "bg-[#180A2E] border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
                  : "bg-[#120722] border-fuchsia-500/25 hover:border-fuchsia-400/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-cyan-400 font-mono font-bold truncate max-w-[140px]">
                    {proj.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* Botão Toggle Destaque */}
                    <button
                      type="button"
                      title={proj.featured ? "Remover dos destaques" : "Marcar como destaque"}
                      onClick={() => toggleFeatured(proj)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition border ${
                        proj.featured
                          ? "bg-amber-400 text-black border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                          : "bg-black/40 text-neutral-400 border-neutral-700 hover:text-amber-300 hover:border-amber-400"
                      }`}
                    >
                      {proj.featured ? "★ DESTAQUE" : "☆ DESTACAR"}
                    </button>

                    {/* Botão Toggle Visibilidade */}
                    <button
                      type="button"
                      title={isExcluded ? "Tornar Visível" : "Ocultar do Portfólio"}
                      onClick={() => toggleVisibility(proj)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition border ${
                        isExcluded
                          ? "bg-rose-950 text-rose-300 border-rose-700"
                          : "bg-emerald-950 text-emerald-300 border-emerald-700"
                      }`}
                    >
                      {isExcluded ? "🚫 OCULTO" : "👁️ ATIVO"}
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {proj.name}
                </h3>

                <p className="mt-2 text-xs text-fuchsia-100/75 line-clamp-2 leading-relaxed">
                  {proj.summary}
                </p>

                {/* Stack Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {proj.stack.slice(0, 4).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded bg-fuchsia-950/80 border border-fuchsia-500/30 text-[10px] text-cyan-200"
                    >
                      #{tech}
                    </span>
                  ))}
                  {proj.stack.length > 4 && (
                    <span className="text-[10px] text-fuchsia-400 self-center">
                      +{proj.stack.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className="mt-4 pt-3 border-t border-fuchsia-500/15 flex items-center justify-between text-[11px]">
                <div className="text-cyan-300 font-mono">
                  <span>{proj.commitCount} commits</span>
                  {proj.isManual && (
                    <span className="ml-1 text-[9px] text-amber-400">[MANUAL]</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(proj)}
                    className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-200 border border-fuchsia-500/40 hover:bg-fuchsia-500/30 text-xs font-semibold transition"
                  >
                    Editar ✎
                  </button>

                  {proj.isManual && (
                    <button
                      type="button"
                      onClick={() => handleDeleteManual(proj)}
                      className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-xs transition"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-fuchsia-500/30 rounded-xl bg-black/20 text-fuchsia-300/70 text-xs">
          Nenhum projeto encontrado com os filtros selecionados.
        </div>
      )}

      {/* Modal de Criação / Edição */}
      {(editingProject || isCreatingManual) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-xl border border-fuchsia-500/40 bg-[#120722] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{isCreatingManual ? "➕ Novo Projeto Manual / Privado" : "✎ Editar Projeto"}</span>
                {editingProject && (
                  <span className="text-xs text-cyan-400 font-mono font-normal">
                    ({editingProject.code})
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingProject(null);
                  setIsCreatingManual(false);
                }}
                className="text-fuchsia-400 hover:text-white text-sm"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    Nome do Projeto:
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    Categoria Cyberpunk:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProjectItem["category"])}
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="FULL-STACK">FULL-STACK</option>
                    <option value="CREATIVE WEB">CREATIVE WEB</option>
                    <option value="AI & ENGINE">AI & ENGINE</option>
                    <option value="EXPERIMENTS">EXPERIMENTS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                  Resumo / Descrição:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    Stack (separadas por vírgula):
                  </label>
                  <input
                    type="text"
                    value={formStack}
                    onChange={(e) => setFormStack(e.target.value)}
                    placeholder="Next.js, TypeScript, Tailwind"
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    Status do Terminal:
                  </label>
                  <input
                    type="text"
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    placeholder="ONLINE [PROD] ou STABLE BUILD"
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    URL da Demo / Live URL (opcional):
                  </label>
                  <input
                    type="url"
                    value={formLiveUrl}
                    onChange={(e) => setFormLiveUrl(e.target.value)}
                    placeholder="https://sua-demo.vercel.app"
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1">
                    URL do Repositório GitHub (opcional):
                  </label>
                  <input
                    type="text"
                    value={formRepoUrl}
                    onChange={(e) => setFormRepoUrl(e.target.value)}
                    placeholder="https://github.com/usuario/repo ou deixe vazio"
                    className="w-full rounded-lg border border-fuchsia-500/30 bg-black/60 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-fuchsia-500 text-cyan-400 focus:ring-cyan-400"
                />
                <label htmlFor="featuredToggle" className="text-xs text-amber-300 font-bold cursor-pointer">
                  ★ Marcar como Projeto em Destaque
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-fuchsia-500/20">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject(null);
                    setIsCreatingManual(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-fuchsia-500/30 text-fuchsia-300 text-xs hover:bg-fuchsia-950/40 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
