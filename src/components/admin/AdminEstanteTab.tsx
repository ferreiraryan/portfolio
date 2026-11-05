"use client";

import { useState } from "react";
import type { MangaVolume } from "@/types/github";

interface AdminEstanteTabProps {
  estante: MangaVolume[];
  onChange: (estante: MangaVolume[]) => void;
}

const PRESET_ACCENTS = [
  { label: "Vermelho Carmim", value: "bg-red-700 text-white" },
  { label: "Preto & Âmbar", value: "bg-neutral-900 text-amber-400" },
  { label: "Rosa Neon", value: "bg-rose-600 text-white" },
  { label: "Índigo & Amarelo", value: "bg-indigo-700 text-yellow-300" },
  { label: "Verde Esmeralda", value: "bg-emerald-800 text-white" },
  { label: "Roxo Cyber", value: "bg-purple-800 text-cyan-300" },
];

export default function AdminEstanteTab({ estante, onChange }: AdminEstanteTabProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleUpdate = (index: number, field: keyof MangaVolume, value: string) => {
    const nextList = [...estante];
    nextList[index] = { ...nextList[index], [field]: value };
    onChange(nextList);
  };

  const handleAddVolume = () => {
    const nextVolNumber = (estante.length + 1).toString().padStart(2, "0");
    const newVolume: MangaVolume = {
      id: `vol_${Date.now()}`,
      vol: `VOL. ${nextVolNumber}`,
      title: "Nova Obra Literária",
      jpTitle: "タイトル",
      author: "Autor / Mangaká",
      accent: "bg-neutral-900 text-white",
      quote: "“Uma citação marcante sobre arte, código ou universo.”",
      review: "Análise crítica pessoal sobre o impacto criativo e conceitual desta obra.",
    };
    onChange([...estante, newVolume]);
    setEditingIndex(estante.length);
  };

  const handleRemoveVolume = (index: number) => {
    if (!confirm(`Remover "${estante[index].title}" da estante?`)) return;
    const nextList = estante.filter((_, i) => i !== index);
    onChange(nextList);
    if (editingIndex === index) setEditingIndex(null);
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#E5DEC9] p-4 rounded-xl border-4 border-black text-black shadow-[6px_6px_0px_#000]">
        <div>
          <h3 className="text-base font-black uppercase">
            📚 A Estante de Mangás &amp; Quadrinhos (Mundo 05)
          </h3>
          <p className="text-xs font-bold text-neutral-700">
            Gerencie as obras analógicas que inspiram a direção de arte do portfólio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVolume}
          className="px-4 py-2 bg-yellow-300 border-2 border-black font-black text-xs uppercase shadow-[4px_4px_0px_#000] hover:-translate-y-0.5 transition"
        >
          + Adicionar Nova Edição
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {estante.map((item, idx) => {
          return (
            <div
              key={item.id || idx}
              className="bg-white border-4 border-black p-5 shadow-[8px_8px_0px_#000] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold">
                    {item.vol}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-600">
                      {item.jpTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVolume(idx)}
                      className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold border border-black hover:bg-rose-600"
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Título da Obra:
                    </label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                      className="w-full border-2 border-black px-2 py-1 text-xs font-bold text-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Autor / Criador:
                    </label>
                    <input
                      type="text"
                      value={item.author}
                      onChange={(e) => handleUpdate(idx, "author", e.target.value)}
                      className="w-full border-2 border-black px-2 py-1 text-xs text-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Título em Japonês / Kanji:
                    </label>
                    <input
                      type="text"
                      value={item.jpTitle}
                      onChange={(e) => handleUpdate(idx, "jpTitle", e.target.value)}
                      className="w-full border-2 border-black px-2 py-1 text-xs text-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                      Paleta de Cor (Capa):
                    </label>
                    <select
                      value={item.accent}
                      onChange={(e) => handleUpdate(idx, "accent", e.target.value)}
                      className="w-full border-2 border-black px-2 py-1 text-xs text-black bg-white focus:outline-none font-bold"
                    >
                      {PRESET_ACCENTS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                    Citação Notável:
                  </label>
                  <input
                    type="text"
                    value={item.quote}
                    onChange={(e) => handleUpdate(idx, "quote", e.target.value)}
                    className="w-full border-2 border-black px-2 py-1 text-xs font-serif italic text-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-600 mb-1">
                    Análise Crítica &amp; Resenha:
                  </label>
                  <textarea
                    rows={3}
                    value={item.review}
                    onChange={(e) => handleUpdate(idx, "review", e.target.value)}
                    className="w-full border-2 border-black px-2 py-1 text-xs text-black focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Preview da Capa */}
              <div className="pt-2 border-t-2 border-dashed border-black">
                <span className="text-[10px] font-bold uppercase text-neutral-500 mb-1 block">
                  Preview do Card na Prateleira:
                </span>
                <div
                  className={`p-3 border-2 border-black flex items-center justify-between text-xs font-bold ${item.accent}`}
                >
                  <span>{item.vol} • {item.title}</span>
                  <span>{item.jpTitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
