import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Factory,
  Milestone,
  Heart,
  Workflow,
  Quote,
  Target,
  Layers,
  SlidersHorizontal,
  ShieldCheck,
  Wheat,
  PawPrint,
  Sprout,
  FlaskConical,
  SprayCan,
  Gem,
  Tag,
} from "lucide-react";
import type { Dict } from "./locales/en";
import { WovenSackIcon } from "../components/icons";

export const PATHS = {
  home: "/",
  about: "/about",
  aboutJourney: "/about#journey",
  aboutInfrastructure: "/about/infrastructure",
  aboutValues: "/about/values",
  aboutProcess: "/about/process",
  aboutFounder: "/about/founder",
  aboutVision: "/about/vision",
  products: "/products",
  // The three category landing pages are retired: /products lists every group,
  // so these are anchors into it rather than routes of their own. The old
  // literal paths redirect (see routes.tsx). Values must match the `id` of the
  // matching entry in GROUPS (src/pages/products/Products.tsx).
  woven: "/products#woven",
  flexible: "/products#flexible",
  addOns: "/products#addons",
  industries: "/industry-solutions",
  // The eco page. There is no separate /sustainability page any more — that
  // route (and the old /recyclable one) redirect here.
  recyclable: "/i-am-recyclable",
  packagingSecurity: "/packaging-security",
  certifications: "/certifications",
  careers: "/careers",
  contact: "/contact",
  faqs: "/faqs",
  privacy: "/privacy-policy",
  terms: "/terms",
} as const;

export const industryPath = (slug: string) => `/industry-solutions/${slug}`;

// Brochure is a file download, not a route.
export const SITE_BROCHURE = "/brochure/Marlsboro-Company-Profile.pdf";

export type Label = (t: Dict) => string;
export type ProductId = keyof Dict["products"]["categories"];
export type IndustryId = keyof Dict["industries"]["items"];

export type MenuLink = { to: string; label: Label; icon?: LucideIcon; desc?: Label };

// ---- Header primary nav (mega keys drive the dropdown panels) ----
// `accent` flags a link the Header renders in bold colour instead of ink:
// "green" for the eco page, "red" for the packaging-security page.
export const PRIMARY_NAV: {
  label: Label;
  to: string;
  mega?: "about" | "products" | "industries";
  accent?: "green" | "red";
}[] = [
  { label: (t) => t.nav.about, to: PATHS.about, mega: "about" },
  { label: (t) => t.nav.products, to: PATHS.products, mega: "products" },
  { label: (t) => t.nav.industries, to: PATHS.industries, mega: "industries" },
  { label: (t) => t.nav.packagingSecurity, to: PATHS.packagingSecurity, accent: "red" },
  { label: (t) => t.nav.recyclable, to: PATHS.recyclable, accent: "green" },
  { label: (t) => t.nav.certifications, to: PATHS.certifications },
  { label: (t) => t.nav.contact, to: PATHS.contact },
];

// Order is the order a visitor reads the company in: who we are → how we got
// here → what we run → how we behave → how we work → who leads → where next.
export const ABOUT_MENU: MenuLink[] = [
  { to: PATHS.about, label: (t) => t.navGroups.about.aboutUs, desc: (t) => t.navGroups.aboutDesc.aboutUs, icon: Building2 },
  { to: PATHS.aboutJourney, label: (t) => t.navGroups.about.journey, desc: (t) => t.navGroups.aboutDesc.journey, icon: Milestone },
  { to: PATHS.aboutInfrastructure, label: (t) => t.navGroups.about.infrastructure, desc: (t) => t.navGroups.aboutDesc.infrastructure, icon: Factory },
  { to: PATHS.aboutValues, label: (t) => t.navGroups.about.values, desc: (t) => t.navGroups.aboutDesc.values, icon: Heart },
  { to: PATHS.aboutProcess, label: (t) => t.navGroups.about.process, desc: (t) => t.navGroups.aboutDesc.process, icon: Workflow },
  { to: PATHS.aboutFounder, label: (t) => t.navGroups.about.founder, desc: (t) => t.navGroups.aboutDesc.founder, icon: Quote },
  { to: PATHS.aboutVision, label: (t) => t.navGroups.about.vision, desc: (t) => t.navGroups.aboutDesc.vision, icon: Target },
];

// ---- Product categories (overview cards + detail routes + mega columns) ----
export const PRODUCT_CATEGORIES: { id: ProductId; to: string; icon: LucideIcon }[] = [
  { id: "woven-bags", to: PATHS.woven, icon: WovenSackIcon },
  { id: "flexible-packaging", to: PATHS.flexible, icon: Layers },
  { id: "add-ons", to: PATHS.addOns, icon: SlidersHorizontal },
  // Same card as before, now pointing at the standalone Packaging Security
  // page instead of the retired /products/security-features category.
  { id: "security-features", to: PATHS.packagingSecurity, icon: ShieldCheck },
];

// Mega-menu columns. Items with a `slug` link to their /products/:slug detail
// page; an explicit `href` wins over both (used for in-page anchors); the rest
// link to the category page until they get a catalog entry.
// Names stay literal in every language. `featured` items are highlighted.
export type MegaItem = { label: string; slug?: string; href?: string; featured?: boolean };
export const PRODUCT_MENU: {
  to: string;
  icon?: LucideIcon;
  title: (t: Dict) => string;
  items: MegaItem[];
}[] = [
  {
    to: PATHS.woven,
    icon: WovenSackIcon,
    title: (t) => t.navGroups.productCols.woven,
    items: [
      { label: "PP Woven Bags", slug: "pp-woven-bags" },
      { label: "Coated / Uncoated Fabrics", slug: "coated-uncoated-fabrics" },
      { label: "BOPP EZ-Open Bags", slug: "bopp-ez-open-bags" },
      { label: "BOPP Pinch Bottom Bags", slug: "bopp-pinch-bottom-bags" },
      { label: "PLWPP Block Bottom Bags", slug: "plwpp-block-bottom-bags" },
      { label: "PLWPP Carry Bags", slug: "plwpp-carry-bags" },
    ],
  },
  {
    to: PATHS.flexible,
    icon: Layers,
    title: (t) => t.navGroups.productCols.flexible,
    items: [
      { label: "Multilayer Rolls", slug: "multilayer-rolls" },
      { label: "Multilayer Pouches", slug: "multilayer-pouches" },
      { label: "Liquid Packaging Pouches", slug: "liquid-packaging-pouches" },
      { label: "Spout Pouches", slug: "spout-pouches" },
      { label: "Side-Seal Pouches", slug: "side-seal-pouches" },
      { label: "4-Side-Seal Pouches", slug: "4-side-seal-pouches" },
      { label: "D-Cut Pouches", slug: "d-cut-pouches" },
      { label: "Stand-Up Pouches", slug: "stand-up-pouches" },
      { label: "Zipper Pouches", slug: "zipper-pouches" },
      { label: "Up to 4-Layer", slug: "up-to-4-layer" },
    ],
  },
  {
    to: PATHS.addOns,
    icon: SlidersHorizontal,
    title: (t) => t.navGroups.productCols.addons,
    items: [
      { label: "Perforation", slug: "perforation" },
      { label: "Liner", slug: "liner" },
      { label: "Window View", slug: "window-view" },
      { label: "Holography", slug: "holography" },
      { label: "Gusset", slug: "gusset" },
      { label: "Pallet Packaging", slug: "pallet-packaging" },
      { label: "Backseam", slug: "backseam" },
      { label: "Zipper Closures", slug: "zipper-closures", featured: true },
      { label: "D-Cut Handles", slug: "d-cut-handles", featured: true },
    ],
  },
  {
    // The old five /products/* security pages are gone; this column now points
    // at the three technology sections of the Packaging Security page.
    to: PATHS.packagingSecurity,
    icon: ShieldCheck,
    title: (t) => t.nav.packagingSecurity,
    items: [
      { label: "Holographic Hot Stamping", href: `${PATHS.packagingSecurity}#holographic` },
      { label: "Barcode", href: `${PATHS.packagingSecurity}#barcode` },
      { label: "QR Code", href: `${PATHS.packagingSecurity}#qr-code` },
    ],
  },
];

// ---- Industries (overview cards + /industries/:slug + mega-menu) ----
export const INDUSTRIES: { id: IndustryId; slug: string; icon: LucideIcon }[] = [
  { id: "food-agriculture", slug: "food-agriculture", icon: Wheat },
  { id: "animal-pet", slug: "animal-pet-nutrition", icon: PawPrint },
  { id: "agri-crop", slug: "agriculture-crop-protection", icon: Sprout },
  { id: "chemicals-industrial", slug: "chemicals-industrial", icon: FlaskConical },
  { id: "home-care", slug: "home-care", icon: SprayCan },
  { id: "construction-building", slug: "construction-building", icon: Building2 },
  { id: "mining-energy", slug: "mining-energy", icon: Gem },
  { id: "retail-packaging", slug: "retail-packaging", icon: Tag },
];

export const FOOTER_EXPLORE: MenuLink[] = [
  { to: PATHS.products, label: (t) => t.nav.products },
  { to: PATHS.industries, label: (t) => t.nav.industries },
  { to: PATHS.about, label: (t) => t.nav.about },
  { to: PATHS.aboutInfrastructure, label: (t) => t.navGroups.about.infrastructure },
  { to: PATHS.contact, label: (t) => t.nav.contact },
];

export const FOOTER_LINKS: MenuLink[] = [
  { to: SITE_BROCHURE, label: (t) => t.footer.links.brochure },
  { to: PATHS.careers, label: (t) => t.footer.links.careers },
  { to: PATHS.certifications, label: (t) => t.footer.links.certifications },
  { to: PATHS.recyclable, label: (t) => t.footer.links.sustainability },
  { to: PATHS.faqs, label: (t) => t.footer.links.faqs },
  { to: PATHS.privacy, label: (t) => t.footer.links.privacy },
  { to: PATHS.terms, label: (t) => t.footer.links.terms },
];
