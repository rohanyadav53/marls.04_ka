/* Homepage-only sections.
 *
 * The cross-page building blocks (stats band, product/industry cards, CTA band)
 * live in `blocks.tsx`. Everything here is composed for the homepage narrative:
 * executive summary → values → process → facility → sustainability → founder.
 */
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  Gauge,
  HeartHandshake,
  Quote,
  Recycle,
  ShieldCheck,
  SprayCan,
  Sun,
  Timer,
  Trash2,
} from "lucide-react";
import { useT } from "../i18n/text";
import { SITE } from "../i18n/site";
import { PATHS } from "../i18n/navigation";
import { PHOTOS } from "../data/photos";
import { FadeIn } from "./Motion";
import { Button, Peak, Section, SectionHeading } from "./ui";

/* ============================================================
   A — Executive summary
   ============================================================ */
export function ExecutiveSummary() {
  const t = useT();
  const s = t.home.summary;

  const units: Array<{ name: string; tag: string; desc: string }> = [
    { name: SITE.legalEntity, ...s.units.woven },
    { name: SITE.flexibleEntity, ...s.units.flexible },
  ];

  return (
    <Section bg="white">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <FadeIn>
          <SectionHeading eyebrow={s.eyebrow} title={s.heading} align="start" />
          <p className="mt-6 text-lg leading-relaxed text-muted">{s.body}</p>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {units.map((u) => (
              <div
                key={u.name}
                className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-blue/30"
              >
                <span className="eyebrow text-red">{u.tag}</span>
                <h3 className="mt-2 font-display text-base font-bold leading-snug text-ink">{u.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{u.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <Button to={PATHS.about} variant="outline" icon={ArrowRight}>
              {t.nav.about}
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.12} className="relative">
          <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
            <img
              src={PHOTOS.tapeLine}
              alt="Operator at the tape extrusion line"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {/* Floating capacity chip — the one number worth stealing focus. */}
          <div className="bg-grad-dark absolute -bottom-6 left-6 rounded-2xl px-6 py-4 shadow-xl ring-1 ring-white/10 sm:-left-6">
            <div className="font-display text-3xl font-extrabold leading-none text-white">{s.statValue}</div>
            <div className="eyebrow mt-1.5 text-white/60">{s.statLabel}</div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ============================================================
   B — Organisation values (5-up, on a dark band)
   ============================================================ */
const VALUE_ICONS: LucideIcon[] = [ShieldCheck, BadgeCheck, Timer, SprayCan, HeartHandshake];

export function OrganisationValues() {
  const t = useT();
  const v = t.home.values;

  return (
    <section className="bg-grad-dark relative overflow-hidden py-16 sm:py-24">
      <div className="weave absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="wrap relative">
        <FadeIn>
          <SectionHeading eyebrow={v.eyebrow} title={v.heading} sub={v.sub} light />
        </FadeIn>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {v.items.map((item, i) => {
            const Icon = VALUE_ICONS[i] ?? ShieldCheck;
            return (
              <FadeIn key={item.name} delay={(i % 5) * 0.07} className="h-full">
                <div className="group h-full bg-[#0d2b52] p-7 transition-colors hover:bg-[#12335f]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-[#ff8a82] ring-1 ring-white/15 transition-colors group-hover:bg-red group-hover:text-white group-hover:ring-red">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold leading-snug text-white">{item.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/60">{item.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   C — Five-step process (rail on desktop, spine on mobile)
   ============================================================ */
export function ProcessTimeline() {
  const t = useT();
  const w = t.home.workflow;

  return (
    <Section bg="surface">
      <FadeIn>
        <SectionHeading eyebrow={w.eyebrow} title={w.heading} sub={w.sub} />
      </FadeIn>

      <div className="relative mt-16">
        {/* Mobile: one spine down the left, behind the badges. */}
        <div className="absolute bottom-2 left-[1.375rem] top-2 w-px bg-line lg:hidden" />

        <ol className="relative grid gap-9 lg:grid-cols-5 lg:gap-6">
          {w.steps.map((step, i) => (
            <FadeIn key={step.name} delay={i * 0.08}>
              <li className="relative flex gap-5 lg:block">
                {/* Desktop: a connector per step, so the rail stops at 05
                    instead of trailing off the right edge. */}
                {i < w.steps.length - 1 && (
                  <span aria-hidden className="absolute -right-6 left-11 top-[1.375rem] hidden h-px bg-line lg:block" />
                )}
                <span className="bg-grad-dark relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-sm font-bold text-white ring-4 ring-surface">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="lg:mt-6 lg:pr-4">
                  <h3 className="font-display text-base font-bold leading-snug text-ink">{step.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
                </div>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ============================================================
   D — Facility / infrastructure photo strip
   ============================================================ */
const FACILITY_TILES = [PHOTOS.laminationLine, PHOTOS.flexoPress, PHOTOS.bagConversion];

export function FacilityStrip() {
  const t = useT();
  const f = t.home.facility;

  return (
    <Section bg="white">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-end lg:gap-14">
        <FadeIn>
          <SectionHeading eyebrow={f.eyebrow} title={f.heading} align="start" />
          <p className="mt-5 text-lg leading-relaxed text-muted">{f.body}</p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-line">
            <img
              src={PHOTOS.weavingHall}
              alt="Circular weaving hall at the MARLSBORO Group plant"
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>
        </FadeIn>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {f.tiles.map((tile, i) => (
          <FadeIn key={tile.name} delay={i * 0.08}>
            <figure className="group h-full overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="overflow-hidden">
                <img
                  src={FACILITY_TILES[i]}
                  alt={tile.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-5">
                <h3 className="font-display text-base font-bold text-ink">{tile.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{tile.desc}</p>
              </figcaption>
            </figure>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   E — Sustainability / I AM RECYCLABLE
   ============================================================ */
const GREEN_ICONS: LucideIcon[] = [Sun, Recycle, Trash2, Gauge];

export function SustainabilityBand() {
  const t = useT();
  const g = t.home.green;

  return (
    <Section bg="surface">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeIn className="relative">
          <div className="overflow-hidden rounded-3xl border border-line shadow-xl shadow-ink/5">
            <img
              src={PHOTOS.solarPlant}
              alt="Rooftop solar array over the MARLSBORO Group plant"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 right-6 rounded-2xl bg-emerald-600 px-6 py-4 shadow-xl ring-1 ring-emerald-700/20 sm:-right-6">
            <div className="font-display text-3xl font-extrabold leading-none text-white">{g.statValue}</div>
            <div className="eyebrow mt-1.5 text-white/75">{g.statLabel}</div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SectionHeading eyebrow={g.eyebrow} title={g.heading} align="start" />
          <p className="mt-5 text-lg leading-relaxed text-muted">{g.body}</p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {g.pillars.map((p, i) => {
              const Icon = GREEN_ICONS[i] ?? Recycle;
              return (
                <div key={p.name} className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/15">
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="font-display text-sm font-bold leading-snug text-ink">{p.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* One route now: the standalone Sustainability page is gone and this
              button lands on I AM RECYCLABLE. */}
          <div className="mt-9">
            <Button to={PATHS.recyclable} variant="outline" icon={ArrowRight}>
              {t.nav.sustainability}
            </Button>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ============================================================
   F — Founder's note
   ============================================================ */
export function FounderNote() {
  const t = useT();
  const f = t.home.founderNote;

  return (
    <section className="bg-ink relative overflow-hidden py-20 sm:py-28">
      <div className="weave absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-red/10 blur-3xl" />
      <div className="wrap relative">
        <FadeIn className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-[#ff8a82]">{f.eyebrow}</p>
          <Quote className="mx-auto mt-7 h-9 w-9 text-red" strokeWidth={1.5} />
          <blockquote className="mt-6 font-display text-xl font-medium leading-[1.55] text-white sm:text-[1.75rem] sm:leading-[1.45]">
            “{f.quote}”
          </blockquote>
          <div className="mt-9 flex flex-col items-center">
            <Peak className="h-4 w-12 text-white/25" />
            <div className="mt-4 font-display text-base font-bold text-white">{SITE.founder}</div>
            <div className="eyebrow mt-1 justify-center text-white/50">
              {f.role}, {SITE.brand}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
