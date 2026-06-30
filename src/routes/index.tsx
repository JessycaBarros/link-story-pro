import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Instagram, MessageCircle, ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jessyca Barros — Tráfego estratégico e crescimento de negócios" },
      {
        name: "description",
        content:
          "Concierge inteligente: responda algumas perguntas e descubra a melhor solução em tráfego, consultoria e automação para o seu negócio.",
      },
      { property: "og:title", content: "Jessyca Barros — Link da Bio" },
      {
        property: "og:description",
        content:
          "Tráfego, estratégia e automação para transformar atenção em vendas.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://jessycabarros.com/assets/jessyca-3-CWIMZZ2n.png",
      },
    ],
  }),
  component: BioLink,
});

type ServiceKey = "impulsione" | "consultoria" | "gestao" | "xdigital";

const SERVICES: Record<
  ServiceKey,
  {
    emoji: string;
    title: string;
    description: string;
    cta: string;
    href: string;
    tag: string;
  }
> = {
  impulsione: {
    emoji: "🚀",
    title: "Impulsione",
    tag: "Curso",
    description:
      "Aprenda a anunciar no Instagram do jeito certo, sem depender de agência. Atraia seguidores qualificados, venda mais e crie campanhas estratégicas por conta própria. Ideal para quem está começando ou quer economizar na gestão de tráfego.",
    cta: "Quero aprender a anunciar",
    href: "https://pay.kiwify.com.br/O7BUYuq",
  },
  consultoria: {
    emoji: "🎯",
    title: "Consultoria Individual",
    tag: "Consultoria",
    description:
      "Um plano estratégico feito para o seu negócio. Analiso seu conteúdo, posicionamento, anúncios e estratégia de crescimento para mostrar exatamente o que fazer para vender mais e crescer com previsibilidade. Você sai com direcionamento claro, plano de ação e acompanhamento.",
    cta: "Quero uma estratégia personalizada",
    href: "https://form.respondi.app/MYzZhNbv",
  },
  gestao: {
    emoji: "📈",
    title: "Gestão de Tráfego",
    tag: "Serviço premium",
    description:
      "Enquanto você cuida do seu negócio, eu cuido do crescimento. Planejo, crio, acompanho e otimizo suas campanhas para atrair clientes qualificados e transformar anúncios em vendas. Estratégia, análise de dados e decisões baseadas no que realmente gera resultado.",
    cta: "Quero que alguém gerencie meus anúncios",
    href: "https://form.respondi.app/eGQCKlLh",
  },
  xdigital: {
    emoji: "⚙️",
    title: "XDigital Mídia",
    tag: "IA + Automação",
    description:
      "Tecnologia para empresas que querem crescer com eficiência. Desenvolvemos automações, dashboards (BI), integrações, sistemas personalizados e soluções inteligentes para reduzir processos manuais e aumentar a produtividade da sua empresa.",
    cta: "Quero automatizar minha empresa",
    href: "https://form.respondi.app/PotXEtbz",
  },
};

type Step =
  | { kind: "start" }
  | { kind: "q"; id: string }
  | { kind: "lead"; service: ServiceKey }
  | { kind: "result"; service: ServiceKey };

type Option = { label: string; next: Step };

const FLOW: Record<string, { question: string; options: Option[] }> = {
  root: {
    question: "Qual é o seu principal objetivo neste momento para o seu negócio?",
    options: [
      { label: "🚀 Quero aprender a anunciar", next: { kind: "q", id: "aprender" } },
      { label: "🎯 Quero uma estratégia personalizada", next: { kind: "q", id: "estrategia" } },
      { label: "📈 Quero que alguém gerencie meus anúncios", next: { kind: "q", id: "gestao" } },
      { label: "⚙️ Quero automatizar minha empresa", next: { kind: "q", id: "automatizar" } },
    ],
  },
  aprender: {
    question: "Qual o seu nível de experiência com anúncios pagos?",
    options: [
      { label: "Sou iniciante / quero fazer por conta própria", next: { kind: "lead", service: "impulsione" } },
      { label: "Já faço, mas quero otimizar / não tenho tempo", next: { kind: "lead", service: "gestao" } },
    ],
  },
  estrategia: {
    question: "Você busca um plano de ação detalhado ou uma gestão completa?",
    options: [
      { label: "Preciso de um plano e acompanhamento para implementar", next: { kind: "lead", service: "consultoria" } },
      { label: "Quero delegar a execução e focar no meu negócio", next: { kind: "lead", service: "gestao" } },
    ],
  },
  gestao: {
    question: "Qual o faturamento médio mensal do seu negócio?",
    options: [
      { label: "Até R$ 5 mil", next: { kind: "lead", service: "impulsione" } },
      { label: "Entre R$ 5 mil e R$ 20 mil", next: { kind: "lead", service: "consultoria" } },
      { label: "Acima de R$ 20 mil", next: { kind: "lead", service: "gestao" } },
    ],
  },
  automatizar: {
    question: "Qual o principal desafio que a automação resolveria?",
    options: [
      { label: "Reduzir processos manuais e aumentar produtividade", next: { kind: "lead", service: "xdigital" } },
      { label: "Melhorar atendimento e qualificação de leads", next: { kind: "lead", service: "xdigital" } },
    ],
  },
};

function BioLink() {
  const [history, setHistory] = useState<Step[]>([{ kind: "start" }]);
  const step = history[history.length - 1];

  const go = (s: Step) => setHistory((h) => [...h, s]);
  const back = () => setHistory((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const restart = () => setHistory([{ kind: "start" }]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-xl px-5 pb-20 pt-10 sm:pt-14">
        <Header />

        <section className="mt-8">
          {step.kind === "start" && <StartCard onStart={() => go({ kind: "q", id: "root" })} />}

          {step.kind === "q" && (
            <QuestionCard
              data={FLOW[step.id]}
              onPick={go}
              onBack={history.length > 1 ? back : undefined}
            />
          )}

          {step.kind === "lead" && (
            <LeadCard
              service={SERVICES[step.service]}
              onSkip={() => go({ kind: "result", service: step.service })}
              onSubmit={() => go({ kind: "result", service: step.service })}
              onBack={back}
            />
          )}

          {step.kind === "result" && (
            <ResultCard service={SERVICES[step.service]} onRestart={restart} />
          )}
        </section>

        <Divider label="Todos os serviços" />
        <ServiceGrid />

        <Divider label="Conecte-se" />
        <SocialLinks />

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Jessyca Barros. Todos os direitos reservados.
        </footer>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" aria-hidden />
        <img
          src="https://jessycabarros.com/assets/jessyca-3-CWIMZZ2n.png"
          alt="Jessyca Barros"
          className="relative h-28 w-28 rounded-full object-cover ring-4 ring-background shadow-lg sm:h-32 sm:w-32"
          loading="eager"
        />
      </div>
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Jessyca Barros
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
        Especialista em <span className="text-primary font-medium">tráfego estratégico</span> e
        crescimento de negócios.
      </p>
    </header>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7">
      {children}
    </div>
  );
}

function StartCard({ onStart }: { onStart: () => void }) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
        <Sparkles className="h-4 w-4" />
        Concierge inteligente
      </div>
      <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-[26px]">
        Vamos descobrir a solução ideal para você?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Responda 2 perguntas rápidas e eu te direciono para o serviço certo no seu momento.
      </p>
      <button
        onClick={onStart}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
      >
        Começar agora
        <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
}

function QuestionCard({
  data,
  onPick,
  onBack,
}: {
  data: { question: string; options: Option[] };
  onPick: (s: Step) => void;
  onBack?: () => void;
}) {
  return (
    <Card>
      {onBack && (
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Voltar
        </button>
      )}
      <h2 className="font-serif text-xl leading-snug sm:text-2xl">{data.question}</h2>
      <div className="mt-5 flex flex-col gap-2.5">
        {data.options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onPick(opt.next)}
            className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3.5 text-left text-sm font-medium transition hover:border-primary hover:bg-primary/5"
          >
            <span>{opt.label}</span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
          </button>
        ))}
      </div>
    </Card>
  );
}

function LeadCard({
  service,
  onSubmit,
  onSkip,
  onBack,
}: {
  service: (typeof SERVICES)[ServiceKey];
  onSubmit: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const valid = form.name.trim() && form.whatsapp.trim() && form.email.trim();

  return (
    <Card>
      <button
        onClick={onBack}
        className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" /> Voltar
      </button>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
        <Check className="h-4 w-4" /> Recomendação encontrada
      </div>
      <h2 className="mt-2 font-serif text-2xl leading-snug">
        {service.emoji} {service.title} é o caminho ideal para você.
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Deixe seu contato para receber o direcionamento personalizado e condições exclusivas.
      </p>
      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          // Pass lead data through to the destination if it supports query params
          onSubmit();
        }}
      >
        <Field
          label="Nome"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Seu nome"
        />
        <Field
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(v) => setForm({ ...form, whatsapp: v })}
          placeholder="(11) 99999-9999"
          type="tel"
        />
        <Field
          label="E-mail"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          placeholder="voce@email.com"
          type="email"
        />
        <button
          type="submit"
          disabled={!valid}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          Ver minha recomendação
          <ArrowRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Pular e ver o serviço
        </button>
      </form>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function ResultCard({
  service,
  onRestart,
}: {
  service: (typeof SERVICES)[ServiceKey];
  onRestart: () => void;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
        <Sparkles className="h-4 w-4" /> Sua recomendação
      </div>
      <h2 className="mt-2 font-serif text-2xl leading-snug">
        {service.emoji} {service.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      <a
        href={service.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
      >
        {service.cta}
        <ArrowRight className="h-4 w-4" />
      </a>
      <button
        onClick={onRestart}
        className="mt-3 inline-flex w-full items-center justify-center text-xs text-muted-foreground hover:text-foreground"
      >
        Refazer qualificação
      </button>
    </Card>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-10 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ServiceGrid() {
  const list = useMemo(() => Object.values(SERVICES), []);
  return (
    <div className="grid gap-4">
      {list.map((s) => (
        <article
          key={s.title}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground">
                {s.tag}
              </span>
              <h3 className="mt-2 font-serif text-lg leading-snug">
                {s.emoji} {s.title}
              </h3>
            </div>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            {s.cta} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </article>
      ))}
    </div>
  );
}

function SocialLinks() {
  const links = [
    {
      label: "WhatsApp",
      href: "https://wa.me/5500000000000",
      icon: MessageCircle,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/jessycabarros",
      icon: Instagram,
    },
    {
      label: "Site oficial",
      href: "https://jessycabarros.com/",
      icon: ArrowRight,
    },
  ];
  return (
    <div className="grid gap-2.5">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition hover:border-primary hover:bg-primary/5"
        >
          <span className="flex items-center gap-3">
            <l.icon className="h-4 w-4 text-primary" />
            {l.label}
          </span>
          <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </a>
      ))}
    </div>
  );
}