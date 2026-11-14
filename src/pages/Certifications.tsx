import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section, SectionHeading } from "../components/ui";
import { FadeIn } from "../components/Motion";
import { CertGrid, CtaBand } from "../components/blocks";
import { PATHS } from "../i18n/navigation";

export default function Certifications() {
  const t = useT();
  return (
    <>
      <Seo title={t.certifications.hero.heading} description={t.certifications.hero.sub} path={PATHS.certifications} />
      <PageHero
        eyebrow={t.certifications.hero.eyebrow}
        title={t.certifications.hero.heading}
        sub={t.certifications.hero.sub}
        crumbs={[{ label: t.nav.certifications }]}
      />
      <Section bg="surface">
        <FadeIn>
          <SectionHeading
            eyebrow={t.certifications.intro.eyebrow}
            title={t.certifications.intro.heading}
            sub={t.certifications.intro.sub}
          />
        </FadeIn>
        <div className="mt-14">
          <CertGrid />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
