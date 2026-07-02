import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Painel · Jessyca Barros" }] }),
  component: AdminDashboard,
});

type Lead = {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  stage: string | null;
  gargalo: string | null;
  solucao: string | null;
  faturamento: string | null;
  recommended_service: string | null;
  created_at: string;
};

type EventRow = { event_type: string; created_at: string; session_id: string | null };

const SERVICE_LABELS: Record<string, string> = {
  impulsione: "Impulsione",
  express: "Consultoria Express",
  personalizada: "Consultoria Personalizada",
  gestao: "Gestão de Tráfego",
  xdigital_automacoes: "XDigital · Automações",
  xdigital_sistemas: "XDigital · Sistemas",
};

const PIE_COLORS = ["#8b3a2e", "#c07158", "#d9a679", "#6b7c5a", "#8ba17a", "#a48bad"];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      const since = daysAgo(range).toISOString();
      const [{ data: l, error: le }, { data: e, error: ee }] = await Promise.all([
        supabase
          .from("leads")
          .select("*")
          .gte("created_at", since)
          .order("created_at", { ascending: false }),
        supabase
          .from("page_events")
          .select("event_type, created_at, session_id")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(10000),
      ]);
      if (le || ee) {
        setErr(le?.message || ee?.message || "Erro ao carregar dados");
        setLoading(false);
        return;
      }
      setLeads((l ?? []) as Lead[]);
      setEvents((e ?? []) as EventRow[]);
      setLoading(false);
    })();
  }, [range]);

  const stats = useMemo(() => {
    const uniqueSessions = new Set(events.map((x) => x.session_id).filter(Boolean));
    const pageviews = events.filter((x) => x.event_type === "pageview").length;
    const starts = events.filter((x) => x.event_type === "diagnostic_start").length;
    const completes = events.filter((x) => x.event_type === "diagnostic_complete").length;
    const totalLeads = leads.length;
    const conv = pageviews > 0 ? ((totalLeads / pageviews) * 100).toFixed(1) : "0.0";
    return {
      visitors: uniqueSessions.size,
      pageviews,
      starts,
      completes,
      totalLeads,
      conv,
    };
  }, [events, leads]);

  const dailySeries = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = range - 1; i >= 0; i--) {
      const d = daysAgo(i);
      buckets.set(d.toISOString().slice(0, 10), 0);
    }
    for (const l of leads) {
      const key = l.created_at.slice(0, 10);
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return Array.from(buckets.entries()).map(([date, leads]) => ({
      date: date.slice(5),
      leads,
    }));
  }, [leads, range]);

  const serviceDistribution = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads) {
      const k = l.recommended_service ?? "—";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return Array.from(map.entries())
      .map(([k, v]) => ({ name: SERVICE_LABELS[k] ?? k, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const funnel = useMemo(
    () => [
      { step: "Visitas", value: stats.visitors },
      { step: "Pageviews", value: stats.pageviews },
      { step: "Iniciou diagnóstico", value: stats.starts },
      { step: "Completou diagnóstico", value: stats.completes },
      { step: "Virou lead", value: stats.totalLeads },
    ],
    [stats],
  );

  const filteredLeads = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      [l.name, l.email, l.whatsapp, l.recommended_service ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [leads, filter]);

  function exportCsv() {
    const cols: (keyof Lead)[] = [
      "created_at",
      "name",
      "whatsapp",
      "email",
      "recommended_service",
      "stage",
      "gargalo",
      "solucao",
      "faturamento",
    ];
    const rows = [cols.join(",")];
    for (const l of filteredLeads) {
      rows.push(
        cols
          .map((c) => {
            const v = String(l[c] ?? "").replace(/"/g, '""');
            return `"${v}"`;
          })
          .join(","),
      );
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 font-sans text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
              Painel interno
            </p>
            <h1 className="mt-2 font-serif text-3xl">Métricas & Leads</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-full border border-border text-[11px] uppercase tracking-[0.16em]">
              {[7, 30, 90].map((n) => (
                <button
                  key={n}
                  onClick={() => setRange(n as 7 | 30 | 90)}
                  className={`px-4 py-2 transition ${
                    range === n ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {n}d
                </button>
              ))}
            </div>
            <button
              onClick={signOut}
              className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition hover:bg-muted"
            >
              Sair
            </button>
          </div>
        </header>

        {err && (
          <div className="mt-6 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {err}
          </div>
        )}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard label="Visitantes únicos" value={stats.visitors} />
          <KpiCard label="Pageviews" value={stats.pageviews} />
          <KpiCard label="Iniciaram diagnóstico" value={stats.starts} />
          <KpiCard label="Leads capturados" value={stats.totalLeads} />
          <KpiCard label="Conversão" value={`${stats.conv}%`} />
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel title="Leads por dia">
            {loading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={dailySeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} fontSize={11} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="leads"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Panel>

          <Panel title="Distribuição por serviço recomendado">
            {loading ? (
              <SkeletonChart />
            ) : serviceDistribution.length === 0 ? (
              <EmptyState label="Ainda sem leads no período" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={serviceDistribution}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label={(entry: { name?: string | number; value?: number }) =>
                      `${entry.name ?? ""} (${entry.value ?? 0})`
                    }
                    labelLine={false}
                  >
                    {serviceDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </section>

        <section className="mt-4">
          <Panel title="Funil de conversão">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={funnel} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" fontSize={11} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <YAxis type="category" dataKey="step" fontSize={11} stroke="hsl(var(--muted-foreground))" width={140} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>
        </section>

        <section className="mt-8">
          <Panel
            title="Leads"
            action={
              <div className="flex items-center gap-2">
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filtrar por nome, email, serviço..."
                  className="w-56 rounded-full border border-input bg-background px-4 py-2 text-xs outline-none focus:border-primary"
                />
                <button
                  onClick={exportCsv}
                  className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition hover:bg-muted"
                >
                  Exportar CSV
                </button>
              </div>
            }
          >
            <div className="-mx-6 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-border text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">Data</th>
                    <th className="px-3 py-3">Nome</th>
                    <th className="px-3 py-3">Contato</th>
                    <th className="px-3 py-3">Recomendação</th>
                    <th className="px-3 py-3">Momento</th>
                    <th className="px-3 py-3">Gargalo</th>
                    <th className="px-3 py-3">Faturamento</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td className="px-6 py-6 text-muted-foreground" colSpan={7}>
                        Carregando...
                      </td>
                    </tr>
                  )}
                  {!loading && filteredLeads.length === 0 && (
                    <tr>
                      <td className="px-6 py-6 text-muted-foreground" colSpan={7}>
                        Nenhum lead no período.
                      </td>
                    </tr>
                  )}
                  {filteredLeads.map((l) => (
                    <tr key={l.id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="whitespace-nowrap px-6 py-3 text-xs text-muted-foreground">
                        {fmtDate(l.created_at)}
                      </td>
                      <td className="px-3 py-3">{l.name}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        <div>{l.email}</div>
                        <div>{l.whatsapp}</div>
                      </td>
                      <td className="px-3 py-3">
                        {SERVICE_LABELS[l.recommended_service ?? ""] ?? l.recommended_service ?? "—"}
                      </td>
                      <td className="px-3 py-3 text-xs">{l.stage ?? "—"}</td>
                      <td className="px-3 py-3 text-xs">{l.gargalo ?? "—"}</td>
                      <td className="px-3 py-3 text-xs">{l.faturamento ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function SkeletonChart() {
  return <div className="h-[260px] animate-pulse rounded-lg bg-muted/40" />;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}