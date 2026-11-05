"use client";

import type { ChapterItem } from "@/types/github";

interface AdminChaptersTabProps {
  chapters: ChapterItem[];
  onChange: (chapters: ChapterItem[]) => void;
}

export default function AdminChaptersTab({
  chapters,
  onChange,
}: AdminChaptersTabProps) {
  const handleUpdate = (index: number, field: keyof ChapterItem, value: string) => {
    const nextList = [...chapters];
    nextList[index] = { ...nextList[index], [field]: value };
    onChange(nextList);
  };

  const handleAddChapter = () => {
    const nextNum = chapters.length + 1;
    const roman = ["I", "II", "III", "IV", "V", "VI"][chapters.length] || String(nextNum);
    const newChapter: ChapterItem = {
      number: `Capítulo ${roman}`,
      title: "Novo Capítulo Narrativo",
      quote: "“Uma frase marcante sobre jornada e código.”",
      dropCap: "E",
      body: "ste novo capítulo expande a narrativa do livro biográfico...",
      marginNote: `Nota de Margem #0${nextNum} — Reflexão técnica.`,
      metaLeft: "Engenharia & Arte",
      metaRight: `Pág. ${nextNum * 2} — ${nextNum * 2 + 1}`,
    };
    onChange([...chapters, newChapter]);
  };

  const handleRemoveChapter = (index: number) => {
    if (chapters.length <= 1) {
      alert("O livro precisa ter pelo menos um capítulo.");
      return;
    }
    if (!confirm(`Remover "${chapters[index].title}"?`)) return;
    onChange(chapters.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 font-serif">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#D6D3CD] p-5 rounded-xl border border-stone-400 text-stone-900 shadow-sm font-sans">
        <div>
          <h3 className="text-base font-bold">
            📖 Capítulos do Livro Biográfico (Mundo 02 // Sobre)
          </h3>
          <p className="text-xs text-stone-700">
            Edite a narrativa em páginas duplas que se desdobra na transição do rasgo de papel.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddChapter}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg font-mono text-xs font-bold hover:bg-stone-800 transition"
        >
          + Adicionar Capítulo
        </button>
      </div>

      <div className="space-y-6">
        {chapters.map((chap, idx) => (
          <div
            key={idx}
            className="bg-[#EAE6DF] border-2 border-stone-300 rounded-xl p-6 shadow-md text-stone-900 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-300 pb-3 font-sans">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-600 bg-stone-200 px-2 py-0.5 rounded">
                  {chap.number}
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Folha #{idx + 1}
                </span>
              </div>

              {chapters.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveChapter(idx)}
                  className="px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 text-xs font-mono font-bold transition"
                >
                  Excluir Capítulo
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Número do Capítulo:
                </label>
                <input
                  type="text"
                  value={chap.number}
                  onChange={(e) => handleUpdate(idx, "number", e.target.value)}
                  className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Título do Capítulo:
                </label>
                <input
                  type="text"
                  value={chap.title}
                  onChange={(e) => handleUpdate(idx, "title", e.target.value)}
                  className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-stone-900 font-bold focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Letra Capitular (DropCap):
                </label>
                <input
                  type="text"
                  maxLength={1}
                  value={chap.dropCap}
                  onChange={(e) => handleUpdate(idx, "dropCap", e.target.value)}
                  className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-center font-serif text-lg font-bold text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-stone-700 mb-1">
                Citação do Capítulo:
              </label>
              <input
                type="text"
                value={chap.quote}
                onChange={(e) => handleUpdate(idx, "quote", e.target.value)}
                className="w-full rounded border border-stone-300 bg-white px-3 py-1.5 font-serif italic text-sm text-stone-900 focus:outline-none focus:border-stone-600"
              />
            </div>

            <div>
              <label className="block font-sans text-xs font-bold text-stone-700 mb-1">
                Corpo do Texto (após a Letra Capitular):
              </label>
              <textarea
                rows={4}
                value={chap.body}
                onChange={(e) => handleUpdate(idx, "body", e.target.value)}
                className="w-full rounded border border-stone-300 bg-white p-3 font-serif text-sm text-stone-900 leading-relaxed focus:outline-none focus:border-stone-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-stone-700 mb-1">
                  Nota de Margem / Rodapé:
                </label>
                <input
                  type="text"
                  value={chap.marginNote}
                  onChange={(e) => handleUpdate(idx, "marginNote", e.target.value)}
                  className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Numeração da Página:
                </label>
                <input
                  type="text"
                  value={chap.metaRight}
                  onChange={(e) => handleUpdate(idx, "metaRight", e.target.value)}
                  placeholder="Pág. 14 — 15"
                  className="w-full rounded border border-stone-300 bg-white px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
