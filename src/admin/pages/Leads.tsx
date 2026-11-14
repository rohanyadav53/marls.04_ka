import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Search, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { api, downloadExport, type LeadFilters, type LeadListResult } from "../api";
import { useAuth } from "../auth";
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  PageTitle,
  Spinner,
  StatusBadge,
  formatDate,
  inputClass,
} from "../components/ui";

/* ------------------------------------------------------------ date presets -- */

type PresetId = "any" | "today" | "yesterday" | "this_week" | "last_week" | "this_month" | "last_month" | "custom";

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Monday-based week start, matching the backend's reporting week. */
function startOfWeek(from: Date): Date {
  const d = new Date(from);
  const weekday = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - weekday);
  return d;
}

function presetRange(preset: PresetId): { from?: string; to?: string } {
  const now = new Date();
  switch (preset) {
    case "today":
      return { from: iso(now), to: iso(now) };
    case "yesterday": {
      const d = new Date(now);
      d.setDate(d.getDate() - 1);
      return { from: iso(d), to: iso(d) };
    }
    case "this_week": {
      const start = startOfWeek(now);
      return { from: iso(start), to: iso(now) };
    }
    case "last_week": {
      const start = startOfWeek(now);
      start.setDate(start.getDate() - 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { from: iso(start), to: iso(end) };
    }
    case "this_month":
      return { from: iso(new Date(now.getFullYear(), now.getMonth(), 1)), to: iso(now) };
    case "last_month": {
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from: iso(start), to: iso(end) };
    }
    default:
      return {};
  }
}

const PRESETS: { id: PresetId; label: string }[] = [
  { id: "any", label: "Any date" },
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "this_week", label: "This week" },
  { id: "last_week", label: "Last week" },
  { id: "this_month", label: "This month" },
  { id: "last_month", label: "Last month" },
  { id: "custom", label: "Custom range" },
];

/* -------------------------------------------------------------------- page -- */

/**
 * The leads table.
 *
 * Search, filters and paging all run server-side — the browser holds one page
 * of leads at a time and nothing else. Filter state deliberately stays out of
 * the URL: a search term is often an email address, and those do not belong in
 * browser history or a shared link.
 */
export default function Leads() {
  const { features } = useAuth();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("all");
  const [preset, setPreset] = useState<PresetId>("any");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const [result, setResult] = useState<LeadListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const filters = useMemo<LeadFilters>(() => {
    const range = preset === "custom" ? { from: customFrom, to: customTo } : presetRange(preset);
    return {
      search: search || undefined,
      status: status || undefined,
      source: source !== "all" ? source : undefined,
      date_from: range.from || undefined,
      date_to: range.to || undefined,
    };
  }, [search, status, source, preset, customFrom, customTo]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .leads(filters, page, perPage)
      .then(setResult)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, page, perPage]);

  useEffect(load, [load]);

  // Any filter change starts again at page one.
  useEffect(() => {
    setPage(1);
  }, [search, status, source, preset, customFrom, customTo, perPage]);

  async function handleExport(format: "csv" | "xlsx", scope: "filtered" | "all") {
    setExporting(true);
    setError(null);
    try {
      await downloadExport(format, scope, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The export failed.");
    } finally {
      setExporting(false);
    }
  }

  function resetFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("");
    setSource("all");
    setPreset("any");
    setCustomFrom("");
    setCustomTo("");
  }

  const sources = result?.filters.sources ?? [];
  const statuses = result?.filters.statuses ?? [];

  return (
    <>
      <PageTitle
        title="Leads"
        sub={result ? `${result.total} lead${result.total === 1 ? "" : "s"} match the current filters.` : undefined}
        actions={
          <>
            <Button variant="secondary" busy={exporting} onClick={() => handleExport("csv", "filtered")}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export filtered
            </Button>
            <Button variant="secondary" busy={exporting} onClick={() => handleExport("csv", "all")}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Export all
            </Button>
            {features.xlsx_export && (
              <Button variant="ghost" busy={exporting} onClick={() => handleExport("xlsx", "filtered")}>
                .xlsx
              </Button>
            )}
          </>
        }
      />

      <Card className="mb-5">
        <form
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput.trim());
          }}
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="lead-search">
              Search
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                id="lead-search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onBlur={() => setSearch(searchInput.trim())}
                className={`${inputClass} pl-9`}
                placeholder="Name, company, email, phone, ID"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="lead-status">
              Status
            </label>
            <select
              id="lead-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="">Active (excludes spam)</option>
              <option value="all">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="lead-source">
              Source
            </label>
            <select
              id="lead-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={inputClass}
            >
              <option value="all">All sources</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="lead-preset">
              Date range
            </label>
            <select
              id="lead-preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value as PresetId)}
              className={inputClass}
            >
              {PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {preset === "custom" && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="date-from">
                  From
                </label>
                <input
                  id="date-from"
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted" htmlFor="date-to">
                  To
                </label>
                <input
                  id="date-to"
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className={inputClass}
                />
              </div>
            </>
          )}

          <div className="flex items-end gap-2">
            <Button type="submit" className="flex-1">
              Apply
            </Button>
            <Button type="button" variant="secondary" onClick={resetFilters} aria-label="Reset filters">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </form>
      </Card>

      {error && (
        <div className="mb-5">
          <ErrorNote>{error}</ErrorNote>
        </div>
      )}

      <Card className="p-0 sm:p-0">
        {loading && !result ? (
          <Spinner label="Loading leads" />
        ) : !result || result.rows.length === 0 ? (
          <EmptyState title="No leads found" sub="Try widening the filters or clearing the search." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface/60 text-left">
                    {["ID", "Date", "Name", "Company", "Email", "Phone", "Requirement", "Source", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={loading ? "opacity-50" : ""}>
                  {result.rows.map((lead) => (
                    <tr key={lead.id} className="border-b border-line/70 last:border-0 hover:bg-surface/60">
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">#{lead.id}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDate(lead.created_at)}</td>
                      <td className="px-4 py-3">
                        <Link to={`/leads/${lead.id}`} className="font-semibold text-ink hover:text-blue">
                          {lead.name}
                        </Link>
                        {lead.is_duplicate && (
                          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                            DUPLICATE?
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{lead.company ?? "—"}</td>
                      <td className="px-4 py-3 text-muted">
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="hover:text-blue">
                            {lead.email}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-muted">{lead.requirement ?? "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{lead.source}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>Rows</span>
                <select
                  value={perPage}
                  onChange={(e) => setPerPage(Number(e.target.value))}
                  aria-label="Leads per page"
                  className="rounded-lg border border-line bg-white px-2 py-1 text-sm text-ink"
                >
                  {[20, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted">
                <span>
                  Page {result.page} of {result.pages} · {result.total} total
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={result.page <= 1}
                    aria-label="Previous page"
                    className="rounded-lg border border-line p-1.5 text-ink disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(result.pages, p + 1))}
                    disabled={result.page >= result.pages}
                    aria-label="Next page"
                    className="rounded-lg border border-line p-1.5 text-ink disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
