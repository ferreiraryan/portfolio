import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getExpectedToken, isAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(req: Request) {
  try {
    const expectedPassword = process.env.ADMIN_PASSWORD?.trim();
    if (!expectedPassword) {
      return NextResponse.json(
        { ok: false, error: "ADMIN_PASSWORD não configurada nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const password = body?.password?.trim() || "";

    if (password === expectedPassword) {
      const token = getExpectedToken();
      if (!token) {
        return NextResponse.json(
          { ok: false, error: "Erro ao gerar credencial de sessão." },
          { status: 500 }
        );
      }

      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });

      return NextResponse.json({ ok: true, message: "Acesso autorizado com sucesso." });
    }

    return NextResponse.json(
      { ok: false, error: "Senha incorreta. Acesso negado." },
      { status: 401 }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ ok: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ ok: true, message: "Sessão encerrada." });
}
