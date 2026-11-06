"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ReadingBook } from "@/types/books";

interface LivrosClientProps {
  initialBooks: ReadingBook[];
}

export default function LivrosClient({ initialBooks }: LivrosClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"TODOS" | "LIDOS" | "LENDO" | "DESTAQUES">("TODOS");
  const [selectedBook, setSelectedBook] = useState<ReadingBook | null>(null);

  // Métricas gerais calculadas dinamicamente
  const stats = useMemo(() => {
    const lidos = initialBooks.filter((b) => b.status === "LIDO").length;
    const lendo = initialBooks.filter((b) => b.status === "LENDO").length;
    const totalPaginas = initialBooks.reduce((acc, b) => {
      if (b.status === "LIDO") return acc + (b.totalPages || b.currentPage || 250);
      return acc + (b.currentPage || 0);
    }, 0);
    const avaliados = initialBooks.filter((b) => b.rating);
    const mediaRating =
      avaliados.length > 0
        ? (avaliados.reduce((acc, b) => acc + (b.rating || 0), 0) / avaliados.length).toFixed(1)
        : "5.0";

    return { lidos, lendo, totalPaginas, mediaRating, total: initialBooks.length };
  }, [initialBooks]);

  // Filtragem dos livros
  const filteredBooks = useMemo(() => {
    return initialBooks.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!matchesSearch) return false;

      if (activeFilter === "LIDOS") return book.status === "LIDO";
      if (activeFilter === "LENDO") return book.status === "LENDO";
      if (activeFilter === "DESTAQUES") return Boolean(book.featured);
      return true;
    });
  }, [initialBooks, searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-[#070509] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Glow de ambientação no topo */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-600/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Barra de Navegação Superior */}
      <header className="sticky top-0 z-30 bg-[#070509]/85 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-xs font-mono text-zinc-400 hover:text-white transition"
          >
            <span className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-amber-500/60 transition">
              ←
            </span>
            <span>Voltar ao Portfólio</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              CROSSPOINT // E-READER LOGS
            </span>
          </div>

          <Link
            href="/admin"
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition"
          >
            ⚙️ Admin
          </Link>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10">
        {/* Cabeçalho da Seção */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-xs">
            <span>📚</span>
            <span>BIBLIOTECA PESSOAL &amp; LEITURAS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white font-medium">
            Histórias, Códigos &amp; Mundos
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Obras lidas e registradas através do e-reader pocket <strong className="text-zinc-200">CrossPoint</strong>.
            De fundamentos de sistemas distribuídos e ciberespaço a clássicos da filosofia estóica e mangás —
            cada livro aqui moldou uma parte da minha visão técnica e criativa.
          </p>
        </div>

        {/* Grade de Estatísticas de Leitura */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">LIVROS CONCLUÍDOS</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">{stats.lidos}</span>
              <span className="text-xs text-zinc-500">obras</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">LENDO NO MOMENTO</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400">{stats.lendo}</span>
              <span className="text-xs text-zinc-500">em progresso</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">TOTAL DE PÁGINAS</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-cyan-400">
                {stats.totalPaginas.toLocaleString("pt-BR")}
              </span>
              <span className="text-xs text-zinc-500">págs</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/90 shadow-sm flex flex-col justify-between">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider">AVALIAÇÃO MÉDIA</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-300">{stats.mediaRating}</span>
              <span className="text-amber-400 text-sm">★</span>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca Instantânea */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-zinc-950/70 p-3 sm:p-4 rounded-2xl border border-zinc-800">
          {/* Abas de Filtro */}
          <div className="flex flex-wrap gap-1.5 font-mono">
            {[
              { id: "TODOS", label: "TODOS", count: stats.total },
              { id: "DESTAQUES", label: "★ FAVORITOS", count: initialBooks.filter((b) => b.featured).length },
              { id: "LIDOS", label: "LIDOS", count: stats.lidos },
              { id: "LENDO", label: "LENDO", count: stats.lendo },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-amber-400 text-black shadow-md font-black"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    activeFilter === tab.id ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Barra de Busca */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">🔍</span>
            <input
              type="text"
              placeholder="Buscar por título, autor, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Grid de Capas e Livros */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {filteredBooks.map((book) => {
            const isFinished = book.status === "LIDO";
            return (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedBook(book)}
                className="group text-left flex flex-col focus:outline-none cursor-pointer"
              >
                {/* Capa com Proporção 2:3 */}
                <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:border-amber-400/50 group-hover:shadow-[0_8px_25px_rgba(251,191,36,0.15)]">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    /* Fallback elegante com estética de encadernação */
                    <div className="w-full h-full p-3 flex flex-col justify-between bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-zinc-300 border-l-4 border-amber-600/70">
                      <span className="text-xl">📖</span>
                      <div>
                        <p className="font-serif font-bold text-xs line-clamp-3 text-white">
                          {book.title}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{book.author}</p>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">CROSSPOINT</span>
                    </div>
                  )}

                  {/* Badge de Destaque no Topo */}
                  {book.featured && (
                    <span className="absolute top-2 right-2 text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded font-mono font-black shadow-md">
                      ★ TOP
                    </span>
                  )}

                  {/* Barra de Progresso Sobreposta na Base da Capa */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-2.5 pt-6 flex items-center justify-between font-mono text-[10px]">
                    <span
                      className={`font-black ${
                        isFinished ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {isFinished ? "✓ 100%" : `${book.progressPercent}%`}
                    </span>
                    <span className="text-amber-300">
                      {"★".repeat(book.rating || 5)}
                    </span>
                  </div>
                </div>

                {/* Metadados Abaixo da Capa */}
                <div className="mt-2.5 space-y-1">
                  <h3
                    className="text-xs sm:text-sm font-bold text-zinc-100 group-hover:text-amber-300 transition line-clamp-1"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">{book.author}</p>
                  <div className="flex flex-wrap gap-1 pt-0.5 font-mono">
                    {book.tags.slice(0, 1).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Estado Vazio */}
        {filteredBooks.length === 0 && (
          <div className="py-20 text-center space-y-3 bg-zinc-950/40 rounded-3xl border border-dashed border-zinc-800">
            <span className="text-3xl">🔍</span>
            <h3 className="text-base font-bold text-zinc-300">Nenhum livro encontrado</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Não encontramos nenhum título correspondente à sua busca. Tente buscar por outro autor ou alterne os filtros.
            </p>
          </div>
        )}
      </main>

      {/* Modal de Detalhes da Leitura */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm transition"
            >
              ✕
            </button>

            {/* Cabeçalho do Modal com Capa e Título */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Capa */}
              <div className="relative w-32 sm:w-36 aspect-[2/3] flex-shrink-0 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shadow-xl">
                {selectedBook.coverUrl ? (
                  <Image
                    src={selectedBook.coverUrl}
                    alt={selectedBook.title}
                    fill
                    sizes="144px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-3xl">
                    📚
                  </div>
                )}
              </div>

              {/* Título & Detalhes */}
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold ${
                      selectedBook.status === "LIDO"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    {selectedBook.status === "LIDO" ? "CONCLUÍDO (100%)" : `EM LEITURA (${selectedBook.progressPercent}%)`}
                  </span>

                  {selectedBook.featured && (
                    <span className="bg-amber-400 text-black px-2 py-0.5 rounded font-black">
                      ★ DESTAQUE
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  {selectedBook.title}
                </h2>

                <p className="text-sm text-zinc-400 font-mono">
                  Por <strong className="text-zinc-200">{selectedBook.author}</strong>
                </p>

                {/* Avaliação em Estrelas */}
                <div className="flex items-center gap-1 text-amber-400 text-base">
                  {"★".repeat(selectedBook.rating || 5)}
                  {"☆".repeat(5 - (selectedBook.rating || 5))}
                  <span className="text-xs text-zinc-400 font-mono ml-2">
                    ({selectedBook.rating || 5} / 5)
                  </span>
                </div>

                {/* Metadados Técnicos do Leitor */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 font-mono pt-1">
                  {selectedBook.totalPages && (
                    <span>📖 {selectedBook.totalPages} páginas</span>
                  )}
                  {selectedBook.completedAt && (
                    <span>📅 Concluído em {selectedBook.completedAt}</span>
                  )}
                  <span>📱 Sincronizado via CrossPoint</span>
                </div>
              </div>
            </div>

            {/* Citação Marcante */}
            {selectedBook.quote && (
              <blockquote className="p-4 rounded-2xl bg-black/50 border-l-4 border-amber-400 text-amber-200 text-sm italic leading-relaxed">
                {selectedBook.quote}
              </blockquote>
            )}

            {/* Resenha / Análise Crítica */}
            {selectedBook.review && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                  Reflexões &amp; Conexões com Tecnologia:
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-serif">
                  {selectedBook.review}
                </p>
              </div>
            )}

            {/* Tags do Livro */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
              {selectedBook.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 text-zinc-400 text-xs font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rodapé da Página */}
      <footer className="mt-20 border-t border-zinc-800/80 bg-[#070509] py-8 text-center text-xs font-mono text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Ryan Ferreira • Biblioteca &amp; Leituras do CrossPoint Reader</span>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-300 transition">
              Início do Portfólio ↗
            </Link>
            <Link href="/admin" className="hover:text-zinc-300 transition">
              Painel Admin ↗
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
