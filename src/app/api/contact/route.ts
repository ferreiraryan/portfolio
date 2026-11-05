import { NextResponse } from "next/server";

interface ContactRequestBody {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ContactRequestBody;
    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const message = body.message?.trim() || "";

    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: "Nome inválido ou excede 100 caracteres." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email) || email.length > 150) {
      return NextResponse.json(
        { error: "E-mail inválido. Por favor, confira o formato." },
        { status: 400 }
      );
    }

    if (!message || message.length < 5 || message.length > 3000) {
      return NextResponse.json(
        { error: "Mensagem deve ter entre 5 e 3000 caracteres." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL_TO || "ryanferreira4883@gmail.com";

    if (apiKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: recipient,
          reply_to: email,
          subject: `[Portfólio] Nova transmissão de ${name}`,
          text: `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Erro ao enviar e-mail via Resend:", errorData);
        return NextResponse.json(
          { error: "Falha ao enviar e-mail pelo provedor externo." },
          { status: 502 }
        );
      }
    } else {
      console.info("[Contato - Modo Simulação]", {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      simulated: !apiKey,
    });
  } catch (err) {
    console.error("Erro interno no endpoint de contato:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o formulário." },
      { status: 500 }
    );
  }
}
