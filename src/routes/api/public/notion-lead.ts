import { createFileRoute } from "@tanstack/react-router";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/notion";
const DATABASE_ID = "153198ba152c8016af0be5bb8a47e377";

type LeadPayload = {
  name?: string;
  whatsapp?: string;
  email?: string;
  stage?: string | null;
  gargalo?: string | null;
  solucao?: string | null;
  faturamento?: string | null;
  recommended_service?: string | null;
};

function parseFaturamento(input?: string | null): number | null {
  if (!input) return null;
  const digits = input.replace(/[^\d,\.]/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(digits);
  return Number.isFinite(n) ? n : null;
}

function text(content: string) {
  return [{ type: "text", text: { content } }];
}

export const Route = createFileRoute("/api/public/notion-lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const lovableKey = process.env.LOVABLE_API_KEY;
        const notionKey = process.env.NOTION_API_KEY;
        if (!lovableKey || !notionKey) {
          console.error("Notion route: missing LOVABLE_API_KEY or NOTION_API_KEY");
          return new Response(JSON.stringify({ ok: false, error: "missing_keys" }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }

        let data: LeadPayload;
        try {
          data = (await request.json()) as LeadPayload;
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const name = (data.name ?? "").toString().slice(0, 120) || "Lead sem nome";
        const email = (data.email ?? "").toString().slice(0, 200);
        const whatsapp = (data.whatsapp ?? "").toString().slice(0, 40);
        const fat = parseFaturamento(data.faturamento);

        const details: string[] = [
          "Origem: Link Quiz",
          data.recommended_service ? `Serviço recomendado: ${data.recommended_service}` : null,
          data.stage ? `Estágio: ${data.stage}` : null,
          data.gargalo ? `Gargalo: ${data.gargalo}` : null,
          data.solucao ? `Solução buscada: ${data.solucao}` : null,
          data.faturamento ? `Faturamento: ${data.faturamento}` : null,
        ].filter(Boolean) as string[];

        const body = {
          parent: { database_id: DATABASE_ID },
          properties: {
            "@ Instagran": { title: text(name) },
            Nome: { rich_text: text(name) },
            "E-mail": { email: email || null },
            Telefone: { phone_number: whatsapp || null },
            Status: { status: { name: "Lead" } },
            ...(fat !== null ? { Faturamento: { number: fat } } : {}),
          },
          children: [
            {
              object: "block",
              type: "callout",
              callout: {
                rich_text: text("Lead capturado via Link Quiz"),
                icon: { type: "emoji", emoji: "🔗" },
                color: "blue_background",
              },
            },
            ...details.map((line) => ({
              object: "block",
              type: "bulleted_list_item",
              bulleted_list_item: { rich_text: text(line) },
            })),
          ],
        };

        const res = await fetch(`${GATEWAY_URL}/v1/pages`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": notionKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const errBody = await res.text();
          console.error(`Notion route push failed [${res.status}]: ${errBody}`);
          return new Response(
            JSON.stringify({ ok: false, error: `notion_${res.status}`, detail: errBody }),
            { status: 502, headers: { "content-type": "application/json" } },
          );
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});