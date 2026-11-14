import { useState } from "react";
import { Mail } from "lucide-react";
import { api, ApiError } from "../api";
import { useAuth } from "../auth";
import { Button, Card, ErrorNote, Field, PageTitle, SuccessNote, inputClass } from "../components/ui";

/**
 * Settings — diagnostics rather than configuration.
 *
 * Credentials live in a PHP file outside the web root and are edited on the
 * server, never through a browser form. What this screen offers is the ability
 * to prove the mail configuration works.
 */
export default function Settings() {
  const { user, features } = useAuth();
  const [to, setTo] = useState(user?.email ?? "");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  async function sendTest() {
    setBusy(true);
    setResult(null);
    try {
      const response = await api.testEmail(to.trim());
      setResult(
        response.sent
          ? { ok: true, text: `Email sent successfully to ${response.to}${response.via ? ` via ${response.via}` : ""}.` }
          : { ok: false, text: `Email failed. Reason: ${response.reason ?? "unknown"}` },
      );
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof ApiError ? err.message : "The test could not be run.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageTitle title="Settings" sub="Check how the lead system is configured on this server." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-base font-bold text-ink">Send a test email</h2>
          <p className="mt-1 text-sm text-muted">
            Confirms the SMTP credentials work. If it fails, the reason shown is the server's own — use it to fix
            the configuration file.
          </p>

          <div className="mt-4 space-y-4">
            <Field label="Send to">
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className={inputClass}
                placeholder="you@marlsboro.com"
              />
            </Field>

            <Button onClick={sendTest} busy={busy} disabled={!to.trim()}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              Send test email
            </Button>

            {result && (result.ok ? <SuccessNote>{result.text}</SuccessNote> : <ErrorNote>{result.text}</ErrorNote>)}
          </div>
        </Card>

        <Card>
          <h2 className="font-display text-base font-bold text-ink">This server</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line/70 pb-3">
              <dt className="text-muted">Signed in as</dt>
              <dd className="text-right font-semibold text-ink">
                {user?.name}
                <span className="block text-xs font-normal text-muted">{user?.email}</span>
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line/70 pb-3">
              <dt className="text-muted">Role</dt>
              <dd className="font-semibold text-ink">{user?.role}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-line/70 pb-3">
              <dt className="text-muted">.xlsx export</dt>
              <dd className="font-semibold text-ink">
                {features.xlsx_export ? "Available" : "Unavailable (PHP zip extension missing)"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">CAPTCHA</dt>
              <dd className="font-semibold text-ink">{features.captcha ? "Enabled" : "Disabled"}</dd>
            </div>
          </dl>

          <p className="mt-5 rounded-xl bg-surface px-4 py-3 text-xs leading-relaxed text-muted">
            Database, SMTP and session settings live in the configuration file outside <code>public_html</code>.
            They are edited on the server — see <strong>CWP_DEPLOYMENT.md</strong>.
          </p>
        </Card>
      </div>
    </>
  );
}
