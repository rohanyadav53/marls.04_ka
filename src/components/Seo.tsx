import { useEffect } from "react";
import { useT } from "../i18n/text";
import { SITE } from "../i18n/site";

function upsertMeta(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Per-page document head. Sets <title>, meta description, and canonical.
 * (Full hreflang alternates would require URL-based locales — a future step;
 * the site currently switches language client-side.)
 */
export function Seo({
  title,
  description,
  path = "",
}: {
  title?: string;
  description?: string;
  path?: string;
}) {
  const t = useT();
  useEffect(() => {
    document.title = title ? t.meta.titleTemplate.replace("%s", title) : t.meta.homeTitle;
    upsertMeta("description", description ?? t.meta.description);
    upsertCanonical(`${SITE.websiteUrl}${path}`);
  }, [title, description, path, t]);
  return null;
}
