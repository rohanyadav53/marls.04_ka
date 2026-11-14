import { useState, type FormEvent, type ReactNode } from "react";
import { Check, Loader2 } from "lucide-react";
import { useT } from "../i18n/text";
import { getActiveLanguage } from "../i18n/translate";
import { en } from "../i18n/locales/en";
import { submitLead, type LeadSource } from "../lib/api";

/**
 * The visitor sees the enquiry type in their own language, but the value that
 * travels to the backend is always the English one — otherwise a Hindi
 * enquiry would land in the admin table as "सामान्य प्रश्न" and the same
 * category would count separately in every language. Positions match: a
 * locale either translates the whole `types` array or falls back to English.
 */
const CANONICAL_TYPES = en.contact.form.types;

const inputClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-blue focus:bg-white focus:ring-2 focus:ring-blue/15";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

/**
 * Lead-capture enquiry form.
 *
 * Posts to the PHP lead API (`POST /api/leads.php`), which stores the enquiry
 * in MySQL and emails the sales inbox. The client-side checks below are a
 * courtesy only — the backend validates everything again and is the authority.
 *
 * `source` tells the admin portal where the lead came from. The server keeps
 * it only if it matches its own whitelist, so a wrong value here is harmless.
 */
export default function EnquiryForm({
  onDone,
  source = "Enquiry Form",
}: {
  onDone?: () => void;
  source?: LeadSource;
}) {
  const t = useT();
  const f = t.contact.form;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;

    const data = new FormData(e.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    const name = value("name");
    const email = value("email");
    const message = value("message");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!name || !emailOk || !message) {
      setError(true);
      return;
    }
    setError(false);
    setFailed(null);
    setBusy(true);

    const result = await submitLead({
      name,
      company: value("company"),
      email,
      phone: value("phone"),
      type: value("type"),
      subject: value("subject"),
      message,
      source,
      page_url: window.location.href,
      language: getActiveLanguage(),
      website: value("website"), // honeypot — empty unless a bot filled it in
    });

    setBusy(false);
    if (result.ok) {
      setSent(true);
    } else {
      setFailed(result.message ?? f.failure);
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check className="h-8 w-8" strokeWidth={2.4} />
        </span>
        <p className="mt-5 max-w-sm text-base font-medium text-ink/75">{f.success}</p>
        <button
          type="button"
          onClick={() => (onDone ? onDone() : setSent(false))}
          className="mt-6 text-sm font-semibold text-blue hover:underline"
        >
          {onDone ? t.common.close : f.again}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.name}>
          <input name="name" required className={inputClass} placeholder={f.namePlaceholder} />
        </Field>
        <Field label={f.company}>
          <input name="company" className={inputClass} placeholder={f.companyPlaceholder} />
        </Field>
        <Field label={f.email}>
          <input name="email" type="email" required className={inputClass} placeholder={f.emailPlaceholder} />
        </Field>
        <Field label={f.phone}>
          <input name="phone" className={inputClass} placeholder={f.phonePlaceholder} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={f.type}>
          <select name="type" className={inputClass} defaultValue={CANONICAL_TYPES[0]}>
            {f.types.map((opt, index) => (
              <option key={opt} value={CANONICAL_TYPES[index] ?? opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
        <Field label={f.subject}>
          <input name="subject" className={inputClass} placeholder={f.subjectPlaceholder} />
        </Field>
      </div>
      <Field label={f.message}>
        <textarea name="message" required rows={4} className={`${inputClass} resize-y`} placeholder={f.messagePlaceholder} />
      </Field>
      {error && (
        <p role="alert" className="text-sm font-medium text-red">
          {f.error}
        </p>
      )}
      {failed && (
        <p role="alert" className="text-sm font-medium text-red">
          {failed}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        aria-busy={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-grad-cta px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red/20 transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {busy ? f.sending : f.submit}
      </button>

      {/*
        Honeypot. Positioned off-screen rather than display:none — bots that
        parse styles skip hidden inputs, but they fill this one. A submission
        that arrives with it populated is discarded server-side.
        Last in the DOM so the layout above is untouched.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="mrl-website">Leave this field empty</label>
        <input id="mrl-website" name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
    </form>
  );
}
