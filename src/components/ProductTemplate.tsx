import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SquareCheckBig, ArrowRight } from "lucide-react";
import { useT } from "../i18n/text";
import { productBySlug, type Product } from "../data/catalog";
import { PATHS, industryPath, INDUSTRIES } from "../i18n/navigation";
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

export default function ProductTemplate() {
  const t = useT();
  const { slug = "" } = useParams();
  const product = productBySlug(slug);
  const [active, setActive] = useState(0); // gallery index
  const [tab, setTab] = useState(0); // active tab index

  if (!product) return <NotFound />;
  const text = t.catalog.products[product.slug];
  // Add-ons are finishing options with no product photography, so their pages
  // drop the gallery and read as a single centered column instead.
  const isAddOn = product.category === "add-ons";

  return (
    <>
      <Seo title={text.name} description={text.tagline} path={`/products/${product.slug}`} />
      <PageHero
        eyebrow={t.nav.products}
        title={text.name}
        sub={text.tagline}
        crumbs={[{ label: t.nav.products, to: PATHS.products }, { label: text.name }]}
      />

      {/* Upper: gallery + copy (add-ons drop the gallery for a centered column) */}
      <Section bg="white">
        {isAddOn ? (
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <h2 className="font-display text-2xl font-bold text-ink">{t.product.introduction}</h2>
              <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
              <p className="mt-4 text-lg leading-relaxed text-muted">{text.introduction}</p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12">
                <div>
                  <h3 className="font-display text-xl font-bold text-ink">{t.product.features}</h3>
                  <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
                  <ul className="mt-4 space-y-2.5">
                    {product.features.map((id) => (
                      <CheckRow key={id}>{text.features[id]}</CheckRow>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-ink">{t.product.benefits}</h3>
                  <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
                  <ul className="mt-4 space-y-2.5">
                    {product.benefits.map((id) => (
                      <CheckRow key={id}>{text.benefits[id]}</CheckRow>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Gallery */}
            <FadeIn>
              {/* `images` holds real paths under /public (see src/data/catalog.ts).
                  The files are pre-composed 4:3 on a white ground, so cover is
                  lossless here; an empty list falls back to the captioned plate. */}
              <ImagePlaceholder
                ratio="4/3"
                src={product.images[active]}
                alt={text.name}
                caption={t.common.photoCaption}
                className="w-full"
              />
              {product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      type="button"
                      onClick={() => setActive(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`overflow-hidden rounded-lg border-2 transition-colors ${
                        i === active ? "border-red" : "border-line hover:border-blue/40"
                      }`}
                    >
                      <ImagePlaceholder ratio="1/1" src={img} alt={`${text.name} ${i + 1}`} className="rounded-md border-0" />
                    </button>
                  ))}
                </div>
              )}
            </FadeIn>

            {/* Copy */}
            <FadeIn delay={0.1}>
              <h2 className="font-display text-2xl font-bold text-ink">{t.product.introduction}</h2>
              <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
              <p className="mt-4 leading-relaxed text-muted">{text.introduction}</p>

              <h3 className="mt-8 font-display text-xl font-bold text-ink">{t.product.features}</h3>
              <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
              <ul className="mt-4 space-y-2.5">
                {product.features.map((id) => (
                  <CheckRow key={id}>{text.features[id]}</CheckRow>
                ))}
              </ul>

              <h3 className="mt-8 font-display text-xl font-bold text-ink">{t.product.benefits}</h3>
              <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
              <ul className="mt-4 space-y-2.5">
                {product.benefits.map((id) => (
                  <CheckRow key={id}>{text.benefits[id]}</CheckRow>
                ))}
              </ul>
            </FadeIn>
          </div>
        )}
      </Section>

      {/* Tabs */}
      <Section bg="surface">
        <div role="tablist" aria-label={text.name} className="flex flex-wrap gap-1 border-b border-line">
          {product.tabs.map((tb, i) => {
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
            <TabContent product={product} text={text} index={tab} />
          </motion.div>
        </AnimatePresence>
      </Section>

      {/* Related industries */}
      {product.industrySlugs && product.industrySlugs.length > 0 && (
        <Section bg="white">
          <h2 className="font-display text-xl font-bold text-ink">{t.product.relatedIndustries}</h2>
          <span className="mt-2 block h-0.5 w-10 rounded bg-red" />
          <div className="mt-6 flex flex-wrap gap-3">
            {product.industrySlugs.map((isl) => {
              const ind = INDUSTRIES.find((x) => x.slug === isl);
              if (!ind) return null;
              return (
                <Link
                  key={isl}
                  to={industryPath(isl)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:border-blue hover:text-blue"
                >
                  {t.industries.items[ind.id].name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              );
            })}
          </div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}

function TabContent({
  product,
  text,
  index,
}: {
  product: Product;
  text: import("../data/catalog").ProductText;
  index: number;
}) {
  const tb = product.tabs[index];
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
            <span className="w-44 shrink-0 font-semibold text-ink">{tt.rows[row.id]}</span>
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
            <h3 className="font-display text-lg font-bold text-ink">{tt.blocks[b.id].heading}</h3>
            <span className="mt-2 block h-0.5 w-8 rounded bg-red" />
            <p className="mt-3 text-sm leading-relaxed text-muted">{tt.blocks[b.id].body}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
}
