import type { LucideIcon } from "lucide-react";
import { WovenSackIcon } from "../components/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Droplets,
  Flame,
  Gauge,
  Layers,
  Leaf,
  Recycle,
  Repeat,
  ShoppingBag,
  Sparkles,
  Sun,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";

import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import { Section } from "../components/ui";
import { FadeIn } from "../components/Motion";
import { useLeadPopup } from "../components/LeadPopup";
import { PATHS } from "../i18n/navigation";
import { PHOTOS } from "../data/photos";

/* ─────────────────────────────────────────────────────────────
 * "I AM RECYCLABLE" — the group's single environmental page.
 * (The old standalone /sustainability page folded into this one.)
 *
 * Palette: emerald/green accents on white and light grey, so the page
 * reads as eco without abandoning the corporate blue/red system —
 * the brand ink still carries every heading.
 *
 * Copy is authored inline in English; nav labels come from the
 * dictionary (t.nav.recyclable) so they still translate per locale.
 * ───────────────────────────────────────────────────────────── */

type Commitment = { icon: LucideIcon; title: string; body: string };
type EcoFact = { icon: LucideIcon; product: string; title: string; body: string };
type Step = { icon: LucideIcon; title: string; body: string };
type ProductLink = { icon: LucideIcon; name: string; blurb: string; to: string };

/* The four pillars of the initiative. */
const COMMITMENTS: Commitment[] = [
  {
    icon: Sun,
    title: "1 MW Rooftop Solar Plant",
    body: "A megawatt of rooftop generation feeds the plant directly, so a meaningful share of every tape line, loom and press runs on renewable energy rather than grid power. Sustainable operations start with how we make the electricity we use.",
  },
  {
    icon: Recycle,
    title: "Recyclable Packaging",
    body: "Our WPP woven sacks are built as a mono-material — polypropylene through and through — which is precisely what makes responsible material recovery possible. No mixed layers to separate, no contamination to sort out at end of life.",
  },
  {
    icon: Trash2,
    title: "Waste Minimisation",
    body: "Trim, offcuts and start-up scrap are collected at the machine, reground and fed back into production wherever specification allows. What cannot be reused internally is routed to recyclers rather than to landfill.",
  },
  {
    icon: Gauge,
    title: "Resource Efficiency",
    body: "Tighter GSM control, planned production runs and monitored consumption mean less material and less energy per bag. Optimised processes reduce waste and improve operational efficiency at the same time.",
  },
];

const ECO_FACTS: EcoFact[] = [
  {
    icon: Repeat,
    product: "PP Woven Bags",
    title: "Woven for Reuse",
    body: "High tensile strength lets our standard PP bags handle multiple high-stress transit trips before reaching the end of their lifecycle — then they are fully recyclable as a mono-material.",
  },
  {
    icon: Zap,
    product: "BOPP Laminated",
    title: "Low-Temp Processing",
    body: "BOPP films melt at highly efficient temperatures, making the mechanical recycling process far more energy-efficient than many traditional plastics — saving fossil fuels at end of life.",
  },
];

const REBIRTH_STEPS: Step[] = [
  {
    icon: Truck,
    title: "Collection & Sorting",
    body: "Used sacks and offcuts are gathered and sorted by polymer type, keeping the PP and BOPP streams cleanly separated for high-quality recycling.",
  },
  {
    icon: Droplets,
    title: "Washing & Decontamination",
    body: "Material is washed to strip away product residue, dust and labels — meeting the cleanliness that genuine recycling demands.",
  },
  {
    icon: Flame,
    title: "Low-Temp Extrusion",
    body: "Clean flakes are melted at efficient, low temperatures and extruded, minimising the energy and fossil fuels consumed in reprocessing.",
  },
  {
    icon: Sparkles,
    title: "Granule Rebirth",
    body: "The melt is cut into premium polymer granules — ready to be woven into new packaging, diverting waste from landfill for a genuine second life.",
  },
];

const EXPLORE: ProductLink[] = [
  {
    icon: WovenSackIcon,
    name: "PP Woven Bags",
    blurb: "Recyclable mono-material sacks woven for strength and reuse.",
    to: `${PATHS.products}/pp-woven-bags`,
  },
  {
    icon: Layers,
    name: "BOPP EZ-Open Bags",
    blurb: "Laminated woven bags that recycle at low, energy-efficient temperatures.",
    to: `${PATHS.products}/bopp-ez-open-bags`,
  },
  {
    icon: ShoppingBag,
    name: "PLWPP Carry Bags",
    blurb: "Durable, reusable woven carry bags — a lasting alternative to single-use plastic.",
    to: `${PATHS.products}/plwpp-carry-bags`,
  },
];

// Woven-weave motif for the green bands (matches the site's signature texture).
const weave =
  "repeating-linear-gradient(45deg, rgba(255,255,255,.07) 0 1px, transparent 1px 14px)," +
  "repeating-linear-gradient(-45deg, rgba(255,255,255,.07) 0 1px, transparent 1px 14px)";

/* Small shared heading so every section keeps the same rhythm. */
function EcoHeading({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "start";
}) {
  const centred = align === "center";
  return (
    <div className={centred ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow flex items-center gap-2.5 text-emerald-600 ${centred ? "justify-center" : ""}`}>
        <span className="h-px w-7 bg-current" />
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.5rem]">
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

/* The three I AM RECYCLABLE photos are not in `public/photos/` yet. Render the
 * real frame when it is there and a captioned green plate when it is not, so a
 * missing file never lands as a broken-image glyph mid-page. */
function EcoFigure({
  src,
  alt,
  caption,
  ratio = "aspect-[3/2]",
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  ratio?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_30px_70px_-42px_rgba(5,150,105,0.6)] ${className}`}
    >
      {failed ? (
        <div
          className={`flex w-full flex-col items-center justify-center gap-3 bg-green-50 text-emerald-600/70 ${ratio}`}
        >
          <Recycle className="h-10 w-10" strokeWidth={1.6} />
          <span className="px-6 text-center text-sm font-semibold">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`w-full object-cover ${ratio}`}
        />
      )}
      {caption && (
        <figcaption className="border-t border-emerald-100 bg-white px-6 py-4 text-sm leading-relaxed text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export default function IAmRecyclable() {
  const t = useT();
  const { openQuote } = useLeadPopup();

  return (
    <>
      <Seo
        title="I AM RECYCLABLE"
        description="Sustainability in action at MARLSBORO Group — a 1 MW rooftop solar plant, recyclable WPP woven sacks, waste minimisation and resource-efficient manufacturing."
        path={PATHS.recyclable}
      />

      {/* ───────────────── A. Split hero ─────────────────
          Text left, the solar array filling the whole right half and
          bleeding to the viewport edge. Stacks image-first on mobile. */}
      <section className="relative overflow-hidden bg-white">
        <div className="grid lg:grid-cols-2">
          {/* image — second in DOM order, first on small screens */}
          <div className="relative order-first min-h-[16rem] sm:min-h-[22rem] lg:order-last lg:min-h-[40rem]">
            <img
              src={PHOTOS.solarPlantWide}
              alt="The 1 MW rooftop solar array above the MARLSBORO Group plant"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* soft seam so the photo melts into the white panel on desktop */}
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-24 bg-gradient-to-r from-white to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 to-transparent lg:hidden" />
          </div>

          {/* words */}
          <div className="flex items-center">
            <div className="w-full max-w-xl px-5 py-14 sm:px-8 lg:ml-auto lg:py-24 lg:pr-14">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
                <Link to={PATHS.home} className="transition-colors hover:text-emerald-700">
                  {t.common.breadcrumbHome}
                </Link>
                <span aria-hidden="true">›</span>
                <span className="font-medium text-ink">{t.nav.recyclable}</span>
              </nav>

              <FadeIn>
                <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  <Leaf className="h-4 w-4" />
                  I am recyclable
                </span>

                <h1 className="mt-6 font-display text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.25rem] lg:leading-[1.06]">
                  Sustainability in Action:{" "}
                  <span className="text-emerald-600">Packaging with a Purpose</span>
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-muted">
                  Responsible manufacturing is not a department at MARLSBORO Group — it is how the
                  plant is powered, how the material is chosen, and what happens to both once an
                  order ships. Renewable energy, recyclable mono-material sacks, and processes built
                  to waste as little as possible.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#commitments"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-transform hover:-translate-y-0.5"
                  >
                    Our commitments
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={openQuote}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-emerald-600 hover:text-emerald-700"
                  >
                    {t.cta.quote}
                  </button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── B. The headline numbers ───────────────── */}
      <section className="border-y border-line bg-surface">
        <div className="wrap grid gap-8 py-12 sm:grid-cols-3 sm:py-14">
          {[
            { value: "1 MW", label: "Rooftop solar plant" },
            { value: "100%", label: "Recyclable PP mono-material" },
            { value: "Zero", label: "Landfill target for production scrap" },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div className="text-center sm:text-left">
                <div className="font-display text-3xl font-extrabold leading-none text-emerald-600 sm:text-4xl">
                  {s.value}
                </div>
                <div className="eyebrow mt-2 justify-center text-muted sm:justify-start">{s.label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ───────────────── C. The four commitments ───────────────── */}
      <Section id="commitments" bg="white">
        <FadeIn>
          <EcoHeading
            eyebrow="Our commitments"
            title="Four things we hold ourselves to"
            sub="Concrete, checkable practices — not a statement of intent."
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {COMMITMENTS.map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeIn key={c.title} delay={(i % 2) * 0.08}>
                <article className="group relative h-full overflow-hidden rounded-3xl border border-line bg-white p-8 transition-all hover:border-emerald-200 hover:shadow-[0_28px_60px_-32px_rgba(5,150,105,0.5)] sm:p-10">
                  {/* number ghost */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-6 top-4 font-display text-6xl font-extrabold text-emerald-50 transition-colors group-hover:text-green-100"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                    <Icon className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h3 className="relative mt-6 font-display text-xl font-bold leading-snug text-ink">
                    {c.title}
                  </h3>
                  <p className="relative mt-3 text-[0.95rem] leading-relaxed text-muted">{c.body}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* ───────────────── C2. Full-bleed proof band ─────────────────
          The finished-goods frame, used as the visual argument for the
          mono-material claim the commitments just made. `bg-ink` sits under the
          photo so the band still reads as a solid dark break if the file is
          missing — the copy stays legible either way. */}
      <section className="relative isolate overflow-hidden bg-ink">
        <img
          src={PHOTOS.finishedGoods}
          alt="Palletised MARLSBORO Group woven sacks in the finished-goods warehouse, each carrying the recycling mark"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* ink wash, heaviest under the text and clearing to show the racking */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/25 sm:to-transparent"
        />
        <div className="wrap relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-xl">
            <p className="eyebrow flex items-center gap-2.5 text-emerald-300">
              <span className="h-px w-7 bg-current" />
              Mono-material by design
            </p>
            <h2 className="mt-4 text-balance font-display text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-[2.5rem]">
              One polymer in. One polymer out.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              A woven sack built entirely from polypropylene has nothing to separate at end of
              life — no mixed layers, no laminate to strip, no contamination to sort out. That
              single decision, taken at the design stage, is what turns a used sack from waste
              into feedstock.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {["No mixed layers", "Recycle mark on every sack", "Sorts as a single stream"].map(
                (point) => (
                  <span
                    key={point}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm"
                  >
                    <Check className="h-4 w-4 text-emerald-300" />
                    {point}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── D. Philosophy ───────────────── */}
      <Section bg="surface">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <EcoHeading
              eyebrow="Our philosophy"
              title="Reduce, Reutilize and Reprocess."
              align="start"
            />
            <div className="mt-7 flex flex-wrap gap-3">
              {["Reduce", "Reutilize", "Reprocess"].map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-green-50 px-4 py-1.5 text-sm font-semibold text-emerald-700"
                >
                  <Recycle className="h-4 w-4" />
                  {r}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted">
              <p>
                For packaging to be genuinely recycled, it must meet strict requirements on
                separability, coloration and cleanliness. MARLSBORO Group meets those requirements
                with current manufacturing technology, so our packaging is ready for a second life
                rather than nominally recyclable.
              </p>
              <p>
                Our PP and BOPP bags are reusable and recyclable. BOPP can be reprocessed at
                remarkably low temperatures, saving significant energy at end of life. Ultimately the
                woven sack is melted down and repurposed into premium polymer granules — kept in use,
                and kept out of landfill.
              </p>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* ───────────────── E. Product-specific eco facts ───────────────── */}
      <Section bg="white">
        <FadeIn>
          <EcoHeading
            eyebrow="Built to be recycled"
            title="Every product, a second life"
            sub="Each format in our range is engineered so its material can be recovered, reprocessed and reborn."
          />
        </FadeIn>

        {/* Two cards since the FIBC/jumbo-bag entry was dropped — capped so the
            pair sits centred rather than stretching the full page width. */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          {ECO_FACTS.map((f, i) => {
            const Icon = f.icon;
            return (
              <FadeIn key={f.product} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-emerald-100 bg-green-50/60 p-7 transition-shadow hover:shadow-[0_22px_46px_-24px_rgba(5,150,105,0.45)]">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25">
                    <Icon className="h-7 w-7" />
                  </span>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-emerald-600">
                    {f.product}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-ink">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{f.body}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* ───────────────── F. The rebirth process ───────────────── */}
      <Section bg="surface">
        <FadeIn>
          <EcoHeading
            eyebrow="The rebirth process"
            title="From used sack to new granule"
            sub="A four-step journey that keeps polypropylene in use and out of landfill."
          />
        </FadeIn>

        {/* the sorting floor, where step one actually happens */}
        <FadeIn delay={0.08}>
          <EcoFigure
            className="mx-auto mt-14 max-w-4xl"
            src={PHOTOS.sortingLine}
            alt="Operators on a materials-recovery conveyor separating PP woven bags from flexible packaging films"
            ratio="aspect-[16/9]"
            caption="Streams are split at the belt — PP woven one way, flexible film the other. Clean separation here is what makes everything downstream possible."
          />
        </FadeIn>

        <div className="relative mt-16">
          <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
            {REBIRTH_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <FadeIn key={s.title} delay={i * 0.1}>
                  <li className="relative">
                    {/* connector stops at the last node instead of trailing off */}
                    {i < REBIRTH_STEPS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute -right-6 left-16 top-8 hidden h-0.5 bg-emerald-100 md:block"
                      />
                    )}
                    <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 ring-8 ring-surface">
                      <Icon className="h-8 w-8" strokeWidth={1.7} />
                    </span>
                    <p className="mt-4 text-xs font-bold uppercase tracking-wider text-emerald-600">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                  </li>
                </FadeIn>
              );
            })}
          </ol>
        </div>
      </Section>

      {/* ───────────────── G. rPP explainer — industry context ─────────────────
          Deliberately third-person throughout. This section describes how the
          rPP value chain works across the packaging sector; it is NOT a claim
          that MARLSBORO Group packaging contains recycled content. Keep the
          voice neutral if this copy is ever revised. */}
      <section className="border-y border-emerald-100 bg-green-50/70">
        <div className="wrap py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <EcoFigure
                src={PHOTOS.recycledGranules}
                alt="rPP Lifecycle Process — reprocessed polypropylene granules spilling from a woven sack"
              />
            </FadeIn>

            <FadeIn delay={0.1}>
              <EcoHeading
                eyebrow="Industry context"
                title="The Future of Packaging: Understanding the rPP Process"
                align="start"
              />

              <div className="mt-7 space-y-5 text-[1.05rem] leading-relaxed text-muted">
                <p>
                  Recycled Polypropylene (rPP) represents a critical step toward a circular
                  packaging economy. The process begins with the recovery of post-consumer or
                  post-industrial polypropylene waste. This material is rigorously sorted, cleaned,
                  and shredded into flakes. Through advanced extrusion technologies, these flakes
                  are melted, filtered, and re-pelletized into high-quality rPP resin.
                </p>
                <p>
                  By blending these recycled resins with virgin polymers, the packaging industry can
                  significantly reduce its reliance on fossil fuels, lower greenhouse gas emissions,
                  and divert valuable plastics away from landfills—all while maintaining the
                  structural integrity required for heavy-duty industrial applications.
                </p>
              </div>

              <ul className="mt-8 flex flex-wrap gap-2.5">
                {["Recovery", "Sorting & cleaning", "Shredding", "Extrusion", "Re-pelletizing"].map(
                  (stage) => (
                    <li
                      key={stage}
                      className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-emerald-700"
                    >
                      <Recycle className="h-3.5 w-3.5" />
                      {stage}
                    </li>
                  ),
                )}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ───────────────── H. Explore the range ───────────────── */}
      <Section bg="white">
        <FadeIn>
          <EcoHeading
            eyebrow="Explore the range"
            title="Recyclable by design"
            sub="The products engineered for a circular lifecycle."
          />
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXPLORE.map((p, i) => {
            const Icon = p.icon;
            return (
              <FadeIn key={p.name} delay={i * 0.08}>
                <Link
                  to={p.to}
                  className="group flex h-full flex-col rounded-2xl border border-emerald-100 bg-white p-7 transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_22px_46px_-24px_rgba(5,150,105,0.5)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-emerald-500/60 motion-reduce:transition-none"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-emerald-600">
                    {t.cta.learnMore}
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </Link>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn>
          <div className="mt-12 text-center">
            <Link
              to={PATHS.products}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-600 px-7 py-3.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              {t.cta.allProducts}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </FadeIn>
      </Section>

      {/* ───────────────── I. Green CTA band ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-800 to-green-600 text-white">
        <span className="absolute inset-0" style={{ backgroundImage: weave }} aria-hidden="true" />
        <div className="wrap relative py-16 text-center sm:py-20">
          <Recycle className="mx-auto h-10 w-10 text-white/90" />
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Ready to switch to recyclable packaging?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-50/85">
            Tell us your requirement and our team will respond within one business day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openQuote}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-emerald-700 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {t.cta.quote}
            </button>
            <Link
              to={PATHS.contact}
              className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t.cta.getInTouch}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
