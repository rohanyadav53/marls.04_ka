import { Link } from "react-router-dom";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useT } from "../i18n/text";
import { CERT_BADGES, SITE } from "../i18n/site";
import { FOOTER_EXPLORE, FOOTER_LINKS } from "../i18n/navigation";
import { CertBadge } from "./blocks";
import Logo from "./Logo";

/* Ordered as they appear on the certifications page. Badge artwork is keyed by
 * the same code in `CERT_BADGES`, so adding a standard in one place adds it here. */
const CERTS = ["ISO 9001", "ISO 14001", "ISO 45001", "ISO 22000:2018", "BRCGS"];

/* Same white "coin" as the certifications page — reuses `CertBadge` so the
 * crop behaviour matches too: a round medallion fills the coin edge to edge
 * (its "transparent" PNG has a checker-patterned square margin baked in, not
 * real alpha, and only a circular crop removes that from the corners), while
 * a non-circular logo like the BRCGS wordmark is letterboxed uncropped
 * (`fit: "contain"` in `CERT_BADGES`). `CertBadge` already renders the
 * missing-file fallback (the code in mono) inside the same white circle. */
function FooterCert({ code }: { code: string }) {
  return (
    <span
      title={code}
      className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-white/15 transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
    >
      <CertBadge code={code} badge={CERT_BADGES[code]} />
    </span>
  );
}

function FooterLink({ to, children }: { to: string; children: string }) {
  if (to.startsWith("/brochure")) {
    return (
      <a href={to} download className="text-sm text-white/60 transition-colors hover:text-white">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className="text-sm text-white/60 transition-colors hover:text-white">
      {children}
    </Link>
  );
}

export default function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <div className="weave absolute inset-0 opacity-50" />
      <div className="wrap relative grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="lg:col-span-4">
          <Logo variant="footer" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">{t.footer.tagline}</p>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-red"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        {/* Explore */}
        <div className="lg:col-span-2">
          <h3 className="eyebrow text-white/40">{t.footer.explore}</h3>
          <ul className="mt-5 space-y-2.5">
            {FOOTER_EXPLORE.map((l) => (
              <li key={l.to}>
                <FooterLink to={l.to}>{l.label(t)}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div className="lg:col-span-3">
          <h3 className="eyebrow text-white/40">{t.footer.quickLinks}</h3>
          <ul className="mt-5 space-y-2.5">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <FooterLink to={l.to}>{l.label(t)}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <h3 className="eyebrow text-white/40">{t.footer.getInTouch}</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/60">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
              <span>{SITE.addressLines.join(", ")}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
              <a href={SITE.phoneHref} className="hover:text-white">{SITE.phone}</a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
              {/* Both inboxes share one row — a second Mail icon would read as a
                  separate contact channel rather than a second address. */}
              <span className="flex flex-col gap-1">
                <a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a>
                <a href={`mailto:${SITE.exportEmail}`} className="hover:text-white">{SITE.exportEmail}</a>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Certifications + map */}
      <div className="wrap relative grid items-center gap-6 border-t border-white/10 py-8 lg:grid-cols-2">
        <div className="flex flex-wrap items-center gap-3">
          {CERTS.map((c) => (
            <FooterCert key={c} code={c} />
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <iframe
            title={t.contact.mapHeading}
            src={SITE.mapEmbedUrl}
            className="h-44 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
          <p>© {year} {SITE.brand}. {t.footer.rights}</p>
          <a href={SITE.websiteUrl} className="hover:text-white">{SITE.website}</a>
        </div>
      </div>
    </footer>
  );
}
