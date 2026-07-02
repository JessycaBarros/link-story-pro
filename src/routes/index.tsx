import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import heroAsset from "@/assets/jessyca-hero.jpg.asset.json";
import aboutAsset from "@/assets/jessyca-about.png.asset.json";
import { submitLead, trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jessyca Barros — Tráfego estratégico e crescimento de negócios" },
      {
        name: "description",
        content:
          "Concierge estratégico: em 4 perguntas eu identifico o próximo passo ideal para o seu negócio — do método à consultoria personalizada.",
      },
      { property: "og:title", content: "Jessyca Barros — Link da Bio" },
      {
        property: "og:description",
        content: "Estratégia, tráfego e tecnologia para transformar atenção em vendas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroAsset.url },
    ],
  }),
  component: BioLink,
});

type ServiceKey =
  | "impulsione"
  | "express"
  | "personalizada"
  | "gestao"
  | "xdigital_automacoes"
  | "xdigital_sistemas";

const SERVICES: Record<
  ServiceKey,
  {
    title: string;
    tag: string;
    description: string;
    message: string;
    cta: string;
    href: string;
    secondary?: { label: string; href: string };
  }
> = {
  impulsione: {
    title: "Impulsione",
    tag: "Método",
    description:
      "O método completo para validar sua oferta, atrair os primeiros clientes e fazer caixa — construindo uma base sólida para o seu negócio começar a vender de forma consistente.",
    message:
      "O seu momento agora é criar tração e fazer caixa. O Impulsione foi desenhado para quem está começando ou ainda não vende de forma consistente — você aprende, aplica e cria uma base para crescer sem precisar terceirizar nada agora.",
    cta: "Quero acessar o Impulsione",
    href: "https://pay.kiwify.com.br/rubcahV",
  },
  express: {
    title: "Consultoria Express",
    tag: "Diagnóstico estratégico",
    description:
      "Um mergulho rápido e estratégico no seu negócio para encontrar o gargalo real e sair com um plano de ação claro — sem precisar contratar acompanhamento longo.",
    message:
      "Você já validou que consegue vender, mas está travada e o faturamento ainda não decolou. Antes de investir em execução ou tráfego, precisamos identificar exatamente onde está o gargalo e destravar o crescimento com um plano objetivo.",
    cta: "Quero minha Consultoria Express",
    href: "https://form.respondi.app/MYzZhNbv",
  },
  personalizada: {
    title: "Consultoria Personalizada",
    tag: "Acompanhamento estratégico",
    description:
      "Acompanhamento estratégico completo: construção de oferta, funil de vendas, posicionamento e estruturação do negócio para você escalar com previsibilidade.",
    message:
      "Você já vende, mas precisa estruturar oferta, funil e estratégia para escalar de verdade. Nesta consultoria construímos um plano estratégico completo e eu acompanho a implementação junto com você.",
    cta: "Quero acompanhamento estratégico",
    href: "https://form.respondi.app/MYzZhNbv",
  },
  gestao: {
    title: "Gestão de Tráfego",
    tag: "Aquisição de clientes",
    description:
      "Estratégia, execução e otimização de campanhas para atrair mais clientes com previsibilidade — feita por quem entende o seu negócio como um todo, não só o anúncio.",
    message:
      "Sua oferta já é validada, o processo comercial funciona e agora você precisa de volume. Este é o momento de delegar os anúncios para um especialista e ganhar previsibilidade sem sobrecarregar sua rotina.",
    cta: "Quero delegar meus anúncios",
    href: "https://form.respondi.app/eGQCKlLh",
  },
  xdigital_automacoes: {
    title: "XDigital · Automações",
    tag: "IA, WhatsApp & atendimento",
    description:
      "Automatize atendimento, follow-up e CRM com IA e WhatsApp para economizar tempo, escalar operação e aumentar suas conversões.",
    message:
      "Seu maior gargalo hoje é tempo. Você perde horas em atendimento manual e operação repetitiva. As automações da XDigital colocam IA, WhatsApp e CRM trabalhando por você — 24/7.",
    cta: "Quero automatizar meu atendimento",
    href: "https://form.respondi.app/nNtzMprL",
  },
  xdigital_sistemas: {
    title: "XDigital · Sistemas Personalizados",
    tag: "Tecnologia sob medida",
    description:
      "Desenvolvimento de sistemas internos, plataformas, dashboards, portais e softwares personalizados para digitalizar processos e escalar operações complexas.",
    message:
      "Sua empresa precisa de tecnologia sob medida — não uma ferramenta genérica adaptada. A XDigital desenvolve sistemas, dashboards e plataformas específicas para o seu negócio operar com eficiência real.",
    cta: "Quero um sistema sob medida",
    href: "https://form.respondi.app/nNtzMprL",
  },
};

type StageKey = "comecando" | "depende_de_mim" | "travada" | "escalar";
type GargaloKey = "atrair" | "conteudo" | "anuncios" | "processos" | "nao_sei";
type SolucaoKey = "aprender" | "especialista" | "anuncios" | "automatizar" | "sistema";
type FatKey =
  | "0"
  | "1_2"
  | "3_5"
  | "6_8"
  | "9_10"
  | "10_15"
  | "20_30"
  | "40_mais";

type Answers = {
  stage?: StageKey;
  gargalo?: GargaloKey;
  solucao?: SolucaoKey;
  faturamento?: FatKey;
};

type Step =
  | { kind: "start" }
  | { kind: "q1" }
  | { kind: "q2" }
  | { kind: "q3" }
  | { kind: "q4" }
  | { kind: "analyzing" }
  | { kind: "lead" }
  | { kind: "result" };

const STAGE_OPTIONS: { value: StageKey; label: string }[] = [
  { value: "comecando", label: "Estou começando e ainda não vendo de forma consistente." },
  { value: "depende_de_mim", label: "Já vendo, mas tudo depende de mim." },
  { value: "travada", label: "Tenho clientes e faturamento, mas sinto que travei para crescer." },
  { value: "escalar", label: "Quero escalar meu negócio com mais previsibilidade." },
];

const GARGALO_OPTIONS: { value: GargaloKey; label: string }[] = [
  { value: "atrair", label: "Não consigo atrair clientes de forma consistente." },
  { value: "conteudo", label: "Meu conteúdo não gera vendas." },
  { value: "anuncios", label: "Meus anúncios não dão resultado (ou ainda nem sei anunciar)." },
  { value: "processos", label: "Estou perdendo muito tempo com processos, atendimento ou operação." },
  { value: "nao_sei", label: "Não sei exatamente onde está o problema." },
];

const SOLUCAO_OPTIONS: { value: SolucaoKey; label: string }[] = [
  { value: "aprender", label: "Aprender um método para estruturar e crescer meu negócio." },
  { value: "especialista", label: "Um especialista analisando meu negócio e criando um plano estratégico." },
  { value: "anuncios", label: "Atrair mais clientes com anúncios." },
  { value: "automatizar", label: "Automatizar meu atendimento e processos." },
  { value: "sistema", label: "Desenvolver um sistema personalizado para minha empresa." },
];

const FAT_OPTIONS: { value: FatKey; label: string }[] = [
  { value: "0", label: "Ainda não faturo." },
  { value: "1_2", label: "R$ 1k a R$ 2k por mês." },
  { value: "3_5", label: "R$ 3k a R$ 5k por mês." },
  { value: "6_8", label: "R$ 6k a R$ 8k por mês." },
  { value: "9_10", label: "R$ 9k a R$ 10k por mês." },
  { value: "10_15", label: "R$ 10k a R$ 15k por mês." },
  { value: "20_30", label: "R$ 20k a R$ 30k por mês." },
  { value: "40_mais", label: "Acima de R$ 40k por mês." },
];

const LOW_REVENUE: FatKey[] = ["0", "1_2"];
const MID_REVENUE: FatKey[] = ["3_5", "6_8"];

function recommend(a: Required<Answers>): ServiceKey {
  const low = LOW_REVENUE.includes(a.faturamento);
  const mid = MID_REVENUE.includes(a.faturamento);

  // Q3 drives the recommendation; faturamento refina consultoria/gestão.
  switch (a.solucao) {
    case "aprender":
      return "impulsione";

    case "sistema":
      return "xdigital_sistemas";

    case "automatizar":
      return "xdigital_automacoes";

    case "anuncios":
      // Sem verba para gestão profissional → aprender a anunciar primeiro.
      if (low) return "impulsione";
      return "gestao";

    case "especialista":
      // Faturamento baixo ou começando → Consultoria Express (diagnóstico rápido).
      if (low || a.stage === "comecando") return "express";
      // Faturamento médio + já vende, mas travada → Express também cabe.
      if (mid && a.stage === "depende_de_mim") return "express";
      return "personalizada";
  }
}

function BioLink() {
  const [step, setStep] = useState<Step>({ kind: "start" });
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    trackEvent("pageview");
  }, []);

  const restart = () => {
    setAnswers({});
    setStep({ kind: "start" });
  };

  const service = useMemo<ServiceKey | null>(() => {
    if (answers.stage && answers.gargalo && answers.solucao && answers.faturamento) {
      return recommend(answers as Required<Answers>);
    }
    return null;
  }, [answers]);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      <div className="mx-auto max-w-xl px-5 pb-24 pt-12 sm:pt-16">
        <Header />

        <section className="mt-10">
          {step.kind === "start" && (
            <StartCard
              onStart={() => {
                trackEvent("diagnostic_start");
                setStep({ kind: "q1" });
              }}
            />
          )}

          {step.kind === "q1" && (
            <QuestionCard
              step={1}
              total={4}
              intro="Em 4 perguntas rápidas eu identifico o próximo passo ideal para o seu momento. Menos de 1 minuto."
              question="Qual dessas situações mais parece com você hoje?"
              options={STAGE_OPTIONS}
              onPick={(v) => {
                setAnswers((a) => ({ ...a, stage: v as StageKey }));
                setStep({ kind: "q2" });
              }}
            />
          )}

          {step.kind === "q2" && (
            <QuestionCard
              step={2}
              total={4}
              question="Hoje, qual é o maior gargalo do seu negócio?"
              options={GARGALO_OPTIONS}
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
              total={4}
              question="Qual solução você acredita que mais precisa hoje?"
              options={SOLUCAO_OPTIONS}
              onPick={(v) => {
                setAnswers((a) => ({ ...a, solucao: v as SolucaoKey }));
                setStep({ kind: "q4" });
              }}
              onBack={() => setStep({ kind: "q2" })}
            />
          )}

          {step.kind === "q4" && (
            <QuestionCard
              step={4}
              total={4}
              question="Qual a média de faturamento mensal do seu negócio hoje?"
              options={FAT_OPTIONS}
              onPick={(v) => {
                const next = { ...answers, faturamento: v as FatKey } as Required<Answers>;
                setAnswers(next);
                trackEvent("diagnostic_complete", {
                  ...next,
                  recommended: recommend(next),
                });
                setStep({ kind: "analyzing" });
              }}
              onBack={() => setStep({ kind: "q3" })}
            />
          )}

          {step.kind === "analyzing" && (
            <AnalyzingCard onDone={() => setStep({ kind: "lead" })} />
          )}

          {step.kind === "lead" && service && (
            <LeadCard
              service={SERVICES[service]}
              onSkip={() => setStep({ kind: "result" })}
              onSubmit={() => setStep({ kind: "result" })}
            />
          )}

          {step.kind === "result" && service && (
            <ResultCard service={SERVICES[service]} onRestart={restart} />
          )}
        </section>

        <Divider label="Todos os serviços" />
        <ServiceGrid />

        <Divider label="Conecte-se" />
        <SocialLinks />

        <Divider label="Sobre" />
        <AboutSection />

        <footer className="mt-12 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          © {new Date().getFullYear()} Jessyca Barros
        </footer>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center text-center">
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/10 blur-2xl" aria-hidden />
        <img
          src={heroAsset.url}
          alt="Jessyca Barros"
          className="relative h-32 w-32 rounded-full object-cover shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] ring-1 ring-primary/20 sm:h-36 sm:w-36"
          style={{ objectPosition: "50% 35%" }}
          loading="eager"
        />
      </div>
      <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.32em] text-primary/80">
        Estratégia · Tráfego · Crescimento
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight sm:text-[42px]">
        Jessyca Barros
      </h1>
      <div className="mt-4 h-px w-12 bg-primary/40" aria-hidden />
      <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
        Transformo atenção em vendas através de posicionamento, anúncios e tecnologia — com
        estratégia sob medida para o seu momento.
      </p>
    </header>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/70 bg-card p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_50px_-30px_rgba(0,0,0,0.15)] sm:p-8">
      {children}
    </div>
  );
}

function StartCard({ onStart }: { onStart: () => void }) {
  return (
    <Card>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
        Diagnóstico estratégico
      </p>
      <h2 className="mt-4 font-serif text-[26px] leading-[1.15] sm:text-[30px]">
        Vamos descobrir qual é o próximo passo certo para o seu negócio?
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Em 4 perguntas rápidas eu analiso o seu momento e recomendo apenas <em>uma</em> solução —
        aquela com maior potencial de destravar o seu crescimento agora.
      </p>
      <button
        onClick={onStart}
        className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90"
      >
        Começar diagnóstico
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
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
          >
            ← Voltar
          </button>
        ) : (
          <span />
        )}
        <span className="font-serif text-xs italic text-muted-foreground">
          {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-4 h-[2px] w-full overflow-hidden bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      {intro && (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      )}
      <h2 className="mt-5 font-serif text-[22px] leading-snug sm:text-[24px]">{question}</h2>
      <div className="mt-6 flex flex-col gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onPick(opt.value)}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-background px-5 py-4 text-left text-[14px] leading-snug transition hover:border-primary/60 hover:bg-primary/[0.04]"
          >
            <span>{opt.label}</span>
            <span className="shrink-0 font-serif text-lg text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5">
              →
            </span>
          </button>
        ))}
      </div>
    </Card>
  );
}

function AnalyzingCard({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const phrases = [
    "Analisando suas respostas...",
    "Comparando seu momento com os caminhos disponíveis...",
    "Encontramos a solução com maior potencial para você.",
  ];

  useEffect(() => {
    const start = Date.now();
    const duration = 2600;
    const raf = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setProgress(p);
      setPhase(p < 0.33 ? 0 : p < 0.75 ? 1 : 2);
      if (p >= 1) {
        clearInterval(raf);
        setTimeout(onDone, 350);
      }
    }, 60);
    return () => clearInterval(raf);
  }, [onDone]);

  return (
    <Card>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
        Análise em andamento
      </p>
      <h2 className="mt-4 font-serif text-[24px] leading-snug transition-opacity duration-300">
        {phrases[phase]}
      </h2>
      <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {Math.round(progress * 100)}%
      </p>
    </Card>
  );
}

function LeadCard({
  service,
  onSubmit,
  onSkip,
}: {
  service: (typeof SERVICES)[ServiceKey];
  onSubmit: () => void;
  onSkip: () => void;
}) {
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const valid = form.name.trim() && form.whatsapp.trim() && form.email.trim();

  return (
    <Card>
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
        A recomendação ideal para você
      </p>
      <h2 className="mt-4 font-serif text-[28px] leading-tight">{service.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-foreground/85">{service.message}</p>
      <div className="my-6 h-px w-full bg-border" />
      <p className="text-sm text-muted-foreground">
        Deixe seu contato e receba o direcionamento personalizado com condições exclusivas.
      </p>
      <form
        className="mt-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          onSubmit();
        }}
      >
        <Field label="Nome" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Seu nome" />
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
          className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          Ver minha recomendação
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
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
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
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
      <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80">
        Sua recomendação
      </p>
      <h2 className="mt-4 font-serif text-[30px] leading-tight">{service.title}</h2>
      <p className="mt-4 text-sm leading-relaxed text-foreground/85">{service.message}</p>
      <div className="mt-6 rounded-2xl bg-secondary/60 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
      </div>
      <a
        href={service.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary-foreground transition hover:bg-primary/90"
      >
        {service.cta}
      </a>
      {service.secondary && (
        <a
          href={service.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-primary/30 px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] text-primary transition hover:bg-primary/5"
        >
          {service.secondary.label}
        </a>
      )}
      <button
        onClick={onRestart}
        className="mt-5 inline-flex w-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
      >
        Refazer diagnóstico
      </button>
    </Card>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="my-12 flex items-center gap-4">
      <div className="h-px flex-1 bg-border" />
      <span className="font-serif text-xs italic tracking-wide text-muted-foreground">{label}</span>
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
          className="rounded-2xl border border-border/70 bg-card p-6 transition hover:border-primary/40 hover:shadow-[0_20px_40px_-30px_rgba(0,0,0,0.2)]"
        >
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-primary/70">
            {s.tag}
          </p>
          <h3 className="mt-2 font-serif text-[22px] leading-snug">{s.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary transition hover:gap-3"
          >
            {s.cta} <span className="font-serif text-sm">→</span>
          </a>
          {s.secondary && (
            <a
              href={s.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition hover:text-primary"
            >
              {s.secondary.label} →
            </a>
          )}
        </article>
      ))}
    </div>
  );
}

function SocialLinks() {
  const links: { label: string; href?: string; to?: string; external?: boolean }[] = [
    { label: "Conversar no WhatsApp", href: "https://wa.me/message/WK6EJVZ47QK7E1", external: true },
    { label: "Agendar reunião", to: "/agenda" },
  ];
  return (
    <div className="grid gap-3">
      {links.map((l) =>
        l.to ? (
          <Link
            key={l.label}
            to={l.to}
            className="group flex items-center justify-between rounded-full border border-border bg-card px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition hover:border-primary hover:bg-primary/[0.04]"
          >
            <span>{l.label}</span>
            <span className="font-serif text-base text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5">→</span>
          </Link>
        ) : (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between rounded-full border border-border bg-card px-6 py-4 text-[13px] font-medium uppercase tracking-[0.16em] transition hover:border-primary hover:bg-primary/[0.04]"
          >
            <span>{l.label}</span>
            <span className="font-serif text-base text-muted-foreground transition group-hover:text-primary group-hover:translate-x-0.5">→</span>
          </a>
        )
      )}
    </div>
  );
}

function AboutSection() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-border/70 bg-card">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <div className="relative h-64 w-full sm:h-full">
          <img
            src={aboutAsset.url}
            alt="Jessyca Barros"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-7 sm:p-8">
          <p className="font-serif text-[17px] italic leading-snug text-foreground">
            "Nem todo negócio precisa investir mais. Muitos só precisam da estratégia certa."
          </p>
          <div className="my-5 h-px w-10 bg-primary/40" />
          <p className="text-sm leading-relaxed text-foreground/85">
            Sou <strong className="font-medium">Jessyca Barros</strong>, especialista em tráfego pago,
            crescimento de negócios e performance. Desenvolvo estratégias que unem posicionamento,
            anúncios e tecnologia para transformar visibilidade em vendas.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Meu objetivo é simples: fazer com que seu negócio seja encontrado pelas pessoas certas.
          </p>
        </div>
      </div>
    </div>
  );
}
