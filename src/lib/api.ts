/**
 * Public API client.
 *
 * One place decides where the backend lives. In production the React build and
 * the PHP API are served from the same origin, so the default relative "/api"
 * is correct and nothing needs configuring. For local development point
 * VITE_API_BASE_URL at wherever PHP is running (see .env.example).
 *
 * Nothing secret ever appears here — the API base is the only backend detail
 * the browser is allowed to know.
 */

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(/\/+$/, "");

/** Must match Validation::SOURCES in the PHP backend. Unknown values are
 *  rewritten to "Other" server-side rather than trusted. */
export type LeadSource =
  | "Contact Page"
  | "Quote Popup"
  | "Enquiry Form"
  | "Product Page"
  | "Industry Page"
  | "Packaging Security"
  | "Recyclable"
  | "Careers"
  | "Homepage"
  | "Other";

export type LeadPayload = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  type?: string;
  subject?: string;
  message: string;
  source: LeadSource;
  page_url: string;
  language: string;
  /** Honeypot — always empty for a human. */
  website?: string;
};

export type LeadResult =
  | { ok: true; leadId: number | null }
  | { ok: false; code: string; message: string | null };

type ApiEnvelope = {
  success?: boolean;
  lead_id?: number;
  error?: { code?: string; message?: string };
};

const TIMEOUT_MS = 20_000;

/**
 * Submit an enquiry.
 *
 * Never throws: the caller gets a result either way, because a form that
 * explodes on a flaky connection is worse than one that says "try again".
 * `message` is only populated when the server sent something safe to show —
 * anything else surfaces as the translated generic failure.
 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/leads.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body: ApiEnvelope = {};
    try {
      body = (await response.json()) as ApiEnvelope;
    } catch {
      // A non-JSON reply means a misconfigured server, not a user error.
    }

    if (response.ok && body.success) {
      return { ok: true, leadId: body.lead_id ?? null };
    }

    // Only validation messages are worth repeating to the visitor; everything
    // else (rate limits, server faults) uses the generic translated text.
    const code = body.error?.code ?? `HTTP_${response.status}`;
    return {
      ok: false,
      code,
      message: code === "VALIDATION_ERROR" ? (body.error?.message ?? null) : null,
    };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === "AbortError";
    return { ok: false, code: aborted ? "TIMEOUT" : "NETWORK_ERROR", message: null };
  } finally {
    window.clearTimeout(timer);
  }
}
