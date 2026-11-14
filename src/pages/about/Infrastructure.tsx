import { ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Blend,
  Flame,
  Grid3x3,
  Layers,
  Layers3,
  PackageCheck,
  Palette,
  Printer,
  Scissors,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "../../i18n/text";
import { SITE } from "../../i18n/site";
import { PHOTOS } from "../../data/photos";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Button, Section, SectionHeading } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CertLogoStrip, CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";

/* Icons are positional: they follow the order of `flow.lanes[n].steps` in the
 * dictionary, so the copy can be re-worded or translated without touching
 * this file. Keep both lists the same length. */
const LANE_ICONS: LucideIcon[][] = [
  [Flame, Grid3x3, Layers, Printer, Scissors, PackageCheck], // woven
  [Layers3, Palette, Blend, Scissors, Package, PackageCheck], // flexible
];

/* One photo per stage block, in dictionary order. These four are the frames
 * that carry no third-party customer branding; the flexo-press and
 * bag-conversion shots are deliberately not used here (see photos.ts). */
const STAGE_PHOTOS = [
  { src: PHOTOS.tapeLine, ratio: "aspect-[4/5]" },
  { src: PHOTOS.weavingHall, ratio: "aspect-[16/10]" },
  { src: PHOTOS.laminationLine, ratio: "aspect-[16/10]" },
  { src: PHOTOS.finishedGoods, ratio: "aspect-[16/10]" },
] as const;

export default function Infrastructure() {
  const t = useT();
  const i = t.infrastructure;

  return (
    <>
      <Seo
        title={t.navGroups.about.infrastructure}
        description={i.hero.sub}
        path={PATHS.aboutInfrastructure}
      />
      <PageHero
        eyebrow={i.hero.eyebrow}
        title={i.hero.heading}
        sub={i.hero.sub}
        crumbs={[{ label: t.nav.about, to: PATHS.about }, { label: t.navGroups.about.infrastructure }]}
      />

      {/* ---- facts strip, lifted over the hero edge ---- */}
      <div className="wrap relative z-20 -mt-10">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-line shadow-xl ring-1 ring-ink/5 lg:grid-cols-4">
          {i.facts.map((f) => (
            <div key={f.label} className="bg-white p-5 text-center sm:p-7">
              <dt className="font-display text-3xl font-extrabold text-blue sm:text-4xl">{f.value}</dt>
              <dd className="eyebrow mt-2 justify-center text-muted">{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ---- the plant: photo + location ---- */}
      <Section bg="white">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <FadeIn>
            <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
              <img
                src={PHOTOS.facilityExterior}
                alt={i.plant.photoAlt}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <SectionHeading eyebrow={i.plant.eyebrow} title={i.plant.heading} align="start" />
            {i.plant.body.map((p) => (
              <p key={p} className="mt-5 leading-relaxed text-muted">
                {p}
              </p>
            ))}

            <div className="mt-7 rounded-2xl border border-line bg-surface p-5">
              <div className="eyebrow text-red">{i.plant.locationLabel}</div>
              <ul className="mt-3 space-y-2.5 text-sm text-ink/85">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                  <span>{SITE.addressLines.join(", ")}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                  <a href={SITE.phoneHref} className="hover:text-blue">{SITE.phone}</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-blue">{SITE.email}</a>
                </li>
              </ul>
              <a
                href={SITE.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
              >
                {i.plant.directions}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ---- production flow: two lanes ---- */}
      <Section bg="surface" id="flow">
        <FadeIn>
          <SectionHeading eyebrow={i.flow.eyebrow} title={i.flow.heading} sub={i.flow.sub} />
        </FadeIn>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {i.flow.lanes.map((lane, li) => (
            <FadeIn key={lane.name} delay={li * 0.1} className="h-full">
              <section className="h-full rounded-3xl border border-line bg-white p-7 sm:p-9">
                <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-5">
                  <div>
                    <span className="eyebrow text-red">{lane.tag}</span>
                    <h3 className="mt-1 font-display text-xl font-bold text-ink sm:text-2xl">{lane.name}</h3>
                  </div>
                  <span className="text-sm font-medium text-muted">{lane.sub}</span>
                </header>

                <ol className="relative mt-7 space-y-6">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-5 left-[1.375rem] top-5 w-px bg-gradient-to-b from-blue/40 to-blue/10"
                  />
                  {lane.steps.map((step, si) => {
                    const Icon = LANE_ICONS[li][si];
                    return (
                      <li key={step.name} className="relative flex gap-5">
                        <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-grad-dark text-white ring-4 ring-white">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <h4 className="font-display text-base font-bold text-ink">
                            <span className="mr-2 font-mono text-xs font-semibold text-red">
                              {String(si + 1).padStart(2, "0")}
                            </span>
                            {step.name}
                          </h4>
                          <p className="mt-1 text-sm leading-relaxed text-muted">{step.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* ---- inside the plant: alternating photo / text ---- */}
      <Section bg="white">
        <FadeIn>
          <SectionHeading eyebrow={i.stages.eyebrow} title={i.stages.heading} />
        </FadeIn>

        <div className="mt-16 space-y-20 lg:space-y-28">
          {i.stages.items.map((stage, n) => {
            const photo = STAGE_PHOTOS[n];
            const flip = n % 2 === 1;
            return (
              <div key={stage.name} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <FadeIn className={flip ? "lg:order-2" : ""}>
                  <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
                    <img
                      src={photo.src}
                      alt={stage.alt}
                      loading="lazy"
                      className={`${photo.ratio} w-full object-cover ${n === 0 ? "lg:max-h-[34rem]" : ""}`}
                    />
                  </div>
                </FadeIn>
                <FadeIn delay={0.08} className={flip ? "lg:order-1" : ""}>
                  <span className="font-mono text-sm font-semibold text-red">
                    {String(n + 1).padStart(2, "0")} / {String(i.stages.items.length).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-bold text-ink sm:text-3xl">{stage.name}</h3>
                  <span className="mt-3 block h-0.5 w-10 rounded bg-red" />
                  <p className="mt-5 text-lg leading-relaxed text-muted">{stage.lead}</p>
                  <ul className="mt-6 space-y-3">
                    {stage.points.map((pt) => (
                      <li key={pt} className="flex gap-3 text-[0.95rem] text-ink/85">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ---- full-bleed statement band ---- */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src={PHOTOS.circularLoom}
          alt={i.band.alt}
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/10" aria-hidden="true" />
        <div className="wrap py-20 sm:py-28">
          <span className="mb-4 block h-0.5 w-10 rounded bg-red" />
          <p className="eyebrow text-[#ff8a82]">{i.band.eyebrow}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            {i.band.heading}
          </h2>
        </div>
      </section>

      {/* ---- quality gates + certifications ---- */}
      <Section bg="surface">
        <FadeIn>
          <SectionHeading eyebrow={i.quality.eyebrow} title={i.quality.heading} sub={i.quality.sub} />
        </FadeIn>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {i.quality.steps.map((s, n) => (
            <li key={s.name}>
              <FadeIn delay={n * 0.06} className="h-full">
                <div className="relative h-full rounded-2xl border border-line bg-white p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-grad-dark font-mono text-base font-bold text-white">
                    {String(n + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-ink">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>

        <FadeIn>
          <div className="mt-12 flex flex-col items-center gap-6 rounded-3xl border border-line bg-white p-8 text-center sm:p-10">
            <div>
              <div className="eyebrow justify-center text-red">{i.quality.certsHeading}</div>
              <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{i.quality.hygiene}</p>
            </div>
            <CertLogoStrip />
            <Link
              to={PATHS.certifications}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
            >
              {i.quality.certsCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ---- energy ---- */}
      <Section bg="white">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn delay={0.08} className="lg:order-1">
            <SectionHeading eyebrow={i.energy.eyebrow} title={i.energy.heading} align="start" />
            <p className="mt-5 text-lg leading-relaxed text-muted">{i.energy.body}</p>
            <ul className="mt-6 space-y-3">
              {i.energy.points.map((pt) => (
                <li key={pt} className="flex gap-3 text-[0.95rem] text-ink/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {pt}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button to={PATHS.recyclable} variant="outline" icon={ArrowRight}>
                {i.energy.cta}
              </Button>
            </div>
          </FadeIn>
          <FadeIn className="lg:order-2">
            <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
              <img
                src={PHOTOS.solarPlant}
                alt={i.energy.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
