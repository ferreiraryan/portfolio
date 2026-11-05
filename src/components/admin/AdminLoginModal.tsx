"use client";

import { useState } from "react";

interface AdminLoginModalProps {
  onSuccess: () => void;
}

export default function AdminLoginModal({ onSuccess }: AdminLoginModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        onSuccess();
      } else {
        setError(data.error || "Senha inválida.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none font-mono">
      <div className="w-full max-w-md rounded-xl border border-fuchsia-500/40 bg-[#0E061A] p-6 sm:p-8 shadow-[0_0_50px_rgba(217,70,239,0.25)]">
        {/* Header Terminal */}
        <div className="flex items-center justify-between border-b border-fuchsia-500/20 pb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-fuchsia-300 font-bold ml-1">AUTH_GATEWAY // ROOT</span>
          </div>
          <span className="text-cyan-400 text-[10px]">RYAN_OS v4.2</span>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-fuchsia-950/80 border border-fuchsia-500/50 text-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            🔒
          </div>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-white">
            Painel Administrativo
          </h2>
          <p className="mt-1.5 text-xs text-fuchsia-200/70">
            Informe a credencial de segurança para gerenciar repositórios, skills, estante e capítulos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-fuchsia-300 mb-1.5">
              Senha Mestra de Acesso:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha..."
                required
                autoFocus
                className="w-full rounded-lg border border-fuchsia-500/40 bg-black/60 px-4 py-3 text-sm text-white placeholder-fuchsia-300/30 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xs text-fuchsia-400 hover:text-cyan-300 transition"
              >
                {showPassword ? "OCULTAR" : "VER"}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <span>⚠</span> {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-cyan-500 py-3 text-sm font-bold text-black transition hover:opacity-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:opacity-50"
          >
            {loading ? "AUTENTICANDO..." : "LIBERAR ACESSO ROOT ➔"}
          </button>
        </form>

        <div className="mt-6 border-t border-fuchsia-500/10 pt-3 text-center text-[10px] text-fuchsia-400/50">
          Ryan Ferreira • Portfólio Cinematográfico • 2026
        </div>
      </div>
    </div>
  );
}
