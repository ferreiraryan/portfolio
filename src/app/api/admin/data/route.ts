import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { isAuthenticated } from "@/lib/adminAuth";

const DATA_DIR = path.join(process.cwd(), "src/data");

const PATHS = {
  projects: path.join(DATA_DIR, "github-projects.json"),
  overrides: path.join(DATA_DIR, "github-overrides.json"),
  skills: path.join(DATA_DIR, "github-skills.json"),
  estante: path.join(DATA_DIR, "estante.json"),
  chapters: path.join(DATA_DIR, "chapters.json"),
  livros: path.join(DATA_DIR, "livros.json"),
};

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function GET() {
  const [projects, overrides, skills, estante, chapters, livros] = await Promise.all([
    readJsonFile(PATHS.projects, []),
    readJsonFile(PATHS.overrides, { excludedRepos: [], overrides: {}, manualProjects: [] }),
    readJsonFile(PATHS.skills, { skillTrees: {}, baseAttributes: [] }),
    readJsonFile(PATHS.estante, []),
    readJsonFile(PATHS.chapters, []),
    readJsonFile(PATHS.livros, []),
  ]);

  return NextResponse.json({
    projects,
    overrides,
    skills,
    estante,
    chapters,
    livros,
  });
}

export async function POST(req: Request) {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.overrides) {
      await fs.writeFile(PATHS.overrides, JSON.stringify(body.overrides, null, 2), "utf-8");
    }

    if (body.projects) {
      await fs.writeFile(PATHS.projects, JSON.stringify(body.projects, null, 2), "utf-8");
    }

    if (body.skills) {
      await fs.writeFile(PATHS.skills, JSON.stringify(body.skills, null, 2), "utf-8");
    }

    if (body.estante) {
      await fs.writeFile(PATHS.estante, JSON.stringify(body.estante, null, 2), "utf-8");
    }

    if (body.chapters) {
      await fs.writeFile(PATHS.chapters, JSON.stringify(body.chapters, null, 2), "utf-8");
    }

    if (body.livros) {
      await fs.writeFile(PATHS.livros, JSON.stringify(body.livros, null, 2), "utf-8");
    }

    return NextResponse.json({ ok: true, message: "Dados atualizados com sucesso no servidor." });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
  }
}
