"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import type { ReadingBook } from "@/types/books";

interface AdminLivrosTabProps {
  livros: ReadingBook[];
  onChange: (livros: ReadingBook[]) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

export default function AdminLivrosTab({
  livros,
  onChange,
  showToast,
}: AdminLivrosTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"TODOS" | "VISIVEIS" | "OCULTOS" | "DESTAQUES" | "LIDOS" | "LENDO">("TODOS");
  const [editingBook, setEditingBook] = useState<ReadingBook | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Campos de sincronização manual se necessário
  const [syncUrl, setSyncUrl] = useState("");
  const [syncUser, setSyncUser] = useState("");
  const [syncKey, setSyncKey] = useState("");

  // Formulário do livro em edição/criação
  const [formTitle, setFormTitle] = useState("");
  const [formAuthor, setFormAuthor] = useState("");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formStatus, setFormStatus] = useState<ReadingBook["status"]>("LIDO");
  const [formProgress, setFormProgress] = useState(100);
  const [formTotalPages, setFormTotalPages] = useState<number | "">("");
  const [formCurrentPage, setFormCurrentPage] = useState<number | "">("");
  const [formRating, setFormRating] = useState(5);
  const [formQuote, setFormQuote] = useState("");
  const [formReview, setFormReview] = useState("");
  const [formTags, setFormTags] = useState("");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtragem dos livros
  const filteredLivros = livros.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTab === "VISIVEIS") return book.visible;
    if (filterTab === "OCULTOS") return !book.visible;
    if (filterTab === "DESTAQUES") return book.featured;
    if (filterTab === "LIDOS") return book.status === "LIDO";
    if (filterTab === "LENDO") return book.status === "LENDO";
    return true;
  });

  const counts = {
    total: livros.length,
    visiveis: livros.filter((b) => b.visible).length,
    ocultos: livros.filter((b) => !b.visible).length,
    destaques: livros.filter((b) => b.featured).length,
    lidos: livros.filter((b) => b.status === "LIDO").length,
    lendo: livros.filter((b) => b.status === "LENDO").length,
  };

  const handleToggleVisible = (bookId: string) => {
    const updated = livros.map((b) =>
      b.id === bookId ? { ...b, visible: !b.visible } : b
    );
    onChange(updated);
    const target = updated.find((b) => b.id === bookId);
    showToast(
      target?.visible ? `"${target.title}" agora está visível no site.` : `"${target?.title}" foi ocultado do público.`,
      "success"
    );
  };

  const handleToggleFeatured = (bookId: string) => {
    const updated = livros.map((b) =>
      b.id === bookId ? { ...b, featured: !b.featured } : b
    );
    onChange(updated);
  };

  const handleOpenEdit = (book: ReadingBook) => {
    setEditingBook(book);
    setIsCreating(false);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormCoverUrl(book.coverUrl || "");
    setFormStatus(book.status);
    setFormProgress(book.progressPercent);
    setFormTotalPages(book.totalPages || "");
    setFormCurrentPage(book.currentPage || "");
    setFormRating(book.rating || 5);
    setFormQuote(book.quote || "");
    setFormReview(book.review || "");
    setFormTags(book.tags.join(", "));
    setFormFeatured(Boolean(book.featured));
    setFormVisible(book.visible);
  };

  const handleOpenCreate = () => {
    setEditingBook(null);
    setIsCreating(true);
    setFormTitle("");
    setFormAuthor("");
    setFormCoverUrl("");
    setFormStatus("LIDO");
    setFormProgress(100);
    setFormTotalPages("");
    setFormCurrentPage("");
    setFormRating(5);
    setFormQuote("");
    setFormReview("");
    setFormTags("Livro, Tecnologia");
    setFormFeatured(false);
    setFormVisible(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast("Título é obrigatório.", "error");
      return;
    }

    const tagsArray = formTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (isCreating) {
      const newBook: ReadingBook = {
        id: `manual_${Date.now()}`,
        title: formTitle.trim(),
        author: formAuthor.trim() || "Autor desconhecido",
        coverUrl: formCoverUrl.trim() || undefined,
        status: formStatus,
        progressPercent: formProgress,
        totalPages: formTotalPages ? Number(formTotalPages) : undefined,
        currentPage: formCurrentPage ? Number(formCurrentPage) : undefined,
        rating: formRating,
        quote: formQuote.trim() || undefined,
        review: formReview.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : ["Geral"],
        source: "manual",
        visible: formVisible,
        featured: formFeatured,
        completedAt: formStatus === "LIDO" ? new Date().toISOString().slice(0, 10) : undefined,
      };
      onChange([newBook, ...livros]);
      showToast(`Livro "${newBook.title}" adicionado com sucesso!`, "success");
    } else if (editingBook) {
      const updated = livros.map((b) => {
        if (b.id !== editingBook.id) return b;
        return {
          ...b,
          title: formTitle.trim(),
          author: formAuthor.trim() || "Autor desconhecido",
          coverUrl: formCoverUrl.trim() || undefined,
          status: formStatus,
          progressPercent: formProgress,
          totalPages: formTotalPages ? Number(formTotalPages) : undefined,
          currentPage: formCurrentPage ? Number(formCurrentPage) : undefined,
          rating: formRating,
          quote: formQuote.trim() || undefined,
          review: formReview.trim() || undefined,
          tags: tagsArray.length > 0 ? tagsArray : b.tags,
          visible: formVisible,
          featured: formFeatured,
          completedAt: formStatus === "LIDO" && !b.completedAt ? new Date().toISOString().slice(0, 10) : b.completedAt,
        };
      });
      onChange(updated);
      showToast("Alterações do livro salvas!", "success");
    }

    setEditingBook(null);
    setIsCreating(false);
  };

  const handleDeleteBook = (bookId: string) => {
    const book = livros.find((b) => b.id === bookId);
    if (!book) return;
    if (!confirm(`Tem certeza que deseja excluir "${book.title}" da sua biblioteca?`)) return;
    const updated = livros.filter((b) => b.id !== bookId);
    onChange(updated);
    showToast(`Livro "${book.title}" removido.`, "success");
    if (editingBook?.id === bookId) setEditingBook(null);
  };

  // Sincronização direta com a API do CrossPoint Sync
  const handleTriggerSync = async () => {
    setIsSyncing(true);
    try {
      const payload: Record<string, string> = {};
      if (syncUrl) payload.url = syncUrl;
      if (syncUser) payload.user = syncUser;
      if (syncKey) payload.key = syncKey;

      const res = await fetch("/api/admin/sync-crosspoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Falha ao sincronizar com CrossPoint Sync");
      }

      onChange(data.books);
      showToast(data.message || "Sincronização concluída!", "success");
      setShowSyncModal(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      showToast(msg, "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // Upload de arquivo recent.json
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const rawJson = JSON.parse(evt.target?.result as string);
        setIsSyncing(true);
        const res = await fetch("/api/admin/sync-crosspoint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawJson }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Falha ao processar arquivo");
        }
        onChange(data.books);
        showToast(data.message || "Arquivo importado com sucesso!", "success");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erro ao ler JSON";
        showToast(`Erro na importação: ${msg}`, "error");
      } finally {
        setIsSyncing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 font-mono text-zinc-100">
      {/* Banner Superior & Controles Globais */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-zinc-900/90 p-5 rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📖</span>
            <h3 className="text-base sm:text-lg font-black tracking-wider uppercase text-emerald-400">
              CrossPoint Reader — Biblioteca &amp; Leituras
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Gerencie os livros lidos no seu e-reader, capas automáticas fornecidas pela API do CrossPoint Sync,
            controle de visibilidade pública (<span className="text-emerald-300">ocultar/mostrar</span>), destaques e resenhas pessoais para a página <code className="bg-zinc-800 px-1 py-0.5 rounded text-amber-300">/livros</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Botão de Sync Online */}
          <button
            onClick={() => setShowSyncModal(true)}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            <span className={isSyncing ? "animate-spin" : ""}>🔄</span>
            {isSyncing ? "Sincronizando..." : "CrossPoint Sync"}
          </button>

          {/* Importar Arquivo recent.json */}
          <label className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-700 transition cursor-pointer">
            <span>📁</span>
            <span>Importar JSON</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Adicionar Livro Manual */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow cursor-pointer"
          >
            <span>+</span>
            <span>Novo Livro</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
        {/* Abas */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "TODOS", label: "TODOS", count: counts.total },
            { id: "VISIVEIS", label: "VISÍVEIS", count: counts.visiveis },
            { id: "OCULTOS", label: "OCULTOS", count: counts.ocultos },
            { id: "DESTAQUES", label: "★ DESTAQUES", count: counts.destaques },
            { id: "LIDOS", label: "LIDOS", count: counts.lidos },
            { id: "LENDO", label: "LENDO", count: counts.lendo },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id as typeof filterTab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 rounded-full font-mono text-zinc-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Input de Busca */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Buscar por título, autor ou tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid de Livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredLivros.map((book) => {
          const isFinished = book.status === "LIDO";
          return (
            <div
              key={book.id}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 ${
                book.visible
                  ? "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 hover:shadow-lg"
                  : "bg-zinc-950/60 border-zinc-900 opacity-60"
              }`}
            >
              {/* Header do Card com Capa e Título */}
              <div className="flex gap-4">
                {/* Capa */}
                <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700/60 shadow-md">
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-zinc-900 text-zinc-600">
                      <span className="text-xl">📚</span>
                      <span className="text-[9px] mt-1 font-sans line-clamp-2">{book.title}</span>
                    </div>
                  )}

                  {/* Badge de Progresso na Capa */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-sm text-[9px] text-center font-bold py-0.5 text-zinc-300">
                    {book.progressPercent}%
                  </div>
                </div>

                {/* Informações Principais */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isFinished
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : book.status === "LENDO"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                      }`}
                    >
                      {book.status}
                    </span>

                    {/* Badge de Destaque */}
                    {book.featured && (
                      <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.2 rounded font-black">
                        ★ TOP
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-zinc-100 truncate mt-1.5" title={book.title}>
                    {book.title}
                  </h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{book.author}</p>

                  {/* Estrelas */}
                  <div className="flex items-center gap-0.5 mt-2 text-amber-400 text-xs">
                    {"★".repeat(book.rating || 5)}
                    {"☆".repeat(5 - (book.rating || 5))}
                  </div>

                  {/* Páginas */}
                  {(book.currentPage || book.totalPages) && (
                    <p className="text-[10px] text-zinc-500 mt-1">
                      {book.currentPage ? `${book.currentPage} de ` : ""}
                      {book.totalPages ? `${book.totalPages} págs` : ""}
                    </p>
                  )}
                </div>
              </div>

              {/* Citação / Review preview */}
              {book.quote && (
                <div className="mt-3 p-2 rounded bg-black/40 border-l-2 border-amber-500/60 text-[11px] italic text-zinc-300 line-clamp-2">
                  {book.quote}
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {book.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[9px] px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Barra de Ações Inferior */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-zinc-800/80">
                {/* Switch de Visibilidade */}
                <button
                  type="button"
                  onClick={() => handleToggleVisible(book.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                    book.visible
                      ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  }`}
                  title={book.visible ? "Clique para ocultar da página pública" : "Clique para tornar público"}
                >
                  <span>{book.visible ? "👁️ Visível" : "🚫 Oculto"}</span>
                </button>

                {/* Switch de Destaque */}
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(book.id)}
                  className={`text-xs px-2 py-1 rounded-lg transition ${
                    book.featured
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Marcar / desmarcar destaque"
                >
                  ★ Destaque
                </button>

                {/* Botão de Edição */}
                <button
                  type="button"
                  onClick={() => handleOpenEdit(book)}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold transition"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLivros.length === 0 && (
        <div className="text-center py-12 bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-800 text-zinc-500">
          <p className="text-2xl mb-2">📚</p>
          <p className="text-sm font-bold text-zinc-400">Nenhum livro encontrado</p>
          <p className="text-xs text-zinc-600 mt-1">
            Tente mudar o filtro de busca ou clique em &quot;CrossPoint Sync&quot; para puxar suas leituras.
          </p>
        </div>
      )}

      {/* Modal de Sincronização CrossPoint Sync */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-emerald-400 uppercase">
                🔄 Sincronizar com CrossPoint Sync
              </h3>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              O CrossPoint Sync consome a API do seu servidor e-reader ou KoSync (`/api/v1/documents`),
              importando automaticamente títulos, progresso e capas resolvidas.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">
                  URL do Servidor (opcional se já estiver no .env.local):
                </label>
                <input
                  type="text"
                  placeholder="https://sync.seu-dominio.com ou http://192.168.1.100"
                  value={syncUrl}
                  onChange={(e) => setSyncUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">
                  Usuário (x-auth-user):
                </label>
                <input
                  type="text"
                  placeholder="seu_usuario"
                  value={syncUser}
                  onChange={(e) => setSyncUser(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white placeholder-zinc-600"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">
                  Chave / Senha (x-auth-key):
                </label>
                <input
                  type="password"
                  placeholder="Senha ou MD5 hash"
                  value={syncKey}
                  onChange={(e) => setSyncKey(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white placeholder-zinc-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleTriggerSync}
                disabled={isSyncing}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl text-xs uppercase tracking-wider disabled:opacity-50"
              >
                {isSyncing ? "Buscando dados..." : "Iniciar Sincronização"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação / Edição de Livro */}
      {(editingBook || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-zinc-900 border-2 border-zinc-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black text-amber-400 uppercase">
                {isCreating ? "📖 Adicionar Livro Manual" : `✏️ Editar: ${editingBook?.title}`}
              </h3>
              <button
                onClick={() => {
                  setEditingBook(null);
                  setIsCreating(false);
                }}
                className="text-zinc-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Título do Livro *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Autor(es)</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">URL da Capa</label>
                <input
                  type="text"
                  placeholder="https://... (deixe em branco para usar fallback estilizado)"
                  value={formCoverUrl}
                  onChange={(e) => setFormCoverUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => {
                      const next = e.target.value as ReadingBook["status"];
                      setFormStatus(next);
                      if (next === "LIDO") setFormProgress(100);
                    }}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  >
                    <option value="LIDO">LIDO</option>
                    <option value="LENDO">LENDO</option>
                    <option value="QUERO_LER">QUERO_LER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Progresso (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formProgress}
                    onChange={(e) => setFormProgress(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Página Atual</label>
                  <input
                    type="number"
                    value={formCurrentPage}
                    onChange={(e) => setFormCurrentPage(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Total Páginas</label>
                  <input
                    type="number"
                    value={formTotalPages}
                    onChange={(e) => setFormTotalPages(e.target.value ? Number(e.target.value) : "")}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Avaliação (1 a 5 estrelas)</label>
                  <div className="flex gap-2 items-center bg-zinc-950 border border-zinc-700 rounded-lg p-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormRating(star)}
                        className={`text-lg transition ${
                          star <= formRating ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-zinc-400 text-xs ml-2 font-mono">({formRating} de 5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Tags (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Ficção Científica, Computação, Filosofia"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Citação Marcante</label>
                <input
                  type="text"
                  value={formQuote}
                  onChange={(e) => setFormQuote(e.target.value)}
                  placeholder="“Uma frase que resume ou impactou a leitura...”"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Resenha / Anotações Pessoais</label>
                <textarea
                  rows={4}
                  value={formReview}
                  onChange={(e) => setFormReview(e.target.value)}
                  placeholder="Sua análise crítica, conexões com desenvolvimento de software, aprendizados..."
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white resize-y"
                />
              </div>

              {/* Switches */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formVisible}
                    onChange={(e) => setFormVisible(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span className="text-zinc-300 font-bold">Visível na página /livros</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="accent-amber-500 rounded"
                  />
                  <span className="text-zinc-300 font-bold">Marcar como Destaque (★ TOP)</span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                {editingBook ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteBook(editingBook.id)}
                    className="px-3 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-xs font-bold transition"
                  >
                    🗑️ Excluir Livro
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBook(null);
                      setIsCreating(false);
                    }}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs uppercase tracking-wider"
                  >
                    {isCreating ? "Criar Livro" : "Salvar Livro"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
