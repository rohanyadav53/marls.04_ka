import { Quote } from "lucide-react";
import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section, Peak } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";
import { SITE } from "../../i18n/site";

export default function Founder() {
  const t = useT();
  const f = t.about.founder;

  return (
    <>
      <Seo title={f.heading} path={PATHS.aboutFounder} />
      <PageHero
        eyebrow={f.eyebrow}
        title={f.heading}
        crumbs={[{ label: t.nav.about, to: PATHS.about }, { label: t.navGroups.about.founder }]}
      />

      <Section bg="white">
        <FadeIn>
          <figure className="mx-auto max-w-3xl rounded-3xl border border-line bg-surface p-8 sm:p-12">
            <Quote className="h-10 w-10 text-red" strokeWidth={1.6} />

            <p className="mt-6 font-display text-xl font-bold text-ink sm:text-2xl">{f.greeting}</p>

            <blockquote className="mt-5 space-y-5 text-[1.05rem] leading-relaxed text-muted">
              {f.paras.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </blockquote>

            <p className="mt-6 font-medium text-ink">{f.closing}</p>

            <figcaption className="mt-8 border-t border-line pt-6">
              <Peak className="h-4 w-12 text-red/40" />
              <p className="mt-3 font-display text-base font-bold text-ink">{SITE.founder}</p>
              <p className="eyebrow mt-1 text-muted">
                {f.role} · {SITE.brand}
              </p>
            </figcaption>
          </figure>
        </FadeIn>
      </Section>

      <CtaBand />
    </>
  );
}
