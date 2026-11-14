import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SquareCheckBig, ArrowRight } from "lucide-react";
import { useT } from "../i18n/text";
import { industryBySlug, type Industry } from "../data/catalog";
import type { IndustryText } from "../data/catalog";
import { PATHS, INDUSTRIES, PRODUCT_CATEGORIES } from "../i18n/navigation";
import { Seo } from "./Seo";
import PageHero from "./PageHero";
import { Section, ImagePlaceholder } from "./ui";
import { CtaBand } from "./blocks";
import { FadeIn } from "./Motion";
import NotFound from "../pages/NotFound";

/** Red ☑ checklist row. */
function CheckRow({ children }: { children: string }) {
  return (
    <li className="flex gap-2.5 text-[0.95rem] text-ink/80">
      <SquareCheckBig className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={2.2} />
      {children}
    </li>
  );
}

export default function IndustryTemplate() {
  const t = useT();
  const { slug = "" } = useParams();
  const industry = industryBySlug(slug);
  const entry = INDUSTRIES.find((i) => i.slug === slug);
  const [active, setActive] = useState(0); // gallery index
  const [tab, setTab] = useState(0); // active tab index

  if (!industry || !entry) return <NotFound />;

  const text = t.catalog.industries[industry.id];
  const item = t.industries.items[entry.id];
  const Icon = entry.icon; // sector icon, shown in the photo placeholder

  const hasThumbs = industry.images.length > 1;
  const hasFeatures = industry.features.length > 0;
  const hasBenefits = industry.benefits.length > 0;
  const hasTabs = industry.tabs.length > 0;

  return (
    <>
      <Seo title={text?.name ?? item.name} description={text?.tagline ?? item.lead} path={`${PATHS.industries}/${industry.slug}`} />
      <PageHero
        eyebrow={t.nav.industries}
        title={text?.name ?? item.name}
        sub={text?.tagline ?? item.lead}
        crumbs={[{ label: t.nav.industries, to: PATHS.industries }, { label: text?.name ?? item.name }]}
      />

      {/* Upper: featured photo + copy */}
      <Section bg="white">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* Featured photo — sticky on desktop.
              To add a real photo: put a file in /public and set the industry's
              `images` in src/data/catalog.ts, e.g.
                images: ["/assets/images/industries/chemicals-industrial.jpg"]
              images[0] is the featured photo; any extras become thumbnails. */}
          <FadeIn className="lg:sticky lg:top-28 self-start">
            <ImagePlaceholder
              ratio="4/3"
              src={industry.images[active]}
              alt={text?.name ?? item.name}
              icon={Icon}
              caption={t.common.photoCaption}
              className="w-full"
            />
            {hasThumbs && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {industry.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`overflow-hidden rounded-lg border-2 transition-colors ${
                      i === active ? "border-red" : "border-line hover:border-blue/40"
                    }`}
                  >
                    <ImagePlaceholder ratio="1/1" src={img} alt={`${text?.name ?? item.name} ${i + 1}`} icon={Icon} className="rounded-md border-0" />
                  </button>
                ))}
              </div>
            )}
          </FadeIn>

          {/* Copy */}
          <FadeIn delay={0.1}>
            <h2 className="font-display text-2xl font-bold text-ink">{t.industry.introduction}</h2>
            <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
            <p className="mt-4 leading-relaxed text-muted">{text?.introduction ?? item.body}</p>

            {/* Applications list (existing industry data) */}
            {"applications" in item && Array.isArray(item.applications) && item.applications.length > 0 && (
              <>
                <h3 className="mt-8 font-display text-xl font-bold text-ink">{t.industries.appliesHeading}</h3>
                <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
                <ul className="mt-4 space-y-2.5">
                  {item.applications.map((a: string) => (
                    <CheckRow key={a}>{a}</CheckRow>
                  ))}
                </ul>
              </>
            )}

            {/* Features list (new CMS-driven data) */}
            {hasFeatures && (
              <>
                <h3 className="mt-8 font-display text-xl font-bold text-ink">{t.industry.features}</h3>
                <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
                <ul className="mt-4 space-y-2.5">
                  {industry.features.map((id) => (
                    <CheckRow key={id}>{text.features[id]}</CheckRow>
                  ))}
                </ul>
              </>
            )}

            {/* Benefits list (new CMS-driven data) */}
            {hasBenefits && (
              <>
                <h3 className="mt-8 font-display text-xl font-bold text-ink">{t.industry.benefits}</h3>
                <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
                <ul className="mt-4 space-y-2.5">
                  {industry.benefits.map((id) => (
                    <CheckRow key={id}>{text.benefits[id]}</CheckRow>
                  ))}
                </ul>
              </>
            )}
          </FadeIn>
        </div>
      </Section>

      {/* Tabs (when CMS data is populated) */}
      {hasTabs && (
        <Section bg="surface">
          <div role="tablist" aria-label={text?.name ?? item.name} className="flex flex-wrap gap-1 border-b border-line">
            {industry.tabs.map((tb, i) => {
              const label = (text.tabs[tb.id] as { label: string }).label;
              const selected = i === tab;
              return (
                <button
                  key={tb.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(i)}
                  className={`-mb-px border-b-2 px-5 py-3 text-sm font-bold transition-colors ${
                    selected ? "border-red text-red" : "border-transparent text-ink/55 hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="pt-8"
            >
              <IndustryTabContent industry={industry} text={text} index={tab} />
            </motion.div>
          </AnimatePresence>
        </Section>
      )}

      {/* Related product categories */}
      <Section bg={hasTabs ? "white" : "surface"}>
        <h2 className="font-display text-xl font-bold text-ink">{t.industry.relatedProducts}</h2>
        <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
        <div className="mt-6 flex flex-wrap gap-3">
          {PRODUCT_CATEGORIES.map(({ id, to }) => (
            <Link
              key={id}
              to={to}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:border-blue hover:text-blue"
            >
              {t.products.categories[id].name}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

function IndustryTabContent({
  industry,
  text,
  index,
}: {
  industry: Industry;
  text: IndustryText;
  index: number;
}) {
  const tb = industry.tabs[index];
  const tt = text.tabs[tb.id];

  if (tb.kind === "spectable" && "rows" in tt) {
    return (
      <ul className="mx-auto max-w-3xl">
        {tb.rows.map((row) => (
          <li
            key={row.id}
            className="flex items-baseline gap-4 border-b border-dashed border-line py-3.5 text-sm"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
            <span className="w-44 shrink-0 font-semibold text-ink">{(tt as { rows: Record<string, string> }).rows[row.id]}</span>
            <span className="text-muted">{row.value}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (tb.kind === "richtext" && "blocks" in tt) {
    return (
      <div className="grid gap-8 sm:grid-cols-2">
        {tb.blocks.map((b) => (
          <div key={b.id}>
            <h3 className="font-display text-lg font-bold text-ink">{(tt as { blocks: Record<string, { heading: string; body: string }> }).blocks[b.id].heading}</h3>
            <span className="mt-2 block h-0.5 w-8 rounded bg-red" />
            <p className="mt-3 text-sm leading-relaxed text-muted">{(tt as { blocks: Record<string, { heading: string; body: string }> }).blocks[b.id].body}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
