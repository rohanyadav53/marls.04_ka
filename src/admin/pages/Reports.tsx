import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { api, type ReportRow } from "../api";
import {
  Button,
  Card,
  EmptyState,
  ErrorNote,
  PageTitle,
  Spinner,
  SuccessNote,
  formatDate,
  formatDateTime,
} from "../components/ui";

type Data = Awaited<ReturnType<typeof api.reports>>;

const STATUS_STYLES: Record<ReportRow["status"], string> = {
  sent: "bg-emerald-50 text-emerald-700 border-emerald-300/50",
  failed: "bg-red-50 text-red-700 border-red/25",
  running: "bg-amber-50 text-amber-700 border-amber-300/50",
};

/**
 * Weekly report log, and a manual trigger.
 *
 * The manual send runs exactly the same code as the Friday cron — including
 * the duplicate protection, which is why a period already sent comes back as
 * "skipped" rather than going out twice.
 */
export default function Reports() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [force, setForce] = useState(false);

  const load = useCallback(() => {
    api
      .reports()
      .then(setData)
      .catch((err: Error) => setError(err.message));
  }, []);

  useEffect(load, [load]);

  async function sendNow() {
    setSending(true);
    setError(null);
    setNotice(null);
    try {
      const result = await api.sendReport(force);
      setNotice(`${result.status.toUpperCase()} — ${result.message}`);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "The report could not be sent.");
    } finally {
      setSending(false);
    }
  }

  if (error && !data) return <ErrorNote>{error}</ErrorNote>;
  if (!data) return <Spinner label="Loading reports" />;

  return (
    <>
      <PageTitle
        title="Reports"
        sub="The weekly lead report emailed every Friday by the server's cron job."
      />

      <Card className="mb-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <div className="eyebrow text-muted">Next period</div>
            <div className="mt-1 font-semibold text-ink">{data.next_period.label}</div>
          </div>
          <div>
            <div className="eyebrow text-muted">Recipient</div>
            <div className="mt-1 break-all font-semibold text-ink">{data.recipient || "not configured"}</div>
          </div>
          <div>
            <div className="eyebrow text-muted">Period mode</div>
            <div className="mt-1 font-semibold text-ink">
              {data.mode === "last_week" ? "Completed Mon–Sun week" : "Rolling 7 days"}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button onClick={sendNow} busy={sending}>
            <Send className="h-4 w-4" aria-hidden="true" />
            Send weekly report now
          </Button>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={force}
              onChange={(e) => setForce(e.target.checked)}
              className="h-4 w-4 rounded border-line"
            />
            Resend even if this period was already sent
          </label>
        </div>

        {notice && (
          <div className="mt-4">
            <SuccessNote>{notice}</SuccessNote>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <ErrorNote>{error}</ErrorNote>
          </div>
        )}
      </Card>

      <Card className="p-0 sm:p-0">
        {data.reports.length === 0 ? (
          <EmptyState title="No reports sent yet" sub="The first one goes out on the next scheduled Friday." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-line bg-surface/60 text-left">
                  {["Period", "Leads", "Sent to", "Status", "Sent at", "Triggered by"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.reports.map((report) => (
                  <tr key={report.id} className="border-b border-line/70 last:border-0">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">
                      {formatDate(report.period_start)} – {formatDate(report.period_end)}
                    </td>
                    <td className="px-4 py-3 text-muted">{report.lead_count}</td>
                    <td className="break-all px-4 py-3 text-muted">{report.recipient}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[report.status]}`}
                      >
                        {report.status}
                      </span>
                      {report.error && <div className="mt-1 text-xs text-red-700">{report.error}</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{formatDateTime(report.sent_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted">{report.triggered_by}</td>
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
