import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import { Button, Section, SectionHeading } from "../components/ui";
import { FadeIn } from "../components/Motion";
import HeroSlider from "../components/HeroSlider";
import { StatsBand, ProductCards, IndustryCards, CertLogoStrip } from "../components/blocks";
import {
  ExecutiveSummary,
  FacilityStrip,
  FounderNote,
  OrganisationValues,
  ProcessTimeline,
  SustainabilityBand,
} from "../components/homeBlocks";
import { PATHS } from "../i18n/navigation";

export default function Home() {
  const t = useT();

  return (
    <>
      <Seo />

      {/* 1 — auto-advancing hero */}
      <HeroSlider />

      {/* 2 — headline numbers, lifted over the fold line */}
      <StatsBand overlap />

      {/* 3 — executive summary + the two business units */}
      <ExecutiveSummary />

      {/* 4 — what we make */}
      <Section bg="surface">
        <FadeIn>
          <SectionHeading
            eyebrow={t.home.products.eyebrow}
            title={t.home.products.heading}
            sub={t.home.products.body}
          />
        </FadeIn>
        <div className="mt-14">
          <ProductCards />
        </div>
        <div className="mt-10 text-center">
          <Button to={PATHS.products} variant="outline" icon={ArrowRight}>
            {t.cta.allProducts}
          </Button>
        </div>
      </Section>

      {/* 5 — organisation values */}
      <OrganisationValues />

      {/* 6 — five-step process */}
      <ProcessTimeline />

      {/* 7 — plant & machinery */}
      <FacilityStrip />

      {/* 8 — who we serve */}
      <Section bg="surface">
        <FadeIn>
          <SectionHeading
            eyebrow={t.home.industries.eyebrow}
            title={t.home.industries.heading}
            sub={t.home.industries.body}
          />
        </FadeIn>
        <div className="mt-14">
          <IndustryCards />
        </div>
        <div className="mt-10 text-center">
          <Button to={PATHS.industries} variant="outline" icon={ArrowRight}>
            {t.cta.allIndustries}
          </Button>
        </div>
      </Section>

      {/* 9 — sustainability */}
      <SustainabilityBand />

      {/* 10 — founder's note */}
      <FounderNote />

      {/* 11 — certifications */}
      <Section bg="white">
        <div className="flex flex-col items-center gap-6 rounded-3xl border border-line bg-surface p-8 text-center sm:p-10">
          <FadeIn>
            <SectionHeading eyebrow={t.home.certifications.eyebrow} title={t.home.certifications.heading} />
          </FadeIn>
          <FadeIn delay={0.08}>
            <CertLogoStrip />
          </FadeIn>
          <Link
            to={PATHS.certifications}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
          >
            {t.cta.learnMore}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
