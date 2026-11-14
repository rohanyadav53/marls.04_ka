import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section } from "../components/ui";

export default function LegalPage({ kind, path }: { kind: "privacy" | "terms"; path: string }) {
  const t = useT();
  const data = t.legal[kind];
  return (
    <>
      <Seo title={data.title} path={path} />
      <PageHero eyebrow="Legal" title={data.title} crumbs={[{ label: data.title }]} />
      <Section bg="white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-muted">
            {data.updated}
          </p>
          <div className="space-y-4">
            {data.body.map((para, i) => (
              <p key={i} className="leading-relaxed text-ink/75">
                {para}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
