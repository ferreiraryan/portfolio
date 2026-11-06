import fs from "node:fs/promises";
import path from "node:path";

export interface FileToPersist {
  relativePath: string; // Ex: "src/data/livros.json"
  content: string;
}

interface CommitOptions {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  files: FileToPersist[];
  commitMessage: string;
}

/**
 * Cria um commit atômico no GitHub utilizando a Git Data API
 */
async function commitFilesToGitHub({
  token,
  owner,
  repo,
  branch,
  files,
  commitMessage,
}: CommitOptions): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "portfolio-admin-sync",
  };

  // 1. Obtém o SHA do commit mais recente da branch
  const refRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
    { headers }
  );

  if (!refRes.ok) {
    const errText = await refRes.text().catch(() => "");
    throw new Error(
      `Falha ao obter referência da branch "${branch}" no GitHub (${refRes.status}): ${errText || refRes.statusText}`
    );
  }

  const refData = await refRes.json();
  const latestCommitSha = refData.object?.sha;
  if (!latestCommitSha) {
    throw new Error(`Não foi possível determinar o commit atual da branch "${branch}".`);
  }

  // 2. Obtém o SHA da árvore base (base_tree) desse commit
  const commitRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
    { headers }
  );

  if (!commitRes.ok) {
    const errText = await commitRes.text().catch(() => "");
    throw new Error(`Falha ao ler commit base (${commitRes.status}): ${errText}`);
  }

  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree?.sha;

  // 3. Cria a nova árvore com os arquivos modificados
  const treePayload = {
    base_tree: baseTreeSha,
    tree: files.map((f) => ({
      path: f.relativePath.replace(/^[./\\]+/, ""),
      mode: "100644",
      type: "blob",
      content: f.content,
    })),
  };

  const createTreeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(treePayload),
    }
  );

  if (!createTreeRes.ok) {
    const errText = await createTreeRes.text().catch(() => "");
    throw new Error(`Falha ao criar árvore de arquivos no GitHub (${createTreeRes.status}): ${errText}`);
  }

  const newTreeData = await createTreeRes.json();
  const newTreeSha = newTreeData.sha;

  // 4. Cria o novo commit apontando para a nova árvore
  const createCommitRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/commits`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        message: commitMessage,
        tree: newTreeSha,
        parents: [latestCommitSha],
      }),
    }
  );

  if (!createCommitRes.ok) {
    const errText = await createCommitRes.text().catch(() => "");
    throw new Error(`Falha ao criar commit no GitHub (${createCommitRes.status}): ${errText}`);
  }

  const newCommitData = await createCommitRes.json();
  const newCommitSha = newCommitData.sha;

  // 5. Atualiza a referência da branch para o novo commit
  const updateRefRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        sha: newCommitSha,
        force: false,
      }),
    }
  );

  if (!updateRefRes.ok) {
    const errText = await updateRefRes.text().catch(() => "");
    throw new Error(`Falha ao atualizar branch no GitHub (${updateRefRes.status}): ${errText}`);
  }

  return newCommitSha;
}

/**
 * Salva arquivos JSON no portfólio de forma resiliente:
 * - Em desenvolvimento local: salva via fs.writeFile.
 * - Na Vercel (ou em caso de filesystem read-only EROFS): commita diretamente no GitHub via GitHub API,
 *   disparando automaticamente o redeploy da Vercel com os dados persistidos!
 */
export async function persistJsonFiles(
  files: FileToPersist[],
  commitMessage: string = "admin: atualizar dados via painel"
): Promise<{ success: boolean; mode: "local" | "github"; message: string }> {
  const isVercel = Boolean(process.env.VERCEL);

  // 1. Tenta salvar localmente se não estiver expressamente no ambiente serverless da Vercel
  if (!isVercel) {
    try {
      const dataDir = path.join(process.cwd(), "src/data");
      for (const file of files) {
        const filename = path.basename(file.relativePath);
        const fullPath = path.join(dataDir, filename);
        await fs.writeFile(fullPath, file.content, "utf-8");
      }
      return {
        success: true,
        mode: "local",
        message: "Dados salvos com sucesso no disco local.",
      };
    } catch (err: unknown) {
      const isErofs =
        err instanceof Error &&
        "code" in err &&
        (err as { code: string }).code === "EROFS";
      if (!isErofs) {
        throw err;
      }
      // Se for EROFS inesperado, prossegue para o fallback do GitHub
    }
  }

  // 2. Persistência na Vercel via GitHub API
  const token = process.env.GITHUB_TOKEN?.trim();
  const owner = process.env.GITHUB_OWNER || process.env.GITHUB_USERNAME || "ferreiraryan";
  const repo = process.env.GITHUB_REPO || "portfolio";
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token) {
    throw new Error(
      "O ambiente da Vercel possui sistema de arquivos somente leitura (read-only). " +
      "Para salvar alterações e persistir no repositório, configure a variável de ambiente GITHUB_TOKEN " +
      "nas configurações do projeto na Vercel (Project Settings -> Environment Variables) " +
      "com um GitHub Personal Access Token (com permissão 'Contents: Read and write')."
    );
  }

  await commitFilesToGitHub({
    token,
    owner,
    repo,
    branch,
    files,
    commitMessage,
  });

  return {
    success: true,
    mode: "github",
    message: "Alterações commitadas com sucesso no repositório GitHub! A Vercel iniciará o novo deploy automaticamente.",
  };
}
