import crypto from "node:crypto";
import type { ReadingBook, CrosspointSyncConfig } from "@/types/books";

/**
 * Normaliza a chave de autenticação para MD5 hex em minúsculas
 * (padrão exigido pela API do crosspoint-sync / KoSync).
 */
export function formatAuthKey(rawKey: string): string {
  const clean = rawKey.trim();
  // Se já for um hash MD5 válido de 32 caracteres hexadecimais
  if (/^[a-f0-9]{32}$/i.test(clean)) {
    return clean.toLowerCase();
  }
  // Caso seja a senha em texto claro, calcula o hash MD5
  return crypto.createHash("md5").update(clean).digest("hex").toLowerCase();
}

/**
 * Gera um ID consistente baseado em título e autor
 */
function generateBookId(title: string, author?: string): string {
  const raw = `${title}-${author || ""}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw || `book-${Date.now()}`;
}

/**
 * Limpa o nome do arquivo para usar como título de fallback
 * Ex: "Foundryside - Robert Jackson Bennett.epub" -> "Foundryside"
 */
function cleanFilenameToTitle(filename?: string | null): string {
  if (!filename) return "Livro sem título";
  const name = filename.split("/").pop()?.replace(/\.[^.]+$/, "") || filename;
  return name.replace(/\s*-\s*.*$/, "").trim() || name;
}

export interface CrosspointProgressItem {
  document: string;
  title?: string | null;
  author?: string | null;
  authors?: string[] | null;
  filename?: string | null;
  percentage?: number | null;
  progress?: string | null;
  status?: "reading" | "finished" | "paused" | "dnf" | null;
  status_at?: number | null;
  cover_url?: string | null;
  page_count?: number | null;
  device_id?: string | null;
  device?: string | null;
  timestamp?: number | null;
  genres?: string[] | null;
  moods?: string[] | null;
  rating?: number | null;
  history_only?: boolean | null;
}

export interface CrosspointProgressResponse {
  items?: CrosspointProgressItem[];
  next?: string | null;
}

/**
 * Valida as credenciais com o servidor CrossPoint Sync (KoSync API)
 */
export async function verifyAuth(baseUrl: string, headers: Record<string, string>): Promise<void> {
  try {
    const authRes = await fetch(`${baseUrl}/users/auth`, {
      headers,
      signal: AbortSignal.timeout(7000),
    });

    if (authRes.status === 401) {
      throw new Error("Credenciais inválidas no CrossPoint Sync (usuário ou chave incorretos).");
    }
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Credenciais inválidas")) {
      throw err;
    }
    // Caso a rota /users/auth não esteja implementada, segue para a chamada principal
  }
}

/**
 * Sincroniza com o servidor CrossPoint Sync utilizando o endpoint canônico:
 * GET /api/v1/progress?include_history=1&limit=500
 */
export async function fetchCrosspointSyncData(
  config: CrosspointSyncConfig
): Promise<ReadingBook[]> {
  const baseUrl = config.url.replace(/\/+$/, "");
  const authKey = formatAuthKey(config.key);
  const headers = {
    "Content-Type": "application/json",
    "x-auth-user": config.user.trim(),
    "x-auth-key": authKey,
  };

  // 1. Verificação prévia de autenticação
  await verifyAuth(baseUrl, headers);

  // 2. Busca lista de livros via GET /api/v1/progress?include_history=1
  const allItems: CrosspointProgressItem[] = [];
  let cursor: string | null = null;
  let pageCount = 0;
  let progressRouteWorked = false;

  do {
    const queryParams = new URLSearchParams({
      include_history: "1",
      limit: "500",
    });
    if (cursor) {
      queryParams.set("cursor", cursor);
    }

    const progressUrl = `${baseUrl}/api/v1/progress?${queryParams.toString()}`;
    const res = await fetch(progressUrl, {
      headers,
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      // Se for 404, o servidor pode ser uma versão legada sem /api/v1/progress
      if (res.status === 404) {
        break;
      }
      const errText = await res.text().catch(() => "");
      throw new Error(
        `Erro ao buscar progresso no CrossPoint Sync (${res.status}): ${errText || res.statusText}`
      );
    }

    progressRouteWorked = true;
    const data: CrosspointProgressResponse = await res.json();
    const items = Array.isArray(data.items) ? data.items : [];
    allItems.push(...items);

    cursor = data.next || null;
    pageCount++;
  } while (cursor && pageCount < 20); // Limite de 20 páginas (até 10.000 livros)

  // 3. Fallback: Se a rota /api/v1/progress retornou 404, tenta /api/v1/documents
  if (!progressRouteWorked) {
    const docsRes = await fetch(`${baseUrl}/api/v1/documents`, {
      headers,
      signal: AbortSignal.timeout(10000),
    });
    if (docsRes.ok) {
      const docsData = await docsRes.json();
      const rawDocs: Array<Record<string, unknown>> = Array.isArray(docsData)
        ? docsData
        : (docsData as { documents?: unknown[]; items?: unknown[] })?.documents ||
          (docsData as { items?: unknown[] })?.items ||
          [];

      for (const d of rawDocs) {
        allItems.push({
          document: String(d.document || d.id || d.hash || ""),
          title: typeof d.title === "string" ? d.title : undefined,
          author: typeof d.author === "string" ? d.author : undefined,
          filename: typeof d.filename === "string" ? d.filename : undefined,
          cover_url: typeof d.cover_url === "string" ? d.cover_url : undefined,
          page_count: typeof d.page_count === "number" ? d.page_count : undefined,
        });
      }
    }
  }

  // 4. Mapeia os itens do CrossPoint para ReadingBook
  const books: ReadingBook[] = allItems.map((item) => {
    const rawTitle = item.title?.trim() || cleanFilenameToTitle(item.filename);
    const author =
      item.author?.trim() ||
      (Array.isArray(item.authors) && item.authors.length > 0 ? item.authors.join(", ") : "Autor desconhecido");

    const percentage = typeof item.percentage === "number" ? item.percentage : 0;
    const progressPercent =
      item.status === "finished" || percentage >= 0.98
        ? 100
        : Math.min(100, Math.max(0, Math.round(percentage * 100)));

    const isFinished = item.status === "finished" || progressPercent >= 98;
    const status: ReadingBook["status"] = isFinished
      ? "LIDO"
      : item.status === "reading" || progressPercent > 0
      ? "LENDO"
      : "QUERO_LER";

    const totalPages = item.page_count || undefined;
    const currentPage =
      totalPages && progressPercent > 0
        ? Math.round((progressPercent / 100) * totalPages)
        : undefined;

    // Converte timestamp unix em segundos para data ISO YYYY-MM-DD
    const lastReadAt = item.timestamp
      ? new Date(item.timestamp * 1000).toISOString().slice(0, 10)
      : undefined;

    const completedAt = isFinished
      ? item.status_at
        ? new Date(item.status_at * 1000).toISOString().slice(0, 10)
        : lastReadAt || new Date().toISOString().slice(0, 10)
      : undefined;

    const tags: string[] = [];
    if (Array.isArray(item.genres) && item.genres.length > 0) {
      tags.push(...item.genres);
    }
    if (Array.isArray(item.moods) && item.moods.length > 0) {
      tags.push(...item.moods.slice(0, 2));
    }
    if (tags.length === 0) {
      tags.push("E-book");
    }

    const id = item.document || generateBookId(rawTitle, author);

    return {
      id,
      title: rawTitle,
      author,
      coverUrl: item.cover_url || undefined,
      status,
      progressPercent,
      totalPages,
      currentPage,
      completedAt,
      lastReadAt,
      rating: typeof item.rating === "number" ? Math.min(5, Math.max(1, Math.round(item.rating))) : undefined,
      tags,
      source: "crosspoint",
      visible: true,
      featured: false,
      filename: item.filename || undefined,
    };
  });

  return books;
}

/**
 * Faz parse de arquivos recent.json ou dumps locais do cartão SD do CrossPoint
 */
export function parseLocalCrosspointJson(rawJson: unknown): ReadingBook[] {
  const items = Array.isArray(rawJson)
    ? rawJson
    : (rawJson as { recent?: unknown[]; books?: unknown[]; items?: unknown[] })?.recent ||
      (rawJson as { books?: unknown[] })?.books ||
      (rawJson as { items?: unknown[] })?.items ||
      [];

  return items.map((item: Record<string, unknown>, idx: number) => {
    const rawFile = typeof item.file === "string" ? item.file : typeof item.filename === "string" ? item.filename : "";
    const title =
      typeof item.title === "string" && item.title.trim()
        ? item.title.trim()
        : cleanFilenameToTitle(rawFile) || `Livro ${idx + 1}`;

    const author = typeof item.author === "string" && item.author.trim() ? item.author.trim() : "Desconhecido";
    const rawProgress = typeof item.progress === "number" ? item.progress : typeof item.percentage === "number" ? item.percentage : 0;
    const progressPercent =
      rawProgress > 1 ? Math.min(100, Math.round(rawProgress)) : Math.round(rawProgress * 100);

    const isFinished = progressPercent >= 98 || item.status === "finished";
    const status: ReadingBook["status"] = isFinished ? "LIDO" : progressPercent > 0 ? "LENDO" : "QUERO_LER";

    const totalPages = typeof item.total_pages === "number" ? item.total_pages : typeof item.page_count === "number" ? item.page_count : undefined;
    const currentPage = typeof item.current_page === "number" ? item.current_page : undefined;

    return {
      id: generateBookId(title, author),
      title,
      author,
      coverUrl: typeof item.cover_url === "string" ? item.cover_url : undefined,
      status,
      progressPercent,
      totalPages,
      currentPage,
      completedAt: isFinished ? new Date().toISOString().slice(0, 10) : undefined,
      tags: Array.isArray(item.tags) ? (item.tags as string[]) : ["E-book"],
      source: "crosspoint",
      visible: true,
      featured: false,
      filename: rawFile || undefined,
    };
  });
}

/**
 * Mescla livros importados com a lista existente no sistema,
 * preservando todas as customizações manuais feitas pelo Ryan no Admin:
 * visibilidade (visible), destaque (featured), avaliação (rating), resenha (review) e citação (quote).
 */
export function mergeBooks(
  existingBooks: ReadingBook[],
  incomingBooks: ReadingBook[]
): ReadingBook[] {
  const existingMap = new Map<string, ReadingBook>();

  for (const b of existingBooks) {
    existingMap.set(b.id, b);
    const compoundKey = `${b.title.toLowerCase().trim()}|${b.author.toLowerCase().trim()}`;
    existingMap.set(compoundKey, b);
  }

  const merged: ReadingBook[] = [];
  const processedKeys = new Set<string>();

  // Processa incomingBooks
  for (const incoming of incomingBooks) {
    const compoundKey = `${incoming.title.toLowerCase().trim()}|${incoming.author.toLowerCase().trim()}`;
    const existing = existingMap.get(incoming.id) || existingMap.get(compoundKey);

    if (existing) {
      // Mescla atualizações com prioridade de personalização do usuário
      merged.push({
        ...incoming,
        id: existing.id,
        visible: existing.visible, // Mantém visibilidade customizada no Admin
        featured: existing.featured, // Mantém destaque customizado
        rating: existing.rating ?? incoming.rating,
        review: existing.review || incoming.review,
        quote: existing.quote || incoming.quote,
        coverUrl: incoming.coverUrl || existing.coverUrl, // Atualiza capa se a nova trouxer capa
        tags: existing.tags && existing.tags.length > 0 ? existing.tags : incoming.tags,
        status: existing.status === "LIDO" ? "LIDO" : incoming.status,
        progressPercent:
          existing.status === "LIDO"
            ? 100
            : Math.max(existing.progressPercent || 0, incoming.progressPercent || 0),
      });
      processedKeys.add(compoundKey);
      processedKeys.add(existing.id);
    } else {
      merged.push(incoming);
      processedKeys.add(compoundKey);
      processedKeys.add(incoming.id);
    }
  }

  // Preserva livros que já existiam e não vieram na resposta atual (ex: manuais ou offline)
  for (const existing of existingBooks) {
    const compoundKey = `${existing.title.toLowerCase().trim()}|${existing.author.toLowerCase().trim()}`;
    if (!processedKeys.has(existing.id) && !processedKeys.has(compoundKey)) {
      merged.push(existing);
      processedKeys.add(existing.id);
      processedKeys.add(compoundKey);
    }
  }

  return merged;
}
