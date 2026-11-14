import { useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Layers3,
  SlidersHorizontal,
  ShieldCheck,
  ArrowRight,
  ImageIcon,
} from "lucide-react";

import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import { Section, SectionHeading } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CtaBand } from "../../components/blocks";
import { WovenSackIcon } from "../../components/icons";
import { productBySlug } from "../../data/catalog";
import { PATHS } from "../../i18n/navigation";

/* -------------------------------------------------------------------------
 * INTEGRATION NOTES
 * - Brand colours are arbitrary Tailwind values so this runs as-is. Map to
 *   your theme tokens when convenient:
 *      #0B2545 -> navy   #1E5BA8 -> blue   #D11F2D -> red
 * - Each product has an optional `image`. Leave it undefined to show the
 *   gray-100 placeholder; set it (e.g. "/images/products/pp-woven-bags.jpg")
 *   and the photo fills the left half automatically. A broken/missing file
 *   falls back to the placeholder via onError — no empty boxes.
 * - Titles / descriptions are inline English; lift them into the `products`
 *   i18n namespace so the other six languages get keys.
 * - Detail routes are /products/:slug — keep each slug matching your catalog.
 * - This page uses its own compact centered hero instead of the shared
 *   PageHero, per the redesign. If you prefer, add an `align="center"` +
 *   `compact` variant to PageHero and use that instead.
 * ----------------------------------------------------------------------- */

type Product = { name: string; slug: string; desc: string; image?: string; featured?: boolean; href?: string };

/** Category marks are lucide icons plus the shared woven-sack mark, so the slot
 *  takes any component accepting lucide's className/strokeWidth contract. */
type CategoryIcon = ComponentType<{ className?: string; strokeWidth?: number }>;
type Group = {
  id: string;
  title: string;
  blurb: string;
  icon: CategoryIcon;
  items: Product[];
  /** Render this group's cards without the photo slot (finishing options have no product shots). */
  textOnly?: boolean;
};


const GROUPS: Group[] = [
  {
    id: "woven",
    title: "Woven Bags (PP/BOPP)",
    blurb:
      "The core of our heavy-duty range. Our polypropylene and BOPP sacks are engineered for uncompromising tensile strength, bulk commodity protection, and vivid, high-definition retail printing. Built to handle everything from agricultural staples to premium consumer goods.",
    icon: WovenSackIcon,
    items: [
      { name: "PP Woven Bags", slug: "pp-woven-bags", desc: "Durable sacks woven from polypropylene tape for bulk goods." },
      { name: "Coated / Uncoated Fabrics", slug: "coated-uncoated-fabrics", desc: "Woven PP/BOPP fabric rolls, supplied with or without lamination." },
      { name: "BOPP EZ-Open Bags", slug: "bopp-ez-open-bags", desc: "Easy-tear opening for fast, clean dispensing." },
      { name: "BOPP Pinch Bottom Bags", slug: "bopp-pinch-bottom-bags", desc: "Folded, glued base for a flat, stackable pack." },
      { name: "PLWPP Block Bottom Bags", slug: "plwpp-block-bottom-bags", desc: "Square base that stands and stacks like a carton." },
      { name: "PLWPP Carry Bags", slug: "plwpp-carry-bags", desc: "Reusable woven carry bags with printed branding." },
    ],
  },
  {
    id: "flexible",
    title: "Flexible Packaging",
    blurb:
      "Advanced multilayer laminates, rollstock, and pouches engineered for uncompromising barrier protection. Designed to lock in freshness, block moisture and oxygen, and extend the shelf life of food, liquids, and premium retail goods while maximizing shelf appeal.",
    icon: Layers3, // bonded film layers of a laminate
    items: [
      { name: "Multilayer Rolls", slug: "multilayer-rolls", desc: "Printed laminate rollstock for form-fill-seal lines." },
      { name: "Multilayer Pouches", slug: "multilayer-pouches", desc: "Barrier pouches built from bonded film layers." },
      { name: "Liquid Packaging Pouches", slug: "liquid-packaging-pouches", desc: "Leak-resistant pouches for liquids and pastes." },
      { name: "Spout Pouches", slug: "spout-pouches", desc: "Resealable spout for pourable, on-the-go products." },
      { name: "Side-Seal Pouches", slug: "side-seal-pouches", desc: "Three-side-seal pouch for lightweight fills." },
      { name: "4-Side-Seal Pouches", slug: "4-side-seal-pouches", desc: "Flat sachet sealed on all four edges." },
      { name: "D-Cut Pouches", slug: "d-cut-pouches", desc: "Built-in die-cut handle for easy carrying." },
      { name: "Stand-Up Pouches", slug: "stand-up-pouches", desc: "Gusseted base that stands upright on shelf." },
      { name: "Zipper Pouches", slug: "zipper-pouches", desc: "Press-to-close zip for repeated reclosing." },
      { name: "Up to 4-Layer", slug: "up-to-4-layer", desc: "Laminates engineered up to four bonded layers." },
    ],
  },
  {
    id: "addons",
    title: "Add-ons & Customisations",
    blurb:
      "Precision finishing options designed to adapt our base packaging formats to your exact operational needs. From micro-perforations for venting to custom inner liners and secure zipper closures, we tailor every bag to your filling line and end-user requirements.",
    icon: SlidersHorizontal,
    textOnly: true,
    items: [
      { name: "Perforation", slug: "perforation", desc: "Micro or tear perforations for venting or easy opening." },
      { name: "Liner", slug: "liner", desc: "Inner liner for moisture and product protection." },
      { name: "Window View", slug: "window-view", desc: "Clear panel to show the product inside." },
      { name: "Holography", slug: "holography", desc: "Holographic finishes for shelf appeal and security." },
      { name: "Gusset", slug: "gusset", desc: "Side or bottom gussets for added capacity." },
      { name: "Pallet Packaging", slug: "pallet-packaging", desc: "Heavy-duty formats built for palletised loads." },
      { name: "Backseam", slug: "backseam", desc: "Centre back seam for a clean tubular pack." },
      { name: "Zipper Closures", slug: "zipper-closures", desc: "Reclosable zip tracks — a key selling point for food & retail packs.", featured: true },
      { name: "D-Cut Handles", slug: "d-cut-handles", desc: "Reinforced die-cut handles for carry formats." },
    ],
  },
  {
    // These four now live on /packaging-security; `href` sends each card to
    // its anchor there instead of a retired /products/:slug page.
    id: "security",
    title: "Packaging Security",
    blurb:
      "Integrated anti-counterfeit and traceability technologies built directly into the packaging architecture. Utilizing holographic stamping, barcodes, and QR codes, we protect your brand equity and ensure absolute product authenticity from our factory to the retail shelf.",
    icon: ShieldCheck,
    items: [
      { name: "Holographic Hot Stamping", slug: "holographic", image: "/holographic-security.jpg", href: `${PATHS.packagingSecurity}#holographic`, desc: "Tamper-evident foil seals verified by eye." },
      { name: "Barcode", slug: "barcode", image: "/barcode-integration.jpg", href: `${PATHS.packagingSecurity}#barcode`, desc: "GS1 coding printed inline for retail and logistics." },
      { name: "QR Code", slug: "qr-code", image: "/qrcode-packaging.jpg", href: `${PATHS.packagingSecurity}#qr-code`, desc: "Consumer-scannable authentication and traceability." },
    ],
  },
];

const productPath = (slug: string) => `${PATHS.products}/${slug}`;

// Woven-weave signature motif (cross-hatch) for navy surfaces.
const weave: CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 15px)," +
    "repeating-linear-gradient(-45deg, rgba(255,255,255,.06) 0 1px, transparent 1px 15px)",
};

function ProductImage({ src, alt, Icon }: { src?: string; alt: string; Icon: LucideIcon }) {
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
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em]">Product photo</span>
        </div>
      )}
    </div>
  );
}

function ProductCard({ p, textOnly }: { p: Product; textOnly?: boolean }) {
  if (textOnly) {
    return (
      <Link
        to={p.href ?? productPath(p.slug)}
        className="group relative flex flex-col rounded-2xl border border-[#E7E9EE] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#D11F2D]/30 hover:shadow-[0_22px_46px_-24px_rgba(11,37,69,0.5)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#D11F2D]/60 motion-reduce:transition-none"
      >
        <span className="h-[3px] w-9 rounded bg-[#D11F2D] transition-all duration-200 group-hover:w-14" aria-hidden="true" />
        <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <h4 className="text-[17.5px] font-bold tracking-tight text-[#111827]">{p.name}</h4>
          {p.featured && (
            <span className="rounded-full bg-[#D11F2D] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Featured
            </span>
          )}
        </div>
        <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[#5b6472]">{p.desc}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#D11F2D]">
          Learn More
          <ArrowRight className="h-[15px] w-[15px] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={p.href ?? productPath(p.slug)}
      className="group relative flex overflow-hidden rounded-2xl border border-[#E7E9EE] bg-white transition duration-200 hover:-translate-y-1 hover:border-[#D11F2D]/30 hover:shadow-[0_22px_46px_-24px_rgba(11,37,69,0.5)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#D11F2D]/60 motion-reduce:transition-none max-[440px]:flex-col"
    >
      {p.featured && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#D11F2D] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Featured
        </span>
      )}

      <ProductImage src={p.image ?? productBySlug(p.slug)?.images[0]} alt={p.name} Icon={ImageIcon} />

      <div className="flex min-w-0 flex-1 flex-col p-[22px]">
        <h4 className="text-[17.5px] font-bold tracking-tight text-[#111827]">{p.name}</h4>
        <p className="mt-2.5 line-clamp-3 flex-1 text-[13.5px] leading-relaxed text-[#5b6472]">{p.desc}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wider text-[#D11F2D]">
          Learn More
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
        <div className="mb-10 flex flex-wrap items-start gap-x-5 gap-y-4">
          {/* Icon sits on a barely-there tile rather than a solid navy block —
              the mark carries the meaning, the background just anchors it. */}
          <div className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-[#1E5BA8]/[0.07] ring-1 ring-inset ring-[#1E5BA8]/20">
            <Icon className="h-7 w-7 text-[#1E5BA8]" strokeWidth={1.6} />
          </div>

          <div className="min-w-0 flex-1 basis-80">
            <h3 className="text-2xl font-extrabold tracking-tight text-[#0B2545] sm:text-[28px]">{group.title}</h3>
            <div className="mt-3 flex items-center gap-2" aria-hidden="true">
              <i className="block h-[3px] w-11 rounded bg-[#D11F2D]" />
              <i className="block h-[3px] w-3 rounded bg-[#0B2545]" />
            </div>
            <p className="mt-4 max-w-[68ch] text-[15px] leading-[1.75] text-[#5b6472]">{group.blurb}</p>
          </div>

          <span className="ml-auto flex-none self-start rounded-full border border-[#E7E9EE] bg-white px-3.5 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#5b6472]">
            {group.items.length} products
          </span>
        </div>

        <div
          className={
            group.textOnly
              ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
              : "grid grid-cols-1 gap-5 md:grid-cols-2"
          }
        >
          {group.items.map((p) => (
            <ProductCard key={p.slug} p={p} textOnly={group.textOnly} />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

export default function Products() {
  const t = useT();

  return (
    <>
      <Seo title={t.products.hero.heading} description={t.products.hero.sub} path={PATHS.products} />

      {/* Compact, centered hero — no body paragraph */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B2545] via-[#123a6b] to-[#1E5BA8] text-center text-white">
        <span className="absolute inset-0" style={weave} aria-hidden="true" />
        <div className="relative mx-auto max-w-3xl px-6 py-16 sm:py-20">
          <div className="mx-auto h-[3px] w-[52px] rounded bg-[#D11F2D]" />
          <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.24em] text-[#ff5a63]">{t.products.hero.eyebrow}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl text-white">{t.products.hero.heading}</h1>
          <nav aria-label="Breadcrumb" className="mt-5 flex items-center justify-center gap-2 text-sm text-[#9fb1d0]">
            <Link to="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden="true">&rsaquo;</span>
            <span className="font-medium text-white">{t.nav.products}</span>
          </nav>
        </div>
      </section>

      {/* Intro + quick-jump chips */}
      <Section bg="white">
        <FadeIn>
          <SectionHeading eyebrow={t.products.hero.eyebrow} title={t.products.overviewHeading} />
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

      {/* Category bands — alternate white / grey (match `bg` to your Section values) */}
      {GROUPS.map((g, i) => (
        <Section key={g.id} bg={i % 2 === 1 ? "surface" : "white"}>
          <CategoryBlock group={g} />
        </Section>
      ))}

      <CtaBand />
    </>
  );
}
