import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PHOTOS } from "../data/photos";
import { useT } from "../i18n/text";
import { ABOUT_MENU, INDUSTRIES, PATHS, PRODUCT_MENU, industryPath } from "../i18n/navigation";

export type MegaType = "about" | "products" | "industries";

export function MegaPanel({ type, onNav }: { type: MegaType; onNav: () => void }) {
  if (type === "about") return <AboutPanel onNav={onNav} />;
  if (type === "products") return <ProductsPanel onNav={onNav} />;
  return <IndustriesPanel onNav={onNav} />;
}

function AboutPanel({ onNav }: { onNav: () => void }) {
  const t = useT();
  const f = t.navGroups.aboutFeature;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      {/* Every About destination, each with a one-line reason to click. */}
      <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
        {ABOUT_MENU.map(({ to, label, desc, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={onNav}
              className="group flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-surface"
            >
              {Icon && (
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue transition-colors group-hover:bg-blue group-hover:text-white">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-blue">
                  {label(t)}
                </span>
                {desc && <span className="mt-0.5 block text-[0.8rem] leading-snug text-muted">{desc(t)}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Featured: the plant. Desktop panel only — the mobile drawer is a narrow list. */}
      <Link
        to={PATHS.aboutInfrastructure}
        onClick={onNav}
        className="group relative hidden overflow-hidden rounded-2xl border border-line lg:block"
      >
        <img
          src={PHOTOS.facilityExterior}
          alt=""
          loading="lazy"
          className="h-full min-h-[15rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" aria-hidden="true" />
        <span className="absolute inset-x-0 bottom-0 p-5 text-white">
          <span className="eyebrow block text-white/70">{f.eyebrow}</span>
          <span className="mt-1.5 block font-display text-lg font-bold leading-snug">{f.title}</span>
          <span className="mt-1.5 block text-[0.8rem] leading-snug text-white/75">{f.body}</span>
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            {f.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </span>
      </Link>
    </div>
  );
}

function ProductsPanel({ onNav }: { onNav: () => void }) {
  const t = useT();
  return (
    <div className="mega-columns">
      {PRODUCT_MENU.map(({ to, title, items }, colIdx) => (
        <div
          key={to}
          className={`mega-col ${colIdx < PRODUCT_MENU.length - 1 ? "mega-col-divider" : ""}`}
        >
          <Link
            to={to}
            onClick={onNav}
            className="mb-3 block text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:text-blue"
          >
            {title(t)}
          </Link>
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href ?? (item.slug ? `/products/${item.slug}` : to)}
                  onClick={onNav}
                  className="block rounded-md px-2 py-1.5 text-[0.82rem] text-muted transition-colors hover:bg-surface hover:text-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function IndustriesPanel({ onNav }: { onNav: () => void }) {
  const t = useT();
  // Split industries into columns of ~3 each
  const colSize = Math.ceil(INDUSTRIES.length / 3);
  const cols = [
    INDUSTRIES.slice(0, colSize),
    INDUSTRIES.slice(colSize, colSize * 2),
    INDUSTRIES.slice(colSize * 2),
  ];

  return (
    <div className="mega-columns mega-columns--3">
      {cols.map((col, colIdx) => (
        <div
          key={colIdx}
          className={`mega-col ${colIdx < cols.length - 1 ? "mega-col-divider" : ""}`}
        >
          <ul className="space-y-0.5">
            {col.map(({ id, slug }) => (
              <li key={slug}>
                <Link
                  to={industryPath(slug)}
                  onClick={onNav}
                  className="block rounded-md px-2 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-surface hover:text-blue"
                >
                  {t.industries.items[id].name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="col-span-full mt-4 border-t border-line pt-3">
        <Link
          to={PATHS.industries}
          onClick={onNav}
          className="text-sm font-semibold text-blue hover:underline"
        >
          {t.cta.allIndustries} →
        </Link>
      </div>
    </div>
  );
}
