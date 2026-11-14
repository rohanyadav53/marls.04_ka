import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, MailWarning } from "lucide-react";
import { api, type Activity, type LeadDetail as Lead, type LeadStatus } from "../api";
import {
  Button,
  Card,
  ErrorNote,
  Spinner,
  StatusBadge,
  SuccessNote,
  STATUS_LABELS,
  formatDateTime,
  inputClass,
} from "../components/ui";

const STATUSES: LeadStatus[] = ["new", "contacted", "converted", "closed", "spam"];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-line/70 py-2.5 last:border-0 sm:flex-row sm:gap-4">
      <div className="w-40 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">{label}</div>
      <div className="min-w-0 break-words text-sm text-ink">{children}</div>
    </div>
  );
}

const ACTION_LABELS: Record<string, string> = {
  created: "Lead created",
  status_changed: "Status changed",
  notes_changed: "Notes updated",
  assignment_changed: "Assignment changed",
};

/**
 * One lead, in full, plus the three fields an admin may change.
 *
 * What the visitor submitted is shown read-only — it is a record of what they
 * said, and rewriting it would destroy the only copy.
 */
export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const leadId = Number(id);

  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState<LeadStatus>("new");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  const hydrate = useCallback((next: Lead) => {
    setLead(next);
    setStatus(next.status);
    setAssignedTo(next.assigned_to ?? "");
    setNotes(next.admin_notes ?? "");
  }, []);

  useEffect(() => {
    if (!Number.isFinite(leadId) || leadId <= 0) {
      setError("That is not a valid lead reference.");
      return;
    }
    let cancelled = false;
    api
      .lead(leadId)
      .then((data) => {
        if (cancelled) return;
        hydrate(data.lead);
        setActivity(data.activity);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [leadId, hydrate]);

  async function save() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const result = await api.updateLead(leadId, {
        status,
        assigned_to: assignedTo.trim(),
        admin_notes: notes,
      });
      hydrate(result.lead);
      setSaved(true);
      const refreshed = await api.lead(leadId);
      setActivity(refreshed.activity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The change could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  if (error && !lead) return <ErrorNote>{error}</ErrorNote>;
  if (!lead) return <Spinner label="Loading lead" />;

  const dirty =
    status !== lead.status ||
    assignedTo.trim() !== (lead.assigned_to ?? "") ||
    notes !== (lead.admin_notes ?? "");

  return (
    <>
      <Link to="/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All leads
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">Lead #{lead.id}</h1>
        <StatusBadge status={lead.status} />
        {lead.is_duplicate && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Possible duplicate of #{lead.duplicate_of}
          </span>
        )}
        {!lead.notification_sent && lead.status !== "spam" && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red/25 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            <MailWarning className="h-3.5 w-3.5" aria-hidden="true" />
            Notification not sent
          </span>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <h2 className="mb-2 font-display text-base font-bold text-ink">Contact information</h2>
            <Row label="Name">{lead.name}</Row>
            <Row label="Company">{lead.company ?? "—"}</Row>
            <Row label="Email">
              {lead.email ? (
                <a href={`mailto:${lead.email}`} className="text-blue hover:underline">
                  {lead.email}
                </a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Phone">
              {lead.phone ? (
                <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`} className="text-blue hover:underline">
                  {lead.phone}
                </a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Country">{lead.country ?? "—"}</Row>
            <Row label="City">{lead.city ?? "—"}</Row>
          </Card>

          <Card>
            <h2 className="mb-2 font-display text-base font-bold text-ink">Enquiry</h2>
            <Row label="Requirement">{lead.requirement ?? "—"}</Row>
            <Row label="Enquiry type">{lead.inquiry_type ?? "—"}</Row>
            <Row label="Subject">{lead.subject ?? "—"}</Row>
            <Row label="Message">
              <p className="whitespace-pre-wrap leading-relaxed">{lead.message ?? "—"}</p>
            </Row>
          </Card>

          <Card>
            <h2 className="mb-2 font-display text-base font-bold text-ink">Tracking</h2>
            <Row label="Source">{lead.source}</Row>
            <Row label="Page">
              {lead.page_url ? (
                <a
                  href={lead.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-blue hover:underline"
                >
                  {lead.page_url}
                </a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Language">{lead.language}</Row>
            <Row label="Created">{formatDateTime(lead.created_at)}</Row>
            <Row label="Last updated">{formatDateTime(lead.updated_at)}</Row>
            <Row label="Notification">
              {lead.notification_sent
                ? `Sent ${formatDateTime(lead.notification_sent_at)}`
                : (lead.notification_error ?? "Not sent")}
            </Row>
            <Row label="Spam score">{lead.spam_score}</Row>
            <Row label="IP address">{lead.ip_address ?? "—"}</Row>
          </Card>

          <Card>
            <h2 className="mb-3 font-display text-base font-bold text-ink">History</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-muted">Nothing recorded yet.</p>
            ) : (
              <ol className="space-y-3">
                {activity.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-line pl-4 text-sm">
                    <div className="font-semibold text-ink">{ACTION_LABELS[entry.action] ?? entry.action}</div>
                    {entry.action === "status_changed" && (
                      <div className="text-muted">
                        {STATUS_LABELS[entry.old_value as LeadStatus] ?? entry.old_value ?? "—"} →{" "}
                        {STATUS_LABELS[entry.new_value as LeadStatus] ?? entry.new_value ?? "—"}
                      </div>
                    )}
                    <div className="mt-0.5 text-xs text-muted">
                      {formatDateTime(entry.created_at)}
                      {entry.admin_name ? ` · ${entry.admin_name}` : " · system"}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="lg:sticky lg:top-6">
            <h2 className="mb-4 font-display text-base font-bold text-ink">Management</h2>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className={inputClass}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Assigned to</span>
                <input
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className={inputClass}
                  placeholder="Team member's name"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Admin notes</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  className={`${inputClass} resize-y`}
                  placeholder="Call outcome, quoted price, follow-up date…"
                />
              </label>

              {error && <ErrorNote>{error}</ErrorNote>}
              {saved && !dirty && <SuccessNote>Saved.</SuccessNote>}

              <Button onClick={save} busy={saving} disabled={!dirty} className="w-full">
                Save changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
