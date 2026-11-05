import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { isAuthenticated } from "@/lib/adminAuth";

const execAsync = promisify(exec);

export async function POST() {
  const auth = await isAuthenticated();
  if (!auth) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 });
  }

  try {
    const scriptPath = path.join(process.cwd(), "scripts/sync-github.ts");
    const { stdout, stderr } = await execAsync(
      `node --env-file-if-exists=.env.local "${scriptPath}"`,
      { cwd: process.cwd(), timeout: 45000 }
    );

    return NextResponse.json({
      ok: true,
      message: "Sincronização com GitHub executada com sucesso!",
      output: stdout || stderr,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido ao executar script";
    return NextResponse.json(
      { ok: false, error: `Falha na sincronização: ${errorMsg}` },
      { status: 500 }
    );
  }
}
