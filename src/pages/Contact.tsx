import { Mail, MapPin, Phone, Globe, Linkedin, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "../i18n/text";
import { SITE } from "../i18n/site";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section } from "../components/ui";
import { FadeIn } from "../components/Motion";
import EnquiryForm from "../components/EnquiryForm";
import { PATHS } from "../i18n/navigation";

export default function Contact() {
  const t = useT();
  const L = t.contact.labels;

  const rows: { Icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { Icon: MapPin, label: L.address, value: SITE.addressLines.join(", ") },
    { Icon: Phone, label: L.phone, value: SITE.phone, href: SITE.phoneHref },
    { Icon: Mail, label: L.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: Send, label: L.exportEmail, value: SITE.exportEmail, href: `mailto:${SITE.exportEmail}` },
    { Icon: Globe, label: L.website, value: SITE.website, href: SITE.websiteUrl },
    { Icon: Linkedin, label: L.linkedin, value: SITE.linkedinHandle, href: SITE.linkedin },
  ];

  return (
    <>
      <Seo title={t.contact.hero.heading} description={t.contact.hero.sub} path={PATHS.contact} />
      <PageHero
        eyebrow={t.contact.hero.eyebrow}
        title={t.contact.hero.heading}
        sub={t.contact.hero.sub}
        crumbs={[{ label: t.nav.contact }]}
      />
      <Section bg="white">
        <div className="grid gap-10 lg:grid-cols-5">
          <FadeIn className="lg:col-span-2">
            <h2 className="font-display text-lg font-bold text-ink">{t.contact.detailsHeading}</h2>
            <ul className="mt-6 space-y-5">
              {rows.map(({ Icon, label, value, href }) => (
                <li key={label} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="eyebrow text-muted">{label}</div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-[0.95rem] font-medium text-ink/85 hover:text-blue"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-[0.95rem] font-medium text-ink/85">{value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-3">
            <div className="rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-9">
              <h2 className="mb-5 font-display text-lg font-bold text-ink">{t.contact.form.heading}</h2>
              <EnquiryForm source="Contact Page" />
            </div>
          </FadeIn>
        </div>
      </Section>

      <section aria-label={t.contact.mapHeading}>
        <iframe
          title={t.contact.mapHeading}
          src={SITE.mapEmbedUrl}
          className="h-[22rem] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
