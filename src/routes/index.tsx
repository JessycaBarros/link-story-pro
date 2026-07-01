import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Instagram, MessageCircle, ArrowRight, ArrowLeft, Check, Sparkles, Calendar } from "lucide-react";

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
    tag: "Consultoria personalizada",
    description:
      "Um plano estratégico feito para o seu negócio. Analiso seu conteúdo, posicionamento, anúncios e estratégia de crescimento para mostrar exatamente o que fazer para vender mais e crescer com previsibilidade. Você sai com direcionamento claro, plano de ação e acompanhamento para acelerar resultados.",
    cta: "Quero uma estratégia personalizada",
    href: "https://form.respondi.app/MYzZhNbv",
  },
  gestao: {
    emoji: "📈",
    title: "Gestão de Tráfego",
    tag: "Serviço premium",
    description:
      "Enquanto você cuida do seu negócio, eu cuido do crescimento. Planejo, crio, acompanho e otimizo suas campanhas para atrair clientes qualificados e transformar anúncios em vendas. Muito além de apertar botões: estratégia, análise de dados e decisões baseadas no que realmente gera resultado. Ideal para empresas que querem escalar com previsibilidade.",
    cta: "Quero que alguém gerencie meus anúncios",
    href: "https://form.respondi.app/eGQCKlLh",
  },
  xdigital: {
    emoji: "⚙️",
    title: "XDigital Mídia",
    tag: "IA + Automação",
    description:
      "Tecnologia para empresas que querem crescer com eficiência. Desenvolvemos automações, dashboards (BI), integrações, sistemas personalizados e soluções inteligentes para reduzir processos manuais e aumentar a produtividade da sua empresa. Menos operação. Mais estratégia.",
    cta: "Quero automatizar minha empresa",
    href: "https://form.respondi.app/PotXEtbz",
  },
};

type StageKey = "comecando" | "depende_de_mim" | "travada" | "escalar";
type GargaloKey = "atrair" | "vender" | "processos" | "estrategia" | "nao_sei";
type FormatoKey = "ritmo" | "orientacao";

type Answers = {
  stage?: StageKey;
  gargalo?: GargaloKey;
  formato?: FormatoKey;
};

type Step =
  | { kind: "start" }
  | { kind: "q1" }
  | { kind: "q2" }
  | { kind: "q3" }
  | { kind: "lead" }
  | { kind: "result" };

const STAGE_OPTIONS: { value: StageKey; label: string }[] = [
  { value: "comecando", label: "Estou começando agora e ainda não vendo de forma consistente." },
  { value: "depende_de_mim", label: "Já vendo, mas tudo depende de mim." },
  { value: "travada", label: "Tenho clientes e faturamento, mas sinto que travei para crescer." },
  { value: "escalar", label: "Quero escalar meu negócio com estratégia." },
];

const GARGALO_OPTIONS: { value: GargaloKey; label: string }[] = [
  { value: "atrair", label: "Não consigo atrair clientes." },
  { value: "vender", label: "Não sei vender." },
  { value: "processos", label: "Não consigo organizar meus processos." },
  { value: "estrategia", label: "Tenho clientes, mas falta estratégia para escalar." },
  { value: "nao_sei", label: "Não sei exatamente onde está o problema." },
];

const FORMATO_OPTIONS: { value: FormatoKey; label: string }[] = [
  { value: "ritmo", label: "Quero aprender e aplicar no meu ritmo." },
  { value: "orientacao", label: "Quero alguém analisando meu caso e dizendo exatamente o que fazer." },
];

function recommend(a: Required<Answers>): { service: ServiceKey; reason: string } {
  const stageText: Record<StageKey, string> = {
    comecando: "você está no início e ainda construindo consistência",
    depende_de_mim: "seu negócio já vende, mas hoje depende muito de você",
    travada: "você já tem clientes e faturamento, mas sente que travou para crescer",
    escalar: "você quer escalar com estratégia e previsibilidade",
  };
  const gargaloText: Record<GargaloKey, string> = {
    atrair: "o principal gargalo é atrair clientes e crescer a base",
    vender: "o desafio central é vender mais e converter melhor",
    processos: "o ponto a destravar é organização e processos",
    estrategia: "falta uma estratégia clara para escalar",
    nao_sei: "ainda não está claro onde está o principal gargalo",
  };

  let service: ServiceKey;
  if (a.formato === "ritmo") {
    // Autonomia: método para aplicar sozinha
    service = "impulsione";
  } else {
    // orientacao: alguém analisa e diz o que fazer
    if (a.gargalo === "processos" && (a.stage === "escalar" || a.stage === "travada")) {
      service = "xdigital";
    } else if (
      a.gargalo === "atrair" &&
      (a.stage === "depende_de_mim" || a.stage === "travada" || a.stage === "escalar")
    ) {
      service = "gestao";
    } else {
      service = "consultoria";
    }
  }

  const why: Record<ServiceKey, string> = {
    impulsione:
      "o Impulsione é o caminho certo: você terá o método completo para estruturar sua operação, validar sua oferta e atrair clientes qualificados aplicando no seu ritmo — sem depender de agência.",
    consultoria:
      "a Consultoria Individual é a melhor escolha: um plano estratégico feito para o seu momento, identificando gargalos e mostrando exatamente o que fazer para vender mais e crescer com previsibilidade.",
    gestao:
      "a Gestão de Tráfego entrega o que você precisa: estratégia, execução e otimização das campanhas para transformar anúncios em vendas previsíveis.",
    xdigital:
      "a XDigital Mídia é a indicação: automações, integrações e BI para reduzir processos manuais e dar escala operacional ao seu negócio.",
  };

  const reason = `Pelas suas respostas, percebi que ${stageText[a.stage]} e que ${gargaloText[a.gargalo]}. Por isso, ${why[service]}`;
  return { service, reason };
}

function BioLink() {
  const [step, setStep] = useState<Step>({ kind: "start" });
  const [answers, setAnswers] = useState<Answers>({});

  const restart = () => {
    setAnswers({});
    setStep({ kind: "start" });
  };

  const reco = useMemo(() => {
    if (answers.stage && answers.gargalo && answers.formato) {
      return recommend(answers as Required<Answers>);
    }
    return null;
  }, [answers]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-xl px-5 pb-20 pt-10 sm:pt-14">
        <Header />

        <section className="mt-8">
          {step.kind === "start" && <StartCard onStart={() => setStep({ kind: "q1" })} />}

          {step.kind === "q1" && (
            <QuestionCard
              step={1}
              total={3}
              intro="Antes de indicar o melhor caminho, preciso entender o seu momento. São 3 perguntas rápidas — menos de 1 minuto."
              question="Qual dessas situações mais parece com você hoje?"
              options={STAGE_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
              onPick={(v) => {
                setAnswers((a) => ({ ...a, stage: v as StageKey }));
                setStep({ kind: "q2" });
              }}
            />
          )}

          {step.kind === "q2" && (
            <QuestionCard
              step={2}
              total={3}
              question="Hoje, o que mais impede seu negócio de crescer?"
              options={GARGALO_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
              onPick={(v) => {
                setAnswers((a) => ({ ...a, gargalo: v as GargaloKey }));
                setStep({ kind: "q3" });
              }}
              onBack={() => setStep({ kind: "q1" })}
            />
          )}

          {step.kind === "q3" && (
            <QuestionCard
              step={3}
              total={3}
              question="Como você prefere evoluir a partir de agora?"
              options={FORMATO_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
              onPick={(v) => {
                setAnswers((a) => ({ ...a, formato: v as FormatoKey }));
                setStep({ kind: "lead" });
              }}
              onBack={() => setStep({ kind: "q2" })}
            />
          )}

          {step.kind === "lead" && reco && (
            <LeadCard
              service={SERVICES[reco.service]}
              reason={reco.reason}
              onSkip={() => setStep({ kind: "result" })}
              onSubmit={() => setStep({ kind: "result" })}
              onBack={() => setStep({ kind: "q3" })}
            />
          )}

          {step.kind === "result" && reco && (
            <ResultCard
              service={SERVICES[reco.service]}
              reason={reco.reason}
              onRestart={restart}
            />
          )}
        </section>

        <Divider label="Todos os serviços" />
        <ServiceGrid />

        <Divider label="Conecte-se" />
        <SocialLinks />

        <Divider label="Sobre" />
        <div className="rounded-2xl border border-border bg-card p-6 text-sm leading-relaxed text-foreground/80 sm:p-7">
          <p className="font-serif text-lg italic text-foreground">
            "Nem todo negócio precisa investir mais. Muitos só precisam da estratégia certa."
          </p>
          <p className="mt-3">
            Sou <strong>Jessyca Barros</strong>, especialista em tráfego pago, crescimento
            de negócios e performance. Desenvolvo estratégias que unem posicionamento,
            anúncios e crescimento de audiência para transformar visibilidade em vendas.
          </p>
          <p className="mt-3 text-muted-foreground">
            Meu objetivo é simples: fazer com que seu negócio seja encontrado pelas pessoas certas.
          </p>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
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
        Diagnóstico estratégico
      </div>
      <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-[26px]">
        Vamos descobrir qual é o próximo passo certo para o seu negócio?
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Antes de indicar qualquer solução, preciso entender o seu momento. São 3 perguntas rápidas
        e em menos de 1 minuto eu te mostro o caminho ideal — baseado na sua realidade, não em regra fixa.
      </p>
      <button
        onClick={onStart}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
      >
        Começar diagnóstico
        <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  );
}

function QuestionCard({
  question,
  options,
  onPick,
  onBack,
  step,
  total,
  intro,
}: {
  question: string;
  options: { label: string; value: string }[];
  onPick: (value: string) => void;
  onBack?: () => void;
  step: number;
  total: number;
  intro?: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Voltar
          </button>
        ) : (
          <span />
        )}
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {step} de {total}
        </span>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      {intro && (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      )}
      <h2 className="mt-4 font-serif text-xl leading-snug sm:text-2xl">{question}</h2>
      <div className="mt-5 flex flex-col gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onPick(opt.value)}
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
  reason,
  onSubmit,
  onSkip,
  onBack,
}: {
  service: (typeof SERVICES)[ServiceKey];
  reason: string;
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
        {service.emoji} {service.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{reason}</p>
      <p className="mt-3 text-sm text-muted-foreground">
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
  reason,
  onRestart,
}: {
  service: (typeof SERVICES)[ServiceKey];
  reason: string;
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
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{reason}</p>
      <div className="mt-4 rounded-xl bg-secondary/60 p-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      </div>
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
        Refazer diagnóstico
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
      label: "Agendar reunião",
      href: "https://form.respondi.app/MYzZhNbv",
      icon: Calendar,
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