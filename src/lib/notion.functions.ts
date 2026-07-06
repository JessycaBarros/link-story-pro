import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/notion";
const DATABASE_ID = "153198ba152c8016af0be5bb8a47e377";

export type NotionLeadPayload = {
  name: string;
  whatsapp: string;
  email: string;
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

export const sendLeadToNotion = createServerFn({ method: "POST" })
  .inputValidator((data: NotionLeadPayload) => data)
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const notionKey = process.env.NOTION_API_KEY;
    if (!lovableKey || !notionKey) {
      return { ok: false, error: "missing_keys" as const };
    }

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
        "@ Instagran": { title: text(data.name || "Lead sem nome") },
        Nome: { rich_text: text(data.name) },
        "E-mail": { email: data.email || null },
        Telefone: { phone_number: data.whatsapp || null },
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
      console.error(`Notion lead push failed [${res.status}]: ${errBody}`);
      return { ok: false, error: `notion_${res.status}` as const };
    }
    return { ok: true as const };
  });