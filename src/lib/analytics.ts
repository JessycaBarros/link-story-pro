import { supabase } from "@/integrations/supabase/client";
import { sendLeadToNotion } from "@/lib/notion.functions";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "jb_sid";
  let id = window.sessionStorage.getItem(key);
  if (!id) {
    id = (crypto.randomUUID?.() ?? String(Date.now()) + Math.random().toString(36).slice(2));
    window.sessionStorage.setItem(key, id);
  }
  return id;
}

export async function trackEvent(
  eventType: string,
  meta?: Record<string, unknown>,
) {
  if (typeof window === "undefined") return;
  try {
    await supabase.from("page_events").insert({
      event_type: eventType,
      session_id: getSessionId(),
      path: window.location.pathname,
      referrer: document.referrer || null,
      meta: (meta ?? null) as never,
    });
  } catch {
    /* silent */
  }
}

export type LeadInsert = {
  name: string;
  whatsapp: string;
  email: string;
  stage?: string | null;
  gargalo?: string | null;
  solucao?: string | null;
  faturamento?: string | null;
  recommended_service?: string | null;
};

export async function submitLead(lead: LeadInsert) {
  if (typeof window === "undefined") return { error: "ssr" as const };
  const { error } = await supabase.from("leads").insert({
    ...lead,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
  });
  if (!error) {
    // Fire-and-forget: send to Notion CRM
    sendLeadToNotion({ data: lead }).catch(() => {});
  }
  return { error };
}