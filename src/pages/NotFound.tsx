import { useT } from "../i18n/text";
import { Seo } from "../components/Seo";
import { Button, Peak } from "../components/ui";
import { PATHS } from "../i18n/navigation";

export default function NotFound() {
  const t = useT();
  return (
    <>
      <Seo title={t.notFound.title} />
      <section className="bg-grad-hero relative overflow-hidden">
        <div className="weave absolute inset-0 opacity-60" />
        <div className="wrap relative flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
          <Peak className="h-8 w-20 text-[#ff8a82]" />
          <p className="eyebrow mt-6 text-white/60">404</p>
          <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">{t.notFound.title}</h1>
          <p className="mt-4 max-w-md text-white/70">{t.notFound.body}</p>
          <div className="mt-8">
            <Button to={PATHS.home} variant="light">{t.cta.backHome}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
