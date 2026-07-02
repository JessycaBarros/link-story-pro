import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Acesso · Painel Jessyca Barros" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg("Conta criada. Se pedirem confirmação, verifique seu e-mail. Depois faça login.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 font-sans text-foreground">
      <div className="w-full max-w-md rounded-[20px] border border-border/70 bg-card p-8 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.2)]">
        <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
          Painel interno
        </p>
        <h1 className="mt-3 font-serif text-3xl">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Acesse o painel para acompanhar leads e métricas."
            : "A primeira conta criada é automaticamente promovida a administrador."}
        </p>

        <form className="mt-6 flex flex-col gap-3" onSubmit={onSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Senha
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>

          {err && <p className="text-xs text-destructive">{err}</p>}
          {msg && <p className="text-xs text-primary">{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signin" ? "Entrar" : "Criar conta"}
          </button>

          <button
            type="button"
            onClick={() => {
              setErr(null);
              setMsg(null);
              setMode(mode === "signin" ? "signup" : "signin");
            }}
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            {mode === "signin" ? "Ainda não tenho conta" : "Já tenho conta"}
          </button>
        </form>
      </div>
    </main>
  );
}