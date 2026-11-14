import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { api, type Stats } from "../api";
import {
  Card,
  EmptyState,
  ErrorNote,
  PageTitle,
  Spinner,
  StatTile,
  StatusBadge,
  formatDate,
} from "../components/ui";

/**
 * Dashboard — the numbers the sales team actually acts on.
 *
 * Totals exclude spam-flagged leads (the backend decides that), so the
 * headline figure describes real enquiries. Spam has its own tile.
 */
export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .stats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <ErrorNote>{error}</ErrorNote>;
  if (!stats) return <Spinner label="Loading dashboard" />;

  const peakDay = Math.max(1, ...stats.by_day.map((d) => d.count));
  const sourceTotal = Math.max(1, ...stats.by_source.map((s) => Number(s.count)));

  return (
    <>
      <PageTitle title="Dashboard" sub="Lead activity across the website." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Total" value={stats.total} accent />
        <StatTile label="New" value={stats.by_status.new} />
        <StatTile label="Contacted" value={stats.by_status.contacted} />
        <StatTile label="Converted" value={stats.by_status.converted} />
        <StatTile label="This week" value={stats.this_week} />
        <StatTile label="This month" value={stats.this_month} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Today" value={stats.today} />
        <StatTile label="Closed" value={stats.by_status.closed} />
        <StatTile label="Spam" value={stats.by_status.spam} />
        <StatTile label="Email not sent" value={stats.unnotified} />
      </div>

      {stats.unnotified > 0 && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            {stats.unnotified} lead{stats.unnotified === 1 ? "" : "s"} could not be emailed to the sales inbox.
            The leads themselves are safe — check the SMTP settings under{" "}
            <Link to="/settings" className="font-semibold underline">
              Settings
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-base font-bold text-ink">Leads by source</h2>
          {stats.by_source.length === 0 ? (
            <EmptyState title="No leads yet" />
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.by_source.map(({ source, count }) => (
                <li key={source}>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="font-medium text-ink">{source}</span>
                    <span className="font-semibold text-muted">{count}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-blue"
                      style={{ width: `${(Number(count) / sourceTotal) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-base font-bold text-ink">Leads per day</h2>
          <p className="mt-1 text-xs text-muted">Last 14 days</p>
          {stats.by_day.length === 0 ? (
            <EmptyState title="No leads yet" />
          ) : (
            <div className="mt-5 flex h-44 items-stretch gap-1.5">
              {stats.by_day.map(({ day, count }) => (
                <div key={day} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                  <div className="text-xs font-semibold text-muted">{count}</div>
                  {/* The bar's percentage height needs a parent with a definite
                      height — this flex-1 track provides one inside the h-44 row. */}
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-blue"
                      style={{ height: `${Math.max(4, (Number(count) / peakDay) * 100)}%` }}
                      title={`${day}: ${count}`}
                    />
                  </div>
                  <div className="truncate text-[10px] text-muted">{day.slice(8)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-bold text-ink">Recent leads</h2>
          <Link to="/leads" className="text-sm font-semibold text-blue hover:underline">
            View all
          </Link>
        </div>

        {stats.recent.length === 0 ? (
          <EmptyState title="No leads yet" sub="Enquiries from the website will appear here." />
        ) : (
          <div className="-mx-5 mt-4 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left">
                  {["Date", "Name", "Company", "Requirement", "Source", "Status"].map((h) => (
                    <th key={h} className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-muted sm:px-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((lead) => (
                  <tr key={lead.id} className="border-b border-line/70 last:border-0 hover:bg-surface/60">
                    <td className="whitespace-nowrap px-5 py-3 text-muted sm:px-6">{formatDate(lead.created_at)}</td>
                    <td className="px-5 py-3 sm:px-6">
                      <Link to={`/leads/${lead.id}`} className="font-semibold text-ink hover:text-blue">
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-muted sm:px-6">{lead.company ?? "—"}</td>
                    <td className="px-5 py-3 text-muted sm:px-6">{lead.requirement ?? "—"}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-muted sm:px-6">{lead.source}</td>
                    <td className="px-5 py-3 sm:px-6">
                      <StatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
