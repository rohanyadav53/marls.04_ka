import { Navigate, useParams } from "react-router-dom";
import { Check, Boxes } from "lucide-react";
import { useT } from "../../i18n/text";
import { Seo } from "../../components/Seo";
import PageHero from "../../components/PageHero";
import { Section, ImagePlaceholder, Button } from "../../components/ui";
import { FadeIn } from "../../components/Motion";
import { CtaBand } from "../../components/blocks";
import { INDUSTRIES, PATHS } from "../../i18n/navigation";

export default function IndustryDetail() {
  const t = useT();
  const { slug } = useParams();
  const entry = INDUSTRIES.find((i) => i.slug === slug);
  if (!entry) return <Navigate to={PATHS.industries} replace />;

  const item = t.industries.items[entry.id];
  const Icon = entry.icon;

  return (
    <>
      <Seo title={item.name} description={item.lead} path={`${PATHS.industries}/${entry.slug}`} />
      <PageHero
        eyebrow={t.nav.industries}
        title={item.name}
        sub={item.lead}
        crumbs={[{ label: t.nav.industries, to: PATHS.industries }, { label: item.name }]}
      />
      <Section bg="white">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue">
              <Icon className="h-7 w-7" />
            </span>
            <p className="mt-6 text-lg leading-relaxed text-muted">{item.body}</p>
            {"applications" in item && Array.isArray(item.applications) && (
              <>
                <h2 className="mt-8 font-display text-lg font-bold text-ink">{t.industries.appliesHeading}</h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {item.applications.map((a) => (
                    <li key={a} className="flex gap-2.5 text-sm font-medium text-ink/80">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-red" strokeWidth={2.4} />
                      {a}
                    </li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-8">
              <Button to={PATHS.products} variant="outline">{t.cta.allProducts}</Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <ImagePlaceholder ratio="4/3" icon={Boxes} caption={t.common.photoCaption} />
          </FadeIn>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
