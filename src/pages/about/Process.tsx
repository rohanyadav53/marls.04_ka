import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section } from "../../components/ui";
import { ProcessSteps, CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";

export default function Process() {
  const t = useT();
  return (
    <>
      <Seo title={t.about.process.heading} path={PATHS.aboutProcess} />
      <PageHero
        eyebrow={t.about.process.eyebrow}
        title={t.about.process.heading}
        sub={t.about.process.sub}
        crumbs={[{ label: t.nav.about, to: PATHS.about }, { label: t.navGroups.about.process }]}
      />
      <Section bg="white">
        <ProcessSteps />
      </Section>
      <CtaBand />
    </>
  );
}
