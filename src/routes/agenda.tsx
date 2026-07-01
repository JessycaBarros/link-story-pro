import { createFileRoute, Link } from "@tanstack/react-router";

const CALENDAR_SRC =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2A-j1jcksAtKqitswPmBykkpirUXuA9dFI5-worRs5zPNcCFy3EjtWl2DkWuPM7Os6W46mCxAZ?gv=true";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agendar reunião — Jessyca Barros" },
      {
        name: "description",
        content: "Consulte a agenda de Jessyca Barros e reserve o melhor horário para conversarmos.",
      },
      { property: "og:title", content: "Agendar reunião — Jessyca Barros" },
      {
        property: "og:description",
        content: "Reserve o melhor horário para conversarmos sobre a estratégia do seu negócio.",
      },
    ],
  }),
  component: AgendaPage,
});

function AgendaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-16">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            ← Voltar
          </Link>
          <span className="font-serif text-xs italic text-muted-foreground">Agenda</span>
        </div>

        <header className="mt-10 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-primary/80">
            Agendar reunião
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-[42px]">
            Escolha o melhor horário
          </h1>
          <div className="mx-auto mt-5 h-px w-12 bg-primary/40" />
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Consulte a disponibilidade abaixo e reserve o horário que fizer mais sentido para
            conversarmos sobre a estratégia do seu negócio.
          </p>
        </header>

        <div className="mt-10 overflow-hidden rounded-[20px] border border-border/70 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_50px_-30px_rgba(0,0,0,0.15)]">
          <iframe
            src={CALENDAR_SRC}
            title="Agendar reunião — Jessyca Barros"
            className="h-[600px] w-full"
            style={{ border: 0 }}
            frameBorder={0}
          />
        </div>
      </div>
    </main>
  );
}
