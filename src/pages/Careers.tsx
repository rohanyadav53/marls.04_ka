import { useT } from "../i18n/text";
import { SITE } from "../i18n/site";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section, SectionHeading, Button } from "../components/ui";
import { FadeIn } from "../components/Motion";
import { CtaBand } from "../components/blocks";
import { PATHS } from "../i18n/navigation";

export default function Careers() {
  const t = useT();
  return (
    <>
      <Seo title={t.careers.hero.heading} description={t.careers.hero.sub} path={PATHS.careers} />
      <PageHero
        eyebrow={t.careers.hero.eyebrow}
        title={t.careers.hero.heading}
        sub={t.careers.hero.sub}
        crumbs={[{ label: t.nav.careers }]}
      />
      <Section bg="white">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <SectionHeading eyebrow={t.careers.hero.eyebrow} title={t.careers.perksHeading} align="start" />
            <p className="mt-5 leading-relaxed text-muted">{t.careers.intro}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.careers.perks.map((perk) => (
                <li key={perk} className="flex gap-2.5 text-sm font-medium text-ink/80">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red" />
                  {perk}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="rounded-3xl border border-line bg-surface p-8">
              <h3 className="font-display text-lg font-bold text-ink">{t.careers.openingsHeading}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted">{t.careers.openingsNote}</p>
              <div className="mt-6">
                <Button href={`mailto:${SITE.careersEmail}`} variant="primary">{t.cta.apply}</Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
