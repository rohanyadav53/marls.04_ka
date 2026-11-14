import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section } from "../../components/ui";
import { ValuesList, CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";

export default function Values() {
  const t = useT();
  return (
    <>
      <Seo title={t.about.values.heading} path={PATHS.aboutValues} />
      <PageHero
        eyebrow={t.about.values.eyebrow}
        title={t.about.values.heading}
        sub={t.about.values.sub}
        crumbs={[{ label: t.nav.about, to: PATHS.about }, { label: t.navGroups.about.values }]}
      />
      <Section bg="white">
        <ValuesList />
      </Section>
      <CtaBand />
    </>
  );
}
