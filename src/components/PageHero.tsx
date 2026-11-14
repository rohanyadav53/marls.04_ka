import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useT } from "../i18n/text";
import { PATHS } from "../i18n/navigation";

type Crumb = { label: string; to?: string };

export default function PageHero({
  eyebrow,
  title,
  sub,
  crumbs = [],
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  crumbs?: Crumb[];
}) {
  const t = useT();
  return (
    <section className="bg-grad-hero relative overflow-hidden">
      <div className="weave weave-drift absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-red/20 blur-3xl" />
      <div className="wrap relative py-16 sm:py-20">
        <span className="mb-4 block h-0.5 w-10 rounded bg-red" />
        <p className="eyebrow flex items-center gap-2.5" style={{ color: "#ff8a82" }}>
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {sub && <p className="mt-4 max-w-2xl text-lg text-white/70">{sub}</p>}

        <nav aria-label="Breadcrumb" className="mt-6 flex flex-wrap items-center gap-1.5 text-sm text-white/55">
          <Link to={PATHS.home} className="hover:text-white">{t.common.breadcrumbHome}</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-4 w-4" />
              {c.to ? (
                <Link to={c.to} className="hover:text-white">{c.label}</Link>
              ) : (
                <span className="text-white/80">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </section>
  );
}
