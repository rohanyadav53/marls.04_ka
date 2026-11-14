import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Barcode,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section } from "../components/ui";
import { FadeIn } from "../components/Motion";
import { useLeadPopup } from "../components/LeadPopup";
import { PATHS } from "../i18n/navigation";

/* ─────────────────────────────────────────────────────────────
 * Packaging Security Solutions
 *
 * Three technologies, each rendered from the same shape so the layout
 * alternates (text/image → image/text) without duplicating markup.
 *
 * Copy is authored here in English rather than in the dictionary: it is
 * long-form SEO content that a translator would rewrite per market, not
 * translate string by string. Nav labels still come from `t.nav`.
 *
 * Images live at the project root of `public/` under the exact filenames
 * requested, so a photo can be swapped by overwriting the file.
 * ───────────────────────────────────────────────────────────── */

/** Flip to `false` before launch to hide the per-section SEO reference panels.
 *  They are collapsed <details> blocks written for the content team — useful
 *  while copy is being signed off, not something a buyer needs to see. */
const SHOW_SEO_REFERENCE = true;

type Benefit = { head: string; detail: string };
type Technology = {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  image: string;
  alt: string;
  caption: string;
  intro: [string, string];
  whyChoose: string[];
  benefits: Benefit[];
  industries: string;
  industryTags: string[];
  metaDescription: string;
  keywords: string;
};

const TECHNOLOGIES: Technology[] = [
  /* ── 1 ───────────────────────────────────────────────── */
  {
    // `id` doubles as the anchor target used by the mega menu and the
    // technology cards, so these must stay in step with PRODUCT_MENU.
    id: "holographic",
    name: "Holographic Hot Stamping",
    tagline: "A one-second authenticity check that needs no device",
    icon: Sparkles,
    image: "/holographic-security.jpg",
    alt: "Holographic Hot Stamping",
    caption: "Holographic foil seal, hot-stamped and registered to the printed artwork.",
    intro: [
      "Hot stamping presses a metallised or holographic foil onto the pack under heat and pressure, bonding a light-diffracting layer straight into the printed surface. There is no ink, no solvent and no drying step — the foil either takes cleanly or it does not, which is exactly what makes it dependable as a tamper evident marker on a running line. On PP woven bags and BOPP bags we register the stamp to the printed artwork, so the hologram lands where the eye already expects it: across a logo, a batch panel, or the closure seal.",
      "The commercial case is simple. A holographic seal cannot be photocopied, screen-grabbed or run off on a desktop press, so distributors, retail staff and end customers get an authenticity check that needs no app and no training. Peel it and the damage stays visible. Of every layer in a packaging security programme, holographic security is the least technical to deploy and the most immediately persuasive — which is why brand owners under counterfeit pressure usually start here.",
    ],
    whyChoose: [
      "Authenticity confirmed by eye in about a second — no scanner, app or staff training.",
      "Cannot be reproduced by photocopier, flatbed scanner or desktop printing.",
      "Tamper evident by design: lifting or peeling the seal leaves permanent damage.",
      "Solvent-free and dry on contact, so it keeps pace with high-speed production.",
      "Doubles as a premium finish that lifts shelf presence and perceived product value.",
    ],
    benefits: [
      {
        head: "Brand Authentication",
        detail:
          "Adds a unique, non-reproducible identification feature so genuine stock stays distinguishable from duplicates at every point in the chain.",
      },
      {
        head: "Tamper Evidence",
        detail:
          "Once applied, the foil will not come away intact. Any attempt to open, refill or re-seal the pack shows as lifted or fractured metal.",
      },
      {
        head: "Custom Security Artwork",
        detail:
          "Dedicated dies carry nano-text, guilloche line work, concealed marks and registration-specific effects that a copier has no way of resolving.",
      },
      {
        head: "Substrate Versatility",
        detail:
          "Runs on woven polypropylene, BOPP laminated fabric, paper-laminate and pouch films without a change of process or a second pass.",
      },
      {
        head: "Durability in Transit",
        detail:
          "Resists abrasion, humidity and UV, so the seal still reads as original after warehousing, long-haul freight and outdoor storage.",
      },
      {
        head: "Premium Shelf Impact",
        detail:
          "The metallic finish signals quality before a word is read — valuable on retail packaging where a security feature also has to sell.",
      },
    ],
    industries:
      "Holographic hot stamping is in most demand where a premium price invites imitation: branded food packaging and retail packaging, seeds and agricultural inputs, agrochemicals and fertilizers, lubricants, pet food, and pharmaceutical secondary packaging. Exporters use it as a shipment-level authenticity mark that customs officers and overseas distributors can verify without equipment.",
    industryTags: [
      "Food Packaging",
      "Retail Packaging",
      "Seeds & Agriculture",
      "Fertilizers",
      "Agrochemicals",
      "Pet Food",
      "Pharmaceuticals",
      "Lubricants",
      "Exports",
    ],
    metaDescription:
      "Holographic hot stamping for anti counterfeit packaging — tamper evident foil seals on PP woven bags, BOPP bags and pouches from Marlsboro Packaging.",
    keywords:
      "holographic security, hot stamping packaging, anti counterfeit packaging, tamper evident packaging, holographic foil seal, brand protection, security hologram, packaging authentication, foil stamping BOPP bags, PP woven bags security, hologram manufacturer, secure packaging, product authentication, premium packaging, flexible packaging manufacturer, packaging security solutions, metallised foil stamping, counterfeit prevention, unique product identification, packaging innovation",
  },

  /* ── 2 ───────────────────────────────────────────────── */
  {
    id: "barcode",
    name: "Barcode",
    tagline: "The lowest-cost traceability that every scanner already reads",
    icon: Barcode,
    image: "/barcode-integration.jpg",
    alt: "Barcode Packaging Integration",
    caption: "EAN-13 printed inline on woven polypropylene, verified before release.",
    intro: [
      "A barcode encodes data as parallel bars of varying width — EAN-13 for retail, Code 128 and ITF-14 for cases and cartons — that any handheld or fixed scanner reads in a fraction of a second. We print it inline during the flexographic or rotogravure pass rather than applying it afterwards, which holds the symbol in exact position on every bag and removes a labelling stage from the line. Variable-data printing lets each production lot carry its own code, so batch, shift and line details are captured at source.",
      "Barcode printing on woven polypropylene asks more of the process than paper does. Fabric texture breaks up bar edges, so we control ink lay-down, bar-width reduction and quiet-zone clearance, then verify print quality against ISO/IEC 15416 grading before a run is released. The result is a first-read rate that holds up in a working warehouse, not only under a bench light. For most buyers this is still the most cost-effective route to product traceability: proven, universally accepted, and free of any reader investment.",
    ],
    whyChoose: [
      "Read by every retail and logistics scanner in use worldwide — GS1 compliant.",
      "The lowest cost per pack of any identification method, printed with the artwork.",
      "Carries lot, batch and production data through variable-data printing.",
      "Applied inline, so there is no separate labelling step to slow the line.",
      "Graded to ISO/IEC 15416 before dispatch, so scan failures never reach your depot.",
    ],
    benefits: [
      {
        head: "Universal Compatibility",
        detail:
          "GS1-standard symbologies read on existing equipment, so nothing in your warehouse — or your customer's — has to change.",
      },
      {
        head: "Cost Efficiency at Scale",
        detail:
          "Because the code prints with the design, high-volume runs carry full traceability at effectively no added unit cost.",
      },
      {
        head: "Batch and Lot Traceability",
        detail:
          "Each code ties a pack back to its production record, narrowing a recall to a single shift rather than a month of output.",
      },
      {
        head: "Faster Throughput",
        detail:
          "Scanning replaces manual reconciliation at picking, dispatch and point of sale, cutting handling time and keying errors together.",
      },
      {
        head: "Print Quality Assurance",
        detail:
          "Graded verification on the actual woven or laminated substrate confirms contrast, decodability and edge definition before release.",
      },
      {
        head: "Damage and Substitution Tracking",
        detail:
          "A damaged or swapped pack is identified against its production lot, which makes irregularities visible during an investigation.",
      },
    ],
    industries:
      "Barcodes underpin day-to-day handling across retail packaging and FMCG, food packaging, agricultural packaging, cement and building materials, industrial and chemical packaging, and any export operation reconciling cartons against a packing list.",
    industryTags: [
      "FMCG",
      "Food Packaging",
      "Retail Packaging",
      "Agriculture",
      "Building Materials",
      "Chemicals",
      "Industrial Products",
      "Exports",
    ],
    metaDescription:
      "Barcode printing on PP woven bags and flexible packaging — GS1 compliant, printed inline and ISO verified for dependable product traceability.",
    keywords:
      "barcode printing, barcode packaging, GS1 barcode, EAN 13 printing, Code 128 packaging, ITF 14 carton code, product traceability, packaging identification, inventory management, product tracking, barcode PP woven bags, flexible packaging barcode, variable data printing, packaging security solutions, supply chain visibility, industrial packaging, packaging manufacturer, batch coding, barcode verification, packaging technology",
  },

  /* ── 3 ───────────────────────────────────────────────── */
  {
    id: "qr-code",
    name: "QR Code",
    tagline: "Authentication your customer can run themselves",
    icon: QrCode,
    image: "/qrcode-packaging.jpg",
    alt: "QR Code Packaging Integration",
    caption: "Serialised QR printed on woven fabric; error correction absorbs the weave.",
    intro: [
      "A QR code is a two-dimensional matrix holding up to roughly 4,000 alphanumeric characters — a URL, a batch record, an authentication key, or all three — in the footprint of a small square. It carries Reed-Solomon error correction, which matters a great deal on woven fabric: the weave distorts individual modules as it prints, and error correction is what keeps the symbol readable regardless. Every modern phone camera is a reader, so the audience is not only your warehouse but your customer.",
      "That changes what the code is for. Print a serialised QR and each pack becomes its own authentication point: a scan returns a genuine-or-not answer, with the batch, plant and certification behind it. Because the destination is dynamic, marketing can change what a scan shows — usage instructions, a crop advisory, a promotion — without reprinting a single bag. Used well, QR code packaging closes the gap between product authentication and consumer engagement, and gives brand owners scan-level data on where packaging is actually being opened.",
    ],
    whyChoose: [
      "Scanned by any smartphone — no dedicated reader anywhere in the chain.",
      "Holds thousands of characters in a footprint a linear barcode could not use.",
      "Error correction keeps codes readable through the distortion of woven substrates.",
      "Destination content can be updated after printing, without new packaging.",
      "Serialised codes turn each individual pack into a verifiable authentication point.",
    ],
    benefits: [
      {
        head: "Consumer-Level Authentication",
        detail:
          "End customers verify a pack themselves in one scan, extending brand protection past the distributor and into the open market.",
      },
      {
        head: "High Data Capacity",
        detail:
          "Batch number, plant of origin, manufacturing date, test certificates and a web link all fit inside a single symbol.",
      },
      {
        head: "Resilient on Textured Substrates",
        detail:
          "Built-in error correction tolerates the module distortion that woven PP and laminated fabric introduce during printing.",
      },
      {
        head: "Dynamic Content Control",
        detail:
          "A managed short link lets you change the landing experience by season or by region while the printed code stays exactly the same.",
      },
      {
        head: "Digital Traceability",
        detail:
          "Scans logged against serial numbers show how stock moved and where it surfaced, supporting recalls and diversion investigations.",
      },
      {
        head: "Engagement and Analytics",
        detail:
          "Scan location, time and volume become first-party data — a measurable line running from packaging back to demand.",
      },
    ],
    industries:
      "QR codes are strongest wherever the buyer wants to reach the end user: food packaging and pet food, seeds and crop protection where usage guidance matters, fertilizers, pharmaceuticals, specialty chemicals carrying safety documentation, and retail packaging built around a campaign.",
    industryTags: [
      "Food Packaging",
      "Pet Food",
      "Seeds & Crop Protection",
      "Fertilizers",
      "Pharmaceuticals",
      "Chemicals",
      "Retail Packaging",
      "Exports",
    ],
    metaDescription:
      "QR code packaging for product authentication and digital traceability — serialised codes printed on PP woven bags, BOPP bags and flexible pouches.",
    keywords:
      "QR code packaging, QR code printing, product authentication, smart packaging, digital traceability, anti counterfeit packaging, serialised QR code, brand protection, consumer engagement packaging, QR code woven bags, packaging authentication, unique product identification, flexible packaging, packaging security, supply chain visibility, product tracking, dynamic QR code, batch traceability, packaging innovation, packaging manufacturer",
  },
];

/** Buyer-facing comparison — the question we get asked most often. */
const COMPARISON = [
  {
    tech: "Holographic Hot Stamping",
    verifiedBy: "The human eye",
    device: "None",
    data: "Visual authenticity only",
    bestFor: "Instant proof of origin at the point of sale",
  },
  {
    tech: "Barcode",
    verifiedBy: "Any 1D scanner",
    device: "Standard scanner",
    data: "Product, lot and batch",
    bestFor: "Retail throughput and low-cost traceability",
  },
  {
    tech: "QR Code",
    verifiedBy: "Any smartphone",
    device: "Phone camera",
    data: "Up to ~4,000 characters",
    bestFor: "Consumer authentication and engagement",
  },
];

function SeoReference({ tech }: { tech: Technology }) {
  if (!SHOW_SEO_REFERENCE) return null;
  return (
    <details className="mt-10 rounded-xl border border-line bg-surface/70 px-5 py-4 text-sm">
      <summary className="cursor-pointer font-mono text-xs font-semibold uppercase tracking-wider text-muted">
        SEO reference — {tech.name}
      </summary>
      <div className="mt-4 space-y-4">
        <div>
          <p className="font-semibold text-ink">SEO Meta Description</p>
          <p className="mt-1 leading-relaxed text-muted">{tech.metaDescription}</p>
        </div>
        <div>
          <p className="font-semibold text-ink">SEO Keywords</p>
          <p className="mt-1 leading-relaxed text-muted">{tech.keywords}</p>
        </div>
      </div>
    </details>
  );
}

export default function PackagingSecurity() {
  const t = useT();
  const { openQuote } = useLeadPopup();

  return (
    <>
      <Seo
        title="Packaging Security Solutions"
        description="Anti counterfeit packaging from Marlsboro Packaging — holographic hot stamping, barcode printing and QR codes built into PP woven bags, BOPP bags and flexible packaging."
        path={PATHS.packagingSecurity}
      />

      <PageHero
        eyebrow="Packaging Security"
        title="Packaging Security Solutions"
        sub="Authentication, tamper evidence and traceability engineered into the pack — not stuck on afterwards."
        crumbs={[{ label: t.nav.packagingSecurity }]}
      />

      {/* ── Overview ── */}
      <Section bg="white">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <FadeIn>
            <p className="eyebrow flex items-center gap-2.5 text-red">
              <span className="h-px w-7 bg-current" />
              Why it matters
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.5rem]">
              Security belongs in the specification, beside GSM and seal strength
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted">
              <p>
                Counterfeiting is not a problem confined to luxury goods. Refilled fertilizer bags,
                substituted seed lots and copied pet food packaging cost brand owners revenue and —
                more damagingly — the trust of buyers who cannot tell the difference on the shelf. For
                an industrial packaging manufacturer, that makes secure packaging a line item on the
                spec sheet rather than a marketing extra.
              </p>
              <p>
                Marlsboro Packaging builds three security technologies into PP woven bags, BOPP bags,
                multilayer pouches, stand-up pouches, zipper pouches and liquid packaging pouches. Each
                answers a different question — is this pack genuine, which lot is it from, and what can
                the customer confirm without help. Most programmes end up combining two or three.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* quick nav */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNOLOGIES.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <FadeIn key={tech.id} delay={i * 0.07}>
                <a
                  href={`#${tech.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-1 hover:border-red/30 hover:bg-white hover:shadow-lg motion-reduce:hover:translate-y-0"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-red ring-1 ring-line transition-colors group-hover:bg-red group-hover:text-white group-hover:ring-red">
                    <Icon className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-5 font-display text-base font-bold leading-snug text-ink">
                    {tech.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{tech.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-red">
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </a>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* ── The four technologies ── */}
      {TECHNOLOGIES.map((tech, index) => {
        const Icon = tech.icon;
        const imageFirst = index % 2 === 1; // alternate: text/image, image/text, …
        return (
          <Section key={tech.id} id={tech.id} bg={index % 2 === 0 ? "surface" : "white"}>
            {/* section head */}
            <FadeIn>
              <div className="flex items-start gap-4">
                <span className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-grad-cta text-white shadow-lg shadow-red/25">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="eyebrow text-red">Technology {String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-3xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.4rem]">
                    {tech.name}
                  </h2>
                  <p className="mt-3 text-lg text-muted">{tech.tagline}</p>
                </div>
              </div>
            </FadeIn>

            {/* intro + photo */}
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <FadeIn className={imageFirst ? "lg:order-last" : undefined}>
                <h3 className="font-display text-lg font-bold text-ink">Introduction</h3>
                <div className="mt-4 space-y-4 leading-relaxed text-muted">
                  <p>{tech.intro[0]}</p>
                  <p>{tech.intro[1]}</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} className={imageFirst ? "lg:order-first" : undefined}>
                <figure>
                  <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-xl shadow-ink/5">
                    <img
                      src={tech.image}
                      alt={tech.alt}
                      loading="lazy"
                      className="aspect-[3/2] w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted">{tech.caption}</figcaption>
                </figure>
              </FadeIn>
            </div>

            {/* why choose + key benefits */}
            <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
              <FadeIn>
                <h3 className="font-display text-lg font-bold text-ink">
                  Why Choose This Technology?
                </h3>
                <ul className="mt-5 space-y-3.5">
                  {tech.whyChoose.map((point) => (
                    <li key={point} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={1.9} />
                      <span className="text-[0.95rem] leading-relaxed text-muted">{point}</span>
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h3 className="font-display text-lg font-bold text-ink">Key Benefits</h3>
                <ul className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {tech.benefits.map((b) => (
                    <li key={b.head}>
                      <p className="text-[0.95rem] leading-relaxed text-muted">
                        <strong className="font-bold text-ink">{b.head}:</strong> {b.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {/* industries */}
            <FadeIn>
              <div className="mt-12 rounded-2xl border border-line bg-white p-7 sm:p-8">
                <h3 className="font-display text-lg font-bold text-ink">
                  Industries Using This Technology
                </h3>
                <p className="mt-4 leading-relaxed text-muted">{tech.industries}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tech.industryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeIn>

            <SeoReference tech={tech} />
          </Section>
        );
      })}

      {/* ── Choosing a combination ── */}
      <Section bg="white">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center text-red">Layered protection</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.12] tracking-tight text-ink sm:text-[2.5rem]">
              Which combination is right for your pack?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              No single feature covers every risk. A hologram convinces a buyer; a barcode convinces
              an auditor; a QR code convinces the end consumer. Here is how they compare.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  {["Technology", "Verified by", "Device needed", "Data carried", "Best for"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-5 py-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.tech} className="border-b border-line/70 last:border-0">
                    <th scope="row" className="px-5 py-4 font-display font-bold text-ink">
                      {row.tech}
                    </th>
                    <td className="px-5 py-4 text-muted">{row.verifiedBy}</td>
                    <td className="px-5 py-4 text-muted">{row.device}</td>
                    <td className="px-5 py-4 text-muted">{row.data}</td>
                    <td className="px-5 py-4 text-muted">{row.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </Section>

      {/* ── CTA ── */}
      <section className="bg-grad-dark relative overflow-hidden">
        <div className="weave absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-red/15 blur-3xl" />
        <div className="wrap relative py-16 text-center sm:py-20">
          <ShieldCheck className="mx-auto h-10 w-10 text-red" strokeWidth={1.7} />
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Let's specify the right security for your packaging
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">
            Send us your product, your markets and where duplication is hurting you. Our team will come
            back within one business day with a recommended combination.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={openQuote}
              className="rounded-full bg-grad-cta px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red/25 transition-transform hover:-translate-y-0.5"
            >
              {t.cta.quote}
            </button>
            <Link
              to={PATHS.contact}
              className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t.cta.getInTouch}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
