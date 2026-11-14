import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, Clock } from "lucide-react";
import { useT } from "../i18n/text";
import { CERT_BADGES, STATS } from "../i18n/site";
import { INDUSTRIES, PATHS, PRODUCT_CATEGORIES } from "../i18n/navigation";
import { useLeadPopup } from "./LeadPopup";
import CountUp from "./CountUp";
import { FadeIn } from "./Motion";
import { Button, Peak } from "./ui";

/* ---------------- Stats band ---------------- */
export function StatsBand({ overlap = false }: { overlap?: boolean }) {
  const t = useT();
  return (
    <div className={`wrap relative z-20 ${overlap ? "-mt-16" : ""}`}>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-line shadow-xl ring-1 ring-ink/5 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.key} className="bg-white p-6 text-center sm:p-7">
            <div className="font-display text-3xl font-extrabold text-blue sm:text-[2.5rem]">
              <CountUp end={s.value} suffix={s.suffix} />
            </div>
            <div className="eyebrow mt-2 justify-center text-muted">{t.stats[s.key]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Process steps ---------------- */
export function ProcessSteps() {
  const t = useT();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {t.about.process.steps.map((step, i) => (
        <FadeIn key={step.name} delay={i * 0.08}>
          <div className="relative h-full rounded-2xl border border-line bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-grad-dark font-mono text-lg font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h4 className="mt-4 font-display text-lg font-bold text-ink">{step.name}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

/* ---------------- Product category cards ---------------- */
export function ProductCards() {
  const t = useT();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {PRODUCT_CATEGORIES.map(({ id, to, icon: Icon }, i) => {
        const c = t.products.categories[id];
        return (
          <FadeIn key={id} delay={i * 0.07}>
            <Link
              to={to}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue/30 hover:shadow-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-grad-dark text-white">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-ink">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
                {t.cta.learnMore}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}

/* ---------------- Industry cards ---------------- */
/* Presentational only — the client asked for these to stop linking out to the
 * individual industry pages (those stay live, reached from the Industry
 * Solutions menu). Hover lift and the icon colour-swap went with the link: a
 * card that reacts to the cursor but does nothing on click reads as broken. */
export function IndustryCards() {
  const t = useT();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {INDUSTRIES.map(({ id, slug, icon: Icon }, i) => (
        <FadeIn key={slug} delay={(i % 4) * 0.07}>
          <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue">
              <Icon className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-ink">{t.industries.items[id].name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.industries.items[id].lead}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

/* ---------------- Values ---------------- */
export function ValuesList() {
  const t = useT();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {t.about.values.items.map((v, i) => (
        <FadeIn key={v.name} delay={(i % 3) * 0.07}>
          <div className="h-full rounded-2xl border border-line bg-white p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red">
              <Check className="h-5 w-5" strokeWidth={2.4} />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-ink">{v.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

/* ---------------- Certifications grid ---------------- */
/* Every badge fills a true-white circular "coin" edge to edge — not the card's
 * off-white `bg-surface`, and not letterboxed with margin around it.
 *
 * The supplied "transparent" PNGs are square canvases with the round medallion
 * inscribed inside them, margin visible in the corners (checker-patterned in
 * the source files, i.e. not genuinely transparent pixels). `object-cover` on
 * a circle-clipped, zero-padding frame crops those corners away entirely,
 * regardless of whether the margin is real alpha or baked-in checker — the
 * clip removes the square, not the pattern inside it. Don't add padding or
 * switch back to `object-contain` here; that's what let the square show
 * through in the first place. If a file has not been dropped into `public/`
 * yet, the coin shows the code in the house mono so the page never renders a
 * broken-image glyph. */
export function CertBadge({
  code,
  badge,
}: {
  code: string;
  badge?: { src: string; alt: string; fit?: "cover" | "contain" };
}) {
  const [failed, setFailed] = useState(false);

  if (!badge || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-white">
        <span className="px-2 text-center font-mono text-sm font-bold uppercase tracking-wide text-ink/40">
          {code}
        </span>
      </div>
    );
  }
  return (
    <img
      src={badge.src}
      alt={badge.alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-full w-full ${badge.fit === "contain" ? "object-contain p-3" : "object-cover"}`}
    />
  );
}

export function CertGrid() {
  const t = useT();
  const { certified, inProgress } = t.certifications.statusLabels;
  const items = t.certifications.items;

  return (
    <div className="grid gap-7 lg:grid-cols-2">
      {items.map((c, i) => {
        const pending = c.status === "inProgress";
        // An odd item count leaves a gap in the last row — let the trailing
        // card run the full width rather than sit lopsided beside empty space.
        const wide = items.length % 2 === 1 && i === items.length - 1;

        return (
          // `FadeIn` is the grid item, so the span and full-height live on it —
          // put them on the <article> and the card sizes to itself instead.
          <FadeIn key={c.code} delay={(i % 2) * 0.07} className={`h-full ${wide ? "lg:col-span-2" : ""}`}>
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:border-blue/25 hover:shadow-[0_28px_60px_-32px_rgba(15,23,42,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:flex-row">
              {/* badge plate — the surface tone frames a white coin, so every
                  mark (transparent PNG or white-ground JPEG) sits on true
                  white and reads as one cohesive badge set. Sized generously:
                  this is the certification's proof, not a decoration. */}
              <div
                className={`flex shrink-0 items-center justify-center border-line bg-surface p-7 sm:border-r sm:p-8 ${
                  wide ? "sm:w-64" : "sm:w-56"
                }`}
              >
                <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-line sm:h-40 sm:w-40">
                  <CertBadge code={c.code} badge={CERT_BADGES[c.code]} />
                </div>
              </div>

              {/* the standard, in full */}
              <div className="flex flex-1 flex-col p-8 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
                    {c.code}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wider ${
                      pending
                        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    {pending ? <Clock className="h-3.5 w-3.5" /> : <BadgeCheck className="h-3.5 w-3.5" />}
                    {pending ? inProgress : certified}
                  </span>
                </div>

                <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.14em] text-red">
                  {c.label}
                </p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{c.desc}</p>
              </div>
            </article>
          </FadeIn>
        );
      })}
    </div>
  );
}

/* Homepage trust strip — the same white "coin" treatment as the full
 * certifications page, at a smaller size that fits a single row. Real logos,
 * not the mono-text codes this row used to show. */
export function CertLogoStrip() {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {t.certifications.items.map((c) => (
        <div
          key={c.code}
          title={c.code}
          className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-line sm:h-24 sm:w-24"
        >
          <CertBadge code={c.code} badge={CERT_BADGES[c.code]} />
        </div>
      ))}
    </div>
  );
}

/* ---------------- Final CTA band ---------------- */
export function CtaBand() {
  const t = useT();
  const { openQuote } = useLeadPopup();
  return (
    <section className="bg-grad-dark relative overflow-hidden">
      <div className="weave absolute inset-0 opacity-50" />
      <div className="wrap relative py-16 text-center sm:py-20">
        <Peak className="mx-auto h-6 w-16 text-red" />
        <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {t.home.finalCta.heading}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{t.home.finalCta.body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={openQuote} variant="primary">{t.cta.quote}</Button>
          <Button to={PATHS.products} variant="lightOutline">{t.cta.explore}</Button>
        </div>
      </div>
    </section>
  );
}
