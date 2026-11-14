import { useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Wheat, Factory, ShoppingBag, ArrowRight, ImageIcon } from "lucide-react";

import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import { Section, SectionHeading } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";
import { industryBySlug } from "../../data/catalog";

/* -------------------------------------------------------------------------
 * INTEGRATION NOTES
 * - Adapted from the Products page format. Groups the 8 industries from 
 * your navigation into 3 logical categories to utilize the section layout.
 * - Make sure PATHS.industries is defined in your navigation constants.
 * - Ensure translation keys (t.industries.hero.heading, etc.) are added 
 * to your i18n namespace.
 * - Images are optional. Add an image path to an item to replace the 
 * gray placeholder.
 * ----------------------------------------------------------------------- */

type Industry = { name: string; slug: string; desc: string; image?: string; featured?: boolean };
type Group = { id: string; title: string; blurb: string; icon: LucideIcon; items: Industry[] };

const GROUPS: Group[] = [
  {
    id: "food-agriculture",
    title: "Food & Agriculture",
    blurb: "Packaging solutions engineered to preserve freshness, prevent contamination, and withstand rigorous agricultural supply chains.",
    icon: Wheat,
    items: [
      { name: "Food & Agricultural Commodities", slug: "food-agriculture", desc: "Bulk and consumer packaging tailored for grains, seeds, pulses, and processed food products.", featured: true },
      { name: "Animal & Pet Nutrition", slug: "animal-pet-nutrition", desc: "Durable, high-barrier bags designed to protect feed and pet food from moisture and pests." },
      { name: "Agriculture & Crop Protection", slug: "agriculture-crop-protection", desc: "Robust, heavy-duty sacks for fertilizers, soil treatments, and agrochemicals." },
    ],
  },
  {
    id: "industrial",
    title: "Industrial & Heavy Duty",
    blurb: "High-strength woven and flexible formats built for the safe transport and storage of demanding industrial materials.",
    icon: Factory,
    items: [
      { name: "Chemicals & Industrial Products", slug: "chemicals-industrial", desc: "Secure, sift-proof packaging for hazardous and non-hazardous chemical powders and granules." },
      { name: "Construction & Building Materials", slug: "construction-building", desc: "Tear-resistant bags for cement, sand, gravel, and dry mortar mixes." },
      { name: "Mining & Energy", slug: "mining-energy", desc: "Extreme-duty packaging for minerals, coal, and extracted energy resources." },
    ],
  },
  {
    id: "consumer-retail",
    title: "Consumer & Retail",
    blurb: "High-clarity, beautifully printed packaging formats designed to maximize shelf appeal and consumer convenience.",
    icon: ShoppingBag,
    items: [
      { name: "Home Care Products", slug: "home-care", desc: "Spout pouches, stand-up bags, and laminates for detergents and household cleaners." },
      { name: "Retail & Packaging Solutions", slug: "retail-packaging", desc: "Customizable shopping bags, branded carry packs, and retail-ready display packaging." },
    ],
  },
];

const industryPath = (slug: string) => `${PATHS.industries || '/industries'}/${slug}`;

// Woven-weave signature motif (cross-hatch) for navy surfaces.
const weave: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 15px)," +
    "repeating-linear-gradient(-45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 15px)",
};

function IndustryImage({ src, alt, Icon }: { src?: string; alt: string; Icon: LucideIcon }) {
  const [errored, setErrored] = useState(false);
  const showImg = Boolean(src) && !errored;
  return (
    <div className={`relative grid min-h-[172px] shrink-0 grow-0 basis-[42%] place-items-center overflow-hidden max-[440px]:aspect-[4/3] max-[440px]:basis-auto ${showImg ? "bg-white" : "bg-gray-100"}`}>
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      ) : (
        <div className="grid place-items-center gap-2 text-gray-300">
          <Icon className="h-9 w-9" strokeWidth={1.5} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Industry Photo</span>
        </div>
      )}
    </div>
  );
}

function IndustryCard({ p }: { p: Industry }) {
  return (
    <Link
      to={industryPath(p.slug)}
      className="group relative flex overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D11F2D]/30 hover:shadow-[0_22px_46px_-24px_rgba(11,37,69,0.5)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#D11F2D]/60 motion-reduce:transition-none max-[440px]:flex-col"
    >
      {p.featured && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#D11F2D] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Key Sector
        </span>
      )}

      <IndustryImage src={p.image ?? industryBySlug(p.slug)?.images[0]} alt={p.name} Icon={ImageIcon} />

      <div className="flex min-w-0 flex-1 flex-col p-[22px]">
        <h4 className="text-[17.5px] font-bold tracking-tight text-[#111827]">{p.name}</h4>
        <p className="mt-2.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-[#5b6472]">{p.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#D11F2D]">
          View Solutions
          <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </Link>
  );
}

function CategoryBlock({ group }: { group: Group }) {
  const Icon = group.icon;
  return (
    <FadeIn>
      <div id={group.id}>
        <div className="mb-8 flex flex-wrap items-start gap-5">
          <div
            className="relative grid h-14 w-14 flex-none place-items-center overflow-hidden rounded-2xl"
            style={{ background: "linear-gradient(140deg,#0B2545,#1E5BA8)" }}
          >
            <span className="absolute inset-0" style={weave} aria-hidden="true" />
            <Icon className="relative h-6 w-6 text-white" strokeWidth={1.9} />
          </div>

          <div className="min-w-0 flex-1 basis-80">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#0B2545] sm:text-[28px]">{group.title}</h3>
            <div className="mt-3 flex items-center gap-2" aria-hidden="true">
              <i className="block h-[3px] w-11 rounded bg-[#D11F2D]" />
              <i className="block h-[3px] w-3 rounded bg-[#0B2545]" />
            </div>
            <p className="mt-3 max-w-[56ch] text-[14.5px] text-[#5b6472]">{group.blurb}</p>
          </div>

          <span className="ml-auto flex-none self-center rounded-full border border-[#E7E9EE] bg-white px-3.5 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#5b6472]">
            {group.items.length} Sectors
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {group.items.map((p) => (
            <IndustryCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Industries() {
  const t = useT();

  // Fallbacks used here in case the i18n file hasn't been updated yet.
  const pageTitle = t.industries?.hero?.heading || "Industry Solutions";
  const eyebrowText = t.industries?.hero?.eyebrow || "Sectors We Serve";
  const overviewTitle = t.industries?.overviewHeading || "Packaging by Industry";

  return (
    <>
      <Seo title={pageTitle} description={eyebrowText} path={PATHS.industries || '/industries'} />

      {/* Compact, centered hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#123a6b] to-[#1E5BA8] text-center text-white">
        <span className="absolute inset-0" style={weave} aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <div className="mx-auto h-[3px] w-[52px] rounded bg-[#D11F2D]" />
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.24em] text-[#ff5a63]">{eyebrowText}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white">{pageTitle}</h1>
          <nav aria-label="Breadcrumb" className="mt-5 flex items-center justify-center gap-2 text-sm text-[#9fb1d0]">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span className="font-medium text-white">{t.nav?.industries || "Industry Solutions"}</span>
          </nav>
        </div>
      </section>

      {/* Intro + quick-jump chips */}
      <Section bg="white">
        <FadeIn>
          <SectionHeading eyebrow={eyebrowText} title={overviewTitle} />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="inline-flex items-center gap-2.5 rounded-full border border-[#E7E9EE] bg-white px-[18px] py-2.5 text-sm font-medium text-[#0B2545] transition hover:border-[#0B2545] hover:bg-[#0B2545] hover:text-white"
              >
                <span className="h-[7px] w-[7px] rounded-full bg-[#D11F2D]" />
                {g.title}
                <span className="text-[12.5px] text-[#5b6472]">{g.items.length}</span>
              </a>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* Category bands — alternate white / grey */}
      {GROUPS.map((g, i) => (
        <Section key={g.id} bg={i % 2 === 1 ? "surface" : "white"}>
          <CategoryBlock group={g} />
        </Section>
      ))}

      <CtaBand />
    </>
  );
}