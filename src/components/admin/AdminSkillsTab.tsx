"use client";

import { useState } from "react";
import type { SkillTrees, SkillNode, AttributeNode } from "@/types/github";

interface SkillsData {
  skillTrees: SkillTrees;
  baseAttributes: AttributeNode[];
  totalCommitsAll?: number;
  totalRepos?: number;
}

interface AdminSkillsTabProps {
  skills: SkillsData;
  onChange: (skills: SkillsData) => void;
}

export default function AdminSkillsTab({ skills, onChange }: AdminSkillsTabProps) {
  const categories = Object.keys(skills.skillTrees || {});
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "");
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);

  const handleUpdateSkill = (
    cat: string,
    index: number,
    field: keyof SkillNode,
    value: string | number
  ) => {
    const newTrees = { ...skills.skillTrees };
    const list = [...(newTrees[cat] || [])];
    list[index] = { ...list[index], [field]: value };
    newTrees[cat] = list;
    onChange({ ...skills, skillTrees: newTrees });
  };

  const handleAddSkill = (cat: string) => {
    const newTrees = { ...skills.skillTrees };
    const list = [...(newTrees[cat] || [])];
    list.push({
      name: "Nova Habilidade Arcano",
      level: 90,
      rank: "MESTRE [S]",
      manaCost: "15 MP",
      desc: "Descrição da habilidade, frameworks e aplicações de engenharia de software.",
    });
    newTrees[cat] = list;
    onChange({ ...skills, skillTrees: newTrees });
  };

  const handleRemoveSkill = (cat: string, index: number) => {
    if (!confirm("Deseja realmente remover esta habilidade?")) return;
    const newTrees = { ...skills.skillTrees };
    const list = (newTrees[cat] || []).filter((_, i) => i !== index);
    newTrees[cat] = list;
    onChange({ ...skills, skillTrees: newTrees });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;

    const newTrees = { ...skills.skillTrees };
    if (!newTrees[name]) {
      newTrees[name] = [
        {
          name: "Primeira Habilidade",
          level: 90,
          rank: "VETERANO [A+]",
          manaCost: "20 MP",
          desc: "Descrição das competências técnicas.",
        },
      ];
      onChange({ ...skills, skillTrees: newTrees });
      setActiveCategory(name);
      setNewCatName("");
      setShowAddCat(false);
    }
  };

  const handleRemoveCategory = (cat: string) => {
    if (!confirm(`Remover todo o Grimório "${cat}" e suas habilidades?`)) return;
    const newTrees = { ...skills.skillTrees };
    delete newTrees[cat];
    const remainingCats = Object.keys(newTrees);
    onChange({ ...skills, skillTrees: newTrees });
    setActiveCategory(remainingCats[0] || "");
  };

  const handleUpdateAttribute = (index: number, field: keyof AttributeNode, value: string | number) => {
    const attrs = [...(skills.baseAttributes || [])];
    attrs[index] = { ...attrs[index], [field]: value };
    onChange({ ...skills, baseAttributes: attrs });
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Seção 1: Atributos Base RPG */}
      <div className="bg-[#1C120B] p-5 sm:p-6 rounded-xl border-2 border-amber-600/50 shadow-lg">
        <div className="flex items-center justify-between border-b border-amber-600/30 pb-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-amber-200">
              ⚔️ Atributos Primários de Personagem (RPG)
            </h3>
            <p className="text-xs text-amber-300/70">
              Valores base exibidos na ficha da guilda (INT, DEX, WIS, CHA).
            </p>
          </div>
          <span className="text-xs text-amber-400 font-bold">NÍVEL 99</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(skills.baseAttributes || []).map((attr, idx) => (
            <div
              key={attr.code}
              className="bg-black/50 border border-amber-600/40 p-3.5 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400">[{attr.code}]</span>
                <span className="text-amber-300 font-extrabold">{attr.val}/100</span>
              </div>

              <input
                type="text"
                value={attr.name}
                onChange={(e) => handleUpdateAttribute(idx, "name", e.target.value)}
                className="w-full rounded bg-black/60 border border-amber-600/30 px-2 py-1 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
              />

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={50}
                  max={100}
                  value={attr.val}
                  onChange={(e) => handleUpdateAttribute(idx, "val", Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seção 2: Grimórios de Habilidades */}
      <div className="bg-[#1C120B] p-5 sm:p-6 rounded-xl border-2 border-amber-600/50 shadow-lg space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-600/30 pb-4">
          <div>
            <h3 className="text-base font-bold text-amber-200">
              📜 Grimórios de Habilidades
            </h3>
            <p className="text-xs text-amber-300/70">
              Gerencie as árvores de skills e magias técnicas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddCat(!showAddCat)}
              className="px-3 py-1.5 rounded bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            >
              {showAddCat ? "Cancelar" : "+ Novo Grimório"}
            </button>
          </div>
        </div>

        {/* Modal de Criação de Grimório */}
        {showAddCat && (
          <form
            onSubmit={handleAddCategory}
            className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-amber-500/40"
          >
            <input
              type="text"
              placeholder="Nome do Grimório (ex: Artes Arcanas Cloud)..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              required
              className="flex-1 rounded bg-black/70 border border-amber-500/30 px-3 py-1.5 text-xs text-amber-100 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-amber-400 text-black text-xs font-bold hover:bg-amber-300"
            >
              Criar Grimório
            </button>
          </form>
        )}

        {/* Abas de Grimórios */}
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-600/20 pb-3">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition border ${
                  activeCategory === cat
                    ? "bg-amber-500 text-black border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "bg-black/40 text-amber-200 border-amber-700/40 hover:bg-amber-950/40"
                }`}
              >
                {cat} ({(skills.skillTrees[cat] || []).length})
              </button>
              {categories.length > 1 && (
                <button
                  type="button"
                  title="Excluir Grimório"
                  onClick={() => handleRemoveCategory(cat)}
                  className="px-1.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Lista de Skills do Grimório Ativo */}
        {activeCategory && skills.skillTrees[activeCategory] && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase tracking-wider text-amber-400">
                Habilidades em [{activeCategory}]:
              </h4>
              <button
                type="button"
                onClick={() => handleAddSkill(activeCategory)}
                className="px-3 py-1 rounded bg-amber-600/40 text-amber-200 border border-amber-500/50 hover:bg-amber-600/60 text-xs font-bold transition"
              >
                + Nova Habilidade
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {skills.skillTrees[activeCategory].map((skill, sIdx) => (
                <div
                  key={sIdx}
                  className="bg-black/40 border border-amber-600/30 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) =>
                        handleUpdateSkill(activeCategory, sIdx, "name", e.target.value)
                      }
                      placeholder="Nome da Skill"
                      className="flex-1 rounded bg-black/60 border border-amber-600/30 px-2.5 py-1.5 text-xs text-amber-100 font-bold focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(activeCategory, sIdx)}
                      className="px-2 py-1 rounded bg-rose-950/40 text-rose-400 border border-rose-800/40 hover:bg-rose-900/60 text-xs"
                    >
                      Excluir
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-amber-400 uppercase mb-1">
                        Rank RPG:
                      </label>
                      <input
                        type="text"
                        value={skill.rank}
                        onChange={(e) =>
                          handleUpdateSkill(activeCategory, sIdx, "rank", e.target.value)
                        }
                        placeholder="MESTRE [S+]"
                        className="w-full rounded bg-black/60 border border-amber-600/30 px-2 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-amber-400 uppercase mb-1">
                        Custo de Mana:
                      </label>
                      <input
                        type="text"
                        value={skill.manaCost}
                        onChange={(e) =>
                          handleUpdateSkill(activeCategory, sIdx, "manaCost", e.target.value)
                        }
                        placeholder="15 MP ou Passiva"
                        className="w-full rounded bg-black/60 border border-amber-600/30 px-2 py-1 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[10px] text-amber-400 uppercase">
                        Nível de Maestria:
                      </span>
                      <span className="text-amber-300 font-bold">{skill.level}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={skill.level}
                        onChange={(e) =>
                          handleUpdateSkill(activeCategory, sIdx, "level", Number(e.target.value))
                        }
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-amber-400 uppercase mb-1">
                      Descrição / Lore Técnica:
                    </label>
                    <textarea
                      rows={2}
                      value={skill.desc}
                      onChange={(e) =>
                        handleUpdateSkill(activeCategory, sIdx, "desc", e.target.value)
                      }
                      className="w-full rounded bg-black/60 border border-amber-600/30 px-2.5 py-1.5 text-xs text-amber-200/90 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
