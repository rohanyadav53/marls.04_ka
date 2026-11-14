import { useState } from "react";
import { Plus } from "lucide-react";
import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import PageHero from "../components/PageHero";
import { Section } from "../components/ui";
import { CtaBand } from "../components/blocks";
import { PATHS } from "../i18n/navigation";

export default function Faqs() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <>
      <Seo title={t.faqs.hero.heading} description={t.faqs.hero.sub} path={PATHS.faqs} />
      <PageHero
        eyebrow={t.faqs.hero.eyebrow}
        title={t.faqs.hero.heading}
        sub={t.faqs.hero.sub}
        crumbs={[{ label: t.nav.faqs }]}
      />
      <Section bg="white">
        <div className="mx-auto max-w-3xl">
          {t.faqs.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-5 text-start"
                >
                  <span className="font-display text-base font-bold text-ink sm:text-lg">{item.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-blue transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-10 text-[0.95rem] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
