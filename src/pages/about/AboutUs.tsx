import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "../../i18n/text";
import { PHOTOS } from "../../data/photos";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section, SectionHeading } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { Timeline } from "../../components/Timeline";
import { StatsBand, ValuesList, ProcessSteps, CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";

/* The About page reads as one argument, top to bottom:
 *   who we are (story + proof numbers) → how we got here (timeline) →
 *   what we run (two units + the plant) → why it matters (pillars) →
 *   how we behave (values, process) → who stands behind it (founder).
 * Everything is dictionary-driven (`t.about.*`) so the other six languages
 * pick up copy as it is translated and fall back to English until then. */
export default function AboutUs() {
  const t = useT();
  const a = t.about;
  const unitLinks = [PATHS.woven, PATHS.flexible];

  return (
    <>
      <Seo title={t.nav.about} description={a.hero.sub} path={PATHS.about} />
      <PageHero
        eyebrow={a.hero.eyebrow}
        title={a.hero.heading}
        sub={a.hero.sub}
        crumbs={[{ label: t.nav.about }]}
      />

      {/* proof numbers, lifted over the hero edge. A shallower overlap than the
          homepage's: PageHero ends on a breadcrumb, which -mt-16 would crowd. */}
      <div className="relative z-20 -mt-8">
        <StatsBand />
      </div>

      {/* ---- story ---- */}
      <Section bg="white">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <FadeIn>
            <SectionHeading eyebrow={a.story.eyebrow} title={a.story.heading} align="start" />
            {a.story.paras.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-muted">
                {p}
              </p>
            ))}
            <div className="mt-7 rounded-xl border border-line bg-surface p-5">
              <div className="eyebrow text-red">{a.overview.sectorsLabel}</div>
              <p className="mt-2 text-sm font-medium text-ink/80">{a.overview.sectors}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
              <img
                src={PHOTOS.facilityExterior}
                alt={a.story.photoAlt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ---- timeline ---- */}
      <Section bg="surface" id="journey">
        <FadeIn>
          <SectionHeading eyebrow={a.journey.eyebrow} title={a.journey.heading} sub={a.journey.sub} />
        </FadeIn>
        <div className="mt-14">
          <Timeline items={a.journey.items} />
        </div>
      </Section>

      {/* ---- two business units ---- */}
      <Section bg="white">
        <FadeIn>
          <SectionHeading eyebrow={a.units.eyebrow} title={a.units.heading} sub={a.units.sub} />
        </FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {a.units.items.map((u, n) => (
            <FadeIn key={u.name} delay={n * 0.08} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-line bg-surface p-8 transition-all hover:-translate-y-1 hover:border-blue/25 hover:bg-white hover:shadow-xl sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow text-red">{u.tag}</span>
                  <span className="rounded-full bg-white px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-wider text-muted ring-1 ring-line">
                    {u.est}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold text-ink">{u.name}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted">{u.desc}</p>
                <Link
                  to={unitLinks[n]}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
                >
                  {u.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <div className="mt-8 text-center">
            <Link
              to={PATHS.aboutInfrastructure}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
            >
              {a.units.infraLink}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ---- pillars ---- */}
      <Section bg="surface">
        <FadeIn>
          <SectionHeading eyebrow={a.pillars.eyebrow} title={a.pillars.heading} />
        </FadeIn>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {a.pillars.items.map((p, n) => (
            <FadeIn key={p.name} delay={n * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-line bg-white p-6">
                <span className="font-mono text-sm font-semibold text-red">{String(n + 1).padStart(2, "0")}</span>
                <span className="mt-3 block h-0.5 w-8 rounded bg-red" />
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ---- values ---- */}
      <Section bg="white">
        <FadeIn>
          <SectionHeading eyebrow={a.values.eyebrow} title={a.values.heading} sub={a.values.sub} />
        </FadeIn>
        <div className="mt-12">
          <ValuesList />
        </div>
      </Section>

      {/* ---- process ---- */}
      <Section bg="surface">
        <FadeIn>
          <SectionHeading eyebrow={a.process.eyebrow} title={a.process.heading} sub={a.process.sub} />
        </FadeIn>
        <div className="mt-12">
          <ProcessSteps />
        </div>
      </Section>

      {/* ---- founder ---- */}
      <Section bg="white">
        <FadeIn>
          <figure className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red">
              <Quote className="h-6 w-6" />
            </span>
            <p className="eyebrow mt-6 justify-center text-red">{a.founderTeaser.eyebrow}</p>
            <blockquote className="mt-4 font-display text-2xl font-bold leading-snug text-ink sm:text-3xl">
              “{a.founderTeaser.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm text-muted">
              <span className="font-semibold text-ink">{a.founder.cite}</span>
            </figcaption>
            <Link
              to={PATHS.aboutFounder}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
            >
              {a.founderTeaser.cta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </figure>
        </FadeIn>
      </Section>

      <CtaBand />
    </>
  );
}
