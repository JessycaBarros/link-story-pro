import { createFileRoute, Link } from "@tanstack/react-router";

const CALENDAR_SRC =
  "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&showPrint=0&src=Y29udGF0by5qZXNzeWNhYmFycm9zQGdtYWlsLmNvbQ&src=NmJmOGJiODY1MzhmNWYwYjgxZjQ2NzViY2FiZmI2YmUzZWI5MDdhMmY1YTA4MGIxMDJmMTY0MTg5NWM2Mzc5NEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NzhjMDE5Y2E0ZDQ4Y2Q3ZWM5OTJmOGNkZjUzMDIzNjc2NGZjMWJhYjY4YWI3MjEyMzdiZGQ2Mzk3MDE0YmU3M0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZTIxZjU2M2Y5YmY0MjVmNGExYzE3MjQ4YWIzMzAxMDFlZGNjM2JhN2U5NzAzZGVkZjkyNzk3YTlhZTFmYTE0MkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OGQwOTc2MTRmZWIzY2IzMjRhNDBhMzQyZjliNDg5MzkzZmEwMWI3YzFjZGYwY2ZjMTMxY2QxMTU4ZjFlZjgwYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=MDcyNmNlYzBkNTEyMjU1MWM1NmE0YzE3OGQxMzk5ZmMxYzVhMDM0MDNkYWE5ODg3YmY4MTk5MGE0NGYzMTgyMEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NTdmMmRiYjQ5MDQ0ZmFiYWY2YzI5ODczYzllZGI4YzdhYmU0ZmZhY2ZmNmY2NDIwNjRmYTA2NzA5ZWY3OTYwZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=ZGUzMDE4ZTRkZGNkNDI0MGI5NzI4MmI1ZTExODEyZjljOWM5Mjk5YmU2MzMwNDEzNDZhOTVjOTA3MzU0ZDcxN0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t&color=%23fe61a2&color=%23ff00e1&color=%239e69af&color=%23e67c73&color=%23d50000&color=%23f6bf26&color=%234285f4&color=%237986cb";

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
            title="Agenda Google — Jessyca Barros"
            className="h-[720px] w-full"
            style={{ border: 0 }}
            frameBorder={0}
            scrolling="no"
          />
        </div>
      </div>
    </main>
  );
}
