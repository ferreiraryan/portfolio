import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthenticated } from "@/lib/adminAuth";
import { persistJsonFiles } from "@/lib/dataStorage";
import {
  fetchCrosspointSyncData,
  parseLocalCrosspointJson,
  mergeBooks,
} from "@/lib/crosspointSync";
import type { ReadingBook } from "@/types/books";

const LIVROS_FILE = path.join(process.cwd(), "src/data/livros.json");

export async function POST(req: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));

    // Carrega livros atuais
    let currentBooks: ReadingBook[] = [];
    try {
      const raw = await fs.readFile(LIVROS_FILE, "utf-8");
      currentBooks = JSON.parse(raw);
    } catch {
      currentBooks = [];
    }

    let incomingBooks: ReadingBook[] = [];

    if (body.rawJson) {
      // Importação via arquivo JSON (recent.json / state do SD Card)
      incomingBooks = parseLocalCrosspointJson(body.rawJson);
    } else {
      // Sincronização via API do CrossPoint Sync
      const url = body.url || process.env.CROSSPOINT_SYNC_URL;
      const user = body.user || process.env.CROSSPOINT_SYNC_USER;
      const key = body.key || process.env.CROSSPOINT_SYNC_KEY;

      if (!url || !user || !key) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Credenciais do CrossPoint Sync não encontradas. Configure CROSSPOINT_SYNC_URL, CROSSPOINT_SYNC_USER e CROSSPOINT_SYNC_KEY no arquivo .env.local ou informe diretamente na tela.",
          },
          { status: 400 }
        );
      }

      console.log(`[CrossPoint Sync] Conectando a ${url} como usuário "${user}"...`);
      incomingBooks = await fetchCrosspointSyncData({ url, user, key });
      console.log(`[CrossPoint Sync] ${incomingBooks.length} livro(s) retornado(s) pelo servidor.`);
    }

    if (!incomingBooks.length) {
      return NextResponse.json({
        ok: true,
        message: "Conexão estabelecida com sucesso! Porém nenhum livro com progresso ou histórico foi encontrado no CrossPoint Sync.",
        books: currentBooks,
        count: currentBooks.length,
      });
    }

    const merged = mergeBooks(currentBooks, incomingBooks);

    const persistResult = await persistJsonFiles(
      [
        {
          relativePath: "src/data/livros.json",
          content: JSON.stringify(merged, null, 2),
        },
      ],
      `admin: sincronizar ${incomingBooks.length} livro(s) do CrossPoint`
    );

    return NextResponse.json({
      ok: true,
      message: `${persistResult.message} (${incomingBooks.length} livro(s) sincronizados).`,
      count: merged.length,
      books: merged,
      mode: persistResult.mode,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido ao sincronizar";
    return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
  }
}
