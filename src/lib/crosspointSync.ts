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

export interface CrosspointDocument {
  id?: string;
  document?: string;
  hash?: string;
  title?: string;
  authors?: string[];
  author?: string;
  cover_url?: string;
  thumbnail_url?: string;
  page_count?: number;
  total_pages?: number;
  genres?: string[];
  description?: string;
  filename?: string;
  updated_at?: string;
}

export interface CrosspointBookStats {
  document?: string;
  hash?: string;
  progress?: number;
  percentage?: number;
  current_page?: number;
  total_pages?: number;
  finished_at?: string;
  started_at?: string;
  last_read_at?: string;
  completed?: boolean;
}

/**
 * Sincroniza com servidor CrossPoint Sync (KoSync API v1)
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

  // 1. Busca documentos cadastrados
  const docsRes = await fetch(`${baseUrl}/api/v1/documents`, {
    headers,
    signal: AbortSignal.timeout(12000),
  });

  if (!docsRes.ok) {
    const errorText = await docsRes.text().catch(() => "");
    throw new Error(
      `Falha na conexão com CrossPoint Sync (${docsRes.status}): ${errorText || docsRes.statusText}`
    );
  }

  const docsData = await docsRes.json();
  const rawDocs: CrosspointDocument[] = Array.isArray(docsData)
    ? docsData
    : docsData.documents || docsData.data || [];

  // 2. Busca estatísticas de leitura (se disponível)
  const statsMap = new Map<string, CrosspointBookStats>();
  try {
    const statsRes = await fetch(`${baseUrl}/api/v1/stats/books`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (statsRes.ok) {
      const statsData = await statsRes.json();
      const rawStats: CrosspointBookStats[] = Array.isArray(statsData)
        ? statsData
        : statsData.stats || statsData.data || [];

      for (const st of rawStats) {
        const key = st.document || st.hash;
        if (key) statsMap.set(key, st);
      }
    }
  } catch {
    // Estatísticas são opcionais; se a rota falhar, segue com metadados dos documentos
  }

  // 3. Mapeia documentos para o formato ReadingBook
  const books: ReadingBook[] = rawDocs.map((doc) => {
    const docKey = doc.id || doc.document || doc.hash || "";
    const stats = statsMap.get(docKey);

    const title = doc.title || doc.filename || "Livro sem título";
    const author =
      Array.isArray(doc.authors) && doc.authors.length > 0
        ? doc.authors.join(", ")
        : doc.author || "Autor desconhecido";

    // Progresso percentual (0 - 100)
    let progress = 0;
    if (typeof stats?.progress === "number") {
      progress = stats.progress > 1 ? Math.min(100, Math.round(stats.progress)) : Math.round(stats.progress * 100);
    } else if (typeof stats?.percentage === "number") {
      progress = Math.min(100, Math.round(stats.percentage));
    } else if (stats?.completed) {
      progress = 100;
    }

    const totalPages = doc.page_count || doc.total_pages || stats?.total_pages;
    const currentPage =
      stats?.current_page ||
      (totalPages && progress ? Math.round((progress / 100) * totalPages) : undefined);

    const isFinished = progress >= 99 || Boolean(stats?.completed) || Boolean(stats?.finished_at);
    const status: ReadingBook["status"] = isFinished ? "LIDO" : progress > 0 ? "LENDO" : "QUERO_LER";

    const id = docKey || generateBookId(title, author);

    return {
      id,
      title,
      author,
      coverUrl: doc.cover_url || doc.thumbnail_url || undefined,
      status,
      progressPercent: isFinished ? 100 : progress,
      totalPages: totalPages || undefined,
      currentPage: currentPage || undefined,
      completedAt: stats?.finished_at ? stats.finished_at.slice(0, 10) : isFinished ? new Date().toISOString().slice(0, 10) : undefined,
      startedAt: stats?.started_at ? stats.started_at.slice(0, 10) : undefined,
      lastReadAt: stats?.last_read_at ? stats.last_read_at.slice(0, 10) : undefined,
      tags: doc.genres && doc.genres.length > 0 ? doc.genres : ["E-book"],
      source: "crosspoint",
      visible: true,
      featured: false,
      filename: doc.filename,
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
    : (rawJson as { recent?: unknown[]; books?: unknown[] })?.recent ||
      (rawJson as { books?: unknown[] })?.books ||
      [];

  return items.map((item: Record<string, unknown>, idx: number) => {
    const title =
      typeof item.title === "string"
        ? item.title
        : typeof item.file === "string"
        ? item.file.split("/").pop()?.replace(/\.[^.]+$/, "") || "Livro"
        : `Livro ${idx + 1}`;

    const author = typeof item.author === "string" ? item.author : "Desconhecido";
    const rawProgress = typeof item.progress === "number" ? item.progress : 0;
    const progressPercent =
      rawProgress > 1 ? Math.min(100, Math.round(rawProgress)) : Math.round(rawProgress * 100);

    const isFinished = progressPercent >= 99;
    const status: ReadingBook["status"] = isFinished ? "LIDO" : progressPercent > 0 ? "LENDO" : "QUERO_LER";

    return {
      id: generateBookId(title, author),
      title,
      author,
      coverUrl: typeof item.cover_url === "string" ? item.cover_url : undefined,
      status,
      progressPercent,
      totalPages: typeof item.total_pages === "number" ? item.total_pages : undefined,
      currentPage: typeof item.current_page === "number" ? item.current_page : undefined,
      completedAt: isFinished ? new Date().toISOString().slice(0, 10) : undefined,
      tags: Array.isArray(item.tags) ? (item.tags as string[]) : ["E-book"],
      source: "crosspoint",
      visible: true,
      featured: false,
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
    // Também mapeia por chave composta título + autor normalizados para deduplicação robusta
    const compoundKey = `${b.title.toLowerCase().trim()}|${b.author.toLowerCase().trim()}`;
    existingMap.set(compoundKey, b);
  }

  const merged: ReadingBook[] = [];
  const processedCompoundKeys = new Set<string>();

  // Processa incomingBooks
  for (const incoming of incomingBooks) {
    const compoundKey = `${incoming.title.toLowerCase().trim()}|${incoming.author.toLowerCase().trim()}`;
    const existing = existingMap.get(incoming.id) || existingMap.get(compoundKey);

    if (existing) {
      // Mescla atualizações com prioridade de personalização do usuário
      merged.push({
        ...incoming,
        id: existing.id, // Preserva o ID original
        visible: existing.visible, // Não altera se o usuário ocultou!
        featured: existing.featured, // Preserva destaque
        rating: existing.rating ?? incoming.rating,
        review: existing.review || incoming.review,
        quote: existing.quote || incoming.quote,
        coverUrl: existing.coverUrl || incoming.coverUrl,
        tags: existing.tags && existing.tags.length > 0 ? existing.tags : incoming.tags,
        // Mantém status de lido se já estava marcado como lido
        status: existing.status === "LIDO" ? "LIDO" : incoming.status,
        progressPercent:
          existing.status === "LIDO"
            ? 100
            : Math.max(existing.progressPercent || 0, incoming.progressPercent || 0),
      });
      processedCompoundKeys.add(compoundKey);
      processedCompoundKeys.add(existing.id);
    } else {
      merged.push(incoming);
      processedCompoundKeys.add(compoundKey);
      processedCompoundKeys.add(incoming.id);
    }
  }

  // Preserva livros que foram adicionados manualmente ou que não vieram nessa sincronização
  for (const existing of existingBooks) {
    const compoundKey = `${existing.title.toLowerCase().trim()}|${existing.author.toLowerCase().trim()}`;
    if (!processedCompoundKeys.has(existing.id) && !processedCompoundKeys.has(compoundKey)) {
      merged.push(existing);
      processedCompoundKeys.add(existing.id);
      processedCompoundKeys.add(compoundKey);
    }
  }

  return merged;
}
