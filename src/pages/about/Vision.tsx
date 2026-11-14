import { Check, Target } from "lucide-react";
import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section, SectionHeading, ImagePlaceholder } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CtaBand } from "../../components/blocks";
import { PATHS } from "../../i18n/navigation";

export default function Vision() {
  const t = useT();
  return (
    <>
      <Seo title={t.about.vision.heading} path={PATHS.aboutVision} />
      <PageHero
        eyebrow={t.about.vision.eyebrow}
        title={t.about.vision.heading}
        crumbs={[{ label: t.nav.about, to: PATHS.about }, { label: t.navGroups.about.vision }]}
      />
      <Section bg="white">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <SectionHeading eyebrow={t.about.vision.eyebrow} title={t.about.vision.heading} align="start" />
            <p className="mt-5 leading-relaxed text-muted">{t.about.vision.body}</p>
            <ul className="mt-6 space-y-3">
              {t.about.vision.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm font-medium text-ink/80">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={2.4} />
                  {p}
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ImagePlaceholder ratio="4/3" icon={Target} caption={t.common.photoCaption} />
          </FadeIn>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
