/**
 * Admin API client.
 *
 * Two things matter here:
 *
 *  1. `credentials: "include"` on every request — the session lives in an
 *     HttpOnly cookie the JavaScript cannot read, which is the point.
 *  2. The CSRF token is held in memory only. Never localStorage, never a
 *     non-HttpOnly cookie: it is issued by /api/me.php after the session is
 *     established and replayed in the X-CSRF-Token header.
 *
 * No lead data is ever cached to disk by this module.
 */

import { API_BASE } from "../lib/api";

let csrfToken: string | null = null;
let onUnauthenticated: (() => void) | null = null;

export function setUnauthenticatedHandler(handler: (() => void) | null) {
  onUnauthenticated = handler;
}

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Envelope<T> = { success: boolean; data?: T; error?: { code?: string; message?: string } };

async function request<T>(
  path: string,
  init: RequestInit & { query?: Record<string, string | number | undefined> } = {},
): Promise<T> {
  const { query, ...options } = init;

  const url = new URL(`${API_BASE}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (csrfToken && options.method && options.method !== "GET") headers.set("X-CSRF-Token", csrfToken);

  const response = await fetch(url.toString(), { ...options, headers, credentials: "include" });

  if (response.status === 401 || response.status === 419) {
    csrfToken = null;
    onUnauthenticated?.();
  }

  const body = (await response.json().catch(() => ({}))) as Envelope<T>;

  if (!response.ok || !body.success) {
    throw new ApiError(
      body.error?.code ?? `HTTP_${response.status}`,
      body.error?.message ?? "Something went wrong. Please try again.",
      response.status,
    );
  }

  return body.data as T;
}

/* ------------------------------------------------------------------ types -- */

export type LeadStatus = "new" | "contacted" | "converted" | "closed" | "spam";

export type LeadRow = {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  requirement: string | null;
  inquiry_type: string | null;
  subject: string | null;
  source: string;
  language: string;
  status: LeadStatus;
  assigned_to: string | null;
  is_duplicate: boolean;
  spam_score: number;
  notification_sent: boolean;
};

export type LeadDetail = LeadRow & {
  message: string | null;
  admin_notes: string | null;
  page_url: string | null;
  duplicate_of: number | null;
  notification_sent_at: string | null;
  notification_error: string | null;
  ip_address: string | null;
  user_agent: string | null;
};

export type Activity = {
  id: number;
  admin_id: number | null;
  admin_name: string | null;
  action: string;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
};

export type LeadListResult = {
  rows: LeadRow[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  filters: { sources: string[]; statuses: LeadStatus[] };
};

export type Stats = {
  total: number;
  by_status: Record<LeadStatus, number>;
  today: number;
  this_week: number;
  this_month: number;
  by_source: { source: string; count: number }[];
  by_day: { day: string; count: number }[];
  recent: LeadRow[];
  unnotified: number;
};

export type ReportRow = {
  id: number;
  period_start: string;
  period_end: string;
  recipient: string;
  lead_count: number;
  status: "sent" | "failed" | "running";
  error: string | null;
  triggered_by: string;
  sent_at: string | null;
  created_at: string;
};

export type AdminUser = { id: number; name: string; email: string; role: string };

export type Session = {
  authenticated: boolean;
  user: AdminUser | null;
  csrf_token: string;
  features: { xlsx_export: boolean; captcha: boolean };
};

export type LeadFilters = {
  search?: string;
  status?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
  sort?: string;
  dir?: string;
};

/* -------------------------------------------------------------- endpoints -- */

export const api = {
  session: () => request<Session>("/me.php"),

  login: (email: string, password: string) =>
    request<{ user: AdminUser; csrf_token: string }>("/login.php", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request<{ authenticated: boolean }>("/logout.php", { method: "POST" }),

  stats: () => request<Stats>("/admin/stats.php"),

  leads: (filters: LeadFilters, page: number, perPage: number) =>
    request<LeadListResult>("/admin/leads.php", {
      query: { ...filters, page, per_page: perPage },
    }),

  lead: (id: number) => request<{ lead: LeadDetail; activity: Activity[] }>("/admin/lead.php", { query: { id } }),

  updateLead: (id: number, changes: Partial<Pick<LeadDetail, "status" | "assigned_to" | "admin_notes">>) =>
    request<{ lead: LeadDetail }>("/admin/lead.php", {
      method: "PATCH",
      body: JSON.stringify({ id, ...changes }),
    }),

  reports: () =>
    request<{
      reports: ReportRow[];
      next_period: { start: string; end: string; label: string; mode: string };
      recipient: string;
      mode: string;
    }>("/admin/reports.php"),

  sendReport: (force: boolean) =>
    request<{ status: string; message: string; lead_count: number; period: { label: string } }>(
      "/admin/send-report.php",
      { method: "POST", body: JSON.stringify({ force }) },
    ),

  testEmail: (to: string) =>
    request<{ sent: boolean; to: string; reason?: string; via?: string }>("/admin/test-email.php", {
      method: "POST",
      body: JSON.stringify({ to }),
    }),
};

/**
 * Download an export.
 *
 * Fetched rather than linked so the session cookie, the error handling and the
 * filename all behave the same way they do everywhere else in the portal.
 */
export async function downloadExport(
  format: "csv" | "xlsx",
  scope: "filtered" | "all",
  filters: LeadFilters,
): Promise<void> {
  const url = new URL(`${API_BASE}/admin/export.php`, window.location.origin);
  url.searchParams.set("format", format);
  url.searchParams.set("scope", scope);
  if (scope === "filtered") {
    for (const [key, value] of Object.entries(filters)) {
      if (value) url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), { credentials: "include" });

  if (!response.ok) {
    if (response.status === 401) onUnauthenticated?.();
    const body = (await response.json().catch(() => ({}))) as Envelope<never>;
    throw new ApiError(
      body.error?.code ?? `HTTP_${response.status}`,
      body.error?.message ?? "The export could not be generated.",
      response.status,
    );
  }

  const blob = await response.blob();
  const disposition = response.headers.get("X-Filename");
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = disposition ?? `marlsboro-leads.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
