/* Website translation — Google Website Translator, free, no API key.
 *
 * The site is authored in English only (`locales/en.ts`). Visitors who pick
 * another language get the whole rendered page translated in-browser by
 * Google's translate element. We do NOT show Google's own widget or banner:
 * `LanguageMenu` is our UI, and it drives the hidden widget underneath.
 *
 * How the pieces fit
 *   1. `loadTranslator()` injects Google's script once; it builds a hidden
 *      <select class="goog-te-combo"> inside #google_translate_element.
 *   2. Choosing a language sets that <select> (or, on first load, the
 *      `googtrans` cookie the widget reads on start-up) and the widget
 *      translates the live DOM — including pages navigated to afterwards.
 *   3. The cookie is the persisted choice; `getActiveLanguage()` reads it.
 *
 * Why not Azure Translator? It needs an API key + a server-side proxy to keep
 * that key private, and has a metered free tier. This needs neither. If a
 * keyed, cacheable, SEO-visible translation is ever wanted, that is a
 * separate (server-rendered) project, not a drop-in for this.
 *
 * Known limits of any client-side translate widget: brand/technical names
 * inside running text can be rewritten (mitigated with translate="no" where we
 * control the markup), and search engines index the English source only.
 */

export type LangCode =
  | "en" | "hi" | "gu" | "mr" | "bn" | "ta" | "te" | "ar"
  | "fr" | "es" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "id";

export type Language = {
  code: LangCode;
  /** Code Google's widget uses (differs only for Chinese). */
  google: string;
  label: string;
  name: string;
};

// Export-market languages first after English, then regional Indian languages.
export const LANGUAGES: Language[] = [
  { code: "en", google: "en", label: "EN", name: "English" },
  { code: "hi", google: "hi", label: "हि", name: "हिन्दी" },
  { code: "gu", google: "gu", label: "ગુ", name: "ગુજરાતી" },
  { code: "mr", google: "mr", label: "मर", name: "मराठी" },
  { code: "bn", google: "bn", label: "বা", name: "বাংলা" },
  { code: "ta", google: "ta", label: "த", name: "தமிழ்" },
  { code: "te", google: "te", label: "తె", name: "తెలుగు" },
  { code: "ar", google: "ar", label: "ع", name: "العربية" },
  { code: "fr", google: "fr", label: "FR", name: "Français" },
  { code: "es", google: "es", label: "ES", name: "Español" },
  { code: "de", google: "de", label: "DE", name: "Deutsch" },
  { code: "it", google: "it", label: "IT", name: "Italiano" },
  { code: "pt", google: "pt", label: "PT", name: "Português" },
  { code: "ru", google: "ru", label: "RU", name: "Русский" },
  { code: "zh", google: "zh-CN", label: "中", name: "中文" },
  { code: "ja", google: "ja", label: "日", name: "日本語" },
  { code: "id", google: "id", label: "ID", name: "Indonesia" },
];

const SOURCE = "en";
const CONTAINER_ID = "google_translate_element";
const SCRIPT_ID = "google-translate-script";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          opts: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
          id: string,
        ) => unknown;
      };
    };
  }
}

/* ---- DOM guards -------------------------------------------------------
 * Google's translator replaces text nodes with <font> wrappers underneath
 * React. When React then tries to remove or re-order a node it still holds a
 * reference to, the browser throws NotFoundError and the app white-screens.
 * These two guards make those calls no-ops when the node has already been
 * moved — the standard workaround (facebook/react#11538). Installed once,
 * before React renders. */
let guarded = false;
export function installDomGuards(): void {
  if (guarded || typeof Node === "undefined") return;
  guarded = true;

  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) return child;
    return removeChild.call(this, child) as T;
  };

  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, node: T, ref: Node | null): T {
    if (ref && ref.parentNode !== this) return node;
    return insertBefore.call(this, node, ref) as T;
  };
}

/* ---- cookie (the persisted choice) ------------------------------------ */
function cookieHosts(): (string | undefined)[] {
  const host = window.location.hostname;
  // The widget writes the cookie on the bare host and on the dotted parent,
  // so both must be set / cleared or a stale one wins.
  return [undefined, host, `.${host}`];
}

function writeCookie(value: string | null): void {
  for (const domain of cookieHosts()) {
    const parts = [
      `googtrans=${value ?? ""}`,
      "path=/",
      value === null ? "expires=Thu, 01 Jan 1970 00:00:00 GMT" : "max-age=31536000",
    ];
    if (domain) parts.push(`domain=${domain}`);
    document.cookie = parts.join("; ");
  }
}

export function getActiveLanguage(): LangCode {
  if (typeof document === "undefined") return "en";
  const m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
  if (!m) return "en";
  const g = decodeURIComponent(m[1]);
  return LANGUAGES.find((l) => l.google === g)?.code ?? "en";
}

/* ---- widget ----------------------------------------------------------- */
let loading = false;
export function loadTranslator(): void {
  if (loading || typeof document === "undefined") return;
  loading = true;

  // Nothing to translate while the visitor is reading English: don't pull a
  // third-party script on every first paint. It loads the first time a
  // language is chosen, or immediately when a previous choice is remembered.
  if (getActiveLanguage() === "en") {
    loading = false;
    return;
  }
  injectScript();
}

function injectScript(): void {
  if (document.getElementById(SCRIPT_ID)) return;
  window.googleTranslateElementInit = () => {
    if (!window.google) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: SOURCE,
        includedLanguages: LANGUAGES.filter((l) => l.code !== "en")
          .map((l) => l.google)
          .join(","),
        autoDisplay: false,
      },
      CONTAINER_ID,
    );
  };
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(s);
}

function combo(): HTMLSelectElement | null {
  return document.querySelector<HTMLSelectElement>(`#${CONTAINER_ID} select.goog-te-combo`);
}

/** Switch the page language. Returns once the request is made (not completed). */
export function setLanguage(code: LangCode): void {
  const lang = LANGUAGES.find((l) => l.code === code);
  if (!lang) return;

  if (code === "en") {
    // Google offers no clean "undo" on a live page; dropping the cookie and
    // reloading restores the untouched English DOM reliably.
    writeCookie(null);
    window.location.reload();
    return;
  }

  writeCookie(`/${SOURCE}/${lang.google}`);

  const select = combo();
  if (select) {
    select.value = lang.google;
    select.dispatchEvent(new Event("change"));
    return;
  }

  // Widget not loaded yet (first choice this visit). The cookie is already
  // written; on reload `loadTranslator()` sees it, pulls the script, and the
  // widget translates from a clean DOM.
  window.location.reload();
}
